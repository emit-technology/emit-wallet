import SeroContract from "../../SeroContract";

const ABI = [
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tktId",
                "type": "uint256"
            }
        ],
        "name": "ticket",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "tkt",
                "type": "bytes32"
            }
        ],
        "name": "ticketId",
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
                "internalType": "bytes32",
                "name": "tkt",
                "type": "bytes32"
            }
        ],
        "name": "ticketURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

class Sero extends SeroContract {

    constructor(address: string) {
        super(address, ABI);
    }
    /**
     * @dev Returns the token collection name.
     */
    name = async (): Promise<string> => {
        return await this.call("name", [], "")
    }
    /**
     * @dev Returns the token collection symbol.
     */
    symbol = async (): Promise<string> => {
        return await this.call("symbol", [], "")
    }
    /**
     * @dev Returns the Uniform Resource Identifier (URI) for `tokenId` token.
     */
    tokenURI = async (tokenId: string): Promise<string> => {
        return await this.call("ticketURI", [tokenId], "")
    }

    totalSupply = async (): Promise<string> => {
        return await this.call("totalSupply", [], "")
    }

    ticketId = async (tokenId:string): Promise<any> => {
        return await this.call("ticketId", [tokenId], "")
    }

    ticket = async (tokenId:number): Promise<any> => {
        return await this.call("ticket", [tokenId], "")
    }

}

export default Sero