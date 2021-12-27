import * as React from "react";
import {createRef} from "react";
import {
    add as addHex,
    axialCoordinatesToCube,
    calcCounterRgb,
    containHex,
    directions,
    gridGenerator,
    Hex,
    Hexagon,
    HexGrid,
    HexInfo,
    HexText,
    neighboor,
    noCounter,
    OrientationsEnum,
    PathCustom,
    reachableHexes,
    reachableHexesNeighbor,
    testHexGrids,
    toAxial,
    toUINT256
} from "../../../components/hexagons";
import {
    IonButton,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonItem,
    IonItemDivider,
    IonLabel,
    IonList,
    IonLoading,
    IonModal,
    IonPage,
    IonText,
    IonTitle,
    IonToast,
    IonToolbar
} from '@ionic/react';
import {
    add,
    arrowBackCircleOutline,
    arrowDownCircleOutline,
    arrowForwardCircleOutline,
    arrowUpCircleOutline,
    chevronBack,
    remove,
} from 'ionicons/icons';
import './index.scss';
import starGridRpc from "../../../rpc/epoch/stargrid";
import walletWorker from "../../../worker/walletWorker";
import {ChainType, Counter, Land, NftInfo, StarGridType, Transaction} from "../../../types";
import url from "../../../utils/url";
import EthToken from "../../../contract/erc20/eth";
import * as config from "../../../config";
import * as utils from "../../../utils";
import ConfirmTransaction from "../../../components/ConfirmTransaction";
import Erc721 from "../../../contract/erc721/meta/eth";
import BigNumber from "bignumber.js";
import rpc from "../../../rpc";
import {epochStarGrid, epochStarGridOperator} from "../../../contract/epoch/bsc";
import interVar from "../../../interval";
import HexInfoCard from "./hex-info";

interface ApproveState{
    bLIGHT:boolean
    WATER:boolean
    EARTH:boolean
}

