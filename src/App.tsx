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
import {Redirect, Route, Switch} from 'react-router-dom';
import {
    IonApp,
    IonIcon,
    IonLabel,IonImg,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs
} from '@ionic/react';
import {IonReactRouter, IonReactHashRouter} from '@ionic/react-router';
import {
    ellipse,
    square,
    triangle,
    gitCompareOutline,
    sunnyOutline,
    walletOutline,
    appsOutline,
    settingsOutline
} from 'ionicons/icons';
import Wallet from './pages/Wallet';
import Epoch from './pages/Epoch';
import Settings from './pages/Settings';
import CreateAccount from "./pages/accounts/Create";
import Backup from "./pages/accounts/Backup";
import Confirm from "./pages/accounts/Confirm";
import ImportAccount from "./pages/accounts/Import";
import Transfer from "./pages/Transfer";
import Receive from "./pages/Receive";
import TransactionList from "./pages/TransactionList";
import TransactionInfo from "./pages/TransactionInfo";
import Tunnel from "./pages/Tunnel";
import About from "./pages/settings/About";
import Slides from "./pages/Slides";
import Scan from "./pages/Scan";
import TronFrozenBalance from "./pages/TronFrozenBalance";
import NFT from "./pages/NFT";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import selfStorage from "./utils/storage";

import i18n from "./locales/i18n"
import ExchangeWETH from "./pages/ExchangeWETH";
import TransferNFT from "./pages/TransferNFT";
import TunnelNFT from "./pages/TunnelNFT";


let element = require("./img/icon/element_selected.png")
let nft = require("./img/icon/NFT.png")
let epoch = require("./img/icon/epoch.png")
let setting = require("./img/icon/setting.png")



class App extends React.Component<any,any>{

    resetIcon = (v:any)=>{
        this.setState({selected:v})
        element = require("./img/icon/element.png")
        nft = require("./img/icon/NFT.png")
        epoch = require("./img/icon/epoch.png")
        setting = require("./img/icon/setting.png")
        if(v == "wallet"){
            element = require("./img/icon/element_selected.png")
        }else if(v == "nft"){
            nft = require("./img/icon/NFT_selected.png")
        }else if(v == "epoch"){
            epoch = require("./img/icon/epoch_selected.png")
        }else if(v == "settings"){
            setting = require("./img/icon/setting_selected.png")
        }
    }

    render() {
        return (
            <IonApp>
                <IonReactHashRouter>
                    {/*<IonRouterOutlet>*/}
                    {/*  <Switch>*/}
                    <Route path="/slide" component={Slides} exact={true}/>
                    <Route path="/tunnel-nft/:symbol/:chain/:tokenId" component={TunnelNFT} exact={true}/>
                    <Route path="/tunnel/:cy" component={Tunnel} exact={true}/>
                    <Route path="/manage/about" component={About} exact={true}/>
                    <Route path="/account/create" component={CreateAccount} exact={true}/>
                    <Route path="/account/backup" component={Backup} exact={true}/>
                    <Route path="/account/confirm" component={Confirm} exact={true}/>
                    <Route path="/account/import" component={ImportAccount} exact={true}/>
                    <Route path="/transfer/:cy/:chain/:to" component={Transfer} exact={true}/>
                    <Route path="/transfer/:cy/:chain" component={Transfer} exact={true}/>
                    <Route path="/transfer-nft/:category/:chain/:value" component={TransferNFT} exact={true}/>
                    <Route path="/account/receive/:address" component={Receive} exact={true}/>
                    <Route path="/transaction/list/:chain/:cy" component={TransactionList} exact={true}/>
                    <Route path="/transaction/info/:chain/:hash" component={TransactionInfo} exact={true}/>
                    <Route path="/scan" component={Scan} exact={true}/>
                    <Route path="/tron/frozen" component={TronFrozenBalance} exact={true}/>
                    <Route path="/swap/eth/:op" component={ExchangeWETH} exact={true}/>

                    <Route path="/" render={() => {
                        const viewedSlide = selfStorage.getItem('viewedSlide');
                        if (!viewedSlide) {
                            return <Redirect to="/slide"/>
                        }
                        const accountId = selfStorage.getItem('accountId');
                        if (!accountId || accountId === "undefined") {
                            return <Redirect to="/account/create"/>
                        }
                        return <Redirect to="/tabs/wallet"/>
                    }} exact={true}/>
                    {/*</Switch>*/}
                    <Route
                        path="/tabs"
                        render={() => (
                            <IonTabs onIonTabsDidChange={v=>{
                                this.resetIcon(v.detail.tab);
                            }}>
                                <IonRouterOutlet>
                                    <Route path="/tabs/wallet" component={Wallet} exact={true}/>
                                    <Route path="/tabs/epoch" component={Epoch} exact={true}/>
                                    <Route path="/tabs/settings" component={Settings} exact={true}/>
                                    <Route path="/tabs/nft" component={NFT} exact={true}/>
                                </IonRouterOutlet>
                                <IonTabBar mode="ios" slot="bottom" selectedTab="wallet" className="toolbar-cust">
                                    <IonTabButton tab="wallet" href="/tabs/wallet">
                                        <IonImg src={element}  className="toolbar-icon"/>
                                        <IonLabel className="text-small-x2">{i18n.t("wallet")}</IonLabel>
                                    </IonTabButton>
                                    <IonTabButton tab="nft" href="/tabs/nft">
                                        <IonImg src={nft} className="toolbar-icon"/>
                                        <IonLabel className="text-small-x2">{i18n.t("NFT")}</IonLabel>
                                    </IonTabButton>
                                    <IonTabButton tab="epoch" href="/tabs/epoch">
                                        <IonImg src={epoch} className="toolbar-icon"/>
                                        <IonLabel className="text-small-x2">{i18n.t("epoch")}</IonLabel>
                                    </IonTabButton>
                                    <IonTabButton tab="settings" href="/tabs/settings">
                                        <IonImg src={setting} className="toolbar-icon"/>
                                        <IonLabel className="text-small-x2">{i18n.t("settings")}</IonLabel>
                                    </IonTabButton>
                                </IonTabBar>
                            </IonTabs>
                        )}
                    />
                    {/*</IonRouterOutlet>*/}
                </IonReactHashRouter>
            </IonApp>
        );
    }
}

export default App;
