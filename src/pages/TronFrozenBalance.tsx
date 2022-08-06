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
import * as React from "react";
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonProgressBar,
    IonRow,
    IonSegment,
    IonSegmentButton,
    IonSelect,
    IonSelectOption,
    IonText,
    IonTitle,
    IonToast,
    IonToolbar
} from "@ionic/react";
import {chevronBack} from "ionicons/icons";
import url from "../utils/url";
import i18n from "../locales/i18n";
import tron from "../rpc/tron";
import walletWorker from "../worker/walletWorker";
import {Transaction} from "../types";
import {AccountModel, ChainType} from "@emit-technology/emit-lib";
import rpc from "../rpc";
import ConfirmTransaction from "../components/ConfirmTransaction";
import {fromValue, getCyDecimal, toHex, toValue} from "../utils";
import TronAccountResource from "../components/TronAccountResource";

class TronFrozenBalance extends React.Component<any, any> {

    state: any = {
        showProgress: false,
        op: "Freeze",
        resource: "BANDWIDTH",
        balance:{}
    }

    componentDidMount() {
        this.init().catch(e => {

        })
    }

    init = async () => {
        const account = await walletWorker.accountInfo()
        const address = account.addresses[ChainType.TRON];
        const rest = await tron.getAccountResources(address)
        const balance = await tron.tronWeb.trx.getAccount(address);
        this.setState({
            accountResource: rest,
            account: account,
            balance: balance
        })
        this.setOp();
    }

    setResource = (v: any) => {
        this.setState({
            resource: v
        })
        this.setOp();
    }

    commit = async () => {
        const {amount, resource, account,op} = this.state;
        if(!amount){
            this.setShowToast(true,"warning","Amount is required!")
            return
        }
        const duration = 3;
        const address = account.addresses[ChainType.TRON]

        const value = toValue(amount,getCyDecimal("TRX",ChainType[ChainType.TRON]));
        let tx: Transaction | any = {
            from: address,
            to: address,
            cy: "TRX",
            gasPrice: "0x0",
            chain: ChainType.TRON,
            amount: toHex(value),
            feeCy: ChainType[ChainType.TRON]
        }
        if(op == "Freeze"){
            tx.data = await tron.tronWeb.transactionBuilder.freezeBalance(value.toNumber(), duration, resource, address, address);
        }else{
            tx.data = await tron.tronWeb.transactionBuilder.unfreezeBalance(resource, address);
        }

        this.setState({
            tx: tx,
            showAlert: true
        })
    }

    setShowProgress = (f: boolean) => {
        this.setState({
            showProgress: f
        })
    }

    setShowAlert = (f: boolean) => {
        this.setState({
            showAlert: f
        })
    }

    setShowToast = (f: boolean, color?: string, m?: string) => {
        this.setState({
            showToast: f,
            toastMessage: m,
            color: color
        })
    }


    confirm = async (hash: string) => {
        let intervalId: any = 0;
        intervalId = setInterval(() => {
            rpc.getTxInfo(ChainType.TRON, hash).then((rest) => {
                if (rest) {
                    this.setShowToast(true, "success", "Commit Successfully!")
                    clearInterval(intervalId);
                    url.transactionInfo(ChainType.TRON, hash, "TRX");
                    this.setShowProgress(false);
                }
            }).catch(e => {
                console.error(e)
            })
        }, 1000)
        this.setShowAlert(false)
    }

    setOp = (op?:any)=>{
        if(!op){
            op = this.state.op;
        }
        const {balance,resource} = this.state;

        if(op == "Freeze"){
            this.setState({
                amount:fromValue(balance.balance,getCyDecimal("TRX",ChainType[ChainType.TRON])),
                op:op
            })
        }else{
            let frozenTotal = 0;
            if(resource == "BANDWIDTH"){
                const arr:any = balance.frozen;
                if(arr && arr.length>0){
                    for(let i = 0 ;i<arr.length;i++){
                        const o = arr[i];
                        frozenTotal += o.frozen_balance;
                    }
                }
            }else {
                if(balance.account_resource
                    && balance.account_resource.frozen_balance_for_energy
                    && balance.account_resource.frozen_balance_for_energy.frozen_balance ){
                    frozenTotal = balance.account_resource.frozen_balance_for_energy.frozen_balance
                }
            }
            this.setState({
                amount:fromValue(frozenTotal,getCyDecimal("TRX",ChainType[ChainType.TRON])),
                op:op
            })
        }
    }

