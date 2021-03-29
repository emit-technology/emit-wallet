import SeroContract from "../../SeroContract";
import {MinerScenes} from "../../../pages/epoch/miner";
import {DeviceInfo, UserInfo} from "./types";
import {CONTRACT_ADDRESS} from "../../../config";

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
    }
]
class Index extends SeroContract {

    constructor(address: string) {
        super(address, ABI);
    }

    prepare = async (scenes: MinerScenes, nonce: string) => {
        return this.contract.packData("prepare", [scenes, nonce], true)
    }

    done = async (scenes: MinerScenes) => {
        return this.contract.packData("done", [scenes], true)
    }

    userInfo = async (scenes: MinerScenes, from: string): Promise<UserInfo> => {
        const ret:any = await this.call("userInfo", [scenes], from)
        return ret[0]
    }

    axInfo = async (catg: string, tkt: string, from: string): Promise<DeviceInfo> => {
        const ret:any = await  this.call("axInfo", [catg, tkt], from)
        return ret[0]
    }

    lockedDevice = async (scenes: MinerScenes, from: string): Promise<DeviceInfo> => {
        const ret:any = await  this.call("lockedDevice", [scenes], from)
        return ret[0]
    }
}
const index = new Index(CONTRACT_ADDRESS.EPOCH.SERO.SERVICE)
export default index
