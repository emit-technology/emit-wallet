import * as React from 'react';
import {IonAlert, IonContent, IonLoading, IonToast} from "@ionic/react";
import {DeviceInfo, DriverInfo} from "../../contract/epoch/sero/types";
import ConfirmTransaction from "../ConfirmTransaction";
import {Transaction} from "../../types";
import {ChainType} from "@emit-technology/emit-lib";
import BigNumber from "bignumber.js";
import * as utils from "../../utils";
import {createDeflateRaw} from "zlib";
import walletWorker from "../../worker/walletWorker";
import epochNameService from "../../contract/epoch/sero/name";
import {MinerScenes} from "../../pages/epoch/miner";
import {type} from "os";
import rpc from "../../rpc";

interface Props {
    show: boolean
    onDidDismiss: (f: boolean) => void
    device?: DeviceInfo
    driver?: DriverInfo
    scenes?:MinerScenes
    defaultName?:string
    update?:()=>void;
}

interface State{
    tx: any
    showToast: boolean
    toastMessage?: string
    color?: string
    showLoading: boolean
    showAlert:boolean
}

class ModifyName extends React.Component<Props, State> {

    state:State = {
        tx:{},
        showToast:false,
        showLoading:false,
        showAlert:false
    }

    submit = async (name:string)=>{
        const {device,driver,scenes} = this.props;
        const currency= "LIGHT"
        const account = await walletWorker.accountInfo();
        let tx: Transaction | any = {
            from: account.addresses && account.addresses[ChainType.SERO],
            to: epochNameService.address,
            cy: currency,
            gasPrice: "0x" + new BigNumber(1).multipliedBy(1e9).toString(16),
            chain: ChainType.SERO,
            amount: "0x0",
            feeCy: currency,
            value: "0x0",
        }
        if(device){
            tx.data = await epochNameService.setDeviceName(name)
            tx.catg = device.category
            tx.tkt = device.ticket
            tx.tickets = [{
                Category: device.category,
                Value: device.ticket
            }]
        }else if(driver && scenes){
            tx.data = await epochNameService.setDriverName(scenes,name)
        }
        if(!tx.data){
            this.setShowToast(true,"danger","Not select device or driver!")
            return;
        }

        tx.gas = await epochNameService.estimateGas(tx)
        if (tx.gas && tx.gasPrice) {
            tx.feeValue = await epochNameService.tokenRate(tx.gasPrice, tx.gas);
        }
        this.setState({
            tx:tx,
            showAlert:true
        })
    }

    setShowToast = (f: boolean, color?: string, m?: string) => {
        this.setState({
            showToast: f,
            toastMessage: m,
            color: color
        })
    }

    setShowLoading = (f:boolean)=>{
        this.setState({
            showLoading:f
        })
    }

    setShowAlert = (f:boolean)=>{
        this.setState({
            showAlert:f
        })
    }

    confirm = async (hash: string) => {
        let intervalId: any = 0;
        const chain = ChainType.SERO;
        this.setShowLoading(true)
        intervalId = setInterval(() => {
            rpc.getTransactionByHash(hash,chain).then((rest:any) => {
                if (rest && new BigNumber(rest.blockNumber).toNumber() > 0) {
                    // this.setShowToast(true,"success","Commit Successfully!")
                    clearInterval(intervalId);
                    // url.transactionInfo(chain,hash,Currency);
                    this.setShowLoading(false)
                    if(this.props.update){
                        this.props.update()
                    }
                }
            }).catch(e => {
                console.error(e)
            })
        }, 3000)
        this.setShowAlert(false)
        this.setState({
            tx: {},
        })
    }


    render() {
        const {show, driver, device,defaultName,scenes} = this.props;
        const {color,toastMessage,showToast,showLoading,showAlert,tx} = this.state;

        const desc = driver && scenes ? `SET DRIVER NAME`:"SET DEVICE NAME"
        return <>

            <IonAlert mode="ios"
                isOpen={show}
                onDidDismiss={() => this.props.onDidDismiss(false)}
                header={desc}
                subHeader={driver && scenes ?`${MinerScenes[scenes].toUpperCase()} SCENES`: device && device.category && utils.ellipsisStr(device.ticket)}
                inputs={[
                    {
                        name: 'name',
                        type: 'text',
                        placeholder: 'Please input',
                        value:defaultName,
                        attributes:{
                            autocomplete:"off",
                            autofocus:true,
                        }
                    }
                ]}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: () => {
                            console.log('Confirm Cancel');
                        }
                    },
                    {
                        text: 'Ok',
                        handler: (v) => {
                            let value = v["name"];
                            if(!value){
                                return;
                            }
                            value = value.trim()
                            const reg = new RegExp("^[\u0000-\u00FF]+$");
                            const regEmoj= new RegExp(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g);
                            if(!reg.test(utils.Trim(value)) && !regEmoj.test(utils.Trim(value))){
                                this.setShowToast(true,"warning",`The name [${value}] is invalid !`)
                                return
                            }
                            if(utils.toBytes(value).length > 32){
                                this.setShowToast(true,"warning","The length of the name exceeds 32 !")
                                return
                            }

                            this.setShowLoading(true)
                            this.submit(value).then(()=>{
                                this.setShowLoading(false)
                            }).catch((e:any)=>{
                                this.setShowLoading(false)
                                console.error(e)
                                const err = typeof e == "string"?e:e.message;
                                this.setShowToast(true,"danger",err)
                            })
                            console.log('Confirm Ok');
                        }
                    }
                ]}
            />

            <IonToast
                color={!color ? "warning" : color}
                position="top"
                isOpen={showToast}
                onDidDismiss={() => this.setShowToast(false)}
                message={toastMessage}
                duration={2500}
                mode="ios"
            />


            <IonLoading
                mode="ios"
                spinner={"bubbles"}
                cssClass='my-custom-class'
                isOpen={showLoading}

                onDidDismiss={() => this.setShowLoading(false)}
                message={'Please wait...'}
                duration={120000}
            />

            <ConfirmTransaction show={showAlert} transaction={tx} onProcess={(f) => {
            }} onCancel={() => this.setShowAlert(false)} onOK={this.confirm}/>

        </>;
    }
}

export default ModifyName