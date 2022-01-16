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
import {toOpCode} from "../../../components/hexagons/utils";
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
    const accumulate = utils.fromValue(counter.level,0)
        .minus(new BigNumber(counter.force))
        .minus(new BigNumber(counter.defense))
        .minus(new BigNumber(counter.luck))
        .minus(new BigNumber(counter.move)).toNumber();
    return (<>
        <IonModal
            isOpen={show}
            onDidDismiss={() => onCancel()}
            cssClass="counter-list-modal"
            swipeToClose={false}
        >
            <IonList>
                <IonItem>
                    <IonLabel>Accumulated</IonLabel>
                    <input id="accumulateId" defaultValue={accumulate>0 ?accumulate:0} readOnly ref={accumulatedRef} />
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
                            const aRefValue = accumulatedRef && accumulatedRef.current && accumulatedRef.current.value;
                            if(new BigNumber(counter.level).toNumber() > 0 && new BigNumber(aRefValue).toNumber()>0){
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
                            const aRefValue = accumulatedRef && accumulatedRef.current && accumulatedRef.current.value;
                            if(new BigNumber(counter.level).toNumber() > 0 && new BigNumber(aRefValue).toNumber()>0){
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
                            const aRefValue = accumulatedRef && accumulatedRef.current && accumulatedRef.current.value;
                            if(new BigNumber(counter.level).toNumber() > 0 && new BigNumber(aRefValue).toNumber()>0){
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
                            const aRefValue = accumulatedRef && accumulatedRef.current && accumulatedRef.current.value;
                            if(new BigNumber(counter.level).toNumber() > 0 && new BigNumber(aRefValue).toNumber()>0){
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
                    <IonButton onClick={() => onCancel()} mode="ios" expand="block" fill="outline" color="secondary">CANCEL</IonButton>
                </IonCol>
                <IonCol  size="8">
                    <IonButton expand="block" mode="ios" onClick={() => {
                        const force = forceRef.current && forceRef.current.value;
                        const defense = defenseRef.current && defenseRef.current.value;
                        const move = moveRef.current && moveRef.current.value;
                        const lucky = luckyRef.current && luckyRef.current.value;
                        if(force && defense && move && lucky){
                            let arr = [
                                new BigNumber(force).minus(new BigNumber(counter.force)).toNumber(),
                                new BigNumber(lucky).minus(new BigNumber(counter.luck)).toNumber(),
                                new BigNumber(move).minus(new BigNumber(counter.move)).toNumber(),
                                new BigNumber(defense).minus(new BigNumber(counter.defense)).toNumber()
                            ];

                            console.log(arr,toOpCode(arr,6));
                            //000001000000000000000000
                            // 0000111 byte32 16 bytes,  1 move, 2 defense, 3 attack , 4 luck
                            onOk(toOpCode(arr,6))
                        }
                    }} color="primary">OK</IonButton>
                </IonCol>
            </IonRow>
        </IonModal>
    </>)
}
