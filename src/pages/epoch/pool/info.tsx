import * as React from "react";
import {
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonTitle,
    IonToolbar,
    IonItem,
    IonRow,
    IonCol,
    IonLabel,
    IonText,
    IonButton, IonInput, IonSelect, IonSelectOption, IonModal
} from "@ionic/react";
import {addCircleOutline, chevronBack, helpCircleOutline} from "ionicons/icons";
import {Plugins} from "@capacitor/core";
import url from "../../../utils/url";
import {MinerScenes} from "../miner";
import poolRpc, {PoolPayment} from "../../../rpc/pool";
import epochPoolService from "../../../contract/epoch/sero/pool";
import {PoolTask} from "../../../contract/epoch/sero/types";
import * as utils from "../../../utils"
import {AccountModel, ChainType} from "../../../types";
import walletWorker from "../../../worker/walletWorker";
interface State {
    showModal:boolean
    showModal1:boolean
    task?:PoolTask
    account:AccountModel
    paymentData:Array<PoolPayment>
}

class PoolInfo extends React.Component<any, State>{

    state:State = {
        showModal:false,
        showModal1:false,
        account:{name:""},
        paymentData:[]
    }

    componentDidMount() {
        this.init().catch(e=>{
            console.error(e)
        })
    }

    init = async ()=>{
        const task = await this.taskInfo()
        const account = await walletWorker.accountInfo();
        this.setState({
            task:task,
            account:account
        })
    }

    taskInfo = async () =>{
        const taskId = this.props.match.params.id;
        return await epochPoolService.getTask(taskId)
    }

    setShowModal = (f:boolean) =>{
        this.setState({
            showModal:f
        })
    }

    setShowModal1 = (f:boolean) =>{
        this.setState({
            showModal1:f
        })
    }

    getPayment = async ()=>{
        const {account} = this.state;
        const taskId = this.props.match.params.id;
        const rest = await poolRpc.getPayment(taskId,account.addresses[ChainType.SERO],1,10)
        this.setState({
            paymentData:rest
        })
    }

    render() {
        const {showModal,showModal1,task,paymentData} = this.state;

        return <IonPage>
            <IonHeader>
                <IonToolbar color="primary" mode="ios" className="heard-bg">
                    <IonIcon src={chevronBack} size="large" style={{color: "#edcc67"}} onClick={() => {
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
                        Pool Info
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <div className="pool-content">
                    <div className="pool-info-header">
                        <IonItem>
                            <IonLabel><span>Name</span></IonLabel>
                            <IonText><span>{task&&task.name}</span></IonText>
                        </IonItem>
                        <IonItem>
                            <IonLabel><span>Scenes</span></IonLabel>
                            <IonText><span>{task&&MinerScenes[task.scenes].toUpperCase()}</span></IonText>
                        </IonItem>
                        <IonItem>
                            <IonLabel><span>Phase</span></IonLabel>
                            <IonText><span>Start: {task?.begin}  End: {task?.end}</span></IonText>
                        </IonItem>
                        <IonItem>
                            <IonLabel><span>Reward</span></IonLabel>
                            <IonText><span>{utils.fromValue(task?task.reward:0,18).toString(10)}</span></IonText>
                        </IonItem>
                        <IonItem>
                            <IonLabel><span>Settlement</span></IonLabel>
                            <IonText><span>{utils.fromValue(task?task.settlement:0,18).toString(10)}</span></IonText>
                        </IonItem>
                        <IonItem>
                            <IonLabel><span>Current Period</span></IonLabel>
                            <IonText><span>90</span></IonText>
                        </IonItem>
                    </div>

                    <div className="pool-info-bottom">
                        <IonRow>

                            <IonCol size="12">
                                <IonButton mode="ios" expand="block" color="success" onClick={()=>{

                                }}>Start Hash Rate</IonButton>
                            </IonCol>
                            <IonCol size="12">
                                <div className="pool-display">
                                    <IonItem lines="none">
                                        <IonLabel><small>HashRate</small></IonLabel>
                                        <IonText><small>1000/s</small></IonText>
                                    </IonItem>
                                    <IonItem lines="none">
                                        <IonLabel><small>Latest NE</small></IonLabel>
                                        <IonText><small>{parseFloat("1000000000").toLocaleString()}</small></IonText>
                                    </IonItem>
                                </div>
                            </IonCol>

                            <IonCol size="12">
                                <IonButton expand="block" mode="ios" fill="outline" color="primary" onClick={()=>{
                                    this.setShowModal(true)
                                }}>View Commit History</IonButton>
                            </IonCol>
                            <IonCol size="12">
                                <IonButton mode="ios" expand="block" fill="outline" color="primary" onClick={()=>{
                                    this.setShowModal1(true)
                                }}>View Settlement History</IonButton>
                            </IonCol>
                        </IonRow>
                    </div>

                    <IonModal
                        swipeToClose={true}
                        mode="ios"
                        isOpen={showModal}
                        cssClass='epoch-modal'
                        onDidDismiss={() => this.setShowModal(false)}>
                        <div className="pool-modal">
                            {/*<h3 className="text-center">Create HashRate Pool</h3>*/}
                            <div className="pool-info-content">
                                <div className="pool-head">
                                    <IonRow>
                                        <IonCol size="4">Address</IonCol>
                                        <IonCol size="4">Period</IonCol>
                                        <IonCol size="4">NE</IonCol>
                                    </IonRow>
                                </div>
                                <div className="pool-info-detail">
                                    {
                                        [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3].map(value => {
                                            return <div className="pool-info-item">
                                                <IonRow>
                                                    <IonCol size="4">Absm..123jd</IonCol>
                                                    <IonCol size="4">87</IonCol>
                                                    <IonCol size="4">100G</IonCol>
                                                </IonRow>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                    </IonModal>

                    <IonModal
                        swipeToClose={true}
                        mode="ios"
                        isOpen={showModal1}
                        cssClass='epoch-modal'
                        onDidDismiss={() => this.setShowModal1(false)}>
                        <div className="pool-modal">
                            <div className="pool-info-content">
                                <div className="pool-head">
                                    <IonRow>
                                        <IonCol size="3"><small>TaskId</small></IonCol>
                                        <IonCol size="3"><small>Amount</small></IonCol>
                                        <IonCol size="3"><small>Period</small></IonCol>
                                        <IonCol size="3"><small>PayTime</small></IonCol>
                                    </IonRow>
                                </div>
                                <div className="pool-info-detail">
                                    {
                                        paymentData.map(value => {
                                            return <div className="pool-info-item">
                                                <IonRow>
                                                    <IonCol size="3"><small>{value.taskId}</small></IonCol>
                                                    <IonCol size="3"><small>{value.amount}</small></IonCol>
                                                    <IonCol size="3"><small>{value.period}</small></IonCol>
                                                    <IonCol size="3"><small>{value.payTime}</small></IonCol>
                                                </IonRow>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                    </IonModal>
                </div>
            </IonContent>
        </IonPage>;
    }
}

export default PoolInfo