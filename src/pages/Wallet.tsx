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
    IonAlert,
    IonAvatar,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonItemGroup,
    IonLabel,
    IonList,
    IonListHeader,
    IonLoading, IonModal,
    IonPage,
    IonPopover,
    IonRow,
    IonText,
    IonTitle,
    IonToast,
    IonToolbar,
    IonActionSheet
} from '@ionic/react';
import * as utils from '../utils';
import './Wallet.css';
import {
    arrowForwardOutline,
    chevronDownOutline,
    chevronForwardOutline,
    chevronUpOutline, close,
    linkOutline, lockClosedOutline, lockOpenOutline,
    qrCodeSharp,
    scanOutline,
} from 'ionicons/icons'

import {BRIDGE_CURRENCY, TOKEN_DESC} from "../config"

import walletWorker from "../worker/walletWorker";
import {AccountModel, ChainType} from "../types";
import rpc from "../rpc";
import selfStorage from "../utils/storage";
import url from "../utils/url";
import BigNumber from "bignumber.js";
import {Plugins,} from '@capacitor/core';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import i18n from '../locales/i18n'
import WETH from "../contract/weth";
import tron from "../rpc/tron";
import interVar, {interVarBalance} from "../interval";

const {StatusBar,Device} = Plugins;

interface State {
    account: AccountModel
    assets: any
    coinShow: any
    showAlert: boolean
    chain: any
    showVersionAlert:boolean
    version:any
    deviceInfo:any
    scanText:string
    showWithdrawEthAlert:boolean,
    showDepositEthAlert:boolean,
    activeChainAlert:boolean,
    showLoading:boolean,
    selectChainType:ChainType,
    toastColor:string
    toastMsg:string
    showToast:boolean
    crossMode:Array<string>,
    popoverState:any,
    showSelectChain:boolean,
    lockedWallet:boolean
}

class Wallet extends React.Component<State, any> {

    state: State = {
        account: {name: ""},
        assets: {},
        coinShow: {},
        showAlert: false,
        chain: "",
        showVersionAlert:false,
        version:{},
        deviceInfo:{},
        scanText:"",
        showWithdrawEthAlert:false,
        showDepositEthAlert:false,
        activeChainAlert:false,
        showLoading:false,
        selectChainType:ChainType._,
        toastColor:"warning",
        toastMsg:"",
        showToast:false,
        crossMode:[],
        popoverState:{},
        showSelectChain:false,
        lockedWallet:false
    }

    componentDidMount() {
        StatusBar.setBackgroundColor({
            color: "#194381"
        })

        walletWorker.accountInfo().then((account:any)=>{
            const assets: any = {};
            const currencies: Array<string> = Object.keys(BRIDGE_CURRENCY);
            for (let cy of currencies) {
                const chains = Object.keys(BRIDGE_CURRENCY[cy]);
                assets[cy] = {}
                for (let chain of chains) {
                    // if (chain === "SERO") {
                    //     assets[cy][chain] = "0";
                    // } else if (chain === "ETH") {
                    //     assets[cy][chain] = "0";
                    // } else if (chain === "TRON") {
                    //     assets[cy][chain] = "0";
                    // }
                    assets[cy][chain] = "0";
                }
            }
            this.setState({
                account: account,
                assets:assets
            })
        })

        interVarBalance.start(()=>{
            console.log("render balance");
            this.init().then(() => {
            }).catch(e=>{
                console.error(e)
            })
        },1000 * 5)

        setTimeout(()=>{
            this.checkVersion().catch(e=>{
                console.log(e,"checkVersion>>.")
            })
        },1000)
    }

    checkVersion = async () => {
        const deviceInfo = await Device.getInfo();
        if(deviceInfo && deviceInfo.platform =="ios" || deviceInfo && deviceInfo.platform =="android"){
            const skipVersion: any = selfStorage.getItem("skipVersion");
            const remoteVersion:any = await rpc.post("eth_getAppVersion", ["latest",""],ChainType.ETH)

            if (remoteVersion && remoteVersion.length>0) {
                if (skipVersion && skipVersion.length > 0) {
                    if (skipVersion.indexOf(remoteVersion[0].version) > -1) {
                        return
                    }
                }

                if(remoteVersion[0].show && deviceInfo.appVersion !== remoteVersion[0].version){
                    this.setState({
                        showVersionAlert:true,
                        version:remoteVersion[0],
                        deviceInfo:deviceInfo
                    })
                }
            }
        }
    }

