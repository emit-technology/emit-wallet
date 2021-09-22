import SeroContract from "../../SeroContract";
import {MinerScenes} from "../../../pages/epoch/miner";
import {PoolTask} from "./types";
import {CONTRACT_ADDRESS} from "../../../config";
import BigNumber from "bignumber.js";

const ABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint64",
                "name": "taskId",
                "type": "uint64"
            },
            {
                "indexed": true,
                "internalType": "uint64",
                "name": "period",
                "type": "uint64"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "targetNE",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "reward",
                "type": "uint256"
            }
        ],
        "name": "SettlementEvent",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint64",
                "name": "taskId",
                "type": "uint64"
            }
        ],
        "name": "TaskEvent",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "taskId_",
                "type": "uint64"
            },
            {
                "internalType": "string",
                "name": "taskName_",
                "type": "string"
            },
            {
                "internalType": "uint16",
                "name": "scenes_",
                "type": "uint16"
            },
            {
                "internalType": "uint64",
                "name": "begin_",
                "type": "uint64"
            },
            {
                "internalType": "uint64",
                "name": "end_",
                "type": "uint64"
            },
            {
                "internalType": "uint256",
                "name": "reward_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "targetNE_",
                "type": "uint256"
            }
        ],
        "name": "addTask",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "taskId",
                "type": "uint64"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "currentPeriod",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "",
                "type": "uint64"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "taskId_",
                "type": "uint64"
            }
        ],
        "name": "getTask",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint16",
                        "name": "scenes",
                        "type": "uint16"
                    },
                    {
                        "internalType": "uint64",
                        "name": "begin",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "end",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "lastSettlement",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint256",
                        "name": "targetNE",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "reward",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct IPool.Task",
                "name": "task",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "lastPeriod",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "",
                "type": "uint64"
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
                "internalType": "uint64",
                "name": "taskId_",
                "type": "uint64"
            }
        ],
        "name": "taskPImage",
        "outputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "uint16",
                "name": "scenes_",
                "type": "uint16"
            },
            {
                "internalType": "uint64",
                "name": "serial",
                "type": "uint64"
            },
            {
                "internalType": "bytes32",
                "name": "phash",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "minNE",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

class Pool extends SeroContract{

    constructor(address:string) {
        super(address,ABI);
    }

    //uint64 taskId,uint256 reward
    addTask = async (taskId:number,taskName:string,scenes:MinerScenes,beginPeriod:number,endPeriod:number,reward:string,targetNE:string) : Promise<any> =>{
        return this.contract.packData("addTask", [taskId, taskName,scenes,beginPeriod,endPeriod,reward,targetNE], true)
    }

    getTask = async (taskId:number) :Promise<PoolTask>=>{
        const rest: any = await this.call("getTask", [taskId], "");
        return rest[0]
    }

    //address owner,uint16 scenes_,uint64 serial,bytes32 phash
    taskPImage = async (taskId:number,from:string):Promise<Array<any>> =>{
        const rest: any = await this.call("taskPImage", [taskId], from);
        return rest
    }

    //return number
    currentPeriod = async ():Promise<number> =>{
        const rest: any = await this.call("currentPeriod", [], "");
        return parseInt(rest[0])
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

const epochPoolService = new Pool(CONTRACT_ADDRESS.EPOCH.SERO.POOL_SERVICE)

export default epochPoolService