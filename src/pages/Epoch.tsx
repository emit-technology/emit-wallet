/**
 * Copyright 2020 EMIT Foundation.
 This file is part of E.M.I.T. .

 E.M.I.T. is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 E.M.I.T. is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with E.M.I.T. . If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react';
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonPage,
    IonRow,
    IonTitle,
    IonToolbar,IonText
} from '@ionic/react';
import './Epoch.css';
import url from "../utils/url";
import EpochAttribute from "../components/EpochAttribute";
import epochService from "../contract/epoch/sero";
import walletWorker from "../worker/walletWorker";
import {ChainType} from "../types";
import {MinerScenes} from "./epoch/miner";
import {chevronForwardOutline, helpCircleOutline, statsChartOutline} from "ionicons/icons";
import {Plugins} from "@capacitor/core";

class Epoch extends React.Component<any, any>{

    state:any = {
    }

    constructor(props:any) {
        super(props);
    }

    componentDidMount() {
        this.init().catch(e=>{
            console.error(e)
        })
    }

    init = async ()=>{
        const account = await walletWorker.accountInfo()
        const altarInfo = await epochService.userInfo(MinerScenes.altar, account.addresses[ChainType.SERO])
        const chaosInfo = await epochService.userInfo(MinerScenes.chaos, account.addresses[ChainType.SERO])
        this.setState({
            altarInfo: altarInfo,
            chaosInfo: chaosInfo
        })
    }

    render() {
        const {chaosInfo,altarInfo} = this.state;
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar color="primary" mode="ios">
                        <IonTitle>Epoch</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    <div style={{padding:"12px 15px 5px"}}>
                        <div style={{fontSize:"24px",fontWeight:500}}>ORIGIN</div>
                    </div>
                    <div className="epoch-box">
                        <div  className="epoch-origin">
                            <IonItem lines="none" detail={true} detailIcon={chevronForwardOutline} onClick={()=>{
                                Plugins.Browser.open({url:"https://emit.technology"})
                            }}>
                                <IonIcon src={helpCircleOutline}  color="warning"/>
                                <IonLabel className="ion-text-wrap" color="warning">
                                    This is a test message, click me for more info!
                                </IonLabel>
                            </IonItem>

                            <IonCard mode="ios" style={{marginTop: "4px"}} onClick={() => {
                                url.epochAltar()
                            }}>
                                <IonCardContent>
                                    <img src="./assets/img/altar.png" style={{width:"100vw"}}/>
                                    <EpochAttribute driver={altarInfo && altarInfo.driver} showDriver={true} showDevice={false}/>
                                    <IonRow>
                                        <IonCol>
                                            <IonButton size="small" expand="block" fill="outline" onClick={(e)=>{
                                                e.stopPropagation();
                                                url.epochDeviceRank()
                                            }}>
                                                <IonLabel><IonIcon src={statsChartOutline} size="small"/> DEVICE</IonLabel>
                                            </IonButton>
                                        </IonCol>
                                        <IonCol>
                                            <IonButton size="small" expand="block" fill="outline" onClick={(e)=>{
                                                e.stopPropagation()
                                                url.epochDriverRank(MinerScenes.altar)
                                            }}>
                                                <IonLabel><IonIcon src={statsChartOutline} size="small"/> ALTAR DRIVER</IonLabel>
                                            </IonButton>
                                        </IonCol>
                                    </IonRow>
                                </IonCardContent>
                            </IonCard>

                            <IonCard mode="ios" onClick={() => {
                                url.epochChaos()
                            }}>
                                <IonCardContent>
                                    <img src="./assets/img/chaos.png" style={{width:"100vw"}}/>
                                    <EpochAttribute driver={chaosInfo && chaosInfo.driver} showDriver={true} showDevice={false}/>
                                    <IonRow>
                                        <IonCol>
                                            <IonButton size="small" expand="block" fill="outline" onClick={(e)=>{
                                                e.stopPropagation()
                                                url.epochDriverRank(MinerScenes.chaos)
                                            }}>
                                                <IonLabel><IonIcon src={statsChartOutline} size="small"/> CHAOS DRIVER</IonLabel>
                                            </IonButton>
                                        </IonCol>
                                    </IonRow>
                                </IonCardContent>
                            </IonCard>
                        </div>
                    </div>

                    {/*<IonFab vertical="bottom" horizontal="end" slot="fixed">*/}
                        {/*<IonFabButton>*/}
                        {/*    <IonIcon icon={statsChartOutline} />*/}
                        {/*</IonFabButton>*/}
                        {/*<IonFabList side="start">*/}
                        {/*    <div style={{background:"#fff" ,minHeight:"25px"}}>*/}
                        {/*        */}
                        {/*    </div>*/}
                        {/*</IonFabList>*/}
                    {/*</IonFab>*/}
                </IonContent>
            </IonPage>
        );
    }
};

export default Epoch;