    init = async () => {
        const account = await walletWorker.accountInfo();
        const lockedWallet = await walletWorker.isLocked();
        const assets: any = {};
        const currencies: Array<string> = Object.keys(BRIDGE_CURRENCY);
        if (account && account.addresses && account.addresses[2]) {
            const allBalance = await Promise.all([
                rpc.getBalance(ChainType.SERO, account.addresses[ChainType.SERO]),
                rpc.getBalance(ChainType.ETH, account.addresses[ChainType.ETH]),
                account.addresses[ChainType.TRON]?rpc.getBalance(ChainType.TRON, account.addresses[ChainType.TRON]):new Promise((resolve)=>{resolve({})}),
                rpc.getBalance(ChainType.BSC, account.addresses[ChainType.BSC])
            ]);

            const seroBalance:any = allBalance[0];
            const ethBalance:any = allBalance[1];
            const tronBalance:any = allBalance[2];
            const bscBalance:any = allBalance[3];

            for (let cy of currencies) {
                const chains = Object.keys(BRIDGE_CURRENCY[cy]);
                assets[cy] = {}
                for (let chain of chains) {
                    const currency = utils.getCyName(cy, chain);
                    if (chain === "SERO") {
                        assets[cy][chain] = utils.fromValue(seroBalance[currency], utils.getCyDecimal(currency, chain)).toString(10);
                    } else if (chain === "ETH") {
                        assets[cy][chain] = utils.fromValue(ethBalance[currency], utils.getCyDecimal(currency, chain)).toString(10);
                    } else if (chain === "TRON") {
                        if(currency=="TRX"){
                            assets[cy][chain] = utils.fromValue(tronBalance["TRX"],6).plus(utils.fromValue(tronBalance["TRX_FROZEN"],6)).toNumber()
                        }else{
                            assets[cy][chain] = utils.fromValue(tronBalance[currency], utils.getCyDecimal(currency, chain)).toString(10);
                        }
                    } else if (chain === "BSC") {
                        assets[cy][chain] = utils.fromValue(bscBalance[currency], utils.getCyDecimal(currency, chain)).toString(10);
                    }
                }
            }
        }

        this.setState({
            assets: assets,
            lockedWallet:lockedWallet
        })
    }

    getBalance = async () => {
    }

    openScanner = async () => {
        const data = await BarcodeScanner.scan({
            formats: "QR_CODE",
            prompt: "Scan QR Code"
        });
        if (data.text) {
            this.setState({
                scanText:data.text
            })
            if (data.text && data.text.indexOf("0x") == 0) {
                this.setShowSelectChain(true)
            } else if (tron.tronWeb.isAddress(data.text)) {
                this.setShowAlert(true, "TRON")
            } else if (data.text && data.text.indexOf("http") == 0) {
                Plugins.Browser.open({url: data.text}).catch(e => {
                    console.log(e)
                })
            } else {
                this.setShowAlert(true, "SERO")
            }
        }
    };

    setShowToast = (f:boolean,color?:string,m?:string) =>{
        this.setState({
            showToast:f,
            toastMsg:m,
            toastColor:color
        })
    }

    setShowPopover = (cy:string,e:any,f:boolean)=>{
        const crossMode: Array<string> = Object.keys(BRIDGE_CURRENCY[cy])
        const ret:any = {};
        ret[cy] = {
            event:e,
            showPopover:f
        }
        this.setState({
            crossMode:crossMode,
            popoverState: ret
        })
    }

    setShowSelectChain = (f:boolean)=>{
        this.setState({
            showSelectChain:f
        })
    }

