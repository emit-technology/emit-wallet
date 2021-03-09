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
import TronToken from "../contract/erc20/tron";
import EthCross from "../contract/cross/eth";
import TronCross from "../contract/cross/tron";

import SeroCross from "../contract/cross/sero";

import * as utils from '../utils'
import BigNumber from "bignumber.js";
import rpc from "../rpc";
import url from "../utils/url";
import {chevronBack, chevronForwardOutline, repeatOutline} from "ionicons/icons";
import i18n from "../locales/i18n";
import GasFeeProxy, {TokenRate} from "../contract/gasFeeProxy";
import GasPriceActionSheet from "../components/GasPriceActionSheet";
import ConfirmTransaction from "../components/ConfirmTransaction";
import tron from "../rpc/tron";
import TronAccountResource from "../components/TronAccountResource";

import CrossFeeEth from "../contract/cross/eth/crossFee";
import CrossFeeSERO from "../contract/cross/sero/crossFee";
import CrossFeeTRON from "../contract/cross/tron/crossFee";

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
        minValue: 0,
        initAllowanceAmount: true
    }

    componentDidMount() {
        //const {crossMode} = this.state;
        const targetCoin = this.props.match.params.cy;
        const crossMode: Array<string> = Object.keys(BRIDGE_CURRENCY[targetCoin])
        this.setState({
            crossMode: crossMode
        })
        this.init(targetCoin, crossMode).then(() => {

        }).catch(e => {
            console.error(e)
            this.setState({
                crossFee: 0,
            })
        })
    }

    init = async (targetCoin: string, crossMode: Array<string>) => {
        const account = await walletWorker.accountInfo();
        const chain = utils.getChainIdByName(crossMode[0])
        const realCy = utils.getCyName(targetCoin, crossMode[0]);

        let allowance = "0";
        if (chain == ChainType.ETH) {
            const ETH_COIN: EthToken = new EthToken(config.CONTRACT_ADDRESS.ERC20.ETH[realCy], chain);
            const rest: any = await ETH_COIN.allowance(account.addresses[chain], config.CONTRACT_ADDRESS.CROSS.ETH.HANDLE);
            allowance = utils.fromValue(rest, utils.getCyDecimal(realCy, ChainType[chain])).toString(10)
        } else if (chain == ChainType.TRON) {
            const TRON_COIN: TronToken = new TronToken(config.CONTRACT_ADDRESS.ERC20.TRON[realCy])
            const rest: any = await TRON_COIN.allowance(account.addresses[chain], config.CONTRACT_ADDRESS.CROSS.TRON.HANDLE);
            allowance = utils.fromValue(rest, utils.getCyDecimal(realCy, ChainType[chain])).toString(10)
        } else if (chain == ChainType.BSC) {
            const token: EthToken = new EthToken(config.CONTRACT_ADDRESS.ERC20.BSC[realCy], chain);
            const rest: any = await token.allowance(account.addresses[chain], config.CONTRACT_ADDRESS.CROSS.BSC.HANDLE);
            allowance = utils.fromValue(rest, utils.getCyDecimal(realCy, ChainType[chain])).toString(10)
        }
        let tokenRate: TokenRate = {seroAmount: new BigNumber(1), feeAmount: new BigNumber(1)};

        const balance = await rpc.getBalance(chain, account.addresses[chain])
        const crossTypeArr: Array<any> = [];
        const chains: any = Object.keys(BRIDGE_CURRENCY[targetCoin]);
        console.log("chains>>", chains, chain, targetCoin)

        for (let chain of chains) {
            for (let chain2 of chains) {
                if (chain !== chain2) {
                    crossTypeArr.push([chain, chain2])
                }
            }
        }
        const targetCoinName = utils.getCyName(targetCoin, ChainType[chain]);
        const __ret = await this.getMinAndMaxValue(chain, targetCoinName, targetCoin);

        if (chain == ChainType.TRON) {
            tron.getAccountResources(account.addresses[ChainType.TRON]).then(rest => {
                this.setState({
                    accountResource: rest
                })
            }).catch(e => {
                console.error(e)
            })
        }
        this.getCrossFee().then(crossFee => {
            this.setState({
                crossFee: crossFee
            })
        }).catch(e => {
            console.error(e)
        });


        this.setState({
            gasPrice: await utils.defaultGasPrice(chain),
            tokenRate: tokenRate,
            allowance: allowance,
            balance: balance,
            crossTypes: crossTypeArr,
            minValue: __ret.minValue,
            maxValue: __ret.maxValue,
            address: account.addresses[utils.getChainIdByName(crossMode[1])],
            feeCy: chain == ChainType.SERO && targetCoin !== ChainType[ChainType.SERO] ? utils.getCyName(targetCoin, "SERO") : ChainType[chain],
        })
    }

    private getCrossFee = async () => {
        const {amount, crossMode, targetCoin} = this.state;
        console.log("targetCoin>>",targetCoin)
        const chain = utils.getChainIdByName(crossMode[0])

        const realCy = utils.getCyName(targetCoin, crossMode[0]);
        const decimal = utils.getCyDecimal(realCy, ChainType[chain])

        const targetChain = utils.getChainIdByName(crossMode[1])
        const realTargetCy = utils.getCyName(targetCoin, crossMode[1]);
        const decimalTarget = utils.getCyDecimal(realTargetCy, ChainType[targetChain]);
        if (targetChain == ChainType.SERO) {
            const crossFeeSero: CrossFeeSERO = new CrossFeeSERO(config.CONTRACT_ADDRESS.CROSS.SERO.FEE);
            const restSERO: any = await crossFeeSero.estimateFee(utils.getResourceId(targetCoin), utils.toValue(amount, decimal));
            const rest = utils.fromValue(restSERO, decimalTarget).toString(10);
            return rest;
        } else if (targetChain == ChainType.TRON) {
            const tronCrossFee: CrossFeeTRON = new CrossFeeTRON(config.CONTRACT_ADDRESS.CROSS.TRON.FEE);

            const restTron: any = await tronCrossFee.estimateFee(utils.getResourceId(targetCoin), utils.toValue(amount, decimal));
            const rest = utils.fromValue(restTron, decimalTarget).toString(10);
            return rest;
        } else if (targetChain == ChainType.ETH) {
            const ethCrossFee: CrossFeeEth = new CrossFeeEth(config.CONTRACT_ADDRESS.CROSS.ETH.FEE,targetChain);
            const restETH: any = await ethCrossFee.estimateFee(utils.getResourceId(targetCoin), utils.toValue(amount, decimal));
            const rest = utils.fromValue(restETH, decimalTarget).toString(10);
            return rest;
        } else if (targetChain == ChainType.BSC) {
            const ethCrossFee: CrossFeeEth = new CrossFeeEth(config.CONTRACT_ADDRESS.CROSS.BSC.FEE,targetChain);
            const restETH: any = await ethCrossFee.estimateFee(utils.getResourceId(targetCoin), utils.toValue(amount, decimal));
            const rest = utils.fromValue(restETH, decimalTarget).toString(10);
            return rest;
        }
        return "0"
    }

    private async getMinAndMaxValue(chain: ChainType, targetCoinName: string, targetCoin: string) {
        let minValue: any = 0;
        let maxValue: any = 0;
        if (chain == ChainType.SERO) {
            const seroCross: SeroCross = new SeroCross(config.CONTRACT_ADDRESS.CROSS.SERO.BRIDGE);
            const decimal = utils.getCyDecimal(targetCoinName, ChainType[ChainType.SERO]);
            const rest = await seroCross.resourceIDToLimit(utils.getResourceId(targetCoin))
            minValue = utils.fromValue(rest[0], decimal).toNumber();
            maxValue = utils.fromValue(rest[1], decimal).toNumber();
        } else if (chain == ChainType.ETH) {
            const ethCross: EthCross = new EthCross(config.CONTRACT_ADDRESS.CROSS.ETH.BRIDGE,ChainType.ETH);
            const decimal = utils.getCyDecimal(targetCoinName, ChainType[ChainType.ETH]);

            const rest = await ethCross.resourceIDToLimit(utils.getResourceId(targetCoin))
            minValue = utils.fromValue(rest[0], decimal).toNumber();
            maxValue = utils.fromValue(rest[1], decimal).toNumber();
        } else if (chain == ChainType.BSC) {
            const ethCross: EthCross = new EthCross(config.CONTRACT_ADDRESS.CROSS.BSC.BRIDGE,chain);
            const decimal = utils.getCyDecimal(targetCoinName, ChainType[ChainType.BSC]);

            const rest = await ethCross.resourceIDToLimit(utils.getResourceId(targetCoin))
            minValue = utils.fromValue(rest[0], decimal).toNumber();
            maxValue = utils.fromValue(rest[1], decimal).toNumber();
        } else if (chain == ChainType.TRON) {
            const tronCross: TronCross = new TronCross(config.CONTRACT_ADDRESS.CROSS.TRON.BRIDGE);
            const decimal = utils.getCyDecimal(targetCoinName, ChainType[ChainType.TRON]);
            const rest: any = await tronCross.resourceIDToLimit(utils.getResourceId(targetCoin))
            minValue = utils.fromValue(rest.min.toString(10), decimal).toNumber();
            maxValue = utils.fromValue(rest.max.toString(10), decimal).toNumber();
        }
        return {minValue, maxValue};
    }

    setCrossMode = () => {
        const {crossMode} = this.state;
        const tmp = crossMode.reverse();
        this.setState({
            crossMode: tmp
        })
        this.init(this.state.targetCoin, tmp).catch(e => {
            console.error(e)
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
        this.init(v, this.state.crossMode).catch(e => {
            console.error(e)
            this.setState({
                crossFee: 0,
            })
        })
    }

    approve = async (op: any) => {
        let {amount, gasPrice, crossMode} = this.state;
        const chain = utils.getChainIdByName(crossMode[0])
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
        const account = await walletWorker.accountInfo();
        const realCY = utils.getCyName(targetCoin, ChainType[chain]);
        const decimal = utils.getCyDecimal(realCY, ChainType[chain]);
        const tx: Transaction = {
            from: account.addresses && account.addresses[chain],
            to: config.CONTRACT_ADDRESS.ERC20[ChainType[chain]][realCY],
            value: "0x0",
            cy: realCY,
            gasPrice: "0x" + new BigNumber(gasPrice).multipliedBy(1e9).toString(16),
            chain: chain,
            amount: utils.toValue(amount, decimal),
            feeCy: utils.defaultCy(chain)
        }
        if (chain == ChainType.ETH) {
            const ETH_COIN: EthToken = new EthToken(tx.to, chain);
            tx.data = await ETH_COIN.approve(config.CONTRACT_ADDRESS.CROSS.ETH.HANDLE, utils.toValue(amount, decimal))
            tx.gas = await ETH_COIN.estimateGas(tx)
        } else if (chain == ChainType.BSC) {
            const ETH_COIN: EthToken = new EthToken(tx.to, chain);
            tx.data = await ETH_COIN.approve(config.CONTRACT_ADDRESS.CROSS.BSC.HANDLE, utils.toValue(amount, decimal))
            tx.gas = await ETH_COIN.estimateGas(tx)
        } else if (chain == ChainType.TRON) {
            const tronToken: TronToken = new TronToken(tx.to);
            tx.data = await tronToken.approve(config.CONTRACT_ADDRESS.CROSS.TRON.HANDLE, utils.toValue(amount, decimal), tx.from)
            tx.value = tx.amount;
            tx.cy = realCY;
        }
        this.setState({
            tx: tx,
            passwordAlert: true
        })
    }

    setShowActionSheet = (f: boolean) => {
        this.setState({
            showActionSheet: f
        })
    }


    transfer = async () => {
        const {targetCoin, crossMode, address, amount, gasPrice} = this.state;
        const account = await walletWorker.accountInfo();

        const chain = utils.getChainIdByName(crossMode[0]);
        const realCy = utils.getCyName(targetCoin, crossMode[0]);
        const decimal = utils.getCyDecimal(realCy, ChainType[chain]);
        const __ret: any = await this.getMinAndMaxValue(chain, realCy, targetCoin)
        if (__ret.minValue > new BigNumber(amount).toNumber()) {
            this.setShowProgress(false);
            this.setShowToast(true, "warning", `The Min cross amount is ${__ret.minValue} ${targetCoin}`)
            return
        }
        if (__ret.maxValue < new BigNumber(amount).toNumber()) {
            this.setShowProgress(false);
            this.setShowToast(true, "warning", `The Max cross amount is ${__ret.maxValue} ${targetCoin}`)
            return
        }

        const from = account.addresses && account.addresses[chain];
        const tx: Transaction = {
            from: from,
            to: config.CONTRACT_ADDRESS.CROSS[crossMode[0]].BRIDGE,
            value: "0x0",
            cy: realCy,
            gasPrice: "0x" + new BigNumber(gasPrice).multipliedBy(1e9).toString(16),
            chain: chain,
            amount: utils.toHex(utils.toValue(amount, decimal)),
            feeCy: utils.defaultCy(chain)
        }
        if (chain == ChainType.TRON) {
            const cross: TronCross = new TronCross(config.CONTRACT_ADDRESS.CROSS.TRON.BRIDGE);
            tx.data = await cross.depositFT(ChainId.SERO, utils.getResourceId(targetCoin),
                utils.bs58ToHex(address),
                utils.toValue(amount, decimal), from)
        } else if (chain == ChainType.ETH) {
            const ethCross: EthCross = new EthCross(config.CONTRACT_ADDRESS.CROSS.ETH.BRIDGE,chain);
            tx.data = await ethCross.depositFT(ChainId.SERO, utils.getResourceId(targetCoin),
                utils.bs58ToHex(address),
                utils.toValue(amount, decimal))
            tx.gas = await ethCross.estimateGas(tx)
        } else if (chain == ChainType.BSC) {
            const ethCross: EthCross = new EthCross(config.CONTRACT_ADDRESS.CROSS.BSC.BRIDGE,chain);
            tx.data = await ethCross.depositFT(ChainId.SERO, utils.getResourceId(targetCoin),
                utils.bs58ToHex(address),
                utils.toValue(amount, decimal))
            tx.gas = await ethCross.estimateGas(tx)
        }

        this.setState({
            tx: tx,
            passwordAlert: true
        })
    }

    transferSero = async () => {
        const {targetCoin, crossMode, address, amount, gasPrice} = this.state;
        const account = await walletWorker.accountInfo();
        const seroCross: SeroCross = new SeroCross(config.CONTRACT_ADDRESS.CROSS.SERO.BRIDGE);
        const targetCoinName = utils.getCyName(targetCoin, crossMode[0]);
        const decimal = utils.getCyDecimal(targetCoinName, ChainType[ChainType.SERO]);

        const restValue: any = await seroCross.resourceIDToLimit(utils.getResourceId(targetCoin))
        const minValue = utils.fromValue(restValue[0], decimal).toNumber();
        const maxValue = utils.fromValue(restValue[1], decimal).toNumber();
        if (minValue > new BigNumber(amount).toNumber()) {
            this.setShowProgress(false);
            this.setShowToast(true, "warning", `The Min cross amount is ${minValue} ${targetCoin}`)
            return
        }
        if (maxValue < new BigNumber(amount).toNumber()) {
            this.setShowProgress(false);
            this.setShowToast(true, "warning", `The Max cross amount is ${maxValue} ${targetCoin}`)
            return
        }
        const targetChain = utils.getChainIdByName(crossMode[1]);
        const destinationChainID = utils.getDestinationChainID(targetChain)
        const toAddress = "0x" + tron.tronWeb.address.toHex(address);
        const data: any = await seroCross.depositFT(destinationChainID, utils.getResourceId(targetCoin), toAddress)

        const tx: Transaction = {
            from: account.addresses && account.addresses[ChainType.SERO],
            to: config.CONTRACT_ADDRESS.CROSS.SERO.BRIDGE,
            value: utils.toHex(utils.toValue(amount, decimal)),
            cy: utils.getCyName(targetCoin, crossMode[0]),
            gasPrice: "0x" + new BigNumber(gasPrice).multipliedBy(1e9).toString(16),
            chain: ChainType.SERO,
            data: data,
            amount: "0x0",
            feeCy: ChainType[ChainType.SERO]
        }
        const realCy = utils.getCyName(targetCoin, "SERO");
        if (realCy !== ChainType[ChainType.SERO]) {
            const gasFeeProxy: GasFeeProxy = new GasFeeProxy(config.GAS_FEE_PROXY_ADDRESS[realCy]);
            const tokenRate = await gasFeeProxy.tokenRate()
            tx.value = utils.toHex(utils.toValue(amount, decimal));
            tx.data = await gasFeeProxy.depositFT(destinationChainID, utils.getResourceId(targetCoin), toAddress);
            tx.to = config.GAS_FEE_PROXY_ADDRESS[realCy];
            tx.gas = await gasFeeProxy.estimateGas(tx)
            tx.amount = "0x0";
            tx.feeCy = realCy;
            if (tx.gas && tx.gasPrice) {
                tx.feeValue = tokenRate.feeAmount.multipliedBy(
                    new BigNumber(tx.gas).multipliedBy(new BigNumber(tx.gasPrice))
                ).dividedBy(tokenRate.seroAmount).toFixed(0, 2)
            }
        } else {
            tx.gas = await seroCross.estimateGas(tx)
        }
        this.setState({
            tx: tx,
            passwordAlert: true
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
        const {crossMode, allowance, amount, targetCoin, balance} = this.state;
        const fromChain = crossMode[0];
        const chain = utils.getChainIdByName(fromChain);
        const realCy = utils.getCyName(targetCoin, fromChain);
        if (!amount) {
            this.setShowToast(true, "warning", "Please Input Amount!");
            return
        } else {
            if (utils.needApproved(chain) && new BigNumber(amount).toNumber() > new BigNumber(allowance).toNumber()) {
                this.setShowToast(true, "warning", "Approved balance is not enough to transfer,please approve first!");
                return
            }
        }
        const _balance = utils.fromValue(balance[realCy], utils.getCyDecimal(realCy, fromChain));
        if (new BigNumber(amount).toNumber() > _balance.toNumber()) {
            this.setShowToast(true, "warning", `Not enough ${realCy} to transfer!`);
            return;
        }

        if (chain == ChainType.SERO) {
            this.transferSero().then(() => {
            }).catch((e: any) => {
                console.error(e)
                const err = typeof e == "string" ? e : e.message;
                this.setShowToast(true, "danger", err);
                this.setShowProgress(false);
            })
        } else {
            this.transfer().then(() => {
            }).catch((e: any) => {
                console.error(e)
                const err = typeof e == "string" ? e : e.message;
                this.setShowToast(true, "danger", err);
                this.setShowProgress(false);
            })
        }
    }

    setGasPrice = (v: string) => {
        this.setState(
            {
                gasPrice: v,
                showActionSheet: false
            }
        )
    }

    confirm = async (hash: string) => {
        const {crossMode, targetCoin} = this.state;
        const chain = utils.getChainIdByName(crossMode[0]);
        let intervalId: any = 0;
        intervalId = setInterval(() => {
            rpc.getTxInfo(chain, hash).then(rest => {
                if (rest) {
                    clearInterval(intervalId)
                    this.setShowProgress(false);
                    url.transactionInfo(utils.getChainIdByName(crossMode[0]), hash, targetCoin);
                }
            }).catch((e: any) => {
                console.error(e);
            })
        }, 1000)
        this.showPasswordAlert(false)
    }

    render() {
        const {targetCoin, gasPrice, color, initAllowanceAmount, tx, showActionSheet, accountResource, minValue, maxValue, crossFee, address, amount, showProgress, showProgress1, allowance, crossMode, passwordAlert, balance, showToast, toastMessage} = this.state;

        let amountValue: any = initAllowanceAmount ? allowance : amount;
        // if(new BigNumber(amountValue).toNumber() == 0){
        //     amountValue = "";
        // }

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
                                    <IonLabel position="stacked"
                                              color="dark">{i18n.t("from")} {crossMode[0]} {i18n.t("chain")}  </IonLabel>
                                    <IonInput autofocus style={{fontSize: "32px"}} type="number" value={amountValue}
                                              placeholder={amount} onIonChange={(e) => {
                                        this.setState({amount: e.detail.value, initAllowanceAmount: false});
                                        this.init(targetCoin, crossMode).catch((e) => {
                                            console.error(e)
                                        })
                                    }}/>
                                </IonItem>
                            </IonCol>
                            <IonCol size="5">
                                <IonItem lines="none" mode="ios">
                                    <IonLabel position="stacked" color="dark"/>
                                    <IonText>{utils.getCyName(targetCoin, crossMode[0])}</IonText>
                                </IonItem>
                            </IonCol>
                            <div style={{paddingLeft: "25px"}}>
                                {new BigNumber(minValue).toNumber() > 0 &&
                                <small><IonText color="warning">{i18n.t("min")} : {minValue} {realCy}</IonText></small>}<br/>
                                {new BigNumber(maxValue).toNumber() > 0 &&
                                <small><IonText color="warning">{i18n.t("Max")} : {maxValue} {realCy}</IonText></small>}
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
                                    <IonLabel position="stacked"
                                              color="dark">{i18n.t("to")} {crossMode[1]} {i18n.t("chain")}</IonLabel>
                                    {/*<IonInput disabled placeholder="0.00" style={{fontSize:"32px"}} value={amount}/>*/}
                                    <IonInput disabled placeholder="0.00" style={{fontSize: "32px"}}
                                              value={new BigNumber(amount).minus(new BigNumber(crossFee)).toNumber() > 0 ? new BigNumber(amount).minus(new BigNumber(crossFee)).toString(10) : 0}/>

                                </IonItem>
                            </IonCol>
                            <IonCol size="5">
                                <IonItem lines="none" mode="ios">
                                    <IonLabel position="stacked" color="medium"/>
                                    <IonText>{utils.getCyName(targetCoin, crossMode[1])}</IonText>
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
                                        utils.getCyDecimal(realCy, crossMode[0])).toString(10)} {realCy}</IonBadge>
                                </IonItem>

                                {
                                    (crossMode[0] != "ETH" || new BigNumber(allowance).toNumber() > 0) &&
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
                        {chain == ChainType.TRON ?
                            <IonItem onClick={() => {
                                url.frozenTronBalance();
                            }}>
                                <TronAccountResource accountResource={accountResource}/>
                                <IonIcon src={chevronForwardOutline} color="medium" slot="end"/>
                            </IonItem>
                            :
                            <IonItem mode="ios" lines="none" className="form-padding" onClick={() => {
                                this.setShowActionSheet(true);
                            }}>
                                <IonLabel position="stacked">{i18n.t("gasPrice")}</IonLabel>
                                <IonText slot="end">
                                    {gasPrice} {utils.gasUnit(chain)}
                                </IonText>
                                {chain == ChainType.ETH &&
                                <IonIcon slot="end" src={chevronForwardOutline} size="small" color='medium'/>}
                            </IonItem>
                        }

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
                                                            this.approve("cancel").catch(e => {
                                                                const err = typeof e == "string" ? e : e.message;
                                                                this.setShowToast(true, "danger", err)
                                                                console.error(e)
                                                            })
                                                        }}>
                                                            {i18n.t("cancelApprove")}</IonButton>
                                                        :
                                                        <IonButton mode="ios" expand="block" fill="outline"
                                                                   disabled={showProgress1} onClick={() => {
                                                            this.approve("approve").catch(e => {
                                                                const err = typeof e == "string" ? e : e.message;
                                                                this.setShowToast(true, "danger", err)
                                                                console.error(e)
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

                <GasPriceActionSheet onClose={() => this.setShowActionSheet(false)} show={showActionSheet}
                                     onSelect={this.setGasPrice} value={gasPrice} chain={chain}/>

                <ConfirmTransaction show={passwordAlert} transaction={tx} onProcess={(f) => this.setShowProgress(f)}
                                    onCancel={() => this.showPasswordAlert(false)} onOK={this.confirm}/>

            </IonPage>
        );
    }
};

export default Tunnel;
