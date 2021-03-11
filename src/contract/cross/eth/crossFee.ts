import EthContract from "../../EthContract";
import BigNumber from "bignumber.js";
import {ChainType} from "../../../types";

const ABI_FEE = [
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "resourceId",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "inputAmount",
                "type": "uint256"
            }
        ],
        "name": "estimateFee",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "fee",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

class CrossFee extends EthContract {

    constructor(address:string,chain:ChainType) {
        super(address,ABI_FEE,chain);
    }

    estimateFee = async (resourceId: string, inputAmount: BigNumber): Promise<string> => {
        return await this.contract.methods.estimateFee(resourceId,"0x"+inputAmount.toString(16)).call()
    }

}


export default CrossFee