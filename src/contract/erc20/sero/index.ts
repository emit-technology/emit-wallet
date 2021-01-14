import {Erc20, ABI} from "../index";
import BigNumber from "bignumber.js";
import SeroContract from "../../SeroContract";

class Sero extends SeroContract implements Erc20{

    constructor(address: string) {
        super(address,ABI);
    }

    allowance = async (owner: string, spender: string): Promise<string> => {
        return await this.call("allowance",[owner,spender],owner)
    }

    approve = async (spender: string, value: BigNumber): Promise<any> => {
        return this.contract.packData("approve", [spender,"0x"+value.toString(16)], true)
    }

    balanceOf = async (who: string): Promise<number> =>{
        return await this.call("balanceOf",[who],who)
    }

    totalSupply = async (): Promise<number> => {
        return await this.call("totalSupply",[],"")
    }

    transfer = async (to: string, value: BigNumber): Promise<any> =>{
        return this.contract.packData("transfer", [to,"0x"+value.toString(16)], true)
    }

    transferFrom(from: string, to: string, value: BigNumber): Promise<any> {
        return this.contract.packData("transferFrom", [from,to,"0x"+value.toString(16)], true)
    }
}

export default Sero