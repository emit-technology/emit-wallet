import * as React from 'react';
import {Counter, Land, LockedInfo, StarGridType, Token} from "../../../types";
import {
    IonList,
    IonLabel,
    IonItem,
    IonModal,
    IonText,
    IonButton,
    IonInput,
    IonGrid,
    IonRow,
    IonListHeader,
    IonCol,
    IonSelect,
    IonItemDivider,
    IonSelectOption,
    IonAvatar,
} from "@ionic/react"
import BigNumber from "bignumber.js";
import {enType2Cy} from "../../../utils/stargrid";
import CounterSvg from "./counter-svg";
import HexInfoCard from "./hex-info";
import {toAxial} from "../../../components/hexagons/utils";
import * as utils from "../../../utils";
import {isEmptyPlanet} from "./utils";
interface Props {
    show: boolean
    onOk?: (terms:number,baseAmount:BigNumber,attachAmount:BigNumber) => void;
    onCancel?: () => void;
    lockedInfo:LockedInfo;
    defaultPlanet?:Land
    onSelectPlanet:()=>void;
}

export const Prepare: React.FC<Props> = ({show,lockedInfo, onOk, onCancel,onSelectPlanet,
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
                        <IonListHeader mode="ios">Prepare</IonListHeader>
                        <IonItemDivider sticky color="primary"/>
                        <IonItem>
                            <IonAvatar>
                                <CounterSvg counter={lockedInfo.userInfo.counter}/>
                            </IonAvatar>
                            <IonLabel>
                                <p>
                                    ID:[{lockedInfo.userInfo.counter.counterId}]<br/>
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
                            <IonLabel >Current Period</IonLabel>
                            <IonInput value={lockedInfo.currentPeriod} readonly/>
                        </IonItem>
                        <IonItem>
                            <IonLabel >End Period</IonLabel>
                            <IonInput value={lockedInfo.userInfo.userNEInfo.endPeriod} readonly/>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Number of periods(1-7)</IonLabel>
                            <IonInput ref={termsRef} placeholder="0.00"/>
                        </IonItem>
                        <IonItem>
                            <IonLabel position={"stacked"}>{eType.base}/<small>period</small></IonLabel>
                            <IonInput ref={baseAmountRef} placeholder="0.00"/>
                        </IonItem>
                        <IonItem>
                            <IonLabel position={"stacked"}>{eType.attach}/<small>period</small></IonLabel>
                            <IonInput ref={attachAmountRef} placeholder="0.00"/>
                        </IonItem>
                        {
                            !isEmptyPlanet(defaultPlanet) && <IonItem onClick={()=>{
                                onSelectPlanet()
                            }}>
                                <IonLabel className="ion-text-wrap">
                                    <IonText>Select default Planet</IonText>
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
                    <IonButton onClick={() => onCancel()} mode="ios" expand="block" fill="outline" color="secondary">CANCEL</IonButton>
                </IonCol>
                <IonCol  size="8">
                    <IonButton expand="block" mode="ios"  onClick={() => {
                        const terms = termsRef.current.value;
                        const baseAmount = baseAmountRef.current.value;
                        const attachAmount = attachAmountRef.current.value;
                        onOk(terms,baseAmount,attachAmount)
                    }} color="primary">OK</IonButton>
                </IonCol>
            </IonRow>
        </IonModal>
    </>)
}