interface State{
    hexSize:number
    targetHex:Array<HexInfo>
    absoluteHex?:Hex
    recRange:Array<number>
    rangeLand:Array<Land>
    approvedStarGridState:ApproveState
    approvedOperatorState:ApproveState
    approvedStarGrid:boolean
    showModalApprove:boolean
    showLoading:boolean
    showConfirm:boolean
    showToast:boolean
    showInfo:boolean
    toastMessage?:string
    tx?:any
    counters:Array<Counter>
    showPosition:boolean
    showApproveAllModal:boolean
    txs:Array<Transaction>
    userPositions:Map<string,boolean>
}
export const yellowColors = ["e8dda7","e8dda6","e8dca5","e7dca4","e7dba3","e7dba2","e6daa1","e6d99f","e5d99e","e5d89c","e4d79b","e4d799","e4d698","e3d696","e3d595","e3d594","e3d593","e3d492","e2d492","e2d391","e2d390","e2d290","e2d290","e2d190","e1d190","e1d090","e0d090","e0cf91","dfcf91","dfce92","decd92","decd93","ddcc93","dccb94","dccb94","dbca95","dac995","d9c896","d9c896","d8c796","d7c696","d7c596","d6c596","d6c496","d5c396","d5c396","d4c296","d4c295","d3c195","d3c194","d3c094","d2c093","d2bf93","d2bf92","d1be92","d1be91","d0bd91","d0bd90","d0bc90","cfbc8f","cfbb8f","cfbb8f","cebb8e","ceba8e","cdba8d","cdb98d","cdb98c","ccb98c","ccb88b","ccb88b","ccb78a","cbb78a","cbb789","cbb689","cbb688","cab588","cab587","cab487","c9b486","c9b386","c8b285","c8b285","c7b184","c7b184","c7b083","c6af82","c6af81","c5ae81","c5ad80","c5ad80","c5ac7f","c5ac7e","c5ab7e","c5ab7d","c5aa7d","c5aa7d","c5a97c","c5a97c","c5a87b","c5a87b","c5a87b","c5a77b","c5a77b","c5a67a","c5a67a","c5a67a","c5a679","c5a579","c5a578","c6a578","c6a578","c7a577","c7a577","c8a576","c8a476","c9a475","c9a475","caa474","caa373","caa373","cba372","cba272","cba271","cba171","cba170","cba06f","cba06e","ca9f6e","ca9e6d","ca9e6c","ca9d6b","c99c6b","c99b6a","c99a69","c89969","c89868","c89767","c79667","c79566","c69465","c59364","c59264","c49163","c39062","c28f61","c18e61","c08c60","be8b5f","bd8a5f","bc895e","bb885d","ba875d","b8855c","b7845c","b6835b","b4825b","b3815a","b1805a","b07f5a","ae7e59","ad7d59","ab7c59","aa7b58","a87a58","a77957","a57857","a37857","a27757","a07657","9e7557","9d7557","9b7457","9a7357","997357","977256","967156","957055","946f55","926f54","916e54","906c53","8f6b53","8e6a52","8c6952","8b6851","8a6750","886650","87654f","86644e","84634e","83624d","82614c","80604c","7f5f4b","7e5e4a","7c5d4a","7b5c49","7a5b48","795a48","785a47","775946","765846","755745","745745","745644","735644","735543","725543","725442","725442","725341","725341","725240","725240","72513f","72513f","73503e","734f3d","734f3d","744e3c","744d3b","754d3a","754c3a","754b39","764a38","764937","764936","764835","764735","764634","754633","754532","744432","734431","724331","714230","704230","6f412f","6e412f","6d402e","6b3f2e","6a3f2d","693e2c","683d2c","673d2b","663c2a","653b2a","653b29","643a28","633a28","633927","623926","623826","613725","613725","613724"];
export const blueColors = ["c4cadc","c4cadb","c3c9db","c2c9da","c1c8da","c1c8da","c0c7d9","bec7d9","bdc6d9","bcc6d9","bbc5d9","b9c5d9","b8c4d9","b6c4d9","b5c3d9","b3c3d9","b2c2d9","b0c2d9","afc1d9","adc1d9","acc0d9","aac0d9","a9bfd9","a8bed9","a6bed9","a5bdd9","a4bdd9","a3bcd9","a2bbd9","a0bbd9","9fbad9","9ebad9","9dbad9","9bb9d9","9ab9d9","99b8d9","97b8d9","96b8d9","94b7d8","93b7d8","92b7d8","90b7d8","8fb7d8","8eb6d8","8db6d8","8bb5d8","8ab5d8","89b4d8","88b4d8","87b3d8","86b3d8","85b3d8","84b2d8","83b2d8","82b1d8","80b1d8","7fb0d8","7eb0d8","7dafd8","7cafd8","7baed8","7aaed8","78add8","77add8","76add8","74acd8","73acd8","72acd9","71abd9","70abd9","6fabd9","6eabd9","6dabd9","6caad9","6baad9","6aa9d9","69a9d8","69a9d8","68a8d8","67a8d8","66a7d8","65a7d8","65a7d8","64a6d8","63a6d8","62a6d8","61a5d8","60a5d8","5fa5d8","5ea4d8","5ea4d8","5da4d8","5ca4d8","5ca4d8","5ba3d8","5aa3d8","5aa2d8","59a2d8","58a2d8","58a1d8","57a1d8","56a0d8","56a0d8","55a0d8","549fd8","549fd8","539fd8","529ed8","519ed8","519ed8","509ed8","4f9ed8","4f9dd8","4e9dd8","4e9dd8","4d9cd8","4d9cd8","4c9bd8","4c9bd8","4b9bd8","4b9ad8","4b9ad8","4a9ad8","4a99d8","4999d8","4999d8","4998d8","4898d8","4797d8","4797d8","4696d8","4696d8","4596d8","4496d8","4495d8","4395d8","4394d8","4294d8","4293d8","4293d8","4192d8","4191d8","4091d8","3f90d8","3f8fd8","3e8ed8","3e8dd8","3d8cd8","3c8bd8","3c8ad8","3b89d8","3a88d8","3a86d8","3985d8","3884d8","3782d8","3781d8","367fd8","357dd8","357bd8","3479d8","3377d8","3375d8","3273d8","3270d8","316ed8","316cd8","306bd8","2f69d8","2f67d9","2e66d9","2e64d9","2d62d9","2d61d9","2c60d9","2c5fd9","2c5ed9","2b5dd9","2b5cd9","2b5bd9","2b5ad9","2a5ad9","2a59d9","2a58d9","2958d9","2957d9","2957d9","2956d9","2856d9","2856d9","2855d9","2855d8","2754d8","2754d8","2754d8","2753d8","2653d8","2653d8","2652d8","2652d8","2552d8","2551d8","2551d8","2550d8","2450d8","244fd8","244fd8","244ed8","234ed8","234dd8","234dd8","224dd8","224cd8","224cd8","224cd8","214bd8","214bd8","214bd8","214bd8","204ad8","204ad8","204ad8","1f49d8","1f49d8","1e48d8","1e48d8","1d47d8","1d47d8","1c47d8","1c46d8","1b46d8","1b45d8","1b45d8","1a45d8","1a44d8","1944d8","1944d8","1843d8","1843d8","1743d8","1742d8","1642d8","1642d8","1542d8","1542d8","1441d8","1441d8","1341d8","1341d8","1240d8","1140d8","1140d8","1040d8","0f40d8","0f40d8","0e40d8"];
const chain = ChainType.BSC;
class StarGrid extends React.Component<any, State>{

    position:any = {
        x:createRef(),
        z:createRef()
    }

    state:State = {
        hexSize:3,
        targetHex:[],
        absoluteHex:axialCoordinatesToCube(0x10000,-0x10000),
        recRange:[(8-3)*8+3,(8-3)*8+3],
        rangeLand:[],
        approvedStarGridState:{
            bLIGHT:false,WATER:false,EARTH:false
        },
        approvedOperatorState:{
            bLIGHT:false,WATER:false,EARTH:false
        },
        approvedStarGrid:false,
        showConfirm:false,
        showToast:false,
        showLoading:false,
        showModalApprove:false,
        counters:[],
        showPosition:false,
        showInfo:false,
        showApproveAllModal:false,
        txs:[],
        userPositions:new Map<string, boolean>()
    }
    componentDidMount() {
        testHexGrids()
        interVar.start(()=>{
            this.init().catch(e=>{
                console.error(e)
            })
        },5*1000)
    }

    init = async ()=>{
        const {absoluteHex,recRange} = this.state;
        await this.queryApprove();

        const account = await walletWorker.accountInfo();
        const owner = account.addresses[chain];
        const userPosition = await starGridRpc.userPositions(owner,10);
        // console.log(userPosition,"userPosition");

        const uMap:Map<string,boolean> = new Map<string, boolean>()
        if(userPosition){
            for(let p of userPosition){
                uMap.set(toAxial(p.coordinate).uKey(),true)
            }
        }
        const leftBottom = axialCoordinatesToCube(absoluteHex.x-recRange[0],absoluteHex.z+recRange[1]);
        const rightTop = axialCoordinatesToCube(absoluteHex.x+recRange[0],absoluteHex.z-recRange[1]);
        const rangeLand = await starGridRpc.rangeLand(toUINT256(leftBottom),toUINT256(rightTop));

        await this.getCounters()
        console.log("uMap",uMap);
        if(rangeLand){
            this.setState({
                rangeLand:rangeLand,
                userPositions:uMap
            })
        }
    }

