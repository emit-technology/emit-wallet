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
    IonActionSheet,
    IonAlert,
    IonBadge,
    IonButton,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonPage,
    IonProgressBar,
    IonRow,
    IonSpinner,
    IonText,
    IonTitle,
    IonToast,
    IonToolbar
} from '@ionic/react';
import './Tunnel.css';
import {ChainId, ChainType, Transaction} from "../types";
import * as config from '../config';
import {BRIDGE_CURRENCY} from '../config';
import walletWorker from "../worker/walletWorker";
import EthToken from "../contract/erc20/eth";
import EthCross from "../contract/cross/eth";

import SeroCross from "../contract/cross/sero";

import * as utils from '../utils'
import BigNumber from "bignumber.js";
import rpc from "../rpc";
import url from "../utils/url";
import {chevronBack, chevronForwardOutline, repeatOutline, trash} from "ionicons/icons";
import CrossFeeEth from "../contract/cross/eth/crossFee";
import CrossFeeSERO from "../contract/cross/sero/crossFee";
import i18n from "../locales/i18n";
import GasFeeProxy, {TokenRate} from "../contract/gasFeeProxy";
import GasPriceActionSheet from "../components/GasPriceActionSheet";
import ConfirmTransaction from "../components/ConfirmTransaction";

class Tunnel extends React.Component<any, any> {

    state: any = {
        targetCoin: this.props.match.params.cy,
        allowance: 0,
        balance: {},
        crossTypes: [],
        crossMode: ["ETH", "SERO"],
        showModal: false,
        address: "",
        amount: "0.0",
        crossFee: "0.0",
        showActionSheet: false,
        gasTracker: {},
        gasPriceLevel: {},
        gasPrice: 1,
        gas: 21000,
        minValue:0
    }

    componentDidMount() {
        const {crossMode} = this.state;
        const targetCoin = this.props.match.params.cy;
        this.init(targetCoin, crossMode).then(() => {

        }).catch(e=>{
            this.setState({
                crossFee: 0,
            })
        })
    }

    init = async (targetCoin: string, crossMode: Array<string>) => {
        const {amount,allowance} = this.state;
        const account = await walletWorker.accountInfo();
        const chain = utils.getChainIdByName(crossMode[0])

        const ETH_COIN: EthToken = new EthToken(config.CONTRACT_ADDRESS.ERC20.ETH[utils.getCyName(targetCoin,"ETH")]);
        const rest: any = await ETH_COIN.allowance(account.addresses[ChainType.ETH], config.CONTRACT_ADDRESS.CROSS.ETH.HANDLE);
        // const restBalance: any = await ETH_COIN.balanceOf(account.addresses[ChainType.ETH]);
        // console.log("allowance>>", rest,restBalance)
        let crossFee: any = "0";
        let tokenRate:TokenRate={seroAmount:new BigNumber(1),feeAmount:new BigNumber(1)};

        const balance = await rpc.getBalance(chain, account.addresses[chain])
        // const ethBalance = await rpc.getBalance(ChainType.ETH, account.addresses[ChainType.ETH])

        const crossTypeArr: Array<any> = [];
        const chains: any = Object.keys(BRIDGE_CURRENCY[targetCoin]);
        for (let chain of chains) {
            for (let chain2 of chains) {
                if (chain !== chain2) {
                    crossTypeArr.push([chain, chain2])
                }
            }
        }
        let minValue:any = 0 ;
        let maxValue:any = 0;
        const targetCoinName = utils.getCyName(targetCoin,ChainType[chain]);
        if (chain == ChainType.SERO) {
            const seroCross: SeroCross = new SeroCross(config.CONTRACT_ADDRESS.CROSS.SERO.BRIDGE);
            const decimal = utils.getCyDecimal(targetCoinName, ChainType[ChainType.SERO]);
            const rest = await seroCross.resourceIDToLimit(utils.getResourceId(targetCoin))
            console.log("rest",rest[0].toNumber(),rest[1].toNumber(),)
            minValue = utils.fromValue(rest[0],decimal).toNumber();
            maxValue = utils.fromValue(rest[1],decimal).toNumber();
            console.log("minValue>>>",minValue,maxValue)
        }else if(chain == ChainType.ETH){
            const ethCross: EthCross = new EthCross(config.CONTRACT_ADDRESS.CROSS.ETH.BRIDGE);
            const decimal = utils.getCyDecimal(targetCoinName, ChainType[ChainType.ETH]);

            const rest = await ethCross.resourceIDToLimit(utils.getResourceId(targetCoin))
            minValue = utils.fromValue(rest[0],decimal).toNumber();
            maxValue = utils.fromValue(rest[1],decimal).toNumber();
        }

        this.setState({
            tokenRate:tokenRate,
            crossFee: crossFee,
            allowance: utils.fromValue(rest, utils.getCyDecimal(targetCoin, ChainType[ChainType.ETH])).toString(10),
            balance: balance,
            crossTypes: crossTypeArr,
            minValue:minValue,
            maxValue:maxValue,
            address: account.addresses[utils.getChainIdByName(crossMode[1])],
            feeCy:chain == ChainType.SERO && targetCoin !== ChainType[ChainType.SERO] ? utils.getCyName(targetCoin,"SERO") : ChainType[chain],
        })
    }

