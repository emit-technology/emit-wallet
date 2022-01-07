import * as React from "react";
import {createRef} from "react";
import {
    axialCoordinatesToCube,
    calcCounterRgb,
    containHex,
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
    toOpCode,
    toUINT256
} from "../../../components/hexagons";
import {
    IonButton,
    IonContent,
    IonFab,
    IonFabButton,
    IonFabList,
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
    addCircleOutline,
    arrowBackCircleOutline,
    arrowDownCircleOutline,
    arrowForwardCircleOutline,
    arrowUpCircleOutline,
    cardOutline,
    cashOutline,
    chevronBack,
    expandOutline,
    logOut,
    remove,
    search,
} from 'ionicons/icons';
import './index.scss';
import starGridRpc from "../../../rpc/epoch/stargrid";
import walletWorker from "../../../worker/walletWorker";
import {AccountModel, ChainType, Counter, Land, LockedInfo, NftInfo, StarGridType, Transaction} from "../../../types";
import url from "../../../utils/url";
import EthToken from "../../../contract/erc20/eth";
import * as config from "../../../config";
import * as utils from "../../../utils";
import ConfirmTransaction from "../../../components/ConfirmTransaction";
import Erc721 from "../../../contract/erc721/meta/eth";
import BigNumber from "bignumber.js";
import rpc from "../../../rpc";
import {epochStarGrid, epochStarGridOperator, epochStarGridQuery} from "../../../contract/epoch/bsc";
import interVar from "../../../interval";
import HexInfoCard from "./hex-info";
import EthContract from "../../../contract/EthContract";
import {CounterList} from "./CounterList";
import {CounterAdd} from "./CounterAdd";
import {FeeModal} from "./FeeModal";
import {Settlement} from "./Settlement";
import {ApprovalUsersModal} from "./ApprovalUsers";
import {Prepare} from "./Prepare";
import selfStorage from "../../../utils/storage";
import {PowerDistribution} from "./PowerDistrbution";
import Countdown from "react-countdown";
import {CountDown} from "../../../components/countdown";

interface ApproveState{
    bLIGHT:boolean
    WATER:boolean
    EARTH:boolean
    bDARK:boolean
    "EARTH-BUSD-LQ":boolean
    "WATER-BUSD-LQ":boolean
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
    account?:AccountModel
    btnRef:any
    showCounterList:boolean
    showCounterAdd:boolean
    feeData?:any;
    feeOk?:any;
    feeCancel?:any;
    lockedInfo?:LockedInfo
    showApprovalUserModal:boolean
    showSettlementModal:boolean
    showPrepareModal:boolean
    mp:Map<string,number>
    activeLeft:boolean
    activeBottom:boolean
    showPowerDistribution:boolean,

    dragXY:Array<number>

    amountTitle1?:any,
    amountTitle2?:any,

    balanceMap?: any
}
export const yellowColors = ["e8dda7","e8dda6","e8dca5","e7dca4","e7dba3","e7dba2","e6daa1","e6d99f","e5d99e","e5d89c","e4d79b","e4d799","e4d698","e3d696","e3d595","e3d594","e3d593","e3d492","e2d492","e2d391","e2d390","e2d290","e2d290","e2d190","e1d190","e1d090","e0d090","e0cf91","dfcf91","dfce92","decd92","decd93","ddcc93","dccb94","dccb94","dbca95","dac995","d9c896","d9c896","d8c796","d7c696","d7c596","d6c596","d6c496","d5c396","d5c396","d4c296","d4c295","d3c195","d3c194","d3c094","d2c093","d2bf93","d2bf92","d1be92","d1be91","d0bd91","d0bd90","d0bc90","cfbc8f","cfbb8f","cfbb8f","cebb8e","ceba8e","cdba8d","cdb98d","cdb98c","ccb98c","ccb88b","ccb88b","ccb78a","cbb78a","cbb789","cbb689","cbb688","cab588","cab587","cab487","c9b486","c9b386","c8b285","c8b285","c7b184","c7b184","c7b083","c6af82","c6af81","c5ae81","c5ad80","c5ad80","c5ac7f","c5ac7e","c5ab7e","c5ab7d","c5aa7d","c5aa7d","c5a97c","c5a97c","c5a87b","c5a87b","c5a87b","c5a77b","c5a77b","c5a67a","c5a67a","c5a67a","c5a679","c5a579","c5a578","c6a578","c6a578","c7a577","c7a577","c8a576","c8a476","c9a475","c9a475","caa474","caa373","caa373","cba372","cba272","cba271","cba171","cba170","cba06f","cba06e","ca9f6e","ca9e6d","ca9e6c","ca9d6b","c99c6b","c99b6a","c99a69","c89969","c89868","c89767","c79667","c79566","c69465","c59364","c59264","c49163","c39062","c28f61","c18e61","c08c60","be8b5f","bd8a5f","bc895e","bb885d","ba875d","b8855c","b7845c","b6835b","b4825b","b3815a","b1805a","b07f5a","ae7e59","ad7d59","ab7c59","aa7b58","a87a58","a77957","a57857","a37857","a27757","a07657","9e7557","9d7557","9b7457","9a7357","997357","977256","967156","957055","946f55","926f54","916e54","906c53","8f6b53","8e6a52","8c6952","8b6851","8a6750","886650","87654f","86644e","84634e","83624d","82614c","80604c","7f5f4b","7e5e4a","7c5d4a","7b5c49","7a5b48","795a48","785a47","775946","765846","755745","745745","745644","735644","735543","725543","725442","725442","725341","725341","725240","725240","72513f","72513f","73503e","734f3d","734f3d","744e3c","744d3b","754d3a","754c3a","754b39","764a38","764937","764936","764835","764735","764634","754633","754532","744432","734431","724331","714230","704230","6f412f","6e412f","6d402e","6b3f2e","6a3f2d","693e2c","683d2c","673d2b","663c2a","653b2a","653b29","643a28","633a28","633927","623926","623826","613725","613725","613724"];
export const blueColors = ["c4cadc","c4cadb","c3c9db","c2c9da","c1c8da","c1c8da","c0c7d9","bec7d9","bdc6d9","bcc6d9","bbc5d9","b9c5d9","b8c4d9","b6c4d9","b5c3d9","b3c3d9","b2c2d9","b0c2d9","afc1d9","adc1d9","acc0d9","aac0d9","a9bfd9","a8bed9","a6bed9","a5bdd9","a4bdd9","a3bcd9","a2bbd9","a0bbd9","9fbad9","9ebad9","9dbad9","9bb9d9","9ab9d9","99b8d9","97b8d9","96b8d9","94b7d8","93b7d8","92b7d8","90b7d8","8fb7d8","8eb6d8","8db6d8","8bb5d8","8ab5d8","89b4d8","88b4d8","87b3d8","86b3d8","85b3d8","84b2d8","83b2d8","82b1d8","80b1d8","7fb0d8","7eb0d8","7dafd8","7cafd8","7baed8","7aaed8","78add8","77add8","76add8","74acd8","73acd8","72acd9","71abd9","70abd9","6fabd9","6eabd9","6dabd9","6caad9","6baad9","6aa9d9","69a9d8","69a9d8","68a8d8","67a8d8","66a7d8","65a7d8","65a7d8","64a6d8","63a6d8","62a6d8","61a5d8","60a5d8","5fa5d8","5ea4d8","5ea4d8","5da4d8","5ca4d8","5ca4d8","5ba3d8","5aa3d8","5aa2d8","59a2d8","58a2d8","58a1d8","57a1d8","56a0d8","56a0d8","55a0d8","549fd8","549fd8","539fd8","529ed8","519ed8","519ed8","509ed8","4f9ed8","4f9dd8","4e9dd8","4e9dd8","4d9cd8","4d9cd8","4c9bd8","4c9bd8","4b9bd8","4b9ad8","4b9ad8","4a9ad8","4a99d8","4999d8","4999d8","4998d8","4898d8","4797d8","4797d8","4696d8","4696d8","4596d8","4496d8","4495d8","4395d8","4394d8","4294d8","4293d8","4293d8","4192d8","4191d8","4091d8","3f90d8","3f8fd8","3e8ed8","3e8dd8","3d8cd8","3c8bd8","3c8ad8","3b89d8","3a88d8","3a86d8","3985d8","3884d8","3782d8","3781d8","367fd8","357dd8","357bd8","3479d8","3377d8","3375d8","3273d8","3270d8","316ed8","316cd8","306bd8","2f69d8","2f67d9","2e66d9","2e64d9","2d62d9","2d61d9","2c60d9","2c5fd9","2c5ed9","2b5dd9","2b5cd9","2b5bd9","2b5ad9","2a5ad9","2a59d9","2a58d9","2958d9","2957d9","2957d9","2956d9","2856d9","2856d9","2855d9","2855d8","2754d8","2754d8","2754d8","2753d8","2653d8","2653d8","2652d8","2652d8","2552d8","2551d8","2551d8","2550d8","2450d8","244fd8","244fd8","244ed8","234ed8","234dd8","234dd8","224dd8","224cd8","224cd8","224cd8","214bd8","214bd8","214bd8","214bd8","204ad8","204ad8","204ad8","1f49d8","1f49d8","1e48d8","1e48d8","1d47d8","1d47d8","1c47d8","1c46d8","1b46d8","1b45d8","1b45d8","1a45d8","1a44d8","1944d8","1944d8","1843d8","1843d8","1743d8","1742d8","1642d8","1642d8","1542d8","1542d8","1441d8","1441d8","1341d8","1341d8","1240d8","1140d8","1140d8","1040d8","0f40d8","0f40d8","0e40d8"];
const chain = ChainType.BSC;
const centerHex = axialCoordinatesToCube(0x10000,-0x10000);
let lastOpTime = Date.now();
const defaultHexSize = 3;
class StarGrid extends React.Component<any, State>{

