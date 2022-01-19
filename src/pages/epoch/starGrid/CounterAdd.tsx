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
}

export const CounterAdd: React.FC<Props> = ({show, onOk, onCancel}) => {

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
                <IonRadioGroup ref={selectRef} title={"Select counter type"} >
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
                <IonRadioGroup ref={selectDepositTypeRef} title={"Select counter type"} >
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
                    <IonInput ref={inputRef} placeholder="0" type="number"/>
                </IonItem>
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
