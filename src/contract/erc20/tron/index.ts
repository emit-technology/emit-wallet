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
import {Erc20, ABI} from "../index";
import BigNumber from "bignumber.js";
import tron from "../../../rpc/tron";

class Tron implements Erc20 {

    address:string = ""

    constructor(address: string) {
        this.address = address;
    }

    contract = async ():Promise<any>=>{
        return await tron.tronWeb.contract().at(this.address)
    }

    allowance = async (owner: string, spender: string): Promise<string> => {
        const contract = await this.contract();
        const rest =  await contract.allowance(owner,spender).call()
        return rest.remaining.toNumber()
    }

    approve = async (spender: string, value: BigNumber, from?:string): Promise<any> => {
        const parameter = [{type:'address',value:tron.tronWeb.address.toHex(spender)},{type:'uint256',value:value.toNumber()}]
        const transaction = await tron.tronWeb.transactionBuilder.triggerSmartContract(this.address, "approve(address,uint256)", {},
            parameter,tron.tronWeb.address.toHex(from));
        if(transaction.result.result){
            return Promise.resolve(transaction.transaction);
        }
        return Promise.reject("gen transaction obj failed");
    }

    balanceOf = async (who: string): Promise<number> =>{
        const contract = await this.contract();
        return await contract.balanceOf(who).call()
    }

    totalSupply = async (): Promise<number> => {
        const contract = await this.contract();
        return await contract.totalSupply().call()
    }

    transfer = async (to: string, value: BigNumber,from?:string): Promise<any> =>{
        const parameter = [{type:'address',value:tron.tronWeb.address.toHex(to)},{type:'uint256',value:value.toNumber()}]
        const transaction = await tron.tronWeb.transactionBuilder.triggerSmartContract(this.address, "transfer(address,uint256)", {},
            parameter,tron.tronWeb.address.toHex(from));
        if(transaction.result.result){
            return Promise.resolve(transaction.transaction);
        }
        return Promise.reject("gen transaction obj failed");
    }

    //not invoke
    transferFrom = async (from: string, to: string, value: BigNumber): Promise<any> =>{
        const parameter = [
            {type:'address',value:tron.tronWeb.address.toHex(from)},
            {type:'address',value:tron.tronWeb.address.toHex(to)},
            {type:'uint256',value:value.toNumber()}
        ]
        const transaction = await tron.tronWeb.transactionBuilder.triggerSmartContract(this.address, "transferFrom(address,address,uint256)", {},
            parameter,tron.tronWeb.address.toHex(from));
        if(transaction.result.result){
            return Promise.resolve(transaction.transaction);
        }
        return Promise.reject("gen transaction obj failed");
    }

}

export default Tron