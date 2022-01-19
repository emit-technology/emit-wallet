import * as React from 'react';
import {
    IonButton, IonCol,
    IonItem,
    IonItemDivider,
    IonLabel,
    IonList,
    IonListHeader, IonModal,
    IonRadio,
    IonRadioGroup, IonRow
} from "@ionic/react";
import {Counter} from "../../../types";
import HexInfoCard from "./hex-info";
import {NoData} from "./NoData";
import i18n from "../../../locales/i18n"
interface Props{
   title?:string
   show:boolean
   onCancel:()=>void;
   onOk:(counterId)=>void;
   data:Array<Counter>
}

export const CounterSelectModal:React.FC<Props> =({title,show,onOk,onCancel,data}) =>{
    const selectRef:any = React.createRef();
    return (
        <>
            <IonModal
                isOpen={show}
                onDidDismiss={() => onCancel()}
                cssClass="counter-list-modal"
                mode="ios"
                swipeToClose={false}
            >
                <div className="epoch-md">

                    <IonList mode="md">
                        {
                            title &&
                            <IonListHeader mode="ios">
                                {title}
                            </IonListHeader>
                        }
                        <IonItemDivider  sticky color="primary">{i18n.t("select")} Counter</IonItemDivider>
                        <div className="counter-list-select">
                            {
                                data && data.length>0 ?
                                    <IonRadioGroup ref={selectRef}>
                                        {
                                            data && data.map((v,i)=>{
                                                if(!v){
                                                    return <></>
                                                }
                                                return v && <>
                                                    <IonItem key={i}>
                                                        <IonRadio slot="start" mode="md" value={v.counterId} />
                                                        <IonLabel>
                                                            <HexInfoCard sourceHexInfo={{counter:v}}/>
                                                        </IonLabel>
                                                    </IonItem>
                                                </>
                                            })
                                        }
                                    </IonRadioGroup>
                                    :<NoData title="No Counters"/>
                            }
                        </div>
                    </IonList>
                </div>
                <IonRow>
                    <IonCol size="4">
                        <IonButton mode="ios" onClick={() => onCancel()} expand="block" fill="outline" color="secondary">
                            {i18n.t("cancel")}
                        </IonButton>
                    </IonCol>
                    <IonCol  size="8">
                        <IonButton mode="ios" expand="block" onClick={() => {
                            if(selectRef && selectRef.current){
                                const counterId = selectRef.current.value;
                                onOk(counterId)
                            }
                        }} color="primary">{i18n.t("ok")}</IonButton>
                    </IonCol>
                </IonRow>
            </IonModal>
        </>
    )
}