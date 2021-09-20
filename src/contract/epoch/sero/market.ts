import SeroContract from "../../SeroContract";
import {CONTRACT_ADDRESS} from "../../../config";
import BigNumber from "bignumber.js";
import * as utils from '../../../utils/index'

const ABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "itemNo",
                "type": "uint256"
            }
        ],
        "name": "buy",
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
                "internalType": "string",
                "name": "cy",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "sell",
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
                "name": "itemNo",
                "type": "uint256"
            }
        ],
        "name": "withDraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

class Service extends SeroContract {

    constructor(address: string) {
        super(address, ABI);
    }

    sell = async (cy: string, price: BigNumber): Promise<any> => {
        return this.contract.packData("sell", [cy, utils.toHex(price)], true)
    }

    buy = async (itemNo: number): Promise<any> => {
        return this.contract.packData("buy", [itemNo], true)
    }

    withdraw = async (itemNo: number): Promise<any> => {
        return this.contract.packData("withDraw", [itemNo], true)
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

const epochMarketService = new Service(CONTRACT_ADDRESS.EPOCH.SERO.MARKET)

export default epochMarketService