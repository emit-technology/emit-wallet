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

import * as React from 'react';
import copy from 'copy-to-clipboard';
import './Receive.css'
import {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonList,
    IonPage,
    IonTitle,
    IonText,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardContent,
    IonButton, IonIcon, IonToast
} from "@ionic/react";
import {add,chevronBack} from "ionicons/icons";
import url from "../utils/url";
import i18n from "../locales/i18n"

const QRCode = require('qrcode.react');

class Receive extends React.Component<any, any> {

    state: any = {
        address: ""
    }

    componentDidMount() {
        this.init();
    }

    init = () => {
        this.setState({
            address: this.props.match.params.address
        })
    }

    setShowToast =(f:boolean)=>{
        this.setState({
            showToast:f
        })
    }
    render() {
        const {address,showToast} = this.state;
        return <IonPage>
            <IonContent fullscreen>
                <IonHeader>
                    <IonToolbar color="primary" mode="ios">
                        <IonIcon src={chevronBack} slot="start" size="large" onClick={()=>{url.back()}}/>
                        <IonTitle>{i18n.t("receive")}</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <div>
                    <IonCard mode="ios">
                        <IonCardHeader>
                            <IonCardSubtitle className="text-center">
                                {i18n.t("receiveTip")}
                            </IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent className="text-center" mode="ios">
                            <QRCode value={address} level="L"/>
                            <br/>
                            <IonText className="receive-small">{address}</IonText>
                            <br/>
                            <IonButton mode="ios" size="small" fill="outline" onClick={()=>{
                                copy(address);
                                copy(address);
                                this.setShowToast(true)
                            }}>{i18n.t("copy")}</IonButton>
                        </IonCardContent>
                    </IonCard>
                </div>
                <IonToast
                    color="dark"
                    position="top"
                    isOpen={showToast}
                    onDidDismiss={() => this.setShowToast(false)}
                    message="Copied to clipboard!"
                    duration={1500}
                    mode="ios"
                />
            </IonContent>
        </IonPage>
    }
}

export default Receive