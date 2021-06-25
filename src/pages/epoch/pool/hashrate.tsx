import * as React from 'react';
import {
    IonButton,
    IonCheckbox,
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel, IonLoading,
    IonModal,
    IonPage,
    IonRow,
    IonSegment,
    IonSegmentButton,
    IonSelect,
    IonSelectOption,
    IonText,
    IonTitle, IonToast,
    IonToolbar
} from "@ionic/react";
import {addCircleOutline, arrowUpOutline, chevronBack, helpCircleOutline} from "ionicons/icons";
import {Plugins} from "@capacitor/core";
import url from "../../../utils/url";
import {MinerScenes} from "../miner";
import "./hashrate.scss"
import {PoolTask} from "../../../contract/epoch/sero/types";
import poolRpc from "../../../rpc/pool";
import {AccountModel, ChainType, Transaction} from "../../../types";
import walletWorker from "../../../worker/walletWorker";
import * as utils from "../../../utils"
import epochPoolService from "../../../contract/epoch/sero/pool";
import BigNumber from "bignumber.js";
import ConfirmTransaction from "../../../components/ConfirmTransaction";
import {type} from "os";
import rpc from "../../../rpc";

interface State {
    showModal: boolean
    scenes: MinerScenes
    showMine: boolean
    data: Array<PoolTask>
    account: AccountModel
    currentPeriod: number
    depositAmount:any
    phase:any
    fromPeriod:number
    name:any
    showAlert: boolean
    tx: any
    showToast: boolean
    toastMessage?: string
    color?: string
    showLoading:boolean
}

class HashRatePool extends React.Component<any, State> {

    state: State = {
        showModal: false,
        scenes: MinerScenes.altar,
        showMine: false,
        data: [],
        account: {name: ""},
        currentPeriod:0,
        depositAmount:0,
        phase:0,
        fromPeriod:0,
        name:"",
        showAlert:false,
        tx:{},
        showToast:false,
        showLoading:false
    }

    componentDidMount() {
        this.init().catch(e=>{
            console.log(e)
        })
    }

    init = async () => {
        const account = await walletWorker.accountInfo()
        const period = await epochPoolService.currentPeriod();
        const poolTask: Array<PoolTask> =  await poolRpc.getTask(account.addresses[ChainType.SERO],1,10)
        this.setState({
            account:account,
            data:poolTask,
            currentPeriod:period,
            fromPeriod:period
        })
    }

    setShowModal = (f: boolean) => {
        this.setState({
            showModal: f
        })
    }

    setShowMine(f: boolean) {
        this.setState({
            showMine: f
        })
    }

