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
import {CHAIN_PARAMS, EMIT_HOST} from "../config"
import {ChainType, Transaction} from "../types";
import walletWorker from "../worker/walletWorker";
import selfStorage from "../utils/storage";
import Tron from "../contract/erc20/tron";
import BigNumber from "bignumber.js";
import tron from "./tron";

class RPC {

    messageId: number;
    host: string;

    constructor(host: string) {
        this.messageId = 0;
        this.host = host;
    }

    async post(method: any, params: any) {
        const data: any = {
            id: this.messageId++,
            jsonrpc: '2.0',
            method: method,
            params: params,
        };
        console.log(data,"post")
        return new Promise((resolve, reject) => {
            axios.post(this.host, data).then((resp: any) => {
                if (resp.data.error) {
                    reject(typeof resp.data.error === "string"?resp.data.error:resp.data.error.message);
                } else {
                    resolve(resp.data.result);
                }
            }).catch((e: any) => {
                console.log("rpc post err: ",e)
                reject(e)
            })
        })
    }

    getBalance = async (chain: ChainType, address: string,cy?:string) => {
        const key = ["balance",chain].join("_");
        let rest: any = selfStorage.getItem(key);
        if(!rest){
            rest = await this.post([ChainType[chain].toLowerCase(), "getBalance"].join("_"), [address])
            selfStorage.setItem(key,rest);
        }else{

            if(chain == ChainType.TRON){
                tron.getBalance(address).then((balance:any)=>{
                    selfStorage.setItem(key,balance);
                });
            }else {
                this.post([ChainType[chain].toLowerCase(), "getBalance"].join("_"), [address]).then(balance=>{
                    selfStorage.setItem(key,balance);
                })
            }
        }
        return rest;
    }

    getTransactions = async (chain: ChainType, address: string,cy:string,hash:string,pageSize:number,pageNo:number) =>{
        const rest: any = await this.post([ChainType[chain].toLowerCase(), "getTransactions"].join("_"), [address,cy,hash,pageSize,pageNo])
        return rest;
    }

    getTxInfo = async (chain: ChainType, txHash:string) =>{
        const rest: any = await this.post([ChainType[chain].toLowerCase(), "getTxInfo"].join("_"), [txHash])
        return rest;
    }

    getEvents = async (chain: ChainType,txHash:string,depositNonce:string) =>{
        const rest: any = await this.post([ChainType[chain].toLowerCase(), "getEvents"].join("_"), [txHash,depositNonce])
        return rest;
    }

    commitTx = async (tx: Transaction,password:string) => {
        const accountId:string|null = selfStorage.getItem("accountId");
        if(accountId){
            console.log(tx,"commitTx")
            let hash:any = "" ;
            console.log(tx.chain == ChainType.SERO, tx.chain == ChainType.ETH)
            if(tx.chain == ChainType.SERO){
                //gen tx params
                const txParams: any = await this.post("sero_genParams", [tx]);
                console.log(txParams,"txParams");
                //sign
                const signSeroRet:any = await walletWorker.signTx(accountId,password,ChainType.SERO, txParams)
                console.log(signSeroRet,"signSeroRet");
                //commitTx
                await this.post("sero_commitTx",[signSeroRet,tx])
                hash = signSeroRet.Hash;

            }else if(tx.chain == ChainType.ETH){
                //sign
                // tx.chainId = 1337;
                if(!tx.nonce){
                    // @ts-ignore
                    tx.nonce = await this.post("eth_getTransactionCount",[tx.from,"pending"]);
                }
                console.log("eth commit tx>>>",tx)
                const signEthRet = await walletWorker.signTx(accountId,password,ChainType.ETH, tx,CHAIN_PARAMS)
                console.log(signEthRet,"signEthRet>>")
                //commitTx
                hash = await this.post("eth_commitTx",["0x"+signEthRet,tx])
            }else if(tx.chain == ChainType.TRON){
                const signEthRet = await walletWorker.signTx(accountId,password,ChainType.TRON, tx.data)
                const rest:any = await this.post("tron_commitTx",[signEthRet,tx])
                hash = rest.transaction.txID;
            }
            return Promise.resolve(hash);
        }else{
            return Promise.reject("Account not exist!")
        }
    }
}

const rpc = new RPC(EMIT_HOST)

export default rpc