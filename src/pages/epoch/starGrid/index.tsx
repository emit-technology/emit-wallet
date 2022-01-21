import * as React from "react";
import {createRef} from "react";
import {
    axialCoordinatesToCube,
    calcCounterRgb,
    containHex, distanceBetweenHexes,
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
    toAxial,
    toOpCode,
    toUINT256
} from "../../../components/hexagons";
import {
    IonButton,
    IonChip,
    IonCol,
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
    IonListHeader,
    IonLoading,
    IonModal,
    IonPage,
    IonRow,
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
    cashOutline,
    chevronBack,
    expandOutline, homeOutline,
    listOutline,
    logOut,
    personAddOutline, planet, pricetagsOutline,
    remove,
    search,
} from 'ionicons/icons';
import './index.scss';
import starGridRpc from "../../../rpc/epoch/stargrid";
import walletWorker from "../../../worker/walletWorker";
import {
    AccountModel,
    ChainType,
    Counter, DepositType, DriverStarGrid, ENDetails,
    Land,
    LockedInfo,
    NftInfo, StarGridTrustInfo,
    StarGridType,
    Transaction, UserDeposit,
    UserPosition
} from "../../../types";
import url from "../../../utils/url";
import EthToken from "../../../contract/erc20/eth";
import * as config from "../../../config";
import * as utils from "../../../utils";
import ConfirmTransaction from "../../../components/ConfirmTransaction";
import Erc721 from "../../../contract/erc721/meta/eth";
import BigNumber from "bignumber.js";
import rpc from "../../../rpc";
import {epochStarGrid, epochStarGridOperator, epochStarGridQuery} from "../../../contract/epoch/bsc";
import interVar, {interVarEpoch} from "../../../interval";
import HexInfoCard from "./hex-info";
import EthContract from "../../../contract/EthContract";
import {CounterList} from "./CounterList";
import {CounterAdd} from "./CounterAdd";
import {FeeModal} from "./FeeModal";
import {Settlement} from "./Settlement";
import {Prepare} from "./Prepare";
import selfStorage from "../../../utils/storage";
import {PowerDistribution} from "./PowerDistrbution";
import {PlanetList} from "./PlanetList";
import {ApprovedList} from "./ApprovedList";
import {enType2Cy} from "../../../utils/stargrid";
import {UserDepositModal} from "./UserDeposit";
import {CounterSelectModal} from "./CounterSelectModal";
import {isEmptyPlanet} from "./utils";
import i18n from "../../../locales/i18n";
import {DriverInfo} from "../../../contract/epoch/sero/types";
import {CONTRACT_ADDRESS} from "../../../config";
import {CountDown} from "../../../components/countdown";

interface ApproveState{
    bLIGHT:boolean
    WATER:boolean
    EARTH:boolean
    bDARK:boolean
    "EARTH-BUSD-LP":boolean
    "WATER-BUSD-LP":boolean
    BUSD:boolean
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
    userPositions?:UserPosition
    account?:AccountModel
    btnRef:any
    showCaptureModal:boolean
    showCounterAdd:boolean
    feeData?:any;
    feeOk?:any;
    feeCancel?:any;
    lockedInfo?:LockedInfo
    showSettlementModal:boolean
    showPrepareModal:boolean
    mp:Map<string,number>
    activeLeft:boolean
    activeBottom:boolean
    showPowerDistribution:boolean,
    showMyPlanetModal:boolean
    myPlanetArr:Array<Land>;

    dragXY:Array<number>

    amountTitle1?:any,
    amountTitle2?:any,

    balanceMap?: any,
    showApprovedList:boolean,
    approvedInfo?: StarGridTrustInfo,
    showDetailModal:boolean
    lockedUserInfo?:LockedInfo
    lockedUserAddress?:string
    defaultPlanet?:Land
    showSelectPlanetModal:boolean

    method?:string
    enDetails?:ENDetails
    planetTab?:string

    showUserDeposit:boolean
    userDepositArr?:Array<UserDeposit>

    withdrawUserDeposit?: UserDeposit
    showCounterSelectModal:boolean
    counterSelectData:Array<Counter>

