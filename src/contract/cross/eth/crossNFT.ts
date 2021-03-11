import EthContract from "../../EthContract";
import BigNumber from "bignumber.js";
import {EMIT_HOST} from "../../../config";
import {ChainType} from "../../../types";

const Web3 = require('web3');
const web3 = new Web3(EMIT_HOST);

const ABI = [
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
        "name": "depositNFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

class CrossNFT extends EthContract {

    constructor(address:string) {
        super(address,ABI,ChainType.ETH);
    }

    depositNFT = async (destinationChainID:number,resourceId: string, recipient:string,tokenId:string): Promise<string> => {
        return await this.contract.methods.depositNFT(destinationChainID,resourceId,recipient,"0x"+new BigNumber(tokenId).toString(16)).encodeABI()
    }

    decodeTransferFromParams = async (input:string):Promise<any>=>{
        const abi = {
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
            "name": "depositNFT",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
        const signName = web3.eth.abi.encodeFunctionSignature(abi)
        if(signName != input.slice(0,10)){
            return ""
        }
        const rest = await web3.eth.abi.decodeParameters(abi["inputs"],"0x"+input.slice(10))
        return rest;
    }

}


export default CrossNFT