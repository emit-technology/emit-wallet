import Base from "../base";
import {
    Land,
    Counter,
    DriverStarGrid,
    UserPosition,
    StarGridType,
    StarGridTrustInfo, UserDeposit
} from "../../types";
import {EVENT_HOST_BSC} from "../../config";

class StarGrid extends Base {

    constructor(host: string) {
        super(host);
    }

    rangeLand = async (owner:string,c1: string, c2: string): Promise<Array<Land>> => {
        // @ts-ignore
        const rest:Array<Land> = await this.post("star_rangePlanet",[owner,c1,c2])
        return rest
    }

    counterPositions = async (id: string, max: number): Promise<Array<Counter>> => {
        const rest:any = await this.post("star_counterPositions",[id,max])
        return rest
    }

    userPositions = async (address:string,max:number): Promise<UserPosition> => {
        const rest:any = await this.post("star_userPositions",[address,max])
        return rest
    }

    landInfo = async (landId:string): Promise<Land> => {
        const rest:any = await this.post("star_planetInfo",[landId])
        return rest
    }

    counterInfo = async (id: string): Promise<Counter> => {
        const rest:any = await this.post("star_counterInfo",[id])
        return rest
    }

    driverInfo = async (address: string): Promise<DriverStarGrid> => {
        const rest:any = await this.post("star_driverInfo",[address])
        return rest
    }

    myApproved = async (address:string,skip:number,limit:number):Promise<StarGridTrustInfo> =>{
        const rest:any = await this.post("star_myApproved",[address,skip,limit]);
        return rest;
    }

    //[0-marker,1-owner,2-maker&owner,3-WATER,4-EARTH]
    //user,queryType[0-marker,1-owner,2-maker&owner], planetType[0-all,1-water,2-earth],skil,limit
    myPlanet = async (address:string,queryType:number,planetType:StarGridType,skip:number,limit:number):Promise<Array<Land>> => {
        const rest: any = await this.post("star_myPlanet", [address,queryType,planetType, skip, limit]);
        return rest;
    }

    userDeposit = async (address:string,skip:number,limit:number):Promise<Array<UserDeposit>> => {
        const rest: any = await this.post("star_userDeposit", [address, skip, limit]);
        return rest;
    }

}
const starGridRpc = new StarGrid(EVENT_HOST_BSC)

export default starGridRpc