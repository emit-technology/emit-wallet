import * as React from 'react';
import {
    IonButton,
    IonChip,
    IonCol,
    IonContent,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonPage,
    IonProgressBar,
    IonRow,IonLoading,
    IonText, IonToast,IonSelect,IonSelectOption
} from "@ionic/react";
import {chevronBack} from "ionicons/icons";
import url from "../../../utils/url";
import "./index.scss";
import {Plugins} from "@capacitor/core";
import {MinerScenes, MintData} from "../miner";
import miner from "../miner/altar";
import walletWorker from "../../../worker/walletWorker";
import interVar from "../../../interval";
import epochService from "../../../contract/epoch/sero"
import {AccountModel, ChainType, Transaction} from "../../../types";
import {Device, UserInfo} from "../../../contract/epoch/sero/types";
import * as utils from "../../../utils";
import * as config from "../../../config";
import BigNumber from "bignumber.js";
import GasPriceActionSheet from "../../../components/GasPriceActionSheet";
import ConfirmTransaction from "../../../components/ConfirmTransaction";
import rpc from "../../../rpc";
import {Simulate} from "react-dom/test-utils";

interface State {
    showProgress: boolean
    isMining: boolean
    mintData: MintData
    userInfo?:UserInfo
    device?:Device
    showModal:boolean,
    amount:any,
    account?:AccountModel
    showAlert:boolean
    tx:any
    showToast:boolean,
    toastMessage?:string,
    color?:string
    showLoading:boolean
}

const scenes = MinerScenes.altar;
const Currency = "LIGHT";

class Altar extends React.Component<any, State> {
    state: State = {
        showProgress: false,
        isMining: false,
        mintData: {ne: "0", accountId: "", accountScenes: "", scenes: "", phash: "", address: "", index: ""},
        showModal:false,
        amount:0,
        showAlert:false,
        tx:{},
        showToast:false,
        toastMessage:"",
        color:"success",
        showLoading:false
    }

    componentDidMount() {
        this.init().catch(e => {
            console.error(e)
        });
        interVar.start(() => {
            this.mintState().then(() => {
            }).catch(e => {
                console.error(e)
            })
        }, 1 * 1000)
    }

    init = async () => {
        const account = await walletWorker.accountInfo()
        miner.setMiner(account.accountId?account.accountId:"")
        await miner.init();
        await this.mintState();

        const userInfo = await epochService.userInfo(MinerScenes.altar, account.addresses[ChainType.SERO])
        const device = await epochService.lockedDevice(MinerScenes.altar, account.addresses[ChainType.SERO])

        console.log("userInfo>",userInfo)
        console.log("device>",device)

        this.setState({
            isMining: await miner.isMining(),
            userInfo:userInfo,
            device:device,
            account:account
        })
    }

    operate = async () => {
        const {isMining} = this.state;
        if (isMining) {
            await this.stop()
        } else {
            await this.start()
        }
    }

    start = async () => {
        const {account,userInfo} = this.state;
        if(account && userInfo && userInfo.pImage && userInfo && userInfo.pImage.hash && userInfo && userInfo.pImage.serial){
            await miner.start({
                phash: userInfo.pImage.hash,
                address: await utils.getShortAddress(account.addresses[ChainType.SERO]),
                index: utils.toHex(userInfo.pImage.serial),
                scenes: scenes,
                accountScenes: miner.uKey(),
                accountId: account.accountId
            })
            this.setState({
                isMining: true
            })
        }
    }

    stop = async () => {
        await miner.stop();
        this.setShowModal(true)
        this.setState({
            isMining: false
        })
    }

    async mintState() {
        const rest = await miner.mintState()
        this.setState({
            mintData: rest
        })
    }

    setShowModal = (f:boolean) =>{
        this.setState({
            showModal:f
        })
    }

    done = async ()=>{
        this.setShowProgress(true)
        this.setShowLoading(true)
        const data = await epochService.done(MinerScenes.altar)
        await this.do(data)
    }

    prepare = async ()=>{
        const {mintData} = this.state;
        this.setShowProgress(true)
        this.setShowLoading(true)
        if(mintData.nonce){
            const data = await epochService.prepare(MinerScenes.altar,mintData.nonce)
            await this.do(data)
        }
    }

