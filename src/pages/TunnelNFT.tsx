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
    IonBadge,
    IonButton,
    IonCol,
    IonContent,
    IonGrid, IonChip,
    IonHeader,
    IonIcon, IonImg,
    IonInput,
    IonItem, IonItemDivider,
    IonLabel, IonList,
    IonPage,
    IonProgressBar,
    IonRow,
    IonText,
    IonTitle,
    IonToast,
    IonToolbar, IonLoading
} from '@ionic/react';
import './Tunnel.css';
import {ChainId, ChainType, Transaction} from "../types";
import * as config from '../config';
import {CONTRACT_ADDRESS, META_TEMP, TOKEN_DESC} from '../config';
import walletWorker from "../worker/walletWorker";
import * as utils from '../utils'
import BigNumber from "bignumber.js";
import rpc from "../rpc";
import url from "../utils/url";
import {chevronBack, chevronForwardOutline, repeatOutline} from "ionicons/icons";
import i18n from "../locales/i18n";
import GasFeeProxy, {TokenRate} from "../contract/gasFeeProxy";
import GasPriceActionSheet from "../components/GasPriceActionSheet";
import ConfirmTransaction from "../components/ConfirmTransaction";

import CrossFeeEth from "../contract/cross/eth/crossFee";
import CrossFeeSERO from "../contract/cross/sero/crossFee";
import Erc721 from "../contract/erc721/meta/eth";
import Src721 from "../contract/erc721/meta/sero";
import CrossNFTSero from "../contract/cross/sero/crossNFT";
import CrossNFTEth from "../contract/cross/eth/crossNFT";
import SRC721CrossFee from "../contract/cross/sero/crossNFTFee";
import GasFeeProxyNFT from "../contract/gasFeeProxy/NFT";

