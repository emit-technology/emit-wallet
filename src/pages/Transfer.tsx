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
    IonText,IonSpinner,
    IonIcon, IonButton, IonAlert, IonActionSheet,
    IonBackButton, IonButtons, IonToast, IonProgressBar
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
        gasTracker:{},
        gasPriceLevel: {},
        gasPrice:1,
        gas:21000,
        showProgress:false
    }

    componentDidMount() {
        this.setState({
            to:this.props.match.params.to
        })
        this.init().then(()=>{
            this.getGasEstimate().then().catch();
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

            this.setState({
                feeCy:chainId == ChainType.SERO && cy !== ChainType[ChainType.SERO] ? realCy : chainName,
                cy: cy,
                chain: chainId,
                account: account,
                realCy: realCy,
                balance:balance,
                gas:utils.toHex(utils.defaultGas(chainId)),
            })
        } else {
            // window.location.href = "#/"
            url.home();
        }
    }

    convertFee = async (fee:any)=>{
        const {chain,realCy,cy} = this.state;
        if(chain == ChainType.SERO && cy !== "SERO"){
            const gasFeeProxy: GasFeeProxy = new GasFeeProxy(config.GAS_FEE_PROXY_ADDRESS[realCy]);
            const feeRate:TokenRate  = await gasFeeProxy.tokenRate();
            return utils.fromValue(
                feeRate.feeAmount.multipliedBy(utils.toValue(fee,18)).dividedBy(feeRate.seroAmount),
                utils.getCyDecimal(cy,ChainType[chain])
            ).toFixed(6,2)
        }
        return fee;
    }

    getGasEstimate = async ()=>{
        const {chain,gasPrice} = this.state;
        if(chain == ChainType.SERO){
            this.setFee("1",utils.defaultGas(chain)).then((rest)=>{
                this.setState({
                    gas: utils.defaultGas(chain),
                    // gasPriceLevel:data && data,
                    gasPrice: 1,
                    fee: rest
                })
            })

        }else{
            const data:any = await rpc.post("eth_gasTracker",[])
            if(new BigNumber(gasPrice).toNumber() == 1){
                this.setFee(data && data.AvgGasPrice.gasPrice).then((rest)=>{
                    this.setState({
                        gasPriceLevel:data && data,
                        gasPrice:data && data.AvgGasPrice.gasPrice,
                        fee:rest
                    })
                })
            }else{
                this.setState({
                    gasPriceLevel:data && data,
                })
            }

        }
    }

    check = ()=>{
        const {to, amount, fee, chain,gasPrice,cy,gas, account, realCy,balance} = this.state;
        if (!to) {
            this.setShowToast(true,"","To is required!")
            return;
        }else{

        }
        if (!amount) {
            this.setShowToast(true,"","Amount is required!")
            return;
        }
        this.setShowAlert(true);
    }

    confirm = async (password:string) => {
        const {to, amount, fee, chain,gasPrice,cy,gas, account, realCy,balance} = this.state;
        if(!password){
            this.setShowToast(true,"","Input password!")
            setTimeout(()=>{
                this.setShowAlert(true)
            },500)
            return;
        }
        if (!to) {
            this.setShowToast(true,"","To is required!")
            return;
        }
        if (!amount) {
            this.setShowToast(true,"","Amount is required!")
            return;
        }
        let value:string = utils.toHex(utils.toValue(amount,utils.getCyDecimal(cy,ChainType[chain])));

        if(new BigNumber(balance[realCy]).comparedTo(new BigNumber(value)) == -1){
            this.setShowToast(true,"","Not enough balance!")
            return;
        }

        const tx: Transaction = {
            from: account.addresses && account.addresses[chain],
            to: to,
            cy: realCy,
            gasPrice: "0x"+new BigNumber(gasPrice).multipliedBy(1e9).toString(16),
            chain: chain,
            amount: "0x0"
        }
        //ETH ERC20
        if(chain == ChainType.ETH){
            if(realCy !== ChainType[ChainType.ETH]){
                const ETH_COIN: EthToken = new EthToken(config.CONTRACT_ADDRESS.ERC20.ETH[realCy]);
                tx.value = "0x0";
                tx.data = await ETH_COIN.transfer(to,utils.toValue(amount,utils.getCyDecimal(cy,ChainType[chain])));
                tx.to = config.CONTRACT_ADDRESS.ERC20.ETH[realCy];
                tx.gas = await ETH_COIN.estimateGas(tx)
                tx.amount = utils.toHex(utils.toValue(amount,utils.getCyDecimal(cy,ChainType[chain])));
            }else{
                tx.gas = gas;
                tx.value = value;
            }
        }else if(chain == ChainType.SERO){
            if(realCy !== ChainType[ChainType.SERO]){
                const gasFeeProxy: GasFeeProxy = new GasFeeProxy(config.GAS_FEE_PROXY_ADDRESS[realCy]);
                const tokenRate = await gasFeeProxy.tokenRate()
                console.log("tokenRate>>> ",tokenRate);
                tx.value = utils.toHex(utils.toValue(amount,utils.getCyDecimal(cy,ChainType[chain])));
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
            }
        }
        this.setShowProgress(true);
        rpc.commitTx(tx, password).then(hash => {
            this.setShowToast(true,"success","Commit Successfully!")
            setTimeout(()=>{
                // window.location.href = `#/transaction/info/${chain}/${hash}`
                url.transactionInfo(chain,hash,cy);
            },1500)
            this.setShowProgress(false);
            console.log("page rpc commitTx hash", hash);
        }).catch((e:any)=>{
            this.setShowProgress(false);
            const err = typeof e === "string"?e:e.message;
            this.setShowToast(true,"",err)
            console.error(e);
        })
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
        if(f){
            this.getGasEstimate().then(()=>{
                this.setState({
                    showActionSheet: f
                })
            }).catch();
        }else{
            this.setState({
                showActionSheet: f
            })
        }
    }


    setFee = async (gasPrice:string,gas?:any)=>{
        const {cy,chain,realCy,account} = this.state;
        if(!gas) gas = 21000;
        if(chain == ChainType.SERO && cy!==ChainType[ChainType.SERO]){
            const gasFeeProxy: GasFeeProxy = new GasFeeProxy(config.GAS_FEE_PROXY_ADDRESS[realCy]);
            const tx:any = {};
            tx.value = utils.toHex(utils.toValue("1",utils.getCyDecimal(cy,ChainType[chain])));
            tx.data = await gasFeeProxy.transfer(account.addresses[chain]);
            tx.to = config.GAS_FEE_PROXY_ADDRESS[realCy];
            gas = await gasFeeProxy.estimateGas(tx)
        }
        let fee = gasPrice ?utils.fromValue(new BigNumber(gasPrice).multipliedBy(1e9).multipliedBy(gas),18).toString(10):0;
        return await this.convertFee(fee)
    }

    sort(a:any,b:any){
        return new BigNumber(a.gasPrice).comparedTo(new BigNumber(b.gasPrice))
    }

    renderSheetOptions = ():Array<any> =>{
        const {gasPriceLevel,gasPrice} = this.state;

        const options:Array<any> = [];
        const keys = Object.keys(gasPriceLevel);
        const arr:Array<any> = [];
        const trimKey:any = [];
        for(let key of keys){
            const gasTracker = gasPriceLevel[key];
            if(trimKey.indexOf(gasTracker.gasPrice) == -1){
                trimKey.push(gasTracker.gasPrice)
                arr.push(gasTracker);
            }
        }
        arr.sort(this.sort);
        const desc = [i18n.t("slow"), i18n.t("general"), i18n.t("fast"), i18n.t("fastest")];
        for(let i=arr.length-1;i>=0;i--){
            const a = arr[i];
            options.push({
                text: `${desc[i]},${a.gasPrice}GWei , ${Math.floor(a.second/60)}m ${a.second%60}s`,
                role: gasPrice === a.gasPrice?"selected":"",
                handler: () => {
                    this.setFee(a.gasPrice).then((rest)=>{
                        this.setState({
                            gasPrice:a.gasPrice,
                            fee:rest
                        })
                    })
                }
            })
        }
        options.push({
            text: i18n.t("cancel"),
            role: 'cancel',
            icon: trash,
            handler: () => {

            }
        })
        return options;
    }

    setShowProgress = (f:boolean)=>{
        this.setState({
            showProgress:f
        })
    }

    render() {
        const {cy, chain, account, realCy, showProgress,fee,gas,gasPrice, to, amount,feeCy,showToast,toastMessage,color,balance,showAlert,showActionSheet,gasPriceLevel} = this.state;

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
                            <IonText className="ion-float-right" color="medium">{utils.fromValue(balance[realCy],utils.getCyDecimal(cy,ChainType[chain])).toString(10)} {`${cy}(${realCy})`}</IonText>
                        </IonLabel>
                        <IonInput onIonChange={(e: any) => {
                            this.setState({
                                amount: e.target.value
                            })
                        }} value={amount} className="form-amount" type="number" placeholder="0"/>
                    </IonItem>
                    <IonItem mode="ios" lines="none" className="form-padding" onClick={()=>{
                        chain == ChainType.ETH && this.setShowActionSheet(true);
                    }}>
                        <IonLabel position="stacked">{i18n.t("minerFee")}</IonLabel>
                        <div slot="end">
                            {fee} {feeCy}<br/>
                            <IonText color="medium" className="form-fee-text">
                            (Gas:{new BigNumber(gas).toString(10)} * GasPrice:{gasPrice} {utils.gasUnit(chain)})
                        </IonText>
                        </div>
                        {chain == ChainType.ETH && <IonIcon slot="end" src={chevronForwardOutline} size="small" color='medium'/>}
                    </IonItem>
                </IonList>
                <div className="form-button-div">
                    <IonButton mode="ios" expand="block" disabled={showProgress || !to || !amount} onClick={() => {
                        this.check();
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
            <IonAlert
                mode="ios"
                isOpen={showAlert}
                onDidDismiss={() => this.setShowAlert(false)}
                cssClass='my-custom-class'
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
                            this.setShowAlert(false)
                            this.confirm(e["password"]).catch(e=>{
                                const err = typeof e === "string"?e:e.message;
                                this.setShowToast(true,"danger",err)
                            });

                        }
                    }
                ]}
            />

            <IonActionSheet
                mode="ios"
                isOpen={showActionSheet}
                onDidDismiss={() => this.setShowActionSheet(false)}
                cssClass='my-custom-class'
                buttons={this.renderSheetOptions()}
            >
            </IonActionSheet>

        </IonPage>;
    }
}

export default Transfer