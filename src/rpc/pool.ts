import {ChainType} from "../types";
import Base from "./base";
import {EPOCH_POOL_HOST} from "../config";
import {PoolTask} from "../contract/epoch/sero/types";
import {MinerScenes} from "../pages/epoch/miner";
import rpc from "../../../emit-wallet-worker/src/rpc";
import config from "../../../emit-wallet-worker/src/config";

class PoolRpc extends Base {

    constructor(host: string) {
        super(host);
    }

    getMyTask = async (address: string):Promise<Array<PoolTask>> => {
        const rest:any = await this.post("epoch_getTask", [], ChainType.SERO, "/" + address)
        return rest?rest:[];
    }

    getTask = async (address: string, pageNo: number, size: number,scenes:MinerScenes,name?:string,sort?:number):Promise<Array<PoolTask>> => {
        const rest:any = await this.post("epoch_getTask", [JSON.stringify({pageNo, size,scenes:scenes,name:name,sort:sort})], ChainType.SERO, "/" + address)
        return rest?rest:[];
    }

    getPayment = async (taskId:number,address: string, pageNo: number, size: number) :Promise<Array<PoolPayment>> => {
        const rest:any = await this.post("epoch_getPayment", [JSON.stringify({taskId,pageNo, size})], ChainType.SERO, "/" + address)
        return rest?rest:[];
    }

    getShare = async (taskId:number,address: string, pageNo: number, size: number) :Promise<Array<PoolShare>> => {
        const rest:any = await this.post("epoch_getShare", [JSON.stringify({taskId,pageNo, size})], ChainType.SERO, "/" + address)
        return rest?rest:[];
    }

    submitWork = async (address: string, req: SumbitReq): Promise<any> => {
        const rest = await this.post("epoch_submitWork", [JSON.stringify(req)], ChainType.SERO, "/" + address)
        return rest;
    }

    taskImage = async (taskId:number,address: string) :Promise<Array<any>> => {
        const rest:any = await this.post("epoch_taskImage", [taskId], ChainType.SERO, "/" + address)
        return rest?rest:[];
    }

    taskWithIds = async (ids:Array<number>,address:string):Promise<Array<PoolTask>> => {
        const rest:any = await this.post("epoch_taskWithIds", [ids], ChainType.SERO, "/" + address)
        return rest?rest:[];
    }

    epochTaskShare = async (taskId:number,period:number,address:string):Promise<Array<PoolShare>> => {
        const rest:any = await this.post("epoch_taskShare", [taskId,period], ChainType.SERO, "/" + address)
        return rest?rest:[];
    }

    epochTaskPayment = async (taskId:number,period:number,address:string):Promise<Array<PoolPayment>> => {
        const rest:any = await this.post("epoch_taskPayment", [taskId,period], ChainType.SERO, "/" + address)
        return rest?rest:[];
    }

}

export interface SumbitReq {
    taskId: number,
    phash: string,
    serial: number,
    nonce: number,
    ne: string
}

export interface PoolShare {
    ne: string,
    nonce: string,
    period: number,
    phash: string,
    scenes: MinerScenes,
    serial:number,
    taskId:number,
    user:string
}


export interface PoolPayment {
    taskId: number,
    payee: string,
    period: number,
    amount: string,
    txHash: string,
    payTime: number
}

const poolRpc = new PoolRpc(EPOCH_POOL_HOST)

export default poolRpc