class TunnelNFT extends React.Component<any, any> {

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
        initAllowanceAmount: true,
        showLoading:false
    }

    componentDidMount() {
        //const {crossMode} = this.state;
        const symbol = this.props.match.params.symbol;
        const chainName = this.props.match.params.chain;
        const tokenId = this.props.match.params.tokenId;

        const crossMode: Array<string> = Object.keys(CONTRACT_ADDRESS.ERC721[symbol]["SYMBOL"])
        if (crossMode && crossMode[1] == chainName) {
            crossMode.reverse()
        }
        this.setState({
            crossMode: crossMode,
            tokenId: tokenId
        })
        this.init(crossMode).catch(e => {
            console.log(e)
        })
    }

    init = async (crossMode:Array<string>) => {
        const symbol = this.props.match.params.symbol;
        const account = await walletWorker.accountInfo();
        const chain = utils.getChainIdByName(crossMode[0])
        const tokenId = this.props.match.params.tokenId;
        // const realCy = utils.getCyName(targetCoin,crossMode[0]);

        const contractAddress = utils.getAddressBySymbol(symbol, crossMode[0])
        let allowance = 0;
        if (chain == ChainType.ETH) {
            const contract: Erc721 = new Erc721(contractAddress,chain);
            const address = await contract.getApproved(tokenId);
            if (address.toLowerCase() == CONTRACT_ADDRESS.CROSS_NFT.ETH.HANDLE.toLowerCase()) {
                allowance = 1;
            }
        }
        let metaData: any = {};
        // if (chain == ChainType.ETH) {
        //     const contract: Erc721 = new Erc721(contractAddress,chain);
        //     const uri = await contract.tokenURI(tokenId)
        //     metaData = await rpc.req(uri, {})
        // } else if (chain == ChainType.SERO) {
        //     const contract: Src721 = new Src721(contractAddress);
        //     const uri = await contract.tokenURI(tokenId)
        //     metaData = await rpc.req(uri, {})
        // }

        //TODO FOR TEST
        metaData = META_TEMP[symbol]

        const rest: any = await this.getCrossFee()

        this.setState({
            feeCy: rest[0],
            crossFee: rest[1],
            metaData: metaData,
            gasPrice: await utils.defaultGasPrice(chain),
            allowance: allowance,
            address: account.addresses[utils.getChainIdByName(crossMode[1])],
        })
    }

    private getCrossFee = async (): Promise<Array<any>> => {
        const symbol = this.props.match.params.symbol;
        const {crossMode, targetCoin} = this.state;
        const chain = utils.getChainIdByName(crossMode[0])
        let crossFee: any = 0;
        let feeCy: any = "";
        if (chain == ChainType.ETH) {
            feeCy = "ETH"
        } else if (chain == ChainType.SERO) {
            const contract = new SRC721CrossFee(CONTRACT_ADDRESS.CROSS_NFT.SERO.FEE)
            const rest = await contract.getFeeInfo(utils.getNFTResourceId(symbol))
            feeCy = rest[0];
            const decimal = utils.getCyDecimal(feeCy, ChainType[chain])
            crossFee = utils.fromValue(rest[1], decimal).toString(10)
        }
        return Promise.resolve([feeCy, crossFee])
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

    approve = async (op: any) => {
        let {gasPrice, crossMode} = this.state;
        const account = await walletWorker.accountInfo();
        const fromChain = utils.getChainIdByName(crossMode[0]);
        const toChain = utils.getChainIdByName(crossMode[1]);
        const symbol = this.props.match.params.symbol;
        const tokenId = this.props.match.params.tokenId;
        const tx: Transaction = {
            from: account.addresses && account.addresses[fromChain],
            to: utils.getAddressBySymbol(symbol, crossMode[0]),
            value: "0x0",
            cy: ChainType[fromChain],
            gasPrice: "0x" + new BigNumber(gasPrice).multipliedBy(1e9).toString(16),
            chain: fromChain,
            amount: "0x0",
            feeCy: ChainType[fromChain]
        }
        if (fromChain == ChainType.ETH) {
            let approveTo = config.CONTRACT_ADDRESS.CROSS_NFT.ETH.HANDLE;
            if (op == "cancel") {
                approveTo = "0x0000000000000000000000000000000000000000";
            }
            const contract: Erc721 = new Erc721(utils.getAddressBySymbol(symbol, crossMode[0]),fromChain);
            tx.data = await contract.approve(approveTo, tokenId)
            tx.gas = await contract.estimateGas(tx)
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
        const {crossMode, gasPrice} = this.state;
        const account = await walletWorker.accountInfo();

        const fromChain = utils.getChainIdByName(crossMode[0]);
        const toChain = utils.getChainIdByName(crossMode[1]);
        const symbol = this.props.match.params.symbol;
        const tokenId = this.props.match.params.tokenId;

        const from = account.addresses && account.addresses[fromChain];
        const tx: Transaction = {
            from: from,
            to: config.CONTRACT_ADDRESS.CROSS_NFT[crossMode[0]].BRIDGE,
            value: "0x0",
            cy: "ETH",
            gasPrice: "0x" + new BigNumber(gasPrice).multipliedBy(1e9).toString(16),
            chain: fromChain,
            amount: "0x0",
            feeCy: ChainType[fromChain]
        }
        const ethCross: CrossNFTEth = new CrossNFTEth(config.CONTRACT_ADDRESS.CROSS_NFT.ETH.BRIDGE);
        tx.data = await ethCross.depositNFT(ChainId.SERO, utils.getNFTResourceId(symbol),
            utils.bs58ToHex(account.addresses && account.addresses[toChain]),
            tokenId)
        tx.gas = await ethCross.estimateGas(tx)

        this.setState({
            tx: tx,
            passwordAlert: true
        })
    }

    transferSero = async () => {
        const {crossMode, gasPrice, feeCy, crossFee} = this.state;
        const fromChainId = utils.getChainIdByName(crossMode[0]);
        const toChainId = utils.getChainIdByName(crossMode[1]);

        const account = await walletWorker.accountInfo();
        const destinationChainID = utils.getDestinationChainIDByName(crossMode[1]);

        const symbol = this.props.match.params.symbol;
        const tokenId = this.props.match.params.tokenId;
        const decimal = utils.getCyDecimal(feeCy, crossMode[0])
        const category = utils.getCategoryBySymbol(symbol, crossMode[0]);
        const tx: Transaction = {
            from: account.addresses && account.addresses[fromChainId],
            to: config.GAS_FEE_PROXY_ADDRESS[feeCy],
            value: "0x" + utils.toValue(crossFee, decimal).toString(16),
            cy: feeCy,
            gasPrice: "0x" + new BigNumber(gasPrice).multipliedBy(1e9).toString(16),
            chain: fromChainId,
            amount: "0x0",
            feeCy: feeCy,
            tickets: [{
                Category: category,
                Value: tokenId
            }],
            catg: category,
            tkt: tokenId
        }

        const gasFeeProxy: GasFeeProxyNFT = new GasFeeProxyNFT(config.GAS_FEE_PROXY_ADDRESS[feeCy]);
        tx.data = await gasFeeProxy.depositNFT(destinationChainID, utils.getNFTResourceId(symbol), account.addresses[toChainId]);
        tx.gas = await gasFeeProxy.estimateGas(tx)
        const tokenRate = await gasFeeProxy.tokenRate()
        if(tx.gas && tx.gasPrice){
            tx.feeValue = tokenRate.feeAmount.multipliedBy(
                new BigNumber(tx.gas).multipliedBy(new BigNumber(tx.gasPrice))
            ).dividedBy(tokenRate.seroAmount).toFixed(0,2)
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
        if (utils.needApproved(chain) && new BigNumber(allowance).toNumber() == 0) {
            this.setShowToast(true, "warning", "Please approve first!");
            return
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
        const {crossMode,feeCy} = this.state;
        const chain = utils.getChainIdByName(crossMode[0]);
        let intervalId: any = 0;
        this.setState({
            showLoading:true
        })
        intervalId = setInterval(() => {
            rpc.getTxInfo(chain, hash).then(rest => {
                if (rest) {
                    clearInterval(intervalId)
                    this.setState({
                        showLoading:false
                    })
                    url.transactionInfo(utils.getChainIdByName(crossMode[0]), hash, feeCy);
                }
            }).catch((e: any) => {
                this.setShowProgress(false);
                console.error(e);
            })
        }, 1000)
        this.showPasswordAlert(false)
    }

    render() {
        const {feeCy, metaData, gasPrice, color, showLoading, tx, showActionSheet, crossFee, address, showProgress, showProgress1, allowance, crossMode, passwordAlert, balance, showToast, toastMessage} = this.state;

        // let amountValue: any = initAllowanceAmount ? allowance : amount;
        // if(new BigNumber(amountValue).toNumber() == 0){
        //     amountValue = "";
        // }

        const chain = utils.getChainIdByName(crossMode[0]);
        // const realCy = utils.getCyName(targetCoin, crossMode[0])
        // const targetRealCy = utils.getCyName(targetCoin, crossMode[1])

        return (
            <IonPage>
                <IonContent fullscreen>
                    <IonHeader>
                        <IonToolbar mode="ios" color="primary">
                            <IonIcon src={chevronBack} slot="start" size="large" onClick={() => {
                                url.back()
                            }}/>
                            <IonTitle>NFT {i18n.t("cross")}</IonTitle>
                        </IonToolbar>
                        {showProgress && <IonProgressBar type="indeterminate"/>}
                    </IonHeader>
                    <IonChip color="warning" style={{lineHeight:"1.5"}}>
                        You are transferring NFT from the {TOKEN_DESC[crossMode[0]]} to the {TOKEN_DESC[crossMode[1]]}
                        </IonChip>
                    <IonGrid>
                        <IonRow>
                            <IonCol size={"7"}>
                                <div style={{height: "30vh", border: "#ddd 1px solid"}}>
                                    <img src={metaData && metaData.image}/>
                                </div>
                            </IonCol>
                            <IonCol size={"5"} style={{height: "30vh"}}>
                                <IonList>
                                    <IonItemDivider mode="md">
                                        Name
                                    </IonItemDivider>
                                    <IonItem lines="none">
                                        <small>
                                            {metaData && metaData.name}
                                        </small>
                                    </IonItem>
                                    <IonItemDivider mode="md">
                                        Token Id
                                    </IonItemDivider>
                                    <IonItem lines="none">
                                        <div style={{width:"100%"}}>
                                            <small>{this.props.match.params.tokenId}</small>
                                        </div>
                                    </IonItem>
                                </IonList>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <IonRow>
                        <IonCol size="12">
                            {
                                (crossMode[0] != "ETH" || new BigNumber(allowance).toNumber() > 0) &&
                                <div>
                                    <IonItem mode="ios" lines="none">
                                        <IonLabel mode="ios" color="medium">{i18n.t("crossFee")}</IonLabel>
                                        <IonBadge mode="ios"
                                                  color="light">{crossFee} {feeCy}</IonBadge>
                                    </IonItem>
                                </div>
                            }
                        </IonCol>
                    </IonRow>
                    <IonItem mode="ios" lines="none" onClick={() => {
                        this.setShowActionSheet(true);
                    }}>
                        <IonLabel  color="medium">{i18n.t("gasPrice")}</IonLabel>
                        <IonText slot="end">
                            {gasPrice} {utils.gasUnit(chain)}
                        </IonText>
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
                <IonLoading
                    mode="ios"
                    spinner={"bubbles"}
                    cssClass='my-custom-class'
                    isOpen={showLoading}
                    onDidDismiss={() => {
                        this.setState({
                            showLoading:false
                        })
                    }}
                    message={'Please wait...'}
                    duration={120000}
                />

                <GasPriceActionSheet onClose={() => this.setShowActionSheet(false)} show={showActionSheet}
                                     onSelect={this.setGasPrice} value={gasPrice} chain={chain}/>

                <ConfirmTransaction show={passwordAlert} transaction={tx} onProcess={(f) => this.setShowProgress(f)}
                                    onCancel={() => this.showPasswordAlert(false)} onOK={this.confirm}/>

            </IonPage>
        );
    }
};

export default TunnelNFT;