    render() {
        const {showProgress, accountResource, resource, amount,account, op, balance, showToast, toastMessage, color, showAlert, tx} = this.state;

        return <>
            <IonPage>
                <IonHeader>
                    <IonToolbar mode="ios" color="primary">
                        <IonIcon src={chevronBack} slot="start" size="large" onClick={() => {
                            url.back()
                        }}/>
                        <IonTitle>{i18n.t("frozenBalance")}</IonTitle>
                    </IonToolbar>
                    {showProgress && <IonProgressBar type="indeterminate"/>}
                </IonHeader>
                <IonContent fullscreen color="light">

                    <IonCard mode="ios">
                        <IonCardContent>
                            <TronAccountResource accountResource={accountResource}/>
                        </IonCardContent>
                    </IonCard>
                    <IonRow>
                        <IonCol size="2"></IonCol>
                        <IonCol size="8">
                            <IonSegment mode="ios" color="primary" value={op} onIonChange={e => {
                                this.setOp(e.detail.value)
                            }}>
                                <IonSegmentButton value="Freeze">
                                    <IonLabel>{i18n.t("freeze")}</IonLabel>
                                </IonSegmentButton>
                                <IonSegmentButton value="UnFreeze">
                                    <IonLabel>{i18n.t("unFreeze")}</IonLabel>
                                </IonSegmentButton>
                            </IonSegment>
                        </IonCol>
                        <IonCol size="2"></IonCol>
                    </IonRow>
                    <IonCard mode="ios">
                        <IonCardContent>
                            <IonList>
                                <IonItem>
                                    <IonLabel>Resource</IonLabel>
                                    <IonSelect interface="action-sheet" value={resource} placeholder="Resource Type"
                                               onIonChange={e => this.setResource(e.detail.value)}>
                                        <IonSelectOption value="BANDWIDTH">{i18n.t("bandwidth")}</IonSelectOption>
                                        <IonSelectOption value="ENERGY">{i18n.t("energy")}</IonSelectOption>
                                    </IonSelect>
                                </IonItem>
                                <IonItem>
                                    <IonLabel position="stacked">{i18n.t("receiver")}</IonLabel>
                                    <IonText className="text-small-x2">
                                        {account && account.addresses[ChainType.TRON]}
                                    </IonText>
                                </IonItem>
                                <IonItem>
                                    <IonLabel position="floating">{op} {i18n.t("amount")}</IonLabel>
                                    <IonInput type="number" readonly={op !== "Freeze"} value={amount} onIonChange={(e => {
                                        this.setState({
                                            amount: e.detail.value
                                        })
                                    })}/>
                                </IonItem>
                            </IonList>
                        </IonCardContent>
                    </IonCard>
                    <IonButton mode="ios" expand="block" color={op == "Freeze" ? "primary" : "danger"} onClick={() => {
                        this.commit().catch(e => {
                            console.error(e)
                            const err = typeof e == "string" ? e : e.message;
                            this.setShowToast(true, "danger", err);
                        });
                    }}>
                        {op}
                    </IonButton>

                    <IonToast
                        color={!color ? "warning" : color}
                        position="top"
                        isOpen={showToast}
                        onDidDismiss={() => this.setShowToast(false)}
                        message={toastMessage}
                        duration={1500}
                        mode="ios"
                    />
                    <ConfirmTransaction show={showAlert} transaction={tx} onProcess={(f) => this.setShowProgress(f)}
                                        onCancel={() => this.setShowAlert(false)} onOK={this.confirm}/>
                </IonContent>
            </IonPage>
        </>;
    }
}

export default TronFrozenBalance