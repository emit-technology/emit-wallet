import * as React from 'react';
import {Counter, StarGridType} from "../../../types";
import {
    IonList,
    IonLabel,
    IonItem,
    IonItemDivider,
    IonAvatar,
    IonModal,
    IonInput,
    IonButton,
    IonRadioGroup,
    IonListHeader,
    IonRadio,
    IonCol, IonRow
} from "@ionic/react"
import CounterSvg from "./counter-svg";
import BigNumber from "bignumber.js";
interface Props{
    title?:string
    show:boolean
    onOk:(counterId:string,baseAmountIn?:BigNumber,attachAmountIn?:BigNumber)=>void;
    onCancel:()=>void;
    data:Array<Counter>
    onCallback:(counter:Counter)=>void;
    amountTitle1:any;
    amountTitle2:any;
}
export const CounterList:React.FC<Props> = ({show,onOk,title,onCancel,data,onCallback,amountTitle1,amountTitle2})=>{

    const selectRef:any = React.createRef();
    const baseAmountRef:any = React.createRef();
    const attachAmountRef:any = React.createRef();

    return (<>
        <IonModal
        isOpen={show}
        onDidDismiss={() => onCancel()}
        cssClass="counter-list-modal"
        mode="ios"
        >

            <IonList mode="md">
                {
                    title &&
                    <IonListHeader mode="ios">
                        {title}
                    </IonListHeader>
                }
                <IonItemDivider mode="md"/>
                <div className="counter-list">
                <IonRadioGroup ref={selectRef} onIonChange={(e)=>{
                    const counters = data.filter(c=> c && c.counterId == e.detail.value);
                    onCallback(counters[0])
                }}>


                    {
                        data && data.map(v=>{
                            if(!v){
                               return <></>
                            }
                            return v && <>
                                <IonItem>
                                    <IonAvatar>
                                        <CounterSvg counter={v}/>
                                    </IonAvatar>
                                    <IonLabel>
                                        <p>
                                            ID:[{v.counterId}]<br/>
                                            TYPE: {StarGridType[v.enType]}<br/>
                                        </p>
                                    </IonLabel>
                                    <IonRadio slot="end" value={v.counterId} />
                                </IonItem>
                            </>
                        })
                    }
                </IonRadioGroup>
                </div>
                {
                    amountTitle1 &&
                    <IonItem>
                        <IonLabel position="stacked">{amountTitle1}</IonLabel>
                        <IonInput ref={baseAmountRef}/>
                    </IonItem>
                }
                {
                    amountTitle2 &&
                    <IonItem>
                        <IonLabel position="stacked">{amountTitle2}</IonLabel>
                        <IonInput ref={attachAmountRef}/>
                    </IonItem>
                }
            </IonList>
            <IonRow>
                <IonCol size="4">
                    <IonButton mode="ios" onClick={() => onCancel()} expand="block" fill="outline" color="secondary">CANCEL</IonButton>
                </IonCol>
                <IonCol  size="8">
                    <IonButton mode="ios" expand="block" onClick={() => {
                        const counterId = selectRef.current.value;
                        const baseAmount = baseAmountRef.current.value;
                        const attachAmount = attachAmountRef.current.value;
                        onOk(counterId,baseAmount,attachAmount)
                    }} color="primary">OK</IonButton>
                </IonCol>
            </IonRow>
        </IonModal>
    </>)
}
