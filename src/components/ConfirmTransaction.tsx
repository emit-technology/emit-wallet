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
import {ChainType, Transaction} from "../types";
import {
    IonAlert,
    IonButton,
    IonCol,IonLoading,
    IonItem,
    IonLabel,
    IonList, IonListHeader,
    IonModal,
    IonRow,
    IonText,
    IonToast
} from "@ionic/react";
import rpc from "../rpc";
import * as utils from "../utils"
import BigNumber from "bignumber.js";
import i18n from "../locales/i18n";
import "./gasPrice.css"

interface State{
    transaction?:Transaction
    showActionSheet:boolean
    showPasswordAlert:boolean
    showToast:boolean
    toastColor:string
    toastMsg:string
    showLoading:boolean
}

interface Props {
    show:boolean
    transaction:Transaction;
    onCancel: () => void;
    onOK: (hash:string)=>void;
    onProcess:(f:boolean)=>void;
}


class ConfirmTransaction extends React.Component<Props, State>{

    state:State = {
        showActionSheet:false,
        showPasswordAlert:false,
        showToast:false,
        toastColor:"warning",
        toastMsg:"",
        showLoading:false
    }

    constructor(props:Props) {
        super(props);
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        console.log("componentDidUpdate",prevProps,this.props)
        if(prevProps.show !== this.props.show && this.props.show){
            this.init().catch((e)=>{
                this.props.onCancel();
                console.error(e);
            })
        }
    }

    init = async ()=>{
        if(this.props.show){
            const tx = this.props.transaction;
            if(tx.chain == ChainType.ETH){
                // @ts-ignore
                tx.gas = tx.data? await rpc.post("eth_estimateGas",[tx]):utils.defaultGas(ChainType.ETH);
            }else if(tx.chain == ChainType.SERO){
                // @ts-ignore
                tx.gas =  tx.data?await rpc.post("sero_estimateGas",[tx]):utils.defaultGas(ChainType.SERO);
            }else if(tx.chain == ChainType.TRON){
                //TODO
            }
            this.setState({
                transaction:tx,
                showActionSheet:true
            })
        }
    }

    confirm = async (password:string):Promise<string>=>{
        const {transaction} = this.state;
        if(!password){
            return Promise.reject("Please Input Password!");
        }
        this.props.onProcess(true);
        this.setState({
            showLoading:true
        })
        if(transaction){
            return await rpc.commitTx(transaction,password)
        }
        return ""
    }

    setShowPasswordAlert = (f:boolean)=>{
        this.setState({
            showPasswordAlert:f
        })
    }

    setShowToast = (f:boolean,color:string,err:string)=>{
        this.setState({
            showToast:f,
            toastMsg:err,
            toastColor:color
        })
    }

    fee = ():string =>{
        const {transaction} = this.state;

        if(transaction){
            const feeCy:any = transaction.feeCy;
            if(transaction.feeValue){
                return utils.fromValue(transaction.feeValue,utils.getCyDecimal(feeCy,ChainType[transaction.chain])).toString(10)
            }else {
                if(transaction.gasPrice && transaction.gas){
                    console.log("utils.getCyDecimal(feeCy,ChainType[transaction.chain])",utils.getCyDecimal(feeCy,ChainType[transaction.chain]))
                    return utils.fromValue(
                        new BigNumber(transaction.gasPrice).multipliedBy(new BigNumber(transaction.gas)),
                        utils.getCyDecimal(feeCy,ChainType[transaction.chain])).toString(10)
                }
            }
        }
        return "0.00"
    }

    setShowActionShell = (f:boolean)=>{
        this.setState({
            showActionSheet:f
        })
        if(!f){
            this.props.onCancel();
        }
    }

    setShowLoading = (f:boolean)=>{
        this.setState({
            showLoading:f
        })
    }

    render() {
        const {transaction,showLoading,showActionSheet,showPasswordAlert,showToast,toastMsg,toastColor} = this.state;
        const value = utils.fromValue(transaction&&transaction.value,0).toNumber()==0?
            transaction&&transaction.amount:transaction&&transaction.value
        return <>
            <IonModal
                isOpen={showActionSheet}
                cssClass="confirm-transaction-modal"
                onDidDismiss={() => this.setShowActionShell(false)}>
                <IonList>
                    <IonListHeader>
                        <IonLabel>Confirm Transaction</IonLabel>
                    </IonListHeader>
                    <IonItem>
                        <IonLabel position="stacked" color="medium">From</IonLabel>
                        <IonText className="work-break text-small">{transaction && transaction.from}</IonText>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked" color="medium">To</IonLabel>
                        <IonText className="work-break text-small">{transaction && transaction.to}</IonText>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked" color="medium">Value</IonLabel>
                        <IonText slot="end">{transaction && utils.fromValue(value,
                            utils.getCyDecimal(transaction.cy,ChainType[transaction.chain])).toString(10)} {transaction?.cy}</IonText>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked" color="medium">Fee</IonLabel>
                        <IonText slot="end">
                            {this.fee()} {transaction?.feeCy}<br/>
                            <IonText color="medium"  className="text-small">
                                Gas: {transaction && utils.fromValue(transaction.gas,0).toString(10)} x
                            {transaction && utils.fromValue(transaction.gasPrice,9).toString(10)}
                            {utils.gasUnit(transaction?transaction.chain:2)}
                            </IonText>
                        </IonText>
                    </IonItem>
                    {transaction && transaction.data &&
                    <IonItem>
                        <IonLabel position="stacked" color="medium">Data</IonLabel>
                        <IonText className="work-break text-small">{transaction && transaction.data}</IonText>
                    </IonItem>
                    }
                </IonList>
                <IonRow>
                    <IonCol size="4">
                        <IonButton expand="block" mode="ios" fill="outline" onClick={() => {
                            this.setShowActionShell(false)
                            this.props.onCancel()
                        }}>Close</IonButton>
                    </IonCol>
                    <IonCol size="8">
                        <IonButton mode="ios"  expand="block" onClick={() => {
                            // this.setShowActionShell(false)
                            this.setShowPasswordAlert(true)
                        }}>OK</IonButton>
                    </IonCol>
                </IonRow>
            </IonModal>

            <IonAlert
                mode="ios"
                isOpen={showPasswordAlert}
                onDidDismiss={() => this.setShowPasswordAlert(false)}
                header={i18n.t("transfer")}
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
                    },
                    {
                        text: i18n.t("ok"),
                        handler: (e) => {
                            console.log('Confirm Ok',e);
                            this.setShowPasswordAlert(false)
                            this.confirm(e["password"]).then((hash:string)=>{
                                this.setShowActionShell(false)
                                this.setShowLoading(true)
                                this.props.onOK && this.props.onOK(hash)
                            }).catch(e=>{
                                this.props.onCancel();
                                this.props.onProcess(false);
                                this.setShowLoading(false)
                                const err = typeof e === "string"?e:e.message;
                                this.setShowToast(true,"danger",err)
                            });
                        }
                    }
                ]}
            />
            <IonLoading
                isOpen={showLoading}
                onDidDismiss={() => this.setShowLoading(false)}
                message={'Please wait...'}
                duration={60000}
            />
            <IonToast
                color={!toastColor?"warning":toastColor}
                position="top"
                isOpen={showToast}
                onDidDismiss={() => this.setShowToast(false,toastColor,toastMsg)}
                message={toastMsg}
                duration={1500}
                mode="ios"
            />
        </>;
    }
}

export default ConfirmTransaction