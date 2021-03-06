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
import * as config from "../config"
import {CHAIN_PARAMS, EMIT_HOST, CONTRACT_ADDRESS} from "../config"
import {ChainType, Transaction} from "../types";
import walletWorker from "../worker/walletWorker";
import selfStorage from "../utils/storage";
import Tron from "../contract/erc20/tron";
import BigNumber from "bignumber.js";
import tron from "./tron";
import Erc721 from "../contract/erc721/meta/eth";
import Src721 from "../contract/erc721/meta/sero";

class RPC {

    messageId: number;
    host: string;

    constructor(host: string) {
        this.messageId = 0;
        this.host = host;
    }

    req = async (url:string,data:any)=>{
        const resp = await axios.post(this.host, data)
        return resp.data;
    }

    async post(method: any, params: any) {
        const data: any = {
            id: this.messageId++,
            jsonrpc: '2.0',
            method: method,
            params: params,
        };
        return new Promise((resolve, reject) => {
            axios.post(this.host, data).then((resp: any) => {
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
        const tKey = ["ticket", chain].join("_");
        const item = selfStorage.getItem(tKey);
        if (chain == ChainType.SERO) {
            this.getTicketSero(address).catch(e=>{
                console.error("getTicketSero err:",e)
            })
        }else if (chain == ChainType.ETH) {
            this.getTicketEth(address).catch(e=>{
                console.error("getTicketEth err:",e)
            })
        }
        return item
    }

    getTicketEth = async (address:string)=>{
        const tKey = ["ticket", ChainType.ETH].join("_");
        const keys = Object.keys(CONTRACT_ADDRESS.ERC721);
        const ret:any = {}
        for (let key of keys) {
            const contract: Erc721 = new Erc721(CONTRACT_ADDRESS.ERC721[key]["ADDRESS"]["ETH"]);
            const balance: number = await contract.balanceOf(address)
            const symbol = await contract.symbol()
            const tokenArr: Array<any> = [];
            for (let i = 0; i < balance; i++) {
                const tokenId = await contract.tokenOfOwnerByIndex(address, i)
                const uri = await contract.tokenURI(tokenId)
                tokenArr.push({
                    tokenId: tokenId,
                    uri: uri
                })
            }
            ret[symbol]=tokenArr
        }
        selfStorage.setItem(tKey,ret)
    }

    getTicketSero = async (address:string)=>{
        const tKey = ["ticket", ChainType.SERO].join("_");
        const keys = Object.keys(CONTRACT_ADDRESS.ERC721);
        const ret:any = {}
        const seroData:any = await this.post(["sero", "getTicket"].join("_"), [address]);
        for (let key of keys) {
            const contract: Src721 = new Src721(CONTRACT_ADDRESS.ERC721[key]["ADDRESS"]["SERO"]);
            const rest = await contract.symbol()
            const symbol = rest[0]
            console.log("symbol>>",symbol)
            // if(CONTRACT_ADDRESS.ERC721[key]["SYMBOL"]["SERO"] == symbol){
            //
            // }
            const balance = seroData[symbol];
            if(balance && balance.length>0){
                const tokenArr: Array<any> = [];
                for (let d of balance) {
                    const uri = await contract.tokenURI(d)
                    tokenArr.push({
                        tokenId: d,
                        uri: uri
                    })
                }
                ret[symbol]=tokenArr
            }
        }
        selfStorage.setItem(tKey,ret)
    }

    getBalance = async (chain: ChainType, address: string, localOnly?: boolean) => {
        const key = ["balance", chain].join("_");
        let rest: any = selfStorage.getItem(key);
        if (!rest) {
            rest = await this.post([ChainType[chain].toLowerCase(), "getBalance"].join("_"), [address])
            selfStorage.setItem(key, rest);
        } else {
            if (!localOnly) {
                if (chain == ChainType.TRON) {
                    tron.getBalance(address).then((balance: any) => {
                        selfStorage.setItem(key, balance);
                    })
                } else {
                    this.post([ChainType[chain].toLowerCase(), "getBalance"].join("_"), [address]).then(balance => {
                        selfStorage.setItem(key, balance);
                    })
                }
            }
        }
        return rest;
    }

    getTransactions = async (chain: ChainType, address: string, cy: string, hash: string, pageSize: number, pageNo: number, fingerprint?: string) => {
        const rest: any = await this.post([ChainType[chain].toLowerCase(), "getTransactions"].join("_"), [address, cy, hash, pageSize, pageNo, fingerprint])
        return rest;
    }

    getTxInfo = async (chain: ChainType, txHash: string) => {
        const rest: any = await this.post([ChainType[chain].toLowerCase(), "getTxInfo"].join("_"), [txHash])
        return rest;
    }

    getEvents = async (chain: ChainType, txHash: string, depositNonce: string, originChainID: string, resourceID: string) => {
        const rest: any = await this.post([ChainType[chain].toLowerCase(), "getEvents"].join("_"), [txHash, depositNonce, originChainID, resourceID])
        return rest;
    }

    commitTx = async (tx: Transaction, password: string) => {
        const accountId: string | null = selfStorage.getItem("accountId");
        if (accountId) {
            let hash: any = "";
            if (tx.chain == ChainType.SERO) {
                //gen tx params
                const txParams: any = await this.post("sero_genParams", [tx]);
                //sign
                const signSeroRet: any = await walletWorker.signTx(accountId, password, ChainType.SERO, txParams)
                //commitTx
                await this.post("sero_commitTx", [signSeroRet, tx])
                hash = signSeroRet.Hash;

            } else if (tx.chain == ChainType.ETH) {
                //sign
                // tx.chainId = 1337;
                if (!tx.nonce) {
                    // @ts-ignore
                    tx.nonce = await this.post("eth_getTransactionCount", [tx.from, "pending"]);
                }
                const signEthRet = await walletWorker.signTx(accountId, password, ChainType.ETH, tx, CHAIN_PARAMS)
                //commitTx
                hash = await this.post("eth_commitTx", ["0x" + signEthRet, tx])
            } else if (tx.chain == ChainType.TRON) {
                const signEthRet = await walletWorker.signTx(accountId, password, ChainType.TRON, tx.data)
                const rest: any = await this.post("tron_commitTx", [signEthRet, tx])
                hash = rest.txid;
            }
            return Promise.resolve(hash);
        } else {
            return Promise.reject("Account not exist!")
        }
    }
}

const rpc = new RPC(EMIT_HOST)

export default rpc