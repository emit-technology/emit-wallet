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
    IonButton,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonProgressBar,
    IonRow,
    IonSpinner,
    IonText,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {chevronBack, chevronForwardOutline} from "ionicons/icons";
import url from "../utils/url";
import i18n from "../locales/i18n";
import {ChainType, Transaction} from "../types";
import rpc from "../rpc";
import walletWorker from "../worker/walletWorker";
import * as utils from "../utils"
import BigNumber from "bignumber.js";
import {Plugins} from "@capacitor/core";
import WETH from "../contract/weth";
import {CONTRACT_ADDRESS} from "../config";
import GasPriceActionSheet from "../components/GasPriceActionSheet";
import ConfirmTransaction from "../components/ConfirmTransaction";

class ExchangeWETH extends React.Component<any, any>{
    state:any = {
        gasPrice:"1",
        amount:"",
        balance: {},
        showWithdrawEthAlert:false,
        showDepositEthAlert:false
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
        const op = this.props.match.params.op;
        const account = await walletWorker.accountInfo();
        const balance = await rpc.getBalance(ChainType.ETH, account.addresses[ChainType.ETH])
        this.setState({
            balance:balance,
            account:account,
            op:op
        })
    }

    operationWETH = async ()=>{
        const {balance,account,amount,op} = this.state;
        if (!amount) {
            Plugins.Toast.show({text:"Input Amount!"})
            return;
        }
        let value:BigNumber = new BigNumber(0);
        let data:any = "0x";
        const weth:WETH = new WETH(CONTRACT_ADDRESS.ERC20.ETH.WETH)
        const tx: Transaction = {
            from: account.addresses && account.addresses[ChainType.ETH],
            to: CONTRACT_ADDRESS.ERC20.ETH.WETH,
            cy: "WETH",
            gasPrice: "0x"+new BigNumber(1).multipliedBy(1e9).toString(16),
            chain: ChainType.ETH,
            amount: "0x0",
            value: "0x0",
            data:data,
            feeCy:"ETH",
        }
        if(op == "deposit"){
            value = utils.toValue(amount,18);
            if(!balance["ETH"] || new BigNumber(balance["ETH"]).comparedTo(value) == -1){
                Plugins.Toast.show({text:"Not enough ETH!"})
                return;
            }
            tx.cy ="ETH";
            data = await weth.deposit()
            tx.data = data;
            tx.value=utils.toHex(value);
        }else if(op == "withdraw"){
            value = utils.toValue(amount,utils.getCyDecimal("WETH","ETH"));
            if(new BigNumber(balance["WETH"]).comparedTo(new BigNumber(value)) == -1){
                Plugins.Toast.show({text:"Not enough WETH!"})
                return;
            }
            tx.cy="WETH"
            data = await weth.withdraw(utils.toHex(value))
            tx.data = data;
            tx.amount=utils.toHex(value);
        }

        this.setState({
            showAlert:true,
            tx:tx
        })

    }

    setShowActionSheet = (f: boolean) => {
        console.log("showActionSheet>>>set:",f)
        this.setState({
            showActionSheet: f
        })
    }

    setGasPrice = (v:string)=>{
        this.setState({
            gasPrice:v
        })
    }

    setShowAlert = (f:boolean) =>{
        this.setState({
            showAlert:f
        })
    }

    setShowProgress = (f:boolean) =>{
        this.setState({
            showProgress:f
        })
    }

    confirm = async (hash:string) => {
        let intervalId:any = 0;
        intervalId = setInterval(()=>{
            rpc.getTxInfo(ChainType.ETH, hash).then((rest)=>{
                if(rest){
                    clearInterval(intervalId);
                    url.transactionInfo(ChainType.ETH, hash,"WETH");
                    this.setShowProgress(false);
                }
            }).catch(e=>{
                console.error(e)
            })
        },1000)
        this.setShowAlert(false)
    }

    render() {
        const {balance,amount,showProgress,fee,feeCy,gas,gasPrice,showActionSheet,showAlert,tx,op} = this.state;
        console.log("showActionSheet",showActionSheet)
        return <>
            <IonPage>
                <IonContent fullscreen color="light">
                    <IonHeader>
                        <IonToolbar mode="ios" color="primary">
                            <IonIcon src={chevronBack} slot="start" size="large" onClick={()=>{url.back()}}/>
                            <IonTitle>{i18n.t(op)} WETH</IonTitle>
                        </IonToolbar>
                        {showProgress && <IonProgressBar type="indeterminate"/>}
                    </IonHeader>
                    <IonList>
                        <IonItem mode="ios" className="form-padding" lines="none">
                            <IonLabel color="medium" position="stacked">ETH Balance</IonLabel>
                            <IonText>{utils.fromValue(balance["ETH"],utils.getCyDecimal("ETH",ChainType[ChainType.ETH])).toString(10)} ETH</IonText>
                        </IonItem>
                        <IonItem mode="ios" className="form-padding" lines="none">
                            <IonLabel color="medium" position="stacked">WETH Balance</IonLabel>
                            <IonText>{utils.fromValue(balance["WETH"],utils.getCyDecimal("WETH",ChainType[ChainType.ETH])).toString(10)} WETH</IonText>
                        </IonItem>
                        <IonItem mode="ios" className="form-padding" lines="none">
                            <IonLabel color="medium" position="stacked">Amount</IonLabel>
                            <IonInput autofocus onIonChange={(e: any) => {
                                this.setState({
                                    amount: e.target.value
                                })
                            }} value={amount} className="form-amount" type="number" placeholder="0"/>
                        </IonItem>
                        <IonItem mode="ios" lines="none" className="form-padding" onClick={()=>{
                            this.setShowActionSheet(true);
                        }}>
                            <IonLabel position="stacked">{i18n.t("gasPrice")}</IonLabel>
                            <IonText slot="end">
                                {gasPrice} {utils.gasUnit(ChainType.ETH)}
                            </IonText>
                            <IonIcon slot="end" src={chevronForwardOutline} size="small" color='medium'/>
                        </IonItem>
                    </IonList>
                    <IonRow>
                        <IonCol>
                            <IonButton mode="ios" expand="block" color="primary"
                                       disabled={showProgress}
                                       onClick={() => {
                                           this.operationWETH().catch(e=>{
                                               console.log(e)
                                           })
                                       }}>{showProgress &&
                            <IonSpinner name="bubbles"/>}{i18n.t(op)}</IonButton>
                        </IonCol>
                    </IonRow>
                    <GasPriceActionSheet onClose={()=>this.setShowActionSheet(false)} onSelect={this.setGasPrice} show={showActionSheet} value={gasPrice} chain={ChainType.ETH}/>

                    <ConfirmTransaction show={showAlert} transaction={tx} onProcess={(f)=>this.setShowProgress(f)} onCancel={()=>this.setShowAlert(false)} onOK={this.confirm}/>

                </IonContent>
            </IonPage>
        </>;
    }
}

export default ExchangeWETH