    getCounters = async ()=>{
        const nfts = await rpc.getTicket(chain,"")
        if(nfts){
            const infos:Array<NftInfo> = nfts["OPERATOR"];
            if(!infos || infos.length==0){
                return
            }
            const counters:Array<Counter> = [];
            for(let info of infos){
                const counter = await starGridRpc.counter(info.tokenId)
                counters.push(counter)
            }
            this.setState({
                counters:counters
            })
        }
    }

    queryApprove = async ()=>{
        const {approvedOperatorState,approvedStarGridState} = this.state;
        const keys = Object.keys(approvedStarGridState);
        const account = await walletWorker.accountInfo();
        let approved = true;
        const owner = account.addresses[chain];
        for(let cy of keys){
            const token: EthToken = new EthToken(config.CONTRACT_ADDRESS.ERC20.BSC[cy], chain);
            {
                const rest: any = await token.allowance(owner, config.CONTRACT_ADDRESS.EPOCH.BSC.STAR_GRID_PROXY);
                const allowance = utils.fromValue(rest, utils.getCyDecimal(cy, ChainType[chain])).toNumber();
                if(allowance>0){
                    approvedStarGridState[cy]=true
                }
            }
            {
                const rest: any = await token.allowance(owner, config.CONTRACT_ADDRESS.EPOCH.BSC.OPERATOR_FACTORY_PROXY);
                const allowance = utils.fromValue(rest, utils.getCyDecimal(cy, ChainType[chain])).toNumber();
                if(allowance>0){
                    approvedOperatorState[cy]=true
                }
            }
        }
        const contract: Erc721 = new Erc721(config.CONTRACT_ADDRESS.ERC721.COUNTER.ADDRESS.BSC,chain);
        const approveAll = await contract.isApprovedForAll(owner,config.CONTRACT_ADDRESS.EPOCH.BSC.STAR_GRID_PROXY)
        for(let cy of keys){
           if(!approvedStarGridState[cy] || !approvedOperatorState[cy]){
               approved = false
               break;
           }
        }
        this.setState({
            approvedStarGrid:approveAll,
            approvedStarGridState:approvedStarGridState,
            approvedOperatorState:approvedOperatorState,
            showModalApprove:!approved || !approveAll
        })
    }

    genApproveTx = async (cy?:string,spender?:string)=>{
        const account = await walletWorker.accountInfo();
        const owner = account.addresses[chain]
        if(cy&&spender){
            const owner = account.addresses[chain]
            const contractAddress = config.CONTRACT_ADDRESS.ERC20.BSC[cy];
            const token: EthToken = new EthToken(contractAddress, chain);
            const data = await token.approve(spender,utils.toValue(1e9,18));

            const tx: Transaction = {
                from: owner,
                to: contractAddress ,
                value: "0x0",
                cy: utils.defaultCy(chain),
                gasPrice: "0x" + new BigNumber(await utils.defaultGasPrice(chain)).multipliedBy(1e9).toString(16),
                chain: chain,
                amount: "0x0",
                feeCy: utils.defaultCy(chain),
                data:data
            }
            tx.gas = await token.estimateGas(tx)
            return tx;
        }else{
            const contractAddress = config.CONTRACT_ADDRESS.ERC721.COUNTER.ADDRESS.BSC;
            const contract: Erc721 = new Erc721(contractAddress,chain);
            const data = await contract.setApprovalForAll(config.CONTRACT_ADDRESS.EPOCH.BSC.STAR_GRID_PROXY,true)
            const tx: Transaction = {
                from: owner,
                to: contractAddress ,
                value: "0x0",
                cy: utils.defaultCy(chain),
                gasPrice: "0x" + new BigNumber(await utils.defaultGasPrice(chain)).multipliedBy(1e9).toString(16),
                chain: chain,
                amount: "0x0",
                feeCy: utils.defaultCy(chain),
                data:data
            }
            tx.gas = await contract.estimateGas(tx)
            return tx;
        }
    }
    approveToStarGridProxy = async (cy:string,spender:string)=>{

        const tx = await this.genApproveTx(cy,spender);
        this.setState({
            tx:tx,
            showConfirm:true
        })
    }
    approveToStarGrid = async ()=>{
        const tx = await this.genApproveTx();
        this.setState({
            tx:tx,
            showConfirm:true
        })
    }

    approveAll = async ()=>{
        const {approvedStarGridState,approvedOperatorState} = this.state;
        const txs:Array<Transaction> = [];
        for(let v of Object.keys(approvedStarGridState)){
            if(approvedStarGridState[v]){
               continue
            }
            const tx = await this.genApproveTx(v,config.CONTRACT_ADDRESS.EPOCH.BSC.STAR_GRID_PROXY)
            txs.push(tx)
        }
        for(let v of Object.keys(approvedOperatorState)){
            if(approvedOperatorState[v]){
                continue
            }
            const tx = await this.genApproveTx(v,config.CONTRACT_ADDRESS.EPOCH.BSC.OPERATOR_FACTORY_PROXY)
            txs.push(tx)
        }
        {
            const tx = await this.genApproveTx();
            txs.push(tx)
        }

        this.setState({
            txs:txs,
            showApproveAllModal:true
        })
    }

