import * as React from 'react';
import {
    IonButton,
    IonChip,
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonItemDivider,
    IonLabel,
    IonList,
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
    IonToolbar
} from "@ionic/react";
import ConfirmTransaction from "./ConfirmTransaction";
import epochService from "../contract/epoch/sero";
import {MinerScenes, MintData} from "../pages/epoch/miner";
import {AccountModel, ChainType, NftInfo, Transaction} from "../types";
import BigNumber from "bignumber.js";
import * as utils from "../utils";
import {nFormatter} from "../utils";
import rpc from "../rpc";
import {DeviceInfo, DriverInfo, Period, UserInfo} from "../contract/epoch/sero/types";
import Countdown from 'react-countdown';
import {chevronBack} from "ionicons/icons";
import {Plugins} from "@capacitor/core";
import url from "../utils/url";
import walletWorker from "../worker/walletWorker";
import altarMiner from "../pages/epoch/miner/altar";
import chaosMiner from "../pages/epoch/miner/chaos";

import {interVarEpoch} from "../interval";
import './EpochOrigin.scss';
import {EPOCH_SETTLE_TIME} from "../config";
import EpochAttribute from "./EpochAttribute";
import i18n from "../locales/i18n";
import epochNameService from "../contract/epoch/sero/name";
import selfStorage from "../utils/storage";
import CardTransform from "./CardTransform";

interface State {
    amount: any
    showAlert: boolean
    tx: any
    showToast: boolean
    toastMessage?: string
    color?: string
    selectAxe: string
    checked: boolean
    showLoading: boolean
    periods: Array<Period>
    nexPeriods: Array<Period>
    myPeriods: Array<Period>

    isMining: boolean
    mintData: MintData
    userInfo?: UserInfo
    device?: DeviceInfo
    showModal: boolean
    account?: AccountModel
    tkt: Array<NftInfo>
    estimateLight:string

    selectDevice?: DeviceInfo

    minNE:any
    showModalDevice:boolean
}

interface Props {
    scenes: MinerScenes
    loadDevice:(d?:DeviceInfo)=>void
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
        checked: false,
        showLoading: false,

