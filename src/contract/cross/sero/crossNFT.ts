import BigNumber from "bignumber.js";
import SeroContract from "../../SeroContract";


const ABI = [
    {
        "inputs": [],
        "name": "_chainID",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
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
    }
]

class CrossNFT extends SeroContract{

    constructor(address:string) {
        super(address,ABI);
    }

    depositNFT = async (destinationChainID:number,resourceId: string, recipient:string): Promise<string> => {
        return this.contract.packData("depositNFT", [destinationChainID,resourceId,recipient], true)
    }

}

export default CrossNFT