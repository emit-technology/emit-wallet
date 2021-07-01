import * as React from "react";
import {
    IonButton,
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonLoading,
    IonModal,
    IonPage,IonAlert,
    IonRow,
    IonText,IonPopover,
    IonTitle,IonActionSheet,
    IonToast,IonProgressBar,
    IonToolbar,IonChip,IonBadge
} from "@ionic/react";
import {
    chevronBack,
    close,
    createOutline, helpCircleOutline,
    radioButtonOffOutline,
} from "ionicons/icons";
import {Plugins} from "@capacitor/core";
import url from "../../../utils/url";
import Miner, {MinerScenes, MintData} from "../miner";
import poolRpc, {PoolPayment, PoolShare} from "../../../rpc/pool";
import epochPoolService from "../../../contract/epoch/sero/pool";
import {PoolTask} from "../../../contract/epoch/sero/types";
import * as utils from "../../../utils"
import {AccountModel, ChainType, Transaction} from "../../../types";
import walletWorker from "../../../worker/walletWorker";
import PoolMiner from "../miner/pool";
import interVar from "../../../interval";
import BigNumber from "bignumber.js";
import selfStorage from "../../../utils/storage";
import ConfirmTransaction from "../../../components/ConfirmTransaction";
import rpc from "../../../rpc";
import i18n from "../../../locales/i18n";

interface State {
    showModal:boolean
    showModal0:boolean
    showModal1:boolean
    task?:PoolTask
    account:AccountModel
    paymentData:Array<PoolPayment>
    shareData:Array<PoolShare>
    isMining:boolean
    mintData?:MintData
    poolMiner:PoolMiner
    currentPeriod:number

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

    shortAddress:string
    targetNE:any
    taskEnd:any
    showActionSheet:boolean
    optionButtons:Array<any>
    op:string
    showAlert2:boolean,
    minNE:any
    showPopover:boolean
    event:any
    popMsg?:string
}

class PoolInfo extends React.Component<any, State>{

    state:State = {
        showModal:false,
        showModal0:false,
        showModal1:false,
        account:{name:""},
        paymentData:[],
        shareData:[],
        isMining:false,
        poolMiner: new Miner(MinerScenes.pool),
        currentPeriod:0,

        depositAmount:0,
        phase:0,
        fromPeriod:0,
        name:"",
        showAlert:false,
        tx:{},
        showToast:false,
        showLoading:false,

        shortAddress:"",
        targetNE:"",
        taskEnd:"",
        showActionSheet:false,
        optionButtons:[],
        op:"",
        showAlert2:false,
        minNE:"",
        showPopover:false,
        event:undefined,
    }


    componentDidMount() {
        Plugins.StatusBar.setBackgroundColor({
            color: "#152955"
        }).catch(e => {
        })
        this.setShowLoading(true)
        this.init().then(()=>{
            this.setShowLoading(false)
            this.mintState().then(() => {
            }).catch(e => {
                console.error(e)
            })
        }).catch(e=>{
            this.setShowLoading(false)
            console.error(e)
        })
    }

