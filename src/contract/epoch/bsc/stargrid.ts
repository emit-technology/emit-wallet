import EthContract from "../../EthContract";
import {ChainType, Counter, Land, LockedInfo, StarGridType} from "../../../types";
import {CONTRACT_ADDRESS} from "../../../config"
import BigNumber from "bignumber.js";
const ABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "cmd_",
                "type": "uint256"
            }
        ],
        "name": "active",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "baseCost",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "attachCost",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "opreratorId_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "coordinate_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "baseAmountIn_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "attachAmountIn_",
                "type": "uint256"
            }
        ],
        "name": "capture",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "baseCost",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "attachCost",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "logout",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "cooridnate_",
                "type": "uint256"
            }
        ],
        "name": "moveTo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "baseAmountIn_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "attachAmountIn_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "terms_",
                "type": "uint256"
            }
        ],
        "name": "prepare",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "baseCost",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "attachCost",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator_",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved_",
                "type": "bool"
            }
        ],
        "name": "setApproval",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "waterCoordinate_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "earthCoordinate_",
                "type": "uint256"
            }
        ],
        "name": "setDefaultCoordiante",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "settlement",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "routes_",
                "type": "uint256"
            }
        ],
        "name": "updateCounter",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const ABI_QUERY = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "counterId_",
                "type": "uint256"
            }
        ],
        "name": "counterInfo",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "counterType",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint8",
                        "name": "enType",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "counterId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "base",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "level",
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
                        "internalType": "uint256",
                        "name": "move",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "defense",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "force",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "luck",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "life",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "gene",
                        "type": "bytes32"
                    }
                ],
                "internalType": "struct IStarGridQuery.CounterInfo",
                "name": "ret",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "lockedInfo",
        "outputs": [
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "counterType",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint8",
                                "name": "enType",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "counterId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "base",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "level",
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
                                "internalType": "uint256",
                                "name": "move",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "defense",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "force",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "luck",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "life",
                                "type": "uint256"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "gene",
                                "type": "bytes32"
                            }
                        ],
                        "internalType": "struct IStarGridQuery.CounterInfo",
                        "name": "counter",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint64",
                        "name": "currentPeriod",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "nextSettlementPeriod",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "endPeriod",
                        "type": "uint64"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint8",
                                "name": "enType",
                                "type": "uint8"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "uint8",
                                        "name": "enType",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "uint64",
                                        "name": "period",
                                        "type": "uint64"
                                    },
                                    {
                                        "components": [
                                            {
                                                "internalType": "uint256",
                                                "name": "userNE",
                                                "type": "uint256"
                                            },
                                            {
                                                "internalType": "uint256",
                                                "name": "totalNE",
                                                "type": "uint256"
                                            },
                                            {
                                                "internalType": "uint256",
                                                "name": "totalEN",
                                                "type": "uint256"
                                            }
                                        ],
                                        "internalType": "struct IStarGridQuery.PeriodNE",
                                        "name": "base",
                                        "type": "tuple"
                                    },
                                    {
                                        "components": [
                                            {
                                                "internalType": "uint256",
                                                "name": "userNE",
                                                "type": "uint256"
                                            },
                                            {
                                                "internalType": "uint256",
                                                "name": "totalNE",
                                                "type": "uint256"
                                            },
                                            {
                                                "internalType": "uint256",
                                                "name": "totalEN",
                                                "type": "uint256"
                                            }
                                        ],
                                        "internalType": "struct IStarGridQuery.PeriodNE",
                                        "name": "attach",
                                        "type": "tuple"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "UserEN",
                                        "type": "uint256"
                                    }
                                ],
                                "internalType": "struct IStarGridQuery.PeriodUserNE[]",
                                "name": "userNEs",
                                "type": "tuple[]"
                            },
                            {
                                "internalType": "uint256",
                                "name": "baseCanUsed",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "attachCanUsed",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct IStarGridQuery.UserNEInfo",
                        "name": "userNEInfo",
                        "type": "tuple"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint8",
                                "name": "enType",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint64",
                                "name": "period",
                                "type": "uint64"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "uint256",
                                        "name": "userNE",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "totalNE",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "totalEN",
                                        "type": "uint256"
                                    }
                                ],
                                "internalType": "struct IStarGridQuery.PeriodNE",
                                "name": "base",
                                "type": "tuple"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "uint256",
                                        "name": "userNE",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "totalNE",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "totalEN",
                                        "type": "uint256"
                                    }
                                ],
                                "internalType": "struct IStarGridQuery.PeriodNE",
                                "name": "attach",
                                "type": "tuple"
                            },
                            {
                                "internalType": "uint256",
                                "name": "UserEN",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct IStarGridQuery.PeriodUserNE[]",
                        "name": "current",
                        "type": "tuple[]"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint8",
                                "name": "enType",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint64",
                                "name": "period",
                                "type": "uint64"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "uint256",
                                        "name": "userNE",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "totalNE",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "totalEN",
                                        "type": "uint256"
                                    }
                                ],
                                "internalType": "struct IStarGridQuery.PeriodNE",
                                "name": "base",
                                "type": "tuple"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "uint256",
                                        "name": "userNE",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "totalNE",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "totalEN",
                                        "type": "uint256"
                                    }
                                ],
                                "internalType": "struct IStarGridQuery.PeriodNE",
                                "name": "attach",
                                "type": "tuple"
                            },
                            {
                                "internalType": "uint256",
                                "name": "UserEN",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct IStarGridQuery.PeriodUserNE[]",
                        "name": "last",
                        "type": "tuple[]"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint8",
                                "name": "enType",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "user",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "total",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct IStarGridQuery.ResourceInfo[]",
                        "name": "resources",
                        "type": "tuple[]"
                    },
                    {
                        "internalType": "uint256",
                        "name": "unsettlement",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "userCoordinate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "userDefaultWaterCoordinate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "userDefaultEarthCoordinate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint64",
                        "name": "nextCaptureTime",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "nextOpTime",
                        "type": "uint64"
                    }
                ],
                "internalType": "struct IStarGridQuery.LockedInfo",
                "name": "ret",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "coordinate_",
                "type": "uint256"
            }
        ],
        "name": "planetInfo",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint8",
                        "name": "enType",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "coordinate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "marker",
                        "type": "address"
                    },
                    {
                        "internalType": "uint64",
                        "name": "birth",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint256",
                        "name": "level",
                        "type": "uint256"
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
                        "internalType": "bytes32",
                        "name": "gene",
                        "type": "bytes32"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "counterType",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint8",
                                "name": "enType",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "counterId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "base",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "level",
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
                                "internalType": "uint256",
                                "name": "move",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "defense",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "force",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "luck",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "life",
                                "type": "uint256"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "gene",
                                "type": "bytes32"
                            }
                        ],
                        "internalType": "struct IStarGridQuery.CounterInfo",
                        "name": "counter",
                        "type": "tuple"
                    }
                ],
                "internalType": "struct IStarGridQuery.PlanetInfo",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "planetRange",
        "outputs": [
            {
                "internalType": "int32",
                "name": "maxq",
                "type": "int32"
            },
            {
                "internalType": "int32",
                "name": "maxs",
                "type": "int32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const ABI_OP = [
    {
        "inputs": [
            {
                "internalType": "uint8",
                "name": "typ_",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "count",
                "type": "uint256"
            }
        ],
        "name": "create",
        "outputs": [
            {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "cost",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "depositTime",
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
                "internalType": "uint8",
                "name": "typ_",
                "type": "uint8"
            }
        ],
        "name": "estimate",
        "outputs": [
            {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "cost_unit",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "count",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "index_",
                "type": "uint256"
            }
        ],
        "name": "getRecords",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "uint8",
                        "name": "typ",
                        "type": "uint8"
                    },
                    {
                        "internalType": "address",
                        "name": "luidityToken",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "counterId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "unit",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint64",
                        "name": "create",
                        "type": "uint64"
                    }
                ],
                "internalType": "struct IOperatorFactory.Record",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "length",
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
        "name": "requiredeBase",
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
                "internalType": "uint256",
                "name": "index_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "counterId",
                "type": "uint256"
            }
        ],
        "name": "withDraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

