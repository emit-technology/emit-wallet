import * as React from 'react';
import {
    IonButton,
    IonChip,IonBadge,
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonLoading,
    IonModal,
    IonPage,
    IonRow,
    IonSegment,
    IonSegmentButton,
    IonSelect,
    IonSelectOption,
    IonText,
    IonTitle,
    IonToast,
    IonToolbar, IonSearchbar, IonInfiniteScrollContent, IonInfiniteScroll
} from "@ionic/react";
import {addCircleOutline, chevronBack, chevronForwardOutline} from "ionicons/icons";
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
import rpc from "../../../rpc";
import selfStorage from "../../../utils/storage";
import PoolMiner from "../miner/pool";
import i18n from "../../../locales/i18n";
import interVar from "../../../interval";

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
    filterValue:any
    targetNE:any
    taskIdArray:Array<any>
    searchText:string
    pageSize:number,
    pageNo:number,
    noMore:boolean
}

class HashRatePool extends React.Component<any, State> {

    state: State = {
        showModal: false,
        scenes: MinerScenes.altar,
        showMine: false,
        data: [],
        account: {name: ""},
        depositAmount:0,
        phase:0,
        fromPeriod:0,
        name:"",
        showAlert:false,
        tx:{},
        showToast:false,
        showLoading:false,
        filterValue:"",
        currentPeriod:0,
        targetNE:"",
        taskIdArray:[],
        searchText:"",
        pageSize:15,
        pageNo:1,
        noMore:true
    }

    componentDidMount() {
        Plugins.StatusBar.setBackgroundColor({
            color: "#152955"
        }).catch(e => {
        })
        this.setShowLoading(true)
        this.init().then(()=>{
            this.setShowLoading(false)
        }).catch(e=>{
            this.setShowLoading(false)
        })

        // interVar.start(()=>{
        //     this.init().catch(e=>{
        //         console.error(e)
        //     })
        // },15 * 1000)
    }

