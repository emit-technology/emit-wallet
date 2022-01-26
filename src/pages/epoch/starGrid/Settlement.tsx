import * as React from 'react';
import {
    IonList,
    IonLabel,
    IonItem,
    IonModal,
    IonButton,IonListHeader,
    IonCol, IonRow, IonAvatar,IonCheckbox,IonRadio, IonSegment, IonItemDivider,IonText,IonSegmentButton
} from "@ionic/react"
import {ENDetails, GlobalInfo, LockedInfo, PeriodUserNE, StarGridType} from "../../../types";
import * as utils from "../../../utils";
import {enType2Cy, enType2ProductCy} from "../../../utils/stargrid";
import {formatValueString, nFormatter} from "../../../utils";
import {CountDown} from "../../../components/countdown";
import BigNumber from "bignumber.js";
import {Converter} from "./Converter";
import {NoData} from "./NoData";
import {isEmptyCounter} from "./utils";
import HexInfoCard from "./hex-info";
import i18n from "../../../locales/i18n";

interface Props{
    title?:string
    show:boolean
    onOk?:()=>void;
    onCancel?:()=>void;
    onPrepare?:()=>void;
    lockedInfo:LockedInfo;
    isOwner?:boolean;
    enDetails?:ENDetails
}
interface TokenBurned {
    user:BigNumber
    total:BigNumber
}

export class Settlement extends React.Component<Props, any> {
    state = {
        tab:"current"// last , future;
    }
    genPeriodNEItem = (v:PeriodUserNE) =>{
        const cyType = enType2Cy(v.enType)
        return <IonItem lines="none" key={v.period}>
            <IonLabel className="ion-text-wrap">
                <div className="settle-box">
                    <div className="bt">
                        <IonRow>
                            <IonCol>{i18n.t("period")}: <IonText color="tertiary"><b>{v.period}</b></IonText></IonCol>
                            <IonCol><IonText color="primary"><b>EMIT-{StarGridType[v.enType]}</b></IonText></IonCol>
                        </IonRow>
                    </div>
                    <div className="bc">
                        <IonRow>
                            <IonCol size="3"><IonText color="medium">{i18n.t("burned")}</IonText></IonCol>
                            <IonCol size="9">
                                <IonRow>
                                    <IonCol><IonText color="medium">{i18n.t("mine")} NE</IonText></IonCol>
                                    <IonCol><IonText color="medium">{i18n.t("total")} NE</IonText></IonCol>
                                </IonRow>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="3">{cyType.base}</IonCol>
                            <IonCol size="9">
                                <IonRow>
                                    <IonCol><IonText color="secondary">{formatValueString(v.base.userNE)}</IonText></IonCol>
                                    <IonCol><IonText color="secondary">{formatValueString(v.base.totalNE)}</IonText></IonCol>
                                </IonRow>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="3">{cyType.attach}</IonCol>
                            <IonCol size="9">
                                <IonRow>
                                    <IonCol><IonText color="secondary">{formatValueString(v.attach.userNE)}</IonText></IonCol>
                                    <IonCol><IonText color="secondary">{formatValueString(v.attach.totalNE)}</IonText></IonCol>
                                </IonRow>
                            </IonCol>
                        </IonRow>
                    </div>
                </div>
            </IonLabel>
        </IonItem>
    }

