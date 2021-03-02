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
    IonChip,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonFooter,
    IonLabel,
    IonCardHeader,
    IonCardSubtitle
} from '@ionic/react';
import './Epoch.css';

const Epoch: React.FC = () => {
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
                        <div style={{opacity:0.5}}>
                            <img src="./assets/img/altar.png" style={{maxWidth:"unset",width:"100%"}}/>
                        </div>
                        <div style={{opacity:0.5}}>
                            <img src="./assets/img/chaos.png" style={{maxWidth:"unset",width:"100%"}}/>
                        </div>
                    </IonCardContent>
                    <div className="text-center">
                        <IonChip color="warning">This universe is about to be initialized</IonChip>
                    </div>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default Epoch;
