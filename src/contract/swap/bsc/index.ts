import EthContract from "../../EthContract";
import {ChainType} from "@emit-technology/emit-lib";
import BigNumber from "bignumber.js";
import * as utils from '../../../utils';
import {PANCAKE_SWAP_CONFIG} from "../../../config";

const ABI: any = [
    {
        "inputs": [],
        "name": "WETH",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "crossLimit",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "min",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "max",
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
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            },
            {
                "internalType": "bytes",
                "name": "crossReceipt",
                "type": "bytes"
            },
            {
                "internalType": "bool",
                "name": "out",
                "type": "bool"
            }
        ],
        "name": "estimatSwapCross",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "ammouts",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256",
                "name": "crossFee",
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
                "name": "amountOut",
                "type": "uint256"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "crossReceipt",
                "type": "bytes"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "swapETHForExactTokens",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountOutMin",
                "type": "uint256"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "crossReceipt",
                "type": "bytes"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "swapExactETHForTokens",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountOutMin",
                "type": "uint256"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "swapExactTokensForETH",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountOutMin",
                "type": "uint256"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "crossReceipt",
                "type": "bytes"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "swapExactTokensForTokens",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountInMax",
                "type": "uint256"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "swapTokensForExactETH",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountInMax",
                "type": "uint256"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "crossReceipt",
                "type": "bytes"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "swapTokensForExactTokens",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

class SwapContract extends EthContract {

    constructor(address: string, chain: ChainType) {
        super(address, ABI, chain);
    }

    WETH = async (): Promise<string> => {
        return await this.contract.methods.WETH().call()
    }

    swapExactTokensForTokens = async (
        amountIn: BigNumber, amountOutMin: BigNumber,
        path: Array<string>, to: string,
        crossReceipt: string, deadline: number
    ): Promise<string> => {
        return this.contract.methods.swapExactTokensForTokens(utils.toHex(amountIn), utils.toHex(amountOutMin), path, to, crossReceipt, deadline).encodeABI()
    }

    swapTokensForExactTokens = async (
        amountOut: BigNumber, amountInMax: BigNumber,
        path: Array<string>, to: string,
        crossReceipt: string, deadline: number
    ): Promise<string> => {
        return this.contract.methods.swapTokensForExactTokens(utils.toHex(amountOut), utils.toHex(amountInMax), path, to, crossReceipt, deadline).encodeABI()
    }

    swapExactETHForTokens = async (
        amountOutMin: BigNumber,
        path: Array<string>, to: string,
        crossReceipt: string, deadline: number
    ): Promise<string> => {
        return this.contract.methods.swapExactETHForTokens(utils.toHex(amountOutMin), path, to, crossReceipt, deadline).encodeABI()
    }

    swapTokensForExactETH = async (
        amountOut: BigNumber, amountInMax: BigNumber,
        path: Array<string>, to: string, deadline: number
    ): Promise<string> => {
        return this.contract.methods.swapTokensForExactETH(utils.toHex(amountOut),utils.toHex(amountInMax), path, to, deadline).encodeABI()
    }

    swapExactTokensForETH = async (
        amountIn: BigNumber, amountOutMin: BigNumber,
        path: Array<string>, to: string, deadline: number
    ): Promise<string> => {
        return this.contract.methods.swapExactTokensForETH(utils.toHex(amountIn),utils.toHex(amountOutMin), path, to, deadline).encodeABI()
    }

    swapETHForExactTokens = async (
        amountOut: BigNumber,
        path: Array<string>, to: string,crossReceipt:string, deadline: number
    ): Promise<string> => {
        return this.contract.methods.swapETHForExactTokens(utils.toHex(amountOut), path, to,crossReceipt, deadline).encodeABI()
    }

    estimatSwapCross = async (amount: BigNumber,path: Array<string>, crossReceipt: string, out: boolean): Promise<Array<any>> => {
        return await this.contract.methods.estimatSwapCross(utils.toHex(amount),path,crossReceipt,out).call()
    }

    crossLimit = async (tokenAddress:string): Promise<Array<any>> => {
        const rest =  await this.contract.methods.crossLimit(tokenAddress).call()
        return rest
    }

}

const pancakeSwap = new SwapContract(PANCAKE_SWAP_CONFIG.ADDRESS,ChainType.BSC)

export default pancakeSwap