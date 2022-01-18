import * as React from 'react';
import {Counter, Land, StarGridType} from "../../../types";
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
import HexInfoCard from "./hex-info";
import {axialCoordinatesToCube, toAxial} from "../../../components/hexagons/utils";
import {chevronForward} from "ionicons/icons";
import {isEmptyPlanet} from "./utils";
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
}
export const CounterList:React.FC<Props> = ({show,onOk,title,onCancel,data,
onCallback,amountTitle1,amountTitle2,defaultPlanet,onSelectPlanet})=>{

    const selectRef:any = React.createRef();
    const baseAmountRef:any = React.createRef();
    const attachAmountRef:any = React.createRef();

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
                <IonItemDivider  sticky color="primary">Select Counter</IonItemDivider>
                <div className="counter-list-half">
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
                    amountTitle1 &&
                    <IonItem>
                        <IonLabel position="stacked">{amountTitle1}</IonLabel>
                        <IonInput ref={baseAmountRef} type="number" placeholder="0.000"/>
                    </IonItem>
                }
                {
                    amountTitle2 &&
                    <IonItem>
                        <IonLabel position="stacked">{amountTitle2}</IonLabel>
                        <IonInput ref={attachAmountRef} type="number" placeholder="0.000"/>
                    </IonItem>
                }
                {
                    !isEmptyPlanet(defaultPlanet) && <IonItem detail detailIcon={chevronForward} onClick={()=>{
                        onSelectPlanet()
                    }}><IonLabel>
                        Default Planet
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
                    <IonButton mode="ios" onClick={() => onCancel()} expand="block" fill="outline" color="secondary">CANCEL</IonButton>
                </IonCol>
                <IonCol  size="8">
                    <IonButton mode="ios" expand="block" onClick={() => {
                        if(selectRef && selectRef.current && baseAmountRef && baseAmountRef.current && attachAmountRef && attachAmountRef.current){
                            const counterId = selectRef.current.value;
                            const baseAmount = baseAmountRef.current.value;
                            const attachAmount = attachAmountRef.current.value;
                            onOk(counterId,baseAmount,attachAmount)
                        }
                    }} color="primary">OK</IonButton>
                </IonCol>
            </IonRow>
        </IonModal>
    </>)
}
