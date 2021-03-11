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

import "./Transfer.css"
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonText, IonSpinner,
    IonIcon, IonButton, IonAlert, IonActionSheet,
    IonBackButton, IonButtons, IonToast, IonProgressBar, IonRow, IonCol
} from "@ionic/react";
import {chevronBack, chevronForwardOutline, trash} from "ionicons/icons"

import * as utils from '../utils'
import rpc from "../rpc";
import walletWorker from "../worker/walletWorker";
import {ChainType, Transaction} from "../types";
import BigNumber from "bignumber.js";
import url from "../utils/url";
import EthToken from "../contract/erc20/eth";
import * as config from "../config";
import i18n from "../locales/i18n";
import GasFeeProxy, {TokenRate} from "../contract/gasFeeProxy";
import ConfirmTransaction from "../components/ConfirmTransaction";
import GasPriceActionSheet from "../components/GasPriceActionSheet";
import Tron from "../contract/erc20/tron";
import {TRON_API_HOST} from "../config";
import tron from "../rpc/tron";
import TronAccountResource from "../components/TronAccountResource";

class Transfer extends React.Component<any, any> {

    state: any = {
        cy: "",
        realCy: "",
        chain: 0,
        account: {},
        fee: "0.000",
        to: "",
        amount: "",
        balance:{},
        showAlert:false,
        showActionSheet:false,
        gasPrice:"",
        showProgress:false,
        tx:{}
    }

    componentDidMount() {
        this.setState({
            to:this.props.match.params.to
        })
        this.init().then(()=>{
        }).catch();
    }

    init = async () => {
        const cy = this.props.match.params.cy;
        const chainName = this.props.match.params.chain;
        if (cy && chainName) {
            const account = await walletWorker.accountInfo()
            const chainId = utils.getChainIdByName(chainName);
            const balance = await rpc.getBalance(chainId, account.addresses[chainId]);
            const realCy = utils.getCyName(cy, chainName);

            const defaultGasPrice = await utils.defaultGasPrice(chainId);
            if(chainId == ChainType.TRON){
                const rest = await tron.getAccountResources(account.addresses[ChainType.TRON])
                this.setState({
                    accountResource:rest
                })
            }
            this.setState({
                feeCy:chainId == ChainType.SERO && cy !== ChainType[ChainType.SERO] ? realCy : chainName,
                cy: cy,
                chain: chainId,
                account: account,
                realCy: realCy,
                balance:balance,
                gasPrice:defaultGasPrice,
            })
        } else {
            // window.location.href = "#/"
            url.home();
        }
    }