    do = async (data:string)=>{
        const {amount,account} = this.state;
        if(account){
            let tx: Transaction | any = {
                from: account.addresses && account.addresses[ChainType.SERO],
                to: epochService.address,
                cy: Currency,
                gasPrice: "0x"+new BigNumber(1).multipliedBy(1e9).toString(16),
                chain: ChainType.SERO,
                amount: "0x0",
                feeCy:"SERO",
                value: utils.toHex(amount,18),
                data:data
            }
            tx.gas = await epochService.estimateGas(tx)
            if(tx.gas && tx.gasPrice){
                tx.feeValue = new BigNumber(tx.gas).multipliedBy(new BigNumber(tx.gasPrice)).toString(10)
            }
            this.setState({
                tx:tx,
                showAlert:true
            })
        }

    }

    setShowProgress = (f:boolean)=>{
        this.setState({
            showProgress:f
        })
    }

    setShowAlert = (f:boolean)=>{
        this.setState({
            showAlert:f
        })
    }

    confirm = async (hash:string) => {
        let intervalId:any = 0;
        const chain = ChainType.SERO;
        intervalId = setInterval(()=>{
            rpc.getTxInfo(chain,hash).then((rest)=>{
                if(rest){
                    // this.setShowToast(true,"success","Commit Successfully!")
                    clearInterval(intervalId);
                    url.transactionInfo(chain,hash,Currency);
                    this.setShowLoading(false)
                    this.setShowProgress(false)
                }
            }).catch(e=>{
                console.error(e)
            })
        },1000)
        this.setShowAlert(false)
    }

    setShowToast = (f:boolean,color?:string,m?:string) =>{
        this.setState({
            showToast:f,
            toastMessage:m,
            color:color
        })
    }

    setShowLoading = (f:boolean)=>{
        this.setState({
            showLoading:f
        })
    }

