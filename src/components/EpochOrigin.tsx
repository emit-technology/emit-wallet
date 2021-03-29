import * as React from 'react';
import {
    IonButton,
    IonChip, IonCol, IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonList, IonLoading,IonSegment,IonSegmentButton,
    IonModal,IonText,
    IonRow,
    IonSelect,
    IonSelectOption, IonToast,IonCheckbox
} from "@ionic/react";
import ConfirmTransaction from "./ConfirmTransaction";
import epochService from "../contract/epoch/sero";
import {MinerScenes, MintData} from "../pages/epoch/miner";
import {AccountModel, ChainType, Transaction} from "../types";
import BigNumber from "bignumber.js";
import * as utils from "../utils";
import rpc from "../rpc";
import {DeviceInfo, UserInfo} from "../contract/epoch/sero/types";
import Countdown from 'react-countdown';

interface State {
    amount: any
    showAlert: boolean
    tx: any
    showToast: boolean
    toastMessage?: string
    color?: string
    selectAxe: string
    checked:boolean
    showLoading: boolean
}

interface Props {
    tkt: Array<any>
    mintData: MintData
    userInfo?: UserInfo
    device?: DeviceInfo
    showModal: boolean
    account?: AccountModel
    callback: () => void
    setShowModal: (f: boolean) => void
    scenes: MinerScenes
}

const Currency = "LIGHT";
const Category = "EMIT_AX";

class EpochOrigin extends React.Component<Props, State> {


    state: State = {
        amount: "0",
        showAlert: false,
        tx: {},
        showToast: false,
        selectAxe: "",
        checked:false,
        showLoading:false
    }

    done = async () => {
        this.setShowLoading(true)
        const data = await epochService.done(this.props.scenes)
        await this.do(data)
    }

    prepare = async () => {
        const {mintData} = this.props;
        this.setShowLoading(true)
        if (mintData.nonce) {
            const data = await epochService.prepare(this.props.scenes, mintData.nonce)
            await this.do(data)
        }
    }

    do = async (data: string) => {
        const {account,mintData,device} = this.props;
        const {amount, selectAxe,checked} = this.state;
        if(mintData.scenes == MinerScenes.chaos && !selectAxe && !checked  && !device?.category){
            return Promise.reject("Please Select Axe")
        }
        if (account) {
            let tx: Transaction | any = {
                from: account.addresses && account.addresses[ChainType.SERO],
                to: epochService.address,
                cy: Currency,
                gasPrice: "0x" + new BigNumber(1).multipliedBy(1e9).toString(16),
                chain: ChainType.SERO,
                amount: "0x0",
                feeCy: "SERO",
                value: utils.toHex(amount, 18),
                data: data,
            }
            if (!checked && selectAxe) {
                tx.catg = Category
                tx.tkt = selectAxe
                tx.tickets= [{
                    Category: Category,
                    Value: selectAxe
                }]
            }
            tx.gas = await epochService.estimateGas(tx)
            if (tx.gas && tx.gasPrice) {
                tx.feeValue = new BigNumber(tx.gas).multipliedBy(new BigNumber(tx.gasPrice)).toString(10)
            }
            this.setState({
                tx: tx,
                showAlert: true
            })
            this.setShowLoading(false)
            this.props.setShowModal(false)
        }

    }

    setShowAlert = (f: boolean) => {
        this.setState({
            showAlert: f
        })
    }

    confirm = async (hash: string) => {
        let intervalId: any = 0;
        const chain = ChainType.SERO;
        this.setShowLoading(true)
        intervalId = setInterval(() => {
            rpc.getTxInfo(chain, hash).then((rest) => {
                console.log("getTxInfo>>> ",rest)
                if (rest && rest.num>0) {
                    // this.setShowToast(true,"success","Commit Successfully!")
                    clearInterval(intervalId);
                    // url.transactionInfo(chain,hash,Currency);
                    this.setShowLoading(false)
                    this.props.callback();
                }
            }).catch(e => {
                console.error(e)
            })
        }, 3000)
        this.setShowAlert(false)
    }

    setShowToast = (f: boolean, color?: string, m?: string) => {
        this.setState({
            showToast: f,
            toastMessage: m,
            color: color
        })
    }

    setShowLoading = (f: boolean) => {
        this.setState({
            showLoading:f
        })
    }

    setOperate = (v:string) =>{
        this.setState({
            checked: v == "stop"
        })
    }

    // @ts-ignore
    renderer = ({ hours, minutes, seconds,completed }) => {
        if(completed){
            return <span>Commit</span>
        }
        return <div className="countdown">{hours}:{minutes}:{seconds}</div>;
    };



