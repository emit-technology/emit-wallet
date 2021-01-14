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
    IonText,
    IonIcon,
    IonLoading,
    IonAlert, IonToast,IonActionSheet
} from '@ionic/react';
import {
    chevronForward,documentTextOutline,
    homeOutline,
    languageOutline,keyOutline,
    planetOutline,
    shieldCheckmarkOutline
} from 'ionicons/icons'
import './Settings.css';
import walletWorker from "../worker/walletWorker";
import url from "../utils/url";
import {Plugins} from "@capacitor/core";
import copy from "copy-to-clipboard";
import i18n from "../locales/i18n";
const {Browser} = Plugins;

const languages:any = [
    {
        name: 'language',
        type: 'radio',
        label: 'English',
        value: 'en_US',
        checked: "en_US" == localStorage.getItem("language")
    },
    {
        name: 'language',
        type: 'radio',
        label: '日本語',
        value: 'ja_JP',
        checked: "ja_JP" == localStorage.getItem("language")
    },
    {
        name: 'language',
        type: 'radio',
        label: 'русский',
        value: 'be_BY',
        checked: "be_BY" == localStorage.getItem("language")
    },
    {
        name: 'language',
        type: 'radio',
        label: '한국어',
        value: 'ko_KR',
        checked: "ko_KR" == localStorage.getItem("language")
    },
    {
        name: 'language',
        type: 'radio',
        label: '繁體中文',
        value: 'zh_TW',
        checked: "zh_TW" == localStorage.getItem("language")
    },
    {
        name: 'language',
        type: 'radio',
        label: 'Français',
        value: 'fr_FR',
        checked: "fr_FR" == localStorage.getItem("language")
    },
    {
        name: 'language',
        type: 'radio',
        label: 'Italiano',
        value: 'it_IT',
        checked: "it_IT" == localStorage.getItem("language")
    },
    {
        name: 'language',
        type: 'radio',
        label: 'Nederlands',
        value: 'nl_NL',
        checked: "nl_NL" == localStorage.getItem("language")
    },
    {
        name: 'language',
        type: 'radio',
        label: 'Español',
        value: 'es_ES',
        checked: "es_ES" == localStorage.getItem("language")
    },
    {
        name: 'language',
        type: 'radio',
        label: 'Deutsch',
        value: 'de_DE',
        checked: "de_DE" == localStorage.getItem("language")
    },
    {
        name: 'language',
        type: 'radio',
        label: 'Português',
        value: 'pt_BR',
        checked: "pt_BR" == localStorage.getItem("language")
    },
    {
        name: 'language',
        type: 'radio',
        label: '简体中文',
        value: 'zh_CN',
        checked: "zh_CN" == localStorage.getItem("language")
    },
];

languages.sort((a:any, b:any)=>{
    if(a.value.toLowerCase()>b.value.toLowerCase()){
        return 1;
    }
    if(a.value.toLowerCase() < b.value.toLowerCase()){
        return -1;
    }
    return 0
})

class Settings extends React.Component<any, any>{

    state:any = {
        exportType:"privateKey"
    }

    componentDidMount() {
        walletWorker.accountInfo().then(account=>{
            this.setState({
                account:account
            })
        });

    }

    exportMnemonic = async (password:string)=>{
        const account = await walletWorker.accountInfo();
        if(account.accountId){
            const mnemonic:any = await walletWorker.exportMnemonic(account.accountId,password)
            if(mnemonic){
                sessionStorage.setItem("tmpMnemonic",mnemonic)
                setTimeout(()=>{
                    // window.location.href = "/#/account/backup";
                    url.accountBackup(url.path_settings());
                },1000)
            }
        }
    }

    exportPrivateKey = async (password:string)=>{
        const account = await walletWorker.accountInfo();
        if(account.accountId){
            const privateKey:any = await walletWorker.exportPrivateKey(account.accountId,password)
            if(privateKey){
                this.setShowLoading(false);
                this.setState({
                    privateKey:privateKey
                })
                this.setShowPasswordAlert2(true);
                // privateKey
                // console.log(privateKey,"privateKey")
            }
        }
    }