    setCrossMode = () => {
        const {crossMode} = this.state;
        const tmp = crossMode.reverse();
        this.setState({
            crossMode: tmp
        })
        this.init(this.state.targetCoin, tmp).catch(e=>{
            this.setState({
                crossFee: 0,
            })
        })
    }

    showPasswordAlert = (f: boolean) => {
        const {address} = this.state;

        if (!address) {
            this.setShowToast(true, "Please Input Address!");
            return
        }

        this.setState({
            passwordAlert: f
        })
    }

    setShowToast = (f: boolean, color?: string, m?: string) => {
        this.setState({
            showToast: f,
            toastMessage: m,
            color: color
        })
    }

    setTargetCoin = (v: any) => {
        if (!v) return;
        this.setState({
            targetCoin: v
        })
        this.init(v, this.state.crossMode).catch(e=>{
            this.setState({
                crossFee: 0,
            })
        })
    }

    approve = async (op: any) => {
        let {amount,gasPrice} = this.state;
        if (!amount) {
            this.setShowToast(true, "warning", "Please Input Approve Amount")
            setTimeout(() => {
                this.setApproveAlert(true)
            }, 2100)
            this.setShowProgress1(false);
            return;
        }
        if (op == "cancel") {
            amount = 0;
        }
        const {targetCoin} = this.state;
        const decimal = utils.getCyDecimal(targetCoin, ChainType[ChainType.ETH]);
        const account = await walletWorker.accountInfo();
        const ETH_COIN: EthToken = new EthToken(config.CONTRACT_ADDRESS.ERC20.ETH[utils.getCyName(targetCoin,"ETH")]);
        const data: any = await ETH_COIN.approve(config.CONTRACT_ADDRESS.CROSS.ETH.HANDLE, utils.toValue(amount, decimal))
        const tx: Transaction = {
            from: account.addresses && account.addresses[ChainType.ETH],
            to: config.CONTRACT_ADDRESS.ERC20.ETH[utils.getCyName(targetCoin,"ETH")],
            value: "0x0",
            cy: ChainType[ChainType.ETH],
            gasPrice: "0x" + new BigNumber(gasPrice).multipliedBy(1e9).toString(16),
            chain: ChainType.ETH,
            data: data,
            amount: "0x0",
            feeCy:ChainType[ChainType.ETH]
        }
        tx.gas = await ETH_COIN.estimateGas(tx)
        // tx.amount = "0x"+new BigNumber(tx.gas?tx.gas:0).multipliedBy(tx.gasPrice?tx.gasPrice:0).toString(16)

        this.setState({
            tx:tx,
            passwordAlert:true
        })
    }

    setShowActionSheet = (f: boolean) => {
        this.setState({
            showActionSheet: f
        })
    }


