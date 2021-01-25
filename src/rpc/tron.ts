import {TRON_API_HOST,CONTRACT_ADDRESS} from "../config";
import BigNumber from "bignumber.js";

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

const TronWeb = require('tronweb')


class Tron{

    tronWeb:any;

    constructor() {
        const HttpProvider = TronWeb.providers.HttpProvider;
        const fullNode = new HttpProvider(TRON_API_HOST.fullNode);
        const solidityNode = new HttpProvider(TRON_API_HOST.fullNode);
        const eventServer = new HttpProvider(TRON_API_HOST.fullNode);
        const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,"67cf7062cc23b5165d5b47578e2afcfab8eeb3e906d92fc5ea7ea816e7b51831");
        this.tronWeb = tronWeb;
    }

    transfer = async (to:string,value:number,from:string)=>{
        return await this.tronWeb.transactionBuilder.sendTrx(to,value,from);
    }

    getTxInfo = async (txId:string):Promise<any>=>{
        const record:any = {};
        const tx = await this.tronWeb.trx.getTransaction(txId)
        console.log("tx>>",tx)
        // const info = await this.tronWeb.trx.getTransactionInfo(txId)
        const c = tx.raw_data.contract[0];
        if("TransferContract" == c.type){
            record.from  = c.parameter.value.owner_address;
            record.to = c.parameter.value.to_address;
            record.value =  c.parameter.value.amount;
        }else if("TransferAssetContract" == c.type){
            record.from = c.parameter.value.owner_address;
            record.to = c.parameter.value.to_address;
            record.value =  c.parameter.value.amount;
            //Currency
        }else if("CreateSmartContract" == c.type){
        }else if("TriggerSmartContract" == c.type){
            record.from = c.parameter.value.owner_address;
            record.to = c.parameter.value.contract_address;
            record.value = "0x0";
        }
        record.from = this.tronWeb.address.fromHex(record.from);
        record.to = this.tronWeb.address.fromHex(record.to);
        return record;
    }

    getBalance = async (address:string)=>{
        const rest:any = await this.tronWeb.trx.getAccount(address);
        console.log("TRX balance: ",rest)
        const balance:any = {};
        balance["TRX"] = rest.balance;
        let instance = await this.tronWeb.contract().at(CONTRACT_ADDRESS.ERC20.TRON.USDT);
        let balanceUSDT = await instance.balanceOf(address).call();
        balance["USDT"] = new BigNumber(balanceUSDT._hex).toString(10);
        return Promise.resolve(balance);
    }

}
const tron = new Tron();
export default tron