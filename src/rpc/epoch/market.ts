import Base from "../base";
import {EVENT_HOST_SERO} from "../../config";
import {DeviceMode} from "../../types";

class Market extends Base {
    constructor(host: string) {
        super(host);
    }

    items = async (marketItem: MarketItemQuery, pageNo: number, pageSize: number): Promise<Array<MarketItem>> => {
        const rest: any = await this.post("market_items", [marketItem, pageNo, pageSize])
        return rest
    }

    sellItem = async (from: string, finished: boolean, pageNo: number, pageSize: number): Promise<Array<MarketItem>> => {
        const rest: any = await this.post("market_sellItems", [from, finished, pageNo, pageSize])
        return rest
    }

    buyItem = async (from: string, startPageNum: number, pageSize: number): Promise<Array<MarketItem>> => {
        const rest: any = await this.post("market_buyItems", [from, startPageNum, pageSize])
        return rest
    }

    exchangeRecords = async (ticket: string): Promise<Array<MarketItem>> => {
        const rest: any = await this.post("market_exchangeRecords", [ticket,0,100])
        return rest
    }

    marketVolumeOf24h = async ():Promise<VolumeOf24h> =>{
        const rest:any = await this.post("market_volumeOf24h",[])
        return rest;
    }

    marketTopExchange = async (num:number):Promise<Array<MarketItem>> =>{
        const rest:any = await this.post("market_topExchange",[num])
        return rest;
    }

    marketTopPrice = async (num:number):Promise<Array<MarketItem>> =>{
        const rest:any = await this.post("market_topPrice",[num])
        return rest;
    }
}

export interface VolumeOf24h {
    // :{"amounts":[{"amount":"170000000000000000000","cy":"LIGHT"}],"count":6}
    amounts:Array<Amount>
    count:number
}
interface Amount{
    amount:string
    cy:string
    high:string
}

export interface MarketItemQuery {
    type: number // 1 DEVICES
    ticket?: string
    cy?: string
    showId?: Range //[0,256]
    gene?: number //0 default ,1:Yes, 2:No
    price?: Range
    capacity?: Range
    rate?: Range
    power?: Range
    priceSort?: number //-1,1
    rateSort?: number // -1,1
    powerSort?: number // -1,1
    darkStar?:number// 0 light, 1,2,3,4 dark
}

interface Range {
    min?: string
    max?: string
}

export interface MarketItem {
    itemNo: number
    category: string
    ticket: string
    currency: string
    price: string
    url: string
    device: Device
    attach: Attach
    periods: number//already sell periods
    totalFee: number
    valid: boolean
    owner:string
    name:string
}

interface Attach {
    fee: string
    start: number
}

interface Device {
    ticket: string
    base: string
    capacity: string
    power: string
    rate: string
    gene: string
    darkStar: number
    showId: string
}

const epochMarketRpc = new Market(EVENT_HOST_SERO);

export default epochMarketRpc