    transfer = async () => {
        const {targetCoin, crossMode, address, amount,gasPrice} = this.state;
        const account = await walletWorker.accountInfo();
        const ethCross: EthCross = new EthCross(config.CONTRACT_ADDRESS.CROSS.ETH.BRIDGE);
        const decimal = utils.getCyDecimal(targetCoin, ChainType[ChainType.ETH]);

        // const ethCrossFee: CrossFeeEth = new CrossFeeEth(config.CONTRACT_ADDRESS.CROSS.ETH.FEE);
        // const crossFee: any = await ethCrossFee.estimateFee(utils.getResourceId(targetCoin), utils.toValue(amount, decimal));

        let rest:any = await ethCross.resourceIDToLimit(utils.getResourceId(targetCoin))
        const minValue = utils.fromValue(rest[0],decimal).toNumber();
        const maxValue = utils.fromValue(rest[1],decimal).toNumber();
        if(minValue>new BigNumber(amount).toNumber()){
            this.setShowProgress(false);
            this.setShowToast(true,"warning",`The Min cross amount is ${minValue} ${targetCoin}`)
            return
        }
        if(maxValue<new BigNumber(amount).toNumber()){
            this.setShowProgress(false);
            this.setShowToast(true,"warning",`The Max cross amount is ${maxValue} ${targetCoin}`)
            return
        }
        const data: any = await ethCross.depositFT(ChainId.SERO, utils.getResourceId(targetCoin),
            utils.bs58ToHex(address),
            utils.toValue(amount, decimal))

        const tx: Transaction = {
            from: account.addresses && account.addresses[ChainType.ETH],
            to: config.CONTRACT_ADDRESS.CROSS.ETH.BRIDGE,
            value: "0x0",
            cy: utils.getCyName(targetCoin,crossMode[0]),
            gasPrice: "0x" + new BigNumber(gasPrice).multipliedBy(1e9).toString(16),
            chain: ChainType.ETH,
            data: data,
            amount: utils.toHex(utils.toValue(amount, decimal)),
            feeCy:ChainType[ChainType.ETH]
        }

        tx.gas = await ethCross.estimateGas(tx)

        this.setState({
            tx:tx,
            passwordAlert:true
        })
    }

    transferSero = async () => {
        const {targetCoin, crossMode, address, amount,gasPrice} = this.state;
        const account = await walletWorker.accountInfo();
        const seroCross: SeroCross = new SeroCross(config.CONTRACT_ADDRESS.CROSS.SERO.BRIDGE);
        const targetCoinName = utils.getCyName(targetCoin,crossMode[0]);
        const decimal = utils.getCyDecimal(targetCoinName, ChainType[ChainType.SERO]);

        // const ethCrossFee: CrossFeeEth = new CrossFeeEth(config.CONTRACT_ADDRESS.CROSS.ETH.FEE);
        // const rest: any = await ethCrossFee.estimateFee(utils.getResourceId(targetCoin), utils.toValue(amount, decimal),CrossType.IN);
        // const crossFee = utils.fromValue(rest[0], decimal).toString(10);
        const restValue:any = await seroCross.resourceIDToLimit(utils.getResourceId(targetCoin))
        const minValue = utils.fromValue(restValue[0],decimal).toNumber();
        const maxValue = utils.fromValue(restValue[1],decimal).toNumber();
        if(minValue>new BigNumber(amount).toNumber()){
            this.setShowProgress(false);
            this.setShowToast(true,"warning",`The Min cross amount is ${minValue} ${targetCoin}`)
            return
        }
        if(maxValue < new BigNumber(amount).toNumber()){
            this.setShowProgress(false);
            this.setShowToast(true,"warning",`The Max cross amount is ${maxValue} ${targetCoin}`)
            return
        }
        const data: any = await seroCross.depositFT(ChainId.ETH, utils.getResourceId(targetCoin),address)

        const tx: Transaction = {
            from: account.addresses && account.addresses[ChainType.SERO],
            to: config.CONTRACT_ADDRESS.CROSS.SERO.BRIDGE,
            value: utils.toHex(utils.toValue(amount, decimal)),
            cy: utils.getCyName(targetCoin, crossMode[0]),
            gasPrice: "0x" + new BigNumber(gasPrice).multipliedBy(1e9).toString(16),
            chain: ChainType.SERO,
            data: data,
            amount: "0x0",
            feeCy:ChainType[ChainType.SERO]
        }
        const realCy = utils.getCyName(targetCoin,"SERO");
        if(realCy !== ChainType[ChainType.SERO]){
            const gasFeeProxy: GasFeeProxy = new GasFeeProxy(config.GAS_FEE_PROXY_ADDRESS[realCy]);
            const tokenRate = await gasFeeProxy.tokenRate()
            tx.value = utils.toHex(utils.toValue(amount,decimal));
            tx.data = await gasFeeProxy.depositFT(ChainId.ETH, utils.getResourceId(targetCoin), address);
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
            tx.gas = await seroCross.estimateGas(tx)
        }
        this.setState({
            tx:tx,
            passwordAlert:true
        })
    }

