import * as React from 'react';
import {Counter, StarGridType, Token} from "../../../types";
import {
    IonList,
    IonLabel,
    IonItem,
    IonModal,
    IonButton,
    IonRow,
    IonCol,
    IonIcon
} from "@ionic/react"
import * as utils from "../../../utils"
import {addCircleOutline, removeCircleOutline} from "ionicons/icons";
import BigNumber from "bignumber.js";
import {toOpCode} from "../../../components/hexagons/utils";
import i18n from "../../../locales/i18n"
interface Props {
    show: boolean
    onOk?: (opcode:string) => void;
    onCancel?: () => void;
    counter:Counter
}
interface State{
    accum:number
    force:number
    defense:number
    move:number
    luck:number
}

const forceRef:any = React.createRef();
const defenseRef:any = React.createRef();
const moveRef:any = React.createRef();
const luckyRef:any = React.createRef();
const accumulatedRef:any = React.createRef();

export class PowerDistribution extends React.Component<Props, State>{

    state:State = {
        accum:0,force:0,defense:0,move:0,luck:0
    }

    componentDidMount() {
        const {counter} = this.props;

        this.setState({
           accum:this.accumulate()>0?this.accumulate():0,
           force:new BigNumber(counter.force).toNumber(),
           move:new BigNumber(counter.move).toNumber(),
           defense:new BigNumber(counter.defense).toNumber(),
           luck:new BigNumber(counter.luck).toNumber(),
        })
    }

    accumulate = ():number =>{
        const {counter} = this.props;
        if(!counter){
            return 0;
        }
        const rest = utils.fromValue(counter.level,0)
            .minus(new BigNumber(counter.force))
            .minus(new BigNumber(counter.defense))
            .minus(new BigNumber(counter.luck))
            .minus(new BigNumber(counter.move)).toNumber();
        return rest
    }

