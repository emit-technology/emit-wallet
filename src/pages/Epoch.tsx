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
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonLabel,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import './Epoch.css';
import url from "../utils/url";
import EpochAttribute from "../components/EpochAttribute";
import epochService from "../contract/epoch/sero";
import walletWorker from "../worker/walletWorker";
import {ChainType} from "../types";
import {MinerScenes} from "./epoch/miner";

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
                <IonContent fullscreen>
                    <IonHeader>
                        <IonToolbar color="primary" mode="ios">
                            <IonTitle>Epoch</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonCard mode="ios">
                        <IonCardHeader>
                            <IonCardTitle>
                                <IonLabel>
                                    ORIGIN
                                </IonLabel>
                            </IonCardTitle>

                        </IonCardHeader>
                        <IonCardContent>
                            <div onClick={() => {
                                url.epochAltar()
                            }}>
                                <img src="./assets/img/altar.png" style={{maxWidth: "unset", width: "100%"}}/>
                                <EpochAttribute driver={altarInfo && altarInfo.driver} showDriver={true} showDevice={false}/>
                            </div>
                            <div onClick={() => {
                                url.epochChaos()
                            }}>
                                <img src="./assets/img/chaos.png" style={{maxWidth: "unset", width: "100%"}}/>
                                <EpochAttribute driver={chaosInfo && chaosInfo.driver} showDriver={true} showDevice={false}/>
                            </div>
                        </IonCardContent>
                    </IonCard>
                </IonContent>
            </IonPage>
        );
    }
};

export default Epoch;