    setShowModal = (f: boolean) => {
        this.setState({
            showModal: f
        })
    }
    setApproveAlert = (f: boolean) => {
        this.setState({
            approveAlert: f
        })
    }

    setCancelAlert = (f: boolean) => {
        this.setState({
            cancelAlert: f
        })
    }

    setShowProgress = (f: boolean) => {
        this.setState({
            showProgress: f
        })
    }

    setShowProgress1 = (f: boolean) => {
        this.setState({
            showProgress1: f
        })
    }

    commit = () => {
        const {crossMode, allowance, amount, targetCoin, balance, crossFee} = this.state;
        const fromChain = crossMode[0];
        if (!amount) {
            this.setShowToast(true, "warning", "Please Input Amount!");
            return
        } else {
            if (utils.needApproved(utils.getChainIdByName(crossMode[0])) && new BigNumber(amount).toNumber() > new BigNumber(allowance).toNumber()) {
                this.setShowToast(true, "warning", "Approved balance is not enough to transfer,please approve first!");
                return
            }
        }
        const realCy = utils.getCyName(targetCoin, crossMode[0]);
        if (crossMode[0] == "ETH") {
            const _balance = utils.fromValue(balance[realCy], utils.getCyDecimal(targetCoin, crossMode[0]));
            if (new BigNumber(amount).toNumber() > _balance.toNumber()) {
                this.setShowToast(true, "warning", `Not enough ${realCy} to transfer!`);
                return;
            }
        } else {
            const _balance = utils.fromValue(balance[realCy], utils.getCyDecimal(targetCoin, crossMode[0]));
            if (new BigNumber(amount).toNumber() > _balance.toNumber()) {
                this.setShowToast(true, "warning", `Not enough ${realCy} to transfer!`);
                return;
            }
        }

        if (fromChain === ChainType[ChainType.ETH]) {
            this.transfer().then(() => {
            }).catch((e: any) => {
                const err = typeof e == "string" ? e : e.message;
                this.setShowToast(true, "danger", err);
                this.setShowProgress(false);
            })
        } else if (fromChain === ChainType[ChainType.SERO]) {
            this.transferSero().then(() => {

            }).catch((e: any) => {
                const err = typeof e == "string" ? e : e.message;
                this.setShowToast(true, "danger", err);
                this.setShowProgress(false);
            })
        }
    }

    setGasPrice=(v:string)=>{
        this.setState(
            {
                gasPrice:v,
                showActionSheet:false
            }
        )
    }

    confirm = async (hash:string) => {
        const {crossMode,targetCoin} = this.state;
        const chain = utils.getChainIdByName(crossMode[0]);
        let intervalId:any = 0;
        intervalId = setInterval(()=>{
            rpc.getTxInfo(chain,hash).then(rest => {
                if(rest){
                    clearInterval(intervalId)
                    this.setShowProgress(false);
                    url.transactionInfo(utils.getChainIdByName(crossMode[0]), hash, targetCoin);
                }
            }).catch((e: any) => {
                console.error(e);
            })
        },1000)
        this.showPasswordAlert(false)
    }