    commitApproveTxs = async ()=>{
        const {txs} = this.state;
        for(let tx of txs){
           const hash =  await rpc.commitTx(tx,"");
           await this.waitHash(hash)
           await this.queryApprove()
        }
    }

    waitHash = async (hash:string)=>{
        rpc.getTxInfo(chain, hash).then(rest => {
            if (rest) {
                return Promise.resolve(true)
            }else{
                setTimeout(()=>{
                    this.waitHash(hash).catch(e=>{
                        const err = typeof e == "string"?e:e.message;
                        return Promise.reject(err)
                    });
                },1*1000)
            }
        }).catch((e: any) => {
            const err = typeof e == "string"?e:e.message;
            return Promise.reject(err)
        })
    }

    create = async (type:StarGridType)=>{
        const account = await walletWorker.accountInfo();
        const owner = account.addresses[chain]
        const data = await epochStarGridOperator.create(type)
        const tx: Transaction = {
            from: owner,
            to: epochStarGridOperator.address ,
            value: "0x0",
            cy: utils.defaultCy(chain),
            gasPrice: "0x" + new BigNumber(await utils.defaultGasPrice(chain)).multipliedBy(1e9).toString(16),
            chain: chain,
            amount: "0x0",
            feeCy: utils.defaultCy(chain),
            data:data
        }
        tx.gas = await epochStarGridOperator.estimateGas(tx)

        this.setState({
            tx:tx,
            showConfirm:true
        })
    }

    capture = async ()=>{
        const {counters,targetHex} = this.state;
        let coo:Hex|undefined;
        if(targetHex.length == 1){
          coo = targetHex[0].hex
        }
        const account = await walletWorker.accountInfo();
        const owner = account.addresses[chain]
        const hex = toUINT256(coo)
        console.log("axiaHEX",hex)
        const data = await epochStarGrid.capture(counters[0].id,hex,"1",utils.toValue(10,18))
        const tx: Transaction = {
            from: owner,
            to: epochStarGrid.address ,
            value: "0x0",
            cy: utils.defaultCy(chain),
            gasPrice: "0x" + new BigNumber(await utils.defaultGasPrice(chain)).multipliedBy(1e9).toString(16),
            chain: chain,
            amount: "0x0",
            feeCy: utils.defaultCy(chain),
            data:data
        }
        tx.gas = await epochStarGrid.estimateGas(tx)

        this.setState({
            tx:tx,
            showConfirm:true
        })
    }

    logout = async ()=>{
        const account = await walletWorker.accountInfo();
        const owner = account.addresses[chain]
        const data = await epochStarGrid.logout()
        const tx: Transaction = {
            from: owner,
            to: epochStarGrid.address ,
            value: "0x0",
            cy: utils.defaultCy(chain),
            gasPrice: "0x" + new BigNumber(await utils.defaultGasPrice(chain)).multipliedBy(1e9).toString(16),
            chain: chain,
            amount: "0x0",
            feeCy: utils.defaultCy(chain),
            data:data
        }
        tx.gas = await epochStarGrid.estimateGas(tx)

        this.setState({
            tx:tx,
            showConfirm:true
        })
    }

    settlement = async ()=>{
        const account = await walletWorker.accountInfo();
        const owner = account.addresses[chain]
        const data = await epochStarGrid.settlement()
        const tx: Transaction = {
            from: owner,
            to: epochStarGrid.address ,
            value: "0x0",
            cy: utils.defaultCy(chain),
            gasPrice: "0x" + new BigNumber(await utils.defaultGasPrice(chain)).multipliedBy(1e9).toString(16),
            chain: chain,
            amount: "0x0",
            feeCy: utils.defaultCy(chain),
            data:data
        }
        tx.gas = await epochStarGrid.estimateGas(tx)

        this.setState({
            tx:tx,
            showConfirm:true
        })
    }

    move = async ()=>{
        const {targetHex} = this.state;
        if(targetHex.length <=1){
            this.setShowToast(true,"No step to move!")
            return
        }
        const routers:Array<number>=[];
        for(let i=1;i<targetHex.length;i++){
            const start = targetHex[i-1].hex;
            const hex = targetHex[i].hex;
            let rd = 6;
            for(let dir =0;dir<6;dir++){
                //@ts-ignore
                const neighbor = neighboor(start,dir)
                if(neighbor.equalHex(hex)){
                    rd = dir;
                    break
                }
            }
            if(rd == 6){
                this.setShowToast(true,"Not neighbor")
                return
            }
            routers.push(rd)
        }
        routers.push(6)
        //TODO use Buffer instead
        const routerstr = [];
        for(let rd of routers){
            if(rd == 0 || rd == 1){
                routerstr.push(`00${rd.toString(2)}`)
            }else if(rd == 2 || rd == 3){
                routerstr.push(`0${rd.toString(2)}`)
            }else{
                routerstr.push(rd.toString(2))
            }
        }
        routerstr.reverse();

        const account = await walletWorker.accountInfo();
        const owner = account.addresses[chain]
        const data = await epochStarGrid.move("0x"+new BigNumber(routerstr.join(""),2).toString(16))
        console.log("0x"+new BigNumber(routerstr.join(""),2).toString(16),"routers>>>>");
        const tx: Transaction = {
            from: owner,
            to: epochStarGrid.address ,
            value: "0x0",
            cy: utils.defaultCy(chain),
            gasPrice: "0x" + new BigNumber(await utils.defaultGasPrice(chain)).multipliedBy(1e9).toString(16),
            chain: chain,
            amount: "0x0",
            feeCy: utils.defaultCy(chain),
            data:data
        }
        tx.gas = await epochStarGrid.estimateGas(tx)

        this.setState({
            tx:tx,
            showConfirm:true
        })
    }