    renderAssets = () => {
        const {assets, coinShow,account,popoverState} = this.state;
        const assetsKeys = Object.keys(assets);
        const itemGroup: Array<any> = [];

        for (let cy of assetsKeys) {
            const tokens = assets[cy];
            const tokenKeys = Object.keys(tokens);
            const item: Array<any> = [];
            let total: BigNumber = new BigNumber(0)

            if(!(account.addresses && account.addresses[ChainType.TRON]) && ["TRX","TUSDT"].indexOf(cy)>-1){
                continue;
            }
            for (let chain of tokenKeys) {
                const value = new BigNumber(tokens[chain]);
                const currency = utils.getCyName(cy, chain);
                total = new BigNumber(value).plus(total)

                item.push(
                    <IonItem mode="ios" lines="none" style={{marginBottom:"5px"}} >
                        <IonAvatar slot="start" onClick={(e:any) => {
                            // window.location.href = `#/transaction/list/${chain}/${cy}`
                            e.stopPropagation();
                            url.transactionList(cy, chain);
                        }}>
                            <IonIcon src={linkOutline} size="large" color="primary"/>
                            <div>
                                <IonText color="primary" className={`coin-chain-${chain.toLowerCase()}`}>
                                    {(chain == "ETH" ? "ethereum" : chain).toLowerCase()}
                                </IonText>
                            </div>
                        </IonAvatar>
                        <IonLabel onClick={(e:any) => {
                            // window.location.href = `#/transaction/list/${chain}/${cy}`
                            e.stopPropagation();
                            url.transactionList(cy, chain);
                        }}>
                            {/*<IonText>{parseFloat(value.toFixed(3, 1)).toLocaleString()}</IonText>*/}
                            <IonText className="text-bold">{value.toString(10)}</IonText>
                            <p>
                                <IonText color="medium">{currency}{utils.getCyType(chain, cy) && `(${utils.getCyType(chain, cy)})`}</IonText>
                            </p>
                        </IonLabel>
                        <IonIcon src={chevronForwardOutline} color="medium" size="small" slot="end" onClick={(e:any) => {
                            // window.location.href = `#/transaction/list/${chain}/${cy}`
                            e.stopPropagation();
                            url.transactionList(cy, chain);
                        }}/>
                    </IonItem>
                )
                if(currency == "WETH"){
                    item.push(
                        <IonItem mode="ios">
                            <IonRow style={{textAlign:"center",width:"100%"}}>
                                <IonCol size="6">
                                    <IonButton size="small" expand="block" fill="outline" onClick={(e:any)=>{
                                        e.stopPropagation();
                                        url.swapEth("withdraw")
                                    }}>Withdraw</IonButton>
                                </IonCol>
                                <IonCol size="6">
                                    <IonButton size="small" expand="block" onClick={(e:any)=>{
                                        e.stopPropagation();
                                        url.swapEth("deposit")
                                    }}>Deposit</IonButton>
                                </IonCol>
                            </IonRow>
                        </IonItem>
                    )
                }
                if(currency == "TRX"){
                    item.push(
                        <IonItem mode="ios" lines="none">
                            <IonRow style={{textAlign:"center",width:"100%"}}>
                                <IonCol size="6">
                                    <IonText className="text-small-x2">{i18n.t("available")}</IonText>
                                </IonCol>
                                <IonCol size="6">
                                    <IonText  className="text-bold">{utils.fromValue(tron.getBalanceLocal()["TRX"],6).toNumber()}</IonText>
                                </IonCol>
                                <IonCol size="6">
                                    <IonText className="text-small-x2">{i18n.t("frozen")}</IonText>
                                </IonCol>
                                <IonCol size="6">
                                    <IonText  className="text-bold">{utils.fromValue(tron.getBalanceLocal()["TRX_FROZEN"],6).toNumber()}</IonText>
                                </IonCol>
                            </IonRow>
                        </IonItem>
                    )
                }
            }


            itemGroup.push(<IonCard mode="ios"   onClick={(e) => {
                e.persist();
                coinShow[cy] = !coinShow[cy];
                this.setState({
                    coinHidden: coinShow
                })
            }}>
                <IonItem lines="none" style={{margin: "10px 0 0"}}>
                    <IonAvatar slot="start">
                        <img src={require(`../img/${cy}.png`)} style={{borderRadius:"unset"}}/>
                    </IonAvatar>
                    <IonCardTitle slot="start">
                        {utils.getCyDisplayName(cy)}
                        <IonCardSubtitle>{TOKEN_DESC[cy]}</IonCardSubtitle>
                    </IonCardTitle>
                    {utils.notCrossToken(cy) && <>
                        <IonButton size="small" slot="end" mode="ios" onClick={(e:any) => {
                            e.persist();
                            this.setShowPopover(cy,e,true);
                            e.stopPropagation();
                        }} style={{float: "right"}}>{i18n.t("cross")}
                        </IonButton>
                        <IonPopover
                            mode="ios"
                            cssClass='my-custom-class'
                            event={popoverState[cy] && popoverState[cy].event}
                            isOpen={popoverState[cy] && popoverState[cy].showPopover}
                            onDidDismiss={() => this.setShowPopover(cy,undefined,false)}
                        >
                            <IonList>
                                {
                                    utils.getCrossChainByCy(cy).map((v:any) => {
                                        return <IonItem onClick={()=>{
                                            url.tunnel(cy,v.from,v.to)
                                        }}>
                                            <IonText>{utils.getCyDisplayName(v.from)}</IonText>
                                            <IonIcon icon={arrowForwardOutline} size={"small"}/>
                                            <IonText>{v.to}</IonText>
                                            <IonIcon icon={chevronForwardOutline} slot="end" color="medium" size={"small"}/>
                                        </IonItem>
                                    })
                                }
                            </IonList>
                        </IonPopover>
                    </>}
                    {coinShow[cy]?<IonIcon icon={chevronUpOutline} slot="end" color="medium"/>:<IonIcon icon={chevronDownOutline} slot="end" color="medium"/>}
                </IonItem>
                <IonCardContent hidden={!coinShow[cy]} className="wallet-card-content" >
                    <IonItemGroup>
                        {item}
                    </IonItemGroup>
                </IonCardContent>
                <div style={{padding:"0 15px"}}>
                    <IonItem lines="none">
                        <IonLabel>
                            Total
                        </IonLabel>
                        <IonText className="total-amount">
                            {parseFloat(total.toFixed(3, 1)).toLocaleString()}
                        </IonText>
                    </IonItem>
                </div>
            </IonCard>)
        }
        return itemGroup;
    }

