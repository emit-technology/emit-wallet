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
import {
    BRIDGE_CURRENCY, BRIDGE_NFT,
    CONTRACT_ADDRESS,
    DECIMAL_CURRENCY,
    DISPLAY_NAME,
    EXPLORER_URL,
    FULL_NAME,
    GAS_DEFAULT,
    GAS_PRICE_UNIT,
    META_TEMP,
    NOT_CROSS_TOKEN
} from "../config"
import {Attribute, ChainId, ChainType, DeviceMode, GasPriceLevel, MetaInfo, NftInfo} from "../types";
import rpc from "../rpc";
import * as utils from "../utils"
import selfStorage from "./storage";
import {DeviceCategory, DeviceStyle} from "./device-style";
import {DeviceInfo, DeviceInfoRank, WrappedDevice} from "../contract/epoch/sero/types";
import {MarketItem} from "../rpc/epoch/market";
import {bookmarkOutline, colorWandOutline, constructOutline, ellipseOutline, ribbonOutline} from "ionicons/icons";

const utf8 = require("utf8");

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const bs58 = require("base-x")(BASE58);
const BN = require("bn.js");

export function bs58ToHex(value: string): string {
    const bytes = bs58.decode(value);
    return `0x${bytes.toString("hex")}`;
}

export function ellipsisStr(v: string,num?:number) {
    if (!v) return ""
    if(!num){
        num = 7
    }
    if (v.length >= 15) {
        return v.slice(0, num) + " ... " + v.slice(v.length - num, v.length);
    }
    return v
}

export function arrayToObject(arr: Array<any>) {
    const ret: any = {};
    for (let o of arr) {
        ret[o.currency] = o.value;
    }
    return ret
}

export function formatValueString(value:string|BigNumber|number|undefined,fix:number = 3):string {
    if(!value){
        return "0"
    }
    return nFormatter(fromValue(value,18),fix)
}
export function fromValue(value: string | BigNumber | number | undefined, decimal: number): BigNumber {
    if (!value) {
        return new BigNumber(0)
    }
    return new BigNumber(value).dividedBy(10 ** decimal)
}

export function toValue(value: string | BigNumber | number, decimal: number): BigNumber {
    if (!value) {
        return new BigNumber(0)
    }
    return new BigNumber(value).multipliedBy(10 ** decimal)
}

export function getCyDecimal(cy: string, chainName: string): number {
    try {
        if (!cy || !chainName) {
            return 18
        }
        return DECIMAL_CURRENCY[chainName][cy];
    } catch (e) {
        console.log(e)
    }
    return 18
}

export function needApproved(chain: ChainType) {
    if (ChainType.ETH == chain || ChainType.TRON == chain || ChainType.BSC == chain) {
        return true
    }
    return false;
}

export function getDestinationChainID(chain: ChainType) {
    if (chain == ChainType.TRON) {
        return ChainId.TRON
    } else if (chain == ChainType.ETH) {
        return ChainId.ETH
    } else if (chain == ChainType.SERO) {
        return ChainId.SERO
    } else if (chain == ChainType.BSC) {
        return ChainId.BSC
    }
    return ChainId._
}

export function getResourceId(cy: string, from: string, to: string) {
    return BRIDGE_CURRENCY[cy][from]["RESOURCE_ID"][to];
}

export function getNFTResourceId(symbol: string,from:string,to:string) {
    return BRIDGE_NFT[symbol][from]["RESOURCE_ID"][to];
}

export function getCrossTargetAddress(fromChain:ChainType,resourceId: string, destinationChainID: any) {
    const symbols = Object.keys(BRIDGE_NFT)
    for (let symbol of symbols) {
        if (BRIDGE_NFT[symbol][ChainType[fromChain]]["RESOURCE_ID"][ChainId[destinationChainID]] == resourceId) {
            return CONTRACT_ADDRESS.ERC721[symbol]["ADDRESS"][ChainId[destinationChainID]]
        }
    }
    return ""
}

export function getCyName(cy: string, chain: string): string {
    try {
        return BRIDGE_CURRENCY[cy][chain]["CY"];
    } catch (e) {
        console.log(e)
    }
    return ""
}

export function getChainIdByName(chain: string): any {
    for (let key in ChainType) {
        if (ChainType[key] === chain) {
            return key;
        }
    }
    return ChainType._
}

export function getDestinationChainIDByName(chain: string): any {
    for (let key in ChainId) {
        if (ChainId[key] === chain) {
            return key;
        }
    }
    return ChainId._
}

