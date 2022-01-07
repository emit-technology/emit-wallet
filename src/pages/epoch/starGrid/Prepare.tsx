import * as React from 'react';
import {Counter, LockedInfo, StarGridType, Token} from "../../../types";
import {IonList, IonLabel, IonItem, IonModal,IonText, IonButton,IonInput,IonGrid,IonRow,IonCol,IonSelect,IonSelectOption} from "@ionic/react"
import BigNumber from "bignumber.js";
interface Props {
    show: boolean
    onOk?: (terms:number,baseAmount:BigNumber,attachAmount:BigNumber) => void;
    onCancel?: () => void;
    lockedInfo:LockedInfo
}

export const Prepare: React.FC<Props> = ({show, onOk, onCancel}) => {

    const termsRef:any = React.createRef();
    const baseAmountRef:any = React.createRef();
    const attachAmountRef:any = React.createRef();

    return (<>
        <IonModal
            isOpen={show}
            onDidDismiss={() => onCancel()}
            cssClass="counter-list-modal"
        >
            <div className="counter-list-md">
                <IonList>
                    <IonItem>
                        <IonLabel>Terms</IonLabel>
                        <IonInput ref={termsRef}/>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Base Amount</IonLabel>
                        <IonInput ref={baseAmountRef}/>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Attach Amount</IonLabel>
                        <IonInput ref={attachAmountRef}/>
                    </IonItem>
                </IonList>
            </div>
            <IonRow>
                <IonCol size="4">
                    <IonButton onClick={() => onCancel()} expand="block" fill="outline" color="secondary">CANCEL</IonButton>
                </IonCol>
                <IonCol  size="8">
                    <IonButton expand="block" onClick={() => {
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
