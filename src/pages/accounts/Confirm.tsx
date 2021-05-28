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
    IonItem,
    IonLabel,
    IonText, IonButton, IonChip, IonIcon, IonProgressBar, IonSpinner
} from "@ionic/react";
import './style.css';
import {chevronBack, closeCircle} from 'ionicons/icons'
import walletWorker from "../../worker/walletWorker";
import {AccountModel} from "../../types";
import selfStorage from "../../utils/storage";
import url from "../../utils/url";
import i18n from "../../locales/i18n";

interface State {
    origin: Array<string>
    mnemonic: Array<string>;
    checkedMnemonic: Array<mnemonicState>;
    failed: boolean
    showProgress: boolean
    showButton:boolean
}

interface mnemonicState {
    w: string
    f: boolean
    i: number
}

class Confirm extends React.Component<any, State> {

    state: State = {
        origin: [],
        mnemonic: [],
        checkedMnemonic: [],
        failed: false,
        showProgress: false,
        showButton:false
    }

    componentDidMount() {
        const tmpMnemonic: any = sessionStorage.getItem("tmpMnemonic")
        if (!tmpMnemonic) {
            // window.location.href = "/#/account/create";
            url.accountCreate();
            return
        }
        this.setState({
            mnemonic: tmpMnemonic.split(" ").sort(),
            origin: tmpMnemonic.split(" ")
        })
    }

    confirm = () => {
        const tmpMnemonic: any = sessionStorage.getItem("tmpMnemonic")
        const tmpAccount: any = sessionStorage.getItem("tmpAccount")
        if(tmpAccount){
            const account: AccountModel = JSON.parse(tmpAccount);
            this.setState({
                showProgress:true,
                showButton:false
            })
            walletWorker.importMnemonic(tmpMnemonic, account.name, account.password ? account.password : "", account.hint ? account.hint : "", "").then(((accountId:any) => {
                if(accountId){
                    sessionStorage.removeItem("tmpMnemonic");
                    sessionStorage.removeItem("tmpAccount");
                    selfStorage.setItem("accountId",accountId)
                    // window.location.href = "/#/"
                    // window.location.reload();
                    selfStorage.setItem("viewedSlide",true);
                    url.home();
                }
            })).catch(()=>{
                this.setState({
                    showButton:false
                })
            })
        }else{
            sessionStorage.removeItem("tmpMnemonic");
            url.goTo(url.path_settings(),"")
        }
    }

    selfCheck = (value: string, index: number) => {
        const {checkedMnemonic, origin} = this.state;
        const mState: mnemonicState = {w: value, f: true, i: index}
        if (origin[checkedMnemonic.length] !== value) {
            mState.f = false;
        }
        checkedMnemonic.push(mState);
        this.setState({
            checkedMnemonic: checkedMnemonic,
            failed: !mState.f,
            showButton:origin.length == checkedMnemonic.length
        })
    }

    removeOne = (value: mnemonicState, index: number) => {
        const {checkedMnemonic} = this.state;
        checkedMnemonic.splice(index, 1)
        this.setState({
            failed: false,
            checkedMnemonic: checkedMnemonic
        })
    }

    checkState = (index: number): boolean => {
        const {checkedMnemonic} = this.state;
        for (let v of checkedMnemonic) {
            if (v.i == index) {
                return true
            }
        }
        return false
    }

    render() {
        const {mnemonic, checkedMnemonic, failed, showProgress,showButton} = this.state;
        return <>
            <IonPage>
                <IonContent fullscreen>
                    <IonHeader>
                        <IonToolbar mode="ios" color="primary">
                            <IonIcon src={chevronBack} slot="start" size="large" onClick={()=>{url.back()}}/>
                            <IonTitle><IonText>{i18n.t("confirm")}</IonText></IonTitle>
                        </IonToolbar>
                        {showProgress && <IonProgressBar type="indeterminate"/>}
                    </IonHeader>
                    <IonList aria-multiline={true}>
                        <IonItem lines="none">
                            <IonText color="medium">
                                <p>
                                    {i18n.t("confirmTip")}
                                </p>
                            </IonText>
                        </IonItem>
                        <IonItem lines={"none"}>
                            <div className="confirm">
                                {
                                    checkedMnemonic.map(((value, index) => {
                                        return <IonChip color="dark" outline>
                                            <IonLabel>{value.w}</IonLabel>
                                            {!value.f && <IonIcon icon={closeCircle} color={"danger"} onClick={() => {
                                                this.removeOne(value, index)
                                            }}/>}
                                        </IonChip>
                                    }))
                                }
                            </div>
                        </IonItem>
                        <div className="confirm-word-div">
                            {
                                mnemonic.map(((value: string, index: number) => {
                                    return <IonChip mode="ios" color="dark" outline onClick={() => {
                                        this.selfCheck(value, index)
                                    }} disabled={failed || this.checkState(index)}>
                                        <IonLabel mode="ios">{value}</IonLabel>
                                    </IonChip>
                                }))
                            }
                        </div>

                    </IonList>
                    <div className="button-bottom">
                        <IonButton mode="ios" expand="block" disabled={!showButton} onClick={() => {
                            this.confirm()
                        }}>{showProgress&&<IonSpinner name="bubbles" />}{i18n.t("confirm")}</IonButton>
                    </div>
                </IonContent>
            </IonPage>
        </>
    }
}

export default Confirm;