class StarGrid extends EthContract{

    constructor(address:string,abi:any) {
        super(address,abi,ChainType.BSC)
    }

    // return (baseCost,attachCost)
    capture = async (operatorId:string,coordinate:string,baseAmountId:BigNumber, attachAmountIn:BigNumber,from?:string):Promise<string|Array<string>> =>{
        if(from){
           return  await this.contract.methods.capture(operatorId,coordinate,baseAmountId.toString(10),attachAmountIn.toString(10)).call({from:from})
        }
        return this.contract.methods.capture(operatorId,coordinate,baseAmountId.toString(10),attachAmountIn.toString(10)).encodeABI()
    }
    //hex 0000111 byte32, return (baseCost,attachCost)
    active = async (cmd:string,from?:string):Promise<string|Array<string>> =>{
        if(from){
            return await this.contract.methods.active(cmd).call({from:from})
        }
        return this.contract.methods.active(cmd).encodeABI()
    }

    moveTo = async (cooridnate:string) =>{
        return this.contract.methods.moveTo(cooridnate).encodeABI()
    }

    prepare = async (baseAmountIn:BigNumber,attachAmountIn:BigNumber,terms:number,from?:string):Promise<string|Array<string>> =>{
        if(from){
            return await this.contract.methods.prepare(baseAmountIn.toString(10), attachAmountIn.toString(10) ,terms).call({from:from});
        }
        return this.contract.methods.prepare(baseAmountIn.toString(10), attachAmountIn.toString(10) ,terms).encodeABI()
    }
    //hex 0000111 byte32 16 bytes,  1 move, 2 defense, 3 attack , 4 luck
    updateCounter = async (routes:string) =>{
        return this.contract.methods.updateCounter(routes).encodeABI()
    }