    constructor(props) {
        super(props);
    }

    position:any = {
        x:createRef(),
        z:createRef()
    }

    state:State = {
        hexSize:defaultHexSize,
        targetHex:[],
        absoluteHex: selfStorage.getItem("absoluteHex")?selfStorage.getItem("absoluteHex"):centerHex,
        recRange:[(6-defaultHexSize)*3,(6-defaultHexSize)*3],
        rangeLand:[],
        approvedStarGridState:{
            bLIGHT:false,WATER:false,EARTH:false,bDARK:false,"EARTH-BUSD-LQ":false,"WATER-BUSD-LQ":false
        },
        approvedOperatorState:{
            bLIGHT:false,WATER:false,EARTH:false,bDARK:false,"EARTH-BUSD-LQ":false,"WATER-BUSD-LQ":false
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
        userPositions:new Map<string, boolean>(),
        btnRef:<></>,
        showCounterList:false,
        showCounterAdd:false,
        showApprovalUserModal:false,
        showSettlementModal:false,
        showPrepareModal:false,
        mp:new Map<string, number>(),
        activeLeft:true,
        activeBottom:false,
        showPowerDistribution:false,
        dragXY:[0,0],
    }
    componentDidMount() {
        testHexGrids()

        this.init().then(()=>{
            interVar.start(()=>{
                if(Date.now() - lastOpTime  < 1000 * 60 * 1){
                    this.init().catch(e=>{
                        console.error(e)
                    })
                }
            },5*1000)
        }).catch(e=>{
            console.error(e)
        })

    }

    init = async ()=>{
        let {absoluteHex,recRange,hexSize} = this.state;
        const account = await walletWorker.accountInfo();
        const owner = account.addresses[chain];
        const userPosition = await starGridRpc.userPositions(owner,10);
        // console.log(userPosition,"userPosition");
        const uMap:Map<string,boolean> = new Map<string, boolean>()
        if(userPosition ){

            if(centerHex.equalHex(absoluteHex)){
                absoluteHex = axialCoordinatesToCube(userPosition.recommendation.maxQ,userPosition.recommendation.maxS)
            }

            if(userPosition.positions && userPosition.positions.length>0){
                if(centerHex.equalHex(absoluteHex)){
                    absoluteHex = toAxial(userPosition.positions[0].coordinate)
                }
                for(let p of userPosition.positions){
                    uMap.set(toAxial(p.coordinate).uKey(),true)
                }
            }

        }
        const rang = [(6-hexSize)*3,(6-hexSize)*3];

        const leftBottom = axialCoordinatesToCube(absoluteHex.x-rang[0],absoluteHex.z+rang[1]);
        const rightTop = axialCoordinatesToCube(absoluteHex.x+rang[0],absoluteHex.z-rang[1]);

        const rangeLandPromise = starGridRpc.rangeLand(owner,toUINT256(leftBottom),toUINT256(rightTop));
        const lockedInfoPromise = epochStarGridQuery.lockedInfo(owner)
        const countersPromise =  this.getCounters()
        const rest = await Promise.all([rangeLandPromise,lockedInfoPromise,countersPromise])
        const approveRest:Array<any> = await this.queryApprove();

        console.log(rest);
        const balance = await rpc.getBalance(chain,"");
        this.setState({
            absoluteHex:absoluteHex,
            rangeLand:rest[0],
            userPositions:uMap,
            account:account,
            counters:rest[2],
            approvedStarGrid:approveRest[0],
            approvedStarGridState:approveRest[1],
            showModalApprove:approveRest[2],
            lockedInfo:rest[1],
            recRange:rang,
            balanceMap:balance
        })
        rpc.initNFT();
    }

    getBalance = (cy:string,fix:number = 3) => {
       const {balanceMap} = this.state;
       if(balanceMap[cy]){
          return utils.fromValue(balanceMap[cy],18).toFixed(fix)
       }
       return 0
    }

    getCounters = async ()=>{
        // const account = await walletWorker.accountInfo();
        const nfts = await rpc.getTicket(chain,"")
        const counters:Array<Counter> = [];
        if(nfts){
            const infos:Array<NftInfo> = nfts["COUNTER"];
            if(!infos || infos.length==0){
                return counters
            }
            for(let info of infos){
                const counter = await starGridRpc.counterInfo(info.tokenId);
                if(!counter){
                    continue
                }
                    // await epochStarGridQuery.counterInfo(info.tokenId,account.addresses[chain])//await starGridRpc.counterInfo(info.tokenId)
                counters.push(counter)
            }
        }
        return counters
    }

    queryApprove = async ()=>{
        const {approvedStarGridState} = this.state;
        const keys = Object.keys(approvedStarGridState);
        const account = await walletWorker.accountInfo();
        let approved = true;
        const owner = account.addresses[chain];
        for(let cy of keys){
            const token: EthToken = new EthToken(config.CONTRACT_ADDRESS.ERC20.BSC[cy], chain);
            {
                const rest: any = await token.allowance(owner, config.CONTRACT_ADDRESS.EPOCH.BSC.SAFE_HOLDER);
                const allowance = utils.fromValue(rest, utils.getCyDecimal(cy, ChainType[chain])).toNumber();
                if(allowance>0){
                    approvedStarGridState[cy]=true
                }
            }
        }
        const contract: Erc721 = new Erc721(config.CONTRACT_ADDRESS.ERC721.COUNTER.ADDRESS.BSC,chain);
        const approveAll = await contract.isApprovedForAll(owner,config.CONTRACT_ADDRESS.EPOCH.BSC.SAFE_HOLDER)
        for(let cy of keys){
           if(!approvedStarGridState[cy]){
               approved = false
               break;
           }
        }

        return [approveAll,approvedStarGridState,!approved || !approveAll]
    }

    genTx = async (contract:EthContract,data:string) =>{
        const account = await walletWorker.accountInfo();
        const owner = account.addresses[chain]
        const tx: Transaction = {
            from: owner,
            to: contract.address ,
            value: "0x0",
            cy: utils.defaultCy(chain),
            gasPrice: "0x" + new BigNumber(await utils.defaultGasPrice(chain)).multipliedBy(1e9).toString(16),
            chain: chain,
            amount: "0x0",
            feeCy: utils.defaultCy(chain),
            data:data
        }
        const gas = await contract.estimateGas(tx)
        tx.gas = utils.toHex(new BigNumber(gas).multipliedBy(1.2).toFixed(0))
        return tx;
    }

    genApproveTx = async (cy?:string,spender?:string)=>{

        if(cy&&spender){
            const contractAddress = config.CONTRACT_ADDRESS.ERC20.BSC[cy];
            const token: EthToken = new EthToken(contractAddress, chain);
            const data = await token.approve(spender,utils.toValue(1e9,18));
            return await this.genTx(token,data);
        }else{
            const contractAddress = config.CONTRACT_ADDRESS.ERC721.COUNTER.ADDRESS.BSC;
            const contract: Erc721 = new Erc721(contractAddress,chain);
            const data = await contract.setApprovalForAll(config.CONTRACT_ADDRESS.EPOCH.BSC.SAFE_HOLDER,true)
            return await this.genTx(contract,data);
        }
    }
    approveToStarGridProxy = async (cy:string,spender:string)=>{
        const tx = await this.genApproveTx(cy,spender);
        this.setState({
            tx:tx,
            showConfirm:true,
        })
        lastOpTime = Date.now();
    }
    approveToStarGrid = async ()=>{
        const tx = await this.genApproveTx();
        this.setState({
            tx:tx,
            showConfirm:true,
        })

        lastOpTime = Date.now();
    }

    approveAll = async ()=>{
        const {approvedStarGridState} = this.state;
        const txs:Array<Transaction> = [];
        for(let v of Object.keys(approvedStarGridState)){
            if(approvedStarGridState[v]){
               continue
            }
            const tx = await this.genApproveTx(v,config.CONTRACT_ADDRESS.EPOCH.BSC.SAFE_HOLDER)
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

        lastOpTime = Date.now();
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

    create = async (type:StarGridType,num:number)=>{
        const data = await epochStarGridOperator.create(type,num)
        const tx = await this.genTx(epochStarGridOperator,data);
        this.setState({
            tx:tx,
            showConfirm:true
        })

        lastOpTime = Date.now();
    }

    captureConfirm = async (counterId:string,baseAmountIn:BigNumber,attachAmountIn:BigNumber)=>{
        const {targetHex,counters} = this.state;
        const counter = counters.filter((v)=> {
            if(v && v.counterId == counterId){
                return v
            }
        })
        if(!counter || counter.length == 0 ){
            this.setShowToast(true,"Counter is not exist !")
            return ;
        }
        attachAmountIn = new BigNumber(attachAmountIn);
        const account = await walletWorker.accountInfo();
        let coo:Hex|undefined;
        if(targetHex.length == 1){
            coo = targetHex[0].hex
        }
        const hex = toUINT256(coo)
        // @ts-ignore
        const rest:Array<string> = await epochStarGrid.capture(counterId,hex,utils.toValue(baseAmountIn,18),utils.toValue(attachAmountIn,18),account.addresses[ChainType.BSC])
        // const tx = await this.genTx(epochStarGrid,data)
        const base = counter[0].enType == StarGridType.EARTH ? "bDARK":"bLIGHT";
        const attach = counter[0].enType == StarGridType.EARTH ? "WATER":"EARTH"
        const feeData:any = {
            Terms: `7 Periods`,
            "Every Period": `${baseAmountIn.toString(10)} ${base}, ${attachAmountIn.toString(10)} ${attach}`,
            Total: `${utils.fromValue(rest[0],18).toString(10)} ${base}, ${utils.fromValue(rest[1],18).toString(10)} ${attach}`,
        }

        this.setState({
            feeData:feeData,
            feeCancel:()=>{this.setState({feeData:""})},
            feeOk:()=>{
                this.setState({feeData:""})
                this.setShowLoading(true)
                this.capture(counterId,baseAmountIn,attachAmountIn).then(()=>{
                    this.setShowLoading(false)
                }).catch((e)=>{
                    this.setShowLoading(false)
                    const err = typeof e == "string"?e:e.message;
                    this.setShowToast(true,err)
                })
            }
        })

        lastOpTime = Date.now();
    }

    capture = async (counterId:string,baseAmount:BigNumber,attachAmount:BigNumber)=>{
        const {targetHex} = this.state;
        let coo:Hex|undefined;
        if(targetHex.length == 1){
            coo = targetHex[0].hex
        }
        const hex = toUINT256(coo)
        // {
        //     const account = await walletWorker.accountInfo();
        //     const data = await epochStarGrid.capture(counterId,hex,utils.toValue(baseAmount,18),utils.toValue(attachAmount,18),account.addresses[ChainType.BSC])
        // }
        //@ts-ignore
        const data:string = await epochStarGrid.capture(counterId,hex,utils.toValue(baseAmount,18),utils.toValue(attachAmount,18))
        const tx = await this.genTx(epochStarGrid,data)
        this.setState({
            tx:tx,
            showConfirm:true,
            feeData: ""
        })

        lastOpTime = Date.now();
    }

    logout = async ()=>{
        const data = await epochStarGrid.logout()
        const tx = await this.genTx(epochStarGrid,data);

        this.setState({
            tx:tx,
            showConfirm:true
        })

        lastOpTime = Date.now();
    }

    settlement = async ()=>{
        const data = await epochStarGrid.settlement()
        const tx = await this.genTx(epochStarGrid,data);
        this.setState({
            tx:tx,
            showConfirm:true
        })

        lastOpTime = Date.now();
    }

    moveTo = async (hex:Hex) =>{
        const data = await epochStarGrid.moveTo(toUINT256(hex))
        const tx = await this.genTx(epochStarGrid,data);
        this.setState({
            tx:tx,
            showConfirm:true
        })

        lastOpTime = Date.now();
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
            if(targetHex[i].counter){
                // let rd = 0;
                for(let dir =0;dir<6;dir++){
                    //@ts-ignore
                    const neighbor = neighboor(start,dir)
                    if(neighbor.equalHex(hex)){
                        routers.push(dir+7)
                        break
                    }
                }
                // if(rd == 0){
                //     this.setShowToast(true,"No neighbor attack")
                //     return
                // }
                // routers.push(rd)
            }else {
                let rd = 0;
                for(let dir =0;dir<6;dir++){
                    //@ts-ignore
                    const neighbor = neighboor(start,dir)
                    if(neighbor.equalHex(hex)){
                        rd = dir+1;
                        break
                    }
                }
                if(rd == 0){
                    this.setShowToast(true,"No neighbor")
                    return
                }
                routers.push(rd)
            }
        }
        routers.push(0)
        routers.reverse();
        console.log(routers,toOpCode(routers,5),"toOPCO");
        //TODO use Buffer instead
        const data:any = await epochStarGrid.active("0x"+new BigNumber(toOpCode(routers,5),2).toString(16))
        const tx = await this.genTx(epochStarGrid,data);
        this.setState({
            tx:tx,
            showConfirm:true
        })

        lastOpTime = Date.now();
    }

    prepare = async (terms:number,baseAmount:BigNumber,attachAmount)=>{
        const data:any = await epochStarGrid.prepare(utils.toValue(baseAmount,18),utils.toValue(attachAmount,18),terms)
        const tx = await this.genTx(epochStarGrid,data)
        this.setState({
            tx:tx,
            showConfirm:true
        })


        lastOpTime = Date.now();
    }

    prepareConfirm = async (terms:number, baseAmount:BigNumber,attachAmount:BigNumber) =>{
        const {lockedInfo} = this.state;
        const account = await walletWorker.accountInfo();
        //
        const rest:any = await epochStarGrid.prepare(utils.toValue(baseAmount,18),utils.toValue(attachAmount,18),terms,account.addresses[ChainType.BSC])

        const base = lockedInfo.counter.enType == StarGridType.EARTH ? "bDARK":"bLIGHT";
        const attach = lockedInfo.counter.enType == StarGridType.EARTH ? "WATER":"EARTH"

        const feeData:any = {
            Terms: `7 Periods`,
            "Amount per Period": `${baseAmount.toString(10)} ${base}, ${attachAmount.toString(10)} ${attach}`,
            Total: `${utils.fromValue(rest[0],18).toString(10)} ${base}, ${utils.fromValue(rest[1],18).toString(10)} ${attach}`,
        }

        this.setState({
            feeData:feeData,
            feeCancel:()=>{this.setState({feeData:""})},
            feeOk:()=>{
                this.prepare(terms,baseAmount,attachAmount).then(()=>{
                    this.setState({feeData:""})
                }).catch(e=>{
                    this.setState({feeData:""})
                    console.error(e)
                })
            }
        })


        lastOpTime = Date.now();

    }
    setApproveToUser = async (addr:string,bool:boolean)=>{
        const data = await epochStarGrid.setApproval(addr,bool)
        const tx = await this.genTx(epochStarGrid,data)
        this.setState({
            tx:tx,
            showConfirm:true
        })

        lastOpTime = Date.now();
    }

    attack = async (opId:string)=>{
        // const data = await epochStarGrid.battle(opId)
        // const tx = await this.genTx(epochStarGrid,data);
        //
        // this.setState({
        //     tx:tx,
        //     showConfirm:true
        // })
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

        lastOpTime = Date.now();
    }

    handleStart = (e:any,data:any)=>{
    }
    handleDrag = (e:any,data:any)=>{
        // console.log(e,data)
    }
    handleStop = (e:any,dragEndData:any)=> {
       const {absoluteHex,dragXY} = this.state;

        const x = Math.floor((dragEndData.x-dragXY[0])/60);
        const y = Math.floor((dragEndData.y-dragXY[1])/60);

        const abs = axialCoordinatesToCube(absoluteHex.x-x,absoluteHex.z-y);

        this.setState({
            absoluteHex: abs,
            dragXY:[dragEndData.x,dragEndData.y]
        })
    }

    arrow=(t:string)=>{
        let {absoluteHex,dragXY,hexSize} = this.state;
        if("u" == t){
            absoluteHex = neighboor(neighboor(absoluteHex,0),5)// addHex(addHex(absoluteHex,directions[0]),directions[5]);
        }else if ("d" == t){
            absoluteHex = neighboor(neighboor(absoluteHex,2),3);
        }else if ("r" == t){
            absoluteHex = neighboor(neighboor(absoluteHex,1),1);// addHex(addHex(absoluteHex,directions[1]),directions[1]);
        }else if ("l" == t){
            absoluteHex = neighboor(neighboor(absoluteHex,4),4);
        }
        selfStorage.setItem("absoluteHex",absoluteHex)
        this.setState({
            absoluteHex:absoluteHex,
            dragXY:[]
        })

        lastOpTime = Date.now();
    }

    // dark background
    // d97a00    e2d000
    // f8c21f      e5e598

    setTarget = (h:HexInfo):Array<HexInfo> =>{
        const {targetHex,lockedInfo} = this.state;
        const originLen = targetHex.length;

        if(originLen == 1 && (noCounter(targetHex[0]) || lockedInfo && targetHex[0].counter && lockedInfo.counter.counterId != targetHex[0].counter.counterId)){
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

    selectTarget = async (f:boolean, hex?:HexInfo,x?:number,y?:number)=>{
        const {lockedInfo,targetHex,counters,rangeLand} = this.state;
        if(hex){
            const tHex = this.setTarget(hex)
            // let ref:any;
            let mp:Map<string,number> = new Map<string, number>()
            if(lockedInfo && lockedInfo.counter && lockedInfo.counter.counterId !== "0"){
                // if(hex.counter && lockedInfo.counter.counterId == hex.counter.counterId){
                    //logout
                    // ref = <div className="btn-div" style={{left:x-20,top:y-80,display:"block"}}>
                    //     <IonButton color="warning" size="small" onClick={()=>{
                    //         this.setShowLoading(true)
                    //         this.logout().then(()=>{
                    //             this.setShowLoading(false)
                    //         }).catch(e=>{
                    //             this.setShowLoading(false)
                    //             const err = typeof e == "string"?e:e.message;
                    //             this.setShowToast(true,err)
                    //         })
                    //     }}>Logout</IonButton>
                    // </div>
                // }else{
                    //move
                //     if(!hex.counter){
                //         if(hex.land && hex.land.canCapture){
                //             ref = <div className="btn-div" style={{left:x-20,top:y-80,display:"block"}}>
                //                 <IonButton color="success" size="small" onClick={()=>{
                //                     this.setShowLoading(true)
                //                     this.moveTo(hex.hex).then(()=>{
                //                         this.setShowLoading(false)
                //                     }).catch(e=>{
                //                         this.setShowLoading(false)
                //                         const err = typeof e == "string"?e:e.message;
                //                         this.setShowToast(true,err)
                //                     })
                //                 }}>Move To</IonButton>
                //             </div>
                //         }else{
                //             if(targetHex && targetHex.length>1){
                //                 ref = <div className="btn-div" style={{left:x-20,top:y-80,display:"block"}}>
                //                     <IonButton color="success" size="small" onClick={()=>{
                //                         this.setShowLoading(true)
                //                         this.move().then(()=>{
                //                             this.setShowLoading(false)
                //                         }).catch(e=>{
                //                             this.setShowLoading(false)
                //                             const err = typeof e == "string"?e:e.message;
                //                             this.setShowToast(true,err)
                //                         })
                //                     }}>Move</IonButton>
                //                 </div>
                //             }
                //         }
                //     }else{
                //         if(this.isFocusMyCounter() && lockedInfo && hex.counter.counterId != lockedInfo.counter.counterId){
                //             //attack
                //             ref = <div className="btn-div" style={{left:x-20,top:y-80,display:"block"}}>
                //                 <IonButton color="danger" size="small" onClick={()=>{
                //                     this.setShowLoading(true)
                //                     this.move().then(()=>{
                //                         this.setShowLoading(false)
                //                     }).catch(e=>{
                //                         this.setShowLoading(false)
                //                         const err = typeof e == "string"?e:e.message;
                //                         this.setShowToast(true,err)
                //                     })
                //                 }}>Attack</IonButton>
                //             </div>
                //         }
                //     }
                // }

                if(rangeLand){
                    for (let land of rangeLand){
                        if(targetHex.length>0){
                            const tHex = targetHex[0];
                            let power = 1;
                            // if(absHex && account && absHex.owner && absHex.owner.toLowerCase() == account.addresses[chain].toLowerCase()){
                            //     power = 0
                            // }else
                            if(tHex && tHex.counter && tHex.counter.enType != land.enType){
                                power = 2;
                            }
                            // if(land.counter){
                            //     power = 1e10
                            // }
                            mp.set(toAxial(land.coordinate).uKey(),power);
                        }
                    }
                }
            }else{
                //capture
                // if(counters && counters.length>0){
                //     ref = <div className="btn-div" style={{left:x-20,top:y-80,display:"block"}}>
                //         <IonButton color="primary" size="small" onClick={()=>{
                //             this.setShowCounterList(true)
                //         }}>Capture</IonButton>
                //     </div>
                // }else{
                //     ref = <div className="btn-div" style={{left:x-20,top:y-80,display:"block"}}>
                //         <IonButton color="primary" size="small" onClick={()=>{
                //            this.setShowCounterAdd(true)
                //         }}>Create</IonButton>
                //     </div>
                // }
            }
            this.setState({
                showInfo:f,
                targetHex: tHex,
                // btnRef: tHex &&tHex.length == 0 ?"" : ref,
                mp:mp,
                dragXY:[x,y]
            })
        }else{
            this.setState({
                showInfo: f,
            })
        }

        lastOpTime = Date.now();
    }

    setShowModalApprove = (f:boolean)=>{
        this.setState({
            showModalApprove:f
        })

        lastOpTime = Date.now();
    }

    setShowLoading = (f:boolean)=>{
        this.setState({
            showLoading:f
        })
        lastOpTime = Date.now();
    }

    setShowConfirm = (f:boolean)=>{
        this.setState({
            showConfirm:f
        })
        lastOpTime = Date.now();
    }

    setShowToast(f:boolean,m?:string){
        this.setState({
            showToast:f,
            toastMessage:m
        })
        lastOpTime = Date.now();
    }

    setShowPosition=(f:boolean)=>{
        this.setState({
            showPosition:f
        })
        lastOpTime = Date.now();
    }

    setShowCounterAdd = (f:boolean) =>{
        this.setState({
            showCounterAdd:f
        })
        lastOpTime = Date.now();
    }

    setShowApprovalUserModal = (f:boolean) =>{
        this.setState({
            showApprovalUserModal:f
        })
        lastOpTime = Date.now();
    }
    confirm = async (hash: string) => {
        let intervalId: any = 0;
        this.setShowLoading(true);
        intervalId = setInterval(() => {
            rpc.getTxInfo(chain, hash).then(rest => {
                if (rest) {
                    clearInterval(intervalId)

                    lastOpTime = Date.now();
                    this.setShowLoading(false);
                    this.setState({
                        targetHex:[],
                        btnRef:""
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

    setShowCounterList = (f:boolean)=>{
        this.setState({
            showCounterList:f,
            amountTitle2:"",
            amountTitle1:""
        })
        lastOpTime = Date.now();
    }

    isFocusMyCounter = ():boolean =>{
        const {targetHex,lockedInfo} = this.state;
        return targetHex && targetHex.length>0 && targetHex[0].counter && lockedInfo && targetHex[0].counter.counterId == lockedInfo.counter.counterId
    }

    setShowSettlementModal = (f:boolean) =>{
        this.setState({
            showSettlementModal:f
        })
        lastOpTime = Date.now();
    }

    setShowPrepareModal = (f:boolean) =>{
        this.setState({
            showPrepareModal:f
        })
        lastOpTime = Date.now();
    }

    setShowPowerDistribution = (f:boolean) =>{
        this.setState({
            showPowerDistribution: f
        })
        lastOpTime = Date.now();
    }

    renTitle = (cy:string) =>{
        return <div><b>Input {cy} amount</b><p>Balance:<IonText color="primary">{this.getBalance(cy)}</IonText></p></div>
    }

    storeAbsoluteHex = (h:Hex) =>{
        selfStorage.setItem("absoluteHex",h)
    }
    render() {
        const {hexSize,targetHex,userPositions,btnRef,txs,showApproveAllModal,approvedStarGridState,
            showPosition,approvedStarGrid,showModalApprove,showLoading,showConfirm,recRange,showCounterAdd,
            showToast,toastMessage,tx,counters,rangeLand,account,showCounterList,feeData,feeOk,feeCancel,
            showApprovalUserModal,lockedInfo,showSettlementModal,showPrepareModal,mp,activeBottom,activeLeft,
            showPowerDistribution,amountTitle1,amountTitle2} = this.state;
        // const hexagons = gridGenerator.rectangle(recRange[0],recRange[1], true,true );
        // console.log(hexagons,recRange);
        const hexagons = gridGenerator.hexagon(recRange[0]>recRange[1]?recRange[0]:recRange[1],true)
        // let contentStyle = {width:`${1*100}vw`,height:`${1*100}vh`};
        {
            // (0,136,207)       (124,0,214)
            // (47,187,246)      (162,57,255)

        }

        const owner = account && account.addresses[ChainType.BSC];

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
        const reachHexesGlobal:Array<Hex> = reachableHexes(movement,mp,targetHex,Math.floor(recRange[0]));
        const reachHexes:Array<Hex> = reachableHexesNeighbor(movement,mp,targetHex);

        const yellows=[];
        const blues=[];
        const pieceColors = [];

        const counterMap:Map<string,Land> = new Map<string, Land>();

        if(rangeLand && rangeLand.length>0){
            for(let l of rangeLand){
                const coo = toAxial(l.coordinate);
                const i = Math.floor(utils.fromValue(l.capacity,18).toNumber())
                if(l.enType == StarGridType.WATER){
                    if(blues.indexOf(blueColors[i]) == -1){
                        blues.push(blueColors[i])
                    }
                }else if(l.enType == StarGridType.EARTH){
                    if(yellows.indexOf(yellowColors[i]) == -1){
                        yellows.push(yellowColors[i])
                    }

                }
                if(l.counter){
                    const rate = Math.floor(utils.fromValue( l.counter.rate,16).toNumber());
                    const bg = calcCounterRgb(rate,l.counter.enType == StarGridType.EARTH);
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
                            <IonTitle>Star Grid [{lockedInfo && lockedInfo.currentPeriod}]</IonTitle>
                            <IonLabel slot="end">
                                {lockedInfo && <CountDown second={utils.toValue(lockedInfo.nextOpTime,0).toNumber()}/>}
                            </IonLabel>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent fullscreen >
                        <IonFab vertical="bottom" horizontal="center" slot="fixed" activated={activeBottom}>
                            <IonFabButton  onClick={()=>{
                                this.setState({activeBottom:!activeBottom})
                            }}>
                                <IonIcon icon={addCircleOutline} />
                            </IonFabButton>
                            <IonFabList side="start">
                                <IonFabButton onClick={()=>this.setShowCounterAdd(true)} size="small" color="secondary">
                                    <IonIcon icon={addCircleOutline} />
                                </IonFabButton>
                                <IonFabButton onClick={()=>this.setShowApprovalUserModal(true)} size="small" color="secondary">
                                    <IonIcon icon={cardOutline} />
                                </IonFabButton>
                            </IonFabList>
                            <IonFabList side="top">
                                <IonFabButton onClick={()=>{
                                    this.setShowSettlementModal(true)
                                }} size="small" color="secondary">
                                    <IonIcon icon={cashOutline} />
                                </IonFabButton>
                            </IonFabList>
                            <IonFabList side="end">
                                <IonFabButton onClick={()=>this.logout()} size="small" color="secondary">
                                    <IonIcon icon={logOut} />
                                </IonFabButton>
                            </IonFabList>
                        </IonFab>
                        <IonFab vertical="bottom" horizontal="end" slot="fixed" activated={activeLeft}>
                            <IonFabButton size="small"  onClick={()=>{
                                this.setState({activeLeft:!activeLeft})
                            }}>
                                <IonIcon icon={expandOutline} />
                            </IonFabButton>
                            <IonFabList side="top">

                                <IonFabButton onClick={()=>{this.arrow("r")}} size="small" color="warning">
                                    <IonIcon icon={arrowForwardCircleOutline} />
                                </IonFabButton>
                                <IonFabButton onClick={()=>{this.arrow("l")}} size="small" color="warning">
                                    <IonIcon icon={arrowBackCircleOutline} />
                                </IonFabButton>
                                <IonFabButton onClick={()=>{this.arrow("d")}} size="small" color="warning">
                                    <IonIcon icon={arrowDownCircleOutline} />
                                </IonFabButton>
                                <IonFabButton onClick={()=>{this.arrow("u")}} size="small" color="warning">
                                    <IonIcon icon={arrowUpCircleOutline} />
                                </IonFabButton>
                                <IonFabButton color="secondary" onClick={()=>this.setHexSize(hexSize-1)} size="small">
                                    <IonIcon icon={remove} />
                                </IonFabButton>
                                <IonFabButton onClick={()=>this.setHexSize(hexSize+1)} size="small" color="secondary">
                                    <IonIcon icon={add} />
                                </IonFabButton>
                                <IonFabButton onClick={()=>{this.setShowPosition(true)}} color="warning">
                                    <IonIcon icon={search} />
                                </IonFabButton>
                            </IonFabList>
                        </IonFab>
                        {btnRef}

                        {/*<div className="op-box">*/}
                        {/*    <IonRow>*/}
                        {/*        <IonCol size="3">1</IonCol>*/}
                        {/*        <IonCol size="9"><IonText color="success">MOVE</IonText></IonCol>*/}
                        {/*    </IonRow>*/}
                        {/*    <IonRow>*/}
                        {/*        <IonCol size="3">2</IonCol>*/}
                        {/*        <IonCol size="9"><IonText color="success">MOVE</IonText></IonCol>*/}
                        {/*    </IonRow>*/}
                        {/*    <IonRow>*/}
                        {/*        <IonCol size="3">3</IonCol>*/}
                        {/*        <IonCol size="9"><IonText color="success">MOVE</IonText></IonCol>*/}
                        {/*    </IonRow>*/}
                        {/*    <IonRow>*/}
                        {/*        <IonCol size="3">4</IonCol>*/}
                        {/*        <IonCol size="9"><IonText color="success">MOVE</IonText></IonCol>*/}
                        {/*    </IonRow>*/}
                        {/*    <IonRow>*/}
                        {/*        <IonCol size="3">5</IonCol>*/}
                        {/*        <IonCol size="9"><IonText color="success">MOVE</IonText></IonCol>*/}
                        {/*    </IonRow>*/}
                        {/*</div>*/}
                        {
                            targetHex[0] &&
                            <div className="counter-info">
                                <HexInfoCard hasCounters={counters && counters.length>0} sourceHexInfo={targetHex[0]}
                                             onCapture={()=>{
                                                 if(counters && counters.length>0){
                                                     this.setShowCounterList(true)
                                                 }else {
                                                     this.setShowCounterAdd(true)
                                                 }
                                             }}
                                 lockedInfo={lockedInfo}
                                 attackHexInfo={targetHex.length>1 && targetHex[targetHex.length-1]}
                                 onMove={()=>{
                                    this.move().catch(e=>{
                                        const err = typeof e == "string"?e:e.message;
                                        this.setShowToast(true,err)
                                    })
                                }} onMoveTo={(hex:Hex)=>{
                                    this.moveTo(hex).catch(e=>{
                                        const err = typeof e == "string"?e:e.message;
                                        this.setShowToast(true,err)
                                    })
                                }} onShowDistribute={()=>{
                                    this.setShowPowerDistribution(true)
                                }}/>
                            </div>
                        }

                        <div className="content-grid" style={{width:`${100}vw`,height:`${100}vh`}}>
                            {/*<Draggable*/}
                            {/*    axis="both"*/}
                            {/*    handle=".wrapped"*/}
                            {/*    defaultPosition={{x: 0, y: 0}}*/}
                            {/*    // cancel={".wrapped"}*/}
                            {/*    position={undefined}*/}
                            {/*    // grid={[25, 25]}*/}
                            {/*    scale={1}*/}
                            {/*    // onStart={this.handleStart}*/}
                            {/*    // onDrag={this.handleDrag}*/}
                            {/*    enableUserSelectHack*/}

                            {/*    allowAnyClick*/}
                            {/*    onStop={(e,data)=> {*/}
                            {/*        e.preventDefault()*/}
                            {/*        this.handleStop(e, data)*/}
                            {/*    }}*/}
                            {/*>*/}

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
                                                const stop = targetHex && targetHex.length>1 && targetHex[targetHex.length-1] && !!targetHex[targetHex.length-1].counter
                                                const block = containHex(reachHexes,absHex) && this.isFocusMyCounter() && !stop;
                                                const attack = targetHex && targetHex.length>0&&this.containHexInfo(targetHex,absHex) && targetHex.length>0 && !absHex.equalHex(targetHex[0].hex ) && this.isFocusMyCounter();
                                                const movable = containHex(reachHexesGlobal,absHex) && this.isFocusMyCounter() && !stop;;
                                                const focus = targetHex.length>0&&absHex.equalHex(targetHex[0].hex);
                                                let piece:any = undefined;
                                                let landStyle:string = ""

                                                let marker:boolean|undefined;
                                                let approval:boolean|undefined;
                                                let land:Land|undefined;
                                                if(counterMap.has(absHex.uKey())){
                                                    land = counterMap.get(absHex.uKey())
                                                    const i = Math.floor(utils.fromValue(land.capacity,18).toNumber())
                                                    if(land.enType == StarGridType.WATER){
                                                        landStyle = blueColors[i]
                                                    }else if(land.enType == StarGridType.EARTH){
                                                        landStyle = yellowColors[i]
                                                    }
                                                    if(land.counter){
                                                        // const p = counterMap.get(absHex.uKey());
                                                        const bg = calcCounterRgb(Math.floor(utils.fromValue(land.counter.rate,16).toNumber()),land.counter.enType == StarGridType.EARTH);
                                                        piece = {
                                                            style:land.counter.enType == StarGridType.WATER?"white":"black",
                                                            backgroundColor: [ `rgb(${bg[0]})`,`rgb(${bg[1]})`]
                                                        }
                                                    }else{
                                                        if(land && land.marker == owner){
                                                            marker = true;
                                                        }else{
                                                            if(land && land.canCapture){
                                                                approval = true;
                                                            }
                                                        }
                                                    }
                                                }

                                                return <Hexagon
                                                    className="field"
                                                    focus={focus}
                                                    flag={userPositions.get(absHex.uKey())}
                                                    block={block&&!absHex.equalHex(targetHex[0].hex)}
                                                    attack={attack} key={i}
                                                    colorStyle={landStyle}
                                                    movable={movable}
                                                    counter={piece}
                                                    approval={approval}
                                                    marker={marker}
                                                    onClick={(id, coordinates, e)=>{
                                                        if(targetHex.length>0 && targetHex[0].land && targetHex[0].land.counter
                                                            &&( block || absHex.equalHex(targetHex[0].hex) ||attack )
                                                            || targetHex.length==0
                                                            // || land && land.canCapture
                                                            ||
                                                            targetHex.length==1 && lockedInfo && lockedInfo.counter && targetHex[0].counter &&
                                                            (
                                                                targetHex[0].counter.counterId != lockedInfo.counter.counterId
                                                                ||  targetHex[0].counter.counterId == lockedInfo.counter.counterId && block
                                                            )
                                                            ||
                                                            targetHex.length==1 && (!targetHex[0].land || !targetHex[0].land.counter)
                                                        ){
                                                            e.stopPropagation();
                                                            this.selectTarget(true,{hex:this.convertHex(coordinates),land:land,counter:land&&land.counter},e.nativeEvent.offsetX,e.nativeEvent.y).catch(e=>{
                                                                console.error(e)
                                                            });

                                                        }
                                                    }} id={i} coordinates={hex}
                                                >
                                                    <HexText className="hex-text">
                                                        {/*{hex.x} {hex.y} {hex.z}*/}
                                                        {/*{hex.x+absoluteHex.x},*/}
                                                        {/*{absHex.x},{absHex.z}*/}
                                                    </HexText>
                                                </Hexagon>
                                            } )}
                                        {targetHex && targetHex.length>1 &&<PathCustom pathHex={targetHex} />}
                                    </HexGrid>
                                }

                            </div>
                            {/*</Draggable>*/}
                            {/*<div className="gis-info">*/}
                            {/*    <IonButton color="primary" size="small" onClick={()=>{*/}
                            {/*        this.setShowCounterAdd(true)*/}
                            {/*    }}>Create</IonButton>*/}

                            {/*    <IonButton color="primary" size="small" onClick={()=>{*/}
                            {/*        this.logout().catch(e=>{*/}
                            {/*            const err = typeof e == "string"?e:e.message;*/}
                            {/*            this.setShowToast(true,err)*/}
                            {/*            console.error(e)});*/}
                            {/*    }}>Logout</IonButton>*/}
                            {/*    <IonButton color="primary" size="small" onClick={()=>{*/}
                            {/*        this.settlement().catch(e=>{*/}
                            {/*            const err = typeof e == "string"?e:e.message;*/}
                            {/*            this.setShowToast(true,err)*/}
                            {/*            console.error(e)})*/}
                            {/*    }}>Settlement</IonButton>*/}
                            {/*    <IonButton color="primary" size="small" onClick={()=>{*/}
                            {/*        this.prepare().catch(e=>{*/}
                            {/*            const err = typeof e == "string"?e:e.message;*/}
                            {/*            this.setShowToast(true,err)*/}
                            {/*            console.error(e)})*/}
                            {/*    }}>Prepare</IonButton>*/}
                            {/*    <IonButton color="primary" size="small" onClick={()=>{*/}
                            {/*        this.move().catch(e=>{*/}
                            {/*            const err = typeof e == "string"?e:e.message;*/}
                            {/*            this.setShowToast(true,err)*/}
                            {/*            console.error(e)})*/}
                            {/*    }}>Move</IonButton>*/}
                            {/*    <IonButton color="primary" size="small" onClick={()=>{*/}
                            {/*        this.attack("").catch(e=>{*/}
                            {/*            const err = typeof e == "string"?e:e.message;*/}
                            {/*            this.setShowToast(true,err)*/}
                            {/*            console.error(e)})*/}
                            {/*    }}>Attack</IonButton>*/}
                            {/*    <IonButton color="primary" size="small" onClick={()=>{*/}
                            {/*        this.setShowPosition(true)*/}
                            {/*    }}>Position</IonButton>*/}
                            {/*    <IonButton color="primary" size="small" onClick={()=>{*/}
                            {/*        this.setShowPosition(true)*/}
                            {/*    }}>Set Approval</IonButton>*/}
                            {/*</div>*/}
                        </div>

                        <IonModal
                            mode="ios"
                            isOpen={showModalApprove}
                            cssClass='epoch-rank-modal'
                            swipeToClose={true}
                            onDidDismiss={() => this.setShowModalApprove(false)}>
                            <IonList>
                                <IonItemDivider>
                                    <IonLabel>APPROVED TO STAR GRID</IonLabel>
                                </IonItemDivider>
                                {
                                    Object.keys(approvedStarGridState).map((v)=>{
                                        return <IonItem>
                                            <IonLabel color="primary">{v}<IonText color="secondary"> [BEP20]</IonText></IonLabel>
                                            <IonText color="success">{approvedStarGridState[v]?"APPROVED":<IonButton size="small" color="primary" onClick={()=>{
                                                this.approveToStarGridProxy(v,config.CONTRACT_ADDRESS.EPOCH.BSC.SAFE_HOLDER).catch(e=>{
                                                    const err = typeof e == "string"?e:e.message;
                                                    this.setShowToast(true,err)
                                                    console.error(e)
                                                })
                                            }}>Approve</IonButton>}</IonText>
                                        </IonItem>
                                    })
                                }
                                <IonItem>
                                    <IonLabel color="primary">COUNTER <IonText color="secondary">[BEP721]</IonText></IonLabel>
                                    <IonText color="success">{approvedStarGrid?"APPROVED":<IonButton size="small" color="primary" onClick={()=>{
                                        this.approveToStarGrid().catch(e=>{
                                            const err = typeof e == "string"?e:e.message;
                                            this.setShowToast(true,err)
                                            console.error(e)
                                        })
                                    }}>Approve</IonButton>}</IonText>
                                </IonItem>
                            </IonList>
                            {/*<IonButton onClick={()=>{*/}
                            {/*   this.approveAll().catch(e=>{*/}
                            {/*       const err = typeof e == "string"?e:e.message;*/}
                            {/*       this.setShowToast(true,err)*/}
                            {/*       console.log(e)*/}
                            {/*   });*/}
                            {/*}}>Approve All</IonButton>*/}
                        </IonModal>

                        <IonModal
                            mode="ios"
                            isOpen={showPosition}
                            cssClass='counter-list-modal'
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
                            </IonList>
                            <IonButton onClick={()=>{
                                const x = this.position.x.current.value;
                                const z = this.position.z.current.value;
                                const a = axialCoordinatesToCube(parseInt(x),parseInt(z));

                                this.storeAbsoluteHex(a)
                                this.setState({
                                    absoluteHex:a,
                                    showPosition:false,
                                    targetHex:[{hex:a}]
                                })
                            }}>OK</IonButton>
                        </IonModal>

                        <IonModal
                            mode="ios"
                            isOpen={showApproveAllModal}
                            cssClass='counter-list-modal'
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

                        <CounterList title="Capture" show={showCounterList} amountTitle1={amountTitle1}
                                     amountTitle2={amountTitle2} onCallback={(counter)=>{
                            if(counter.enType == StarGridType.EARTH){
                                this.setState({
                                    amountTitle1: this.renTitle("bDARK"),
                                    amountTitle2: this.renTitle("WATER"),
                                })
                            }else if(counter.enType == StarGridType.WATER){
                                this.setState({
                                    amountTitle1: this.renTitle("bLIGHT"),
                                    amountTitle2: this.renTitle("EARTH"),
                                })
                            }
                        }}
                                     onOk={(counterId,base,attach)=>{
                                         if(!counterId){
                                             this.setShowToast(true,"Please select a counter!")
                                             return
                                         }
                                         if(!base || new BigNumber(base).toNumber() <= 0 ){
                                             this.setShowToast(true,"Please input amount 1st!")
                                             return
                                         }
                                         if(!attach || new BigNumber(attach).toNumber() <= 0 ){
                                             this.setShowToast(true,"Please input amount 2nd!")
                                             return
                                         }
                            this.captureConfirm(counterId,base,attach).catch(e=>{
                                const err = typeof e == "string"?e:e.message;
                                this.setShowToast(true,err)
                                console.error(e)});
                           this.setShowCounterList(false)
                        }} onCancel={()=>{
                           this.setShowCounterList(false)
                        }} data={counters}/>

                        <CounterAdd show={showCounterAdd} onOk={(type,num)=>{
                            this.setShowLoading(true);
                            this.create(type,num).then(()=>{
                                this.setShowLoading(false);
                                this.setShowCounterAdd(false)
                            }).catch(e=>{
                                this.setShowLoading(false);
                                this.setShowCounterAdd(false)
                                console.error(e)
                            })
                        }} onCancel={()=>this.setShowCounterAdd(false)} />
                        <FeeModal show={!!feeData} onOk={()=>{ feeOk() }} onCancel={()=>{ feeCancel() }} data={feeData}/>

                        {lockedInfo && <Settlement show={showSettlementModal} lockedInfo={lockedInfo} onPrepare={()=>{
                            this.setShowPrepareModal(true);
                            this.setShowSettlementModal(false);
                        }} onCancel={()=>{
                           this.setShowSettlementModal(false)
                        }} onOk={()=>{
                            this.settlement().catch(e=>{
                                console.error(e)
                            })
                            this.setShowSettlementModal(false)
                        }}/>}

                        <ApprovalUsersModal show={showApprovalUserModal} data={["0xd00ed73cd343ceee43c7758021e91c1260cc2407"]} onOk={(address)=>{
                            this.setApproveToUser(address,true).catch(e=>{
                                const err = typeof e == "string"?e:e.message;
                                this.setShowToast(true,err)
                            })
                        }} onCancel={()=>{this.setShowApprovalUserModal(false)}} onCancelApprove={(address)=>{
                            this.setApproveToUser(address,false).catch(e=>{
                                const err = typeof e == "string"?e:e.message;
                                this.setShowToast(true,err)
                            })
                        }}/>

                        <Prepare lockedInfo={lockedInfo} show={showPrepareModal} onCancel={()=>{}} onOk={(terms, baseAmount,attachAmount)=>{
                            this.prepareConfirm(terms,baseAmount,attachAmount).then(()=>{
                                this.setShowPrepareModal(false);
                            }).catch(e=>{
                                this.setShowPrepareModal(false);
                                const err = typeof e == "string"?e:e.message;
                                this.setShowToast(true,err)
                            })
                        }}/>

                        {lockedInfo && lockedInfo.counter && <PowerDistribution show={showPowerDistribution} counter={lockedInfo.counter} onCancel={()=>{
                            this.setShowPowerDistribution(false)
                        }}/>}
                    </IonContent>
                </IonPage>
            </>

        );
    }
}

export default StarGrid