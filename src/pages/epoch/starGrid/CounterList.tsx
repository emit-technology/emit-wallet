import * as React from 'react';
import {Counter, DriverStarGrid, Land, LockedInfo, StarGridType} from "../../../types";
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
import BigNumber from "bignumber.js";
import HexInfoCard from "./hex-info";
import {toAxial} from "../../../components/hexagons/utils";
import {chevronForward} from "ionicons/icons";
import {isEmptyPlanet} from "./utils";
import i18n from "../../../locales/i18n"
import * as utils from "../../../utils";

interface Props {
    title?: string
    show: boolean
    onOk: (counterId: string, baseAmountIn?: BigNumber, attachAmountIn?: BigNumber) => void;
    onCancel: () => void;
    data: Array<Counter>
    onCallback: (counter: Counter) => void;
    amountTitle1: any;
    amountTitle2: any;
    defaultPlanet?: Land
    onSelectPlanet: () => void;
    driverInfo?:DriverStarGrid;
    lockedInfo?:LockedInfo;
}
export const CounterList:React.FC<Props> = ({show,onOk,title,driverInfo,lockedInfo,onCancel,data,
                                                onCallback,amountTitle1,amountTitle2,defaultPlanet,onSelectPlanet})=>{

    const selectRef:any = React.createRef();
    const baseAmountRef:any = React.createRef();
    const attachAmountRef:any = React.createRef();

    const calcAmount = (percent:number )=>{
        const counterId = selectRef.current.value;
        const counters = data.filter(c=> c && c.counterId == counterId);
        const counter = counters[0];
        {
            /**
             * bLight：0.12*10^18
             bDark: 0.04*10^18
             Water: 0.1*10^18
             Earth: 208.3*10^18
             */
            let cyValue = lockedInfo.last.burnedLight;
            let min = new BigNumber(0.012);
            if(counter){
                if (counter.enType == StarGridType.EARTH) {
                    cyValue = lockedInfo.last.burnedDark;
                    min = new BigNumber(0.004);
                }
                let value = new BigNumber(0);
                if(new BigNumber(lockedInfo.last.totalEN).toNumber()>0){
                    value = new BigNumber(cyValue).dividedBy(new BigNumber(lockedInfo.last.totalEN)).multipliedBy(
                        driverInfo?utils.fromValue(driverInfo.capacity, 18).multipliedBy(3):30
                    )
                }
                if (value.toNumber() < min.toNumber()) {
                    value = min
                }
                console.log(value.toNumber(),cyValue,counter)
                //@ts-ignore
                document.getElementById("baseAmountId").value = value.toFixed(3);
            }

        }
        {
            if(counter){
                let min = new BigNumber(20.83);
                let cyValue = lockedInfo.last.burnedEarth;
                if (counter.enType == StarGridType.EARTH) {
                    cyValue = lockedInfo.last.burnedWater;
                    min = new BigNumber(0.01)
                }
                let value = new BigNumber(0);
                if(new BigNumber(lockedInfo.last.totalEN).toNumber()>0){
                    value = new BigNumber(cyValue).dividedBy(new BigNumber(lockedInfo.last.totalEN)).multipliedBy(
                        driverInfo?utils.fromValue(driverInfo.capacity, 18).multipliedBy(3):30
                    )
                }
                if (value.toNumber() < min.toNumber()) {
                    value = min
                }
                //@ts-ignore
                document.getElementById("attachAmountId").value = value.toFixed(3);
            }
        }
    }

    return (<>
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
                    <div className="counter-list-half">
                        <IonRadioGroup ref={selectRef} onIonChange={(e)=>{
                            const counters = data.filter(c=> c && c.counterId == e.detail.value);
                            onCallback(counters[0])
                        }}>
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
                    </div>
                    {
                        // t>0 && lockedInfo && baseAmountRef && baseAmountRef.current && baseAmountRef.current.value &&
                        amountTitle1 && lockedInfo &&
                        <IonRow style={{textAlign: "right"}}>
                            <IonCol size="2"><IonButton size="small" mode="ios" fill="outline" onClick={()=>{
                                calcAmount(1.20)
                            }}>120%</IonButton></IonCol>
                            <IonCol size="2"><IonButton size="small" mode="ios" fill="outline" onClick={()=>{
                                calcAmount(1.50)
                            }}>150%</IonButton></IonCol>
                            <IonCol size="2"><IonButton size="small" mode="ios" fill="outline" onClick={()=>{
                                calcAmount(2.00)
                            }}>200%</IonButton></IonCol>
                            <IonCol size="2"><IonButton size="small" mode="ios" fill="outline" onClick={()=>{
                                calcAmount(3.00)
                            }}>300%</IonButton></IonCol>
                        </IonRow>
                    }
                    {
                        amountTitle1 &&
                        <IonItem>
                            <IonLabel position="stacked">{amountTitle1}</IonLabel>
                            <IonInput ref={baseAmountRef} type="number" placeholder="0.000" id="baseAmountId"/>
                            {
                                lockedInfo &&
                                <IonButton mode="ios" size="small" fill="outline" slot="end" onClick={() => {
                                    calcAmount(1)
                                }}>{i18n.t("recommend")}</IonButton>
                            }
                        </IonItem>
                    }
                    {
                        amountTitle2 &&
                        <IonItem>
                            <IonLabel position="stacked">{amountTitle2}</IonLabel>
                            <IonInput ref={attachAmountRef} type="number" placeholder="0.000" id="attachAmountId"/>
                        </IonItem>
                    }
                    {
                        !isEmptyPlanet(defaultPlanet) && <IonItem detail detailIcon={chevronForward} onClick={()=>{
                            onSelectPlanet()
                        }}><IonLabel>
                            {i18n.t("defaultPlanet")}
                        </IonLabel>
                            <IonLabel>
                                <HexInfoCard sourceHexInfo={{hex:toAxial(defaultPlanet.coordinate),land:defaultPlanet}}/>
                            </IonLabel>
                        </IonItem>
                    }
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
                        if(selectRef && selectRef.current && baseAmountRef && baseAmountRef.current && attachAmountRef && attachAmountRef.current){
                            const counterId = selectRef.current.value;
                            const baseAmount = baseAmountRef.current.value;
                            const attachAmount = attachAmountRef.current.value;
                            onOk(counterId,baseAmount,attachAmount)
                        }
                    }} color="primary">{i18n.t("ok")}</IonButton>
                </IonCol>
            </IonRow>
        </IonModal>
    </>)
}