    commit = async ()=>{
        this.setShowModal(false)
        const {name,phase,depositAmount,fromPeriod,scenes,account} = this.state;
        const data = await epochPoolService.addTask(0,name,scenes,fromPeriod,fromPeriod+parseInt(phase)-1)
        const tx: Transaction | any = {
            from: account.addresses && account.addresses[ChainType.SERO],
            to: epochPoolService.address,
            cy: "LIGHT",
            gasPrice: "0x" + new BigNumber(1).multipliedBy(1e9).toString(16),
            chain: ChainType.SERO,
            amount: "0x0",
            feeCy: "LIGHT",
            value: utils.toHex(depositAmount, 18),
            data: data,
        }
        tx.gas = await epochPoolService.estimateGas(tx)
        if (tx.gas && tx.gasPrice) {
            tx.feeValue = await epochPoolService.tokenRate(tx.gasPrice, tx.gas);
        }
        this.setState({
            tx: tx,
            showAlert: true
        })
        this.setShowLoading(false)
        this.setShowModal(false)
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
                    this.init().then(()=>{
                    }).catch(e=>{
                        console.error(e)
                    })
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

    setShowToast = (f: boolean, color?: string, m?: string) => {
        this.setState({
            showToast: f,
            toastMessage: m,
            color: color
        })
    }

    setShowLoading = (f: boolean) => {
        this.setState({
            showLoading: f
        })
    }

    setShowAlert = (f: boolean) => {
        this.setState({
            showAlert: f
        })
    }

    render() {
        const {showModal, scenes, showMine, data,currentPeriod,showLoading,fromPeriod,showToast,showAlert,color,toastMessage,tx} = this.state;
        return <IonPage>
            <IonHeader>
                <IonToolbar color="primary" mode="ios" className="heard-bg">
                    <IonIcon src={chevronBack} size="large" style={{color: "#edcc67"}} slot="start" onClick={() => {
                        Plugins.StatusBar.setBackgroundColor({
                            color: "#194381"
                        }).catch(e => {
                        })
                        url.back()
                    }}/>
                    <IonTitle className="text-center text-bold" style={{
                        color: "#edcc67",
                        textTransform: "uppercase"
                    }}>
                        HashRate Pool
                    </IonTitle>
                    <IonIcon src={addCircleOutline} style={{color: "#edcc67"}} size="large" slot="end" onClick={() => {
                        this.setShowModal(true)
                    }}/>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <div className="pool-content">
                    <IonSegment mode="ios" color="primary" value="all"
                                onIonChange={e => console.log('Segment selected', e.detail.value)}>
                        <IonSegmentButton value="all">
                            <IonLabel>ALL</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="altar">
                            <IonLabel>ALTAR</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="chaos">
                            <IonLabel>CHAOS</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                    <div className="pool-head">
                        <IonRow>
                            <IonCol size="3"><small>SCENES</small></IonCol>
                            <IonCol size="3"><small>Name</small></IonCol>
                            <IonCol size="3"><small>Phase</small></IonCol>
                            <IonCol size="3"><small>Revenue</small></IonCol>
                        </IonRow>
                    </div>
                    <div>
                        {/*<IonItem lines="none">*/}
                        {/*    <IonCheckbox mode="ios" color="primary" checked={showMine} onIonChange={e => this.setShowMine(e.detail.checked)}/>*/}
                        {/*    <IonLabel color="primary"><small>Only show records created by me</small></IonLabel>*/}
                        {/*</IonItem>*/}
                        {
                            data.map((value, index) => {
                                return <div className="pool-item" onClick={() => {
                                    url.poolInfo(value.taskId)
                                }}>
                                    <IonRow>
                                        <IonCol size="2"><span><IonText>{MinerScenes[value.scenes].toUpperCase()}</IonText></span></IonCol>
                                        <IonCol size="4">
                                            <span>{value.name}</span>
                                            {/*<small><IonText color="medium">G</IonText></small>*/}
                                        </IonCol>
                                        <IonCol size="2">
                                            <span><IonText>{value.begin}-{value.end}</IonText></span>
                                        </IonCol>
                                        <IonCol size="4">
                                            <small><IonText color="medium">L</IonText></small>
                                            <span><IonText>{utils.fromValue(value.reward,18).toFixed(3,1)}</IonText></span>
                                            <small><IonText color="medium">/Period</IonText></small>
                                        </IonCol>
                                    </IonRow>
                                </div>
                            })}
                    </div>
                </div>

                <IonModal
                    swipeToClose={true}
                    mode="ios"
                    isOpen={showModal}
                    cssClass='epoch-modal'
                    onDidDismiss={() => this.setShowModal(false)}>
                    <div className="pool-modal">
                        <h3 className="text-center">Create HashRate Pool</h3>
                        <IonItem>
                            <IonLabel><IonIcon src={helpCircleOutline}/> <span>Name</span></IonLabel>
                            <IonInput onIonChange={(e)=>{
                                this.setState({name:e.detail.value})
                            }}/>
                        </IonItem>
                        <IonItem>
                            <IonLabel><IonIcon src={helpCircleOutline}/> <span>SCENES</span></IonLabel>
                            <IonSelect mode="md" value={scenes} onIonChange={(e) => {
                                this.setState({
                                    scenes: e.detail.value
                                })
                            }}>
                                <IonSelectOption value={MinerScenes.altar}>ALTAR</IonSelectOption>
                                <IonSelectOption value={MinerScenes.chaos}>CHAOS</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonItem>
                            <IonLabel><IonIcon src={helpCircleOutline}/> <span>Deposit</span></IonLabel>
                            <IonInput placeholder="0.000" onIonChange={(e)=>{
                                this.setState({depositAmount:e.detail.value})
                            }}/>
                            <IonLabel><small>LIGHT</small></IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel><IonIcon src={helpCircleOutline}/> <span>Phase</span></IonLabel>
                            <IonInput placeholder="0" onIonChange={(e)=>{
                                this.setState({phase:e.detail.value})
                            }}/>
                            <IonLabel><small>Periods</small></IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel><IonIcon src={helpCircleOutline}/> <span>From Period</span></IonLabel>
                            <IonSelect mode="md" value={fromPeriod} onIonChange={(e) => {
                                this.setState({
                                    fromPeriod:e.detail.value
                                })
                            }}>
                                {[0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => {
                                    return <IonSelectOption value={currentPeriod+value}>{currentPeriod+value}</IonSelectOption>
                                })}
                            </IonSelect>
                        </IonItem>
                        {/*<IonItem>*/}
                        {/*    <IonLabel><IonIcon src={helpCircleOutline}/> <span>Min HR</span></IonLabel>*/}
                        {/*    <IonInput placeholder="100"/>*/}
                        {/*    <IonLabel><small>M</small></IonLabel>*/}
                        {/*</IonItem>*/}

                        {/*<h5 style={{paddingLeft:"12px"}}><IonText>RULES</IonText></h5>*/}
                        <div className="pool-display">
                            <p>1. You can invite more people to provide you with hash rate</p>
                            <p>2. And you will pay the miners some LIGHT as a reward</p>
                            <p>3. Rewards will be automatically settled after each settlement period</p>
                        </div>
                    </div>

                    <IonRow>
                        <IonCol size="4">
                            <IonButton expand="block" mode="ios" fill="outline" onClick={() => {
                                this.setShowModal(false)
                            }}>Cancel</IonButton>
                        </IonCol>
                        <IonCol size="8">
                            <IonButton mode="ios" expand="block" onClick={() => {
                                this.commit().catch(e=>{
                                    const err = typeof e =="string"?e:e.message;
                                    this.setShowToast(true,"danger",err)
                                })
                            }}>Commit</IonButton>
                        </IonCol>
                    </IonRow>
                </IonModal>

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


            </IonContent>
        </IonPage>;
    }
}

export default HashRatePool