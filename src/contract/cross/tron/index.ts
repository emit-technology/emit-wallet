import {Cross} from "../index";
import BigNumber from "bignumber.js";
import tron from "../../../rpc/tron";
import {toHex} from "../../../utils";

class Tron implements Cross{

    address:string;
    constructor(address:string) {
        this.address = address
    }

    contract = async ():Promise<any>=>{
        return await tron.tronWeb.contract().at(this.address)
    }

    depositFT = async (destinationChainID: number, resourceID: string, recipient: string, amount: BigNumber,from?:string): Promise<any> =>{
        const parameter = [
            {type:'uint8',value:destinationChainID.toString()},
            {type:'bytes32',value:resourceID},
            {type:'bytes',value:recipient},
            {type:'uint256',value:amount.toString(10)},
        ]
        console.error(this.address,from,parameter,"depositFT")
        const transaction = await tron.tronWeb.transactionBuilder.triggerSmartContract(this.address, "depositFT(uint8,bytes32,bytes,uint256)", {},
            parameter,tron.tronWeb.address.toHex(from));
        if(transaction.result.result){
            return Promise.resolve(transaction.transaction);
        }
        return Promise.reject("gen transaction obj failed");
    }

    minCrossAmount = async (resourceId: string): Promise<string> => {
        const contract = await this.contract();
        return await contract.minCrossAmount(resourceId).call()
    }

    resourceIDToLimit = async (resourceId: string): Promise<Array<BigNumber>> => {
        const contract = await this.contract();
        return await contract.resourceIDToLimit(resourceId).call()
    }

}

export default Tron