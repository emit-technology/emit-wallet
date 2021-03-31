import * as React from 'react';
import {IonCol, IonProgressBar, IonRow, IonText} from "@ionic/react";
import * as utils from "../utils";
import {DeviceInfo, DriverInfo} from "../contract/epoch/sero/types";

interface Props{
    device?:DeviceInfo
    driver?:DriverInfo
    showDevice:boolean
    showDriver:boolean
}

class EpochAttribute extends React.Component<Props, any>{

    render() {
        const {device,driver,showDevice,showDriver} = this.props
        return <>
            {
                showDevice && device ?
                <div className="progress" style={{minHeight:"80px"}}>
                    <IonRow>
                        <IonCol size="7">
                            <IonText color="white" className="text-little">AEX{device?.category && `(${utils.ellipsisStr(device.ticket)})`}</IonText>
                        </IonCol>
                        <IonCol size="5">
                            <div style={{textAlign: "right"}}>
                                <IonText color="white" className="text-little">Health: {device && `${utils.fromValue(device.power,16).toFixed(0,1)}/${utils.fromValue(device.capacity,16).toFixed(0,1)}`}</IonText>
                            </div>
                        </IonCol>
                    </IonRow>
                    <div style={{padding:"0 12px"}}>
                        <IonProgressBar className="progress-background-health" value={device && (device.capacity ? device.power / device.capacity : 0)}/>
                        <div style={{padding:"2px 0"}}></div>
                        <IonProgressBar className="progress-background" value={device && utils.fromValue(device.rate,18).toNumber()}/>
                        <div style={{textAlign: "right"}}>
                            <IonText color="white" className="text-little">Rate: {utils.getDeviceLv(device && device.rate)}%</IonText>
                        </div>
                    </div>
                </div>:
                    showDevice && <div className="progress" style={{minHeight:"80px"}}>
                        <IonRow>
                            <IonCol size="7">
                                <IonText color="white" className="text-little">AEX</IonText>
                            </IonCol>
                            <IonCol size="5">
                                <div style={{textAlign: "right"}}>
                                    <IonText color="white" className="text-little">Health: 0</IonText>
                                </div>
                            </IonCol>
                        </IonRow>
                        <div style={{padding:"0 12px"}}>
                            <IonProgressBar className="progress-background-health" value={0}/>
                            <div style={{padding:"2px 0"}}></div>
                            <IonProgressBar className="progress-background" value={0}/>
                            <div style={{textAlign: "right"}}>
                                <IonText color="white" className="text-little">Rate: 0.00%</IonText>
                            </div>
                        </div>
                    </div>
            }

            {
                showDriver && driver ?
                    <div className="progress" style={{minHeight:"45px"}}>
                        <IonRow>
                            <IonCol size="7">
                                <IonText color="white" className="text-little">DRIVER</IonText>
                            </IonCol>
                        </IonRow>
                        <div style={{padding:"0 12px"}}>
                            <IonProgressBar className="progress-background" value={driver && utils.fromValue(driver.rate,16).toNumber() > 0 ? (utils.fromValue(driver.rate,16).div(100).toNumber()) : 0}/>
                            <div style={{textAlign: "right"}}>
                                <IonText color="white" className="text-little">Rate: {driver && utils.getDeviceLv(driver.rate)}%</IonText>
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
                                <IonText color="white" className="text-little">Rate: 0.00%</IonText>
                            </div>
                        </div>
                    </div>
            }
        </>;
    }
}

export default EpochAttribute