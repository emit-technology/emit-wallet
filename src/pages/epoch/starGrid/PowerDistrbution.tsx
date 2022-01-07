import * as React from 'react';
import {Counter, StarGridType, Token} from "../../../types";
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
    IonSelect,
    IonSelectOption,
    IonIcon
} from "@ionic/react"
import * as utils from "../../../utils"
import {addCircleOutline, removeCircleOutline} from "ionicons/icons";
import BigNumber from "bignumber.js";
interface Props {
    show: boolean
    onOk?: (opcode:string) => void;
    onCancel?: () => void;
    counter:Counter
}


export const PowerDistribution: React.FC<Props> = ({show, onOk, onCancel,counter}) => {

    const forceRef:any = React.createRef();
    const defenseRef:any = React.createRef();
    const moveRef:any = React.createRef();
    const luckyRef:any = React.createRef();
    const accumulatedRef:any = React.createRef();

    return (<>
        <IonModal
            isOpen={show}
            onDidDismiss={() => onCancel()}
            cssClass="counter-list-modal"
        >
            <IonList>
                <IonItem>
                    <IonLabel>Accumulated</IonLabel>
                    <input id="accumulateId" defaultValue={counter.level} readOnly ref={accumulatedRef} />
                </IonItem>
                <IonItem>
                    <IonLabel>Force</IonLabel>
                    <IonLabel slot="end">
                        <IonIcon src={removeCircleOutline} size="small" style={{transform: "translateY(3px)"}} onClick={()=>{
                            if(new BigNumber(forceRef.current.value).minus(new BigNumber(counter.force)).toNumber() > 0){
                                //@ts-ignore
                                document.getElementById("forceId").value = new BigNumber(forceRef.current.value).minus(1).toNumber();
                                //@ts-ignore
                                document.getElementById("accumulateId").value = new BigNumber(accumulatedRef.current.value).plus(1).toNumber();
                            }
                        }}/>
                        <input id="forceId" defaultValue={counter.force} ref={forceRef} readOnly className="attribution-input"/>
                        <IonIcon src={addCircleOutline} size="small"  style={{transform: "translateY(3px)"}} onClick={()=>{
                            if(new BigNumber(counter.level).toNumber() > 0){
                                //@ts-ignore
                                document.getElementById("forceId").value = new BigNumber(forceRef.current.value).plus(1).toNumber();
                                //@ts-ignore
                                document.getElementById("accumulateId").value = new BigNumber(accumulatedRef.current.value).minus(1).toNumber();
                            }
                        }}/>
                    </IonLabel>
                </IonItem>
                <IonItem>
                    <IonLabel>Defense</IonLabel>
                    <IonLabel slot="end">
                        <IonIcon src={removeCircleOutline} size="small" style={{transform: "translateY(3px)"}} onClick={()=>{
                            if(new BigNumber(defenseRef.current.value).minus(new BigNumber(counter.defense)).toNumber() > 0){
                                //@ts-ignore
                                document.getElementById("defenseId").value = new BigNumber(defenseRef.current.value).minus(1).toNumber();
                                //@ts-ignore
                                document.getElementById("accumulateId").value = new BigNumber(accumulatedRef.current.value).plus(1).toNumber();
                            }
                        }}/>
                        <input id="defenseId" defaultValue={counter.defense} ref={defenseRef} readOnly className="attribution-input"/>
                        <IonIcon src={addCircleOutline} size="small"  style={{transform: "translateY(3px)"}} onClick={()=>{
                            if(new BigNumber(counter.level).toNumber() > 0){
                                //@ts-ignore
                                document.getElementById("defenseId").value = new BigNumber(defenseRef.current.value).plus(1).toNumber();
                                //@ts-ignore
                                document.getElementById("accumulateId").value = new BigNumber(accumulatedRef.current.value).minus(1).toNumber();
                            }
                        }}/>
                    </IonLabel>
                </IonItem>
                <IonItem>
                    <IonLabel>Move</IonLabel>
                    <IonLabel slot="end">
                        <IonIcon src={removeCircleOutline} size="small" style={{transform: "translateY(3px)"}} onClick={()=>{
                            if(new BigNumber(moveRef.current.value).minus(new BigNumber(counter.move)).toNumber() > 0){
                                //@ts-ignore
                                document.getElementById("moveId").value = new BigNumber(moveRef.current.value).minus(1).toNumber();
                                //@ts-ignore
                                document.getElementById("accumulateId").value = new BigNumber(accumulatedRef.current.value).plus(1).toNumber();
                            }
                        }}/>
                        <input id="moveId" defaultValue={counter.move} ref={moveRef} readOnly className="attribution-input"/>
                        <IonIcon src={addCircleOutline} size="small"  style={{transform: "translateY(3px)"}} onClick={()=>{
                            if(new BigNumber(counter.level).toNumber() > 0){
                                //@ts-ignore
                                document.getElementById("moveId").value = new BigNumber(moveRef.current.value).plus(1).toNumber();
                                //@ts-ignore
                                document.getElementById("accumulateId").value = new BigNumber(accumulatedRef.current.value).minus(1).toNumber();
                            }
                        }}/>
                    </IonLabel>
                </IonItem>
                <IonItem>
                    <IonLabel>Lucky</IonLabel>
                    <IonLabel slot="end">
                        <IonIcon src={removeCircleOutline} size="small" style={{transform: "translateY(3px)"}} onClick={()=>{
                            if(new BigNumber(luckyRef.current.value).minus(new BigNumber(counter.luck)).toNumber() > 0){
                                //@ts-ignore
                                document.getElementById("luckyId").value = new BigNumber(luckyRef.current.value).minus(1).toNumber();
                                //@ts-ignore
                                document.getElementById("accumulateId").value = new BigNumber(accumulatedRef.current.value).plus(1).toNumber();
                            }
                        }}/>
                        <input id="luckyId" defaultValue={counter.luck} ref={luckyRef} readOnly className="attribution-input"/>
                        <IonIcon src={addCircleOutline} size="small"  style={{transform: "translateY(3px)"}} onClick={()=>{
                            if(new BigNumber(counter.level).toNumber() > 0){
                                //@ts-ignore
                                document.getElementById("luckyId").value = new BigNumber(luckyRef.current.value).plus(1).toNumber();
                                //@ts-ignore
                                document.getElementById("accumulateId").value = new BigNumber(accumulatedRef.current.value).minus(1).toNumber();
                            }
                        }}/>
                    </IonLabel>
                </IonItem>
            </IonList>
            <IonRow>
                <IonCol size="4">
                    <IonButton onClick={() => onCancel()} expand="block" fill="outline" color="secondary">CANCEL</IonButton>
                </IonCol>
                <IonCol  size="8">
                    <IonButton expand="block" onClick={() => {
                        const force = forceRef.current.value;
                        const defense = defenseRef.current.value;
                        const move = moveRef.current.value;
                        const lucky = luckyRef.current.value;
                        const arr = [new BigNumber(force).toString(2)];
                        onOk(arr.join(""))
                    }} color="primary">OK</IonButton>
                </IonCol>
            </IonRow>
        </IonModal>
    </>)
}
