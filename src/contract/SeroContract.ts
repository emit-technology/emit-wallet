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
const serojs = require('serojs');

class SeroContract{

    contract:any = {};

    constructor(address:string,abi:any) {
        this.contract = serojs.callContract(abi, address)
    }

    async call(method: string, args: Array<any>, from: string): Promise<any> {
        const packData: any = this.contract.packData(method, args, true)
        const contract = this.contract;
        return new Promise((resolve, reject) => {
            const params: any = {}
            params.to = this.contract.address;
            if(from){
                params.from = from
            }
            params.data = packData;
            rpc.post("sero_call",[params,"latest"]).then(data=>{
                if(data !="0x"){
                    const rest: any = contract.unPackDataEx(method, data)
                    resolve(rest)
                }else{
                    resolve("0x0")
                }
            }).catch(err=>{
                reject(err)
            })
        })
    }

    estimateGas = async (params:any):Promise<any> =>{
        return await rpc.post("sero_estimateGas",[params]);
    }

}

export default SeroContract