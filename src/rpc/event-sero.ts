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
import {CHAIN_PARAMS, CHAIN_PARAMS_BSC, CONTRACT_ADDRESS, EMIT_HOST, EVENT_HOST_SERO} from "../config"
import {ChainType, Transaction} from "../types";
import walletWorker from "../worker/walletWorker";
import selfStorage from "../utils/storage";
import tron from "./tron";
import Erc721 from "../contract/erc721/meta/eth";
import Src721 from "../contract/erc721/meta/sero";
import * as utils from "../utils"
import epochNameService from "../contract/epoch/sero/name";

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

    async post(method: any, params: any,chain:ChainType) {
        const data: any = {
            id: this.messageId++,
            jsonrpc: '2.0',
            method: method,
            params: params,
        };
        if(chain){
            axios.defaults.headers.post['chain'] = chain;
        }
        return new Promise((resolve, reject) => {
            axios.post(this.host, data,{
                headers:{}
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

}

const rpcEventSero = new RPC(EVENT_HOST_SERO)

export default rpcEventSero