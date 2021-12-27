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

import axios from "axios";
import {
    CHAIN_PARAMS,
    CHAIN_PARAMS_BSC,
    CONTRACT_ADDRESS,
    EMIT_HOST,
    EPOCH_DEVICE_CATEGORY,
    EPOCH_WRAPPED_DEVICE_CATEGORY,
    META_TEMP
} from "../config"
import {AccountModel, ChainType, Meta, NftInfo, Transaction} from "../types";
import walletWorker from "../worker/walletWorker";
import selfStorage from "../utils/storage";
import tron from "./tron";
import Erc721 from "../contract/erc721/meta/eth";
import * as utils from "../utils"
import epochNameService from "../contract/epoch/sero/name";
import epochService from "../contract/epoch/sero/index";
import {DeviceInfo, WrappedDevice} from "../contract/epoch/sero/types";
import url from "../utils/url";
import epochRemainsService from "../contract/epoch/sero/remains";
import BigNumber from "bignumber.js";

class RPC {

    messageId: number;
    host: string;

    constructor(host: string) {
        this.messageId = 0;
        this.host = host;
    }

    req = async (url: string, data: any) => {
        const resp = await axios.post(this.host, data)
        return resp.data;
    }

    get = async (url:string) => {
        const resp = await axios.get(url);
        return resp.data
    }

    async post(method: any, params: any, chain: ChainType) {
        const data: any = {
            id: this.messageId++,
            jsonrpc: '2.0',
            method: method,
            params: params,
        };
        if (chain) {
            axios.defaults.headers.post['chain'] = chain;
        }
        return new Promise((resolve, reject) => {
            axios.post(this.host, data, {
                headers: {}
            }).then((resp: any) => {
                if (resp.data.error) {
                    reject(typeof resp.data.error === "string" ? resp.data.error : resp.data.error.message);
                } else {
                    resolve(resp.data.result);
                }
            }).catch((e: any) => {
                console.error("rpc post err: ", e)
                reject(e)
            })
        })
    }

    getTicket = async (chain: ChainType, address: string): Promise<any> => {
        const tKey = utils.ticketKey(chain);
        const item = selfStorage.getItem(tKey);
        // if (chain == ChainType.SERO) {
        //     this.getTicketSero(address).catch(e => {
        //         console.error("getTicketSero err:", e)
        //     })
        // } else if (chain == ChainType.ETH) {
        //     this.getTicketEth(address).catch(e => {
        //         console.error("getTicketEth err:", e)
        //     })
        // }
        return item
    }

    initNFT = async ()=>{
        console.log("init NFT...")
        const account = await walletWorker.accountInfo();
        const address = account && account.addresses[ChainType.SERO]
        if(address){
            // await rpc.getTicketSero(address)
            // await rpc.getTicketEth(account.addresses[ChainType.ETH])
            await rpc.getTicketBSC(account.addresses[ChainType.BSC])
        }
    }

