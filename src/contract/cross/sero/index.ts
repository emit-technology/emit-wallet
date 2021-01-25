import {Cross,} from "../index";
import SeroContract from "../../SeroContract";
import BigNumber from "bignumber.js";

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

class Sero extends SeroContract implements Cross{

    constructor(address:string) {
        super(address,ABI_CROSS);
    }

    depositFT = async (destinationChainID: number, resourceID: string, recipient: string): Promise<any> => {
        console.log([destinationChainID,resourceID,recipient])
        return this.contract.packData("depositFT", [destinationChainID,resourceID,recipient], true)
    }

    minCrossAmount = async (resourceId: string): Promise<string> =>{
        return await this.call("minCrossAmount", [resourceId],"");
    }

    resourceIDToLimit = async (resourceId: string): Promise<Array<BigNumber>> =>{
        const rest = await this.call("resourceIDToLimit", [resourceId],"");
        return [new BigNumber(rest[0]),new BigNumber(rest[1])]
    }

}

export default Sero