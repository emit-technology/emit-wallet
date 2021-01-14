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
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,IonText, IonButton, IonGrid, IonRow, IonCol, IonIcon
} from "@ionic/react";
import './style.css';
import url from "../../utils/url";
import {chevronBack} from "ionicons/icons";
import i18n from "../../locales/i18n"

interface State {
    mnemonic: Array<string>;
}

class Backup extends React.Component<any, State> {

    state: State = {
        mnemonic: [],
    }

    componentDidMount() {
        const tmpMnemonic:any = sessionStorage.getItem("tmpMnemonic")
        if(!tmpMnemonic){
            // window.location.href = "/#/account/create";
            url.accountCreate();
            return
        }
        this.setState({
            mnemonic:tmpMnemonic.split(" ")
        })
    }

    render() {
        const {mnemonic} = this.state;
        return <>
            <IonPage>
                <IonContent fullscreen>
                    <IonHeader>
                        <IonToolbar mode="ios" color="primary">
                            <IonIcon src={chevronBack} slot="start" size="large" onClick={()=>{url.back()}}/>
                            <IonTitle>{i18n.t("backupMnemonic")}</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonList>
                        <IonItem lines="none">
                            <IonText color="medium">
                                <p>
                                    {i18n.t("backupMnemonicTip1")}
                                </p>
                            </IonText>
                        </IonItem>
                        <IonItem lines={"none"}>
                            <IonGrid className="grid-c">
                                <IonRow className="border-bottom">
                                    <IonCol className="grid-col border-right">
                                        <IonText>{mnemonic[0]}</IonText>
                                        <div className="col-num">1</div>
                                    </IonCol>
                                    <IonCol className="grid-col border-right">
                                        <IonText>{mnemonic[1]}</IonText>
                                        <div className="col-num">2</div>
                                    </IonCol>
                                    <IonCol className="grid-col">
                                        <IonText>{mnemonic[2]}</IonText>
                                        <div className="col-num">3</div>
                                    </IonCol>
                                </IonRow>
                                <IonRow className="border-bottom">
                                    <IonCol className="grid-col border-right">
                                        <IonText>{mnemonic[3]}</IonText>
                                        <div className="col-num">4</div>
                                    </IonCol>
                                    <IonCol className="grid-col border-right">
                                        <IonText>{mnemonic[4]}</IonText>
                                        <div className="col-num">5</div>
                                    </IonCol>
                                    <IonCol className="grid-col">
                                        <IonText>{mnemonic[5]}</IonText>
                                        <div className="col-num">6</div>
                                    </IonCol>
                                </IonRow>
                                <IonRow className="border-bottom">
                                    <IonCol className="grid-col border-right">
                                        <IonText>{mnemonic[6]}</IonText>
                                        <div className="col-num">7</div>
                                    </IonCol>
                                    <IonCol className="grid-col border-right">
                                        <IonText>{mnemonic[7]}</IonText>
                                        <div className="col-num">8</div>
                                    </IonCol>
                                    <IonCol className="grid-col">
                                        <IonText>{mnemonic[8]}</IonText>
                                        <div className="col-num">9</div>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol className="grid-col border-right">
                                        <IonText>{mnemonic[9]}</IonText>
                                        <div className="col-num">10</div>
                                    </IonCol>
                                    <IonCol className="grid-col border-right">
                                        <IonText>{mnemonic[10]}</IonText>
                                        <div className="col-num">11</div>
                                    </IonCol>
                                    <IonCol className="grid-col">
                                        <IonText>{mnemonic[11]}</IonText>
                                        <div className="col-num">12</div>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonItem>
                        <IonItem lines={"none"}>
                            <IonText color="medium">
                                <ul>
                                    <li>{i18n.t("backupMnemonicTip2")}</li>
                                    <li>{i18n.t("backupMnemonicTip3")}</li>
                                </ul>
                            </IonText>
                        </IonItem>

                    </IonList>
                    <div className="button-bottom">
                        <IonButton mode="ios" expand="block" onClick={()=>{
                            // window.location.href = "/#/account/confirm"
                            url.accountConfirm();
                        }}> {i18n.t("confirmBackup")}</IonButton>
                    </div>
                </IonContent>
            </IonPage>
        </>
    }
}

export default Backup;