    prepare = async ()=>{
        const account = await walletWorker.accountInfo();
        const owner = account.addresses[chain]
        const data = await epochStarGrid.prepare(utils.toValue(10,18),"1")
        const tx: Transaction = {
            from: owner,
            to: epochStarGrid.address ,
            value: "0x0",
            cy: utils.defaultCy(chain),
            gasPrice: "0x" + new BigNumber(await utils.defaultGasPrice(chain)).multipliedBy(1e9).toString(16),
            chain: chain,
            amount: "0x0",
            feeCy: utils.defaultCy(chain),
            data:data
        }
        tx.gas = await epochStarGrid.estimateGas(tx)

        this.setState({
            tx:tx,
            showConfirm:true
        })
    }

    attack = async (opId:string)=>{
        const account = await walletWorker.accountInfo();
        const owner = account.addresses[chain]
        const data = await epochStarGrid.battle(opId)
        const tx: Transaction = {
            from: owner,
            to: epochStarGrid.address ,
            value: "0x0",
            cy: utils.defaultCy(chain),
            gasPrice: "0x" + new BigNumber(await utils.defaultGasPrice(chain)).multipliedBy(1e9).toString(16),
            chain: chain,
            amount: "0x0",
            feeCy: utils.defaultCy(chain),
            data:data
        }
        tx.gas = await epochStarGrid.estimateGas(tx)

        this.setState({
            tx:tx,
            showConfirm:true
        })
    }

    setHexSize = (n:number)=>{

        if(n<1){
            n = 1;
        }
        if(n>6){
            n=6
        }
        this.setState({
            hexSize:n
        })
    }

    handleStart = (e:any,data:any)=>{
    }
    handleDrag = (e:any,data:any)=>{
        // console.log(e,data)
    }
    handleStop = (e:any,dragEndData:any)=> {
    }

    arrow=(t:string)=>{
        let {absoluteHex} = this.state;
        if("u" == t){
            absoluteHex = addHex(addHex(absoluteHex,directions[0]),directions[5]);
        }else if ("d" == t){
            absoluteHex = addHex(addHex(absoluteHex,directions[2]),directions[3]);
        }else if ("r" == t){
            absoluteHex = addHex(addHex(absoluteHex,directions[1]),directions[1]);
        }else if ("l" == t){
            absoluteHex = addHex(addHex(absoluteHex,directions[4]),directions[4]);
        }
        this.setState({
            absoluteHex:absoluteHex
        })
    }

    // dark background
    // d97a00    e2d000
    // f8c21f      e5e598

    setTarget = (h:HexInfo):Array<HexInfo> =>{
        const {targetHex} = this.state;
        const originLen = targetHex.length;

        if(originLen == 1 && noCounter(targetHex[0])){
            if(targetHex[0].hex.equalHex(h.hex)){
                return [];
            }else{
                return [h]
            }
        }else {
            let t:Array<HexInfo>=targetHex;
            if(originLen>0 && targetHex[originLen-1].hex.equalHex(h.hex) ){
                t = targetHex.slice(0,originLen-1)
            }else{
                for(let i = 0 ;i<targetHex.length;i++){
                    if(targetHex[i].hex.equalHex(h.hex)){
                        t=targetHex.slice(0,i)
                        break
                    }
                }
                t.push(h)
            }
            return t;
        }
    }

    selectTarget = (f:boolean, hex?:HexInfo)=>{
        if(hex){
            const tHex = this.setTarget(hex)
            this.setState({
                showInfo:f,
                targetHex: tHex
            })
        }else{
            this.setState({
                showInfo: f,
            })
        }
    }

    setShowModalApprove = (f:boolean)=>{
        this.setState({
            showModalApprove:f
        })
    }

    setShowLoading = (f:boolean)=>{
        this.setState({
            showLoading:f
        })
    }

    setShowConfirm = (f:boolean)=>{
        this.setState({
            showConfirm:f
        })
    }

    setShowToast(f:boolean,m?:string){
        this.setState({
            showToast:f,
            toastMessage:m
        })
    }

    setShowPosition=(f:boolean)=>{
        this.setState({
            showPosition:f
        })
    }

    confirm = async (hash: string) => {
        let intervalId: any = 0;
        this.setShowLoading(true);
        intervalId = setInterval(() => {
            rpc.getTxInfo(chain, hash).then(rest => {
                if (rest) {
                    clearInterval(intervalId)
                    this.setShowLoading(false);
                    this.init().catch(e=>{
                        console.error(e)
                    })
                }
            }).catch((e: any) => {
                this.setShowLoading(false);
                console.error(e);
            })
        }, 1000)
    }

    convertHex = (hex:Hex):Hex =>{
        const {absoluteHex} = this.state;
        return axialCoordinatesToCube(hex.x+absoluteHex.x,hex.z+absoluteHex.z);
    }

    containHexInfo = (arr:Array<HexInfo>,hex:Hex)=>{
        for(let h of arr){
            if(h.hex.equalHex(hex)){
                return true
            }
        }
        return false
    }



