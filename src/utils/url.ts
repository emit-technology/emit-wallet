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

import {ChainType} from "../types";
import {MinerScenes} from "../pages/epoch/miner";
import walletWorker from "../worker/walletWorker";

class Url {
    private base = "#"

    private account = {
        create: "account/create",
        confirm: "account/confirm",
        backup: "account/backup",
        import: "account/import",
        export: "account/export",
        receive: "account/receive",
        unlock: "account/unlock"
    }

    private transaction = {
        tunnel:"tunnel",
        tunnelNFT:"tunnel-nft",
        transfer: "transfer",
        transferNft: "transfer-nft",
        list: "transaction/list",
        info: "transaction/info",
    }

    private settings = {
        setting: "tabs/settings",
        about:"manage/about",
    }

    private epoch = {
        index : "tabs/epoch",
        altar : "epoch/altar",
        chaos : "epoch/chaos",
        deviceRank : "epoch/device/rank",
        driverRank : "epoch/driver/rank",
        poolHashRate: "epoch/pool/hashrate",
        poolInfo: "epoch/pool/info",
        freeze: "epoch/freeze",
        unfreeze: "epoch/unfreeze",
    }
    private browserBase = "browser"

    private chartBase = "chart"

    private nftTabs = "tabs/nft"

    private scan = "scan";

    private swapWEth = "swap/eth";

    private exchange = {
        market:"trade/market",
        swap:"trade/swap",
        marketSearch:"trade/market/search",
        marketStatics: "trade/market/statics"
    }

    constructor() {
    }

    path_settings = () => {
        return [this.base, this.settings.setting].join("/")
    }
    /**
     * go to page
     * @param path
     * @param delay seconds
     */
    goTo(path: string, pre: string, delay?: number) {
        const data: any = sessionStorage.getItem("history");
        if (pre) {
            const pathArr = data && JSON.parse(data);
            if (pathArr && pathArr.length > 0) {
                pathArr.push(pre);
                sessionStorage.setItem("history", JSON.stringify(pathArr))
            } else {
                sessionStorage.setItem("history", JSON.stringify([pre]))
            }
        }
        if (delay) {
            setTimeout(() => {
                window.location.href = path
                // window.location.reload();
            })
            return
        }
        window.location.href = path
        // window.location.reload();
        return;
    }

    back() {
        const data: any = sessionStorage.getItem("history");
        const pathArr = data && JSON.parse(data)
        if (pathArr && pathArr.length > 0) {
            const pre = pathArr.pop();
            sessionStorage.setItem("history", JSON.stringify(pathArr));
            window.location.href = pre;
            // window.location.reload();
        } else {
            this.home();
        }
    }


    home() {
        this.goTo(this.base, "/#/");
        return
    }

    accountCreate(pre?:string) {
        this.goTo([this.base, this.account.create].join("/"), pre?pre:"");
    }

    accountBackup(pre?: string) {
        this.goTo([this.base, this.account.backup].join("/"), pre ? pre : [this.base, this.account.create].join("/"));
    }

    accountConfirm() {
        this.goTo([this.base, this.account.confirm].join("/"), [this.base, this.account.backup].join("/"));
    }

    accountImport() {
        this.goTo([this.base, this.account.import].join("/"), [this.base, this.account.create].join("/"));
    }

    accountExport() {
        this.goTo([this.base, this.account.export].join("/"), [this.base, this.settings].join("/"));
    }

    accountUnlock() {
        if (process.env.NODE_ENV == "development"){
            walletWorker.unlockWallet("12345678")
        }else{
            this.goTo([this.base, this.account.unlock].join("/"), "");
        }
    }

    receive(address: string,chain:ChainType) {
        this.goTo([this.base, this.account.receive, address,chain].join("/"), window.location.hash)
    }

    transfer(cy: string, chain: string,to?:string) {
        const hash = window.location.hash
        to ?this.goTo([this.base, this.transaction.transfer, cy, chain,to].join("/"), hash):
            this.goTo([this.base, this.transaction.transfer, cy, chain].join("/"), hash)
        return
    }

