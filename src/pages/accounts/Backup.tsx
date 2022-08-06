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
    IonTitle, IonLabel,
    IonToolbar,
    IonList,
    IonItem, IonText, IonChip, IonButton, IonGrid, IonRow, IonCol, IonIcon, IonProgressBar, IonModal, IonToast
} from "@ionic/react";
import './style.css';
import url from "../../utils/url";
import {chevronBack, close} from "ionicons/icons";
import i18n from "../../locales/i18n"
import {config} from "../../config";
import walletWorker from "../../worker/walletWorker";
import selfStorage from "../../utils/storage";
import {AccountModel} from "@emit-technology/emit-lib";

interface State {
    // mnemonic: Array<string>;
    showProgress: boolean
    showBackupModal: boolean;
    tempMnemonic: Array<string>;
    rIndex: number,
    showToast: boolean;
    toastMessage: string
}

class Backup extends React.Component<any, State> {

    state: State = {
        // mnemonic: [],
        showProgress: false,
        showBackupModal: false,
        tempMnemonic: [],
        rIndex: 0,
        showToast: false,
        toastMessage: ""
    }

    componentDidMount() {
        const tmpMnemonic: any = config.TMP.MNEMONIC;
        if (!tmpMnemonic) {
            // window.location.href = "/#/account/create";
            url.accountCreate();
            return
        }
        // this.setState({
        //     mnemonic: tmpMnemonic.split(" ")
        // })
    }

    create = async () => {
        const account: AccountModel = config.TMP.Account; //sessionStorage.getItem("tmpAccount")
        if (account) {
            const accountId:any = await walletWorker.importMnemonic(config.TMP.MNEMONIC, account.name, account.password ? account.password : "", account.passwordHint, "");
            if (accountId) {
                await walletWorker.setBackedUp(accountId)
                sessionStorage.removeItem("tmpMnemonic");
                config.TMP.MNEMONIC = ""
                config.TMP.Account = {}
                sessionStorage.removeItem("tmpAccount");
                selfStorage.setItem("accountId", accountId)
                // window.location.href = "/#/"
                // window.location.reload();
                selfStorage.setItem("viewedSlide", true);
                url.home();
            }
            // window.location.reload();
        }
    }

    preBackup = async () => {
        const oMnemonic = config.TMP.MNEMONIC.split(" ");

        const mnemonic:any = await walletWorker.generateMnemonic();
        const rIndex = Math.floor(Math.random() * 12);
        const wordstr = oMnemonic[rIndex];
        const tmp = mnemonic.split(" ");

        const genMen:Array<string> = [];
        for (let word of tmp) {
            if(genMen.length == 2){
                break;
            }
            if (word != wordstr) {
                genMen.push(word);
            }
        }
        genMen.push(wordstr);
        genMen.sort(this.sortWord)
        this.setState({
            tempMnemonic: genMen,
            rIndex: rIndex,
            showBackupModal: true
        })
    }

    sortWord = (a:string,b:string)=>{
        return a.localeCompare(b)
    }

    confirmBackup = async (v)=>{
        const oMnemonic = config.TMP.MNEMONIC.split(" ");
        const {rIndex} = this.state;
        if(v == oMnemonic[rIndex]){
            await this.confirm();
        }else{
            await this.preBackup()
            return Promise.reject(i18n.t("notMatch"))
        }
    }

    confirm = async () => {
        const account: any = config.TMP.Account;//sessionStorage.getItem("tmpAccount")
        if(account && account.name){
            await this.create()
        }else{
            const accountId = selfStorage.getItem("accountId");
            await walletWorker.setBackedUp(accountId)
            sessionStorage.removeItem("tmpMnemonic");
            config.TMP.MNEMONIC = "";
            url.home();
        }
    }

    setShowToast = (f:boolean,msg?:string) =>{
        this.setState({
            showToast: f,
            toastMessage: msg
        })
    }