    renderGlobal = (v:GlobalInfo,showEnDetails?:boolean) =>{
        const {lockedInfo,enDetails} = this.props;

        let minNE = 0 ;
        const ubl = utils.fromValue(v.userBurnedLight,18);
        const ubd = utils.fromValue(v.userBurnedDark,18);
        const ubw = utils.fromValue(v.userBurnedWater,18);
        const ube = utils.fromValue(v.userBurnedDark,18);
        const arr = [ubl,ubd,ubw,ube];
        const filterArr = arr.filter(v=> v.toNumber() >0);
        if(filterArr && filterArr.length>0){
            minNE = filterArr[0].toNumber();
            for(let o of filterArr){
                if(minNE > o.toNumber()){
                    minNE = o.toNumber();
                }
            }
        }
        return <IonItem lines="none">
            <IonLabel className="ion-text-wrap">
                <div className="settle-box">
                    <div className="bt" style={{textAlign:"left"}}>
                        <IonRow>
                            <IonCol size="4"><b><small>EN Per Day (EPD)</small></b></IonCol>
                            <IonCol size="8">
                                <IonCol><IonText color="secondary"><b>{formatValueString(v.totalEN)}</b></IonText><small><IonText color="medium">&nbsp;EN</IonText></small></IonCol>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="4"><b><small>Element Per EN (EPE)</small></b></IonCol>
                            <IonCol size="8">
                                <IonRow>
                                    <IonCol size="6"><IonText color="secondary"><b>{utils.nFormatter(utils.fromValue(v.waterOutput,23),3)}</b></IonText><br/><small><IonText color="medium">WATER</IonText></small></IonCol>
                                    <IonCol size="6"><IonText color="secondary"><b>{utils.nFormatter(utils.fromValue(v.earthOutput,23),3)}</b></IonText><br/><small><IonText color="medium">EARTH</IonText></small></IonCol>
                                </IonRow>
                            </IonCol>
                        </IonRow>
                    </div>
                    <div className="bt" style={{textAlign:"center"}}>
                        <IonRow>
                            <IonCol size="2"><div  style={{display:"flex",alignItems:"center",height:"100%",fontWeight:800}}><small>{i18n.t("burned")}</small></div></IonCol>
                            <IonCol size="10">
                                <IonRow>
                                    <IonCol size="4"><IonText color="medium"><b>{i18n.t("total")}</b></IonText></IonCol>
                                    <IonCol size="4"><IonText color="medium"><b>{i18n.t("mine")}</b></IonText></IonCol>
                                    <IonCol size="4"><IonText color="medium"><b>{i18n.t("percent")}</b></IonText></IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol size="4"><IonText color="secondary"><b>{utils.nFormatter(utils.fromValue(v.burnedLight,18),3)}</b></IonText><br/><small><IonText color="medium">bLIGHT</IonText></small></IonCol>
                                    <IonCol size="4"><IonText color="secondary"><b>{utils.nFormatter(utils.fromValue(v.userBurnedLight,18),3)}</b></IonText><br/><small><IonText color="medium">bLIGHT</IonText></small></IonCol>
                                    <IonCol size="4"><IonText color="secondary"><b>{utils.nFormatter(utils.fromValue(v.userBurnedLight,0).dividedBy(utils.fromValue(v.burnedLight,0).toNumber()>0?utils.fromValue(v.burnedLight,0):1).multipliedBy(100),3)}</b></IonText><small><IonText color="medium">%</IonText></small></IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol size="4"><IonText color="secondary"><b>{utils.nFormatter(utils.fromValue(v.burnedDark,18),3)}</b></IonText><br/><small><IonText color="medium">bDARK</IonText></small></IonCol>
                                    <IonCol size="4"><IonText color="secondary"><b>{utils.nFormatter(utils.fromValue(v.userBurnedDark,18),3)}</b></IonText><br/><small><IonText color="medium">bDARK</IonText></small></IonCol>
                                    <IonCol size="4"><IonText color="secondary"><b>{utils.nFormatter(utils.fromValue(v.userBurnedDark,0).dividedBy(utils.fromValue(v.burnedDark,0).toNumber()>0?utils.fromValue(v.burnedDark,0):1).multipliedBy(100),3)}</b></IonText><small><IonText color="medium">%</IonText></small></IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol size="4"><IonText color="secondary"><b>{utils.nFormatter(utils.fromValue(v.burnedWater,18),3)}</b></IonText><br/><small><IonText color="medium">WATER</IonText></small></IonCol>
                                    <IonCol size="4"><IonText color="secondary"><b>{utils.nFormatter(utils.fromValue(v.userBurnedWater,18),3)}</b></IonText><br/><small><IonText color="medium">WATER</IonText></small></IonCol>
                                    <IonCol size="4"><IonText color="secondary"><b>{utils.nFormatter(utils.fromValue(v.userBurnedWater,0).dividedBy(utils.fromValue(v.burnedWater,0).toNumber()>0?utils.fromValue(v.burnedWater,0):1).multipliedBy(100),3)}</b></IonText><small><IonText color="medium">%</IonText></small></IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol size="4"><IonText color="secondary"><b>{utils.nFormatter(utils.fromValue(v.burnedEarth,18),3)}</b></IonText><br/><small><IonText color="medium">EARTH</IonText></small></IonCol>
                                    <IonCol size="4"><IonText color="secondary"><b>{utils.nFormatter(utils.fromValue(v.userBurnedEarth,18),3)}</b></IonText><br/><small><IonText color="medium">EARTH</IonText></small></IonCol>
                                    <IonCol size="4"><IonText color="secondary"><b>{utils.nFormatter(utils.fromValue(v.userBurnedEarth,0).dividedBy(utils.fromValue(v.burnedEarth,0).toNumber()>0?utils.fromValue(v.burnedEarth,0):1).multipliedBy(100),3)}</b></IonText><small><IonText color="medium">%</IonText></small></IonCol>
                                </IonRow>
                            </IonCol>
                        </IonRow>
                    </div>
                    {

                        showEnDetails && enDetails && lockedInfo && lockedInfo.userInfo &&
                        <div className="bc" style={{textAlign:"left"}}>
                            <IonRow>
                                <IonCol>
                                    <Converter enDetail={enDetails} symbol={StarGridType._!=lockedInfo.userInfo.counter.enType && StarGridType[lockedInfo.userInfo.counter.enType]}/>
                                </IonCol>
                            </IonRow>
                        </div>
                    }

                </div>
            </IonLabel>
        </IonItem>
    }