    render() {
        const {targetCoin, gas, gasPrice,feeCy, color, tokenRate,tx,showActionSheet, approveAlert, minValue,maxValue, crossFee, address, amount, showProgress, cancelAlert, showProgress1, allowance, crossMode, passwordAlert, balance, showToast, toastMessage} = this.state;

        let amountValue: any = new BigNumber(amount).toNumber() > 0 ? amount : allowance;
        if (new BigNumber(amountValue).toNumber() == 0) {
            amountValue = ""
        }
        const chain = utils.getChainIdByName(crossMode[0]);
        const realCy = utils.getCyName(targetCoin, crossMode[0])
        const targetRealCy = utils.getCyName(targetCoin, crossMode[1])
        return (
            <IonPage>
                <IonContent fullscreen color="light">
                    <IonHeader>
                        <IonToolbar mode="ios" color="primary">
                            <IonIcon src={chevronBack} slot="start" size="large" onClick={() => {
                                url.back()
                            }}/>
                            <IonTitle>{i18n.t("cross")}</IonTitle>
                        </IonToolbar>
                        {showProgress && <IonProgressBar type="indeterminate"/>}
                    </IonHeader>
                    <p/>
                    <IonGrid>
                        <IonRow className="cross-item">
                            <IonCol size="7">
                                <IonItem mode="ios">
                                    <IonLabel position="stacked" color="dark">{i18n.t("from")} {crossMode[0]} {i18n.t("chain")}  </IonLabel>
                                    <IonInput autofocus style={{fontSize:"32px"}} type="number" value={amountValue} placeholder={amount} onIonChange={(e) => {
                                        this.setState({amount: e.detail.value});
                                        this.init(targetCoin, crossMode).catch()
                                    }}/>
                                </IonItem>
                            </IonCol>
                            <IonCol size="5">
                                <IonItem lines="none" mode="ios">
                                    <IonLabel position="stacked" color="dark"/>
                                    <IonText>{utils.getCyName(targetCoin,crossMode[0])}</IonText>
                                </IonItem>
                            </IonCol>
                            <div style={{paddingLeft:"25px"}}>
                                {new BigNumber(minValue).toNumber()>0 && <small><IonText color="warning">{i18n.t("min")} : {minValue} {realCy}</IonText></small>}<br/>
                                {new BigNumber(maxValue).toNumber()>0 && <small><IonText color="warning">{i18n.t("Max")} : {maxValue} {realCy}</IonText></small>}
                            </div>
                        </IonRow>

                        <IonRow>
                            <IonCol className="text-center">
                                <IonIcon src={repeatOutline} size="large" onClick={() => this.setCrossMode()}/>
                            </IonCol>
                        </IonRow>
                        <IonRow className="cross-item">
                            <IonCol size="7">
                                <IonItem mode="ios">
                                    <IonLabel position="stacked" color="dark">{i18n.t("to")} {crossMode[1]} {i18n.t("chain")}</IonLabel>
                                    {/*<IonInput disabled placeholder="0.00" style={{fontSize:"32px"}} value={amount}/>*/}
                                    <IonInput disabled placeholder="0.00" style={{fontSize:"32px"}} value={new BigNumber(amount).minus(new BigNumber(crossFee)).toNumber()>0?new BigNumber(amount).minus(new BigNumber(crossFee)).toString(10):0}/>

                                </IonItem>
                            </IonCol>
                            <IonCol size="5">
                                <IonItem lines="none" mode="ios">
                                    <IonLabel position="stacked" color="medium"/>
                                    <IonText>{utils.getCyName(targetCoin,crossMode[1])}</IonText>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <p/>
                        <IonRow className="cross-item">
                            <IonCol size="12">
                                {
                                    utils.needApproved(utils.getChainIdByName(crossMode[0])) &&
                                    <IonItem mode="ios" lines="none">
                                        <IonLabel mode="ios" color="medium">{i18n.t("approved")}</IonLabel>
                                        <IonBadge mode="ios" color="light">{allowance} {realCy}</IonBadge>
                                    </IonItem>
                                }

                                <IonItem mode="ios" lines="none">
                                    <IonLabel mode="ios" color="medium">{i18n.t("balance")}</IonLabel>
                                    <IonBadge mode="ios" color="light">{utils.fromValue(balance[realCy],
                                        utils.getCyDecimal(utils.getCyName(targetCoin,crossMode[0]), crossMode[0])).toString(10)} {realCy}</IonBadge>
                                </IonItem>

                                {
                                    (crossMode[0] !="ETH" || new BigNumber(allowance).toNumber()>0) &&
                                    <div>
                                        <IonItem mode="ios" lines="none">
                                            <IonLabel mode="ios" color="medium">{i18n.t("crossFee")}</IonLabel>
                                            <IonBadge mode="ios"
                                                      color="light">{crossFee} {targetRealCy}</IonBadge>
                                        </IonItem>

                                        {/*<IonItem mode="ios" lines="none">*/}
                                        {/*    <IonLabel mode="ios" color="medium">{i18n.t("estimateReceive")}</IonLabel>*/}
                                        {/*    <IonBadge color="light">{new BigNumber(amount).minus(new BigNumber(crossFee)).toNumber()>0?new BigNumber(amount).minus(new BigNumber(crossFee)).toString(10):0} {targetRealCy}</IonBadge>*/}
                                            {/*{crossMode[0] != "ETH" ?*/}
                                            {/*    <IonBadge color="light">{new BigNumber(amount).toString(10)} {targetCoin}</IonBadge> :*/}
                                            {/*    <>*/}
                                            {/*        <IonBadge mode="ios" color="light">{amount} {targetCoin}</IonBadge>*/}
                                            {/*        +<IonBadge color="light">{crossFee} ETH</IonBadge>*/}
                                            {/*    </>*/}
                                            {/*}*/}
                                        {/*</IonItem>*/}
                                    </div>
                                }
                            </IonCol>
                        </IonRow>
                        <IonItem mode="ios" lines="none" className="form-padding" onClick={()=>{
                            this.setShowActionSheet(true);
                        }}>
                            <IonLabel position="stacked">{i18n.t("gasPrice")}</IonLabel>
                            <IonText slot="end">
                                {gasPrice} {utils.gasUnit(chain)}
                            </IonText>
                            {chain == ChainType.ETH && <IonIcon slot="end" src={chevronForwardOutline} size="small" color='medium'/>}
                        </IonItem>

                        {/*<IonItem mode="ios" lines="none" className="form-padding" onClick={() => {*/}
                        {/*    chain == ChainType.ETH && this.setShowActionSheet(true);*/}
                        {/*}}>*/}
                        {/*    <IonLabel position="stacked">{i18n.t("minerFee")}</IonLabel>*/}
                        {/*    <div slot="end">*/}
                        {/*        {this.convertFee()} {feeCy}<br/>*/}
                        {/*        <IonText color="medium" className="form-fee-text">*/}
                        {/*            ({i18n.t("gas")}:{new BigNumber(gas).toString(10)} * {i18n.t("gasPrice")}:{gasPrice} {utils.gasUnit(chain)})*/}
                        {/*        </IonText>*/}
                        {/*    </div>*/}
                        {/*    {chain == ChainType.ETH &&*/}
                        {/*    <IonIcon slot="end" src={chevronForwardOutline} size="small" color='medium'/>}*/}
                        {/*</IonItem>*/}

                        <IonRow>
                            <IonCol>
                                {
                                    utils.needApproved(utils.getChainIdByName(crossMode[0])) ?
                                        <IonGrid>
                                            <IonRow>
                                                <IonCol size="6">
                                                    {utils.needApproved(utils.getChainIdByName(crossMode[0]))
                                                    && new BigNumber(allowance).toNumber() > 0 ?
                                                        <IonButton mode="ios" expand="block" fill="outline"
                                                                   disabled={showProgress} onClick={() => {
                                                            this.approve("cancel").catch(e=>{

                                                            })
                                                        }}>
                                                        {i18n.t("cancelApprove")}</IonButton>
                                                        :
                                                        <IonButton mode="ios" expand="block" fill="outline"
                                                                   disabled={showProgress1} onClick={() => {
                                                            this.approve("approve").catch(e=>{

                                                            })
                                                        }}>{i18n.t("approve")}</IonButton>}
                                                </IonCol>
                                                <IonCol size="6">
                                                    <IonButton mode="ios" expand="block" color="primary"
                                                               disabled={showProgress || showProgress1 || !address || new BigNumber(allowance).toNumber() == 0}
                                                               onClick={() => {
                                                                   this.commit()
                                                               }}>{i18n.t("confirm")}</IonButton>
                                                </IonCol>
                                            </IonRow>
                                        </IonGrid>
                                        :
                                        <IonButton mode="ios" expand="block" color="primary"
                                                   disabled={showProgress || showProgress1 || !address || crossMode[0] == "ETH"
                                                   && new BigNumber(allowance).toNumber() == 0}
                                                   onClick={() => {
                                                       this.commit()
                                                   }}>{i18n.t("confirm")}</IonButton>
                                }
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
                <IonToast
                    mode="ios"
                    isOpen={showToast}
                    color={color}
                    position="top"
                    onDidDismiss={() => this.setShowToast(false)}
                    message={toastMessage}
                    duration={1500}
                />

                <GasPriceActionSheet onClose={()=>this.setShowActionSheet(false)}  show={showActionSheet} onSelect={this.setGasPrice} value={gasPrice} chain={chain}/>

                <ConfirmTransaction show={passwordAlert} transaction={tx} onProcess={(f)=>this.setShowProgress(f)} onCancel={()=>this.showPasswordAlert(false)} onOK={this.confirm}/>

            </IonPage>
        );
    }
};

export default Tunnel;
