import * as React from 'react';
import {
    IonList,
    IonLabel,
    IonItem,
    IonModal,
    IonButton,
    IonCol, IonRow, IonAvatar, IonRadio, IonItemDivider,IonText
} from "@ionic/react"
import {LockedInfo, StarGridType} from "../../../types";
import CounterSvg from "./counter-svg";
import * as utils from "../../../utils";
import {CountDown} from "../../../components/countdown";

interface Props{
    show:boolean
    onOk?:()=>void;
    onCancel?:()=>void;
    onPrepare?:()=>void;
    lockedInfo:LockedInfo
}


export const Settlement:React.FC<Props> = ({show,onOk,onCancel,onPrepare,lockedInfo})=>{

    return (<>
        <IonModal
            isOpen={show}
            onDidDismiss={() => onCancel()}
            swipeToClose={true}
            mode="ios"
            cssClass="epoch-modal"
        >
            <div className="epoch-md">
                <IonList>
                    <IonItem>
                        <IonAvatar>
                            <CounterSvg counter={lockedInfo.counter}/>
                        </IonAvatar>
                        <IonLabel>
                            <p>
                                ID:[{lockedInfo.counter.counterId}]<br/>
                                TYPE: {StarGridType[lockedInfo.counter.enType]}<br/>
                            </p>
                        </IonLabel>
                        <IonRadio slot="end" value={lockedInfo.counter.counterId} />
                    </IonItem>
                    <IonItem>
                        <IonLabel>
                            Current Period
                        </IonLabel>
                        <IonLabel>
                            {lockedInfo.currentPeriod}
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>
                            End Period
                        </IonLabel>
                        <IonLabel>
                            {lockedInfo.endPeriod}
                        </IonLabel>
                        <IonButton size="small" onClick={()=>{
                            onPrepare()
                        }}>Prepare</IonButton>
                    </IonItem>
                    <IonItem>
                        <IonLabel>
                            nextCaptureTime
                        </IonLabel>
                        <IonLabel>
                            <CountDown second={utils.toValue(lockedInfo.nextCaptureTime,0).toNumber()}/>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>
                            nextOpTime
                        </IonLabel>
                        <IonLabel>
                            <CountDown second={utils.toValue(lockedInfo.nextOpTime,0).toNumber()}/>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>
                            nextSettlementPeriod
                        </IonLabel>
                        <IonLabel>
                            {lockedInfo.nextSettlementPeriod}
                        </IonLabel>
                    </IonItem>

                    <IonItemDivider>Current Info</IonItemDivider>
                    <IonItem>
                        <IonLabel className="ion-text-wrap">
                            <IonRow>
                                <IonCol><IonText color="medium">Token</IonText></IonCol>
                                <IonCol><IonText color="medium">NE</IonText></IonCol>
                                <IonCol><IonText color="medium">Total</IonText></IonCol>
                                <IonCol><IonText color="medium">Estimate</IonText></IonCol>
                            </IonRow>
                            {lockedInfo.current.map(v=>{
                                return <IonRow>
                                    <IonCol>{StarGridType[v.enType]}</IonCol>
                                    <IonCol>{utils.nFormatter(utils.fromValue(v.UserEN,18),3)}</IonCol>
                                    <IonCol>{utils.nFormatter(utils.fromValue(v.period,18),3)}</IonCol>
                                    <IonCol>{utils.fromValue(v.attach.userNE,18).toString(10)}</IonCol>
                                </IonRow>
                                //`${utils.nFormatter(utils.fromValue(v.ne,18),3)} ${v.pool} ${v.total} ${StarGridType[v.typ]}`
                            })}
                        </IonLabel>
                    </IonItem>
                    <IonItemDivider>Last Info</IonItemDivider>
                    <IonItem>
                        <IonLabel className="ion-text-wrap">
                            <IonRow>
                                <IonCol><IonText color="medium">Token</IonText></IonCol>
                                <IonCol><IonText color="medium">NE</IonText></IonCol>
                                <IonCol><IonText color="medium">Total</IonText></IonCol>
                                <IonCol><IonText color="medium">Estimate</IonText></IonCol>
                            </IonRow>
                            {lockedInfo.last.map(v=>{
                                return <IonRow>
                                    <IonCol>{StarGridType[v.enType]}</IonCol>
                                    <IonCol>{utils.nFormatter(utils.fromValue(v.UserEN,18),3)}</IonCol>
                                    <IonCol>{utils.nFormatter(utils.fromValue(v.period,18),3)}</IonCol>
                                    <IonCol>{utils.fromValue(v.attach.userNE,18).toString(10)}</IonCol>
                                </IonRow>
                            })}
                        </IonLabel>
                    </IonItem>
                </IonList>
            </div>

            <IonRow>
                <IonCol size="4">
                    <IonButton onClick={() => onCancel()} expand="block" fill="outline" color="secondary">CANCEL</IonButton>
                </IonCol>
                <IonCol  size="8">
                    <IonButton expand="block" onClick={() => {
                        onOk()
                    }} color="primary">OK</IonButton>
                </IonCol>
            </IonRow>
        </IonModal>
    </>)
}