    driver?:DriverStarGrid
}
export const yellowColors = ["e8dda7","e8dda6","e8dca5","e7dca4","e7dba3","e7dba2","e6daa1","e6d99f","e5d99e","e5d89c","e4d79b","e4d799","e4d698","e3d696","e3d595","e3d594","e3d593","e3d492","e2d492","e2d391","e2d390","e2d290","e2d290","e2d190","e1d190","e1d090","e0d090","e0cf91","dfcf91","dfce92","decd92","decd93","ddcc93","dccb94","dccb94","dbca95","dac995","d9c896","d9c896","d8c796","d7c696","d7c596","d6c596","d6c496","d5c396","d5c396","d4c296","d4c295","d3c195","d3c194","d3c094","d2c093","d2bf93","d2bf92","d1be92","d1be91","d0bd91","d0bd90","d0bc90","cfbc8f","cfbb8f","cfbb8f","cebb8e","ceba8e","cdba8d","cdb98d","cdb98c","ccb98c","ccb88b","ccb88b","ccb78a","cbb78a","cbb789","cbb689","cbb688","cab588","cab587","cab487","c9b486","c9b386","c8b285","c8b285","c7b184","c7b184","c7b083","c6af82","c6af81","c5ae81","c5ad80","c5ad80","c5ac7f","c5ac7e","c5ab7e","c5ab7d","c5aa7d","c5aa7d","c5a97c","c5a97c","c5a87b","c5a87b","c5a87b","c5a77b","c5a77b","c5a67a","c5a67a","c5a67a","c5a679","c5a579","c5a578","c6a578","c6a578","c7a577","c7a577","c8a576","c8a476","c9a475","c9a475","caa474","caa373","caa373","cba372","cba272","cba271","cba171","cba170","cba06f","cba06e","ca9f6e","ca9e6d","ca9e6c","ca9d6b","c99c6b","c99b6a","c99a69","c89969","c89868","c89767","c79667","c79566","c69465","c59364","c59264","c49163","c39062","c28f61","c18e61","c08c60","be8b5f","bd8a5f","bc895e","bb885d","ba875d","b8855c","b7845c","b6835b","b4825b","b3815a","b1805a","b07f5a","ae7e59","ad7d59","ab7c59","aa7b58","a87a58","a77957","a57857","a37857","a27757","a07657","9e7557","9d7557","9b7457","9a7357","997357","977256","967156","957055","946f55","926f54","916e54","906c53","8f6b53","8e6a52","8c6952","8b6851","8a6750","886650","87654f","86644e","84634e","83624d","82614c","80604c","7f5f4b","7e5e4a","7c5d4a","7b5c49","7a5b48","795a48","785a47","775946","765846","755745","745745","745644","735644","735543","725543","725442","725442","725341","725341","725240","725240","72513f","72513f","73503e","734f3d","734f3d","744e3c","744d3b","754d3a","754c3a","754b39","764a38","764937","764936","764835","764735","764634","754633","754532","744432","734431","724331","714230","704230","6f412f","6e412f","6d402e","6b3f2e","6a3f2d","693e2c","683d2c","673d2b","663c2a","653b2a","653b29","643a28","633a28","633927","623926","623826","613725","613725","613724"];
export const blueColors = ["c4cadc","c4cadb","c3c9db","c2c9da","c1c8da","c1c8da","c0c7d9","bec7d9","bdc6d9","bcc6d9","bbc5d9","b9c5d9","b8c4d9","b6c4d9","b5c3d9","b3c3d9","b2c2d9","b0c2d9","afc1d9","adc1d9","acc0d9","aac0d9","a9bfd9","a8bed9","a6bed9","a5bdd9","a4bdd9","a3bcd9","a2bbd9","a0bbd9","9fbad9","9ebad9","9dbad9","9bb9d9","9ab9d9","99b8d9","97b8d9","96b8d9","94b7d8","93b7d8","92b7d8","90b7d8","8fb7d8","8eb6d8","8db6d8","8bb5d8","8ab5d8","89b4d8","88b4d8","87b3d8","86b3d8","85b3d8","84b2d8","83b2d8","82b1d8","80b1d8","7fb0d8","7eb0d8","7dafd8","7cafd8","7baed8","7aaed8","78add8","77add8","76add8","74acd8","73acd8","72acd9","71abd9","70abd9","6fabd9","6eabd9","6dabd9","6caad9","6baad9","6aa9d9","69a9d8","69a9d8","68a8d8","67a8d8","66a7d8","65a7d8","65a7d8","64a6d8","63a6d8","62a6d8","61a5d8","60a5d8","5fa5d8","5ea4d8","5ea4d8","5da4d8","5ca4d8","5ca4d8","5ba3d8","5aa3d8","5aa2d8","59a2d8","58a2d8","58a1d8","57a1d8","56a0d8","56a0d8","55a0d8","549fd8","549fd8","539fd8","529ed8","519ed8","519ed8","509ed8","4f9ed8","4f9dd8","4e9dd8","4e9dd8","4d9cd8","4d9cd8","4c9bd8","4c9bd8","4b9bd8","4b9ad8","4b9ad8","4a9ad8","4a99d8","4999d8","4999d8","4998d8","4898d8","4797d8","4797d8","4696d8","4696d8","4596d8","4496d8","4495d8","4395d8","4394d8","4294d8","4293d8","4293d8","4192d8","4191d8","4091d8","3f90d8","3f8fd8","3e8ed8","3e8dd8","3d8cd8","3c8bd8","3c8ad8","3b89d8","3a88d8","3a86d8","3985d8","3884d8","3782d8","3781d8","367fd8","357dd8","357bd8","3479d8","3377d8","3375d8","3273d8","3270d8","316ed8","316cd8","306bd8","2f69d8","2f67d9","2e66d9","2e64d9","2d62d9","2d61d9","2c60d9","2c5fd9","2c5ed9","2b5dd9","2b5cd9","2b5bd9","2b5ad9","2a5ad9","2a59d9","2a58d9","2958d9","2957d9","2957d9","2956d9","2856d9","2856d9","2855d9","2855d8","2754d8","2754d8","2754d8","2753d8","2653d8","2653d8","2652d8","2652d8","2552d8","2551d8","2551d8","2550d8","2450d8","244fd8","244fd8","244ed8","234ed8","234dd8","234dd8","224dd8","224cd8","224cd8","224cd8","214bd8","214bd8","214bd8","214bd8","204ad8","204ad8","204ad8","1f49d8","1f49d8","1e48d8","1e48d8","1d47d8","1d47d8","1c47d8","1c46d8","1b46d8","1b45d8","1b45d8","1a45d8","1a44d8","1944d8","1944d8","1843d8","1843d8","1743d8","1742d8","1642d8","1642d8","1542d8","1542d8","1441d8","1441d8","1341d8","1341d8","1240d8","1140d8","1140d8","1040d8","0f40d8","0f40d8","0e40d8"];
const chain = ChainType.BSC;
const centerHex = axialCoordinatesToCube(0x10000,-0x10000);
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
        recRange:[(9-defaultHexSize)*3,(9-defaultHexSize)*3],
        rangeLand:[],
        approvedStarGridState:{
            bLIGHT:false,WATER:false,EARTH:false,bDARK:false,"EARTH-BUSD-LP":false,"WATER-BUSD-LP":false,BUSD:false,
        },
        approvedOperatorState:{
            bLIGHT:false,WATER:false,EARTH:false,bDARK:false,"EARTH-BUSD-LP":false,"WATER-BUSD-LP":false,BUSD:false
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
        btnRef:<></>,
        showCaptureModal:false,
        showCounterAdd:false,
        showSettlementModal:false,
        showPrepareModal:false,
        mp:new Map<string, number>(),
        activeLeft:true,
        activeBottom:true,
        showPowerDistribution:false,
        dragXY:[0,0],
        showMyPlanetModal:false,
        myPlanetArr:[],
        showApprovedList:false,
        showDetailModal:false,
        showSelectPlanetModal:false,
        planetTab:"owner",
        showUserDeposit:false,
        showCounterSelectModal:false,
        counterSelectData:[]
    }
    componentDidMount() {
        interVarEpoch.start(()=>{
            interVar.latestOpTime = Date.now();
            this.init().catch(e=>{
                console.error(e)
            })
        },5*1000,true)
    }

    init = async ()=>{
        let {absoluteHex,hexSize,targetHex,showApproveAllModal,approvedStarGridState,approvedStarGrid} = this.state;
        const account = await walletWorker.accountInfo();
        const owner = account.addresses[chain];
        const userPosition = await starGridRpc.userPositions(owner,10);
        // const uMap:Map<string,boolean> = new Map<string, boolean>()
        // if(userPosition ){
        //     if(centerHex.equalHex(absoluteHex)){
        //         absoluteHex = axialCoordinatesToCube(userPosition.recommendation.maxQ,userPosition.recommendation.maxS)
        //     }
        //     if(userPosition.positions && userPosition.positions.length>0){
        //         if(centerHex.equalHex(absoluteHex)){
        //             absoluteHex = toAxial(userPosition.positions[0].coordinate)
        //         }
        //     }
        // }
        const rang = [(9-hexSize)*3,(9-hexSize)*3];
        const leftBottom = axialCoordinatesToCube(absoluteHex.x-rang[0],absoluteHex.z+rang[1]);
        const rightTop = axialCoordinatesToCube(absoluteHex.x+rang[0],absoluteHex.z-rang[1]);
        const rangeLandPromise = starGridRpc.rangeLand(owner,toUINT256(leftBottom),toUINT256(rightTop));
        const lockedInfoPromise = epochStarGridQuery.lockedInfo(owner)
        const countersPromise =  this.getCounters()
        const enDetailsPromise = epochStarGridQuery.currentENDetails(owner);
        const rest = await Promise.all([rangeLandPromise,lockedInfoPromise,countersPromise,enDetailsPromise])
        let approveRest:Array<any> = [approvedStarGrid,approvedStarGridState,false];
        if(!showApproveAllModal){
            approveRest = await this.queryApprove();
        }
        const balance = await rpc.getBalance(chain,"");
        // const rangeLands:Array<Land> = rest[0];
        // const newTargetHex: Array<HexInfo> = [];
        // if(targetHex && targetHex.length>0 && rangeLands && rangeLands.length>0){
        //     for(let i=0;i<targetHex.length;i++){
        //         const t = targetHex[i];
        //         const rs = rangeLands.filter(v=> v.coordinate == toUINT256(t.hex));
        //         let flag = false;
        //         if(rs && rs.length>0){
        //             const v = rs[0];
        //             if(t.counter && (!v.counter || v.counter.counterId == "0") ||
        //                 v.counter && (!t.counter || t.counter.counterId == "0") ||
        //                 t.counter && v.counter && t.counter.counterId!= "0" && v.counter.counterId!="0"
        //                 && t.counter.counterId != v.counter.counterId){
        //                 flag = true
        //             }
        //         }
        //         if(flag){
        //             newTargetHex.push({hex:t.hex,counter:rs[0].counter,land:rs[0]})
        //         }else{
        //             newTargetHex.push(t)
        //         }
        //     }
        // }
        this.setState({
            // absoluteHex:absoluteHex,
            rangeLand:rest[0],
            userPositions:userPosition,
            account:account,
            counters:rest[2],
            approvedStarGrid:approveRest[0],
            approvedStarGridState:approveRest[1],
            showModalApprove:approveRest[2],
            lockedInfo:rest[1],
            recRange:rang,
            balanceMap:balance,
            // targetHex:newTargetHex,
            enDetails: rest[3]
        })
    }

    getBalance = (cy:string,fix:number = 3) => {
       const {balanceMap} = this.state;
       if(balanceMap[cy]){
          return utils.fromValue(balanceMap[cy],18).toFixed(fix)
       }
       return 0
    }

    getCounters = async (type?:StarGridType)=>{
        const account = await walletWorker.accountInfo();
        const nfts = await rpc.getTicket(chain,"")
        const counters:Array<Counter> = [];
        if(nfts){
            const infos:Array<NftInfo> = nfts[CONTRACT_ADDRESS.ERC721.COUNTER.SYMBOL.BSC];
            if(!infos || infos.length==0){
                return counters
            }
            for(let info of infos){
                const counter = await starGridRpc.counterInfo(info.tokenId)
                if(!counter || type && type != counter.enType){
                    continue
                }
                    // await epochStarGridQuery.counterInfo(info.tokenId,account.addresses[chain])//await starGridRpc.counterInfo(info.tokenId)
                counters.push(counter)
            }
        }
        return counters
    }

    queryApprove = async ()=>{
        try{
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
        }catch (e){
            console.error(e)
            return Promise.reject("Query Error")
        }
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
            const data = await token.approve(spender,utils.toValue(1e18,18));
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
        interVarEpoch.latestOpTime = Date.now();
    }
    approveToStarGrid = async ()=>{
        const tx = await this.genApproveTx();
        this.setState({
            tx:tx,
            showConfirm:true,
        })

        interVarEpoch.latestOpTime = Date.now();
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
            showModalApprove:false,
            showApproveAllModal:true
        })

        interVarEpoch.latestOpTime = Date.now();
    }

    commitApproveTxs = async ()=>{
        const {txs} = this.state;
        for(let tx of txs){
            const hash =  await rpc.commitTx(tx,"");
            await this.waitHash(hash)
            await this.queryApprove()
        }
        return Promise.resolve();
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
                },2*1000)
            }
        }).catch((e: any) => {
            const err = typeof e == "string"?e:e.message;
            return Promise.reject(err)
        })
    }

    createConfirm = async (type:StarGridType,num:number,depositType:DepositType)=>{
        const account = await walletWorker.accountInfo()
        const rest = await epochStarGridOperator.estimateCreate(type,num,depositType,account.addresses[chain])
        const maxCost = rest[2];
        const feeData:any = {
            "Counter Type": <b><IonText color="primary">EMIT-{StarGridType[type]}</IonText></b>,
            "Staking Type" : <b><IonText color="primary">{DepositType[depositType]}</IonText></b>,
            "Number": <b><IonText color="secondary">{num}</IonText></b>,
            "Balance": <b><IonText color="secondary">{utils.nFormatter(utils.fromValue(rest[1],18),6)}</IonText><small><IonText color="primary">{rest[0]}</IonText></small></b>,
            "Estimate Cost":<b><IonText color="secondary">{utils.nFormatter(utils.fromValue(maxCost,18),3)}</IonText><small><IonText color="primary">{rest[0]}</IonText></small></b>,
        }
        this.setState({
            feeData:feeData,
            feeCancel:()=>{this.setState({feeData:""})},
            feeOk:()=>{
                this.setState({feeData:""})
                this.setShowLoading(true)
                this.create(type,num,depositType,maxCost).then(()=>{
                    this.setShowLoading(false)
                }).catch((e)=>{
                    this.setShowLoading(false)
                    const err = typeof e == "string"?e:e.message;
                    this.setShowToast(true,err)
                })
            }
        })

        interVarEpoch.latestOpTime = Date.now();
    }

    deadline = () =>{
        return  Math.floor((Date.now()+60*60*1000)/1000);
    }

    create = async (type:StarGridType,num:number,depositType:DepositType,maxCost) =>{
        const data = await epochStarGridOperator.create(type,num,depositType,new BigNumber(maxCost),this.deadline())
        const tx = await this.genTx(epochStarGridOperator,data);
        this.setState({
            tx:tx,
            showConfirm:true
        })

        interVarEpoch.latestOpTime = Date.now();
    }

    captureConfirm = async (counterId:string,baseAmountIn:BigNumber,attachAmountIn:BigNumber)=>{
        const {targetHex,counters,defaultPlanet} = this.state;
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
        const defaultCoo = !isEmptyPlanet(defaultPlanet) ?defaultPlanet.coordinate:"0"
        const hex = toUINT256(coo)
        // @ts-ignore
        const rest:Array<string> = await epochStarGrid.capture(counterId,hex,utils.toValue(baseAmountIn,18),utils.toValue(attachAmountIn,18),defaultCoo,account.addresses[ChainType.BSC])
        // const tx = await this.genTx(epochStarGrid,data)
        const base = counter[0].enType == StarGridType.EARTH ? "bDARK":"bLIGHT";
        const attach = counter[0].enType == StarGridType.EARTH ? "WATER":"EARTH"
        //(baseCost,attachCost,createBaseCost,createAttachCost,feeRate)
        const baseCost = utils.fromValue(rest[0],18);
        const attachCost = utils.fromValue(rest[1],18);
        const createBaseCost = utils.fromValue(rest[2],18);
        const createAttachCost = utils.fromValue(rest[3],18);
        const feeRate = utils.fromValue(rest[4],0);
        const createFeeRate = utils.fromValue(rest[5],0);
        const feeData:any = {
            showDesc:true,
            "Periods": <p><IonText color="secondary"><b>7</b></IonText>&nbsp;<small>Periods</small></p>,
            "Burned per Period": <>
                <p><IonText color="secondary"><b>{baseAmountIn.toString(10)}</b></IonText>&nbsp;<small>{base}/period</small></p>
                <p><IonText color="secondary"><b>{attachAmountIn.toString(10)}</b></IonText>&nbsp;<small>{attach}/period</small></p>
            </>,
            "Fee Rate": <p><b><IonText color="secondary">{feeRate.toNumber()}%</IonText></b></p>,
            "Total Materials": <>
                <p><IonText color="secondary"><b>{baseCost.toString(10)}</b></IonText>&nbsp;<small>{base}</small></p>
                <p><IonText color="secondary"><b>{attachCost.toString(10)}</b></IonText>&nbsp;<small>{attach}</small></p>
            </>,
        }
        if(createBaseCost.toNumber()>0 || createAttachCost.toNumber() >0){
            feeData["Burn for create planet"] = <>
                <p><IonText color="secondary"><b>{createBaseCost.toString(10)}</b></IonText>&nbsp;<small>{base}</small></p>
                <p><IonText color="secondary"><b>{createAttachCost.toString(10)}</b></IonText>&nbsp;<small>{attach}</small></p>
                <p>{i18n.t("include")}&nbsp;<IonText color="secondary"><b>{createFeeRate.toString(10)}%</b></IonText>&nbsp;{i18n.t("fee")}</p>
            </>
        }
        feeData["Need Burn"] =  <>
            <p><IonText color="secondary"><b>{baseCost.plus(createBaseCost).toString(10)}</b></IonText>&nbsp;<small>{base}</small></p>
            <p><IonText color="secondary"><b>{attachCost.plus(createAttachCost).toString(10)}</b></IonText>&nbsp;<small>{attach}</small></p>
        </>
        this.setState({
            feeData:feeData,
            feeCancel:()=>{this.setState({feeData:""})},
            feeOk:()=>{
                this.setState({feeData:""})
                this.setShowLoading(true)
                this.capture(counterId,baseAmountIn,attachAmountIn,defaultCoo).then(()=>{
                    this.setShowLoading(false)
                }).catch((e)=>{
                    this.setShowLoading(false)
                    const err = typeof e == "string"?e:e.message;
                    this.setShowToast(true,err)
                })
            }
        })

        interVarEpoch.latestOpTime = Date.now();
    }

    capture = async (counterId:string,baseAmount:BigNumber,attachAmount:BigNumber,defaultCoo:string = "0")=>{
        const {targetHex} = this.state;
        let coo:Hex|undefined;
        if(targetHex.length == 1){
            coo = targetHex[0].hex
        }
        const hex = toUINT256(coo)
        //@ts-ignore
        const data:string = await epochStarGrid.capture(counterId,hex,utils.toValue(baseAmount,18),utils.toValue(attachAmount,18),defaultCoo)
        const tx = await this.genTx(epochStarGrid,data)
        this.setState({
            tx:tx,
            showConfirm:true,
            feeData: ""
        })

        interVarEpoch.latestOpTime = Date.now();
    }

    logout = async ()=>{
        const data = await epochStarGrid.logout()
        const tx = await this.genTx(epochStarGrid,data);

        this.setState({
            tx:tx,
            showConfirm:true
        })

        interVarEpoch.latestOpTime = Date.now();
    }

    settlement = async ()=>{
        const data = await epochStarGrid.settlement()
        const tx = await this.genTx(epochStarGrid,data);
        this.setState({
            tx:tx,
            showConfirm:true
        })

        interVarEpoch.latestOpTime = Date.now();
    }

    moveTo = async (hex:Hex) =>{
        const data = await epochStarGrid.moveTo(toUINT256(hex))
        const tx = await this.genTx(epochStarGrid,data);
        this.setState({
            tx:tx,
            showConfirm:true
        })

        interVarEpoch.latestOpTime = Date.now();
    }

    move = async (setTag:boolean,createPlanet:boolean)=>{
        const {targetHex,lockedInfo} = this.state;
        const account = await walletWorker.accountInfo()
        if(targetHex.length == 0){
            this.setShowToast(true,"No step to move!")
            return
        }
        if(setTag && createPlanet){
            this.setShowToast(true,"Can't mark and create planet in one operator !")
            return
        }
        const routers:Array<number>=[];
        if(targetHex.length > 1){
            for(let i=1;i<targetHex.length;i++){
                const start = targetHex[i-1].hex;
                const hex = targetHex[i].hex;
                if(targetHex[i].counter){
                    for(let dir =0;dir<6;dir++){
                        //@ts-ignore
                        const neighbor = neighboor(start,dir)
                        if(neighbor.equalHex(hex)){
                            routers.push(dir+9)
                            break
                        }
                    }
                }else {
                    let rd = 0;
                    for(let dir =0;dir<6;dir++){
                        //@ts-ignore
                        const neighbor = neighboor(start,dir)
                        if(neighbor.equalHex(hex)){
                            rd = dir+3;
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
        }
        if(setTag){
            routers.push(2)
        }else if(createPlanet){
            routers.push(1)
        }
        routers.push(0)
        routers.reverse();
        const opcode = toOpCode(routers,5);
        const rest =  await epochStarGrid.active("0x"+new BigNumber(opcode,2).toString(16),account.addresses[chain])
        const baseAmount = utils.fromValue(rest[0],18);
        const attachAmount = utils.fromValue(rest[1],18);
        const feeRate = rest[2];

        if(baseAmount.toNumber() == 0 && attachAmount.toNumber() == 0 ){
            this.setShowLoading(true);
            this.active(opcode).then(()=>{
                this.setShowLoading(false)
            }).catch((e)=>{
                this.setShowLoading(false)
                const err = typeof e == "string"?e:e.message;
                this.setShowToast(true,err)
            })
        }else{
            const eType = enType2Cy(lockedInfo.userInfo.counter.enType)
            const feeData:any = {
                "showDesc": true,
                "Fee Rate": <><IonText color="secondary">{feeRate}%</IonText></>,
                "Amount": <>
                    <p><IonText color="secondary"><b>{baseAmount.toString(10)}</b></IonText>&nbsp;<small>{eType.base}</small></p>
                    <p><IonText color="secondary"><b>{attachAmount.toString(10)}</b></IonText>&nbsp;<small>{eType.attach}</small></p>
                </>
            }
            this.setState({
                feeData:feeData,
                feeCancel:()=>{this.setState({feeData:""})},
                feeOk:()=>{
                    this.setState({feeData:""})
                    this.setShowLoading(true)
                    this.active(opcode).then(()=>{
                        this.setShowLoading(false)
                    }).catch((e)=>{
                        this.setShowLoading(false)
                        const err = typeof e == "string"?e:e.message;
                        this.setShowToast(true,err)
                    })
                }
            })
        }


        interVarEpoch.latestOpTime = Date.now();
    }

    active = async (opconde:string) =>{
        const data:any = await epochStarGrid.active("0x"+new BigNumber(opconde,2).toString(16))
        const tx = await this.genTx(epochStarGrid,data);
        this.setState({
            tx:tx,
            showConfirm:true
        })

        interVarEpoch.latestOpTime = Date.now();
    }

    prepare = async (terms:number,baseAmount:BigNumber,attachAmount:BigNumber)=>{
        const {defaultPlanet} = this.state;
        const defaultCoordinate = !isEmptyPlanet(defaultPlanet) ?defaultPlanet.coordinate:"0"
        const data:any = await epochStarGrid.prepare(utils.toValue(baseAmount,18),utils.toValue(attachAmount,18),terms,defaultCoordinate)
        const tx = await this.genTx(epochStarGrid,data)
        this.setState({
            tx:tx,
            showConfirm:true
        })

        interVarEpoch.latestOpTime = Date.now();
    }

    prepareConfirm = async (terms:number, a:BigNumber,b:BigNumber) =>{
        const {lockedInfo,defaultPlanet} = this.state;
        const account = await walletWorker.accountInfo();
        const baseAmount = new BigNumber(a);
        const attachAmount = new BigNumber(b)
        const defaultCoordinate = !isEmptyPlanet(defaultPlanet) ?defaultPlanet.coordinate:"0"
        const rest:any = await epochStarGrid.prepare(utils.toValue(baseAmount,18),utils.toValue(attachAmount,18),terms,defaultCoordinate,account.addresses[ChainType.BSC])
        let base;
        let attach;
        let availableBase:BigNumber;
        let availableAttach:BigNumber;
        if( lockedInfo.userInfo.counter.enType == StarGridType.EARTH){
            base = "bDARK";
            attach = "WATER"
            availableBase = utils.fromValue(lockedInfo.userInfo.darkCanUsed,18);
            availableAttach = utils.fromValue(lockedInfo.userInfo.waterCanUsed,18);
        }else if( lockedInfo.userInfo.counter.enType == StarGridType.WATER){
            base = "bLIGHT";
            attach = "EARTH"
            availableBase = utils.fromValue(lockedInfo.userInfo.lightCanUsed,18);
            availableAttach = utils.fromValue(lockedInfo.userInfo.earthCanUsed,18);
        }
        const total1 = utils.fromValue(rest[0],18);
        const total2 = utils.fromValue(rest[1],18);


        //baseCost,attachCost,feeRate
        const feeData:any = {
            showDesc: true,
            "Periods": <p><IonText color="secondary"><b>{terms}</b></IonText>&nbsp;Periods</p>,
            "Temp Materials": <>
                <p><IonText color="secondary"><b>{utils.nFormatter(availableBase,3)}</b></IonText>&nbsp;<small>{base}</small></p>
                <p><IonText color="secondary"><b>{utils.nFormatter(availableAttach,3)}</b></IonText>&nbsp;<small>{attach}</small></p>
            </>,
            "Materials/Period": <>
                <p><IonText color="secondary"><b>{baseAmount.toString(10)}</b></IonText>&nbsp;<small>{base}</small></p>
                <p><IonText color="secondary"><b>{attachAmount.toString(10)}</b></IonText>&nbsp;<small>{attach}</small></p>
            </>,
            "Fee Rate":<IonText color="secondary"><b>{rest[2]}%</b></IonText>,
            "Need Burn": <>
            <p><IonText color="secondary"><b>{total1.toString(10)}</b></IonText>&nbsp;<small>{base}</small></p>
            <p><IonText color="secondary"><b>{total2.toString(10)}</b></IonText>&nbsp;<small>{attach}</small></p>
        </>,
        }
        this.setState({
            feeData:feeData,
            feeCancel:()=>{this.setState({feeData:""})},
            feeOk:()=>{
                this.prepare(terms,baseAmount,attachAmount).then(()=>{
                    this.setState({feeData:""})
                }).catch(e=>{
                    const err = typeof e =="string"?e:e.message;
                    this.setShowToast(true,err)
                    this.setState({feeData:""})
                })
            }
        })


        interVarEpoch.latestOpTime = Date.now();

    }
    setApproveToUser = async (addr:string,bool:boolean)=>{
        const data = await epochStarGrid.setApproval(addr,bool)
        const tx = await this.genTx(epochStarGrid,data)
        this.setState({
            tx:tx,
            showConfirm:true
        })

        interVarEpoch.latestOpTime = Date.now();
    }

    setShowSelectPlanet = async (f:boolean,methd:string) =>{
        let {lockedInfo,defaultPlanet,method} = this.state;
        let enType = 0;
        if(lockedInfo.userInfo.counter.counterId != "0"){
            enType = lockedInfo.userInfo.counter.enType;
        }else if(!isEmptyPlanet(defaultPlanet)){
            enType = defaultPlanet.enType;
        }
        let arr:Array<Land> = [];
        if(f){
            const account = await walletWorker.accountInfo();
            //TODO pagination
            arr = await starGridRpc.myPlanet(account.addresses[ChainType.BSC],1,new BigNumber(enType).toNumber(),0,500);
        }
        if(methd){
            method = methd;
        }
        const state = {
            showSelectPlanetModal:f,
            showLoading:false,
            myPlanetArr:arr,
            method:method
        }
        if(method == "prepare"){
            state["showPrepareModal"] = !f;
        }else if(method == "capture"){
            state["showCounterList"] = !f;
        }
        this.setState(state)
    }

    setShowCounterSelectModal = async (f:boolean,v?:UserDeposit) =>{
        if(!v && f){
            this.setShowToast(true,"Not select withdraw items!")
            return;
        }
        if(f){
            const arr = await this.getCounters(v.enType)
            this.setState({
                showUserDeposit:!f,
                counterSelectData:arr,
                showCounterSelectModal:f,
                showLoading:false,
                withdrawUserDeposit:v
            })
        }else{
            this.setState({
                showUserDeposit:!f,
                showCounterSelectModal:f,
                showLoading:false,
            })
        }
    }

    confirmWithdrawUserDeposit = async (counterId:string,v?:UserDeposit)=>{
        const {withdrawUserDeposit} = this.state;
        if(!v){
            v = withdrawUserDeposit
        }
        const account = await walletWorker.accountInfo();
        const deadline = this.deadline();
        const estimateRest = await epochStarGridOperator.withDraw(v.index,counterId,new BigNumber(0),deadline,account.addresses[chain])
        const backedAmount = new BigNumber(estimateRest[1]).multipliedBy(1-0.005).toFixed(0);

        //baseCost,attachCost,feeRate
        const feeData:any = {
            showDesc: false,
            "Staking Index": <b><IonText color="secondary">{v.index}</IonText></b>,
            "Estimate Min Return": <>
            <p><IonText color="secondary"><b>{utils.nFormatter(utils.fromValue(backedAmount,18),6)}</b></IonText>&nbsp;{estimateRest[0]}</p>
            </>,
        }
        if(counterId != "0"){
            feeData["Destroy CounterId"]=<b><IonText color="secondary">{counterId}</IonText></b>;
        }

        this.setState({
            showUserDeposit:false,
            feeData:feeData,
            feeCancel:()=>{this.setState({feeData:"",showUserDeposit:false})},
            feeOk:()=>{
                this.withdrawUserDeposit(v.index,counterId,backedAmount,deadline).then(()=>{
                    this.setState({feeData:"",showUserDeposit:false})
                }).catch(e=>{
                    const err = typeof e =="string"?e:e.message;
                    this.setShowToast(true,err)
                    this.setState({feeData:""})
                })
            }
        })
    }

    withdrawUserDeposit = async (index:string,counterId:string,backedAmount:string,deadline:number)=>{
        const data = await epochStarGridOperator.withDraw(index,counterId,new BigNumber(backedAmount),deadline)
        const tx = await this.genTx(epochStarGridOperator,data)
        this.setState({
            tx:tx,
            showConfirm:true
        })
        interVarEpoch.latestOpTime = Date.now();
    }

    updateCounter = async (opcode:string)=>{
        const data = await epochStarGrid.updateCounter("0x"+new BigNumber(opcode,2).toString(16))
        const tx = await this.genTx(epochStarGrid,data)
        this.setState({
            tx:tx,
            showConfirm:true
        })

        interVarEpoch.latestOpTime = Date.now();
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

        interVarEpoch.latestOpTime = Date.now();
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

    moveNeighbor = (t:string,absoluteHex:Hex)=>{
        const {hexSize} = this.state;
        if("u" == t){
            absoluteHex = neighboor(neighboor(absoluteHex,0),5)// addHex(addHex(absoluteHex,directions[0]),directions[5]);
            if(hexSize <=1 ){
                absoluteHex = neighboor(neighboor(absoluteHex,0),5)
            }
        }else if ("d" == t){
            absoluteHex = neighboor(neighboor(absoluteHex,2),3);
            if(hexSize <=1 ){
                absoluteHex =  neighboor(neighboor(absoluteHex,2),3);
            }
        }else if ("r" == t){
            absoluteHex = neighboor(neighboor(absoluteHex,1),1);// addHex(addHex(absoluteHex,directions[1]),directions[1]);
            if(hexSize <=1 ){
                absoluteHex = neighboor(neighboor(absoluteHex,1),1);
            }
        }else if ("l" == t){
            absoluteHex = neighboor(neighboor(absoluteHex,4),4);
            if(hexSize <=1 ){
                absoluteHex = neighboor(neighboor(absoluteHex,4),4);
            }
        }
        return absoluteHex
    }

    arrow=(t:string)=>{
        let {absoluteHex,dragXY,hexSize} = this.state;
        const absHex = this.moveNeighbor(t,absoluteHex)
        selfStorage.setItem("absoluteHex",absHex)
        this.setState({
            absoluteHex:absHex,
            dragXY:[]
        })

        interVarEpoch.latestOpTime = Date.now();
    }

    // dark background
    // d97a00    e2d000
    // f8c21f      e5e598

    setTarget = (h:HexInfo):Array<HexInfo> =>{
        const {targetHex,lockedInfo} = this.state;
        const originLen = targetHex.length;

        if(originLen == 1 && (
            noCounter(targetHex[0])
            || lockedInfo && targetHex[0].counter && lockedInfo.userInfo.counter.counterId != targetHex[0].counter.counterId
            || distanceBetweenHexes(targetHex[0].hex,h.hex) > 1
        )){
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
        let {lockedInfo,targetHex,rangeLand,absoluteHex} = this.state;
        if(hex){
            const account = await walletWorker.accountInfo();
            const tHexes = this.setTarget(hex)
            // let ref:any;
            let mp:Map<string,number> = new Map<string, number>()
            if(lockedInfo && lockedInfo.userInfo.counter && lockedInfo.userInfo.counter.counterId !== "0"){
                if(tHexes.length>0 && rangeLand){
                    const tHex = tHexes[0];
                    const movement = new BigNumber(lockedInfo.userInfo.counter.move).toNumber();
                    if(tHex && tHex.counter && tHex.counter.counterId != "0"){
                        for (let land of rangeLand) {
                            if(distanceBetweenHexes(toAxial(land.coordinate),tHex.hex) > movement){
                               continue
                            }
                            let power = 1;
                            if(land && land.counter && land.counter.counterId !="0"){
                            }else{
                                if (!isEmptyPlanet(land) && tHex.counter.enType != land.enType) {
                                    if (land.marker == account.addresses[chain]) {
                                        power = 1;
                                    } else {
                                        power = 2 + new BigNumber(land.level).toNumber()
                                    }
                                }
                            }
                            mp.set(toAxial(land.coordinate).uKey(), power);
                        }
                    }
                }
            }
            let absHex = absoluteHex;
            if(x && y){
                const n = 1/12;
                const width = document.documentElement.clientWidth;
                const height= document.documentElement.clientHeight;
                if(x < width * n){
                    absHex = this.moveNeighbor("l",absoluteHex);
                }
                if(x > width * (1-n)){
                    absHex = this.moveNeighbor("r",absoluteHex);
                }
                if(y < height * n){
                    absHex = this.moveNeighbor("u",absoluteHex);
                }
                if(y > height * (1-n)){
                    absHex = this.moveNeighbor("d",absoluteHex);
                }
            }
            selfStorage.setItem("absoluteHex",absoluteHex)
            this.setState({
                showInfo:f,
                showLoading:false,
                targetHex: tHexes,
                mp:mp,
                dragXY:[x,y],
                absoluteHex:absHex
            })
        }else{
            this.setState({
                showInfo: f,
            })
        }

        interVarEpoch.latestOpTime = Date.now();
    }

    calcPlanetMap = ()=>{

        const {rangeLand,targetHex,recRange,mp} = this.state;
        let movement = 0;
        if(targetHex && targetHex.length>0){
            const selectedHex = targetHex[0];
            if(selectedHex.counter){
                movement = new BigNumber(selectedHex.counter.move).toNumber()
            }
        }
        const reachHexesGlobal:Array<Hex> = reachableHexes(movement,mp,targetHex,Math.floor(recRange[0]));
        const reachHexes:Array<Hex> = reachableHexesNeighbor(movement,mp,targetHex,rangeLand);

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

        return [reachHexesGlobal,reachHexes,pieceColors,counterMap,blues,yellows]

    }

    setShowModalApprove = (f:boolean)=>{
        this.setState({
            showModalApprove:f,
            showLoading:false,
        })

        interVarEpoch.latestOpTime = Date.now();
    }

    setShowLoading = (f:boolean)=>{
        this.setState({
            showLoading:f
        })
        interVarEpoch.latestOpTime = Date.now();
    }

    setShowConfirm = (f:boolean)=>{
        this.setState({
            showConfirm:f,
            showLoading:false,
        })
        interVarEpoch.latestOpTime = Date.now();
    }

    setShowToast(f:boolean,m?:string){
        this.setState({
            showToast:f,
            toastMessage:m,
            showLoading:false
        })
        interVarEpoch.latestOpTime = Date.now();
    }

    setShowPosition=(f:boolean)=>{
        this.setState({
            showPosition:f,
            showLoading:false,
        })
        interVarEpoch.latestOpTime = Date.now();
    }

    setShowCounterAdd = (f:boolean) =>{
        this.setState({
            showCounterAdd:f,
            showLoading:false,
        })
        interVarEpoch.latestOpTime = Date.now();
    }

    setShowDetailModal = (f:boolean,address?:string) => {
        if(f && address){
            this.setShowLoading(true)
           epochStarGridQuery.lockedInfo(address).then((rest)=>{
               this.setState({
                   showLoading:false,
                   showDetailModal:f,
                   lockedUserInfo:rest,
                   lockedUserAddress:address
               })
           }).catch(e=>{
               const err = typeof e == "string"?e:e.message;
               this.setShowToast(true,err)
           })
        }else{
            this.setState({
                showDetailModal:false
            })
        }
    }

    setShowPlanetModal = async (f:boolean,type:number = 2) =>{
        let arr:Array<Land> = [];
        if(f){
            const account = await walletWorker.accountInfo();
            //TODO pagination
            arr = await starGridRpc.myPlanet(account.addresses[ChainType.BSC],type,0,0,500);
        }
        this.setState({
            showMyPlanetModal:f,
            showLoading:false,
            myPlanetArr:arr,
            planetTab:type == 1 ?"owner":"marker"
        })
    }

    setShowUserDeposit = async (f:boolean) =>{
        if(f){
            const account = await walletWorker.accountInfo();
            const arr = await starGridRpc.userDeposit(account.addresses[ChainType.BSC],0,500);
            this.setState({
                showLoading:false,
                showUserDeposit:f,
                userDepositArr:arr,
            })
        }else{
            this.setState({
                showLoading:false,
                showUserDeposit:f,
            })
        }
    }

    confirm = async (hash: string) => {
        let intervalId: any = 0;
        this.setShowLoading(true);
        intervalId = setInterval(() => {
            rpc.getTxInfo(chain, hash).then(rest => {
                if (rest) {
                    clearInterval(intervalId)

                    interVarEpoch.latestOpTime = Date.now();
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

    setShowCaptureModal = async (f:boolean)=>{
        const state:any = {
            showCaptureModal:f,
            showLoading:false,
            amountTitle2:"",
            amountTitle1:"",
        };
        if(f){
            const account = await walletWorker.accountInfo();
            const driver = await starGridRpc.driverInfo(account.addresses[chain])
            state["driver"] = driver;
        }
        this.setState(state)
        interVarEpoch.latestOpTime = Date.now();
    }

    isFocusMyCounter = ():boolean =>{
        const {targetHex,lockedInfo} = this.state;
        return targetHex && targetHex.length>0 && targetHex[0].counter && lockedInfo && targetHex[0].counter.counterId == lockedInfo.userInfo.counter.counterId
    }

    setShowSettlementModal = (f:boolean) =>{
        this.setState({
            showSettlementModal:f,
            showLoading:false
        })
        interVarEpoch.latestOpTime = Date.now();
    }

    setShowPrepareModal = async (f:boolean) =>{
        let {lockedInfo,account} = this.state;
        const coo = lockedInfo.userInfo.counter.enType == StarGridType.WATER?lockedInfo.userInfo.userDefaultWaterCoordinate: lockedInfo.userInfo.userDefaultEarthCoordinate;
        if(f && coo!="0"){
            const v = await epochStarGridQuery.planetInfo(coo,account.addresses[chain])
            const driver = await starGridRpc.driverInfo(account.addresses[chain])
            this.setState({
                defaultPlanet:v,
                showLoading:false,
                showPrepareModal:f,
                driver:driver
            })
        }else{
            this.setState({
                showPrepareModal:f,
                showLoading:false,
            })
        }


        interVarEpoch.latestOpTime = Date.now();
    }

    setShowPowerDistribution = (f:boolean) =>{
        this.setState({
            showPowerDistribution: f,
            showLoading:false,
        })
        interVarEpoch.latestOpTime = Date.now();
    }

    renTitle = (cy:string) =>{
        return <div><b>{cy}/{i18n.t("period")}</b><p>{i18n.t("balance")}:<IonText color="primary">{this.getBalance(cy)}</IonText></p></div>
    }

    storeAbsoluteHex = (h:Hex) =>{
        selfStorage.setItem("absoluteHex",h)
    }

    setPosition = async (x:number,z:number) =>{
        const a = axialCoordinatesToCube(x,z);
        this.storeAbsoluteHex(a)

        this.setState({
            absoluteHex:a,
            showPosition:false,
            targetHex:[]
        })
    }

    setShowApproveList = async (f:boolean) =>{
        let ret:StarGridTrustInfo|undefined;
        if(f){
            const account = await walletWorker.accountInfo();
            ret =  await starGridRpc.myApproved(account.addresses[chain],0,500);
        }
        this.setState({
            showApprovedList:f,
            approvedInfo: ret,
            showLoading:false,
        })
    }

    selectCounter = async (counter:Counter) =>{
        const {lockedInfo} = this.state;
        const account = await walletWorker.accountInfo()

        if(counter.enType == StarGridType.EARTH){
            const planetInfo = lockedInfo.userInfo.userDefaultEarthCoordinate != "0"?
                await epochStarGridQuery.planetInfo(lockedInfo.userInfo.userDefaultEarthCoordinate,account.addresses[ChainType.BSC]):undefined;
            this.setState({
                amountTitle1: this.renTitle("bDARK"),
                amountTitle2: this.renTitle("WATER"),
                defaultPlanet:planetInfo
            })
        }else if(counter.enType == StarGridType.WATER){
            const planetInfo = lockedInfo.userInfo.userDefaultWaterCoordinate != "0"?
                await epochStarGridQuery.planetInfo(lockedInfo.userInfo.userDefaultWaterCoordinate,account.addresses[ChainType.BSC]):undefined;

            this.setState({
                amountTitle1: this.renTitle("bLIGHT"),
                amountTitle2: this.renTitle("EARTH"),
                defaultPlanet:planetInfo
            })
        }
    }

    inRange = (absHex:Hex):boolean =>{
        const {userPositions} = this.state;
        if(!userPositions || !userPositions.maxRange){
            return false
        }
        //maxQ: 65545, maxS: -65523
        return absHex.z <= userPositions.maxRange.maxS && absHex.z >= userPositions.maxRange.minS
        && absHex.x <= userPositions.maxRange.maxQ && absHex.x >= userPositions.maxRange.minQ
    }

    isHomeless = (hex:Hex):boolean =>{
        const {lockedInfo} = this.state;
        if(lockedInfo && (
            toAxial(lockedInfo.userInfo.userDefaultEarthCoordinate).equalHex(hex)
            || toAxial(lockedInfo.userInfo.userDefaultWaterCoordinate).equalHex(hex)
        )){
            return true;
        }
        return false;
    }

    render() {
        const {hexSize,targetHex,userPositions,btnRef,txs,showApproveAllModal,approvedStarGridState,driver,
            showPosition,approvedStarGrid,showModalApprove,showLoading,showConfirm,recRange,showCounterAdd,
            showToast,toastMessage,tx,counters,rangeLand,account,showCaptureModal,feeData,feeOk,feeCancel,
            lockedInfo,showSettlementModal,showPrepareModal,activeBottom,activeLeft,planetTab,
            showPowerDistribution,amountTitle1,amountTitle2,myPlanetArr,showMyPlanetModal,showApprovedList,approvedInfo,
        showDetailModal,lockedUserInfo,showSelectPlanetModal,defaultPlanet,lockedUserAddress,enDetails,showUserDeposit,
        userDepositArr,counterSelectData,showCounterSelectModal,withdrawUserDeposit} = this.state;
        // const hexagons = gridGenerator.rectangle(recRange[0],recRange[1], true,true );
        // console.log(hexagons,recRange);
        const hexagons = gridGenerator.hexagon(recRange[0]>recRange[1]?recRange[0]:recRange[1],true)
        const owner = account && account.addresses[chain];

        const calcPlanetRest = this.calcPlanetMap();
        const reachHexesGlobal:any = calcPlanetRest[0];
        const reachHexes:any = calcPlanetRest[1]
        const pieceColors:any = calcPlanetRest[2]
        const counterMap:any = calcPlanetRest[3]
        const blues:any = calcPlanetRest[4]
        const yellows:any = calcPlanetRest[5]

        let totalGas = new BigNumber(0) ;
        for(let tx of txs){
           totalGas = new BigNumber(tx.gas).plus(new BigNumber(totalGas))
        }
        const periodCountdown = lockedInfo ?(1642681800 + (new BigNumber(lockedInfo.currentPeriod).multipliedBy(24*60*60).toNumber()) )*1000:0
        return (
            <>
                <IonPage>
                    <IonHeader mode="ios">
                        <IonToolbar mode="ios" color="primary">
                            <IonIcon src={chevronBack} slot="start" size="large" onClick={()=>{url.back()}}/>
                            <IonTitle>
                                <IonLabel>STAR GRID [{lockedInfo && lockedInfo.currentPeriod}]</IonLabel>
                                <div>{periodCountdown>0 && <CountDown time={periodCountdown} className="period-countdown"/>}</div>
                            </IonTitle>
                            <IonLabel slot="end">
                                <IonIcon src={cashOutline} onClick={()=>{this.setShowSettlementModal(true)}} size="large"/>
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
                                <IonFabButton onClick={()=>this.setShowPlanetModal(true,1)} size="small" color="secondary">
                                    <IonIcon icon={pricetagsOutline} />
                                </IonFabButton>
                                <IonFabButton onClick={()=>this.setShowApproveList(true)} size="small" color="warning">
                                    <IonIcon icon={personAddOutline} />
                                </IonFabButton>
                                <IonFabButton onClick={()=>this.setShowUserDeposit(true)} size="small" color="tertiary">
                                    <IonIcon icon={listOutline} />
                                </IonFabButton>
                            </IonFabList>
                            <IonFabList side="end">
                                <IonFabButton onClick={()=>this.setShowCounterAdd(true)} size="small" color="secondary">
                                    <IonIcon icon={addCircleOutline} />
                                </IonFabButton>
                                <IonFabButton onClick={()=>{
                                    this.setShowLoading(true)
                                    this.logout().then(()=>{
                                        this.setShowLoading(false)
                                    }).catch(e=>{
                                        this.setShowLoading(false)
                                        const err = typeof e == "string"?e:e.message;
                                        this.setShowToast(true,err)
                                    })
                                }} size="small" color="danger">
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
                                <IonFabButton onClick={()=>{
                                    if(lockedInfo && lockedInfo.userInfo.counter.counterId !="0"){
                                        const hex = toAxial(lockedInfo.userInfo.userCoordinate);
                                        this.setPosition(hex.x,hex.z).then(()=>{
                                            this.init();
                                            // this.setTarget({hex:hex,counter:lockedInfo.userInfo.counter})
                                        }).catch(e=>{
                                            const err = typeof e =="string"?e:e.message;
                                            this.setShowToast(true,err);
                                        })
                                    }else{
                                        this.setShowToast(true,"Your counter is not on the map.")
                                    }
                                }} color="tertiary">
                                    <IonIcon icon={homeOutline} />
                                </IonFabButton>
                            </IonFabList>
                        </IonFab>
                        {
                            targetHex[0] &&
                            <div className="counter-info">
                                <HexInfoCard owner={owner} hasCounters={counters && counters.length>0} sourceHexInfo={targetHex[0]}
                                             onCapture={()=>{
                                                 if(counters && counters.length>0){
                                                     this.setShowCaptureModal(true)
                                                 }else {
                                                     this.setShowCounterAdd(true)
                                                 }
                                             }}
                                 lockedInfo={lockedInfo}
                                 attackHexInfo={targetHex.length>1 && targetHex[targetHex.length-1]}
                                 onMove={(setTag,createPlanet)=>{
                                    this.move(setTag,createPlanet).catch(e=>{
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
                                }}
                                />
                            </div>
                        }

                        <div className="content-grid" style={{width:`${100}vw`,height:`${100}vh`,overflow:"scroll"}}>
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
                                                const movable = containHex(reachHexesGlobal,absHex) && this.isFocusMyCounter() && !stop && targetHex && targetHex.length>0 && new BigNumber(targetHex[0].counter.force).toNumber()>0;
                                                const focus = targetHex.length>0&&absHex.equalHex(targetHex[0].hex);
                                                let piece:any = undefined;
                                                let landStyle:string = ""

                                                let marker:boolean|undefined;
                                                let isOwner:boolean|undefined;
                                                let approval:boolean|undefined;
                                                let land:Land|undefined;
                                                let focusOwner :boolean|undefined;

                                                if(counterMap.has(absHex.uKey())){
                                                    land = counterMap.get(absHex.uKey())
                                                    const i = Math.floor(utils.fromValue(land.capacity,18).toNumber())
                                                    if(land.enType == StarGridType.WATER){
                                                        landStyle = blueColors[i]
                                                    }else if(land.enType == StarGridType.EARTH){
                                                        landStyle = yellowColors[i]
                                                    }
                                                    if(land.counter && land.counter.counterId != "0"){
                                                        // const p = counterMap.get(absHex.uKey());
                                                        const bg = calcCounterRgb(Math.floor(utils.fromValue(land.counter.rate,16).toNumber()),land.counter.enType == StarGridType.EARTH);
                                                        piece = {
                                                            style:land.counter.enType == StarGridType.WATER?"white":"black",
                                                            backgroundColor: [ `rgb(${bg[0]})`,`rgb(${bg[1]})`]
                                                        }
                                                        if(new BigNumber(land.counter.level).toNumber()>3){
                                                            piece.style = land.counter.enType == StarGridType.WATER?"whiteSword":"blackSword";
                                                        }
                                                        focusOwner = lockedInfo && lockedInfo.userInfo.counter.counterId == land.counter.counterId;
                                                    }
                                                    if(land && land.marker == owner){
                                                        marker = true;
                                                    }
                                                    if(land && land.canCapture){
                                                        approval = true;
                                                    }
                                                    isOwner = owner && land && owner == land.owner
                                                }
                                                const inRg = this.inRange(absHex);

                                                return <Hexagon
                                                    className="field"
                                                    focus={focus}
                                                    flag={isOwner}
                                                    owner={focusOwner}
                                                    block={block&&!absHex.equalHex(targetHex[0].hex)}
                                                    attack={attack} key={i}
                                                    colorStyle={landStyle}
                                                    movable={movable}
                                                    counter={piece}
                                                    approval={approval}
                                                    marker={marker}
                                                    inRange={inRg}
                                                    isHomeless={this.isHomeless(absHex)}
                                                    onClick={(id, coordinates, e)=>{
                                                        if((targetHex.length> 0
                                                            &&(
                                                                block
                                                                || absHex.equalHex(targetHex[0].hex) && inRg
                                                                || attack  && inRg
                                                                || !targetHex[0].counter && inRg
                                                                || lockedInfo && lockedInfo.userInfo && targetHex[0] && targetHex[0].counter && targetHex[0].counter.counterId != lockedInfo.userInfo.counter.counterId  && inRg
                                                                || (targetHex.length == 1 && lockedInfo && lockedInfo.userInfo && targetHex[0] && targetHex[0].counter && targetHex[0].counter.counterId == lockedInfo.userInfo.counter.counterId ) && block && inRg
                                                            )
                                                            || targetHex.length==0 && inRg
                                                        )
                                                        ){
                                                            e.stopPropagation();
                                                            this.selectTarget(true,{hex:this.convertHex(coordinates),land:land,counter:land&&land.counter},e.nativeEvent.offsetX,e.nativeEvent.y).catch(e=>{
                                                                console.error(e)
                                                            });

                                                        }
                                                    }} id={i} coordinates={hex}
                                                >
                                                    <HexText className="hex-text">
                                                        {land && hexSize >=2 && new BigNumber(land.level).toNumber()>0?`V${land.level}`:""}
                                                    </HexText>
                                                </Hexagon>
                                            } )}
                                        {targetHex && targetHex.length>1 &&<PathCustom pathHex={targetHex} />}
                                    </HexGrid>
                                }

                            </div>
                            {/*</Draggable>*/}
                        </div>

                        <IonModal
                            mode="ios"
                            isOpen={showModalApprove}
                            cssClass='epoch-rank-modal'
                            swipeToClose={true}
                            onDidDismiss={() => this.setShowModalApprove(false)}>
                            <div className="eopch-md">
                                <IonList>
                                    <IonItemDivider sticky color="primary">
                                        <IonLabel>{i18n.t("approveTo")} STAR GRID</IonLabel>
                                    </IonItemDivider>
                                    {
                                        Object.keys(approvedStarGridState).map((v,i)=>{
                                            return <IonItem key={i}>
                                                <IonLabel color="primary">{v}<IonText color="secondary"> [BEP20]</IonText></IonLabel>
                                                <IonText color="success">{approvedStarGridState[v]?i18n.t("approved"):<IonButton size="small" color="primary" onClick={()=>{
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
                                        }}>{i18n.t("approve")}</IonButton>}</IonText>
                                    </IonItem>
                                </IonList>
                            </div>
                            <IonRow>
                                <IonCol size="4">
                                    <IonButton expand="block" fill="outline" onClick={()=>{
                                        this.setState({
                                            showModalApprove:false
                                        })
                                    }}>{i18n.t("cancel")}</IonButton>
                                </IonCol>
                                <IonCol size="8">
                                    <IonButton expand="block" onClick={()=>{
                                        this.approveAll().catch(e=>{
                                            const err = typeof e == "string"?e:e.message;
                                            this.setShowToast(true,err)
                                            console.log(e)
                                        });
                                    }}>{i18n.t("approveAll")}</IonButton>
                                </IonCol>
                            </IonRow>
                        </IonModal>

                        <IonModal
                            mode="ios"
                            isOpen={showPosition}
                            cssClass='coo-list-modal'
                            swipeToClose={true}
                            onDidDismiss={() => this.setShowPosition(false)}>
                            <div className="epoch-md">
                                <IonList>
                                    <IonListHeader mode="ios">{i18n.t("searchPlanet")}</IonListHeader>
                                    <IonItemDivider mode="md"/>
                                    <IonItemDivider sticky color="primary">
                                        <IonLabel>{i18n.t("recent")} {i18n.t("coordinate")}</IonLabel>
                                    </IonItemDivider>
                                    <IonItem>
                                        <IonLabel className="ion-text-wrap">
                                            {
                                                userPositions && userPositions.positions && userPositions.positions.map((v,i)=>{
                                                    const coo = toAxial(v.coordinate)
                                                    return <IonChip color="tertiary" key={i}  onClick={()=>{
                                                        this.setPosition(coo.x,coo.z).then(()=>{
                                                            this.setTarget({hex:coo})
                                                        });
                                                    }}>[{coo.x},{coo.z}]</IonChip>
                                                })
                                            }
                                        </IonLabel>
                                    </IonItem>

                                    <IonItemDivider sticky color="primary">
                                        <IonLabel>{i18n.t("input")} {i18n.t("coordinate")}</IonLabel>
                                    </IonItemDivider>
                                    <IonItem lines="none">
                                        <IonLabel>
                                            <IonRow>
                                                <IonCol size="5">
                                                    <input ref={this.position.x} className="attribution-input" type="number" placeholder="X" style={{width:"100px"}}/>
                                                </IonCol>
                                                <IonCol size="2">
                                                    ,
                                                </IonCol>
                                                <IonCol size="5">
                                                    <input ref={this.position.z} className="attribution-input" type="number" placeholder="Y" style={{width:"100px"}}/>
                                                </IonCol>
                                            </IonRow>
                                        </IonLabel>
                                    </IonItem>
                                </IonList>
                            </div>
                            <IonRow>
                                <IonCol size="4"><IonButton expand="block" fill="outline">{i18n.t("cancel")}</IonButton></IonCol>
                                <IonCol><IonButton mode="ios" expand="block" fill="outline" onClick={()=>{
                                    const x = this.position.x && this.position.x.current && this.position.x.current.value;
                                    const z = this.position.z && this.position.z.current && this.position.z.current.value;
                                    if(!x || !z){
                                        this.setShowToast(true,"Please input coordinate !")
                                        return
                                    }
                                    this.setPosition(parseInt(x),parseInt(z)).then(()=>{
                                        this.setTarget({hex:axialCoordinatesToCube(parseInt(x),parseInt(z))})
                                    });
                                }}>{i18n.t("ok")}</IonButton></IonCol>
                            </IonRow>
                        </IonModal>

                        <IonModal
                            mode="ios"
                            isOpen={showApproveAllModal}
                            cssClass='counter-list-modal'
                            swipeToClose={true}
                            onDidDismiss={() => this.setShowPosition(false)}>
                            <div className="epoch-md">
                                {
                                    txs && txs.length>0 &&
                                    <IonList>
                                        <IonListHeader mode="ios">
                                            {i18n.t("batchApprove")}
                                        </IonListHeader>
                                        <IonItemDivider mode="md"/>
                                        <IonItemDivider sticky color="primary">
                                            <IonLabel>{i18n.t("estimate")} Gas</IonLabel>
                                        </IonItemDivider>
                                        {
                                            txs.map((v,i)=>{
                                                return <IonItem key={i}>
                                                    <IonLabel className="ion-text-wrap">
                                                        <IonRow>
                                                            <IonCol size="9"><small>{i18n.t("approveTo")} <IonText color="secondary">[{v.to}]</IonText></small></IonCol>
                                                            <IonCol size="3">{new BigNumber(v.gas).toString(10)}</IonCol>
                                                        </IonRow>
                                                    </IonLabel>
                                                </IonItem>
                                            })
                                        }

                                        <IonItemDivider sticky color="primary">
                                            <IonLabel>{i18n.t("total")}</IonLabel>
                                        </IonItemDivider>
                                        <IonItem>
                                            <IonLabel>Gas</IonLabel>
                                            <IonLabel>
                                                {totalGas.toString(10)}
                                            </IonLabel>
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel>Gas {i18n.t("price")}</IonLabel>
                                            <IonLabel>{new BigNumber(txs[0].gasPrice).toString(10)}</IonLabel>
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel>Gas {i18n.t("fee")}</IonLabel>
                                            <IonLabel>{utils.fromValue(totalGas.multipliedBy(new BigNumber(txs[0].gasPrice)),18).toString(10)} BNB</IonLabel>
                                        </IonItem>
                                    </IonList>
                                }
                            </div>

                            <IonRow>
                                <IonCol size="4">
                                    <IonButton expand="block" fill="outline" onClick={()=>{
                                        this.setState({
                                            showApproveAllModal:false,
                                            showModalApprove:true
                                        })
                                    }}>{i18n.t("cancel")}</IonButton>
                                </IonCol>
                                <IonCol size="8">
                                    <IonButton expand="block" disabled={showLoading} onClick={()=>{
                                        this.setShowLoading(true)
                                        this.commitApproveTxs().then(()=>{
                                           this.setState({
                                               showApproveAllModal:false,
                                               showLoading:false
                                           })
                                        }).catch(e=>{
                                            this.setShowLoading(false)
                                            console.error(e)
                                            const err = typeof e == "string"?e:e.message;
                                            this.setShowToast(true,err)
                                        })
                                    }}>{i18n.t("commit")}</IonButton>
                                </IonCol>
                            </IonRow>
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

                        <CounterList title={i18n.t("login")} driverInfo={driver} lockedInfo={lockedInfo} defaultPlanet={defaultPlanet}  onSelectPlanet={()=>{
                            this.setShowSelectPlanet(true,"capture");
                        }} show={showCaptureModal} amountTitle1={amountTitle1}
                                     amountTitle2={amountTitle2} onCallback={(counter)=>{
                            this.selectCounter(counter).catch(e=>{
                                const err = typeof e == "string"?e:e.message;
                                this.setShowToast(true,err)
                            });
                        }}
                                     onOk={(counterId,base,attach)=>{
                                         if(!counterId||counterId == "0"){
                                             this.setShowToast(true,"Please select a counter!")
                                             return
                                         }
                                         if(!base || new BigNumber(base).toNumber() <= 0 ){
                                             this.setShowToast(true,`Please input amount!`)
                                             return
                                         }
                                         if(!attach || new BigNumber(attach).toNumber() <= 0 ){
                                             this.setShowToast(true,`Please input amount!`)
                                             return
                                         }
                            this.captureConfirm(counterId,base,attach).catch(e=>{
                                const err = typeof e == "string"?e:e.message;
                                this.setShowToast(true,err)
                                console.error(e)});
                           this.setShowCaptureModal(false)
                        }} onCancel={()=>{
                           this.setShowCaptureModal(false)
                        }} data={counters}/>

                        <CounterAdd show={showCounterAdd} onOk={(type,num,depositType)=>{
                            if(!type){
                                this.setShowToast(true,"Please select counter type !")
                                return ;
                            }
                            if(!depositType && depositType!=0){
                                this.setShowToast(true,"Please select deposit type !")
                                return ;
                            }
                            if(!num || num<=0){
                                this.setShowToast(true,"Please input counter number !")
                                return
                            }
                            this.setShowLoading(true);
                            this.createConfirm(type,num,depositType).then(()=>{
                                this.setShowCounterAdd(false)
                            }).catch(e=>{
                                const err = typeof e == "string"?e:e.message;
                                this.setShowCounterAdd(false)
                                this.setShowToast(true,err)
                            })
                        }} onCancel={()=>this.setShowCounterAdd(false)} />
                        <FeeModal show={!!feeData} lockedInfo={lockedInfo} onOk={()=>{ feeOk() }} onCancel={()=>{ feeCancel() }} data={feeData}/>

                        {lockedInfo && <Settlement title="Economy" enDetails={enDetails} show={showSettlementModal} isOwner={true} lockedInfo={lockedInfo} onPrepare={()=>{
                            this.setShowLoading(true)
                            this.setShowPrepareModal(true).catch(e=>{
                                const err = typeof e == "string"?e:e.message;
                                this.setShowToast(true,err)
                            });
                            this.setShowSettlementModal(false);
                        }} onCancel={()=>{
                           this.setShowSettlementModal(false)
                        }} onOk={()=>{
                            this.setShowLoading(true)
                            this.settlement().then(()=>{
                                this.setShowSettlementModal(false)
                            }).catch(e=>{
                                const err = typeof e == "string"?e:e.message;
                                this.setShowToast(true,err)
                                this.setShowSettlementModal(false)
                            })
                        }}/>}

                        {lockedUserInfo && <Settlement title={i18n.t("userDetail")} show={showDetailModal} lockedInfo={lockedUserInfo} isOwner={lockedUserAddress == owner} onCancel={()=>{
                            this.setShowDetailModal(false)
                        }}/>}

                        <Prepare lockedInfo={lockedInfo} defaultPlanet={defaultPlanet} driverInfo={driver} show={showPrepareModal}  onSelectPlanet={()=>{
                            this.setShowSelectPlanet(true,"prepare").catch(e=>{
                                const err = typeof e == "string"?e:e.message;
                                this.setShowToast(true,err)
                            });
                        }} onCancel={()=>{
                            this.setShowPrepareModal(false)
                        }} onOk={(terms, baseAmount,attachAmount)=>{

                            if(!(new BigNumber(terms).toNumber()>0 && new BigNumber(baseAmount).toNumber()>0 && new BigNumber(attachAmount).toNumber()>0)){
                                this.setShowToast(true,"Please input numbers of periods or amount !")
                                return
                            }
                            if(new BigNumber(terms).toNumber() > 7){
                                this.setShowToast(true,"The maximum periods is 7 !")
                                return
                            }
                            this.setShowLoading(true)

                            this.prepareConfirm(terms,baseAmount,attachAmount).then(()=>{
                                this.setShowLoading(false)
                                this.setShowPrepareModal(false);
                            }).catch(e=>{
                                this.setShowLoading(false)
                                this.setShowPrepareModal(false);
                                const err = typeof e == "string"?e:e.message;
                                this.setShowToast(true,err)
                            })
                        }}/>

                        {lockedInfo && lockedInfo.userInfo.counter && <PowerDistribution show={showPowerDistribution} onOk={(opcode)=>{
                            this.setShowLoading(true)
                            this.updateCounter(opcode).then(()=>{
                                this.setShowLoading(false)
                                this.setShowPowerDistribution(false)
                            }).catch(e=>{
                                this.setShowPowerDistribution(false)
                                const err = typeof e == "string"?e:e.message;
                                this.setShowToast(true,err)
                            })
                        }} counter={lockedInfo.userInfo.counter} onCancel={()=>{
                            this.setShowPowerDistribution(false)
                        }}/>}

                        <PlanetList title={i18n.t("myPlanet")} lockedInfo={lockedInfo} tab={planetTab} show={showMyPlanetModal} onTabChange={tab=>{
                            // queryType[0-marker,1-owner,2-maker&owner]
                            const tp = tab == "owner"?1:0;
                            this.setShowPlanetModal(true,tp);
                        }} onCancel={()=>{
                            this.setShowPlanetModal(false);
                        }} onOk={(land)=>{
                            this.setShowPlanetModal(false);
                            const ax = toAxial(land.coordinate);
                            this.setPosition(ax.x,ax.z).then(()=>{
                                this.selectTarget(true,{hex:ax,counter:land.counter,land:land}).catch(e=>{
                                    console.error(e)
                                });
                            });
                        }} ownerData={myPlanetArr}/>

                        <ApprovedList title={i18n.t("trustedUser")} show={showApprovedList} onCancel={()=>{
                            this.setShowApproveList(false);
                        }} onCancelApprove={(address)=>{
                            this.setShowApproveList(false);
                            this.setShowLoading(true);
                            this.setApproveToUser(address,false).then(()=>{
                                this.setShowLoading(false)
                            }).catch((e)=>{
                                const err = typeof e == "string"?e:e.message;
                                this.setShowToast(true,err)
                                this.setShowLoading(false)
                            })
                        }}  onApprove={(address)=>{
                            if(!address){
                                this.setShowToast(true,"Please input BSC address !")
                                return
                            }
                            this.setShowApproveList(false);
                            this.setShowLoading(true);
                            this.setApproveToUser(address,true).then(()=>{
                                this.setShowLoading(false)
                            }).catch((e)=>{
                                const err = typeof e == "string"?e:e.message;
                                this.setShowToast(true,err)
                                this.setShowLoading(false)
                            })
                        }} data={approvedInfo}/>

                        <PlanetList title={i18n.t("selectPlanet")} lockedInfo={lockedInfo} checkedCoo={defaultPlanet && defaultPlanet.coordinate} show={showSelectPlanetModal} onCancel={()=>{
                            this.setShowSelectPlanet(false,"").catch(e=>{
                                const err = typeof e == "string"?e:e.message;
                                this.setShowToast(true,err)
                            });;
                        }} onOk={(land)=>{
                            this.setShowSelectPlanet(false,"").catch(e=>{
                                const err = typeof e == "string"?e:e.message;
                                this.setShowToast(true,err)
                            });;
                            this.setState({
                                defaultPlanet:land
                            })
                        }} ownerData={myPlanetArr}/>

                        <UserDepositModal title={i18n.t("depositList")} show={showUserDeposit} data={userDepositArr} onCancel={()=>{
                            this.setShowUserDeposit(false).catch(e=>{
                                const err = typeof e == "string"?e:e.message;
                                this.setShowToast(true,err)
                            });
                        }} onWithdraw={(v)=>{
                            if(v.canWithDraw){
                                this.confirmWithdrawUserDeposit("0",v).catch(e=>{
                                    const err = typeof e == "string"?e:e.message;
                                    this.setShowToast(true,err)
                                });
                            }else{
                                this.setShowCounterSelectModal(true,v).catch(e=>{
                                    const err = typeof e == "string"?e:e.message;
                                    this.setShowToast(true,err)
                                });
                            }
                        }}/>

                        <CounterSelectModal title={withdrawUserDeposit && `${i18n.t("selectAn")} EMIT-${StarGridType[withdrawUserDeposit.enType]}`} show={showCounterSelectModal} onCancel={()=>{
                            this.setShowCounterSelectModal(false).catch(e=>{
                                const err = typeof e == "string"?e:e.message;
                                this.setShowToast(true,err)
                            });
                        }} onOk={(counterId)=>{
                            if(!counterId){
                                this.setShowToast(true,"Please select a counter!")
                               return;
                            }
                            this.confirmWithdrawUserDeposit(counterId).catch(e=>{
                                const err = typeof e == "string"?e:e.message;
                                this.setShowToast(true,err);
                            })
                        }} data={counterSelectData}/>
                    </IonContent>
                </IonPage>
            </>

        );
    }
}

export default StarGrid