    render() {
        const {show,onOk,onCancel,onPrepare,title,lockedInfo} = this.props;
        const {tab} = this.state;


        const countdown = lockedInfo ? new BigNumber(lockedInfo.userInfo.nextOpTime).multipliedBy(1000).toNumber():0;
        const now = Date.now();
        const ctime = countdown>now && <div className="ctime">
            <IonRow>
                <IonCol><img src="./assets/img/epoch/stargrid/icons/time.png" width={20}/></IonCol>
                <IonCol className="pd-in"><CountDown time={countdown} className="op-countdown-2"/></IonCol>
            </IonRow>
        </div>;
        const periodCountdown = lockedInfo ?(1642681800 + (new BigNumber(lockedInfo.currentPeriod).multipliedBy(24*60*60).toNumber()) )*1000:0
        return  (<>
            <IonModal
                isOpen={show}
                onDidDismiss={() => onCancel()}
                mode="ios"
                cssClass="epoch-modal settle-modal"
                swipeToClose={false}
            >
                <div className="epoch-md">
                    <IonList>
                        {title && <IonListHeader mode="ios">{title}</IonListHeader>}
                        <IonItemDivider mode="md"/>
                        <IonItemDivider sticky color="primary">COUNTER {i18n.t("info")}</IonItemDivider>
                        <IonItem lines="none">
                            <IonLabel>
                                <div style={{maxWidth:"300px",maxHeight:"150px"}}>
                                    <HexInfoCard sourceHexInfo={{counter:lockedInfo.userInfo.counter}}/>
                                </div>
                            </IonLabel>
                        </IonItem>
                        <IonItemDivider sticky color="primary">{i18n.t("planet")} {i18n.t("info")}</IonItemDivider>
                        <IonItem lines="none">
                            <IonLabel className="ion-text-wrap">
                                <IonRow>
                                    <IonCol size="2"><IonText color="medium"><small>{i18n.t("type")}</small></IonText></IonCol>
                                    <IonCol size="3"><IonText color="medium"><small>{i18n.t("total")}</small></IonText></IonCol>
                                    <IonCol size="2"><IonText color="medium"><small>{i18n.t("TP")}</small></IonText></IonCol>
                                    <IonCol size="2"><IonText color="medium"><small>{i18n.t("mine")}</small></IonText></IonCol>
                                    <IonCol size="3"><IonText color="medium"><small>{i18n.t("percent")}</small></IonText></IonCol>
                                </IonRow>
                                {
                                    lockedInfo.userInfo.resources.map((v,i)=>{
                                        return <IonRow key={i}>
                                            <IonCol size="2"><IonText color="primary"><small>{StarGridType[v.enType]}</small></IonText></IonCol>
                                            <IonCol size="3"><IonText color="secondary"><b><small>{utils.nFormatter(utils.fromValue(v.total,18),3)}</small></b></IonText></IonCol>
                                            <IonCol size="2"><IonText color="secondary"><b><small>{utils.nFormatter(utils.fromValue(v.userTemp,18),3)}</small></b></IonText></IonCol>
                                            <IonCol size="2"><IonText color="secondary"><b><small>{utils.nFormatter(utils.fromValue(v.user,18),3)}</small></b></IonText></IonCol>
                                            <IonCol size="3"><IonText color="secondary"><b><small>{utils.fromValue(v.user,0).dividedBy(utils.fromValue(v.total,0)).multipliedBy(100).toFixed(3)}%</small></b></IonText></IonCol>
                                        </IonRow>
                                    })
                                }
                            </IonLabel>
                        </IonItem>
                        <IonItemDivider sticky color="primary">
                            User Info {ctime}
                        </IonItemDivider>
                        <IonItem lines="none">
                            <IonLabel className="ion-text-wrap">
                                <div className="settle-box">
                                    <div className="bc" style={{textAlign:"center"}}>
                                        <IonRow>
                                            <IonCol size="3"><div style={{display:"flex",alignItems:"center",height:"100%"}}><b>Temporary materials (TM)</b></div></IonCol>
                                            <IonCol size="9">
                                                <IonRow>
                                                    <IonCol><IonText color="secondary"><b>{utils.nFormatter(utils.fromValue(lockedInfo.userInfo.lightCanUsed,18),3)}</b></IonText><small><IonText color="medium"> bLIGHT</IonText></small></IonCol>
                                                    <IonCol><IonText color="secondary"><b>{utils.nFormatter(utils.fromValue(lockedInfo.userInfo.darkCanUsed,18),3)}</b></IonText><small><IonText color="medium"> bDARK</IonText></small></IonCol>
                                                </IonRow>
                                                <IonRow>
                                                    <IonCol><IonText color="secondary"><b>{utils.nFormatter(utils.fromValue(lockedInfo.userInfo.waterCanUsed,18),3)}</b></IonText><small><IonText color="medium"> WATER</IonText></small></IonCol>
                                                    <IonCol><IonText color="secondary"><b>{utils.nFormatter(utils.fromValue(lockedInfo.userInfo.earthCanUsed,18),3)}</b></IonText><small><IonText color="medium"> EARTH</IonText></small></IonCol>
                                                </IonRow>
                                            </IonCol>
                                        </IonRow>
                                    </div>
                                </div>
                                <div className="settle-box">
                                    <div className="bt">
                                        <IonRow>
                                            <IonCol size="8">
                                                {lockedInfo.userInfo.counter.counterId != "0" &&
                                                <div style={{display:"flex",alignItems:"center",height:"100%"}} >
                                                    <b>
                                                        {i18n.t("unsettle")}:&nbsp;
                                                        <IonText color="secondary">
                                                            {nFormatter(utils.fromValue(lockedInfo.userInfo.userNEInfo.unsettlement,18),3)}
                                                        </IonText>
                                                    </b>
                                                    <small><IonText color="medium">&nbsp;{enType2ProductCy(lockedInfo.userInfo.counter.enType)}</IonText></small>
                                                </div>}
                                            </IonCol>
                                            <IonCol size="4">
                                                {
                                                    onOk && utils.fromValue(lockedInfo.userInfo.userNEInfo.unsettlement,18).toNumber()>0
                                                    && <IonButton expand="block" fill="outline" size="small" onClick={()=>{
                                                        onOk()
                                                    }}>{i18n.t("withdraw")}</IonButton>
                                                }
                                            </IonCol>
                                        </IonRow>
                                    </div>
                                    <div className="bc">
                                        <IonRow>
                                            <IonCol></IonCol>
                                            <IonCol><IonText color="primary"><b><small>{i18n.t("last")}</small></b></IonText></IonCol>
                                            <IonCol><IonText color="primary"><b><small>{i18n.t("current")}</small></b></IonText></IonCol>
                                            <IonCol><IonText color="primary"><b><small>{i18n.t("end")}</small></b></IonText></IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol><div style={{display:"flex",alignItems:"center"}}><b>{i18n.t("period")}</b></div></IonCol>
                                            <IonCol><IonText color="secondary"><b>{lockedInfo.userInfo.userNEInfo.nextSettlementPeriod}</b></IonText></IonCol>
                                            <IonCol><IonText color="secondary"><b>{lockedInfo.currentPeriod}</b></IonText></IonCol>
                                            <IonCol> <IonText color="secondary"><b>{lockedInfo.userInfo.userNEInfo.endPeriod}</b></IonText></IonCol>
                                        </IonRow>

                                    </div>
                                </div>

                            </IonLabel>
                        </IonItem>

                        <IonItemDivider sticky color="primary">
                            {i18n.t("period")} {i18n.t("info")}
                            <div className="p-cd-r">{periodCountdown>0 && <CountDown time={periodCountdown} className="period-countdown2"/>}</div>
                        </IonItemDivider>
                        <IonSegment mode="md" value={tab} onIonChange={e => {
                            e.stopPropagation();
                            this.setState({tab:e.detail.value})
                        }}>
                            <IonSegmentButton value="current">
                                <IonLabel>{i18n.t("current")} [{lockedInfo.currentPeriod}]</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="last">
                                <IonLabel>{i18n.t("last")} [{lockedInfo.last.period}]</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="future">
                                <IonLabel>{i18n.t("future")}</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>

                        {
                            tab == "current" && <>
                                {lockedInfo && this.renderGlobal(lockedInfo.current,true)}
                            </>
                        }
                        {
                            tab == "last" &&
                            <>
                                {lockedInfo && this.renderGlobal(lockedInfo.last,false)}
                            </>
                        }
                        {
                            tab == "future" &&
                            <>
                                {
                                    lockedInfo.userInfo.userNEInfo && lockedInfo.userInfo.userNEInfo.userNEs.length > 0 ?
                                        <>
                                            {
                                                lockedInfo.userInfo.userNEInfo.userNEs.map(v=>{
                                                    if(v.period != lockedInfo.currentPeriod){
                                                        return this.genPeriodNEItem(v)
                                                    }
                                                })
                                            }
                                        </>
                                        :<NoData title={"No Data"} />
                                }

                            </>
                        }
                    </IonList>
                </div>

                {
                    onOk && !isEmptyCounter(lockedInfo.userInfo.counter)? <IonRow>
                        <IonCol size="4">
                            <IonButton onClick={() => onCancel()} expand="block" fill="outline" color="secondary">{i18n.t("cancel")}</IonButton>
                        </IonCol>
                        <IonCol  size="8">
                            <IonButton expand="block" onClick={() => {
                                onPrepare();
                            }} color="primary">{i18n.t("prepare")}</IonButton>
                        </IonCol>
                    </IonRow>
                        :
                    onCancel && <IonRow>
                        <IonCol size="12">
                            <IonButton onClick={() => onCancel()} expand="block" fill="outline" color="secondary">{i18n.t("close")}</IonButton>
                        </IonCol>
                    </IonRow>
                }
            </IonModal>
        </>)
    }
}