export function toHex(value: string | number | BigNumber, decimal?: number) {
    if (value === "0x") {
        return "0x0"
    }
    if (decimal) {
        return "0x" + toValue(value, decimal).toString(16);
    }
    return "0x" + new BigNumber(value).toString(16)
}

export function formatDate(timestamp: number) {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

export function defaultGas(chain: ChainType) {
    return GAS_DEFAULT[ChainType[chain]]
}

export function gasUnit(chain: ChainType) {
    return GAS_PRICE_UNIT[ChainType[chain]]
}

export function getCyType(chain: string, cy: string) {
    return BRIDGE_CURRENCY[cy][chain]["CY_TYPE"];
}

export function getCyDisplayName(key: string) {
    if (DISPLAY_NAME[key]) {
        return DISPLAY_NAME[key]
    } else {
        return key;
    }
}

export function getCrossEventStatus(status: string) {
    //{Inactive, Active, Passed, Executed, Cancelled}
    if (status == "1") {
        return "Active"
    } else if (status == "2") {
        return "Passed"
    } else if (status == "3") {
        return "Executed"
    } else if (status == "4") {
        return "Cancelled"
    } else {
        return "Deposited"
    }
}

export function getExplorerTxUrl(chain: ChainType, hash: string) {
    if (chain == ChainType.ETH) {
        if (new Date().getTimezoneOffset() / 60 == -8) {
            return `${EXPLORER_URL.TRANSACTION.ETH.CN}${hash}`
        } else {
            return `${EXPLORER_URL.TRANSACTION.ETH.EN}${hash}`
        }
    }
    return EXPLORER_URL.TRANSACTION[ChainType[chain]] + hash
}

export function getExplorerBlockUrl(chain: ChainType, hash: string, num: number) {
    if (chain == ChainType.ETH) {
        if (new Date().getTimezoneOffset() / 60 == -8) {
            return `${EXPLORER_URL.BLOCK.ETH.CN}${num}`
        } else {
            return `${EXPLORER_URL.BLOCK.ETH.EN}${num}`
        }
    }
    return EXPLORER_URL.BLOCK[ChainType[chain]] + num
}

export function getEthCyByContractAddress(address: string) {
    const keys = Object.keys(CONTRACT_ADDRESS.ERC20.ETH);
    // const keys2 = Object.keys(CONTRACT_ADDRESS.CROSS.ETH);
    // const keys = keys1.concat(keys2);
    for (let key of keys) {
        if (CONTRACT_ADDRESS.ERC20.ETH[key] && CONTRACT_ADDRESS.ERC20.ETH[key].toLowerCase() == address.toLowerCase()) {
            return key
        }
        // if(CONTRACT_ADDRESS.CROSS.ETH[key] && CONTRACT_ADDRESS.CROSS.ETH[key].toLowerCase() == address.toLowerCase()){
        //     return key
        // }
    }
    return "ETH"
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

export function IsAPP() {
    return getMobileOperatingSystem() == "iOS" || getMobileOperatingSystem() == "Android";
}

export async function defaultGasPrice(chain: ChainType) {
    let defaultGasPrice;
    let data: GasPriceLevel = {};
    if (chain == ChainType.ETH) {
        // @ts-ignore
        data = await rpc.post("eth_gasTracker", [], chain)
    }
    if (chain == ChainType.BSC) {
        // @ts-ignore
        const defaultGasPrice: any = await rpc.post("eth_gasPrice", [], chain)
        data = {
            AvgGasPrice: {
                gasPrice: utils.fromValue(defaultGasPrice, 9).toString(10),
                second: 3,
            }
        }
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

export function getCategoryBySymbol(symbol: string, chain: string): string {
    return CONTRACT_ADDRESS.ERC721[symbol]["SYMBOL"][chain];
}

export function crossAbleBySymbol(symbol: string): boolean {
    console.log(symbol)
    return CONTRACT_ADDRESS.ERC721[symbol]["CROSS_ABLE"];
}

export function getAddressBySymbol(symbol: string, chain: string): string {
    return CONTRACT_ADDRESS.ERC721[symbol]["ADDRESS"][chain];
}

export function getAddressByCategory(category: string, chain: string): string {
    const keys = Object.keys(CONTRACT_ADDRESS.ERC721);
    for (let k of keys) {
        const address = CONTRACT_ADDRESS.ERC721[k]["ADDRESS"];
        const symbol = CONTRACT_ADDRESS.ERC721[k]["SYMBOL"];
        if (symbol[chain] == category) {
            return address[chain]
        }
    }
    return ""
}

export function isNFTAddress(add: string, chain: string): boolean {
    const keys = Object.keys(CONTRACT_ADDRESS.ERC721);
    for (let k of keys) {
        const address = CONTRACT_ADDRESS.ERC721[k]["ADDRESS"];
        // const symbol = CONTRACT_ADDRESS.ERC721[k]["SYMBOL"];
        if (address[chain].toLowerCase() == add.toLowerCase()) {
            return true
        }
    }
    return false
}

function hexToUtf8(hex: string): string {
    let string = "";
    let code = 0;
    hex = hex.replace(/^0x/i, "");

    // remove 00 padding from either side
    hex = hex.replace(/^(?:00)*/, "");
    hex = hex
        .split("")
        .reverse()
        .join("");
    hex = hex.replace(/^(?:00)*/, "");
    hex = hex
        .split("")
        .reverse()
        .join("");

    const l = hex.length;

    for (let i = 0; i < l; i += 2) {
        code = parseInt(hex.substr(i, 2), 16);
        // if (code !== 0) {
        string += String.fromCharCode(code);
        // }
    }

    return utf8.decode(string);
}

export function hexToCy(str: string) {
    return hexToUtf8(str).toUpperCase()
}

export function notCrossToken(cy: string) {
    return NOT_CROSS_TOKEN.indexOf(cy) == -1
}

export function getPrefix(chain: ChainType) {
    if (chain == ChainType.BSC) {
        return "eth"
    } else {
        return ChainType[chain].toLowerCase();
    }
}

export function defaultCy(chain: ChainType) {
    if (chain == ChainType.BSC) {
        return "BNB"
    } else {
        return ChainType[chain];
    }
}

export function getCrossChainByCy(cy: string): Array<any> {
    const obj = BRIDGE_CURRENCY[cy];
    if (obj) {
        const keys = Object.keys(obj)
        const arr = []
        for (let k of keys) {
            for (let j of keys) {
                if (k !== j && (!obj[k].EXCEPT || obj[k].EXCEPT.indexOf(j) == -1)) {
                    arr.push({
                        from: k,
                        to: j
                    })
                }
            }
        }
        return arr;
    }
    return [{}]
}


export function getCrossNFTBySymbol(symbol: string): Array<any> {
    const obj = BRIDGE_NFT[symbol];
    if (obj) {
        const keys = Object.keys(obj)
        const arr = []
        for (let k of keys) {
            for (let j of keys) {
                if (k !== j && (!obj[k].EXCEPT || obj[k].EXCEPT.indexOf(j) == -1)) {
                    arr.push({
                        from: k,
                        to: j
                    })
                }
            }
        }
        return arr;
    }
    return [{}]
}

export function getChainFullName(chain: ChainType) {
    if (FULL_NAME[ChainType[chain]]) {
        return FULL_NAME[ChainType[chain]]
    }
    return ChainType[chain]
}

export async function getShortAddress(shotAddress: string) {
    const rest: any = await rpc.post("sero_getShortAddress", [shotAddress], ChainType.SERO);
    return rest
}

export function getDeviceLv(rate: string | undefined) {
    if (rate) {
        return utils.fromValue(rate, 16).toFixed(2, 1)
    }
    return "0";
}

export const ticketKey = (chain:ChainType) => {
    return ["nft_ticket", chain].join("_");
}

export const ticketArrKey = (chain:ChainType) => {
    return ["nft_ticket_arr", chain].join("_");
}

export function nFormatter(n: number | BigNumber | string | undefined, digits: number) {
    if(!n){
        return "0"
    }
    const num = new BigNumber(n).toNumber();
    const si = [
        {value: 1, symbol: ""},
        {value: 1E3, symbol: "K"},
        {value: 1E6, symbol: "M"},
        {value: 1E9, symbol: "G"},
        {value: 1E12, symbol: "T"},
        {value: 1E15, symbol: "P"},
        {value: 1E18, symbol: "E"}
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

export function calcDark(dna: string): number {
    // return 4;
    if (!dna || dna=="0x0000000000000000000000000000000000000000000000000000000000000000") {
        return 0
    }
    if (!isDark(dna)) {
        return 0
    }
    const u256 = new BN(dna.slice(2), 16).toArrayLike(Buffer, "be", 32)
    return (new BigNumber(u256[0] & 0x3).plus(1).toNumber())
}

export function isDark(dna: string): boolean {
    // return true;
    if (!dna || dna=="0x0000000000000000000000000000000000000000000000000000000000000000") {
        return false
    }
    if (new BigNumber(dna).toNumber() == 0) {
        return false
    }
    const u256 = new BN(dna.slice(2), 16).toArrayLike(Buffer, "be", 32)
    return (u256[0] & 0xFC) == 0;
}

export function calcStyle(dna: string | undefined): DeviceMode {
    if (!dna || dna=="0x0000000000000000000000000000000000000000000000000000000000000000") {
        return {style: "ax", category: "normal"}
    }
    const u256 = new BN(dna.slice(2), 16).toArrayLike(Buffer, "be", 32)
    const styleNum = new BigNumber(u256[1]).toNumber();


    const styleKeys = Object.keys(DeviceStyle);
    for (let key of styleKeys) {
        if (DeviceStyle[key][1] > styleNum  && styleNum >= DeviceStyle[key][0]) {
            const categoryKeys = Object.keys(DeviceCategory);
            let category = "";
            for (let k of categoryKeys) {
                if (DeviceCategory[k][1] > styleNum  && styleNum >= DeviceCategory[k][0]) {
                    category = k
                }
            }
            return {style: key, category: category}
        }
    }
    return {style: "ax", category: "normal"}
}

export function getQueryString(name: string) {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    const r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return '';
}

export function isEmbedPopup() {
    return utils.getQueryString("embed") == "popup" || selfStorage.getItem("embed") == "popup";
}

export function isMyDevice(category: string, ticket: string): boolean {
    const tKey = ticketKey(ChainType.SERO);
    const data: any = selfStorage.getItem(tKey)
    if(data && data[category]){
        const all = data[category]
        if (all) {
            for (let v of all) {
                if (v.tokenId == ticket) {
                    return true
                }
            }
        }
    }
    return false
}


export const convertDeviceToNFTInfo = (device:DeviceInfo)=>{
    const data = JSON.parse(JSON.stringify(META_TEMP["DEVICES"]))
    const mode = utils.calcStyle(device.gene)
    device.mode=mode;
    data.image = `./assets/img/epoch/device/${mode.style}.png`
    data.attributes = device;
    return {
        chain:ChainType.SERO,
        category:"EMIT_AX",
        symbol: "DEVICES",
        tokenId:device.ticket,
        meta:data
    }
}

export const convertWrappedDeviceToDevice = (wrappedDevice:WrappedDevice):DeviceInfo=>{
    const device:DeviceInfo = {
        category: wrappedDevice.category,
        ticket: wrappedDevice.srcTkt,
        base: new BigNumber(wrappedDevice.base).toNumber(),
        capacity:  new BigNumber(wrappedDevice.capacity).toNumber(),
        power:  new BigNumber(wrappedDevice.power).toNumber(),
        rate: wrappedDevice.rate,
        gene: wrappedDevice.gene,
        last: wrappedDevice.freezeStartPeriod,
        mode:utils.calcStyle(wrappedDevice.gene)
    }
    return device
}

export const convertDeviceToRemains = (info:NftInfo)=>{
    const nftInfo:NftInfo = JSON.parse(JSON.stringify(info))
    const meta = nftInfo.meta;
    if(!meta.attributes){
        return
    }
    const deviceInfo:DeviceInfo = convertWrappedDeviceToDevice(meta.attributes)
    const stylePath = deviceInfo && deviceInfo.gene && isDark(deviceInfo.gene)?"dark":"light";
    meta.image = deviceInfo && deviceInfo.mode && deviceInfo.mode.style=="ax"?"":`./assets/img/epoch/remains/device/${stylePath}/${deviceInfo.mode?.style}.png`
    meta.attributes = deviceInfo;
    return {
        chain:ChainType.SERO,
        category:"WRAPPED_EMIT_AX",
        symbol: "WRAPPED_DEVICES",
        tokenId:info.tokenId,
        meta:meta
    }
}

export const convertMarketItemToNFTInfo = (item:MarketItem):NftInfo=>{
    const deviceInfo:DeviceInfo = JSON.parse(JSON.stringify(item.device));
    deviceInfo.category = item.category;
    deviceInfo.mode = utils.calcStyle(item.device.gene)

    const meta = JSON.parse(JSON.stringify(META_TEMP["DEVICES"]))
    const stylePath = utils.isDark(deviceInfo.gene)?"dark":"light";
    meta.image = deviceInfo && deviceInfo.mode && deviceInfo.mode.style=="ax"?"":`./assets/img/epoch/remains/device/${stylePath}/${deviceInfo.mode.style}.png`
    meta.attributes = deviceInfo;
    meta.alis=item.name;
    const info:NftInfo = {
        chain: ChainType.SERO,
        category:item.category,
        symbol: "WRAPPED_EMIT_AX" == item.category?"WRAPPED_DEVICES":"",
        tokenId: item.ticket,
        meta: meta
    }
    return  info;
}

export const convertDeviceRankInfoToNFTInfo = (device:DeviceInfoRank):NftInfo=>{
    const data = JSON.parse(JSON.stringify(META_TEMP["DEVICES"]))
    const mode = utils.calcStyle(device.gene)
    data.image = `./assets/img/epoch/device/${mode.style}.png`
    data.attributes = toDevice(device);
    return {
        chain:ChainType.SERO,
        category:"EMIT_AX",
        symbol: "DEVICES",
        tokenId:device.ticket,
        meta:data
    }
}

export const toDevice = (dr:DeviceInfoRank):DeviceInfo=>{
    return {
        category: "EMIT_AX",
        ticket: dr.ticket,
        base: new BigNumber( dr.base).toNumber(),
        capacity: new BigNumber( dr.capacity).toNumber(),
        power:new BigNumber( dr.power).toNumber(),
        rate: dr.rate,
        gene: dr.gene,
        last: dr.last,
        alis: dr.name,
        mode: utils.calcStyle(dr.gene)
    }
}

export function renderDarkStar (dna:string):Array<number>{
    const n = utils.calcDark(dna)
    const ht:Array<number> = [];

    if(n<=4){
        for(let i=0;i<n;i++){
            ht.push(i)
        }
        //
        // for(let i=0;i<4-n;i++){
        //     ht.push(<IonIcon src={starOutline} className="dark-star"/>)
        // }
    }
    return ht;
}

export function toBytes( str:string ) {
    let ch:number = 0 ;
    let st:Array<number>=[];
    let re:Array<number> = [];
    for (let i = 0; i < str.length; i++ ) {
        ch = str.charCodeAt(i);  // get char
        st = [];                 // set up "stack"

        do {
            st.push( ch & 0xFF );  // push byte to stack
            ch = ch >> 8;          // shift value down by 1 byte
        }

        while ( ch );
        // add stack contents to result
        // done because chars have "wrong" endianness
        re = re.concat( st.reverse() );
    }
    // return an array of bytes
    return re;
}

export function Trim(str:string){
    let result;
    result = str.replace(/(^\s+)|(\s+$)/g,"");
    result = result.replace(/\s/g,"");
    return result;
}

export function addressScanInfo(address:string,chain:ChainType){
    if (chain == ChainType.ETH) {
        if (new Date().getTimezoneOffset() / 60 == -8) {
            return `${EXPLORER_URL.ADDRESS.ETH.CN}${address}`
        } else {
            return `${EXPLORER_URL.ADDRESS.ETH.EN}${address}`
        }
    }
    return `${EXPLORER_URL.ADDRESS[ChainType[chain]]}${address}`
}

export function frozeAbleBySymbol(symbol: string): boolean {
    return CONTRACT_ADDRESS.ERC721[symbol]["FROZE_ABLE"];
}

export function unFrozenAbleBySymbol(symbol: string): boolean {
    return CONTRACT_ADDRESS.ERC721[symbol]["UNFROZEN_ABLE"];
}

export function isNumber(str:any){
    const partner = /^\d+(\.\d+)?$/
    return partner.test(str);
}

export const reColor = (v:string)=>{
    const keys = Object.keys(DeviceCategory)
    if(v == keys[3]){
        return "success"
    }else if(v == keys[2]){
        return "tertiary"
    }else if(v == keys[1]){
        return "danger"
    }else if(v == keys[0]){
        return "warning"
    }else{
        return "medium"
    }
}

export const reIcon = (v:string)=>{
    const keys = Object.keys(DeviceCategory)
    if(v == keys[3]){
        return bookmarkOutline
    }else if(v == keys[2]){
        return colorWandOutline
    }else if(v == keys[1]){
        return constructOutline
    }else if(v == keys[0]){
        return ribbonOutline
    }else{
        return ellipseOutline
    }
}

export function metaAttributesToWrappedDevice(attributes:Array<Attribute>):WrappedDevice{
    function getAttr(trait:string){
        if(!attributes){
            return;
        }
        for (let attr of attributes){
            if(attr.trait_type == trait){
                return attr.value
            }
        }
    }
    const wrpDivice:WrappedDevice = {
        name:getAttr("name"),
        category:getAttr("category"),
        ticket:getAttr("ticket"),
        base:getAttr("base"),
        capacity:getAttr("capacity"),
        power:getAttr("power"),
        rate:getAttr("rate"),
        gene:getAttr("gene"),
        freezeStartPeriod:getAttr("freezeStartPeriod"),
        freezeFee:getAttr("freezeFee"),
        current:getAttr("current"),
        srcTkt:getAttr("srcTkt"),
    }
    return wrpDivice;
}