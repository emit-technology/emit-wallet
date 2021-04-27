import SeroContract from "../../SeroContract";
import {MinerScenes} from "../../../pages/epoch/miner";
import {DeviceInfo} from "./types";
import {CONTRACT_ADDRESS} from "../../../config";
import BigNumber from "bignumber.js";

const ABI = [
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "tkt_",
                "type": "bytes32"
            }
        ],
        "name": "getDeviceName",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "scenes_",
                "type": "uint16"
            }
        ],
        "name": "getDriverName",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name_",
                "type": "string"
            }
        ],
        "name": "setDeviceName",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "scenes_",
                "type": "uint16"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            }
        ],
        "name": "setDriverName",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
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
        "name": "setTokenRate",
        "outputs": [],
        "stateMutability": "nonpayable",
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
                "internalType": "string",
                "name": "name",
                "type": "string"
            }
        ],
        "name": "valid",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "cy",
                "type": "string"
            }
        ],
        "name": "withDraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

class Index extends SeroContract {

    constructor(address: string) {
        super(address, ABI);
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

    setDriverName = async (scenes: MinerScenes, name: string) => {
        return this.contract.packData("setDriverName", [scenes, name], true)
    }

    setDeviceName = async (name: string) => {
        return this.contract.packData("setDeviceName", [name], true)
    }

    getDeviceName = async (tkt: string): Promise<string> => {
        const ret: any = await this.call("getDeviceName", [tkt], "")
        return ret[0]
    }

    getDriverName = async (scenes: MinerScenes, from: string): Promise<string> => {
        const ret: any = await this.call("getDriverName", [scenes], from)
        return ret[0]
    }

}

const epochNameService = new Index(CONTRACT_ADDRESS.EPOCH.SERO.NAME_SERVICE)
export default epochNameService
