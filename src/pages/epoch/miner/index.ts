import MintWorker from "../../../worker/mintWorker";
const serojs = require('serojs');

export enum MintState {
    _,
    running,
    stop
}

export enum MinerScenes {
    _,
    altar,
    chaos
}

export interface MintData {
    accountScenes: string
    scenes:any
    phash: string
    address: string
    index: any
    accountId?: string
    hashseed?: string
    ne?: string
    nonce?: string
    timestamp?: number
    state?: MintState
}

class Miner {

    private accountId: string;
    private scenes: MinerScenes;
    private timeout: number;
    private miner:MintWorker;

    constructor(scenes:MinerScenes) {
        this.accountId = "";
        this.timeout = 30 * 1000;
        this.scenes =scenes;
        this.miner = new MintWorker(scenes);
    }

    setMiner = (accountId: string) => {
        this.accountId = accountId;
    }

    isMining = async (): Promise<boolean> => {
        const rest: MintData = await this.miner.mintState(this.uKey())
        console.log("isMining>> ",rest)
        if (rest && (rest.state == MintState.running && rest.timestamp && (Date.now() - rest.timestamp) < this.timeout)) {
            return true
        }
        return false
    }

    init = async () => {
        const rest: MintData = await this.miner.mintState(this.uKey())
        if (rest && rest.state == MintState.running) {
            if (rest.timestamp && (Date.now() - rest.timestamp) > this.timeout) {
                rest.nonce="";// reset nonce
                await this.miner.mintStart(rest)
            }
        }
    }

    start = async (data: MintData) => {
        // covert sero address by serojs getAddress;
        // data.accountId = this.accountId;
        data.scenes=this.scenes;
        data.accountScenes=this.uKey()
        const isMining = await this.isMining();
        console.log("isMining>>",isMining)
        if (!isMining) {
            await this.miner.mintStart(data)
            console.log("miner started!")
        }
    }

    stop = async () => {
        await this.miner.mintStop(this.uKey())
    }

    mintState = async ():Promise<MintData> =>{
        const rest: MintData = await this.miner.mintState(this.uKey())
        return rest
    }

    uKey = (k1?:string,k2?:string) =>{
        if(!k1 || !k2){
            return [this.accountId,this.scenes].join("_")
        }
        return [k1,k2].join("_")
    }

}


export default Miner


// import BigNumber from "bignumber.js";
// const BN = require("bn.js");
// const sha256 = require("sha256");
//
// const MAX_UINT256 = new BN(2).pow(new BN(256)).sub(new BN(1));
//
// function genHashSeed(_phash:string,_addr:string,_index:string):string {
//     const buf1 = Buffer.from(_phash.slice(2),"hex");
//     const buf2 = Buffer.from(_addr.slice(2), 'hex')
//     const buf3 = new BN(_index.slice(2),"hex").toArrayLike(Buffer,"be",8)
//     const bufA = Buffer.concat([buf1, buf2, buf3])
//     return sha256(bufA);
// }
//
// // function genHash(_hashSeed:string,_nonce:number,_blocknum:number):string {
// //     return sha256(_nonce,_hashSeed,_blocknum);
// // }
//
// function genDigest(_hashSeed:string,_nonce:Buffer):any {
//     const buf1 = Buffer.from(_hashSeed,"hex");
//     const bufA = Buffer.concat([buf1, _nonce])
//     const a = sha256(bufA);
//     const te = new BN(a,"hex").toArrayLike(Buffer,"be",64)
//     // console.log("genDigest>>> ",a,new BN(te).toString(10));
//     return new BN(te);
// }
//
// function calcNE(_hashSeed:string,_nonce:Buffer):string {
//     const digest = genDigest(_hashSeed,_nonce);
//     const num = MAX_UINT256.div(digest);
//     const buf = num.toArrayLike(Buffer,'be',8)
//     return new BN(buf).toString(10)
// }
// // 0x755ade57f4ab18877cc9ec90826bdbef2b00d9c90b11141fce4438a032a2cdec
// // 0x55141036a5b8335d64e92183281c9ebc15a33fff61ece4d258fd5116b898ff8c
//
// function test(index:string,nonce:string){
//     const _phash = "0x6643536dbd7163921fef7f59c2c75e876d176f8bdc9a154536acf72e4d3c9d64";
//     const _address = "0xBc149B2e61C169394C8d7Fd9bF4912B3B8C1c8E1";
//     const _index = "0x"+new BigNumber(index);
//     const hashseed = genHashSeed(_phash,_address,_index)
//     // console.log("hashseed:::",hashseed)
//     const buf = new BN(nonce.slice(2),"hex").toArrayLike(Buffer,"be",8);
//     const ne:any = calcNE(hashseed,buf);
//     // console.log("calcNE>>>> ",index,nonce,ne)
//     return ne;
// }
//
// let index = "0x1";
// let max = 0 ;
// let begin = Date.now();
// // let i = random(0,2**64) ;
// function run(){
//     let i = Math.floor(Math.random()*10**16)
//     // console.log("nonce>>",new BigNumber(i).toString(10))
//     const rest:any = test(index,"0x"+new BigNumber(i).toString(16))
//     if(new BigNumber(max).comparedTo(new BigNumber(rest)) == -1){
//         max = rest;
//         console.log(`index=[${index}], nonce=[${new BigNumber(i).toString(10)}], ne=[${max}], cost=[${(Date.now()-begin)/1000}]s`)
//         begin = Date.now();
//     }
//     start()
// }
//
// function random(min:number, max:number) {
//     return Math.floor(Math.random() * (max - min)) + min;
// }
//
// export function start(){
//     run()
// }
//
// // start()
//
