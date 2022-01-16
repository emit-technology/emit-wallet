import * as React from 'react';
import {
    IonList,
    IonLabel,
    IonItem,
    IonModal,
    IonButton,
    IonCol, IonRow, IonListHeader, IonText
} from "@ionic/react"
import {LockedInfo} from "../../../types";
import * as utils from "../../../utils";
interface Props{
   show:boolean
   onOk:()=>void;
   onCancel:()=>void;
   data:object
    lockedInfo?:LockedInfo
}
export const FeeModal:React.FC<Props> = ({show,onOk,onCancel,data,lockedInfo})=>{

    return (<>
        <IonModal
        isOpen={show}
        onDidDismiss={() => onCancel()}
        cssClass="counter-list-modal"
        swipeToClose={false}
        >
            <div className="epoch-md">
            <IonList mode="ios">
                <IonListHeader>
                    Confirm Billing
                </IonListHeader>
                {
                    lockedInfo && data && data["showDesc"] &&
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
                                                <IonCol><IonText color="secondary"><b>{utils.nFormatter(utils.fromValue(lockedInfo.userInfo.earthCanUsed,18),3)}</b></IonText><small><IonText color="medium"> EARTH</IonText></small></IonCol>
                                            </IonRow>
                                        </IonCol>
                                    </IonRow>
                                </div>
                            </div>
                        </IonLabel>
                    </IonItem>
                }

                {
                    data && Object.keys(data).map(v=>{
                        if(v == "showDesc"){
                            return <></>
                        }
                        return <IonItem>
                            <IonLabel>
                                {v}
                            </IonLabel>
                            <IonLabel className="ion-text-wrap">
                                {data[v]}
                            </IonLabel>
                        </IonItem>
                    })
                }
                {
                    data && data["showDesc"] &&
                    <IonItem>
                        <IonLabel className="ion-text-wrap">
                            <div>
                                <small>
                                    <IonText color="warning">
                                        <p>1. Capture in the new Planet will cost 10% fee.</p>
                                        <p>2. The fee only cost from BEP20 contract, eq: bLIGHT,bDARK,WATER and EARTH</p>
                                        <p>3. The amount cost TM first.</p>
                                    </IonText>
                                </small>
                            </div>
                        </IonLabel>
                    </IonItem>
                }

            </IonList>
            </div>
            <IonRow>
                <IonCol size="4">
                    <IonButton mode="ios" onClick={() => onCancel()} expand="block" fill="outline" color="secondary">CANCEL</IonButton>
                </IonCol>
                <IonCol  size="8">
                    <IonButton mode="ios" expand="block" onClick={() => {
                        onOk()
                    }} color="primary">OK</IonButton>
                </IonCol>
            </IonRow>
        </IonModal>
    </>)
}
