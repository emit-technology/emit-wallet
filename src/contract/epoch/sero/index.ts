import SeroContract from "../../SeroContract";
import {MinerScenes} from "../../../pages/epoch/miner";
import {DeviceInfo, DriverInfo, Period, UserInfo} from "./types";
import {CONTRACT_ADDRESS} from "../../../config";
import BigNumber from "bignumber.js";

const ABI = [
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
        "name": "axInfo",
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
                        "name": "last",
                        "type": "uint64"
                    }
                ],
                "internalType": "struct Types.DeviceInfo",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "scenes",
                "type": "uint16"
            }
        ],
        "name": "done",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "scenes",
                "type": "uint16"
            }
        ],
        "name": "driverInfo",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
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
                        "name": "rate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "gene",
                        "type": "bytes32"
                    }
                ],
                "internalType": "struct Types.DriverInfo",
                "name": "",
                "type": "tuple"
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
        "name": "lockedDevice",
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
                        "name": "last",
                        "type": "uint64"
                    }
                ],
                "internalType": "struct Types.DeviceInfo",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "minPowNE",
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
                "internalType": "uint16",
                "name": "scenes",
                "type": "uint16"
            },
            {
                "internalType": "uint64",
                "name": "nonce",
                "type": "uint64"
            }
        ],
        "name": "prepare",
        "outputs": [],
        "stateMutability": "payable",
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
                "internalType": "uint16",
                "name": "scenes",
                "type": "uint16"
            }
        ],
        "name": "userInfo",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint16",
                        "name": "scenes",
                        "type": "uint16"
                    },
                    {
                        "internalType": "uint64",
                        "name": "settlementPeriod",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "currentPeriod",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "lastUpdateTime",
                        "type": "uint64"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint64",
                                "name": "serial",
                                "type": "uint64"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "hash",
                                "type": "bytes32"
                            }
                        ],
                        "internalType": "struct Types.PImage",
                        "name": "pImage",
                        "type": "tuple"
                    },
                    {
                        "components": [
                            {
                                "internalType": "string",
                                "name": "name",
                                "type": "string"
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
                                "name": "rate",
                                "type": "uint256"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "gene",
                                "type": "bytes32"
                            }
                        ],
                        "internalType": "struct Types.DriverInfo",
                        "name": "driver",
                        "type": "tuple"
                    }
                ],
                "internalType": "struct Types.UserInfo",
                "name": "",
                "type": "tuple"
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
            },
            {
                "internalType": "uint64",
                "name": "period_",
                "type": "uint64"
            }
        ],
        "name": "userPeriodInfo",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "ne",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "total",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "pool",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Types.Period[]",
                "name": "_periods",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
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

    prepare = async (scenes: MinerScenes, nonce: string) => {
        return this.contract.packData("prepare", [scenes, nonce], true)
    }

    done = async (scenes: MinerScenes) => {
        return this.contract.packData("done", [scenes], true)
    }

    userInfo = async (scenes: MinerScenes, from: string): Promise<UserInfo> => {
        const ret: any = await this.call("userInfo", [scenes], from)
        return ret[0]
    }

    axInfo = async (catg: string, tkt: string, from: string): Promise<DeviceInfo> => {
        const ret: any = await this.call("axInfo", [catg, tkt], from)
        return ret[0]
    }

    lockedDevice = async (scenes: MinerScenes, from: string): Promise<DeviceInfo> => {
        const ret: any = await this.call("lockedDevice", [scenes], from)
        return ret[0]
    }

    userPeriodInfo = async (scenes: MinerScenes,period:number, from: string): Promise<Array<Period>> => {
        const ret: any = await this.call("userPeriodInfo", [scenes,period], from)
        return ret[0]
    }

    minPowNE = async (): Promise<string> => {
        const ret: any = await this.call("minPowNE", [], "")
        return ret[0]
    }

    driverInfo = async (scenes: MinerScenes, from: string): Promise<DriverInfo> => {
        const ret: any = await this.call("driverInfo", [scenes], from)
        return ret[0]
    }

}

const index = new Index(CONTRACT_ADDRESS.EPOCH.SERO.SERVICE)
export default index