    // function setApproval(address operator_,bool approved_) external;
    setApproval = async (address:string,bool:boolean) =>{
        console.log(address,bool,"setApproval");
        return this.contract.methods.setApproval(address,bool).encodeABI()
    }

    settlement = async () =>{
        return this.contract.methods.settlement().encodeABI()
    }

    logout = async () =>{
        return this.contract.methods.logout().encodeABI()
    }

    //for user setting default coo
    setDefaultCoordiante = (waterCoo:string,earthCoo:string) =>{
        return this.contract.methods.setDefaultCoordiante(waterCoo,earthCoo).encodeABI();
    }

}
class OperatorFactoryProxy extends EthContract{
    constructor(address:string,abi:any) {
        super(address,abi,ChainType.BSC)
    }
    // function create(uint8 typ_) external returns(uint256);

    create = async (type:StarGridType,count:number,from?:string) =>{
        if(from){
           return await this.contract.methods.create(type,count).call({from:from})
        }
        return this.contract.methods.create(type,count).encodeABI()
    }

    withDraw = async (type:StarGridType,counterId:string) =>{
        return this.contract.methods.withDraw(type,counterId).encodeABI()
    }

}

class StarGridQuery extends EthContract{
    constructor(address:string,abi:any) {
        super(address,abi,ChainType.BSC)
    }

    // function planetRange()external view returns(int32 maxq,int32 maxs);
    planetRange = async (from:string):Promise<Array<any>> =>{
       return await this.contract.methods.planetRange().call({from:from});
    }

    planetInfo = async (coordinate:string,from:string):Promise<Land> =>{
        return await this.contract.methods.planetInfo(coordinate).call({from:from});
    }

    counterInfo = async (counterId:string,from:string):Promise<Counter> =>{
        return await this.contract.methods.counterInfo(counterId).call({from:from});
    }

    lockedInfo = async (from:string):Promise<LockedInfo> =>{
        return await this.contract.methods.lockedInfo().call({from:from});
    }
}

const epochStarGrid = new StarGrid(CONTRACT_ADDRESS.EPOCH.BSC.STAR_GRID_PROXY,ABI)
const epochStarGridOperator = new OperatorFactoryProxy(CONTRACT_ADDRESS.EPOCH.BSC.OPERATOR_FACTORY_PROXY,ABI_OP);
const epochStarGridQuery = new StarGridQuery(CONTRACT_ADDRESS.EPOCH.BSC.STAR_GRID_PROXY_QUERY,ABI_QUERY);

export{
    epochStarGrid,
    epochStarGridOperator,
    epochStarGridQuery
}