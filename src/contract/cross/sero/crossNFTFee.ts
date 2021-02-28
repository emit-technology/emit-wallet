import SeroContract from "../../SeroContract";


const ABI = [
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "resourceID",
                "type": "bytes32"
            }
        ],
        "name": "getFeeInfo",
        "outputs": [
            {
                "internalType": "string",
                "name": "cy",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "minAmount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "resourceID",
                "type": "bytes32"
            },
            {
                "internalType": "string",
                "name": "cy",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "minAmount",
                "type": "uint256"
            }
        ],
        "name": "setFeeInfo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

class SRC721CrossFee extends SeroContract{

    constructor(address:string) {
        super(address,ABI);
    }

    getFeeInfo = async (resourceId: string): Promise<string> => {
        const rest:any = await this.call("getFeeInfo", [resourceId],"");
        return rest;
    }

}

export default SRC721CrossFee