    getTicketEth = async (owner: string) => {
        const tKey = utils.ticketKey(ChainType.ETH);
        const keys = Object.keys(CONTRACT_ADDRESS.ERC721);
        const ret: any = {}
        for (let symbol of keys) {
            if (!CONTRACT_ADDRESS.ERC721[symbol]["ADDRESS"]["ETH"]) {
                continue
            }
            const contractAddress =CONTRACT_ADDRESS.ERC721[symbol]["ADDRESS"]["ETH"];
            const contract: Erc721 = new Erc721(contractAddress, ChainType.ETH);
            const balance: number = await contract.balanceOf(owner)
            const category = await contract.symbol()
            if(contractAddress == CONTRACT_ADDRESS.ERC721.WRAPPED_DEVICES.ADDRESS.ETH){
                const tokenArr: Array<NftInfo> = [];
                console.log(balance,"ticketETH")
                for (let i = 0; i < balance; i++) {
                    const tokenId = await contract.tokenOfOwnerByIndex(owner, i)
                    const uri = await contract.tokenURI(tokenId)
                    console.log("ETH URI",uri)
                    if(uri){
                        const meta: any =JSON.parse(JSON.stringify(META_TEMP[symbol]));
                        const metadata:Meta = await rpc.get(`${uri}/all`)

                        const wrappedDevice = utils.metaAttributesToWrappedDevice(metadata.attributes);
                        const stylePath = utils.isDark(wrappedDevice.gene)?"dark":"light";
                        const mode = utils.calcStyle(wrappedDevice.gene)
                        meta.image = mode.style=="ax"?"":`./assets/img/epoch/remains/device/${stylePath}/${mode.style}.png`
                        meta.attributes =wrappedDevice;

                        tokenArr.push({
                            chain:ChainType.ETH,
                            symbol: symbol,
                            tokenId: tokenId,
                            meta: meta,
                            category:category
                        })
                    }
                }
                ret[category] = tokenArr
            }else{
                const tokenArr: Array<NftInfo> = [];
                for (let i = 0; i < balance; i++) {
                    const tokenId = await contract.tokenOfOwnerByIndex(owner, i)
                    // const uri = await contract.tokenURI(tokenId)
                    tokenArr.push({
                        chain:ChainType.ETH,
                        symbol: symbol,
                        tokenId: tokenId,
                        meta: META_TEMP[symbol],
                        category:category
                    })
                }
                ret[category] = tokenArr
            }
        }
        selfStorage.setItem(tKey, ret)
    }

    getTicketBSC = async (owner: string) => {
        const tKey = utils.ticketKey(ChainType.BSC);
        const keys = Object.keys(CONTRACT_ADDRESS.ERC721);
        const ret: any = {}
        for (let symbol of keys) {
            if (!CONTRACT_ADDRESS.ERC721[symbol]["ADDRESS"]["BSC"]) {
                continue
            }
            const contractAddress = CONTRACT_ADDRESS.ERC721[symbol]["ADDRESS"]["BSC"];
            const contract: Erc721 = new Erc721(contractAddress, ChainType.BSC);
            const balance: number = await contract.balanceOf(owner)
            const category = await contract.symbol()

            const tokenArr: Array<NftInfo> = [];
            console.log(balance,"ticketBSC")
            for (let i = 0; i < balance; i++) {
                const tokenId = await contract.tokenOfOwnerByIndex(owner, i)
                const uri = await contract.tokenURI(tokenId)
                const meta: any =JSON.parse(JSON.stringify(META_TEMP[symbol]));
                if(uri){
                    const metadata:Meta = await rpc.get(`${uri}/all`)
                    if(contractAddress == CONTRACT_ADDRESS.ERC721.WRAPPED_DEVICES.ADDRESS.BSC){
                        const wrappedDevice = utils.metaAttributesToWrappedDevice(metadata.attributes);
                        const stylePath = utils.isDark(wrappedDevice.gene)?"dark":"light";
                        const mode = utils.calcStyle(wrappedDevice.gene)
                        meta.image = mode.style=="ax"?"":`./assets/img/epoch/remains/device/${stylePath}/${mode.style}.png`
                        meta.attributes =wrappedDevice;
                    }
                }
                tokenArr.push({
                    chain:ChainType.BSC,
                    symbol: symbol,
                    tokenId: tokenId,
                    meta: meta,
                    category:category
                })
            }
            ret[category] = tokenArr

        }
        selfStorage.setItem(tKey, ret)
    }