    check = async ()=>{
        const {to, amount,chain,account,realCy,gasPrice,cy,balance,gas} = this.state;
        if (!to) {
            this.setShowToast(true,"","To is required!")
            return;
        }else{

        }
        if (!amount) {
            this.setShowToast(true,"","Amount is required!")
            return;
        }
        let value:string = utils.toHex(utils.toValue(amount,utils.getCyDecimal(realCy,ChainType[chain])));

        if(new BigNumber(balance[realCy]).comparedTo(new BigNumber(value)) == -1){
            this.setShowToast(true,"","Not enough balance!")
            return;
        }

        this.setShowProgress(true)

        let tx: Transaction | any = {
            from: account.addresses && account.addresses[chain],
            to: to,
            cy: realCy,
            gasPrice: "0x"+new BigNumber(gasPrice).multipliedBy(1e9).toString(16),
            chain: chain,
            amount: "0x0",
            feeCy:ChainType[ChainType.ETH]
        }
        //ETH ERC20
        const defaultCy = utils.defaultCy(chain);
        if(chain == ChainType.ETH){
            if(realCy !== defaultCy){
                const ETH_COIN: EthToken = new EthToken(config.CONTRACT_ADDRESS.ERC20.ETH[realCy],chain);
                tx.value = "0x0";
                tx.data = await ETH_COIN.transfer(to,utils.toValue(amount,utils.getCyDecimal(realCy,ChainType[chain])));
                tx.to = config.CONTRACT_ADDRESS.ERC20.ETH[realCy];
                tx.gas = await ETH_COIN.estimateGas(tx)
                tx.amount = utils.toHex(utils.toValue(amount,utils.getCyDecimal(realCy,ChainType[chain])));
            }else{
                tx.gas = gas;
                tx.value = value;
            }
            tx.feeCy = defaultCy;
        }else if(chain == ChainType.BSC){
            if(realCy !== defaultCy){
                const ETH_COIN: EthToken = new EthToken(config.CONTRACT_ADDRESS.ERC20.BSC[realCy],chain);
                tx.value = "0x0";
                tx.data = await ETH_COIN.transfer(to,utils.toValue(amount,utils.getCyDecimal(realCy,ChainType[chain])));
                tx.to = config.CONTRACT_ADDRESS.ERC20.BSC[realCy];
                tx.gas = await ETH_COIN.estimateGas(tx)
                tx.amount = utils.toHex(utils.toValue(amount,utils.getCyDecimal(realCy,ChainType[chain])));
            }else{
                tx.gas = gas;
                tx.value = value;
            }
            tx.feeCy = defaultCy;
        }else if(chain == ChainType.SERO){
            if(realCy !== utils.defaultCy(chain)){
                const gasFeeProxy: GasFeeProxy = new GasFeeProxy(config.GAS_FEE_PROXY_ADDRESS[realCy]);
                const tokenRate = await gasFeeProxy.tokenRate()
                tx.value = utils.toHex(utils.toValue(amount,utils.getCyDecimal(realCy,ChainType[chain])));
                tx.data = await gasFeeProxy.transfer(to);
                tx.to = config.GAS_FEE_PROXY_ADDRESS[realCy];
                tx.gas = await gasFeeProxy.estimateGas(tx)
                tx.amount = "0x0";
                tx.feeCy = realCy;
                if(tx.gas && tx.gasPrice){
                    tx.feeValue = tokenRate.feeAmount.multipliedBy(
                        new BigNumber(tx.gas).multipliedBy(new BigNumber(tx.gasPrice))
                    ).dividedBy(tokenRate.seroAmount).toFixed(0,2)
                }
            }else{
                tx.gas = gas;
                tx.value = value;
                tx.feeCy = defaultCy;
            }
        }else if(chain == ChainType.TRON){
            tx.feeCy = defaultCy;
            tx.value=value;
            if(tx.cy !== "TRX"){
                const TRC20_USDT = new Tron(config.CONTRACT_ADDRESS.ERC20.TRON.USDT)
                tx.data = await TRC20_USDT.transfer(tx.to,new BigNumber(tx.value?tx.value:"0"),tx.from)
            }else{
                tx.data = await tron.transfer(tx.to,new BigNumber(tx.value?tx.value:"0").toNumber(),tx.from)
            }
        }
        this.setShowProgress(false)
        this.setState({
            tx:tx,
            showAlert:true
        })
    }

    confirm = async (hash:string) => {
        const {chain,cy} = this.state;
        let intervalId:any = 0;
        intervalId = setInterval(()=>{
            rpc.getTxInfo(chain,hash).then((rest)=>{
                if(rest){
                    this.setShowToast(true,"success","Commit Successfully!")
                    clearInterval(intervalId);
                    url.transactionInfo(chain,hash,cy);
                    this.setShowProgress(false);
                }
            }).catch(e=>{
                console.error(e)
            })
        },1000)
        this.setShowAlert(false)
    }

    setShowToast = (f:boolean,color?:string,m?:string) =>{
        this.setState({
            showToast:f,
            toastMessage:m,
            color:color
        })
    }

    setShowAlert = (f:boolean)=>{
        this.setState({
            showAlert:f
        })
    }

    setShowActionSheet = (f: boolean) => {
        this.setState({
            showActionSheet: f
        })
    }

    sort(a:any,b:any){
        return new BigNumber(a.gasPrice).comparedTo(new BigNumber(b.gasPrice))
    }

    setShowProgress = (f:boolean)=>{
        this.setState({
            showProgress:f
        })
    }