    render() {
        const {showModal, mintData, device, userInfo, setShowModal, tkt} = this.props;
        const {showAlert, tx, toastMessage,showLoading, color, showToast, selectAxe,checked,amount} = this.state;

        const nextPeriodTime = ((userInfo? new BigNumber(userInfo.lastUpdateTime).toNumber():0)+210)*1000;

        return <>

            <IonModal
                isOpen={showModal}
                cssClass='epoch-modal'
                swipeToClose={true}
                onDidDismiss={() => this.props.setShowModal(false)}>
                <div className="epoch-md">
                    <div>
                        <div className="modal-header">Settlement</div>
                        {/*<div className="close" onClick={() => {*/}
                        {/*    this.props.setShowModal(false)*/}
                        {/*}}>X*/}
                        {/*</div>*/}
                    </div>
                    <IonList>
                        {/*<IonItem>*/}
                        {/*    <IonLabel>Current Period</IonLabel>*/}
                        {/*    <IonChip color="primary" className="font-weight-800">{userInfo && userInfo.currentPeriod}</IonChip>*/}
                        {/*</IonItem>*/}
                        {/*<IonItem>*/}
                        {/*    <IonLabel>Settlement Period</IonLabel>*/}
                        {/*    <IonChip color="primary" className="font-weight-800">{userInfo && userInfo.settlementPeriod}</IonChip>*/}
                        {/*</IonItem>*/}
                        {/*Refining*/}

                        {
                            device && device.category &&
                            <div style={{padding:"12px"}}>
                                <IonRow>
                                    <IonCol size="1"></IonCol>
                                    <IonCol>
                                        <IonSegment mode="ios" onIonChange={(e:any) => this.setOperate(e.detail.value)} value={checked?"stop":"refining"}>
                                            <IonSegmentButton value="refining">
                                                <IonLabel>{mintData.scenes == MinerScenes.altar?"Forge":"Mint"}</IonLabel>
                                            </IonSegmentButton>
                                            <IonSegmentButton value="stop">
                                                <IonLabel>Stop</IonLabel>
                                            </IonSegmentButton>
                                        </IonSegment>
                                    </IonCol>
                                    <IonCol size="1"></IonCol>
                                </IonRow>
                            </div>
                        }
                        {
                            !checked && <IonItem>
                                <IonLabel>NE</IonLabel>
                                <IonChip color="tertiary" className="font-weight-800">{mintData && mintData.ne}</IonChip>
                            </IonItem>
                        }
                        {
                            !checked && <IonItem>
                                <IonLabel>Change AXE</IonLabel>
                                <IonSelect mode="ios" value={selectAxe} onIonChange={(e: any) => {
                                    this.setState({
                                        selectAxe: e.detail.value
                                    })
                                }
                                }>
                                    {
                                        MinerScenes.altar == mintData.scenes && <IonSelectOption value={""}>{
                                            device && device.category?"Not Change":"New Axe"
                                        }</IonSelectOption>
                                    }
                                    {
                                        tkt && tkt.map(value => {
                                            return <IonSelectOption value={value.tokenId}>{value.tokenId}</IonSelectOption>
                                        })
                                    }
                                </IonSelect>
                            </IonItem>
                        }
                        {
                            mintData.scenes == MinerScenes.altar && !checked && <IonItem>
                                <IonLabel position="stacked">Deposit NE with LIGHT</IonLabel>
                                <IonInput placeholder="0" onIonChange={(v) => {
                                    console.log(v)
                                    this.setState({
                                        amount: v.detail.value
                                    })
                                }}/>
                            </IonItem>
                        }
                    </IonList>
                    <div className="epoch-desc">
                        <div className="ctx">
                            <div>
                                <p>1. The total period is <IonText color="primary" className="font-weight-800">{userInfo && userInfo.currentPeriod}</IonText>, and your settlement period is <IonText color="primary" className="font-weight-800">{userInfo && userInfo.settlementPeriod}</IonText></p>
                                <p>2. You can commit when the total period greater than or equal to settlement period.</p>
                                <p>3. The total period will changed at {new Date(nextPeriodTime).toLocaleString()}</p>
                                {
                                    device && device.category &&
                                    <p>4. {checked?<IonText color="danger">You are stopping {mintData.scenes == MinerScenes.altar?"Forge":"Mint"} ,and the axe will returned to your wallet account!</IonText>:<IonText color="warning">Your axe will continue to {mintData.scenes == MinerScenes.altar?"Forge":"Mint"}!</IonText>}</p>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="btn-bottom">
                        <IonRow>
                            <IonCol size="4">
                                <IonButton expand="block" mode="ios" fill={"outline"} color="primary" onClick={() => {
                                    setShowModal(false)
                                }}>Cancel</IonButton>
                            </IonCol>
                            <IonCol size="8">
                                <IonButton expand="block" mode="ios" color="primary"
                                           disabled={userInfo && userInfo.currentPeriod < userInfo.settlementPeriod
                                           || new BigNumber(mintData&&mintData.ne?mintData.ne:0).toNumber() == 0 && mintData.scenes == MinerScenes.chaos
                                           || new BigNumber(mintData&&mintData.ne?mintData.ne:0).toNumber() == 0 && new BigNumber(amount).toNumber() == 0 && mintData.scenes == MinerScenes.altar}
                                           onClick={() => {
                                               if(checked){
                                                   this.done().then(() => {
                                                   }).catch(e => {
                                                       this.setShowLoading(false)
                                                       const err = typeof e == "string" ? e : e.message;
                                                       this.setShowToast(true, "warning", err)
                                                   })
                                               }else {
                                                   this.prepare().then(() => {
                                                   }).catch(e => {
                                                       this.setShowLoading(false)
                                                       const err = typeof e == "string" ? e : e.message;
                                                       this.setShowToast(true, "warning", err)
                                                   })
                                               }
                                           }}>
                                    {
                                        userInfo && userInfo.currentPeriod < userInfo.settlementPeriod?
                                            <Countdown date={nextPeriodTime} renderer={this.renderer}/>
                                            :"Commit"
                                    }
                                    </IonButton>
                            </IonCol>
                        </IonRow>
                    </div>
                </div>
            </IonModal>

            <IonToast
                color={!color ? "warning" : color}
                position="top"
                isOpen={showToast}
                onDidDismiss={() => this.setShowToast(false)}
                message={toastMessage}
                duration={1500}
                mode="ios"
            />


            <IonLoading
                mode="ios"
                spinner={"bubbles"}
                cssClass='my-custom-class'
                isOpen={showLoading}

                onDidDismiss={() => this.setShowLoading(false)}
                message={'Please wait...'}
                duration={50000}
            />

            <ConfirmTransaction show={showAlert} transaction={tx} onProcess={(f) => {}} onCancel={() => this.setShowAlert(false)} onOK={this.confirm}/>

        </>;
    }
}

export default EpochOrigin