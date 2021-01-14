import BigNumber from "bignumber.js";

export abstract class Cross{

    abstract depositFT(destinationChainID:number, resourceID:string, recipient:string,amount: BigNumber):Promise<any>;

    abstract minCrossAmount(resourceId:string):Promise<string>;

}
