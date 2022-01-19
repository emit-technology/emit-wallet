import * as React from 'react';
import {DriverStarGrid, Land, LockedInfo, StarGridType} from "../../../types";
import {
    IonAvatar,
    IonButton,
    IonCol,
    IonInput,
    IonItem,
    IonItemDivider,
    IonLabel,
    IonList,
    IonListHeader,
    IonModal,
    IonRow,
    IonText,
} from "@ionic/react"
import BigNumber from "bignumber.js";
import {enType2Cy} from "../../../utils/stargrid";
import CounterSvg from "./counter-svg";
import HexInfoCard from "./hex-info";
import {toAxial} from "../../../components/hexagons/utils";
import * as utils from "../../../utils";
import {isEmptyPlanet} from "./utils";
import i18n from "../../../locales/i18n";

interface Props {
    show: boolean
    onOk?: (terms:number,baseAmount:BigNumber,attachAmount:BigNumber) => void;
    onCancel?: () => void;
    lockedInfo:LockedInfo;
    defaultPlanet?:Land
    onSelectPlanet:()=>void;
    driverInfo?:DriverStarGrid
}

export const Prepare: React.FC<Props> = ({show,lockedInfo, onOk,driverInfo, onCancel,onSelectPlanet,
                                             defaultPlanet}) => {

    const termsRef:any = React.createRef();
    const baseAmountRef:any = React.createRef();
    const attachAmountRef:any = React.createRef();

    const eType = lockedInfo && lockedInfo.userInfo.counter&& lockedInfo.userInfo.counter.counterId!="0" ? enType2Cy(lockedInfo.userInfo.counter.enType):{base:"",attach:""}
    return (<>
        <IonModal
            isOpen={show}
            onDidDismiss={() => onCancel()}
            cssClass="counter-list-modal"
            swipeToClose={false}
        >
            <div className="counter-list-md">
                {
                    lockedInfo && lockedInfo.userInfo.counter&& lockedInfo.userInfo.counter.counterId!="0"  &&
                    <IonList>
                        <IonListHeader mode="ios">{i18n.t("prepare")}</IonListHeader>
                        <IonItemDivider sticky color="primary"/>
                        <IonItem>
                            <IonAvatar>
                                <CounterSvg counter={lockedInfo.userInfo.counter}/>
                            </IonAvatar>
                            <IonLabel>
                                <p>
                                    ID: [{lockedInfo.userInfo.counter.counterId}]<br/>
                                    TYPE: {StarGridType[lockedInfo.userInfo.counter.enType]}<br/>
                                </p>
                            </IonLabel>
                        </IonItem>
                        <IonItem>
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
                                                    <IonCol><IonText color="secondary"><b>{utils.nFormatter(utils.fromValue(lockedInfo.userInfo.darkCanUsed,18),3)}</b></IonText><small><IonText color="medium"> EARTH</IonText></small></IonCol>
                                                </IonRow>
                                            </IonCol>
                                        </IonRow>
                                    </div>
                                </div>
                            </IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel >{i18n.t("current")} {i18n.t("period")}</IonLabel>
                            <IonLabel color="secondary">{lockedInfo.currentPeriod}</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel >{i18n.t("end")} {i18n.t("period")}</IonLabel>
                            <IonLabel color="secondary">{lockedInfo.userInfo.userNEInfo.endPeriod}</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">{i18n.t("numberOfPeriod")}</IonLabel>
                            <IonInput ref={termsRef} placeholder="0.00"/>
                        </IonItem>
                        <IonItem>
                            <IonLabel position={"stacked"}>{eType.base}/<small>{i18n.t("period")}</small></IonLabel>
                            <IonInput ref={baseAmountRef} placeholder="0.00" id="baseAmountId"/>
                            {
                                driverInfo && <IonButton mode="ios" size="small" fill="outline" slot="end" onClick={()=>{
                                    {
                                        /**
                                         * bLight：0.12*10^18
                                         bDark: 0.04*10^18
                                         Water: 0.1*10^18
                                         Earth: 208.3*10^18
                                         */
                                        let cyValue = lockedInfo.last.burnedLight;
                                        let min = new BigNumber(0.012);
                                        if(lockedInfo.userInfo.counter.enType == StarGridType.EARTH){
                                            cyValue = lockedInfo.last.burnedDark;
                                            min = new BigNumber(0.004);
                                        }
                                        let value = new BigNumber(cyValue).dividedBy(new BigNumber(lockedInfo.last.totalEN)).multipliedBy(
                                            utils.fromValue(driverInfo.capacity,18).multipliedBy(1.5)
                                        )
                                        if(value.toNumber() < min.toNumber()){
                                            value = min
                                        }
                                        //@ts-ignore
                                        document.getElementById("baseAmountId").value = value.toFixed(3);
                                    }
                                    {
                                        let min = new BigNumber(20.83);
                                        let cyValue = lockedInfo.last.burnedEarth;
                                        if(lockedInfo.userInfo.counter.enType == StarGridType.EARTH){
                                            cyValue = lockedInfo.last.burnedWater;
                                            min = new BigNumber(0.01)
                                        }
                                        let value = new BigNumber(cyValue).dividedBy(new BigNumber(lockedInfo.last.totalEN)).multipliedBy(
                                            utils.fromValue(driverInfo.capacity,18).multipliedBy(1.5)
                                        )
                                        if(value.toNumber() < min.toNumber()){
                                            value = min
                                        }
                                        //@ts-ignore
                                        document.getElementById("attachAmountId").value = value.toFixed(3);
                                    }
                                }}>{i18n.t("recommend")}</IonButton>
                            }
                        </IonItem>
                        <IonItem>
                            <IonLabel position={"stacked"}>{eType.attach}/<small>{i18n.t("period")}</small></IonLabel>
                            <IonInput ref={attachAmountRef} placeholder="0.00" id="attachAmountId"/>
                        </IonItem>
                        {
                            !isEmptyPlanet(defaultPlanet) && <IonItem onClick={()=>{
                                onSelectPlanet()
                            }}>
                                <IonLabel className="ion-text-wrap">
                                    <IonText>{i18n.t("selectDefaultPlanet")}</IonText>
                                    <p>[{toAxial(defaultPlanet.coordinate).x},{toAxial(defaultPlanet.coordinate).z}]</p>
                                </IonLabel>
                                <IonLabel>
                                    <HexInfoCard sourceHexInfo={{hex:toAxial(defaultPlanet.coordinate),land:defaultPlanet}} showSimple/>
                                </IonLabel>
                            </IonItem>
                        }
                    </IonList>
                }
            </div>
            <IonRow>
                <IonCol size="4">
                    <IonButton onClick={() => onCancel()} mode="ios" expand="block" fill="outline" color="secondary">{i18n.t("cancel")}</IonButton>
                </IonCol>
                <IonCol  size="8">
                    <IonButton expand="block" mode="ios"  onClick={() => {
                        const terms = termsRef.current.value;
                        const baseAmount = baseAmountRef.current.value;
                        const attachAmount = attachAmountRef.current.value;
                        onOk(terms,baseAmount,attachAmount)
                    }} color="primary">{i18n.t("ok")}</IonButton>
                </IonCol>
            </IonRow>
        </IonModal>
    </>)
}