    init = async () => {
        const {pageSize,pageNo,filterValue,searchText} = this.state;
        const account = await walletWorker.accountInfo()
        const poolTask: Array<PoolTask> = await poolRpc.getTask(account.addresses[ChainType.SERO],pageNo,pageSize,new BigNumber(filterValue).toNumber(),searchText)
            // await poolRpc.getTask(account.addresses[ChainType.SERO],pageNo,pageSize,MinerScenes._)

        let period = await epochPoolService.currentPeriod()
        selfStorage.setItem("epochCurrentPeriod",period);

        const poolMiner = new PoolMiner(MinerScenes.pool);
        const taskIdArray:any = await poolMiner.getEpochPollKeys()
        this.setState({
            account:account,
            data:poolTask,
            currentPeriod:period,
            fromPeriod:period,
            taskIdArray:taskIdArray.map((v:any)=>{
                return parseInt(v)
            }),
            noMore: !(poolTask && poolTask.length >= pageSize)
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
        let {name,phase,depositAmount,fromPeriod,scenes,account,targetNE} = this.state;

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

        const data = await epochPoolService.addTask(0,name,scenes,fromPeriod,(fromPeriod+parseInt(phase)-1),utils.toHex(new BigNumber(targetNE).multipliedBy(1E6)))
        const tx: Transaction | any = {
            from: account.addresses && account.addresses[ChainType.SERO],
            to: epochPoolService.address,
            cy: "LIGHT",
            gasPrice: "0x" + new BigNumber(1).multipliedBy(1e9).toString(16),
            chain: ChainType.SERO,
            amount: "0x0",
            feeCy: "LIGHT",
            value: utils.toHex(new BigNumber(depositAmount).multipliedBy(new BigNumber(phase)), 18),
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

    filterData = async (v:any) =>{
        const {account,searchText,pageSize,taskIdArray} = this.state;
        if(v == "my"){
            const data = await poolRpc.getMyTask(account.addresses[ChainType.SERO])
            this.setState({
                data:data,
                pageNo:1,
                noMore:true
            })
        }else if(v=="mining"){
            if(taskIdArray && taskIdArray.length==0){
                this.setState({
                    data:[],
                    pageNo:1,
                    noMore:true,
                })
            }else{
                // const ids = taskIdArray.map(v=>{
                //     return new BigNumber(v).toNumber()
                // })
                const data = await poolRpc.taskWithIds(taskIdArray,account.addresses[ChainType.SERO])
                this.setState({
                    data:data,
                    pageNo:1,
                    noMore:true,
                })
            }
        }else{
            //TODO
            const poolTask: Array<PoolTask> =  await poolRpc.getTask(account.addresses[ChainType.SERO],1,pageSize,new BigNumber(v).toNumber(),searchText)
            this.setState({
                data:poolTask,
                noMore: !(poolTask && poolTask.length >= pageSize),
                pageNo:1
            })
        }
    }

    setSearchText = async (v:string)=>{
        const {account,filterValue,pageSize,taskIdArray} = this.state;
        if(filterValue=="my"){
            const data = await poolRpc.getMyTask(account.addresses[ChainType.SERO])
            this.setState({
                data:data,
                searchText:v,
                pageNo:1
            })
        }else if(filterValue=="mining"){

        }else{
            const poolTask: Array<PoolTask> =  await poolRpc.getTask(account.addresses[ChainType.SERO],1,pageSize,new BigNumber(filterValue).toNumber(),v)
            this.setState({
                data:poolTask,
                searchText:v,
                noMore: !(poolTask && poolTask.length >= pageSize),
                pageNo:1
            })
        }
    }

    loadMore = async (event?:any) =>{
        const {pageSize,pageNo,searchText,account,filterValue,data} = this.state;
        const poolTask: Array<PoolTask> =  await poolRpc.getTask(account.addresses[ChainType.SERO],pageNo+1,pageSize,new BigNumber(filterValue).toNumber(),searchText)
        if(poolTask.length == 0){
            if(event){
                event.target.disabled = true;
            }
            this.setState({
                noMore:true
            })
        }else{
            this.setState({
                pageNo:pageNo+1,
                data:data.concat(poolTask),
            })
        }
        if(event) {
            event.target.complete();
        }
    }

    render() {
        const {showModal, scenes, phase,depositAmount,name,searchText,taskIdArray,targetNE,filterValue, data,
            currentPeriod,showLoading,noMore,showToast,showAlert,color,toastMessage,tx,pageNo,pageSize
        } = this.state;
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
                        {i18n.t("team").toUpperCase()} {i18n.t("mining").toUpperCase()}
                    </IonTitle>
                    <IonIcon src={addCircleOutline} style={{color: "#edcc67"}} size="large" slot="end" onClick={() => {
                        this.setShowModal(true)
                    }}/>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <div className="pool-content">
                    <IonSearchbar value={searchText} mode="ios" onIonChange={e => this.setSearchText(e.detail.value!)}/>
                    <IonSegment mode="ios" color="primary" value={filterValue}
                                onIonChange={e => {
                                    console.log(e.detail.value)
                                    this.setState({
                                        filterValue:e.detail.value
                                    })
                                    this.setShowLoading(true)
                                    this.filterData(e.detail.value).then(()=>{
                                        this.setShowLoading(false)
                                    }).catch(err=>{
                                        this.setShowLoading(false)
                                        console.error(err)
                                    })
                                }}>
                        <IonSegmentButton value="">
                            <IonLabel>{i18n.t("all")}</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value={MinerScenes.altar.toString()}>
                            <IonLabel>ALTAR</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value={MinerScenes.chaos.toString()}>
                            <IonLabel>CHAOS</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="my">
                            <IonLabel>{i18n.t("my")}</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="mining">
                            <IonLabel>{i18n.t("mining").toUpperCase()}</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                    <div>
                        {
                            data.map((value, index) => {
                                return <div className="pool-item" onClick={() => {
                                    url.poolInfo(value.taskId)
                                }}>
                                    <IonItem mode="ios" lines="none" detail={true} detailIcon={chevronForwardOutline}>
                                        <IonLabel className="ion-text-wrap">
                                            <IonRow>
                                                <IonCol size="6">
                                                    <p>
                                                    <IonText color="primary">
                                                        <p><span>{value.name}</span></p>
                                                    </IonText>
                                                    </p>
                                                    <IonText color="secondary">
                                                        <p>
                                                            <small><IonText color="primary">{i18n.t("periods")}: </IonText></small>
                                                            <span><IonText>{new BigNumber(value.end).minus(new BigNumber(value.begin)).plus(1).toNumber()}</IonText></span>
                                                        </p>
                                                        <p>
                                                            <span><IonText>{utils.fromValue(value.reward,18).toFixed(3,1)}</IonText></span>
                                                            <small><IonText color="medium"> L/{i18n.t("period")}</IonText></small>
                                                        </p>
                                                    </IonText>
                                                    <div>
                                                        <IonBadge color="primary"><span>{MinerScenes[value.scenes].toUpperCase()}</span></IonBadge>
                                                    </div>
                                                </IonCol>
                                                <IonCol size="6">
                                                    <p>
                                                        <IonText color="secondary">
                                                            <small><IonText color="primary">{i18n.t("price")}: </IonText></small>
                                                            <small><b>{utils.fromValue(value.currentPrice,18).toFixed(3)}</b></small>
                                                            <small><IonText color="medium"> L/100M</IonText></small>
                                                        </IonText>
                                                    </p>

                                                    <p>
                                                        <IonText color="secondary">
                                                            <small><IonText color="primary">{i18n.t("total")}: </IonText></small>
                                                            <small><b>{utils.nFormatter(value.currentTotalNE,3)}</b></small>
                                                            <small><IonText color="medium"> NE</IonText></small>
                                                        </IonText>
                                                    </p>
                                                    <p>
                                                        <IonText color="secondary">
                                                            <small><IonText color="primary">{i18n.t("total")}: </IonText></small>
                                                            <small><b>{value.currentUser}</b></small>
                                                            <small><IonText color="medium"> Users</IonText></small>
                                                        </IonText>
                                                    </p>
                                                    <p>
                                                        <IonText color="secondary">
                                                            <small><IonText color="primary">Difficulty: </IonText></small>
                                                            <small><b>{utils.nFormatter(value.targetNE,3)}</b></small>
                                                            <small><IonText color="medium"> NE</IonText></small>
                                                        </IonText>
                                                    </p>
                                                </IonCol>
                                            </IonRow>
                                            <div className="mining">
                                                {taskIdArray.indexOf(value.taskId)>-1&&<IonBadge color="danger"><small>MINING...</small></IonBadge>}
                                                {new BigNumber(value.end).minus(currentPeriod).toNumber()<0
                                                    &&<IonBadge color="medium"><small>CLOSED</small></IonBadge>}
                                            </div>
                                        </IonLabel>
                                    </IonItem>
                                </div>
                            })}
                        {
                            !noMore &&
                            <div onClick={()=>this.loadMore()}>
                                <p><IonText color="primary">Load More</IonText></p>
                            </div>
                        }
                    </div>
                </div>
                <IonInfiniteScroll onIonInfinite={(e)=>this.loadMore(e)}>
                    <IonInfiniteScrollContent
                        loadingSpinner="bubbles"
                        loadingText="Loading more data..."
                    >
                    </IonInfiniteScrollContent>
                </IonInfiniteScroll>

                <IonModal
                    swipeToClose={true}
                    mode="ios"
                    isOpen={showModal}
                    cssClass='epoch-modal'
                    onDidDismiss={() => this.setShowModal(false)}>
                    <div className="pool-modal">
                        <h3 className="text-center">{i18n.t("create")} {i18n.t("hashRate")} {i18n.t("pool")}</h3>
                        <IonItem>
                            <IonLabel> <span>{i18n.t("name")}</span></IonLabel>
                            <IonInput placeholder={i18n.t("name")} color="primary" onIonChange={(e)=>{
                                this.setState({name:e.detail.value})
                            }}/>
                        </IonItem>
                        <IonItem>
                            <IonLabel> <span>{i18n.t("scenes")}</span></IonLabel>
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
                            <IonLabel> <span>{i18n.t("rewardPerPeriod")}</span></IonLabel>
                            <IonInput placeholder="0.000" color="primary" onIonChange={(e)=>{
                                this.setState({depositAmount:e.detail.value})
                            }}/>
                            <IonLabel><small>LIGHT</small></IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel> <span>{i18n.t("numberOfPeriods")}</span></IonLabel>
                            <IonInput placeholder="0" type="number"  color="primary" onIonChange={(e)=>{
                                this.setState({phase:e.detail.value})
                            }}/>
                            {/*<IonLabel><small></small></IonLabel>*/}
                        </IonItem>
                        {/*<IonItem>*/}
                        {/*    <IonLabel> <span>Period</span></IonLabel>*/}
                        {/*    <IonText color="primary">Start: {fromPeriod} {new BigNumber(phase).toNumber()>0 && `, End: ${new BigNumber(fromPeriod).plus(new BigNumber(phase)).minus(1).toNumber()}`}</IonText>*/}
                        {/*</IonItem>*/}
                        <IonItem>
                            <IonLabel> <span>Difficulty</span></IonLabel>
                            <IonInput placeholder="0" type="number" color="primary" onIonChange={(e)=>{
                                this.setState({targetNE:e.detail.value})
                            }}/>
                            {/*<IonText color="primary">{utils.nFormatter(new BigNumber(targetNE).toNumber(),3)}</IonText>*/}
                            <IonLabel><small>M</small></IonLabel>
                        </IonItem>
                        {
                            new BigNumber(phase).toNumber()>0 || new BigNumber(depositAmount).toNumber()>0 || targetNE ?
                            <div className="pool-display">
                                {
                                    new BigNumber(phase).toNumber()>0 && <p>
                                        {i18n.t("thePeriodsIs")} {i18n.t("from")} <IonText color="secondary">
                                        <span>{currentPeriod}</span>
                                    </IonText>
                                        &nbsp;{i18n.t("to")}&nbsp;
                                        <IonText color="secondary">
                                            <span>{new BigNumber(phase).plus(currentPeriod).minus(1).toNumber()}</span>
                                        </IonText>

                                    </p>
                                }
                                {
                                    new BigNumber(depositAmount).toNumber()>0 && <p>
                                        {i18n.t("total")} {i18n.t("deposit")} <IonText color="secondary">
                                    <span>
                                        {new BigNumber(depositAmount).multipliedBy(phase).toFixed(5,1)}
                                    </span>
                                    </IonText> <small><IonText color="medium"> LIGHT</IonText></small>
                                    </p>
                                }
                                {
                                  targetNE &&
                                  <p>{i18n.t("neTips").replace("$$",`${utils.nFormatter(new BigNumber(targetNE).multipliedBy(1E6).toNumber(),3)}`)}</p>
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
                            <IonButton disabled={!name || !depositAmount || !phase || !targetNE} mode="ios" expand="block" onClick={() => {
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


            </IonContent>
        </IonPage>;
    }
}

export default HashRatePool