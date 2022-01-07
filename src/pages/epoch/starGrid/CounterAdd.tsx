import * as React from 'react';
import {StarGridType} from "../../../types";
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
    IonCol,
    IonRadioGroup,
    IonSelectOption,IonListHeader,IonItemDivider,
    IonAvatar, IonRadio
} from "@ionic/react"
import CounterSvg from "./counter-svg";
interface Props {
    show: boolean
    onOk: (type:StarGridType,num: number) => void;
    onCancel: () => void;
}

export const CounterAdd: React.FC<Props> = ({show, onOk, onCancel}) => {

    const inputRef:any = React.createRef();
    const selectRef:any = React.createRef();

    return (<>
        <IonModal
            isOpen={show}
            onDidDismiss={() => onCancel()}
            cssClass="counter-list-modal"
        >
            <IonList  mode="md">
                <IonListHeader mode="ios">Create Counters</IonListHeader>
                <IonItemDivider mode="md"/>
                <IonRadioGroup ref={selectRef} title={"Select counter type"} >
                    <IonItem>
                        <IonAvatar>
                            <img src="./assets/img/epoch/stargrid/piece/white.png"/>
                        </IonAvatar>
                        <IonLabel>&nbsp;WATER</IonLabel>
                        <IonRadio slot="end" value={StarGridType.WATER} />
                    </IonItem>
                    <IonItem>
                        <IonAvatar>
                            <img src="./assets/img/epoch/stargrid/piece/black.png"/>
                        </IonAvatar>
                        <IonLabel>&nbsp;EARTH</IonLabel>
                        <IonRadio slot="end" value={StarGridType.EARTH} />
                    </IonItem>
                </IonRadioGroup>
                <IonItem>
                    <IonLabel position="stacked">NUMBER</IonLabel>
                    <IonInput ref={inputRef}/>
                </IonItem>
            </IonList>
            <IonRow>
                <IonCol size="4">
                    <IonButton mode="ios" onClick={() => onCancel()} expand="block" fill="outline" color="secondary">CANCEL</IonButton>
                </IonCol>
                <IonCol  size="8">
                    <IonButton mode="ios" expand="block" onClick={() => {
                        const num = inputRef.current.value;
                        const typ = selectRef.current.value;
                        console.log("type: ",typ)
                        onOk(typ,num)
                    }} color="primary">OK</IonButton>
                </IonCol>
            </IonRow>
        </IonModal>
    </>)
}