    render() {
        const {showProgress,showModal, isMining,showLoading, mintData,device,userInfo,showAlert,tx,toastMessage,color,showToast} = this.state;


        return (
            <IonPage>
                <IonContent fullscreen color="light">
                    <div className="content-ion">
                        <IonItem className="heard-bg" color="primary" lines="none">
                            <IonIcon src={chevronBack} style={{color: "#edcc67"}} slot="start" onClick={() => {
                                url.back()
                                Plugins.StatusBar.setBackgroundColor({
                                    color: "#194381"
                                }).catch(e=>{
                                })

                            }}/>
                            <IonLabel className="text-center text-bold" style={{color: "#edcc67"}}>ALTAR</IonLabel>
                            <img src={require("../img/help.png")} width={28}/>
                        </IonItem>
                        <div style={{margin:"30px 0 0"}}></div>
                        <div className="progress">
                            <div>
                                <IonRow>
                                    <IonCol>
                                        <IonText color="white" className="text-little">AEX1</IonText>
                                    </IonCol>
                                    <IonCol style={{textAlign: "right"}}>
                                        <IonText color="white" className="text-little">LV{device && device.power}</IonText><br/>
                                    </IonCol>
                                </IonRow>
                            </div>
                            <IonProgressBar className="progress-background" value={device && (device.capacity?device.base/device.capacity:0)}/>
                            <div style={{textAlign: "right"}}>
                                <IonText color="white" className="text-little">{device && `${device.base}/${device.capacity}`}</IonText>
                            </div>
                        </div>
                        <div className="progress">
                            <div>
                                <IonRow>
                                    <IonCol>
                                        <IonText color="white" className="text-little">DRIVER</IonText>
                                    </IonCol>
                                </IonRow>
                            </div>
                            <IonProgressBar className="progress-background" value={userInfo && userInfo.driver && userInfo.driver.capacity>0?(userInfo.driver.base/userInfo.driver.capacity):0}/>
                            <div style={{textAlign: "right"}}>
                                <IonText color="white" className="text-little">{userInfo && userInfo.driver && `${userInfo.driver.base}/${userInfo.driver.capacity}`}</IonText>
                            </div>
                        </div>

                        <div className="altar">
                            <div><img src={require("../img/altar_1.png")}/></div>
                            <div><img src={require("../img/altar_2.png")}/></div>
                            <div><img src={require("../img/altar_3.png")}/></div>
                            <div>
                                <img src={require("../img/axe_0.png")}/>
                                <div></div>
                            </div>
                            <div>
                                <img src={require("../img/axe_1.png")}/>
                            </div>
                        </div>

                        <div>
                            {mintData && mintData.ne && <div className="ne-text">
                                {mintData && mintData.ne}
                            </div>}
                            {mintData && mintData.nonce && <div className="nonce-text">
                                <span className="nonce-span">{mintData && mintData.nonce}</span>
                            </div>}
                            <div className="start-btn" style={{background: !!isMining ? "red" : "green"}}
                                 onClick={() => {
                                     this.operate().then(() => {
                                     }).catch((e) => {
                                         console.error(e)
                                     })
                                 }}>{!!isMining ? "STOP" : "START"}</div>
                        </div>
                    </div>

                    <IonModal
                        isOpen={showModal}
                        cssClass='epoch-modal'
                        swipeToClose={true}
                        onDidDismiss={() => this.setShowModal(false)}>
                        <div className="epoch-md">
                            <div className="close" onClick={()=>{
                                this.setShowModal(false)
                            }}>X</div>
                            <IonList>
                                <div className="modal-header">Settlement</div>
                                <IonItem>
                                    <IonLabel>Current Period</IonLabel>
                                    <IonChip color="primary" className="font-weight-800">{userInfo && userInfo.currentPeriod}</IonChip>
                                </IonItem>
                                <IonItem>
                                    <IonLabel>Settlement Period</IonLabel>
                                    <IonChip color="primary" className="font-weight-800">{userInfo && userInfo.settlementPeriod}</IonChip>
                                </IonItem>
                                <IonItem>
                                    <IonLabel>NE</IonLabel>
                                    <IonChip color="tertiary" className="font-weight-800">{mintData && mintData.ne}</IonChip>
                                </IonItem>
                                <IonItem>
                                    <IonLabel position="stacked">Light</IonLabel>
                                    <IonInput placeholder="0" onIonChange={(v)=>{
                                        this.setState({
                                            amount:v
                                        })
                                    }}/>
                                </IonItem>
                            </IonList>
                            <div className="epoch-desc">
                                <div className="ctx">
                                    <p className="font-weight-800">Introduce</p>
                                    <div>
                                        <p>1. You do not have equipment for the first time, you need to use Prepare to submit</p>
                                        <p>2. When Current period is greater than or equal to Settle, you can continue mining next time</p>
                                        <p>3. Mining results can only be submitted once a day</p>
                                        <p>4. You can also use Light to buy NE</p>
                                    </div>
                                </div>
                            </div>
                            <div className="btn-bottom">
                                <IonRow>
                                    <IonCol size="6">
                                        <IonButton expand="block" mode="ios" color="primary" disabled={showProgress || userInfo && userInfo.currentPeriod<userInfo.settlementPeriod} onClick={()=>{
                                            this.prepare().then(()=>{
                                                this.setShowProgress(false)
                                                this.setShowLoading(false)
                                            }).catch(e=>{
                                                this.setShowProgress(false)
                                                this.setShowLoading(false)
                                                const err = typeof e =="string"?e:e.message;
                                                this.setShowToast(true,"warning",err)
                                            })
                                        }}>Prepare</IonButton>
                                    </IonCol>
                                    <IonCol size="6">
                                        <IonButton expand="block" mode="ios" disabled={showProgress || userInfo && userInfo.currentPeriod<userInfo.settlementPeriod} color="primary" onClick={()=>{
                                            this.done().then(()=>{
                                                this.setShowProgress(false)
                                                this.setShowLoading(false)
                                            }).catch(e=>{
                                                this.setShowProgress(false)
                                                this.setShowLoading(false)
                                                const err = typeof e =="string"?e:e.message;
                                                this.setShowToast(true,"warning",err)
                                            })
                                        }}>Done</IonButton>
                                    </IonCol>
                                </IonRow>
                            </div>
                        </div>
                    </IonModal>

                    <IonToast
                        color={!color?"warning":color}
                        position="top"
                        isOpen={showToast}
                        onDidDismiss={() => this.setShowToast(false)}
                        message={toastMessage}
                        duration={1500}
                        mode="ios"
                    />

                    <IonLoading
                        spinner={"bubbles"}
                        cssClass='my-custom-class'
                        isOpen={showLoading}
                        onDidDismiss={() => this.setShowLoading(false)}
                        message={'Please wait...'}
                        duration={5000}
                    />

                    <ConfirmTransaction show={showAlert} transaction={tx} onProcess={(f)=>this.setShowProgress(f)} onCancel={()=>this.setShowAlert(false)} onOK={this.confirm}/>

                </IonContent>
            </IonPage>
        );
    }
}

export default Altar