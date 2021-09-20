import * as React from 'react';
import {IonCol, IonIcon, IonModal, IonProgressBar, IonRow, IonText} from "@ionic/react";
import * as utils from "../utils";
import {DeviceInfo, DeviceInfoRank, DriverInfo} from "../contract/epoch/sero/types";
import BigNumber from "bignumber.js";
import {star, starOutline, createOutline, statsChartOutline} from "ionicons/icons";
import i18n from "../locales/i18n";
import ModifyName from "./epoch/ModifyName";
import {MinerScenes} from "../pages/epoch/miner";
import DeviceRank from "./epoch/DeviceRank";
import epochRankService from "../contract/epoch/sero/rank";

interface Props{
    device?:DeviceInfo
    driver?:DriverInfo
    showDevice:boolean
    showDriver:boolean
    scenes?:MinerScenes
    doUpdate?:()=>void
    hiddenButton?:boolean
    color?:string
}

interface State{
    showDriverModify:boolean
    showModal:boolean
    myRankDevice:Array<DeviceInfoRank>
    position:number
}

class EpochAttribute extends React.Component<Props, State>{

    state:State = {
        showDriverModify:false,
        showModal:false,
        myRankDevice:[],
        position:0
    }



    setShowDriverModify = (f:boolean)=>{
        this.setState({
            showDriverModify:f
        })
    }


    setShowModal = (f:boolean)=>{
        this.setState({
            showModal:f,
        })
        if(f){
            this.setState({
                myRankDevice:[],
                position:0
            })
        }
    }

    queryMyRank = async (ticket:string)=>{
        this.setShowModal(true)
        const rest = await epochRankService.epochPositionDevice(ticket)
        this.setState({
            myRankDevice:rest.data,
            position:rest.position
        })
    }