    setShowAlert = (f: boolean, chain?: string) => {
        this.setState({
            showAlert: f,
            chain: chain
        })
    }

    getTokenList = (): Array<any> => {
        const {assets, chain} = this.state;
        if (!chain) {
            return []
        }
        const assetsKeys = Object.keys(assets);
        const items: Array<any> = [];
        for (let i = 0; i < assetsKeys.length; i++) {
            const cy = assetsKeys[i];
            // const tokens = assets[cy];
            // console.log(tokens, "tokens");
            // const value = new BigNumber(tokens[chain]).toNumber();
            if (assets[cy][chain]) {
                items.push({
                    name: cy,
                    type: 'radio',
                    label: utils.getCyDisplayName(cy),
                    value: cy,
                    checked: items.length == 0
                })
            }
        }
        return items;
    }

    setShowVersionAlert = (f:boolean) =>{
        this.setState({
            showVersionAlert:f
        })
    }

    showActiveChainAlert = (f:boolean,chain:ChainType)=>{
        this.setShowLoading(true)
        this.activeChain(chain).then(()=>{
            this.setShowToast(true,"success","Active successfully!");
            this.setShowLoading(false)
        }).catch((e)=>{
            const err = typeof e=="string"?e:e.message;
            this.setShowLoading(false)
            this.setShowToast(true,"danger",err);
        })
    }

    activeChain = async (chain:ChainType)=>{
        const {account} = this.state;
        if(account && account.accountId){
            await walletWorker.genNewWallet(account.accountId,"",chain)
            const rest = await walletWorker.accountInfoAsync();
            this.setState({
                account:rest
            })
        }
    }

