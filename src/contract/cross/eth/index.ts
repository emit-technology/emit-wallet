import {Cross} from "../index";
import BigNumber from "bignumber.js";
import EthContract from "../../EthContract";

const ABI_CROSS = [
    {
        "inputs": [],
        "name": "_chainID",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint8",
                "name": "destinationChainID",
                "type": "uint8"
            },
            {
                "internalType": "bytes32",
                "name": "resourceID",
                "type": "bytes32"
            },
            {
                "internalType": "bytes",
                "name": "recipient",
                "type": "bytes"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "depositFT",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "resourceId",
                "type": "bytes32"
            }
        ],
        "name": "minCrossAmount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "resourceId",
                "type": "bytes32"
            }
        ],
        "name": "resourceIDToLimit",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "minAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "maxAmount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

class Eth extends EthContract implements Cross{

    constructor(address:string) {
        super(address,ABI_CROSS);
    }

    depositFT(destinationChainID: number, resourceID: string, recipient: string, amount: BigNumber): Promise<any> {
        console.log("params>",destinationChainID,resourceID,recipient,"0x"+amount.toString(16))
        return this.contract.methods.depositFT(destinationChainID,resourceID,recipient,"0x"+amount.toString(16)).encodeABI()
    }

    minCrossAmount = async (resourceId: string): Promise<string> => {
        return await this.contract.methods.minCrossAmount(resourceId).call()
    }

    resourceIDToLimit = async (resourceId: string): Promise<Array<BigNumber>> => {
        const rest = await this.contract.methods.resourceIDToLimit(resourceId).call()
        console.log(rest,"resourceIDToLimit")
        return [new BigNumber(rest[0]),new BigNumber(rest[1])]
    }

}

export default Eth