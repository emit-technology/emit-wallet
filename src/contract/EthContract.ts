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

import rpc from "../rpc";

import {EMIT_HOST} from "../config"
import {ChainType} from "../types";
const Contract = require('web3-eth-contract');

class EthContract{

    contract:any;
    abi:any;
    chain:ChainType
    address:string

    constructor(address:string,abi:any,chain:ChainType) {
        this.address = address;
        this.abi = abi;
        Contract.setProvider([EMIT_HOST,"?chain=",chain].join(""));
        this.contract = new Contract(abi,address);
        this.chain = chain;
    }

    estimateGas = async (params:any):Promise<any>=>{
        return await rpc.post("eth_estimateGas",[params],this.chain)
    }

    // call = async (data:any,from?:string):Promise<any>=>{
    //     console.log("this.contract.address:::",this.address)
    //     return await rpc.post("eth_call",[{
    //         from:from,
    //         data:data,
    //         to:this.address,
    //     },"latest"],this.chain)
    // }


}
export default EthContract;