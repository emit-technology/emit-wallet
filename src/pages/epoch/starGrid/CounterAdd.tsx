import * as React from 'react';
import {DepositType, StarGridType} from "../../../types";
import {
    IonList,
    IonLabel,
    IonItem,
    IonModal,
    IonButton,
    IonInput,
    IonRow,
    IonCol,
    IonRadioGroup,
    IonListHeader,IonItemDivider,
    IonAvatar, IonRadio
} from "@ionic/react"
import i18n from "../../../locales/i18n"
interface Props {
    show: boolean
    onOk: (type:StarGridType,num: number,depositType:DepositType) => void;
    onCancel: () => void;
    amountTitle1?: any;
    amountTitle2?: any;
    onCallback: (counterType:StarGridType,depositType:DepositType,num:number) => void;
}

export const CounterAdd: React.FC<Props> = ({show,amountTitle1,amountTitle2, onOk, onCancel,onCallback}) => {

    const inputRef:any = React.createRef();
    const selectRef:any = React.createRef();
    const selectDepositTypeRef:any = React.createRef();
    return (<>
        <IonModal
            isOpen={show}
            onDidDismiss={() => onCancel()}
            cssClass="counter-list-modal"
            swipeToClose={false}
        >
            <IonList  mode="md">
                <IonListHeader mode="ios">{i18n.t("create")} Counters</IonListHeader>
                <IonItemDivider mode="md"/>
                <IonItemDivider  sticky color="primary">{i18n.t("select")} Counter {i18n.t("type")}</IonItemDivider>
                <IonRadioGroup ref={selectRef} title={"Select counter type"} onIonChange={(e)=>{
                    if(selectDepositTypeRef.current && inputRef.current &&inputRef.current.value){
                        const counterType = e.detail.value;
                        const depositType = selectDepositTypeRef.current.value;
                        const num = inputRef.current &&inputRef.current.value?inputRef.current.value:1;
                        onCallback(counterType,depositType,num)
                    }
                }} >
                    <IonItem lines="none">
                        <IonAvatar>
                            <img src="./assets/img/epoch/stargrid/piece/white.png"/>
                        </IonAvatar>
                        <IonLabel>&nbsp;EMIT-WATER</IonLabel>
                        <IonRadio slot="end" value={StarGridType.WATER} />
                    </IonItem>
                    <IonItem lines="none">
                        <IonAvatar>
                            <img src="./assets/img/epoch/stargrid/piece/black.png"/>
                        </IonAvatar>
                        <IonLabel>&nbsp;EMIT-EARTH</IonLabel>
                        <IonRadio slot="end" value={StarGridType.EARTH} />
                    </IonItem>
                </IonRadioGroup>
                <IonItemDivider  sticky color="primary">{i18n.t("staking")} {i18n.t("type")}</IonItemDivider>
                <IonRadioGroup ref={selectDepositTypeRef} title={"Select deposit type"} onIonChange={(e)=>{
                    if(selectRef.current && inputRef.current &&inputRef.current.value ){
                        const depositType = e.detail.value;
                        const counterType = selectRef.current.value;
                        const num = inputRef.current && inputRef.current.value?inputRef.current.value:1;
                        onCallback(counterType,depositType,num)
                    }
                }} >
                    <IonItem lines="none">
                        <IonLabel>&nbsp;LP-TOKEN</IonLabel>
                        <IonRadio slot="end" value={DepositType.LP} />
                    </IonItem>
                    <IonItem lines="none">
                        <IonLabel>&nbsp;BUSD</IonLabel>
                        <IonRadio slot="end" value={DepositType.BUSD} />
                    </IonItem>
                </IonRadioGroup>
                <IonItemDivider  sticky color="primary">{i18n.t("count")}</IonItemDivider>
                <IonItem>
                    <IonInput ref={inputRef} placeholder="0" type="number" onIonChange={(e)=>{
                        if(selectRef.current && selectDepositTypeRef.current){
                            const depositType = selectDepositTypeRef.current.value;
                            const counterType = selectRef.current.value;
                            const num:any = e.detail.value;
                            onCallback(counterType,depositType,num)
                        }
                    }}/>
                </IonItem>
                {
                    amountTitle1 && amountTitle2 &&
                    <>
                        <IonItemDivider sticky color="primary">Estimate Cost</IonItemDivider>
                        <IonItem>
                            <IonLabel>Balance</IonLabel>
                            <IonItem>{amountTitle1}</IonItem>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Estimate</IonLabel>
                            <IonItem>{amountTitle2}</IonItem>
                        </IonItem>
                    </>
                }
            </IonList>
            <IonRow>
                <IonCol size="4">
                    <IonButton mode="ios" onClick={() => onCancel()} expand="block" fill="outline" color="secondary">{i18n.t("cancel")}</IonButton>
                </IonCol>
                <IonCol  size="8">
                    <IonButton mode="ios" expand="block" onClick={() => {
                        const num = inputRef.current.value;
                        const typ = selectRef.current.value;
                        const depositType = selectDepositTypeRef.current.value;
                        onOk(typ,num,depositType)
                    }} color="primary">{i18n.t("ok")}</IonButton>
                </IonCol>
            </IonRow>
        </IonModal>
    </>)
}