    getTicketSero = async (address: string) => {
        const tKey = utils.ticketKey(ChainType.SERO);
        const erc721Keys = Object.keys(CONTRACT_ADDRESS.ERC721);
        const defaultSymbolMap: Map<string, string> = new Map<string, string>()
        for (let k of erc721Keys) {
            if (META_TEMP[k]) {
                defaultSymbolMap.set(CONTRACT_ADDRESS.ERC721[k]["SYMBOL"]["SERO"], k)
            }
        }
        const ret: any = {}
        const seroData: any = await this.post(["sero", "getTicket"].join("_"), [address], ChainType.SERO);
        const keys = Object.keys(seroData)
        for (let category of keys) {
            const tokenIds = seroData[category];
            if (tokenIds && tokenIds.length > 0) {
                const tokenArr: Array<any> = [];
                for (let tokenId of tokenIds) {
                    // const uri = await contract.tokenURI(d)
                    // @ts-ignore
                    const symbol:any = defaultSymbolMap.get(category);
                    const meta: any =JSON.parse(JSON.stringify(META_TEMP[symbol]));
                    if (EPOCH_DEVICE_CATEGORY.indexOf(category) > -1) {
                        meta.alis = await epochNameService.getDeviceName(tokenId)
                        const deviceInfo = await epochService.axInfo(category, tokenId, "")
                        const device:DeviceInfo = {
                            category: deviceInfo.category,
                            ticket: deviceInfo.ticket,
                            base: deviceInfo.base,
                            capacity: deviceInfo.capacity,
                            power: deviceInfo.power,
                            rate: deviceInfo.rate,
                            gene: deviceInfo.gene,
                            last: deviceInfo.last,
                        }

                        device.mode = utils.calcStyle(deviceInfo.gene)
                        device.alis = meta.alis;
                        meta.image = `./assets/img/epoch/device/${device.mode.style}.png`
                        meta.attributes = device;
                    }else if(EPOCH_WRAPPED_DEVICE_CATEGORY.indexOf(category) > -1 ){
                        // const ax = await walletWorker.accountInfo();
                        const wrappedDevice = await epochRemainsService.wrappedDevice(tokenId,"");
                        if(!wrappedDevice || !wrappedDevice.category){
                            continue
                        }
                        meta.alis = wrappedDevice.name;
                        const stylePath = utils.isDark(wrappedDevice.gene)?"dark":"light";
                        const mode = utils.calcStyle(wrappedDevice.gene)
                        meta.image = mode.style=="ax"?"":`./assets/img/epoch/remains/device/${stylePath}/${mode.style}.png`
                        const attr:WrappedDevice = {
                            base:wrappedDevice.base,
                            capacity:wrappedDevice.capacity,
                            category:wrappedDevice.category,
                            current:wrappedDevice.current,
                            freezeFee:wrappedDevice.freezeFee,
                            freezeStartPeriod:wrappedDevice.freezeStartPeriod,
                            gene:wrappedDevice.gene,
                            name:wrappedDevice.name,
                            power:wrappedDevice.power,
                            rate:wrappedDevice.rate,
                            ticket:wrappedDevice.ticket,
                            srcTkt:wrappedDevice.srcTkt
                        }
                        meta.attributes = attr;
                    }
                    const token = {
                        chain:ChainType.SERO,
                        symbol: symbol,
                        tokenId: tokenId,
                        meta: meta,
                        category:category
                    }
                    tokenArr.push(token)
                }
                selfStorage.setItem(utils.ticketArrKey(ChainType.SERO),tokenIds)
                ret[category] = tokenArr
            }
        }

        selfStorage.setItem(tKey, ret)
    }

    getBalance = async (chain: ChainType, address: string, localOnly?: boolean) => {
        const key = ["balance", chain].join("_");
        let rest: any = selfStorage.getItem(key);
        if (!rest) {
            return await this.getBalanceFromServer(address,chain)
        } else {
            // if (!localOnly) {
            //     this.getBalanceFromServer(address,chain).catch(e=>{
            //         console.error(e)
            //     })
            // }
        }
        return rest;
    }

    getBalanceFromServer = async (address:string,chain:ChainType)=>{
        const prefix = utils.getPrefix(chain)
        const key = ["balance", chain].join("_");
        if (chain == ChainType.TRON) {
            const balance = await tron.getBalance(address);
            selfStorage.setItem(key, balance);
            return balance
        } else {
            const balance = await this.post([prefix, "getBalance"].join("_"), [address], chain)
            selfStorage.setItem(key, balance);
            return balance
        }
    }