        isMining: false,
        mintData: {ne: "0", accountId: "", accountScenes: "", scenes: "", phash: "", address: "", index: ""},
        showModal: false,
        tkt: [],
        periods: [],
        nexPeriods: [],
        myPeriods: [],
        estimateLight:"0",
        minNE:0,
        showModalDevice:false
    }


    componentDidMount() {
        Plugins.StatusBar.setBackgroundColor({
            color: "#152955"
        }).catch(e => {
        })
        this.init().then(() => {
            this.props.loadDevice(this.state.device)
        }).catch(e => {
            console.error(e)
        });
    }

    init = async () => {
        const {scenes} = this.props
        const account = await walletWorker.accountInfo()
        this.miner().setMiner(account.accountId ? account.accountId : "")
        const fromAddress = account.addresses[ChainType.SERO];
        const userInfo = await epochService.userInfo(scenes, fromAddress)
        const alis = await epochNameService.getDriverName(scenes,fromAddress);
        if(userInfo.driver){
            userInfo.driver.alis = alis
        }
        const device = await epochService.lockedDevice(scenes, fromAddress)
        if(device.category && device.ticket.indexOf("0x0000000000")==-1){
            device.alis = await epochNameService.getDeviceName(device.ticket)
        }
        const period = new BigNumber(userInfo.currentPeriod).toNumber();//new BigNumber(userInfo.settlementPeriod).comparedTo(new BigNumber(userInfo.currentPeriod)) == -1?new BigNumber(userInfo.currentPeriod).toNumber():new BigNumber(userInfo.settlementPeriod).toNumber();
        const myPeriod = new BigNumber(userInfo.settlementPeriod).toNumber();
        const periods = await epochService.userPeriodInfo(scenes, period, fromAddress)
        const nexPeriods = await epochService.userPeriodInfo(scenes, period + 1, fromAddress)

        let myPeriods: Array<Period> = [];
        if (myPeriod > 0 && myPeriod != period) {
            if(myPeriod != period+1){
                myPeriods = await epochService.userPeriodInfo(scenes, new BigNumber(userInfo.settlementPeriod).toNumber(), fromAddress)
            }else{
                myPeriods = nexPeriods;
            }
        } else {
            myPeriods = periods;
        }

        if (account && userInfo && userInfo.pImage && userInfo && userInfo.pImage.hash && userInfo && userInfo.pImage.serial) {
            this.miner().init({
                phash: userInfo.pImage.hash,
                address: await utils.getShortAddress(fromAddress),
                index: utils.toHex(userInfo.pImage.serial),
                scenes: scenes,
                accountScenes: this.miner().uKey(),
                accountId: account.accountId
            }).then(()=>{
                this.mintState().catch(e=>{
                    console.error(e)
                })
            }).catch(e=>{
                console.error(e)
            })
        }
        // await this.mintState();
        const tkt = await this.getDevice()
        const isMining = await this.miner().isMining()

        const estimateLight = await this.convertPeriod(device,nexPeriods,scenes,fromAddress)
        const minNE = await epochService.minPowNE()
        const minValue = new BigNumber(minNE).plus(utils.toValue(5000000,0)).toString(10)
        this.setState({
            isMining: isMining,
            userInfo: userInfo,
            device: device,
            account: account,
            tkt: tkt,
            periods: periods,
            nexPeriods: nexPeriods,
            myPeriods: myPeriods,
            estimateLight:estimateLight,
            minNE:minValue
        })

        if (device && device.category) {
            const items: any = document.getElementsByClassName("display-n");
            for (let item of items) {
                item.style.display = "inherit";
            }
        }else{
            const items: any = document.getElementsByClassName("display-n");
            for (let item of items) {
                item.style.display = "none";
            }
        }

        if (isMining) {
            interVarEpoch.start(() => {
                this.mintState().then(() => {
                }).catch(e => {
                    console.error(e)
                })
            }, 1 * 1000)
        } else {
            interVarEpoch.stop()
        }
    }

    convertPeriod = async (device:DeviceInfo,periods:Array<Period>,scenes:MinerScenes,fromAddress:string):Promise<string>=>{
        if(device && periods && periods.length ==1 && scenes == MinerScenes.chaos){
            if(new BigNumber(periods[0].ne).toNumber()>0){
                const c = new BigNumber(periods[0].total).toNumber() > 0 ?
                    new BigNumber(periods[0].pool).multipliedBy(new BigNumber(periods[0].ne))
                        .dividedBy(new BigNumber(periods[0].total)):new BigNumber(0)
                const driverOrigin:DriverInfo = await epochService.driverInfo(MinerScenes.chaos,fromAddress)
                const m1 = new BigNumber(driverOrigin.capacity).comparedTo(c) == -1?new BigNumber(driverOrigin.capacity):c;
                const d1 = utils.fromValue(m1.multipliedBy(new BigNumber(driverOrigin.rate)),18)
                const m2 = d1.comparedTo(new BigNumber(device.capacity))==-1?d1:new BigNumber(device.capacity)
                return utils.fromValue(m2.multipliedBy(device.rate),36).toFixed(3,1)
            }
        }
        return "0"
    }

    miner = () => {
        return this.props.scenes == MinerScenes.altar ? altarMiner : chaosMiner;
    }

    done = async () => {
        this.setShowLoading(true)
        const data = await epochService.done(this.props.scenes)
        await this.do(data)
    }

    prepare = async () => {
        const {mintData,amount,minNE} = this.state;
        this.setShowLoading(true)

        if (mintData.ne && new BigNumber(mintData.ne).toNumber()>0) {
            if(new BigNumber(mintData && mintData.ne?mintData.ne:0).comparedTo(new BigNumber(minNE)) == 1) {
                const data = await epochService.prepare(this.props.scenes, mintData.nonceDes?mintData.nonceDes:"0")
                await this.do(data)
            }else{
                if(new BigNumber(amount).toNumber()>0){
                    const data = await epochService.prepare(this.props.scenes, "0")
                    await this.do(data)
                }else{
                    return Promise.reject(`${i18n.t("minNE")} ${minNE}`)
                }
            }
        }else{
            const data = await epochService.prepare(this.props.scenes, "0")
            await this.do(data)
        }

    }

    do = async (data: string) => {
        const {account, mintData, device, amount, selectAxe, checked} = this.state;
        if (mintData.scenes == MinerScenes.chaos && !selectAxe && !checked && !device?.category) {
            return Promise.reject(i18n.t("pleaseSelectAxe"))
        }
        if (account) {
            let tx: Transaction | any = {
                from: account.addresses && account.addresses[ChainType.SERO],
                to: epochService.address,
                cy: Currency,
                gasPrice: "0x" + new BigNumber(1).multipliedBy(1e9).toString(16),
                chain: ChainType.SERO,
                amount: "0x0",
                feeCy: Currency,
                value: utils.toHex(amount, 18),
                data: data,
            }
            if (!checked && selectAxe) {
                tx.catg = Category
                tx.tkt = selectAxe.split("$")[0]
                tx.tickets = [{
                    Category: Category,
                    Value: selectAxe.split("$")[0]
                }]
            }
            if (checked) {
                tx.value = "0x0";
            }

            tx.gas = await epochService.estimateGas(tx)
            if (tx.gas && tx.gasPrice) {
                tx.feeValue = await epochService.tokenRate(tx.gasPrice, tx.gas);
            }
            this.setState({
                tx: tx,
                showAlert: true
            })
            this.setShowLoading(false)
            this.setShowModal(false)
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
            rpc.getTransactionByHash(hash,chain).then((rest:any) => {
                if (rest && new BigNumber(rest.blockNumber).toNumber() > 0) {
                    // this.setShowToast(true,"success","Commit Successfully!")
                    clearInterval(intervalId);
                    // url.transactionInfo(chain,hash,Currency);
                    this.setShowLoading(false)
                    this.init().then(()=>{
                        this.props.loadDevice(this.state.device)
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
            amount: "0",
            tx: {},
            selectAxe: "",
            periods: [],
            nexPeriods: [],
            myPeriods: [],
            checked:false
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

    setOperate = (v: string) => {
        this.setState({
            checked: v == "stop"
        })
    }

    // @ts-ignore
    renderer = ({hours, minutes, seconds, completed}) => {
        if (completed) {
            return <span></span>
        }
        let h = hours, m = minutes, s = seconds;
        if (new BigNumber(hours).toNumber() <= 9) {
            h = "0" + hours;
        }
        if (new BigNumber(minutes).toNumber() <= 9) {
            m = "0" + minutes;
        }
        if (new BigNumber(seconds).toNumber() <= 9) {
            s = "0" + seconds;
        }
        return <div className="countdown">{h}:{m}:{s}</div>;
    };

    getDevice = async ():Promise<Array<NftInfo>> => {
        const rest:any = selfStorage.getItem(utils.ticketKey(ChainType.SERO))
        return rest ?rest["EMIT_AX"]:[]
    }

    operate = async () => {
        const {isMining} = this.state;
        if (isMining) {
            await this.stop()
        } else {
            await this.start()
        }
        await this.init().catch()
    }

    start = async () => {
        const {scenes} = this.props
        const {account, userInfo} = this.state;

        if (account && userInfo && userInfo.pImage && userInfo && userInfo.pImage.hash && userInfo && userInfo.pImage.serial) {
            await this.miner().start({
                phash: userInfo.pImage.hash,
                address: await utils.getShortAddress(account.addresses[ChainType.SERO]),
                index: utils.toHex(userInfo.pImage.serial),
                scenes: scenes,
                accountScenes: this.miner().uKey(),
                accountId: account.accountId
            })
            this.setState({
                isMining: true
            })
        }
    }

    stop = async () => {
        await this.miner().stop();
        this.setState({
            isMining: false
        })
        this.setShowModal(true)
    }

    async mintState() {
        const rest = await this.miner().mintState()
        const {mintData, isMining} = this.state;
        if (isMining || rest.nonce != mintData.nonce || rest.ne != mintData.ne) {
            this.setState({
                mintData: rest
            })
        }
    }

    setShowModal = (f: boolean) => {
        this.setState({
            showModal: f
        })
    }

    setShowModalDevice = (f:boolean)=>{
        this.setState({
            showModalDevice:f
        })
    }

    renderStatic = (periods: Array<Period>, b: boolean, text: string, period: number) => {
        const {scenes} = this.props;
        const {userInfo} = this.state;
        const t = <IonText>{text} <span className="font-weight-800 font-ep">{period}</span></IonText>;
        const nextPeriodTime = (userInfo && new BigNumber(userInfo.lastUpdateTime).toNumber() > 0
            ? new BigNumber(userInfo.lastUpdateTime).toNumber() + EPOCH_SETTLE_TIME : 0) * 1000;
        return <>
            {
                scenes == MinerScenes.altar && periods.length == 2 ?
                    <div className="ctx">
                        <IonItemDivider mode="md">
                            <IonText color="dark">{t}</IonText> {b &&
                        <Countdown date={nextPeriodTime} renderer={this.renderer}/>}</IonItemDivider>
                        <IonRow>
                            <IonCol size="3"></IonCol>
                            <IonCol size="3">{i18n.t("my")}</IonCol>
                            <IonCol size="3">{i18n.t("total")}</IonCol>
                            <IonCol size="3">{i18n.t("estimateReceive")}</IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="3">HR({new BigNumber(periods[0].pool).multipliedBy(100).dividedBy(
                                new BigNumber(periods[0].pool).plus(new BigNumber(periods[1].pool))
                            ).toFixed(0)}%)</IonCol>
                            <IonCol size="3">{utils.nFormatter(periods[0].ne, 2)}(NE)</IonCol>
                            <IonCol size="3">{utils.nFormatter(periods[0].total, 2)}(NE)</IonCol>
                            <IonCol size="3">{
                                utils.nFormatter(new BigNumber(periods[0].total).toNumber() > 0 ? utils.fromValue(new BigNumber(periods[0].pool).multipliedBy(new BigNumber(periods[0].ne))
                                    .dividedBy(new BigNumber(periods[0].total)), 18) : 0, 2)}(EN)</IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="3">BL({new BigNumber(periods[1].pool).multipliedBy(100).dividedBy(
                                new BigNumber(periods[0].pool).plus(new BigNumber(periods[1].pool))
                            ).toFixed(0)}%)</IonCol>
                            <IonCol size="3">{utils.nFormatter(utils.fromValue(periods[1].ne, 18), 2)}(L)</IonCol>
                            <IonCol size="3">{utils.nFormatter(utils.fromValue(periods[1].total, 18), 2)}(L)</IonCol>
                            <IonCol size="3">{
                                utils.nFormatter(new BigNumber(periods[1].total).toNumber() > 0 ? utils.fromValue(new BigNumber(periods[1].pool).multipliedBy(new BigNumber(periods[1].ne))
                                    .dividedBy(new BigNumber(periods[1].total)), 18).toFixed(0, 1) : 0, 2)}(EN)
                            </IonCol>
                        </IonRow>
                    </div>
                    :
                    scenes == MinerScenes.chaos && periods.length == 1 &&
                    <div className="ctx">
                        <IonItemDivider mode="md"><IonText color="dark">{t}</IonText> {b &&
                        <Countdown date={nextPeriodTime} renderer={this.renderer}/>}</IonItemDivider>
                        <IonRow>
                            <IonCol size="3"></IonCol>
                            <IonCol size="3">{i18n.t("my")}</IonCol>
                            <IonCol size="3">{i18n.t("total")}</IonCol>
                            <IonCol size="3">{i18n.t("estimateReceive")}</IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="3">HR</IonCol>
                            <IonCol size="3">{utils.nFormatter(periods[0].ne, 2)}(NE)</IonCol>
                            <IonCol size="3">{utils.nFormatter(periods[0].total, 2)}(NE)</IonCol>
                            <IonCol size="3">{
                                utils.nFormatter(new BigNumber(periods[0].total).toNumber() > 0 ? utils.fromValue(new BigNumber(periods[0].pool).multipliedBy(new BigNumber(periods[0].ne))
                                    .dividedBy(new BigNumber(periods[0].total)), 18).toFixed(0, 1) : 0, 2)}(EN)
                            </IonCol>
                        </IonRow>
                    </div>
            }
        </>
    }

    onSelectDevice = async (value: string) => {
        interVarEpoch.stop()
        if (value) {
            const ticket = value.split("$")[0];
            const alis = value.split("$")[1]
            const {account} = this.state;
            const rest = await epochService.axInfo(Category, ticket, account && account.addresses[ChainType.SERO])
            rest.alis = alis;
            this.setState({
                selectDevice: rest,
                selectAxe: `${ticket}$${alis}`
            })
        }else {
            this.setState({
                selectAxe: value
            })
        }
        interVarEpoch.start(() => {
            this.mintState().then(() => {
            }).catch(e => {
                console.error(e)
            })
        }, 1 * 1000)
    }

    render() {
        const {scenes} = this.props;
        // const {showModal, mintData, device, userInfo, setShowModal, tkt,periods} = this.props;
        const {
            periods, showAlert, tx, toastMessage, showLoading,showModalDevice,
            color, showToast, selectAxe, checked, amount, isMining,
            mintData, device, userInfo, showModal, tkt, nexPeriods, selectDevice, myPeriods,estimateLight
        } = this.state;

        const period = new BigNumber(userInfo ? userInfo.currentPeriod : 0).toNumber();
        const myPeriod = new BigNumber(userInfo ? userInfo.settlementPeriod : 0).toNumber();

        // console.log("userInfo",userInfo)
        // console.log("deive",device)
        return <IonPage>
            <IonContent fullscreen color="light">
                <IonHeader>
                    <IonToolbar color="primary" mode="ios" className="heard-bg">
                        <IonIcon src={chevronBack} size="large"  style={{color: "#edcc67"}} slot="start" onClick={() => {
                            Plugins.StatusBar.setBackgroundColor({
                                color: "#194381"
                            }).catch(e => {
                            })
                            url.back()
                        }}/>
                        <IonTitle className="text-center text-bold" style={{
                            color: "#edcc67",
                            textTransform: "uppercase"
                        }}>{MinerScenes[this.props.scenes]}</IonTitle>
                        <IonLabel slot="end">
                            <img src={"./assets/img/epoch/help.png"} width={28} onClick={() => {
                                const help_url = scenes == MinerScenes.altar ?
                                    "https://docs.emit.technology/emit-documents/emit-epoch/origin-universe/altar-scenes" :
                                    "https://docs.emit.technology/emit-documents/emit-epoch/origin-universe/chaos-scenes";
                                Plugins.Browser.open({url: help_url, presentationStyle: "popover"}).catch(e => {
                                    console.error(e)
                                })
                            }}/>
                        </IonLabel>
                    </IonToolbar>
                </IonHeader>

                <div className="content-ion">

                    <div style={{padding: "0 10vw", minHeight: "125px"}}>
                        <EpochAttribute device={device} driver={userInfo && userInfo.driver} showDevice={true}
                                        showDriver={true} scenes={scenes} doUpdate={()=>this.init()}/>
                    </div>
                    <div onClick={(e) => {
                        e.stopPropagation();
                        this.setShowModalDevice(true)
                    }}>
                        {this.props.children}
                    </div>
                    <div>
                        <div className="hashrate-box">
                            <div className="hashrate-box-display"  onClick={(e) => {
                                e.stopPropagation();
                                this.setShowModal(true)
                                this.init().catch()
                            }}>
                                {mintData && mintData.ne &&
                                <div className="ne-text">
                                    {mintData && mintData.ne}<span style={{letterSpacing: "2px", color: "#f0f"}}>NE</span>
                                </div>
                                }
                            </div>
                            {mintData && mintData.nonce && <div className="nonce-text">
                                <span className="nonce-span">{mintData && mintData.nonce}</span><br/>
                            </div>}
                            <IonRow>
                                <IonCol>
                                    <div className="start-btn" style={{background: !!isMining ? "red":"green"}} onClick={(e) => {
                                        e.stopPropagation();
                                        this.operate().then(() => {
                                        }).catch((e) => {
                                            console.error(e)
                                        })
                                    }}>
                                        {!!isMining ? `${new BigNumber(mintData.hashrate ? mintData.hashrate.o : 0).toFixed(0)}/s` : "HASHRATE"}
                                    </div>
                                </IonCol>
                                <IonCol>
                                    <div className="start-btn" style={{border: "2px solid #ddd"}} onClick={(e) => {
                                        e.stopPropagation();
                                        this.setShowModal(true)
                                        this.init().catch()
                                    }}>
                                        {scenes == MinerScenes.altar ? i18n.t("forging"):i18n.t("mining")}
                                    </div>
                                </IonCol>
                            </IonRow>
                        </div>
                    </div>
                </div>

                <IonModal
                    mode="ios"
                    isOpen={showModal}
                    cssClass='epoch-modal'
                    swipeToClose={true}
                    onDidDismiss={() => this.setShowModal(false)}>
                    <div className="epoch-md">
                        <div>
                            <div className="modal-header">{scenes == MinerScenes.altar ? i18n.t("forging"):i18n.t("mining")}</div>
                            {/*<div className="close" onClick={() => {*/}
                            {/*    this.props.setShowModal(false)*/}
                            {/*}}>X*/}
                            {/*</div>*/}
                        </div>
                        <IonList>
                            {
                                device && device.category &&
                                <div style={{padding: "12px"}}>
                                    <IonRow>
                                        <IonCol size="1"></IonCol>
                                        <IonCol>
                                            <IonSegment mode="ios"
                                                        onIonChange={(e: any) => this.setOperate(e.detail.value)}
                                                        value={checked ? "stop" : "refining"}>
                                                <IonSegmentButton value="refining">
                                                    <IonLabel>{i18n.t("prepare")}</IonLabel>
                                                </IonSegmentButton>
                                                <IonSegmentButton value="stop">
                                                    <IonLabel>{i18n.t("retrieve")}</IonLabel>
                                                </IonSegmentButton>
                                            </IonSegment>
                                        </IonCol>
                                        <IonCol size="1"></IonCol>
                                    </IonRow>
                                </div>
                            }
                            {
                                ((device && device.category || tkt && tkt.length > 0) && !checked) &&
                                <>
                                    <IonItem>
                                        <IonLabel><span className="font-md">{i18n.t("changeAxe")}</span></IonLabel>
                                        <IonSelect mode="ios" value={selectAxe} onIonChange={(e: any) => {
                                            this.onSelectDevice(e.detail.value).catch(e => {
                                                console.error(e)
                                            })
                                        }
                                        }>
                                            {
                                                MinerScenes.altar == mintData.scenes &&
                                                <IonSelectOption value={""}>{
                                                    device && device.category ? i18n.t("notChange") : i18n.t("newAxe")
                                                }</IonSelectOption>
                                            }
                                            {
                                                MinerScenes.chaos == mintData.scenes && device && device.category &&
                                                <IonSelectOption value={""}>{i18n.t("notChange")}</IonSelectOption>
                                            }
                                            {
                                                userInfo && new BigNumber(userInfo.currentPeriod).toNumber() >= new BigNumber(userInfo.settlementPeriod).toNumber()
                                                && tkt && tkt.map(value => {
                                                    return <IonSelectOption
                                                        value={`${value.tokenId}$${value && value.meta && value.meta.alis}`}>{value && value.meta && value.meta.alis?`(${value.meta.alis})`:""} {value.tokenId}</IonSelectOption>
                                                })
                                            }
                                        </IonSelect>
                                    </IonItem>
                                </>
                            }
                            {
                                selectAxe &&
                                <div style={{padding: "0 12px"}}>
                                    <EpochAttribute device={selectDevice} showDevice={true} showDriver={false}/>
                                </div>
                            }
                            {
                                !checked && <IonItem>
                                    <IonLabel><span className="font-md">HashRate(HR)</span></IonLabel>
                                    <IonChip color="tertiary"
                                             className="font-weight-800 font-ep">{mintData && mintData.ne} NE</IonChip>
                                </IonItem>
                            }
                            {
                                mintData.scenes == MinerScenes.altar && !checked && <IonItem>
                                    <IonLabel position="stacked">Burn LIGHT(BL)</IonLabel>
                                    <IonInput mode="ios" placeholder="0" value={amount} onIonChange={(v) => {
                                        this.setState({
                                            amount: v.detail.value
                                        })
                                    }}/>
                                </IonItem>
                            }
                        </IonList>
                        <div className="epoch-desc">
                            {
                                scenes == MinerScenes.chaos && <div>
                                    {i18n.t("currentPeriod")} {i18n.t("estimateReceive")} <IonText color="primary" className="font-weight-800 font-ep">{nFormatter(estimateLight,3)}</IonText> LIGHT
                                </div>
                            }
                            {/*{*/}
                            {/*    new BigNumber(mintData && mintData.ne?mintData.ne:0).comparedTo(new BigNumber(minNE)) == -1&&*/}
                            {/*    <div><IonText color="warning">{i18n.t("minNE")}</IonText><IonChip color="tertiary">{minNE.toLocaleString()} NE</IonChip></div>*/}
                            {/*}*/}
                            {
                                userInfo && userInfo.pImage && <IonText color="primary"><span>{`Serial: ${new BigNumber(userInfo.pImage.serial).plus(1).toNumber()}`}</span></IonText>
                            }
                            {
                                this.renderStatic(nexPeriods, true, i18n.t("currentPeriod"), period + 1)
                            }
                            {
                                this.renderStatic(periods, false, i18n.t("lastPeriod"), period)
                            }
                            {
                                this.renderStatic(myPeriods, false, i18n.t("myLastPeriod"), myPeriod)
                            }
                        </div>
                        <div className="btn-bottom">
                            <IonRow>
                                <IonCol size="4">
                                    <IonButton expand="block" mode="ios" fill={"outline"} color="primary"
                                               onClick={(e) => {
                                                   e.stopPropagation();
                                                   this.setShowModal(false)
                                               }}>{i18n.t("cancel")}</IonButton>
                                </IonCol>
                                <IonCol size="8">
                                    <IonButton expand="block" mode="ios" color="primary"
                                               disabled={
                                                   checked && userInfo && new BigNumber(userInfo.currentPeriod).toNumber() < new BigNumber(userInfo.settlementPeriod).toNumber() ||
                                                   !checked && new BigNumber(mintData && mintData.ne ? mintData.ne : 0).toNumber() == 0 && mintData.scenes == MinerScenes.chaos ||
                                                   new BigNumber(mintData && mintData.ne ? mintData.ne : 0).toNumber() == 0 && new BigNumber(amount).toNumber() == 0 && mintData.scenes == MinerScenes.altar && !checked}
                                               onClick={(e) => {
                                                   e.stopPropagation();
                                                   if (checked) {
                                                       this.done().then(() => {
                                                       }).catch(e => {
                                                           this.setShowLoading(false)
                                                           const err = typeof e == "string" ? e : e.message;
                                                           this.setShowToast(true, "warning", err)
                                                       })
                                                   } else {
                                                       this.prepare().then(() => {
                                                       }).catch(e => {
                                                           this.setShowLoading(false)
                                                           const err = typeof e == "string" ? e : e.message;
                                                           this.setShowToast(true, "warning", err)
                                                       })
                                                   }
                                               }}>
                                        {
                                            checked && userInfo && new BigNumber(userInfo.currentPeriod).toNumber() < new BigNumber(userInfo.settlementPeriod).toNumber() ? "Your period is in progress" :
                                                !checked && new BigNumber(mintData && mintData.ne ? mintData.ne : 0).toNumber() == 0 && mintData.scenes == MinerScenes.chaos ? "HashRate is 0" :
                                                    new BigNumber(mintData && mintData.ne ? mintData.ne : 0).toNumber() == 0 && new BigNumber(amount).toNumber() == 0 && mintData.scenes == MinerScenes.altar && !checked ? "HR or BL is 0" : i18n.t("commit")
                                        }
                                        {/*{*/}
                                        {/*    userInfo && userInfo.currentPeriod < userInfo.settlementPeriod?*/}
                                        {/*        <Countdown date={nextPeriodTime} renderer={this.renderer}/>*/}
                                        {/*        :"Commit"*/}
                                        {/*}*/}
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        </div>
                    </div>
                </IonModal>

                <IonModal
                    mode="ios"
                    isOpen={showModalDevice}
                    cssClass='epoch-rank-modal'
                    swipeToClose={true}
                    onDidDismiss={() => this.setShowModalDevice(false)}>
                    {
                        device && <CardTransform info={utils.convertDeviceToNFTInfo(device)} hideButton={true}/>
                    }
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


export default EpochOrigin