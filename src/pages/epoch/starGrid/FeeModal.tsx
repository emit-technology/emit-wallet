import * as React from 'react';
import {
    IonList,
    IonLabel,
    IonItem,
    IonModal,
    IonButton,
    IonCol, IonRow,IonListHeader
} from "@ionic/react"
interface Props{
   show:boolean
   onOk:()=>void;
   onCancel:()=>void;
   data:object
}
export const FeeModal:React.FC<Props> = ({show,onOk,onCancel,data})=>{

    return (<>
        <IonModal
        isOpen={show}
        onDidDismiss={() => onCancel()}
        cssClass="counter-list-modal"
        >
            <IonList mode="ios">
                <IonListHeader>
                    Confirm billing
                </IonListHeader>
                {
                    data && Object.keys(data).map(v=>{
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
            </IonList>
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