    init = async ()=>{
        const taskId = this.props.match.params.id;
        const task = await this.taskInfo()
        const account = await walletWorker.accountInfo();
        this.state.poolMiner.setMiner(account.accountId ? account.accountId : "")
        const pImageInfo = await poolRpc.taskImage(new BigNumber(taskId).toNumber(),account.addresses[ChainType.SERO])
            //await epochPoolService.taskPImage(taskId,"")//account.addresses[ChainType.SERO]
        task.taskId = new BigNumber(taskId).toNumber()
        //address owner,uint16 scenes_,uint64 serial,bytes32 phash

        console.log("pImageInfo::",pImageInfo)
        let period = selfStorage.getItem("epochCurrentPeriod");
        if(period && typeof period == "string"){
            period = parseInt(period)
        }

        const mintData:MintData = {
            phash: pImageInfo[3],
            address: pImageInfo[0],
            index: utils.toHex(pImageInfo[2]),
            scenes: pImageInfo[1],
            accountScenes: this.state.poolMiner.uKey([account.accountId,pImageInfo[0],MinerScenes[MinerScenes.pool]].join("_"),taskId),
            accountId: account.accountId,
            isPool:true,
            taskId:taskId,
            period:pImageInfo[5],
            minNE:pImageInfo[4]
        }
        await this.state.poolMiner.init(mintData)
        const isMining= await this.state.poolMiner.isMining()
        if (isMining) {
            if(new BigNumber(task.end).toNumber() < period){
                this.stop().catch((e:any)=>{console.log(e)});
            }else{
                interVar.start(() => {
                    this.mintState().then(() => {
                    }).catch(e => {
                        console.error(e)
                    })
                }, 1 * 1000)
            }
        } else {
            interVar.stop()
        }


        this.setState({
            task:task,
            account:account,
            mintData:mintData,
            isMining:isMining,
            currentPeriod:period,
            name:task.name,
            shortAddress: await utils.getShortAddress(account.addresses[ChainType.SERO]),
            depositAmount:utils.fromValue(task.reward,18).toNumber(),
            phase:new BigNumber(task.end).minus(task.begin).plus(1).toNumber(),
            targetNE:new BigNumber(task.targetNE).dividedBy(1E6).toNumber(),
            optionButtons:[],
            minNE:pImageInfo[4]
        })
    }

    start = async () => {
        const {scenes} = this.props
        const {account,mintData} = this.state;
        mintData && await this.state.poolMiner.start(mintData)
        interVar.start(() => {
            this.mintState().then(() => {
            }).catch(e => {
                console.error(e)
            })
        }, 1 * 1000)
        this.setState({
            isMining: true
        })
    }

    stop = async () => {
        await this.state.poolMiner.stop();
        interVar.stop()
        this.setState({
            isMining: false
        })
    }

    async mintState() {
        const rest = await this.state.poolMiner.mintState()
        const {mintData, isMining} = this.state;
        if (isMining || mintData && rest.nonce != mintData.nonce || mintData && rest.ne != mintData.ne) {
            this.setState({
                mintData: rest
            })
        }
    }

    taskInfo = async () =>{
        const taskId = this.props.match.params.id;
        return await epochPoolService.getTask(taskId)
    }

    setShowModal0 = (f:boolean) =>{
        if(f){
            this.setShowLoading(true)
            this.getShare().then(()=>{
                this.setShowLoading(false)
            }).catch(e=>{
                this.setShowLoading(false)
                console.error(e)
            })
        }
        this.setState({
            showModal0:f
        })
    }

    setShowModal = (f:boolean)=>{
        this.setState({
            showModal:f
        })
    }

    setShowModal1 = (f:boolean) =>{
        if(f){
            this.setShowLoading(true)
            this.getPayment().then(()=>{
                this.setShowLoading(false)
            }).catch(e=>{
                this.setShowLoading(false)
                console.error(e)
            })
        }
        this.setState({
            showModal1:f
        })
    }

    getPayment = async ()=>{
        const {account} = this.state;
        const taskId = this.props.match.params.id;
        const rest = await poolRpc.getPayment(parseInt(taskId),account.addresses[ChainType.SERO],1,15)
        this.setState({
            paymentData:rest
        })

    }

    getShare = async ()=>{
        const {account} = this.state;
        const taskId = this.props.match.params.id;
        const rest = await poolRpc.getShare(parseInt(taskId),account.addresses[ChainType.SERO],1,15)
        this.setState({
            shareData:rest
        })

    }

    getShareByPeriod = async (period:number)=>{
        const {task,account} = this.state;
        if(task){
            // if(new BigNumber(task.end).toNumber()<period){
            //     period = new BigNumber(task.end).toNumber()
            // }
            const rest = await poolRpc.epochTaskShare(task.taskId,period,account.addresses[ChainType.SERO])
            this.setState({
                shareData:rest,
                showModal0:true
            })
        }
    }

