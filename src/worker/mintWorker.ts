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

import {MinerScenes, MintData} from "../pages/epoch/miner";
import altarService from 'walletService/src/mint/altar/index';
import chaosService from 'walletService/src/mint/chaos/index';

class MintWorker {

    service:any;

    constructor(scenes:MinerScenes) {
        if(scenes == MinerScenes.altar){
            this.service = altarService
        }else if(scenes == MinerScenes.chaos){
            this.service = chaosService
        }
    }

    /**
     * accountScenes: string， uKey
     scenes:string
     phash: string
     address: string
     index: string
     accountId: string
     * @param data
     */
    async mintStart(data:any) {
        return new Promise((resolve, reject)=>{
            this.service.mintStart(data, function (data: any) {
                if(data.error){
                    reject(data.error);
                }else{
                    resolve(data.result);
                }
            })
        })
    }

    async mintState(uKey:any):Promise<MintData> {
        return new Promise((resolve, reject)=>{
            this.service.mintState(uKey, function (data: any) {
                if(data.error){
                    reject(data.error);
                }else{
                    resolve(data.result);
                }
            })
        })
    }

    async mintStop(uKey:any) {
        return new Promise((resolve, reject)=>{
            this.service.mintStop(uKey, function (data: any) {
                if(data.error){
                    reject(data.error);
                }else{
                    resolve(data.result);
                }
            })
        })
    }
}

// const chaosMiner = new MintWorker();
export default MintWorker