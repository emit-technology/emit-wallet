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

import BigNumber from 'bignumber.js'
import {BRIDGE_CURRENCY, BRIDGE_RESOURCE_ID, DECIMAL_CURRENCY, GAS_DEFAULT, GAS_PRICE_UNIT} from "../config"
import {ChainType, GasPriceLevel} from "../types";
import {Plugins} from "@capacitor/core";
import rpc from "../rpc";

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const bs58 = require("base-x")(BASE58);

export function bs58ToHex(value: string): string {
    const bytes = bs58.decode(value);
    return `0x${bytes.toString("hex")}`;
}

export function ellipsisStr(v:string){
    if(!v) return ""
    if (v.length>=15){
        return v.slice(0,7) + " ... " +v.slice(v.length-7,v.length);
    }
    return v
}

export function arrayToObject(arr:Array<any>){
    const ret:any = {};
    for(let o of arr){
        ret[o.currency] = o.value;
    }
    return ret
}

export function fromValue(value:string | BigNumber | number | undefined, decimal:number):BigNumber{
    if (!value){
        return new BigNumber(0)
    }
    return new BigNumber(value).dividedBy(10**decimal)
}

export function toValue(value:string | BigNumber | number, decimal:number):BigNumber{
    if (!value){
        return new BigNumber(0)
    }
    return new BigNumber(value).multipliedBy(10**decimal)
}

export function getCyDecimal(cy:string,chainName:string):number{
    try{
        if(!cy || !chainName){
            return 0
        }
        return DECIMAL_CURRENCY[chainName][cy];
    }catch (e){
        console.log(e)
    }
    return 0
}

export function needApproved(chain:ChainType){
    if(ChainType.ETH == chain || ChainType.TRON == chain){
        return true
    }
    return false;
}

export function getResourceId(cy:string){
    return BRIDGE_RESOURCE_ID[cy];
}

export function getCyName(cy:string,chain:string):string{
    try{
        return BRIDGE_CURRENCY[cy][chain]["CY"];
    }catch (e){
        console.log(e)
    }
    return ""
}

export function getChainIdByName(chain:string):any{
    for(let key in ChainType){
        if(ChainType[key] === chain){
            return key;
        }
    }
    return ChainType._
}

export function toHex(value:string | number | BigNumber){
    if(value === "0x"){
        return "0x0"
    }
    return "0x"+new BigNumber(value).toString(16)
}

export function formatDate(timestamp:number){
    const date = new Date(timestamp);
    return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

export function defaultGas(chain:ChainType){
    return GAS_DEFAULT[ChainType[chain]]
}

export function gasUnit(chain:ChainType){
    return GAS_PRICE_UNIT[ChainType[chain]]
}

export function getCyType(chain:string,cy:string){
    return BRIDGE_CURRENCY[cy][chain]["CY_TYPE"];
}

export function getCrossEventStatus(status:string){
    //{Inactive, Active, Passed, Executed, Cancelled}
    if(status == "1"){
        return "Active"
    }else if(status == "2"){
        return "Passed"
    }else if(status == "3"){
        return "Executed"
    }else if(status == "4"){
        return "Cancelled"
    }else{
        return "Deposited"
    }
}

export function getExplorerTxUrl(chain:ChainType,hash:string){
    if (chain == ChainType.ETH){
        if(new Date().getTimezoneOffset() / 60 == -8){
            return `https://cn.etherscan.com/tx/${hash}`
        }else {
            return `https://etherscan.com/tx/${hash}`
        }
    }else if(chain == ChainType.SERO){
        return `https://explorer.sero.cash/txsInfo.html?hash=${hash}`
    }else if(chain == ChainType.TRON){
        return `https://shasta.tronscan.io/#/transaction/${hash}`
    }
    return `https://etherscan.com/tx/${hash}`
}

export function getExplorerBlockUrl(chain:ChainType,hash:string,num:number){
    if (chain == ChainType.ETH){
        if(new Date().getTimezoneOffset() / 60 == -8){
            return `https://cn.etherscan.com/block/${num}`
        }else {
            return `https://etherscan.com/block/${num}`
        }
    }else if(chain == ChainType.SERO){
        return `https://explorer.sero.cash/blockInfo.html?hash=${hash}`
    }else if(chain == ChainType.TRON){
        return `https://shasta.tronscan.io/#/block/${num}`
    }
    return `https://etherscan.com/block/${hash}`
}

/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * @returns {String}
 */
export function getMobileOperatingSystem() {
    // @ts-ignore
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}

export function IsAPP(){
    return getMobileOperatingSystem() == "iOS" || getMobileOperatingSystem() == "Android";
}

export async function defaultGasPrice(chain:ChainType){
    let defaultGasPrice;
    let data: GasPriceLevel = {};
    if (chain == ChainType.ETH) {
        // @ts-ignore
        data = await rpc.post("eth_gasTracker", [])
    } else if (chain == ChainType.SERO) {
        data = {
            AvgGasPrice: {
                gasPrice: "1",
                second: 15,
            }
        }
    } else if (chain == ChainType.TRON) {
        //TODO
    }
    defaultGasPrice = data.AvgGasPrice ? data.AvgGasPrice?.gasPrice : "1"
    return defaultGasPrice;
}