    render() {
        const {hexSize,targetHex,userPositions,showInfo,txs,showApproveAllModal,approvedOperatorState,approvedStarGridState,
            showPosition,approvedStarGrid,showModalApprove,showLoading,showConfirm,recRange,
            showToast,toastMessage,tx,counters,rangeLand} = this.state;
        const hexagons = gridGenerator.rectangle(recRange[0],recRange[1], true,true );
        let contentStyle = {width:`${1*100}vw`,height:`${1*100}vh`};
        {
            // (0,136,207)       (124,0,214)
            // (47,187,246)      (162,57,255)

        }
console.log("render...");
        const mp:Map<string,number> = new Map<string, number>();
        for(let dir =0;dir <6;dir++){
            // @ts-ignore
            // const neighbor = neighboor(axialCoordinatesToCube(0,0),dir);
            // mp.set(neighbor.uKey(),dir+1);
        }
        let movement = 0;
        if(targetHex && targetHex.length>0){
            const selectedHex = targetHex[0];
            if(selectedHex.counter){
                movement = new BigNumber(selectedHex.counter.move).toNumber()
            }
        }
        if (movement>recRange[0]){
           // movement = Math.floor(recRange[0]/2);
        }
        const reachHexesGlobal:Array<Hex> = reachableHexes(movement,mp,targetHex,Math.floor(recRange[0]/2));
        const reachHexes:Array<Hex> = reachableHexesNeighbor(movement,mp,targetHex);
        const lv = [30,35,40,45,50,55,60,65,70,75,80,85,90,95,100];

        const yellows=[];
        const blues=[];
        const pieceColors = [];

        const counterMap:Map<string,Land> = new Map<string, Land>();

        if(rangeLand && rangeLand.length>0){
            for(let l of rangeLand){
                const coo = toAxial(l.coordinate);
                const i = Math.floor(utils.fromValue(l.capacity,18).toNumber())
                if(l.type == StarGridType.WATER){
                    blues.push(blueColors[i])
                }else if(l.type == StarGridType.EARTH){
                    yellows.push(yellowColors[i])
                }
                if(l.operator){
                    const rate = Math.floor(utils.fromValue( l.operator.rate,16).toNumber());
                    const bg = calcCounterRgb(rate,l.operator.type == StarGridType.EARTH);
                    pieceColors.push([ `rgb(${bg[0]})`,`rgb(${bg[1]})`])
                }
                counterMap.set(coo.uKey(),l)
            }
        }

        let totalGas = new BigNumber(0) ;
        for(let tx of txs){
           totalGas = new BigNumber(tx.gas).plus(new BigNumber(totalGas))
        }

        return (
            <>
                <IonPage>
                    <IonHeader mode="ios">
                        <IonToolbar mode="ios" color="primary">
                            <IonIcon src={chevronBack} slot="start" size="large" onClick={()=>{url.back()}}/>
                            <IonTitle>Star Grid</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent fullscreen >
                        <IonFab vertical="bottom" horizontal="end" slot="fixed">
                            <IonFabButton onClick={()=>this.setHexSize(hexSize+1)}>
                                <IonIcon icon={add} />
                            </IonFabButton>
                            <IonFabButton color="secondary" onClick={()=>this.setHexSize(hexSize-1)}>
                                <IonIcon icon={remove} />
                            </IonFabButton>
                        </IonFab>
                        <IonFab vertical="top" horizontal="center" slot="fixed">
                            <IonFabButton onClick={()=>{this.arrow("u")}} size="small">
                                <IonIcon icon={arrowUpCircleOutline} />
                            </IonFabButton>
                        </IonFab>
                        <IonFab vertical="bottom" horizontal="center" slot="fixed">
                            <IonFabButton onClick={()=>{this.arrow("d")}} size="small">
                                <IonIcon icon={arrowDownCircleOutline} />
                            </IonFabButton>
                        </IonFab>
                        <IonFab vertical="center" horizontal="start" slot="fixed">
                            <IonFabButton onClick={()=>{this.arrow("l")}} size="small">
                                <IonIcon icon={arrowBackCircleOutline} />
                            </IonFabButton>
                        </IonFab>
                        <IonFab vertical="center" horizontal="end" slot="fixed">
                            <IonFabButton onClick={()=>{this.arrow("r")}} size="small">
                                <IonIcon icon={arrowForwardCircleOutline} />
                            </IonFabButton>
                        </IonFab>
                        {
                            targetHex[0] &&
                            <div className="counter-info">
                                <HexInfoCard sourceHexInfo={targetHex[0]} attackHexInfo={targetHex.length>1 && targetHex[targetHex.length-1]}/>
                            </div>
                        }

                        <div className="content-grid" style={contentStyle}>
                            {/*<Draggable*/}
                            {/*    axis="both"*/}
                            {/*    handle=".wrapped"*/}
                            {/*    defaultPosition={{x: 0, y: 0}}*/}
                            {/*    position={undefined}*/}
                            {/*    // grid={[25, 25]}*/}
                            {/*    scale={1}*/}
                            {/*    onStart={this.handleStart}*/}
                            {/*    onDrag={this.handleDrag}*/}
                            {/*    onStop={this.handleStop}>*/}

                            <div className="wrapped">
                                {
                                    // @ts-ignore
                                    <HexGrid
                                        width="100%"
                                        height="100%"
                                        hexSize={hexSize}
                                        origin={{ x: 0, y: 0}}
                                        orientation={OrientationsEnum.pointy}
                                        spacing={1.17}
                                        colorsDefs={{
                                            colorsBlue:blues,
                                            colorsYellow:yellows,
                                            pieceColors:pieceColors
                                        }}
                                    >
                                        // @ts-ignore
                                        {
                                            hexagons && hexagons.map((hex, i) => {
                                                const absHex = this.convertHex(hex);
                                                const block = containHex(reachHexes,absHex)
                                                const attack = targetHex && targetHex.length>0&&this.containHexInfo(targetHex,absHex) && targetHex.length>0 && !absHex.equalHex(targetHex[0].hex);
                                                const movable = containHex(reachHexesGlobal,absHex)
                                                const focus = targetHex.length>0&&absHex.equalHex(targetHex[0].hex)
                                                let piece:any = undefined;
                                                let landStyle:string = ""

                                                let land:Land|undefined;
                                                if(counterMap.has(absHex.uKey())){
                                                    land = counterMap.get(absHex.uKey())
                                                    const i = Math.floor(utils.fromValue(land.capacity,18).toNumber())
                                                    if(land.type == StarGridType.WATER){
                                                        landStyle = blueColors[i]
                                                    }else if(land.type == StarGridType.EARTH){
                                                        landStyle = yellowColors[i]
                                                    }
                                                    if(land.operator){
                                                        const p = counterMap.get(absHex.uKey());
                                                        const bg = calcCounterRgb(Math.floor(utils.fromValue(p.rate,16).toNumber()),p.type == StarGridType.EARTH);
                                                        piece = {
                                                            style:p.type == StarGridType.WATER?"white":"black",
                                                            backgroundColor: [ `rgb(${bg[0]})`,`rgb(${bg[1]})`]
                                                        }
                                                    }
                                                }

                                                return <Hexagon
                                                    focus={focus}
                                                    flag={userPositions.get(absHex.uKey())}
                                                    block={block&&!absHex.equalHex(targetHex[0].hex)}
                                                    attack={attack} key={i}
                                                    colorStyle={landStyle}
                                                    movable={movable}
                                                    counter={piece}
                                                    onClick={(id, coordinates, e)=>{
                                                        (targetHex.length>0 && targetHex[0].land && targetHex[0].land.operator&&(block||absHex.equalHex(targetHex[0].hex)||attack) || targetHex.length==0 || targetHex.length==1&&(targetHex.length>0 && (!targetHex[0].land || !targetHex[0].land.operator))) &&
                                                        this.selectTarget(true,{hex:this.convertHex(coordinates),land:land,counter:land&&land.operator});
                                                        console.log(e,e.clientX,e.movementX,e.pageX,e.screenX,e.nativeEvent.x,e.nativeEvent.y)
                                                        e.stopPropagation();
                                                    }} id={i} coordinates={hex}
                                                >
                                                    <HexText className="hex-text">
                                                        {/*{hex.x+absoluteHex.x},*/}
                                                        {/*{hex.z+absoluteHex.z}*/}
                                                    </HexText>
                                                </Hexagon>
                                            } )}
                                        {targetHex && targetHex.length>1 &&<PathCustom pathHex={targetHex} />}
                                    </HexGrid>
                                }

                            </div>
                            {/*</Draggable>*/}
                            <div className="gis-info">
                                <IonButton color="primary" size="small" onClick={()=>{
                                    this.create(StarGridType.EARTH).catch(e=>{
                                        const err = typeof e == "string"?e:e.message;
                                        this.setShowToast(true,err)
                                        console.error(e)});
                                }}>Create</IonButton>
                                <IonButton color="primary" size="small" onClick={()=>{
                                    this.capture().catch(e=>{
                                        const err = typeof e == "string"?e:e.message;
                                        this.setShowToast(true,err)
                                        console.error(e)});
                                }}>Capture</IonButton>
                                <IonButton color="primary" size="small" onClick={()=>{
                                    this.logout().catch(e=>{
                                        const err = typeof e == "string"?e:e.message;
                                        this.setShowToast(true,err)
                                        console.error(e)});
                                }}>Logout</IonButton>
                                <IonButton color="primary" size="small" onClick={()=>{
                                    this.settlement().catch(e=>{
                                        const err = typeof e == "string"?e:e.message;
                                        this.setShowToast(true,err)
                                        console.error(e)})
                                }}>Settlement</IonButton>
                                <IonButton color="primary" size="small" onClick={()=>{
                                    this.prepare().catch(e=>{
                                        const err = typeof e == "string"?e:e.message;
                                        this.setShowToast(true,err)
                                        console.error(e)})
                                }}>Prepare</IonButton>
                                <IonButton color="primary" size="small" onClick={()=>{
                                    this.move().catch(e=>{
                                        const err = typeof e == "string"?e:e.message;
                                        this.setShowToast(true,err)
                                        console.error(e)})
                                }}>Move</IonButton>
                                <IonButton color="primary" size="small" onClick={()=>{
                                    this.attack("").catch(e=>{
                                        const err = typeof e == "string"?e:e.message;
                                        this.setShowToast(true,err)
                                        console.error(e)})
                                }}>Attack</IonButton>
                                <IonButton color="primary" size="small" onClick={()=>{
                                    this.setShowPosition(true)
                                }}>Position</IonButton>
                            </div>
                        </div>

                        <IonModal
                            mode="ios"
                            isOpen={showModalApprove}
                            cssClass='epoch-rank-modal'
                            swipeToClose={true}
                            onDidDismiss={() => this.setShowModalApprove(false)}>
                            <IonList>
                                <IonItemDivider>
                                    <IonLabel>Approved to Star Grid</IonLabel>
                                </IonItemDivider>
                                {
                                    Object.keys(approvedStarGridState).map((v)=>{
                                        return <IonItem>
                                            <IonLabel>{v}</IonLabel>
                                            <IonText>{approvedStarGridState[v]?"approved":<IonButton size="small" color="primary" onClick={()=>{
                                                this.approveToStarGridProxy(v,config.CONTRACT_ADDRESS.EPOCH.BSC.STAR_GRID_PROXY).catch(e=>{
                                                    const err = typeof e == "string"?e:e.message;
                                                    this.setShowToast(true,err)
                                                    console.error(e)
                                                })
                                            }}>Approve</IonButton>}</IonText>
                                        </IonItem>
                                    })
                                }
                                <IonItemDivider>
                                    <IonLabel>Approved to Operator</IonLabel>
                                </IonItemDivider>
                                {
                                    Object.keys(approvedOperatorState).map((v)=>{
                                        return <IonItem>
                                            <IonLabel>{v}</IonLabel>
                                            <IonText>{approvedOperatorState[v]?"approved":<IonButton size="small" color="primary" onClick={()=>{
                                                this.approveToStarGridProxy(v,config.CONTRACT_ADDRESS.EPOCH.BSC.OPERATOR_FACTORY_PROXY).catch(e=>{
                                                    const err = typeof e == "string"?e:e.message;
                                                    this.setShowToast(true,err)
                                                    console.error(e)
                                                })
                                            }}>Approve</IonButton>}</IonText>
                                        </IonItem>
                                    })
                                }
                                <IonItem>
                                    <IonLabel>Approved Counter</IonLabel>
                                    <IonText>{approvedStarGrid?"approved":<IonButton size="small" color="primary" onClick={()=>{
                                        this.approveToStarGrid().catch(e=>{
                                            const err = typeof e == "string"?e:e.message;
                                            this.setShowToast(true,err)
                                            console.error(e)
                                        })
                                    }}>Approve</IonButton>}</IonText>
                                </IonItem>
                            </IonList>
                            <IonButton onClick={()=>{
                               this.approveAll().catch(e=>{
                                   const err = typeof e == "string"?e:e.message;
                                   this.setShowToast(true,err)
                                   console.log(e)
                               });
                            }}>Approve All</IonButton>
                        </IonModal>

                        <IonModal
                            mode="ios"
                            isOpen={showPosition}
                            cssClass='epoch-rank-modal'
                            swipeToClose={true}
                            onDidDismiss={() => this.setShowPosition(false)}>
                            <IonList>
                                <IonItemDivider>
                                    <IonLabel>Set Position</IonLabel>
                                </IonItemDivider>
                                <IonItem>
                                    <IonLabel>X</IonLabel>
                                    <input ref={this.position.x}/>
                                </IonItem>
                                <IonItem>
                                    <IonLabel>Y</IonLabel>
                                    <input ref={this.position.z}/>
                                </IonItem>
                                <IonButton onClick={()=>{
                                    console.log(this.position)
                                    const x = this.position.x.current.value;
                                    const z = this.position.z.current.value;
                                    const a = axialCoordinatesToCube(parseInt(x),parseInt(z));
                                    this.setState({
                                        absoluteHex:a,
                                        showPosition:false,
                                        targetHex:[{hex:a}]
                                    })
                                    setTimeout(()=>{
                                        this.init()
                                    },100)

                                }}>OK</IonButton>
                            </IonList>
                        </IonModal>

                        <IonModal
                            mode="ios"
                            isOpen={showApproveAllModal}
                            cssClass='epoch-rank-modal'
                            swipeToClose={true}
                            onDidDismiss={() => this.setShowPosition(false)}>
                            {
                                txs && txs.length>0 &&
                                <IonList>
                                    <IonItemDivider>
                                        <IonLabel>Gas</IonLabel>
                                    </IonItemDivider>
                                    {
                                        txs.map(v=>{
                                            return <IonItem>
                                                <IonLabel>{v.to}</IonLabel>
                                                <IonLabel>{new BigNumber(v.gas).toString(10)}</IonLabel>
                                            </IonItem>
                                        })
                                    }

                                    <IonItemDivider>
                                        <IonLabel>Total</IonLabel>
                                    </IonItemDivider>
                                    <IonItem>
                                        <IonLabel>Gas</IonLabel>
                                        <IonLabel>
                                            {totalGas.toString(10)}
                                        </IonLabel>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel>Gas Price</IonLabel>
                                        <IonLabel>{new BigNumber(txs[0].gasPrice).toString(10)}</IonLabel>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel>Amount</IonLabel>
                                        <IonLabel>{utils.fromValue(totalGas.multipliedBy(new BigNumber(txs[0].gasPrice)),18).toString(10)} BNB</IonLabel>
                                    </IonItem>
                                </IonList>
                            }

                            <IonButton onClick={()=>{

                                this.commitApproveTxs().catch(e=>{
                                    console.error(e)
                                    const err = typeof e == "string"?e:e.message;
                                    this.setShowToast(true,err)
                                })
                            }}>Commit</IonButton>
                        </IonModal>

                        <IonToast
                            color={"danger"}
                            position="top"
                            isOpen={showToast}
                            onDidDismiss={() => this.setShowToast(false)}
                            message={toastMessage}
                            duration={2500}
                            mode="ios"
                        />

                        <IonLoading
                            mode="ios"
                            spinner={"bubbles"}
                            cssClass='my-custom-class'
                            isOpen={showLoading}

                            onDidDismiss={() => this.setShowLoading(false)}
                            message={'Please wait...'}
                            duration={120000}
                        />

                        <ConfirmTransaction show={showConfirm} transaction={tx} onProcess={(f) => {
                        }} onCancel={() => this.setShowConfirm(false)} onOK={this.confirm}/>

                    </IonContent>
                </IonPage>
            </>

        );
    }
}

export default StarGrid