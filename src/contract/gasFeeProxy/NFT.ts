/**
 * Copyright 2020 EMIT Foundation.
 This file is part of E.M.I.T. .

 E.M.I.T. is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 E.M.I.T. is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with E.M.I.T. . If not, see <http://www.gnu.org/licenses/>.
 */
import SeroContract from "../SeroContract";
import BigNumber from "bignumber.js";
import {TokenRate} from "./index";

const ABI_GAS_FEE_PROXY = [
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
        "name": "depositNFT",
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
                "name": "eusdtAmount",
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
                "internalType": "address",
                "name": "to",
                "type": "address"
            }
        ],
        "name": "transfer",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
]

class GasFeeProxyNFT extends SeroContract {

    constructor(contractAddress:string) {
        super(contractAddress,ABI_GAS_FEE_PROXY);
    }

    tokenRate = async ():Promise<TokenRate>=>{
        const rest:any = await this.call("tokenRate", [],"");
        if(rest){
            return {
                feeAmount:new BigNumber(rest[0]),
                seroAmount:new BigNumber(rest[1])
            }
        }
        return {
            feeAmount:new BigNumber(1),
            seroAmount:new BigNumber(1)
        }
    }

    transfer = async (to:string):Promise<string>=>{
        return this.contract.packData("transfer", [to], true)
    }

    depositNFT = async (destinationChainID:number,resourceId: string, recipient:string): Promise<string> => {
        console.log(destinationChainID,resourceId,recipient,"depositNFT")
        return this.contract.packData("depositNFT", [destinationChainID,resourceId,recipient], true)
    }

}

export default GasFeeProxyNFT