    getPaymentByPeriod = async (period:number)=>{
        const {task,account} = this.state;
        if(task){
            // if(new BigNumber(task.end).toNumber()<period){
            //     period = new BigNumber(task.end).toNumber()
            // }
            const rest = await poolRpc.epochTaskPayment(task.taskId,period,account.addresses[ChainType.SERO])
            this.setState({
                paymentData:rest,
                showModal1:true
            })
        }
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

    commit = async ()=>{
        let {name,phase,depositAmount,targetNE,currentPeriod,account,task,optionButtons} = this.state;
        if(task){
            const finished = task && new BigNumber(task.end).minus(currentPeriod).toNumber()<0;
            const begin = task ?finished?currentPeriod:task.begin:currentPeriod;
            if(phase && new BigNumber(phase).toNumber()>0 &&
                new BigNumber(begin).plus(phase).minus(1).toNumber()>=currentPeriod){
            }else {
                this.setShowToast(true,"danger",`Invalid Period : [${phase}]`)
                return
            }

            name = name.trim()
            const reg = new RegExp("^[\u0000-\u00FF]+$");
            const regEmoj= new RegExp(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g);
            if(!reg.test(utils.Trim(name)) && !regEmoj.test(utils.Trim(name))){
                this.setShowToast(true,"warning",`The name [${name}] is invalid !`)
                return
            }
            if(utils.toBytes(name).length > 32){
                this.setShowToast(true,"warning","The length of the name exceeds 32 !")
                return
            }

            const targetEnd = task?new BigNumber(begin).plus(new BigNumber(phase)).minus(1).toNumber():0;
            let total = task?new BigNumber(depositAmount).multipliedBy(new BigNumber(targetEnd).minus(task.end)).toNumber():0
            if(finished && task){
                total = new BigNumber(depositAmount).multipliedBy(new BigNumber(targetEnd).minus(currentPeriod).plus(1)).toNumber()
            }
            const data = await epochPoolService.addTask(task.taskId,name,task.scenes,begin,targetEnd,utils.toHex(new BigNumber(targetNE).multipliedBy(1E6)))
            const tx: Transaction | any = {
                from: account.addresses && account.addresses[ChainType.SERO],
                to: epochPoolService.address,
                cy: "LIGHT",
                gasPrice: "0x" + new BigNumber(1).multipliedBy(1e9).toString(16),
                chain: ChainType.SERO,
                amount: "0x0",
                feeCy: "LIGHT",
                value: total>0?utils.toHex(total,18):"0x0",
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
        }
        this.setShowModal(false)
    }

    confirm = async (hash: string) => {
        if(hash){
            let intervalId: any = 0;
            const chain = ChainType.SERO;
            this.setShowLoading(true)
            let count =0;
            intervalId = setInterval(() => {
                if (count>60){
                    clearInterval(intervalId)
                    this.setShowLoading(false)
                }
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
        }
        this.setShowAlert(false)
        this.setState({
            tx: {},
        })
    }

    setEndPeriod = (v:any)=>{
        const {currentPeriod,task} = this.state;
        let phase = new BigNumber(v).minus(new BigNumber(currentPeriod)).plus(1).toNumber();
        if(task){
            if(phase<=0){
                phase = 1;
            }
            const depositAmount = utils.fromValue(
                new BigNumber(phase).multipliedBy(task.reward)
                    .minus(
                        new BigNumber(task.reward).multipliedBy(new BigNumber(task.end).minus(new BigNumber(currentPeriod))
                            .plus(1))
                    )
                ,18).toNumber()
            this.setState({
                depositAmount:depositAmount,
                phase:phase,
                taskEnd:v
            })
        }
    }

    // setOptionButtons = (period:number,task:PoolTask,op:string)=>{
    //
    // }

    setShowActionSheet = (f:boolean,op:string)=>{
        const optionButtons = [];
        if(op){
            const {currentPeriod,task} = this.state;
            const period = currentPeriod;
            if(task){
                let begin = period - 3 > new BigNumber(task.begin).toNumber()?period-3:new BigNumber(task.begin).toNumber();
                let end = period + 3  > new BigNumber(task.end).toNumber()?new BigNumber(task.end).toNumber():period+3;

                if(new BigNumber(task.begin).toNumber() < begin){
                    begin = new BigNumber(task.begin).toNumber();
                }
                if(new BigNumber(task.end).toNumber() < end){
                    end = new BigNumber(task.end).toNumber();
                }
                if(end>currentPeriod){
                    end = currentPeriod
                }

                for(let i=begin;i<=end;i++){
                    const d = {
                        text: `${i} Period`,
                        icon: radioButtonOffOutline,
                        handler: () => {
                            const {op} = this.state;
                            if(op){
                                if(op=="share"){
                                    this.setShowLoading(true)
                                    this.getShareByPeriod(i).then(()=>{
                                        this.setShowLoading(false)
                                    }).catch(e=>{
                                        this.setShowLoading(false)
                                    })
                                }else{
                                    this.setShowLoading(true)
                                    this.getPaymentByPeriod(i).then(()=>{
                                        this.setShowLoading(false)
                                    }).catch(e=>{
                                        this.setShowLoading(false)
                                    })
                                }
                            }
                        }
                    }
                    optionButtons.push(d)
                }
                optionButtons.push({
                    text: "Custom input",
                    icon: createOutline,
                    handler: () => {
                        this.setShowAlert2(true)
                    }
                })
                optionButtons.push({
                    text: i18n.t("cancel"),
                    icon: close,
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                })
            }
        }

        this.setState({
            showActionSheet:f,
            op:op,
            optionButtons:optionButtons
        })
    }

    setShowAlert2 = (f:boolean)=>{
        this.setState({
            showAlert2:f
        })
    }

    setShowPopover = (f:boolean,e:any,popMsg?:string)=>{
        this.setState({
            showPopover:f,
            event:e,
            popMsg:popMsg
        })
    }

    render() {
        const {
            showModal,showModal1,task,paymentData,mintData,isMining,shareData,currentPeriod,depositAmount,phase,fromPeriod,
            name,showAlert,tx,showToast,showLoading,color,toastMessage,shortAddress,showModal0,targetNE,taskEnd,showActionSheet,
            optionButtons,showAlert2,op,minNE,showPopover,event,popMsg
        } = this.state;

        const finished = task && new BigNumber(task.end).minus(currentPeriod).toNumber()<0;
        const begin = task ?finished?currentPeriod:task.begin:currentPeriod;
        const targetEnd = task?new BigNumber(begin).plus(new BigNumber(phase)).minus(1).toNumber():0;
        let total = task?new BigNumber(depositAmount).multipliedBy(new BigNumber(targetEnd).minus(task.end)).toNumber():0
        if(finished && task){
            total = new BigNumber(depositAmount).multipliedBy(new BigNumber(targetEnd).minus(currentPeriod).plus(1)).toNumber()
        }
        const leftPeriod =  task?new BigNumber(task.end).plus(1).minus(currentPeriod).toNumber()>0?new BigNumber(task.end).plus(1).minus(currentPeriod).toNumber():0:0;
        const countPeriod = task && new BigNumber(task.end).minus(task.begin).plus(1).toNumber()>0?new BigNumber(task.end).minus(task.begin).plus(1).toNumber():0;
        return <IonPage>
            <IonHeader>
                <IonToolbar color="primary" mode="ios" className="heard-bg">
                    <IonIcon src={chevronBack} size="large" style={{color: "#edcc67"}} onClick={() => {
                        // Plugins.StatusBar.setBackgroundColor({
                        //     color: "#194381"
                        // }).catch(e => {
                        // })
                        url.back()
                    }}/>
                    <IonTitle className="text-center text-bold" style={{
                        color: "#edcc67",
                        textTransform: "uppercase"
                    }}>
                        Pool Info
                    </IonTitle>
                    {
                        task && task.owner == shortAddress &&
                        <IonIcon src={createOutline} style={{color: "#edcc67"}} size="large" slot="end" onClick={()=>{
                            if(isMining){
                                this.setShowToast(true,"danger","You are mining, please stop the hash rate first!")
                            }else {
                                this.setShowModal(true)
                            }
                        }}/>
                    }

                    {/*<IonButton size="small" fill="outline" style={{color: "#edcc67"}} color="warning" slot="end">UPDATE</IonButton>*/}
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <div className="pool-content">
                    <div className="pool-info-header">
                        <IonItem>
                            <IonLabel><IonIcon src={helpCircleOutline} onClick={(e)=>{
                                e.persist();
                                this.setShowPopover(true,e,"The name of the mining pool is unique")}
                            }/><span>{i18n.t("name")}</span></IonLabel>
                            <IonText color="primary"><span>{task&&task.name}</span></IonText>
                        </IonItem>
                        <IonItem>
                            <IonLabel><IonIcon src={helpCircleOutline}
                                               onClick={(e)=>{
                                                   e.persist();
                                                   this.setShowPopover(true,e,"The scene of Origin in EPOCH")}
                                               }
                            /><span>{i18n.t("scenes")}</span></IonLabel>
                            <IonBadge color="primary">{task&&MinerScenes[task.scenes].toUpperCase()}</IonBadge>
                        </IonItem>
                        <IonItem lines="none">
                            <IonLabel><IonIcon src={helpCircleOutline} onClick={(e)=>{
                                e.persist();
                                this.setShowPopover(true,e,"The current progress of the mining pool")}
                            }/><span>{i18n.t("periods")}</span></IonLabel>
                            <IonBadge color="secondary">{countPeriod-leftPeriod+1>countPeriod?countPeriod:countPeriod-leftPeriod+1}/{countPeriod}</IonBadge>
                            {/*<IonText color="secondary"><span>{task?.begin} - {task?.end}</span></IonText>*/}
                        </IonItem>
                        <IonItem lines="none">
                            <IonProgressBar value={countPeriod>0?(countPeriod-leftPeriod+1>countPeriod?countPeriod:countPeriod-leftPeriod+1)/countPeriod:0}/>
                        </IonItem>
                        <IonItem>
                            <IonText>
                                <IonText color="secondary"><span><IonText color="primary">{i18n.t("begin")}</IonText>: {task?.begin} </span></IonText>&nbsp;&nbsp;
                                <IonText color="secondary"><span><IonText color="primary">{i18n.t("end")}</IonText>: {task?.end}</span></IonText>&nbsp;&nbsp;
                                <IonText color="secondary"><span><IonText color="primary">{i18n.t("currentPeriod")}</IonText>: {currentPeriod}</span></IonText>
                            </IonText>
                        </IonItem>
                        <IonItem>
                            <IonLabel><IonIcon src={helpCircleOutline} onClick={(e)=>{
                                e.persist();
                                this.setShowPopover(true,e,"The reward for each period")}
                            }/><span>{i18n.t("reward")}</span></IonLabel>
                            <IonText color="secondary"><span>{utils.fromValue(task?task.reward:0,18).toString()}</span> <small><IonText color="medium">LIGHT / Period</IonText></small></IonText>
                        </IonItem>
                        <IonItem>
                            <IonLabel><IonIcon src={helpCircleOutline} onClick={(e)=>{
                                e.persist();
                                this.setShowPopover(true,e,"The difficulty of mining, rewards will only be settled if someone submits an NE that exceeds this value.")}
                            }/><span>Difficulty</span></IonLabel>
                            <IonText color="secondary"><span>{utils.nFormatter(new BigNumber(task?task.targetNE:0).toNumber(),3)}</span></IonText>&nbsp;<span><IonText color="medium">NE</IonText></span>
                        </IonItem>
                        <IonItem>
                            <IonLabel><IonIcon src={helpCircleOutline}  onClick={(e)=>{
                                e.persist();
                                this.setShowPopover(true,e,"The minimum NE can be submitted")}
                            }/><span>{i18n.t("min")} NE</span></IonLabel>
                            <IonText color="secondary"><span>{utils.nFormatter(minNE,3)}</span></IonText>&nbsp;<span><IonText color="medium">NE</IonText></span>
                        </IonItem>
                    </div>

                    <div className="pool-info-bottom">
                        <IonRow>
                            <IonCol size="12">
                                {
                                    finished?
                                        <IonButton expand="block" color="danger" fill="outline">CLOSED</IonButton> :
                                        task&&task.begin>currentPeriod?<IonButton expand="block" fill="outline" color="warning">Not Start</IonButton>
                                            :<IonButton mode="ios" expand="block"
                                                            color={isMining?"danger":"success"}
                                                            disabled={!(mintData && mintData.taskId)}
                                                            onClick={()=>{
                                                                if(isMining){
                                                                    this.stop().catch()
                                                                }else {
                                                                    this.start().catch()
                                                                }
                                                            }}>{isMining?`${i18n.t("stop")} ${i18n.t("hashRate")}`:`${i18n.t("start")} ${i18n.t("hashRate")}`}</IonButton>
                                }

                            </IonCol>
                            {
                                task&&task.end >= currentPeriod && <IonCol size="12">
                                    <div className="pool-display">
                                        <IonItem lines="none">
                                            <IonLabel><small>{i18n.t("hashRate")}</small></IonLabel>
                                            <IonText color="danger"><small>{mintData && mintData.hashrate&&new BigNumber(mintData.hashrate.o).toFixed(0)}/s</small></IonText>
                                        </IonItem>
                                        <IonItem lines="none">
                                            <IonLabel><small>{i18n.t("latest")} NE</small></IonLabel>
                                            <IonText color="secondary"><small>{mintData && mintData.ne && new BigNumber(mintData.ne).toLocaleString()}</small></IonText>
                                        </IonItem>
                                    </div>
                                </IonCol>
                            }

                            <IonCol size="12">
                                <IonButton disabled={!(mintData && mintData.taskId)} expand="block" mode="ios" fill="outline" color="primary" onClick={()=>{
                                    if(task&&task.owner == shortAddress){
                                        this.setShowActionSheet(true,"share")
                                    }else{
                                        this.setShowModal0(true)
                                    }
                                }}>{i18n.t("viewCommitRecords")}</IonButton>
                            </IonCol>
                            <IonCol size="12">
                                <IonButton disabled={!(mintData && mintData.taskId)} mode="ios" expand="block" fill="outline" color="primary" onClick={()=>{
                                    if(task&&task.owner == shortAddress){
                                        this.setShowActionSheet(true,"payment")
                                    }else{
                                        this.setShowModal1(true)
                                    }
                                }}>{i18n.t("viewSettlementRecords")}</IonButton>
                            </IonCol>

                        </IonRow>
                    </div>

                    <IonModal
                        swipeToClose={true}
                        mode="ios"
                        isOpen={showModal0}
                        cssClass='epoch-modal'
                        onDidDismiss={() => this.setShowModal0(false)}>
                        <div className="pool-modal">
                            {/*<h3 className="text-center">Create HashRate Pool</h3>*/}
                            <div className="pool-info-content">
                                <div className="pool-head">
                                    <IonRow>
                                        <IonCol size="3"><small>{i18n.t("address")}</small></IonCol>
                                        <IonCol size="3"><small>{i18n.t("period")}</small></IonCol>
                                        <IonCol size="3"><small>{i18n.t("serial")}</small></IonCol>
                                        <IonCol size="3"><small>NE</small></IonCol>
                                    </IonRow>
                                </div>
                                <div className="pool-info-detail">
                                    {
                                        shareData && shareData.map(value => {
                                            return <div className="pool-info-item">
                                                <IonRow>
                                                    <IonCol size="4"><small>{utils.ellipsisStr(value.user,3)}</small></IonCol>
                                                    <IonCol size="2"><small>{value.period}</small></IonCol>
                                                    <IonCol size="2"><small>{value.serial}</small></IonCol>
                                                    <IonCol size="4"><small>{utils.nFormatter(value.ne,3)}</small></IonCol>
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
                                        <IonCol size="3"><small>{i18n.t("address")}</small></IonCol>
                                        <IonCol size="3"><small>{i18n.t("period")}</small></IonCol>
                                        <IonCol size="3"><small>{i18n.t("amount")}</small></IonCol>
                                        <IonCol size="3"><small>{i18n.t("payTme")}</small></IonCol>
                                    </IonRow>
                                </div>
                                <div className="pool-info-detail">
                                    {
                                        paymentData.map(value => {
                                            return <div className="pool-info-item">
                                                <IonRow>
                                                    <IonCol size="3"><small>{utils.ellipsisStr(value.payee,3)}</small></IonCol>
                                                    <IonCol size="3"><small>{value.period}</small></IonCol>
                                                    <IonCol size="3"><small className="no-wrap">{utils.fromValue(value.amount,18).toFixed(8)}</small></IonCol>
                                                    <IonCol size="3"><small>{new Date(new BigNumber(value.payTime).multipliedBy(1000).toNumber()).toLocaleDateString()}
                                                    </small></IonCol>
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
                        isOpen={showModal}
                        cssClass='epoch-modal'
                        onDidDismiss={() => this.setShowModal(false)}>
                        <div className="pool-modal">
                            <h3 className="text-center">{i18n.t("update")} {i18n.t("hashRate")} {i18n.t("pool")}</h3>
                            <IonItem>
                                <IonLabel> <span>{i18n.t("name")}</span></IonLabel>
                                <IonInput value={name} color="primary" onIonChange={(e)=>{
                                    this.setState({name:e.detail.value})
                                }}/>
                            </IonItem>
                            <IonItem>
                                <IonLabel> <span>{i18n.t("begin")} {i18n.t("period")}</span></IonLabel>
                                <IonText >{begin}</IonText>
                                {/*<IonLabel><small></small></IonLabel>*/}
                            </IonItem>
                            <IonItem>
                                <IonLabel> <span>{i18n.t("rewardPerPeriod")}</span></IonLabel>
                                <IonInput disabled={!finished} placeholder="0.000" value={depositAmount} color="primary" onIonChange={(e)=>{
                                    this.setState({depositAmount:e.detail.value})
                                }}/>
                                <IonLabel><small>LIGHT</small></IonLabel>
                            </IonItem>
                            <IonItem>
                                <IonLabel> <span>{i18n.t("numberOfPeriods")}</span></IonLabel>
                                <IonInput placeholder="0" value={phase}  type="number"  color="primary" onIonChange={(e)=>{
                                    const v = e.detail.value;
                                    if(v && new BigNumber(v).toNumber()>0 &&
                                        new BigNumber(begin).plus(v).minus(1).toNumber()>=currentPeriod){
                                        this.setState({phase:v})
                                    }else {
                                        //this.setShowToast(true,"danger","Invalid Number of Periods!")
                                    }
                                }} onIonBlur={(e:any)=>{
                                    const v = e.target.value;
                                    this.setState({phase:v})
                                }}/>
                                {/*<IonLabel><small></small></IonLabel>*/}
                            </IonItem>
                            <IonItem>
                                <IonLabel> <span>Difficulty</span></IonLabel>
                                <IonInput disabled={!finished} placeholder="0" value={targetNE} type="number" color="primary" onIonChange={(e)=>{
                                    this.setState({targetNE:e.detail.value})
                                }}/>
                                <IonLabel slot="end"><small>M</small></IonLabel>
                            </IonItem>

                            {
                                new BigNumber(phase).toNumber()>0 || new BigNumber(depositAmount).toNumber()>0 || targetNE ?
                                    <div className="pool-display">
                                        {
                                            new BigNumber(phase).toNumber()>0 && <p>
                                                {i18n.t("thePeriodsIs")} {i18n.t("from")} <IonText color="secondary">
                                                <span>{finished?currentPeriod:task?.begin}</span>
                                            </IonText>
                                                &nbsp;{i18n.t("to")}&nbsp;
                                                <IonText color="secondary">
                                                    <span>{targetEnd}</span>
                                                </IonText>

                                            </p>
                                        }
                                        {
                                            targetNE &&
                                            <p>{i18n.t("neTips").replace("$$",`${utils.nFormatter(new BigNumber(targetNE).multipliedBy(1E6).toNumber(),3)}`)}</p>
                                        }

                                        {
                                            total < 0 && new BigNumber(phase).toNumber()>0 ?
                                                <p>
                                                    You will <IonText color="danger"><small>receive</small></IonText> <IonText color="warning">
                                                    <small>
                                                        {new BigNumber(total).multipliedBy(-1).toNumber()} LIGHT
                                                    </small></IonText> for <IonText color="danger"><small>return</small></IonText>
                                                </p>
                                                : total>0 &&
                                                <p>
                                                    You will <IonText color="danger"><small>deposit</small></IonText> <IonText color="warning">
                                                    <small>
                                                        {total} LIGHT
                                                    </small></IonText> for <IonText color="danger"><small>reward</small></IonText>
                                                </p>
                                        }

                                    </div>:""
                            }

                            <div className="pool-display">
                                <p>{i18n.t("poolTips1")}</p>
                                <p>{i18n.t("poolTips2")}</p>
                                <p>{i18n.t("poolTips3")}</p>
                            </div>
                        </div>

                        <IonRow>
                            <IonCol size="4">
                                <IonButton expand="block" mode="ios" fill="outline" onClick={() => {
                                    this.setShowModal(false)
                                }}>{i18n.t("cancel")}</IonButton>
                            </IonCol>
                            <IonCol size="8">
                                <IonButton disabled={!name || !depositAmount || !phase || new BigNumber(phase).toNumber()<=0 || !targetNE}  mode="ios" expand="block" onClick={() => {
                                    this.setShowLoading(true)
                                    this.commit().then(()=>{
                                        this.setShowLoading(false)
                                    }).catch(e=>{
                                        const err = typeof e =="string"?e:e.message;
                                        this.setShowToast(true,"danger",err)
                                        this.setShowLoading(false)
                                    })
                                }}>{i18n.t("commit")}</IonButton>
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

                    <IonActionSheet
                        mode="ios"
                        header="Select Period"
                        isOpen={showActionSheet}
                        onDidDismiss={() => this.setShowActionSheet(false,"")}
                        cssClass='my-custom-class'
                        buttons={optionButtons}
                    >
                    </IonActionSheet>

                    <IonAlert
                        mode="ios"
                        isOpen={showAlert2}
                        onDidDismiss={() => this.setShowAlert2(false)}
                        cssClass='my-custom-class'
                        header={"Customer input period"}
                        inputs={[
                            {
                                name: 'period',
                                type: 'number',
                                placeholder:"Period",
                                min: task?task.begin:0,
                                max: task?task.end:0,
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
                                handler: (v:any) => {
                                    if(op == "share"){
                                        this.setShowLoading(true)
                                        this.getShareByPeriod(parseInt(v["period"])).then(()=>{
                                            this.setShowLoading(false)
                                        }).catch(e=>{
                                            this.setShowLoading(false)
                                        })
                                    }else{
                                        this.setShowLoading(true)
                                        this.getPaymentByPeriod(parseInt(v["period"])).then(()=>{
                                            this.setShowLoading(false)
                                        }).catch(e=>{
                                            this.setShowLoading(false)
                                        })
                                    }
                                }
                            }
                        ]}
                    />

                    <IonPopover
                        mode="ios"
                        event={event}
                        isOpen={showPopover}
                        onDidDismiss={() => this.setShowPopover(false,undefined)}
                    >
                        <div className="popover-customer">
                            <small>{popMsg}</small>
                        </div>
                    </IonPopover>

                </div>
            </IonContent>
        </IonPage>;
    }
}

export default PoolInfo