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
    IonTextarea,
    IonText, IonSpinner, IonGrid,
    IonIcon, IonButton, IonItemDivider,
    IonToast, IonProgressBar, IonRow, IonCol, IonImg, IonLoading
} from "@ionic/react";
import {chevronBack, chevronForwardOutline, trash} from "ionicons/icons"

import * as utils from '../utils'
import rpc from "../rpc";
import walletWorker from "../worker/walletWorker";
import {ChainType, Transaction} from "../types";
import BigNumber from "bignumber.js";
import url from "../utils/url";
import i18n from "../locales/i18n";
import ConfirmTransaction from "../components/ConfirmTransaction";
import GasPriceActionSheet from "../components/GasPriceActionSheet";
import Erc721 from "../contract/erc721/meta/eth";
import GasFeeProxyNFT from "../contract/gasFeeProxy/NFT";
import { GAS_FEE_PROXY_ADDRESS} from "../config";

class TransferNFT extends React.Component<any, any> {

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
        tx:{},
        showLoading:false
    }

    componentDidMount() {
        this.setState({
            to:this.props.match.params.to
        })
        this.init().then(()=>{
        }).catch();
    }

    init = async () => {
        const category = this.props.match.params.category;
        const chainName = this.props.match.params.chain;
        const chainId = utils.getChainIdByName(chainName);
        const tokenId = this.props.match.params.value;
        // const contractAddress = utils.getAddressBySymbol(category,chainName)
        if (category && chainId) {
            let metaData:any = {};
            // if(chainId == ChainType.ETH){
            //     const contract: Erc721 = new Erc721(contractAddress,chainId);
            //     const uri = await contract.tokenURI(tokenId)
            //     metaData = await rpc.req(uri,{})
            // }else if (chainId == ChainType.SERO){
            //     const contract: Src721 = new Src721(contractAddress);
            //     const uri = await contract.tokenURI(tokenId)
            //     metaData = await rpc.req(uri,{})
            // }
            const account = await walletWorker.accountInfo()
            const balance = await rpc.getBalance(chainId, account.addresses[chainId]);
            const ticketObj = await rpc.getTicket(chainId,account.addresses[chainId])
            const tickets = ticketObj[utils.getCategoryBySymbol(category,chainName)]
            let ticket = null;
            if(tickets && tickets.length>0){
                for(let v of tickets){
                    if(tokenId == v.tokenId){
                        ticket = v;
                    }
                }
            }
            // const ticket = await rpc.getTicket(chainId, account.addresses[chainId]);
            const defaultGasPrice = await utils.defaultGasPrice(chainId);
            const cy = chainId == ChainType.SERO ? "LIGHT" : ChainType[chainId];
            this.setState({
                feeCy:cy,
                cy: cy,
                chain: chainId,
                account: account,
                realCy: cy,
                balance:balance,
                gasPrice:defaultGasPrice,
                metaData:ticket.meta,
            })
        } else {
            // window.location.href = "#/"
            url.home();
        }
    }

    check = async ()=>{
        const {to,chain,account,realCy,gasPrice,cy,balance,gas} = this.state;
        if (!to) {
            this.setShowToast(true,"","To is required!")
            return;
        }else{

        }
        let tx: Transaction | any = {
            from: account.addresses && account.addresses[chain],
            to: to,
            cy: realCy,
            gasPrice: "0x"+new BigNumber(gasPrice).multipliedBy(1e9).toString(16),
            chain: chain,
            amount: "0x0",
            feeCy:ChainType[ChainType.ETH]
        }

        const symbol = this.props.match.params.category;
        const chainName = this.props.match.params.chain;
        // const chainId = utils.getChainIdByName(chainName);
        const tokenId = this.props.match.params.value;
        const contractAddress = utils.getAddressBySymbol(symbol,chainName)

        //ETH ERC20
        if(chain == ChainType.ETH){
            const contract: Erc721 = new Erc721(contractAddress,chain);
            tx.value = "0x0";
            tx.data = await contract.transferFrom(tx.from,to,tokenId);
            tx.to = contractAddress;
            tx.gas = await contract.estimateGas(tx)
            tx.feeCy = ChainType[ChainType.ETH];
        }else if(chain == ChainType.SERO){
            const feeCy = "LIGHT";
            const gasFeeProxy: GasFeeProxyNFT = new GasFeeProxyNFT(GAS_FEE_PROXY_ADDRESS[feeCy]);
            tx.value = "0x0";
            tx.tickets=[{
                Category:utils.getCategoryBySymbol(symbol,chainName),
                Value:tokenId
            }]
            tx.tkt = tokenId
            tx.catg = utils.getCategoryBySymbol(symbol,chainName)
            tx.cy = feeCy;
            tx.to = GAS_FEE_PROXY_ADDRESS[feeCy];
            tx.data = await gasFeeProxy.transfer(to)
            tx.amount = "0x0";
            tx.feeCy = feeCy;
            tx.gas = await gasFeeProxy.estimateGas(tx)
            const tokenRate = await gasFeeProxy.tokenRate()
            if(tx.gas && tx.gasPrice){
                tx.feeValue = tokenRate.feeAmount.multipliedBy(
                    new BigNumber(tx.gas).multipliedBy(new BigNumber(tx.gasPrice))
                ).dividedBy(tokenRate.seroAmount).toFixed(0,2)
            }
        }
        this.setState({
            tx:tx,
            showAlert:true
        })
    }

    confirm = async (hash:string) => {
        const {chain,feeCy} = this.state;
        let intervalId:any = 0;
        this.setState({
            showLoading:true
        })
        intervalId = setInterval(()=>{
            rpc.getTxInfo(chain,hash).then((rest)=>{
                if(rest){
                    this.setShowToast(true,"success","Commit Successfully!")
                    clearInterval(intervalId);
                    this.setShowProgress(false);
                    this.setState({
                        showLoading:false
                    })
                    url.transactionInfo(chain,hash,feeCy);
                }
            }).catch(e=>{
                this.setShowProgress(false);
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
        const {metaData, chain, showProgress,gasPrice,tx, to, showToast,toastMessage,color,showAlert,showActionSheet,showLoading} = this.state;

        return <IonPage>
            <IonHeader>
                <IonToolbar mode="ios" color="primary">
                    <IonIcon src={chevronBack} slot="start" size="large" onClick={()=>{url.back()}}/>
                    <IonTitle>NFT {i18n.t("transfer")}</IonTitle>
                </IonToolbar>
                {showProgress && <IonProgressBar type="indeterminate"/>}
            </IonHeader>

            <IonContent fullscreen>

                <IonGrid>
                    <IonRow>
                        <IonCol size={"7"} >
                            <div style={{height:"30vh",border:"#ddd 1px solid"}}>
                                <img src={metaData&&metaData.image}/>
                            </div>
                        </IonCol>
                        <IonCol size={"5"} style={{height:"30vh"}}>
                            <IonList>
                                <IonItemDivider mode="md">
                                    Name
                                </IonItemDivider>
                                <IonItem lines="none">
                                    <small>
                                        {metaData&&metaData.name}
                                    </small>
                                </IonItem>
                                <IonItemDivider mode="md">
                                    Token Id
                                </IonItemDivider>
                                <IonItem lines="none">
                                    <div style={{width:"100%"}}>
                                        <small>{this.props.match.params.value}</small>
                                    </div>
                                </IonItem>
                            </IonList>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonList>
                    {/*<IonItem mode="ios" className="form-padding">*/}
                    {/*    <IonLabel position="stacked">{i18n.t("from")}</IonLabel>*/}
                    {/*    <IonTextarea className="form-address" disabled rows={chain == ChainType.SERO ? 4 : 2}*/}
                    {/*                 value={account.addresses && account.addresses[chain]}/>*/}
                    {/*</IonItem>*/}

                    <IonItem mode="ios" className="form-padding">
                        <IonLabel position="stacked">{i18n.t("to")}</IonLabel>
                        <IonTextarea onIonChange={(e: any) => {
                            this.setState({
                                to: e.target.value
                            })
                        }} rows={chain == ChainType.SERO ? 4 : 2} className="form-address" value={to}
                                     placeholder={`${ChainType[chain]} Address`}/>
                    </IonItem>
                    <IonItem mode="ios" lines="none" className="form-padding" onClick={()=>{
                        this.setShowActionSheet(true);
                    }}>
                        <IonLabel position="stacked">{i18n.t("gasPrice")}</IonLabel>
                        <IonText slot="end">
                            {gasPrice} {utils.gasUnit(chain)}
                        </IonText>
                        {chain == ChainType.ETH && <IonIcon slot="end" src={chevronForwardOutline} size="small" color='medium'/>}
                    </IonItem>
                </IonList>
                <div className="form-button-div">
                    <IonButton mode="ios" expand="block" disabled={showProgress || !to} onClick={() => {
                        this.check().catch(e=>{
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


            <GasPriceActionSheet onClose={()=>this.setShowActionSheet(false)}  show={showActionSheet} onSelect={this.setGasPrice} value={gasPrice} chain={chain}/>

            <ConfirmTransaction show={showAlert} transaction={tx} onProcess={(f)=>this.setShowProgress(f)} onCancel={()=>this.setShowAlert(false)} onOK={this.confirm}/>
        </IonPage>;
    }
}

export default TransferNFT