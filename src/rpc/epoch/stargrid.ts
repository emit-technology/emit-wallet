import Base from "../base";
import {Land, Counter, DriverStarGrid, Position} from "../../types";
import {EVENT_HOST_SERO} from "../../config";

class StarGrid extends Base {

    constructor(host: string) {
        super(host);
    }

    rangeLand = async (c1: string, c2: string): Promise<Array<Land>> => {
        const rest:any = await this.post("star_rangeLand",[c1,c2])
        return rest
    }

    piecePositions = async (id: string, max: number): Promise<Array<Counter>> => {
        const rest:any = await this.post("star_operatorPositions",[id,max])
        return rest
    }

    userPositions = async (address:string,max:number): Promise<Array<Position>> => {
        const rest:any = await this.post("star_userPositions",[address,max])
        return rest
    }

    landInfo = async (landId:string): Promise<Land> => {
        const rest:any = await this.post("star_landInfo",[landId])
        return rest
    }

    counter = async (id: string): Promise<Counter> => {
        const rest:any = await this.post("star_operatorInfo",[id])
        return rest
    }

    driverInfo = async (address: string): Promise<DriverStarGrid> => {
        const rest:any = await this.post("star_driverInfo",[address])
        return rest
    }

}
const starGridRpc = new StarGrid(EVENT_HOST_SERO)

export default starGridRpc