    initBalance = async ()=>{
        console.log("initBalance...");
        const account = await walletWorker.accountInfo();
        const pArr = [];
        const keys = Object.keys(ChainType)
        for (let key of keys) {
            if (isNaN(Number(key))) {
                const chain:any = utils.getChainIdByName(key);
                if(account.addresses[chain] && key != "_"){
                    const rq = this.getBalanceFromServer(account.addresses[chain],chain);
                    pArr.push(rq)
                }
            }
        }
        await Promise.all(pArr)
    }

    getTransactions = async (chain: ChainType, address: string, cy: string, hash: string, pageSize: number, pageNo: number, fingerprint?: string) => {
        let prefix = utils.getPrefix(chain)
        const rest: any = await this.post([prefix, "getTransactions"].join("_"), [address, cy, hash, pageSize, pageNo, fingerprint], chain)
        return rest;
    }

    getTxInfo = async (chain: ChainType, txHash: string) => {
        const prefix = utils.getPrefix(chain)
        const rest: any = await this.post([prefix, "getTxInfo"].join("_"), [txHash], chain)
        return rest;
    }

    getEvents = async (chain: ChainType, txHash: string, depositNonce: string, originChainID: string, resourceID: string) => {
        const prefix = utils.getPrefix(chain)
        const rest: any = await this.post([prefix, "getEvents"].join("_"), [txHash, depositNonce, originChainID, resourceID], chain)
        return rest;
    }

    getChainConfig = async (chain: ChainType) =>{
        const prefix = utils.getPrefix(chain)
        const rest: any = await this.post([prefix, "getChainConfig"].join("_"), [], chain)
        return rest;
    }

    commitTx = async (tx: Transaction, password: string) => {
        //FOR Test
        const accountId: string | null = selfStorage.getItem("accountId");
        if (accountId) {
            const ret = await walletWorker.isLocked();
            if(ret){
                url.accountUnlock();
                return
            }

            let hash: any = "";
            if (tx.chain == ChainType.SERO) {
                //gen tx params
                const txParams: any = await this.post("sero_genParams", [tx], tx.chain);
                //sign
                const signSeroRet: any = await walletWorker.signTx(accountId, password, ChainType.SERO, txParams)
                //commitTx
                await this.post("sero_commitTx", [signSeroRet, tx], tx.chain)
                hash = signSeroRet.Hash;

            } else if (tx.chain == ChainType.ETH) {
                //sign
                // tx.chainId = 1337;
                if (!tx.nonce) {
                    // @ts-ignore
                    tx.nonce = await this.post("eth_getTransactionCount", [tx.from, "pending"], tx.chain);
                }
                const signEthRet = await walletWorker.signTx(accountId, password, ChainType.ETH, tx, CHAIN_PARAMS)
                //commitTx
                hash = await this.post("eth_commitTx", ["0x" + signEthRet, tx], tx.chain)
            } else if (tx.chain == ChainType.BSC) {
                //sign
                // tx.chainId = 1337;
                if (!tx.nonce) {
                    // @ts-ignore
                    tx.nonce = await this.post("eth_getTransactionCount", [tx.from, "pending"], tx.chain);
                }
                const signEthRet = await walletWorker.signTx(accountId, password, ChainType.ETH, tx, CHAIN_PARAMS_BSC)
                //commitTx
                hash = await this.post("eth_commitTx", ["0x" + signEthRet, tx], tx.chain)
            } else if (tx.chain == ChainType.TRON) {
                const signEthRet = await walletWorker.signTx(accountId, password, ChainType.TRON, tx.data)
                const rest: any = await this.post("tron_commitTx", [signEthRet, tx], tx.chain)
                hash = rest.txid;
            }
            return Promise.resolve(hash);
        } else {
            return Promise.reject("Account not exist!")
        }
    }

    getTransactionByHash = async (txHash: string, chain: ChainType) => {
        return await rpc.post(chain == ChainType.SERO ? "sero_getTransactionByHash" : "eth_getTransactionByHash", [txHash], chain);
    }

}

const rpc = new RPC(EMIT_HOST)

export default rpc