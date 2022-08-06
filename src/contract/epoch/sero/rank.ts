import rpcEventSero from "../../../rpc/event-sero";
import {ChainType} from "@emit-technology/emit-lib";
import {MinerScenes} from "../../../pages/epoch/miner";
import {DeviceInfoRank, DriverInfoRank, PositionDriverInfoRank,PositionDeviceInfoRank} from "./types";

class Rank{

    epochTopDevice = async (num:number):Promise<Array<DeviceInfoRank>> =>{
        const rest:any = await rpcEventSero.post("epoch_topDevice",[num],ChainType.SERO)
        return rest
    }

    epochTopDriver = async (scenes:MinerScenes,num:number):Promise<Array<DriverInfoRank>> =>{
        const rest:any = await rpcEventSero.post("epoch_topDriver",[scenes,num],ChainType.SERO)
        return rest
    }

    epochPositionDriver = async (from:string,scenes:MinerScenes):Promise<PositionDriverInfoRank> =>{
        const rest:any = await rpcEventSero.post("epoch_positionDriver",[from,scenes,5],ChainType.SERO)
        return rest
    }

    epochPositionDevice = async (ticket:string):Promise<PositionDeviceInfoRank> =>{
        const rest:any = await rpcEventSero.post("epoch_positionDevice",[ticket,5],ChainType.SERO)
        return rest
    }
}

const epochRankService = new Rank()

export default epochRankService