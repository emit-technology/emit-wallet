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
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonInput, IonText, IonButton, IonToast, IonProgressBar, IonSpinner, IonIcon
} from "@ionic/react";
import './style.css';
import walletWorker from "../../worker/walletWorker";
import {AccountModel} from "@emit-technology/emit-lib";
import url from "../../utils/url";
import i18n from "../../locales/i18n";
import {chevronBack} from "ionicons/icons";
import {config} from "../../config";

interface State {
    name: string;
    password: string;
    rePassword: string;
    tips: string;
    showToast: boolean;
    toastMessage?: string
    showProgress: boolean
    showPasswordTips: boolean
}

class CreateAccount extends React.Component<any, State> {

    state: State = {
        name: "",
        password: "",
        rePassword: "",
        tips: "",
        showToast: false,
        toastMessage: "",
        showProgress: false,
        showPasswordTips: false
    }

    componentDidMount() {

    }

    confirm = async () => {
        const {name, password, rePassword, tips} = this.state;
        if (!name) {
            this.setShowToast(true, "Please Input Name!");
            return;
        }
        const accountId = localStorage.getItem("accountId");
        if (!accountId) {
            if (!password) {
                this.setShowToast(true, "Please Input Password!");
                return;
            } else {
                if (password.length < 8) {
                    this.setShowToast(true, i18n.t("passwordTip"));
                    return;
                }
            }
            if (!rePassword) {
                this.setShowToast(true, "Please Input Repeat Password!");
                return;
            }
            if (password != rePassword) {
                this.setShowToast(true, "Password do not match");
                return;
            }
        }
        const tmpAccount: AccountModel = {name: name, password: password, passwordHint: tips}
        const rest:any = await walletWorker.generateMnemonic()
        config.TMP.MNEMONIC = rest;
        config.TMP.Account = tmpAccount;
    }

    setShowToast = (f: boolean, m?: string) => {
        this.setState({
            showToast: f,
            toastMessage: m
        })
    }

    render() {
        const {name, password, rePassword, tips, showToast, toastMessage, showProgress, showPasswordTips} = this.state;
        const accountId = localStorage.getItem("accountId");
        return <>
            <IonPage>
                <IonContent fullscreen>
                    <IonHeader >
                        <IonToolbar mode="ios">
                            {
                                accountId &&
                                <IonIcon src={chevronBack} slot="start" size="large" onClick={() => {
                                    url.back()
                                }}/>
                            }
                            <IonTitle>
                                <IonText>{i18n.t("create")} {i18n.t("wallet")}</IonText>
                            </IonTitle>
                            <IonButton fill="outline" size="small" slot="end" onClick={() => {
                                url.accountImport();
                            }}>{i18n.t("import")}</IonButton>
                        </IonToolbar>
                        {showProgress && <IonProgressBar type="indeterminate"/>}
                    </IonHeader>
                    <IonList>
                        <IonItem mode="ios">
                            <IonLabel position="stacked"><IonText
                                color="medium">{i18n.t("wallet")} {i18n.t("name")}</IonText></IonLabel>
                            <IonInput mode="ios" placeholder="Input wallet name" value={name} autocomplete="off" onIonChange={(e: any) => {
                                this.setState({
                                    name: e.target.value!
                                })
                            }}/>
                        </IonItem>
                        {
                            !accountId && <>
                                <IonItem mode="ios">
                                    <IonLabel position="stacked"><IonText
                                        color="medium">{i18n.t("wallet")} {i18n.t("password")}</IonText></IonLabel>
                                    <IonInput mode="ios" autocomplete="new-password" type="password" value={password}
                                              onIonChange={(e: any) => {
                                                  this.setState({
                                                      password: e.target.value!
                                                  })
                                              }} onIonFocus={() => {
                                        this.setState({showPasswordTips: true})
                                    }} onIonBlur={() => {
                                        this.setState({showPasswordTips: false})
                                    }}/>
                                </IonItem>
                                {showPasswordTips && <div className="password-tips">
                                    {i18n.t("passwordTip")}
                                </div>}
                                <IonItem mode="ios">
                                    <IonLabel position="stacked"><IonText
                                        color="medium"> {i18n.t("repeat")} {i18n.t("password")}</IonText></IonLabel>
                                    <IonInput mode="ios" type="password" autocomplete="new-password" value={rePassword}
                                              onIonChange={(e: any) => {
                                                  this.setState({
                                                      rePassword: e.target.value!
                                                  })
                                              }}/>
                                </IonItem>
                                <IonItem mode="ios">
                                    <IonLabel position="stacked"><IonText
                                        color="medium"> {i18n.t("password")} {i18n.t("hint")}( {i18n.t("optional")})</IonText></IonLabel>
                                    <IonInput mode="ios" value={tips} onIonChange={(e: any) => {
                                        this.setState({
                                            tips: e.target.value!
                                        })
                                    }}/>
                                </IonItem>
                            </>
                        }
                    </IonList>
                    <div className="button-bottom">
                        <IonButton mode="ios" expand="block"
                                   disabled={!name || ((!password || !rePassword) && !accountId) || showProgress} onClick={() => {
                            this.setState({
                                showProgress: true
                            })
                            this.confirm().then(() => {
                                this.setState({name:"",password:"",rePassword:"",tips:"",showProgress:false})
                                url.accountBackup();
                            }).catch(e => {
                                this.setState({
                                    showProgress: false
                                })
                            });
                        }}>{showProgress && <IonSpinner name="bubbles"/>}{i18n.t("next")}</IonButton>
                    </div>

                    <IonToast
                        mode="ios"
                        isOpen={showToast}
                        color="warning"
                        position="top"
                        onDidDismiss={() => this.setShowToast(false)}
                        message={toastMessage}
                        duration={1500}
                    />
                </IonContent>
            </IonPage>
        </>
    }
}

export default CreateAccount;