    render() {
        const {show,onOk,onCancel,counter} = this.props;
        const {force,defense,luck,move,accum} = this.state;
        const aRefValue = accumulatedRef && accumulatedRef.current ? accumulatedRef.current.value:this.accumulate();
        return  (<>
            <IonModal
                isOpen={show}
                onDidDismiss={() => onCancel()}
                cssClass="counter-list-modal"
                swipeToClose={false}
            >
                <IonList>
                    <IonItem>
                        <IonLabel>{i18n.t("points")}</IonLabel>
                        <IonLabel slot="end">
                            <input id="accumulateId" defaultValue={aRefValue} readOnly ref={accumulatedRef} className="attribution-input"/>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>{i18n.t("force")}</IonLabel>
                        <IonLabel slot="end">
                            <IonIcon src={removeCircleOutline} color={
                                forceRef && forceRef.current && new BigNumber(forceRef.current.value).minus(new BigNumber(counter.force)).toNumber() > 0 ?
                                    "dark":"medium"
                            } size="small" style={{transform: "translateY(3px)"}} onClick={()=>{
                                if(forceRef && forceRef.current && new BigNumber(forceRef.current.value).minus(new BigNumber(counter.force)).toNumber() > 0){
                                    //@ts-ignore
                                    document.getElementById("forceId").value = new BigNumber(forceRef.current.value).minus(1).toNumber();
                                    //@ts-ignore
                                    document.getElementById("accumulateId").value = new BigNumber(accumulatedRef.current.value).plus(1).toNumber();
                                    this.setState({accum:accum+1,force:force-1})
                                }
                            }}/>

                            <input id="forceId" defaultValue={counter.force} ref={forceRef} readOnly className="attribution-input"/>

                            <IonIcon src={addCircleOutline} size="small" color={
                                new BigNumber(counter.level).toNumber() > 0 && new BigNumber(aRefValue).toNumber()>0?"dark":"medium"
                            }  style={{transform: "translateY(3px)"}} onClick={()=>{
                                if(new BigNumber(counter.level).toNumber() > 0 && new BigNumber(aRefValue).toNumber()>0){
                                    //@ts-ignore
                                    document.getElementById("forceId").value = new BigNumber(forceRef.current.value).plus(1).toNumber();
                                    //@ts-ignore
                                    document.getElementById("accumulateId").value = new BigNumber(accumulatedRef.current.value).minus(1).toNumber();
                                    this.setState({accum:accum-1,force:force+1})
                                }
                            }}/>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>{i18n.t("defense")}</IonLabel>
                        <IonLabel slot="end">
                            <IonIcon src={removeCircleOutline} size="small" color={
                                defenseRef && defenseRef.current && new BigNumber(defenseRef.current.value).minus(new BigNumber(counter.defense)).toNumber() > 0?
                                    "dark":"medium"
                            } style={{transform: "translateY(3px)"}} onClick={()=>{
                                if(new BigNumber(defenseRef.current.value).minus(new BigNumber(counter.defense)).toNumber() > 0){
                                    //@ts-ignore
                                    document.getElementById("defenseId").value = new BigNumber(defenseRef.current.value).minus(1).toNumber();
                                    //@ts-ignore
                                    document.getElementById("accumulateId").value = new BigNumber(accumulatedRef.current.value).plus(1).toNumber();
                                    this.setState({accum:accum+1,defense:defense-1})
                                }
                            }}/>
                            <input id="defenseId" defaultValue={counter.defense} ref={defenseRef} readOnly className="attribution-input"/>
                            <IonIcon src={addCircleOutline} size="small" color={
                                new BigNumber(counter.level).toNumber() > 0 && new BigNumber(aRefValue).toNumber()>0?"dark":"medium"
                            }  style={{transform: "translateY(3px)"}} onClick={()=>{
                                if(new BigNumber(counter.level).toNumber() > 0 && new BigNumber(aRefValue).toNumber()>0){
                                    //@ts-ignore
                                    document.getElementById("defenseId").value = new BigNumber(defenseRef.current.value).plus(1).toNumber();
                                    //@ts-ignore
                                    document.getElementById("accumulateId").value = new BigNumber(accumulatedRef.current.value).minus(1).toNumber();
                                    this.setState({accum:accum-1,defense:defense+1})
                                }
                            }}/>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>{i18n.t("move")}</IonLabel>
                        <IonLabel slot="end">
                            <IonIcon src={removeCircleOutline} size="small" color={
                                moveRef && moveRef.current && new BigNumber(moveRef.current.value).minus(new BigNumber(counter.move)).toNumber() > 0?
                                    "dark":"medium"
                            } style={{transform: "translateY(3px)"}} onClick={()=>{
                                if(new BigNumber(moveRef.current.value).minus(new BigNumber(counter.move)).toNumber() > 0){
                                    //@ts-ignore
                                    document.getElementById("moveId").value = new BigNumber(moveRef.current.value).minus(1).toNumber();
                                    //@ts-ignore
                                    document.getElementById("accumulateId").value = new BigNumber(accumulatedRef.current.value).plus(1).toNumber();
                                    this.setState({accum:accum+1,move:move-1})
                                }
                            }}/>
                            <input id="moveId" defaultValue={counter.move} ref={moveRef} readOnly className="attribution-input"/>
                            <IonIcon src={addCircleOutline} size="small" color={
                                new BigNumber(counter.level).toNumber() > 0 && new BigNumber(aRefValue).toNumber()>0?"dark":"medium"
                            } style={{transform: "translateY(3px)"}} onClick={()=>{
                                if(new BigNumber(counter.level).toNumber() > 0 && new BigNumber(aRefValue).toNumber()>0){
                                    //@ts-ignore
                                    document.getElementById("moveId").value = new BigNumber(moveRef.current.value).plus(1).toNumber();
                                    //@ts-ignore
                                    document.getElementById("accumulateId").value = new BigNumber(accumulatedRef.current.value).minus(1).toNumber();
                                    this.setState({accum:accum-1,move:move+1})
                                }
                            }}/>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>{i18n.t("luck")}</IonLabel>
                        <IonLabel slot="end">
                            <IonIcon src={removeCircleOutline} size="small" color={
                                luckyRef && luckyRef.current && new BigNumber(luckyRef.current.value).minus(new BigNumber(counter.luck)).toNumber() > 0?
                                    "dark":"medium"
                            } style={{transform: "translateY(3px)"}} onClick={()=>{
                                if(new BigNumber(luckyRef.current.value).minus(new BigNumber(counter.luck)).toNumber() > 0){
                                    //@ts-ignore
                                    document.getElementById("luckyId").value = new BigNumber(luckyRef.current.value).minus(1).toNumber();
                                    //@ts-ignore
                                    document.getElementById("accumulateId").value = new BigNumber(accumulatedRef.current.value).plus(1).toNumber();
                                    this.setState({accum:accum+1,luck:luck-1})
                                }
                            }}/>
                            <input id="luckyId" defaultValue={counter.luck} ref={luckyRef} readOnly className="attribution-input"/>
                            <IonIcon src={addCircleOutline} size="small" color={
                                new BigNumber(counter.level).toNumber() > 0 && new BigNumber(aRefValue).toNumber()>0?"dark":"medium"
                            } style={{transform: "translateY(3px)"}} onClick={()=>{
                                if(new BigNumber(counter.level).toNumber() > 0 && new BigNumber(aRefValue).toNumber()>0){
                                    //@ts-ignore
                                    document.getElementById("luckyId").value = new BigNumber(luckyRef.current.value).plus(1).toNumber();
                                    //@ts-ignore
                                    document.getElementById("accumulateId").value = new BigNumber(accumulatedRef.current.value).minus(1).toNumber();
                                    this.setState({accum:accum-1,luck:luck+1})
                                }
                            }}/>
                        </IonLabel>
                    </IonItem>
                </IonList>
                <IonRow>
                    <IonCol size="4">
                        <IonButton onClick={() => onCancel()} mode="ios" expand="block" fill="outline" color="secondary">{i18n.t("cancel")}</IonButton>
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
                        }} color="primary">{i18n.t("ok")}</IonButton>
                    </IonCol>
                </IonRow>
            </IonModal>
        </>);
    }
}
