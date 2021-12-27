import EthContract from "../../EthContract";
import {ChainType, StarGridType} from "../../../types";
import {CONTRACT_ADDRESS} from "../../../config"
import BigNumber from "bignumber.js";
const ABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "operatorId_",
                "type": "uint256"
            }
        ],
        "name": "battle",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
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
                "name": "terms_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountIn_",
                "type": "uint256"
            }
        ],
        "name": "capture",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "current",
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
        "name": "lockedInfo",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "operatorId",
                "type": "uint256"
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
            }
        ],
        "stateMutability": "view",
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
                "name": "routes_",
                "type": "uint256"
            }
        ],
        "name": "move",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
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
                "name": "amountIn_",
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
                "name": "",
                "type": "uint256"
            }
        ],
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
        "name": "updateOperator",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

const ABI_OP = [
    {
        "inputs": [
            {
                "internalType": "uint8",
                "name": "typ_",
                "type": "uint8"
            }
        ],
        "name": "create",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
class StarGrid extends EthContract{

    constructor(address:string,abi:any) {
        super(address,abi,ChainType.BSC)
    }

    capture = async (operatorId:string,coordinate:string,terms:string,amountIn:BigNumber) =>{
        return this.contract.methods.capture(operatorId,coordinate,terms,amountIn.toString(10)).encodeABI()
    }
    captureCall = async (operatorId:string,coordinate:string,terms:string,amountIn:BigNumber) =>{
        return this.contract.methods.capture(operatorId,coordinate,terms,amountIn.toString(10)).call();
    }
    //hex 0000111 byte32
    move = async (routes:string) =>{
        return this.contract.methods.move(routes).encodeABI()
    }
    battle = async (operatorId:string) =>{
        return this.contract.methods.battle(operatorId).encodeABI()
    }
    prepare = async (amountIn:BigNumber,terms:string) =>{
        return this.contract.methods.prepare(amountIn.toString(10),terms).encodeABI()
    }
    //hex 0000111 byte32
    updateOperator = async (routes:string) =>{
        return this.contract.methods.updateOperator(routes).encodeABI()
    }
    settlement = async () =>{
        return this.contract.methods.settlement().encodeABI()
    }
    logout = async () =>{
        return this.contract.methods.logout().encodeABI()
    }
    current = async ():Promise<number> =>{
        const rest:any = await this.contract.methods.current().call()
        return rest;
    }
    lockedInfo = async ():Promise<Array<any>> =>{
        const rest:any = await this.contract.methods.lockedInfo().call()
        return rest;
    }
}
class OperatorFactoryProxy extends EthContract{
    constructor(address:string,abi:any) {
        super(address,abi,ChainType.BSC)
    }
    // function create(uint8 typ_) external returns(uint256);

    create = async (type:StarGridType) =>{
        return this.contract.methods.create(type).encodeABI()
    }
}
const epochStarGrid = new StarGrid(CONTRACT_ADDRESS.EPOCH.BSC.STAR_GRID_PROXY,ABI)
const epochStarGridOperator = new OperatorFactoryProxy(CONTRACT_ADDRESS.EPOCH.BSC.OPERATOR_FACTORY_PROXY,ABI_OP);

export{
    epochStarGrid,
    epochStarGridOperator
}