    setShowPasswordAlert = (f:boolean)=>{
        this.setState({
            showPasswordAlert:f
        })
    }

    setShowPasswordAlert2 = (f:boolean)=>{
        this.setState({
            showPasswordAlert2:f
        })
    }

    setShowToast = (f:boolean,toastColor?:string,toastMsg?:string) => {
        this.setState({
            showToast:f,
            toastColor:toastColor,
            toastMsg:toastMsg
        })
    }

    setShowLoading = (f:boolean) =>{
        this.setState({
            showLoading:f
        })
    }


    setShowActionSheet = (f:boolean)=>{
        this.setState({
            showActionSheet:f
        })
    }

    exportConfirm = (password:string)=>{
        const {exportType} = this.state;
        if(exportType == "mnemonic"){
            this.setShowLoading(true);
            this.exportMnemonic(password).then().catch((e:any)=>{
                this.setShowLoading(false);
                const err = typeof e === "string"?e:e.message;
                this.setShowToast(true,"danger",err)
            });
        }else{
            this.setShowLoading(true);
            this.exportPrivateKey(password).then().catch((e:any)=>{
                this.setShowLoading(false);
                const err = typeof e === "string"?e:e.message;
                this.setShowToast(true,"danger",err)
            });
        }

    }

    setShowAlertLang = (f:boolean)=>{
        this.setState({
            showAlertLang:f
        })
    }