    transferNFT(category: string, chain: ChainType,value:string) {
        this.goTo([this.base, this.transaction.transferNft, category, ChainType[chain],value].join("/"), [this.base,this.nftTabs].join("/"))
    }

    tunnel(cy: string, chain1: string, chain2: string) {
        this.goTo([this.base, this.transaction.tunnel, cy, chain1, chain2].join("/"), [this.base].join("/"));
        return
    }

    tunnelNFT(symbol: string,chain:string,tokenId:string,toChain:string) {
        this.goTo([this.base, this.transaction.tunnelNFT, symbol,chain,tokenId,toChain].join("/"), [this.base,this.nftTabs].join("/"))
        return
    }

    transactionList(cy: string, chainName: string) {
        this.goTo([this.base, this.transaction.list, chainName, cy].join("/"), [this.base].join("/"));
        return
    }

    transactionInfo(chain: ChainType, hash: string, cy: string,pre?:string) {
        this.goTo([this.base, this.transaction.info, chain, hash].join("/"),pre?pre: [this.base, this.transaction.list, ChainType[chain], cy].join("/"));
        return
    }

    aboutUs(){
        this.goTo([this.base,this.settings.about].join("/"),this.path_settings());
        return
    }

    qrScan(pre:string){
        this.goTo([this.base,this.scan].join("/"),[this.base].join("/"));
        return
    }

    swapEth(op:string){
        this.goTo([this.base,this.swapWEth,op].join("/"),[this.base].join("/"))
        return
    }

    frozenTronBalance(){
        this.goTo([this.base,"tron/frozen"].join("/"),[this.base].join("/"))
        return
    }

    epochAltar(){
        this.goTo([this.base,this.epoch.altar].join("/"),[this.base,this.epoch.index].join("/"))
        return
    }

    epochChaos(){
        this.goTo([this.base,this.epoch.chaos].join("/"),[this.base,this.epoch.index].join("/"))
    }

    epochDeviceRank(){
        this.goTo([this.base,this.epoch.deviceRank].join("/"),[this.base,this.epoch.index].join("/"))
    }

    epochDriverRank(scenes:MinerScenes){
        this.goTo([this.base,this.epoch.driverRank,scenes].join("/"),[this.base,this.epoch.index].join("/"))
    }

    browser(url:string){
        this.goTo([this.base,this.browserBase,encodeURIComponent(url)].join("/"),window.location.hash)
    }

    chart(symbol:string){
        this.goTo([this.base,this.chartBase,symbol].join("/"),window.location.hash)
    }

    poolHashRate(){
        this.goTo([this.base,this.epoch.poolHashRate].join("/"),window.location.hash)
    }

    poolInfo(id:any){
        this.goTo([this.base,this.epoch.poolInfo,id].join("/"),window.location.hash)
    }

    tradeNftMarket = (ticket?:string) => {
        this.goTo([this.base,this.exchange.market,ticket?ticket:""].join("/"),[this.base,"tabs/trade"].join("/"));
    }

    tradeTokenSwap = () => {
        this.goTo([this.base,this.exchange.swap].join("/"),window.location.hash);
    }

    epochFreeze =(tkt:string,category:string)=>{
        this.goTo([this.base,this.epoch.freeze,tkt,category].join("/"),window.location.hash);
    }

    epochUnFreeze =(tkt:string,category:string)=>{
        this.goTo([this.base,this.epoch.unfreeze,tkt,category].join("/"),window.location.hash);
    }

    tradeMarketSearch = ()=>{
        this.goTo([this.base,this.exchange.marketSearch].join("/"),[this.base,this.exchange.market].join("/"))
    }
    tradeMarketStatics = ()=>{
        this.goTo([this.base,this.exchange.marketStatics].join("/"),[this.base,this.exchange.market].join("/"))
    }

}

const url = new Url();
export default url;