    setShowLoading = (f:boolean)=>{
        this.setState({
            showLoading:f
        })
    }

    render() {
        const {account,scanText,showLoading, showAlert, chain,showVersionAlert,version,deviceInfo,toastColor,toastMsg,showToast,showSelectChain,lockedWallet} = this.state;

        return (
            <IonPage>
                <IonHeader mode="ios">
                    <IonToolbar color="primary" mode="ios">
                        <IonButton fill="outline" color="light" size="small" slot="start" onClick={()=>{
                            if(lockedWallet){
                                url.accountUnlock()
                            }else{
                                walletWorker.lockWallet().then(()=>{
                                    url.accountUnlock()
                                })
                            }
                        }}><IonIcon size="small" src={lockedWallet?lockClosedOutline:lockOpenOutline} color="light"/> {lockedWallet?i18n.t("unlock"):i18n.t("Lock")}</IonButton>
                        <IonTitle>{i18n.t("wallet")}</IonTitle>
                        {
                            utils.IsAPP() &&
                            <IonIcon onClick={() => {
                                this.openScanner().catch();
                            }} src={scanOutline} size="large" slot="end"/>
                        }
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen color="light">
                    <IonList color="light">
                        <IonListHeader color="light" mode="ios">
                            <IonLabel><IonText color="medium">{i18n.t("hello")} </IonText>{account.name} </IonLabel>
                        </IonListHeader>
                        <IonItem mode="ios" lines="none" onClick={() => {
                            url.receive(account.addresses[ChainType.ETH],ChainType.ETH)
                        }}>
                            <IonAvatar slot="start">
                                <img src={require(`../img/ETH.png`)}/>
                            </IonAvatar>
                            <IonLabel className="address-wrap" mode="ios">
                                <IonText>{account.addresses && utils.ellipsisStr(account.addresses[ChainType.ETH])}</IonText>
                                <p><IonText color="medium">{utils.getChainFullName(ChainType.ETH)}</IonText></p>
                            </IonLabel>
                            <IonIcon src={qrCodeSharp} slot="end" color="medium"/>
                        </IonItem>
                        <IonItem mode="ios" lines="none" onClick={() => {
                            url.receive(account.addresses && account.addresses[ChainType.BSC],ChainType.BSC)
                        }}>
                            <IonAvatar slot="start">
                                <img src={require(`../img/BNB.svg`)}/>
                            </IonAvatar>
                            <IonLabel className="address-wrap" mode="ios">
                                <IonText>{account.addresses && utils.ellipsisStr(account.addresses[ChainType.BSC])}</IonText>
                                <p><IonText color="medium">{utils.getChainFullName(ChainType.BSC)}</IonText></p>
                            </IonLabel>
                            <IonIcon src={qrCodeSharp} slot="end" color="medium"/>
                        </IonItem>
                        <IonItem mode="ios" lines="none" onClick={() => {
                            url.receive(account.addresses && account.addresses[ChainType.SERO],ChainType.SERO)
                        }}>
                            <IonAvatar slot="start">
                                <img src={require(`../img/SERO.png`)}/>
                            </IonAvatar>
                            <IonLabel className="address-wrap" mode="ios">
                                <IonText>{account.addresses && utils.ellipsisStr(account.addresses[ChainType.SERO])}</IonText>
                                <p><IonText color="medium">{utils.getChainFullName(ChainType.SERO)}</IonText></p>
                            </IonLabel>
                            <IonIcon src={qrCodeSharp} slot="end" color="medium"/>
                        </IonItem>
                        <IonItem mode="ios" lines="none" onClick={() => {
                            if((account.addresses && account.addresses[ChainType.TRON])){
                                url.receive(account.addresses && account.addresses[ChainType.TRON],ChainType.TRON)
                            }
                        }}>
                            <IonAvatar slot="start" style={{opacity:!(account.addresses && account.addresses[ChainType.TRON])?0.3:1}}>
                                <img src={require(`../img/TRON.png`)} style={{borderRadius:"unset"}}/>
                            </IonAvatar>
                            <IonLabel className="address-wrap" mode="ios" style={{opacity:!(account.addresses && account.addresses[ChainType.TRON])?0.3:1}}>
                                <IonText>{account.addresses && account.addresses[ChainType.TRON] && utils.ellipsisStr(account.addresses[ChainType.TRON])}</IonText>
                                <p><IonText color="medium">{utils.getChainFullName(ChainType.TRON)}</IonText></p>
                            </IonLabel>
                            {
                                !(account.addresses && account.addresses[ChainType.TRON])?<IonButton fill="outline" onClick={()=>{
                                    this.showActiveChainAlert(true,ChainType.TRON);
                                }}>{i18n.t("active")}</IonButton>: <IonIcon src={qrCodeSharp} slot="end" color="medium"/>
                            }
                        </IonItem>
                    </IonList>

                    {this.renderAssets()}

                </IonContent>

                <IonAlert
                    mode="ios"
                    isOpen={showAlert}
                    onDidDismiss={() => this.setShowAlert(false)}
                    header={"Select Token"}
                    inputs={this.getTokenList()}
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
                            text: i18n.t("transfer"),
                            handler: (cy) => {
                                console.log('Confirm Ok', cy);
                                url.transfer(cy, chain,scanText)
                            }
                        }
                    ]}
                />

                <IonModal
                    mode="ios"
                    isOpen={showVersionAlert}
                    cssClass='epoch-version-modal'
                    onDidDismiss={() => this.setShowVersionAlert(false)}>
                    <div>
                        <IonCard>
                            <IonHeader>
                                <IonListHeader>{version.version}</IonListHeader>
                            </IonHeader>
                            <IonCardContent className="version-content">
                                <IonList>
                                    {
                                        version.info && version.info.length>0 &&
                                            version.info.map((v:any,i:number)=>{
                                                return <IonItem lines="none">
                                                    <IonLabel className="ion-text-wrap">
                                                        {v}
                                                    </IonLabel>
                                                </IonItem>
                                            })
                                    }
                                </IonList>
                            </IonCardContent>
                        </IonCard>
                        <IonRow className="version-button">
                            <IonCol size="5">
                                <IonButton expand={"block"} fill="outline" onClick={()=>{
                                    this.setShowVersionAlert(false)
                                }}>{i18n.t("cancel")}</IonButton>
                            </IonCol>
                            <IonCol size="7">
                                <IonButton expand={"block"} onClick={()=>{
                                    if(deviceInfo.platform == "ios"){
                                        Plugins.App.openUrl({url:version.iosUrl}).catch()
                                    }else if (deviceInfo.platform == "android"){
                                        Plugins.Browser.open({url:version.androidUrl}).catch()
                                    }else{
                                        Plugins.Browser.open({url:version.androidUrl}).catch()
                                    }
                                }}>{i18n.t("upgrade")}</IonButton>
                            </IonCol>
                        </IonRow>
                    </div>
                </IonModal>

                <IonToast
                    color={!toastColor?"warning":toastColor}
                    position="top"
                    isOpen={showToast}
                    onDidDismiss={() => this.setShowToast(false)}
                    message={toastMsg}
                    duration={1500}
                    mode="ios"
                />

                <IonLoading
                    mode="ios"
                    isOpen={showLoading}
                    onDidDismiss={() => this.setShowLoading(false)}
                    message={'Please wait...'}
                    duration={60000}
                />

                <IonActionSheet
                    mode="ios"
                    isOpen={showSelectChain}
                    onDidDismiss={() => this.setShowSelectChain(false)}
                    cssClass='my-custom-class'
                    buttons={[{
                        text: 'Binance Smart Chain',
                        handler: () => {
                            this.setShowAlert(true,"BSC")
                        }
                    }, {
                        text: 'Ethereum Network',
                        handler: () => {
                            this.setShowAlert(true,"ETH")
                        }
                    }, {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    }]}
                >
                </IonActionSheet>
            </IonPage>
        );
    }
};

export default Wallet;
