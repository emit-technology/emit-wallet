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

        await this.getGasEstimate();

        const ETH_COIN: EthToken = new EthToken(config.CONTRACT_ADDRESS.ERC20.ETH[utils.getCyName(targetCoin,"ETH")]);
        const rest: any = await ETH_COIN.allowance(account.addresses[ChainType.ETH], config.CONTRACT_ADDRESS.CROSS.ETH.HANDLE);
        // const restBalance: any = await ETH_COIN.balanceOf(account.addresses[ChainType.ETH]);
        // console.log("allowance>>", rest,restBalance)
        let crossFee: any = "0";
        let tokenRate:TokenRate={seroAmount:new BigNumber(1),feeAmount:new BigNumber(1)};
        if (chain == ChainType.ETH) {

            if (new BigNumber(amount).toNumber() > 0) {
                const ethCross: EthCross = new EthCross(config.CONTRACT_ADDRESS.CROSS.ETH.BRIDGE);
                const decimal = utils.getCyDecimal(targetCoin, ChainType[ChainType.ETH]);

                const crossFeeSero: CrossFeeSERO = new CrossFeeSERO(config.CONTRACT_ADDRESS.CROSS.SERO.FEE);
                const decimalSERO = utils.getCyDecimal(targetCoin, ChainType[ChainType.SERO]);
                const restSERO: any = await crossFeeSero.estimateFee(utils.getResourceId(targetCoin), utils.toValue(amount, decimal));
                crossFee = utils.fromValue(restSERO, decimalSERO).toString(10);

                if (new BigNumber(allowance).toNumber() == 0){
                    const ETH_COIN: EthToken = new EthToken(config.CONTRACT_ADDRESS.ERC20.ETH[utils.getCyName(targetCoin,"ETH")]);
                    const data: any = await ETH_COIN.approve(config.CONTRACT_ADDRESS.CROSS.ETH.HANDLE, utils.toValue(amount, decimal))
                    const tx: Transaction = {
                        from: account.addresses && account.addresses[ChainType.ETH],
                        to: config.CONTRACT_ADDRESS.ERC20.ETH[utils.getCyName(targetCoin,"ETH")],
                        value: "0x" + utils.toValue(0, decimal).toString(16),
                        cy: "ETH",
                        gasPrice: "0x" + new BigNumber(1).multipliedBy(1e9).toString(16),
                        chain: ChainType.ETH,
                        data: data,
                        amount:"0x0"
                    }
                    const gas = await ETH_COIN.estimateGas(tx)
                    this.setState({
                        gas: gas,
                    })
                }else{
                    const data: any = await ethCross.depositFT(ChainId.SERO, utils.getResourceId(targetCoin),
                        utils.bs58ToHex(account.addresses[utils.getChainIdByName(crossMode[1])]),
                        utils.toValue(amount, decimal))

                    ethCross.estimateGas({
                        from: account.addresses[chain],
                        to: config.CONTRACT_ADDRESS.CROSS.ETH.BRIDGE,
                        data: data,
                        value: "0x0"
                    }).then(gas => {
                        this.setState({
                            gas: gas,
                        })
                    })
                }
            }
        } else {
            if (new BigNumber(amount).toNumber() > 0) {
                const seroCross: SeroCross = new SeroCross(config.CONTRACT_ADDRESS.CROSS.SERO.BRIDGE);
                const decimal = utils.getCyDecimal(targetCoin, ChainType[ChainType.SERO]);

                const ethCrossFee: CrossFeeEth = new CrossFeeEth(config.CONTRACT_ADDRESS.CROSS.ETH.FEE);
                const decimalETH = utils.getCyDecimal(targetCoin, ChainType[ChainType.ETH]);
                const restETH: any = await ethCrossFee.estimateFee(utils.getResourceId(targetCoin), utils.toValue(amount, decimal));
                crossFee = utils.fromValue(restETH, decimalETH).toString(10);

                const realCy = utils.getCyName(targetCoin,"SERO")
                const tx:any = {
                    from: account.addresses[chain],
                    to: config.CONTRACT_ADDRESS.CROSS.SERO.BRIDGE,
                    cy:utils.getCyName(targetCoin, crossMode[0]),
                    value: utils.toHex(utils.toValue(amount, decimal))
                }
                if(realCy !== "SERO"){
                    const gasFeeProxy: GasFeeProxy = new GasFeeProxy(config.GAS_FEE_PROXY_ADDRESS[realCy]);
                    tokenRate = await gasFeeProxy.tokenRate();
                    tx.data = await gasFeeProxy.depositFT(ChainId.ETH, utils.getResourceId(targetCoin), account.addresses[utils.getChainIdByName(crossMode[1])]);
                    tx.to = config.GAS_FEE_PROXY_ADDRESS[realCy];
                    gasFeeProxy.estimateGas(tx).then(gas => {
                        this.setState({
                            gas: gas
                        })
                    })
                }else{
                    tx.data = await seroCross.depositFT(ChainId.ETH, utils.getResourceId(targetCoin), account.addresses[utils.getChainIdByName(crossMode[1])])
                    seroCross.estimateGas(tx).then(gas => {
                        this.setState({
                            gas: gas
                        })
                    })
                }
            }

        }
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
        if (chain == ChainType.SERO) {
            const seroCross: SeroCross = new SeroCross(config.CONTRACT_ADDRESS.CROSS.SERO.BRIDGE);
            const decimal = utils.getCyDecimal(targetCoin, ChainType[ChainType.SERO]);
            const rest = await seroCross.resourceIDToLimit(utils.getResourceId(targetCoin))
            minValue = utils.fromValue(rest[0],decimal).toNumber();
            maxValue = utils.fromValue(rest[1],decimal).toNumber();
        }else if(chain == ChainType.ETH){
            const ethCross: EthCross = new EthCross(config.CONTRACT_ADDRESS.CROSS.ETH.BRIDGE);
            const decimal = utils.getCyDecimal(targetCoin, ChainType[ChainType.ETH]);
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

    approve = async (password: any, op: any) => {
        let {crossMode, amount,gasPrice} = this.state;
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
        if (!password) {
            this.setShowToast(true, "warning", "Please Input Password")
            setTimeout(() => {
                this.setApproveAlert(true)
            }, 2100)
            this.setShowProgress1(false);
            return
        }
        const {targetCoin} = this.state;
        const decimal = utils.getCyDecimal(targetCoin, ChainType[ChainType.ETH]);
        const account = await walletWorker.accountInfo();
        const ETH_COIN: EthToken = new EthToken(config.CONTRACT_ADDRESS.ERC20.ETH[utils.getCyName(targetCoin,"ETH")]);
        const data: any = await ETH_COIN.approve(config.CONTRACT_ADDRESS.CROSS.ETH.HANDLE, utils.toValue(amount, decimal))
        const tx: Transaction = {
            from: account.addresses && account.addresses[ChainType.ETH],
            to: config.CONTRACT_ADDRESS.ERC20.ETH[utils.getCyName(targetCoin,"ETH")],
            value: "0x" + utils.toValue(0, decimal).toString(16),
            cy: "ETH",
            gasPrice: "0x" + new BigNumber(gasPrice).multipliedBy(1e9).toString(16),
            chain: ChainType.ETH,
            data: data,
            amount: "0x0",
        }
        tx.gas = await ETH_COIN.estimateGas(tx)
        tx.amount = "0x"+new BigNumber(tx.gas?tx.gas:0).multipliedBy(tx.gasPrice?tx.gasPrice:0).toString(16)

        rpc.commitTx(tx, password).then(hash => {
            this.setShowProgress1(false);
            // url.transactionInfo(utils.getChainIdByName(crossMode[0]), hash,targetCoin);
            this.setShowToast(true, "success", "Commit Successfully!");
            setTimeout(() => {
                url.transactionInfo(utils.getChainIdByName(crossMode[0]), hash, "ETH");
            }, 1000)
        }).catch((e: any) => {
            this.setShowProgress1(false);
            const err: any = typeof e === "string" ? e : e.message;
            this.setShowToast(true, "danger", err);
            console.error(e);
        })
    }

    setFee(gasPrice: string, gas?: number) {
        if (!gas) gas = 21000;
        return gasPrice ? utils.fromValue(new BigNumber(gasPrice).multipliedBy(1e9).multipliedBy(gas), 18).toString(10) : 0
    }

    sort(a: any, b: any) {
        return new BigNumber(a.gasPrice).comparedTo(new BigNumber(b.gasPrice))
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

    getGasEstimate = async ()=>{
        const {gasPrice,crossMode} = this.state;
        const chain = utils.getChainIdByName(crossMode[0])
        if(chain == ChainType.SERO){
            this.setState({
                gas: utils.defaultGas(chain),
                // gasPriceLevel:data && data,
                gasPrice: 1,
                fee: this.setFee("1",utils.defaultGas(chain))
            })
        }else{
            const data:any = await rpc.post("eth_gasTracker",[])
            if(new BigNumber(gasPrice).toNumber() == 1){
                this.setState({
                    gasPriceLevel:data && data,
                    gasPrice:data && data.AvgGasPrice.gasPrice,
                    fee:this.setFee(data && data.AvgGasPrice.gasPrice)
                })
            }else{
                this.setState({
                    gasPriceLevel:data && data,
                })
            }

        }
    }


    transfer = async (password: any) => {
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
            amount: utils.toHex(utils.toValue(amount, decimal))
        }

        tx.gas = await ethCross.estimateGas(tx)

        rpc.commitTx(tx, password).then(hash => {
            this.setShowProgress(false);
            console.log("page rpc commitTx hash", hash);
            url.transactionInfo(utils.getChainIdByName(crossMode[0]), hash, targetCoin);
        }).catch((e: any) => {
            this.setShowProgress(false);
            const err: any = typeof e === "string" ? e : e.message;
            this.setShowToast(true, "danger", err);
            console.error(e);
        })
    }

    transferSero = async (password: any) => {
        const {targetCoin, crossMode, address, amount,gasPrice} = this.state;
        const account = await walletWorker.accountInfo();
        const seroCross: SeroCross = new SeroCross(config.CONTRACT_ADDRESS.CROSS.SERO.BRIDGE);
        const decimal = utils.getCyDecimal(targetCoin, ChainType[ChainType.SERO]);

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
            amount: "0x0"
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
        rpc.commitTx(tx, password).then(hash => {
            this.setShowProgress(false);
            console.log("page rpc commitTx hash", hash);
            url.transactionInfo(utils.getChainIdByName(crossMode[0]), hash, targetCoin);
        }).catch((e: any) => {
            this.setShowProgress(false);
            const err: any = typeof e === "string" ? e : e.message;
            this.setShowToast(true, "danger", err);
            console.error(e);
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

    commit = (password: string) => {
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

        this.setShowProgress(true);
        if (fromChain === ChainType[ChainType.ETH]) {
            this.transfer(password).then(() => {
            }).catch((e: any) => {
                const err = typeof e == "string" ? e : e.message;
                this.setShowToast(true, "danger", err);
                this.setShowProgress(false);
            })
        } else if (fromChain === ChainType[ChainType.SERO]) {
            this.transferSero(password).then(() => {

            }).catch((e: any) => {
                const err = typeof e == "string" ? e : e.message;
                this.setShowProgress(false);
            })
        }
    }

    renderSheetOptions = (): Array<any> => {
        const {gasPriceLevel, gasPrice} = this.state;

        const options: Array<any> = [];
        const keys = Object.keys(gasPriceLevel);
        const arr: Array<any> = [];
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
        for (let i = arr.length - 1; i >= 0; i--) {
            const a = arr[i];
            options.push({
                text: `${desc[i]},${a.gasPrice}GWei , ${Math.floor(a.second / 60)}m ${a.second % 60}s`,
                role: gasPrice === a.gasPrice ? "selected" : "",
                handler: () => {
                    this.setState({
                        gasPrice: a.gasPrice,
                        fee: this.setFee(a.gasPrice)
                    })
                }
            })
        }
        options.push({
            text: i18n.t("cancel"),
            role: 'cancel',
            handler: () => {

            }
        })
        return options;
    }

    convertFee = ()=>{
        const {tokenRate,gasPrice,gas,crossMode,targetCoin,amount} = this.state;
        if(!tokenRate){
            return 0;
        }
        const chain = utils.getChainIdByName(crossMode[0]);
        const decimal = chain == ChainType.SERO && targetCoin !== ChainType[ChainType.SERO] && tokenRate.seroAmount.toNumber()!=1  ? utils.getCyDecimal(targetCoin,"SERO") : 18
        const ret = utils.fromValue(
            tokenRate.feeAmount.multipliedBy(
                new BigNumber(gas).multipliedBy(new BigNumber(gasPrice).multipliedBy(1e9))
            ).dividedBy(tokenRate.seroAmount),
            decimal
        );
        return decimal>6 || tokenRate.seroAmount.toNumber()==1 ?ret.toString(10):ret.toFixed(6,2)
    }

    render() {
        const {targetCoin, gas, gasPrice,feeCy, color, tokenRate,showActionSheet, approveAlert, minValue,maxValue, crossFee, address, amount, showProgress, cancelAlert, showProgress1, allowance, crossMode, passwordAlert, balance, showToast, toastMessage} = this.state;

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
                                    <IonBadge mode="ios"
                                              color="light">{utils.fromValue(balance[realCy], utils.getCyDecimal(targetCoin, crossMode[0])).toString(10)} {realCy}</IonBadge>
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
                        <IonItem mode="ios" lines="none" className="form-padding" onClick={() => {
                            chain == ChainType.ETH && this.setShowActionSheet(true);
                        }}>
                            <IonLabel position="stacked">{i18n.t("minerFee")}</IonLabel>
                            <div slot="end">
                                {this.convertFee()} {feeCy}<br/>
                                <IonText color="medium" className="form-fee-text">
                                    ({i18n.t("gas")}:{new BigNumber(gas).toString(10)} * {i18n.t("gasPrice")}:{gasPrice} {utils.gasUnit(chain)})
                                </IonText>
                            </div>
                            {chain == ChainType.ETH &&
                            <IonIcon slot="end" src={chevronForwardOutline} size="small" color='medium'/>}
                        </IonItem>

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
                                                                   disabled={showProgress1} onClick={() => {
                                                            this.setCancelAlert(true)
                                                        }}>{showProgress1 && <IonSpinner name="bubbles"/>}
                                                        {i18n.t("cancelApprove")}</IonButton>
                                                        :
                                                        <IonButton mode="ios" expand="block" fill="outline"
                                                                   disabled={showProgress1} onClick={() => {
                                                            this.setApproveAlert(true)
                                                        }}>{showProgress1 &&
                                                        <IonSpinner name="bubbles"/>}{i18n.t("approve")}</IonButton>}
                                                </IonCol>
                                                <IonCol size="6">
                                                    <IonButton mode="ios" expand="block" color="primary"
                                                               disabled={showProgress || showProgress1 || !address || new BigNumber(allowance).toNumber() == 0}
                                                               onClick={() => {
                                                                   this.showPasswordAlert(true)
                                                               }}>{showProgress &&
                                                    <IonSpinner name="bubbles"/>}{i18n.t("confirm")}</IonButton>
                                                </IonCol>
                                            </IonRow>
                                        </IonGrid>
                                        :
                                        <IonButton mode="ios" expand="block" color="primary"
                                                   disabled={showProgress || showProgress1 || !address || crossMode[0] == "ETH" && new BigNumber(allowance).toNumber() == 0}
                                                   onClick={() => {
                                                       this.showPasswordAlert(true)
                                                   }}>{showProgress && <IonSpinner name="bubbles"/>}{i18n.t("confirm")}</IonButton>
                                }
                            </IonCol>
                        </IonRow>

                        {/*<p/>*/}
                        {/*<IonRow className="cross-item cross-item-border">*/}
                        {/*    <IonCol size="12">*/}
                        {/*        1. You need approve to cross contract first.<br/>*/}
                        {/*        2. and then use approve amount to confirm.<br/>*/}
                        {/*        3. min 0.1 USDT.<br/>*/}
                        {/*        4. at least need 30 minutes.<br/>*/}
                        {/*    </IonCol>*/}
                        {/*</IonRow>*/}
                    </IonGrid>


                    <IonAlert
                        mode="ios"
                        isOpen={passwordAlert}
                        onDidDismiss={() => this.showPasswordAlert(false)}
                        cssClass='my-custom-class'
                        header={'Cross Transfer'}
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
                            }, {
                                text: 'Ok',
                                handler: (e: any) => {
                                    console.log('Confirm Ok', e);
                                    this.showPasswordAlert(false)
                                    this.commit(e["password"]);

                                }
                            }
                        ]}
                    />

                    <IonAlert
                        mode="ios"
                        isOpen={approveAlert}
                        onDidDismiss={() => this.setApproveAlert(false)}
                        cssClass='my-custom-class'
                        header={i18n.t("approve")}
                        subHeader={`You will Approve ${amount} ${utils.getCyName(targetCoin,crossMode[0])}(ERC20) to Cross Contract`}
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
                                    this.setShowProgress1(false);
                                    console.log('Confirm Cancel');
                                }
                            }, {
                                text: i18n.t("ok"),
                                handler: (e: any) => {
                                    if (new BigNumber(amount).toNumber() == 0) {
                                        this.setShowToast(true, "warning", "Please Input Value");
                                        return
                                    }
                                    this.setApproveAlert(false)
                                    this.setShowProgress1(true);
                                    this.approve(e["password"], "approve").then(() => {
                                    }).catch((e: any) => {
                                        this.setShowProgress1(false);
                                        const err: any = typeof e === "string" ? e : e.message;
                                        this.setShowToast(true, "danger", err);
                                    })
                                }
                            }
                        ]}
                    />

                    <IonAlert
                        mode="ios"
                        isOpen={cancelAlert}
                        onDidDismiss={() => this.setCancelAlert(false)}
                        cssClass='my-custom-class'
                        header={i18n.t("cancelApprove")}
                        inputs={[
                            {
                                name: 'password',
                                type: 'password',
                                placeholder: i18n.t("password"),
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
                                    this.setShowProgress1(false);
                                    console.log('Confirm Cancel');
                                }
                            }, {
                                text: i18n.t("ok"),
                                handler: (e: any) => {
                                    console.log('Confirm Ok', e);
                                    this.setCancelAlert(false)
                                    this.setShowProgress1(true);
                                    this.approve(e["password"], "cancel").then(() => {

                                    }).catch((e: any) => {
                                        this.setShowProgress1(false);
                                        const err: any = typeof e === "string" ? e : e.message;
                                        this.setShowToast(true, "danger", err);
                                    })
                                }
                            }
                        ]}
                    />
                </IonContent>
                <IonActionSheet
                    mode="ios"
                    isOpen={showActionSheet}
                    onDidDismiss={() => this.setShowActionSheet(false)}
                    cssClass='my-custom-class'
                    buttons={this.renderSheetOptions()}
                >
                </IonActionSheet>
                <IonToast
                    mode="ios"
                    isOpen={showToast}
                    color={color}
                    position="top"
                    onDidDismiss={() => this.setShowToast(false)}
                    message={toastMessage}
                    duration={1500}
                />
            </IonPage>
        );
    }
};

export default Tunnel;