    render() {
        const {showProgress, showBackupModal,showToast,toastMessage, tempMnemonic, rIndex} = this.state;
        let mnemonic = config.TMP.MNEMONIC.split(" ");

        const isMnemonic = mnemonic && mnemonic.length == 12;
        if(showBackupModal && isMnemonic){
            mnemonic = [];
            for(let i=0;i<12;i++){
                mnemonic.push("***")
            }
        }

        return <>
            <IonPage>
                <IonContent fullscreen>
                    <IonHeader>
                        <IonToolbar mode="ios">
                            <IonIcon src={chevronBack} slot="start" size="large" onClick={() => {
                                config.TMP.MNEMONIC = ""
                                url.back()
                            }}/>
                            <IonTitle>{i18n.t("backupMnemonic")}</IonTitle>
                        </IonToolbar>
                        {showProgress && <IonProgressBar type="indeterminate"/>}
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
                        <IonRow>
                            <IonCol size="5">
                                <IonButton disabled={showProgress} mode="ios" fill="outline" expand="block"
                                           onClick={() => {
                                               if (config.TMP.Account["name"]) {
                                                   this.setState({
                                                       showProgress: true,
                                                   })
                                                   this.create().then(() => {
                                                       this.setState({
                                                           showProgress: false,
                                                       })
                                                   }).catch(e => {
                                                       console.error(e)
                                                       const err = typeof e == 'string' ? e : e.message;
                                                       this.setState({
                                                           showProgress: false,
                                                       })
                                                   })
                                               } else {
                                                   config.TMP.MNEMONIC = "";
                                                   url.back();
                                               }
                                           }}>{i18n.t("laterBackup")}</IonButton>
                            </IonCol>
                            <IonCol size="7">
                                <IonButton disabled={showProgress} mode="ios" expand="block" onClick={() => {
                                    // window.location.href = "/#/account/confirm"
                                    // url.accountConfirm();
                                    this.preBackup().catch(e=>console.error(e));
                                }}> {i18n.t("confirmBackup")}</IonButton>
                            </IonCol>
                        </IonRow>
                    </div>

                    <IonModal
                        mode="ios"
                        isOpen={showBackupModal}
                        swipeToClose={true}
                        onDidDismiss={() => {
                            this.setState({showBackupModal: false})
                        }}>
                        <IonPage>
                            <IonHeader>
                                <IonToolbar color="white">
                                    <IonTitle>
                                        {i18n.t("backupAccount")}
                                        <div className="powered-by">
                                            <img src="./assets/icon/icon.png"/>
                                            <small>{i18n.t("poweredByEmit")}</small>
                                        </div>
                                    </IonTitle>
                                    <IonIcon slot="end" icon={close} size="large" onClick={() => {
                                        this.setState({showBackupModal: false})
                                    }}/>
                                </IonToolbar>
                            </IonHeader>
                            <IonContent scrollY>
                                <IonItem>
                                    <IonLabel className="ion-text-wrap">
                                        {i18n.t("pleaseSelect")} <b><IonText color="secondary">#{rIndex+1}th</IonText></b> {i18n.t("pleaseSelect2")}
                                    </IonLabel>
                                </IonItem>
                                <IonItem>
                                    <IonLabel className="ion-text-wrap">
                                        <IonRow>
                                        {
                                            tempMnemonic && tempMnemonic.map((v,i)=>{
                                                return <IonChip color="primary" outline key={i} onClick={()=>{
                                                    this.setState({showProgress:true})
                                                    this.confirmBackup(v).then(()=>{
                                                        this.setState({showProgress: false,showBackupModal:false})
                                                    }).catch(e=>{
                                                        this.setState({showProgress: false})
                                                        const err = typeof e == "string"?e:e.message;
                                                        this.setShowToast(true,err);
                                                        console.error(e)
                                                    })
                                                }}>{v}</IonChip>
                                            })
                                        }
                                        </IonRow>
                                    </IonLabel>
                                </IonItem>
                            </IonContent>
                        </IonPage>
                    </IonModal>

                    <IonToast
                        mode="ios"
                        isOpen={showToast}
                        color="primary"
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

export default Backup;