    render() {
        const {showPasswordAlert,showToast,toastColor,privateKey,showAlertLang,showPasswordAlert2,toastMsg,showLoading,showActionSheet,account} = this.state;
        return (
            <IonPage>
                <IonContent fullscreen color="light">
                    <IonHeader>
                        <IonToolbar color="primary" mode="ios">
                            <IonTitle>{i18n.t("settings")}</IonTitle>
                        </IonToolbar>
                    </IonHeader>

                    <div className="logo-bg-sharp">
                    </div>

                    <IonList>
                        <IonItem mode="ios" onClick={()=>{
                            account.createType == 1 ?this.setShowPasswordAlert(true):this.setShowActionSheet(true)
                        }}>
                            <IonIcon src={shieldCheckmarkOutline} slot="start"/>
                            <IonLabel>{i18n.t("backupWallet")}</IonLabel>
                            <IonIcon src={chevronForward} slot="end"  color="medium"/>
                        </IonItem>

                        <IonItem mode="ios">
                            <IonLabel>{i18n.t("nodeSetting")}</IonLabel>
                            <IonIcon src={planetOutline} slot="start"/>
                            <IonText slot="end" color="medium">EMIT Node</IonText>
                            <IonIcon src={chevronForward} slot="end"  color="light"/>
                        </IonItem>

                        <IonItem mode="ios" onClick={()=>{
                            this.setShowAlertLang(true)
                        }}>
                            <IonLabel>{i18n.t("languages")}</IonLabel>
                            <IonIcon src={languageOutline} slot="start"/>
                            <IonText slot="end" color="medium">{i18n.t('language')}</IonText>
                            <IonIcon src={chevronForward} slot="end"  color="medium"/>
                        </IonItem>

                        <IonItem mode="ios" onClick={()=>{
                            Browser.open({url:"https://emit.technology/wallet/terms-of-service.html"})
                        }}>
                            <IonLabel>{i18n.t("termOfService")}</IonLabel>
                            <IonIcon src={documentTextOutline} slot="start"/>
                            <IonIcon src={chevronForward} slot="end"  color="medium"/>
                        </IonItem>

                        <IonItem mode="ios" onClick={()=>{
                            Browser.open({url:"https://emit.technology/wallet/privacy-policy.html"})
                        }}>
                            <IonLabel>{i18n.t("privacyPolicy")}</IonLabel>
                            <IonIcon src={documentTextOutline} slot="start"/>
                            <IonIcon src={chevronForward} slot="end"  color="medium"/>
                        </IonItem>

                        <IonItem  mode="ios" lines="none" onClick={()=>{
                            url.aboutUs()
                        }}>
                            <IonIcon src={homeOutline} slot="start"/>
                            <IonLabel>{i18n.t("aboutUs")}</IonLabel>
                            <IonIcon src={chevronForward} slot="end"  color="medium"/>
                        </IonItem>
                    </IonList>

                    <IonAlert
                        mode="ios"
                        isOpen={showPasswordAlert}
                        onDidDismiss={() => this.setShowPasswordAlert(false)}
                        header={i18n.t("backupWallet")}
                        inputs={[
                            {
                                name: 'password',
                                type: 'password',
                                placeholder: i18n.t("password"),
                                cssClass: 'specialClass',
                                attributes: {
                                    autofocus: 'autofocus'
                                }
                            }
                        ]}
                        buttons={[
                            {
                                text: i18n.t("cancel"),
                                role: 'cancel',
                                cssClass: 'secondary',
                                handler: () => {
                                    console.log('Confirm Cancel');
                                }
                            },{
                                text: i18n.t("ok"),
                                handler: (e:any) => {
                                    console.log('Confirm Ok',e);
                                    if(!e["password"]){
                                        this.setShowToast(true,"warning","Please Input Password!")
                                        return ;
                                    }
                                    this.exportConfirm(e["password"]);
                                }
                            }
                        ]}
                    />

                    <IonAlert
                        mode="ios"
                        isOpen={showPasswordAlert2}
                        onDidDismiss={() => this.setShowPasswordAlert2(false)}
                        header={'Private Key'}
                        subHeader={privateKey}
                        buttons={[
                            {
                                text: i18n.t("cancel"),
                                role: 'cancel',
                                cssClass: 'secondary',
                                handler: () => {
                                    console.log('Confirm Cancel');
                                }
                            },{
                                text: i18n.t("copy"),
                                handler: (e:any) => {
                                    copy(privateKey);
                                    copy(privateKey);
                                    this.setShowToast(true,"dark","Copied to clipboard!")
                                }
                            }
                        ]}
                    />

                    <IonToast
                        mode="ios"
                        isOpen={showToast}
                        color={toastColor}
                        position="top"
                        onDidDismiss={() => this.setShowToast(false)}
                        message={toastMsg}
                        duration={2000}
                    />
                    <IonLoading
                        mode="ios"
                        cssClass='my-custom-class'
                        isOpen={showLoading}
                        spinner="circles"
                        onDidDismiss={() => this.setShowLoading(false)}
                        message={'Please wait...'}
                        duration={60000}
                    />

                    <IonActionSheet
                        mode={"ios"}
                        isOpen={showActionSheet}
                        onDidDismiss={() => this.setShowActionSheet(false)}
                        cssClass='my-custom-class'
                        buttons={[{
                            text: i18n.t("exportMnemonic"),
                            icon: documentTextOutline,
                            handler: () => {
                                this.setState({
                                    exportType:"mnemonic"
                                })
                                this.setShowPasswordAlert(true)
                                console.log('Delete clicked');
                            }
                        }, {
                            text: i18n.t("exportPrivateKey"),
                            icon: keyOutline,
                            handler: () => {
                                this.setState({
                                    exportType:"privateKey"
                                })
                                this.setShowPasswordAlert(true)
                                console.log('Share clicked');
                            }
                        }, {
                            text: i18n.t("cancel"),
                            role: "cancel",
                            handler: () => {
                                console.log('Share clicked');
                            }
                        }]}
                    >
                    </IonActionSheet>

                    <IonAlert
                        isOpen={showAlertLang}
                        onDidDismiss={() => this.setShowAlertLang(false)}
                        header={i18n.t("languages")}
                        inputs={languages}
                        buttons={[
                            {
                                text: i18n.t("cancel"),
                                role: 'cancel',
                                cssClass: 'secondary',
                                handler: () => {
                                    console.log('Confirm Cancel');
                                }
                            },
                            {
                                text: i18n.t("ok"),
                                handler: (language) => {
                                    console.log('Confirm Ok',language);
                                    localStorage.setItem("language",language);
                                    i18n.changeLanguage(language).then(()=>{
                                        window.location.reload();
                                    }).catch(e=>{
                                        console.error(e)
                                    })
                                }
                            }
                        ]}
                    />
                </IonContent>
            </IonPage>
        )
    }
};

export default Settings;