    render() {
        const {device,driver,showDevice,showDriver,scenes,hiddenButton,color} = this.props
        const {showModal,myRankDevice,position,showDriverModify} = this.state;
        const health:any = device && (new BigNumber(device.capacity).toNumber()>0 ? new BigNumber(device.power).dividedBy(new BigNumber(device.capacity)).toNumber() : 0);
        return <>
            {
                showDevice && device ?
                <div className="progress" style={{minHeight:"80px"}}>
                    <IonRow>
                        <IonCol size="7" style={{    paddingLeft:"0"}}>
                            <IonText color={color?color:"white"} className="text-little">
                                AXE{device?.category && device.alis?`(${device.alis})`:`(${utils.ellipsisStr(device.ticket,5)})`}
                                &nbsp;&nbsp;
                                {
                                    !hiddenButton && <IonIcon src={statsChartOutline}  size="small" color={color?color:"white"} onClick={(e)=>{
                                        e.stopPropagation();
                                        this.queryMyRank(device.ticket).catch(e=>{
                                            console.error(e)
                                        })
                                    }}/>
                                }
                            </IonText>

                        </IonCol>
                        <IonCol size="5">
                            <div style={{textAlign: "right"}}>
                                <IonText color={color?color:"white"} className="text-little">{i18n.t("health")}: {device && `${utils.fromValue(device.power,18).toFixed(2,1)}/${utils.fromValue(device.capacity,18).toFixed(2,1)}`}</IonText>
                            </div>
                        </IonCol>
                    </IonRow>
                    <div style={{padding:"0 12px 0 0"}}>
                        <IonProgressBar className={health<0.33?"progress-background-health-red":health>0.66?"progress-background-health":"progress-background"} value={health}/>
                        <div style={{padding:"2px 0"}}></div>
                        <IonProgressBar className="progress-background" value ={device && utils.fromValue(device.rate,18).toNumber()}/>
                        <IonRow>
                            <IonCol size="5">
                                <div style={{textAlign:"left"}}>
                                    {utils.renderDarkStar(device.gene).map(v=>{
                                        return <IonIcon src={star} className="dark-star"/>
                                    })}
                                </div>
                            </IonCol>
                            <IonCol size="7">
                                <div style={{textAlign: "right"}}>
                                    <IonText color={color?color:"white"} className="text-little">{i18n.t("rate")}: {utils.getDeviceLv(device && device.rate)}%</IonText>
                                </div>
                            </IonCol>
                        </IonRow>

                    </div>
                </div>:
                    showDevice && <div className="progress" style={{minHeight:"80px"}}>
                        <div>
                            <IonRow>
                                <IonCol size="7" style={{    paddingLeft:"0"}}>
                                    <IonText color={color?color:"white"} className="text-little">AXE</IonText>
                                </IonCol>
                                <IonCol size="5">
                                    <div style={{textAlign: "right"}}>
                                        <IonText color={color?color:"white"} className="text-little">{i18n.t("health")}: 0</IonText>
                                    </div>
                                </IonCol>
                            </IonRow>
                        </div>
                        <div style={{padding:"0 12px 0 0"}}>
                            <IonProgressBar className="progress-background-health" value={0}/>
                            <div style={{padding:"2px 0"}}></div>
                            <IonProgressBar className="progress-background" value={0}/>
                            <div style={{textAlign: "right"}}>
                                <IonText color={color?color:"white"} className="text-little">{i18n.t("rate")}: 0.00%</IonText>
                            </div>
                        </div>
                    </div>
            }

            {
                showDriver && driver ?
                    <div className="progress" style={{minHeight:"45px"}}>
                        <IonRow>
                            <IonCol size="7" style={{    paddingLeft:"0"}}>
                                <IonText color={color?color:"white"} className="text-little">DRIVER{driver.alis?`:${driver.alis}`:""}&nbsp;&nbsp;
                                    {scenes && <IonIcon src={createOutline} size="small" color={color?color:"white"} onClick={(e)=>{
                                        e.stopPropagation();
                                        this.setShowDriverModify(true)
                                    }}/>}
                                </IonText>

                            </IonCol>
                            <IonCol size="5">
                                <div style={{textAlign: "right"}}>
                                    <IonText color={color?color:"white"} className="text-little">{i18n.t("capacity")}: {utils.fromValue(driver.capacity,18).toFixed(2,1)}</IonText>
                                </div>
                            </IonCol>
                        </IonRow>
                        <div style={{padding:"0 12px 0 0"}}>
                            <IonProgressBar className="progress-background" value={driver && utils.fromValue(driver.rate,16).toNumber() > 0 ? (utils.fromValue(driver.rate,16).div(100).toNumber()) : 0}/>
                            <div style={{textAlign: "right"}}>
                                <IonText color={color?color:"white"} className="text-little">{i18n.t("rate")}: {driver && utils.getDeviceLv(driver.rate)}%</IonText>
                            </div>
                        </div>
                    </div>:
                    showDriver &&  <div className="progress" style={{minHeight:"45px"}}>
                        <IonRow>
                            <IonCol size="7">
                                <IonText color={color?color:"white"} className="text-little">DRIVER</IonText>
                            </IonCol>
                        </IonRow>
                        <div style={{padding:"0 12px 0 0"}}>
                            <IonProgressBar className="progress-background" value={0}/>
                            <div style={{textAlign: "right"}}>
                                <IonText color={color?color:"white"} className="text-little">{i18n.t("rate")}: 0.00%</IonText>
                            </div>
                        </div>
                    </div>
            }
            <IonModal
                mode="ios"
                isOpen={showModal}
                cssClass='epoch-rank-modal'
                onDidDismiss={() => this.setShowModal(false)}>

                <DeviceRank devices={myRankDevice} position={position} ticket={device?.ticket} pageSize={10} isModal={true}/>
            </IonModal>

            {/*<ModifyName show={showDeviceModify} device={device} onDidDismiss={this.setShowDeviceModify} defaultName={device?.alis}/>*/}
            <ModifyName show={showDriverModify} driver={driver} onDidDismiss={this.setShowDriverModify} defaultName={driver?.alis} scenes={scenes} update={()=>{this.props.doUpdate && this.props.doUpdate()}}/>
        </>;
    }
}

export default EpochAttribute