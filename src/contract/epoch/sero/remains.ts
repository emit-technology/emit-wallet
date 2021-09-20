import SeroContract from "../../SeroContract";
import {WrappedDevice} from "./types";
import {CONTRACT_ADDRESS} from "../../../config";
import BigNumber from "bignumber.js";

const ABI =[
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "catg_",
                "type": "string"
            },
            {
                "internalType": "bytes32",
                "name": "tkt_",
                "type": "bytes32"
            }
        ],
        "name": "estimateFee",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
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
        "inputs": [],
        "name": "freeze",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "catg",
                "type": "string"
            }
        ],
        "name": "maxPeriods",
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
        "inputs": [],
        "name": "unseal",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "wrapped_",
                "type": "bytes32"
            }
        ],
        "name": "unsealFee",
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
        "inputs": [],
        "name": "tokenRate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "tokenAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "seroAmount",
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
                "name": "tkt_",
                "type": "bytes32"
            }
        ],
        "name": "wrappedDevice",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "category",
                        "type": "string"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "ticket",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "base",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "capacity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "power",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "rate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "gene",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint64",
                        "name": "freezeStartPeriod",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint256",
                        "name": "freezeFee",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "current",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "srcTkt",
                        "type": "bytes32"
                    }
                ],
                "internalType": "struct IRelicsAgent.WrappedDevice",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]
class Service extends SeroContract {

    constructor(address: string) {
        super(address, ABI);
    }

    freeze = async (): Promise<any> => {
        return this.contract.packData("freeze", [], true)
    }

    unseal = async (): Promise<any> => {
        return this.contract.packData("unseal", [], true)
    }

    wrappedDevice = async (tkt: string, from: string): Promise<WrappedDevice> => {
        const rest: any = await this.call("wrappedDevice", [tkt], from);
        return rest[0]
    }

    unsealFee = async (tkt: string, from: string): Promise<any> => {
        const rest: any = await this.call("unsealFee", [tkt], from);
        return rest[0]
    }

    //fee , maxPeriods
    estimateFee = async (tkt: string,category:string, from: string): Promise<any> => {
        const rest: any = await this.call("estimateFee", [category,tkt], from);
        return rest
    }

    maxPeriods = async (category:string,from: string): Promise<any> => {
        const rest: any = await this.call("maxPeriods", [category], from);
        return rest[0]
    }

    tokenRate = async (gasPrice: string | number | BigNumber, gas: number | string | BigNumber): Promise<string> => {
        const rest: any = await this.call("tokenRate", [], "");
        let feeAmount = new BigNumber(1)
        let seroAmount = new BigNumber(1)
        if (rest) {
            feeAmount = new BigNumber(rest[0]);
            seroAmount = new BigNumber(rest[1])
        }
        return feeAmount.multipliedBy(
            new BigNumber(gas).multipliedBy(new BigNumber(gasPrice))
        ).dividedBy(seroAmount).toFixed(0, 2)
    }
}

const epochRemainsService = new Service(CONTRACT_ADDRESS.EPOCH.SERO.REMAINS)

export default epochRemainsService