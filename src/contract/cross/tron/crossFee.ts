import EthContract from "../../EthContract";
import BigNumber from "bignumber.js";
import tron from "../../../rpc/tron";

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

class CrossFee {

    address:string;

    constructor(address:string) {
        // super(address,ABI_FEE);
        this.address = address;
    }

    estimateFee = async (resourceId: string, inputAmount: BigNumber): Promise<string> => {
        const instance = await tron.tronWeb.contract().at(this.address);
        const res = await instance.estimateFee(resourceId,inputAmount.toNumber()).call();
        return res.fee.toString(10)
    }

}


export default CrossFee