    setGasPrice=(v:string)=>{
        this.setState(
            {
                gasPrice:v,
                showActionSheet:false
            }
        )
    }

    render() {
        const {cy, chain, account, realCy, showProgress,gasPrice,tx, to, amount,showToast,toastMessage,accountResource,color,balance,showAlert,showActionSheet,gasPriceLevel} = this.state;

        return <IonPage>
            <IonContent fullscreen>
                <IonHeader>
                    <IonToolbar mode="ios" color="primary">
                        <IonIcon src={chevronBack} slot="start" size="large" onClick={()=>{url.back()}}/>
                        <IonTitle>{realCy} {i18n.t("transfer")}</IonTitle>
                    </IonToolbar>
                    {showProgress && <IonProgressBar type="indeterminate"/>}
                </IonHeader>

                <IonList>
                    <IonItem mode="ios" className="form-padding">
                        <IonLabel position="stacked">{i18n.t("from")}</IonLabel>
                        <IonTextarea className="form-address" disabled rows={chain == ChainType.SERO ? 4 : 2}
                                     value={account.addresses && account.addresses[chain]}/>
                    </IonItem>

                    <IonItem mode="ios" className="form-padding">
                        <IonLabel position="stacked">{i18n.t("to")}</IonLabel>
                        <IonTextarea onIonChange={(e: any) => {
                            this.setState({
                                to: e.target.value
                            })
                        }} rows={chain == ChainType.SERO ? 4 : 2} className="form-address" value={to}
                                     placeholder={`${ChainType[chain]} Address`}/>
                    </IonItem>
                    <IonItem mode="ios" className="form-padding">
                        <IonLabel position="stacked">{i18n.t("amount")}
                            <IonText className="ion-float-right" color="medium">
                                {utils.fromValue(balance[realCy],utils.getCyDecimal(realCy,ChainType[chain])).toString(10)} {realCy}
                            </IonText>
                        </IonLabel>
                        <IonInput onIonChange={(e: any) => {
                            this.setState({
                                amount: e.target.value
                            })
                        }} value={amount} className="form-amount" type="number" placeholder="0"/>
                    </IonItem>
                    {chain == ChainType.TRON?
                        <IonItem onClick={()=>{
                            url.frozenTronBalance();
                        }}>
                            <TronAccountResource accountResource={accountResource}/>
                            <IonIcon src={chevronForwardOutline} color="medium" slot="end"/>
                        </IonItem>
                        :
                        <IonItem mode="ios" lines="none" className="form-padding" onClick={()=>{
                            this.setShowActionSheet(true);
                        }}>
                            <IonLabel position="stacked">{i18n.t("gasPrice")}</IonLabel>
                            <IonText slot="end">
                                {gasPrice} {utils.gasUnit(chain)}
                            </IonText>
                            {chain == ChainType.ETH && <IonIcon slot="end" src={chevronForwardOutline} size="small" color='medium'/>}
                        </IonItem>
                    }
                </IonList>
                <div className="form-button-div">
                    <IonButton mode="ios" expand="block" disabled={showProgress || !to || !amount} onClick={() => {
                        this.check().then(()=>{
                            this.setShowProgress(false)
                        }).catch(e=>{
                            this.setShowProgress(false)
                            const err = typeof e === "string"?e:e.message;
                            this.setShowToast(true,"danger",err);
                        });
                    }}>{showProgress&&<IonSpinner name="bubbles" />}{i18n.t("confirm")}</IonButton>
                </div>
            </IonContent>
            <IonToast
                color={!color?"warning":color}
                position="top"
                isOpen={showToast}
                onDidDismiss={() => this.setShowToast(false)}
                message={toastMessage}
                duration={1500}
                mode="ios"
            />

            <GasPriceActionSheet onClose={()=>this.setShowActionSheet(false)}  show={showActionSheet} onSelect={this.setGasPrice} value={gasPrice} chain={chain}/>

            <ConfirmTransaction show={showAlert} transaction={tx} onProcess={(f)=>this.setShowProgress(f)} onCancel={()=>this.setShowAlert(false)} onOK={this.confirm}/>
        </IonPage>;
    }
}

export default Transfer