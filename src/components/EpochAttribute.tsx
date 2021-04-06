import * as React from 'react';
import {IonCol, IonIcon, IonProgressBar, IonRow, IonText} from "@ionic/react";
import * as utils from "../utils";
import {DeviceInfo, DriverInfo} from "../contract/epoch/sero/types";
import BigNumber from "bignumber.js";
import {star, starOutline} from "ionicons/icons";
import i18n from "../locales/i18n";

interface Props{
    device?:DeviceInfo
    driver?:DriverInfo
    showDevice:boolean
    showDriver:boolean
}

class EpochAttribute extends React.Component<Props, any>{

    renderDarkStar = () =>{
        const {device} = this.props;
        const n = utils.calcDark(device ?device.gene:"")
        const ht:Array<any> = [];

        if(n<=4){
            for(let i=0;i<n;i++){
                ht.push(<IonIcon src={star} className="dark-star"/>)
            }
            //
            // for(let i=0;i<4-n;i++){
            //     ht.push(<IonIcon src={starOutline} className="dark-star"/>)
            // }
        }
        return ht;
    }


    render() {
        const {device,driver,showDevice,showDriver} = this.props
        const health:any = device && (new BigNumber(device.capacity).toNumber()>0 ? new BigNumber(device.power).dividedBy(new BigNumber(device.capacity)).toNumber() : 0);
        return <>
            {
                showDevice && device ?
                <div className="progress" style={{minHeight:"80px"}}>
                    <IonRow>
                        <IonCol size="7">
                            <IonText color="white" className="text-little">AXE{device?.category && `(${utils.ellipsisStr(device.ticket)})`}</IonText>
                        </IonCol>
                        <IonCol size="5">
                            <div style={{textAlign: "right"}}>
                                <IonText color="white" className="text-little">{i18n.t("health")}: {device && `${utils.fromValue(device.power,18).toFixed(2,1)}/${utils.fromValue(device.capacity,18).toFixed(2,1)}`}</IonText>
                            </div>
                        </IonCol>
                    </IonRow>
                    <div style={{padding:"0 12px"}}>
                        <IonProgressBar className={health<0.33?"progress-background-health-red":health>0.66?"progress-background-health":"progress-background"} value={health}/>
                        <div style={{padding:"2px 0"}}></div>
                        <IonProgressBar className="progress-background" value ={device && utils.fromValue(device.rate,18).toNumber()}/>
                        <IonRow>
                            <IonCol size="7">
                                {this.renderDarkStar()}
                            </IonCol>
                            <IonCol size="5">
                                <div style={{textAlign: "right"}}>
                                    <IonText color="white" className="text-little">{i18n.t("rate")}: {utils.getDeviceLv(device && device.rate)}%</IonText>
                                </div>
                            </IonCol>
                        </IonRow>

                    </div>
                </div>:
                    showDevice && <div className="progress" style={{minHeight:"80px"}}>
                        <IonRow>
                            <IonCol size="7">
                                <IonText color="white" className="text-little">AXE</IonText>
                            </IonCol>
                            <IonCol size="5">
                                <div style={{textAlign: "right"}}>
                                    <IonText color="white" className="text-little">{i18n.t("health")}: 0</IonText>
                                </div>
                            </IonCol>
                        </IonRow>
                        <div style={{padding:"0 12px"}}>
                            <IonProgressBar className="progress-background-health" value={0}/>
                            <div style={{padding:"2px 0"}}></div>
                            <IonProgressBar className="progress-background" value={0}/>
                            <div style={{textAlign: "right"}}>
                                <IonText color="white" className="text-little">{i18n.t("rate")}: 0.00%</IonText>
                            </div>
                        </div>
                    </div>
            }

            {
                showDriver && driver ?
                    <div className="progress" style={{minHeight:"45px"}}>
                        <IonRow>
                            <IonCol size="4">
                                <IonText color="white" className="text-little">DRIVER</IonText>
                            </IonCol>
                            <IonCol size="8">
                                <div style={{textAlign: "right"}}>
                                    <IonText color="white" className="text-little">{i18n.t("capacity")}: {utils.fromValue(driver.capacity,18).toFixed(2,1)}</IonText>
                                </div>
                            </IonCol>
                        </IonRow>
                        <div style={{padding:"0 12px"}}>
                            <IonProgressBar className="progress-background" value={driver && utils.fromValue(driver.rate,16).toNumber() > 0 ? (utils.fromValue(driver.rate,16).div(100).toNumber()) : 0}/>
                            <div style={{textAlign: "right"}}>
                                <IonText color="white" className="text-little">{i18n.t("rate")}: {driver && utils.getDeviceLv(driver.rate)}%</IonText>
                            </div>
                        </div>
                    </div>:
                    showDriver &&  <div className="progress" style={{minHeight:"45px"}}>
                        <IonRow>
                            <IonCol size="7">
                                <IonText color="white" className="text-little">DRIVER</IonText>
                            </IonCol>
                        </IonRow>
                        <div style={{padding:"0 12px"}}>
                            <IonProgressBar className="progress-background" value={0}/>
                            <div style={{textAlign: "right"}}>
                                <IonText color="white" className="text-little">{i18n.t("rate")}: 0.00%</IonText>
                            </div>
                        </div>
                    </div>
            }
        </>;
    }
}

export default EpochAttribute