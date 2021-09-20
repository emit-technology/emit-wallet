import * as React from 'react';
import {
    IonButtons,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonLabel,
    IonModal,
    IonPage,
    IonRow,
    IonTitle,
    IonChip,
    IonSegment,
    IonSegmentButton,
    IonInput,
    IonBadge,
    IonFab,
    IonFabButton,
    IonToolbar,
    IonButton,
    IonRadio,
    IonCheckbox,
    IonRadioGroup,
    IonItem,
    IonText,
    IonList,
    IonToast,
    IonLoading,
    IonInfiniteScrollContent, IonInfiniteScroll, IonRefresherContent, IonRefresher
} from "@ionic/react";
import url from "../../utils/url";
import "./NFTMarketPlace.scss";
import {
    addCircleOutline, barChartOutline,
    chevronBack, chevronDownCircleOutline, close,
    funnelOutline, pricetag, searchOutline,
} from "ionicons/icons";
import epochMarketRpc, {MarketItem, MarketItemQuery} from "../../rpc/epoch/market";
import CardTransform from "../../components/CardTransform";
import * as utils from "../../utils"
import {AccountModel, ChainType, NftInfo, Transaction} from "../../types";
import rpc from "../../rpc";
import epochMarketService from "../../contract/epoch/sero/market";
import walletWorker from "../../worker/walletWorker";
import BigNumber from "bignumber.js";
import ConfirmTransaction from "../../components/ConfirmTransaction";
import i18n from "../../locales/i18n"
import selfStorage from "../../utils/storage";
import {nFormatter} from "../../utils";
import {RefresherEventDetail} from "@ionic/core";
import {Plugins} from "@capacitor/core";
import epochRemainsService from "../../contract/epoch/sero/remains";
import EpochAttribute from "../../components/EpochAttribute";
interface State{
    showInfoModal:boolean
    marketItems:Array<MarketItem>
    selectItem?:MarketItem
    nfts:Array<NftInfo>
    showSellModal:boolean
    selectTicket:string
    showProgress:boolean
    showLoading:boolean
    showToast:boolean
    toastMessage:string
    showConfirm:boolean
    tx:any
    segment:string
    showOnSaleOny:boolean
    account?:AccountModel
    showHistoryModal:boolean
    historyRecords?:Array<MarketItem>
    sellPrice:any
    pageSize:number
    pageNo:number
    wrappedInfo?:NftInfo

}
const defaultPageSize = 10;
class NFTMarketPlace extends React.Component<any, State> {

    state:State={
        showInfoModal:false,
        marketItems:[],
        nfts:[],
        showSellModal:false,
        showProgress:false,
        showLoading:false,
        showToast:false,
        toastMessage:"",
        tx:{},
        showConfirm:false,
        segment:"market",
        showOnSaleOny:false,
        showHistoryModal:false,
        sellPrice:0,
        selectTicket:"",
        pageSize:4,
        pageNo:1
    }

    componentDidMount() {
        Plugins.StatusBar.setBackgroundColor({
            color: "#152955"
        }).catch(e => {
        })
        this.setShowLoading(true)
        this.init().then(()=>{
            this.setShowLoading(false)
        }).catch(e=>{
            this.setShowLoading(false)
            console.log(e)
        })
    }

    marketItems = async (pageCount:number,pageSize:number)=>{
        let query:MarketItemQuery = {type:1}
        const ticketParam = this.props.match.params.ticket;
        if(ticketParam){
            query.ticket = ticketParam
        }else{
            const queryLocal = selfStorage.getItem("marketSearch");
            if(queryLocal){
                query = queryLocal;
            }
        }
        const marketItems:Array<MarketItem> = await epochMarketRpc.items(query,pageCount,pageSize);
        return marketItems
    }


    init = async ()=>{
        const ticket = await rpc.getTicket(ChainType.SERO, "")
        const remains:Array<NftInfo> = ticket["WRAPPED_EMIT_AX"]
        const account = await walletWorker.accountInfo();
        const marketItems = await this.marketItems(0,defaultPageSize);
        this.setState({
            marketItems:marketItems,
            nfts:remains?remains.reverse():[],
            selectTicket:remains&&remains.length>0?remains[0].tokenId:"",
            account:account,
            pageNo:1,
            pageSize:defaultPageSize
        })
    }

    queryHistory = async (ticket:string)=>{
        const records = await epochMarketRpc.exchangeRecords(ticket)
        this.setState({
            historyRecords:records,
            showHistoryModal:true,
            // showInfoModal:false
        })
    }

    setShowInfoModal = (f:boolean)=>{
        this.setState({
            showInfoModal:f
        })
    }

    setShowSellModal = (f:boolean)=>{
        this.setState({
            showSellModal:f
        })
    }

    setSelectItem = async (item:MarketItem)=>{
        const wrappedDevice = await epochRemainsService.wrappedDevice(item.ticket,"")
        const wrappedInfo = utils.convertMarketItemToNFTInfo(item)
        wrappedInfo.meta.attributes = wrappedDevice;
        wrappedInfo.meta.name = wrappedDevice.name?wrappedDevice.name:"WRAPPED EMIT AXE"
        this.setState({
            selectItem:item,
            showInfoModal:true,
            wrappedInfo:wrappedInfo
        })
    }

    sell = async ()=>{
        const {selectTicket,nfts,sellPrice} = this.state;
        if(!selectTicket||!sellPrice){
            this.setShowToast(true,"Please select axe and input sell price.")
            return
        }
        if(!utils.isNumber(sellPrice)){
            this.setShowToast(true,"The sell price is invalid !")
            return
        }
        let selectRemain:NftInfo|undefined;
        for(let n of nfts){
            if(n.tokenId == selectTicket){
                selectRemain = n
            }
        }

        const account = await walletWorker.accountInfo();
        const data = await epochMarketService.sell("LIGHT",utils.toValue(sellPrice,18))
        const Currency="LIGHT"
        const tx: Transaction | any = {
            from: account.addresses && account.addresses[ChainType.SERO],
            to: epochMarketService.address,
            cy: Currency,
            gasPrice: "0x" + new BigNumber(1).multipliedBy(1e9).toString(16),
            chain: ChainType.SERO,
            amount: "0x0",
            feeCy: Currency,
            value: "0x0",
            data: data,
        }
        if(selectRemain){
            tx.catg = selectRemain.category
            tx.tkt = selectRemain.tokenId
            tx.tickets = [{
                Category: tx.catg ,
                Value: tx.tkt
            }]
        }
        tx.gas = await epochMarketService.estimateGas(tx)
        if (tx.gas && tx.gasPrice) {
            tx.feeValue = await epochMarketService.tokenRate(tx.gasPrice, tx.gas);
        }
        this.setState({
            tx: tx,
            showConfirm: true
        })
        this.setShowSellModal(false)
    }

    setShowConfirm = (f:boolean)=>{
        this.setState({
            showConfirm:f
        })
    }

    setShowLoading = (f: boolean) => {
        this.setState({
            showLoading: f
        })
    }

    setShowSuccess = async (f:boolean) =>{
        const {pageSize,pageNo} = this.state;
        const account = await walletWorker.accountInfo();
        const rest = await epochMarketRpc.sellItem(account.addresses[ChainType.SERO],f,0,pageSize);
        this.setState({
            showOnSaleOny:f,
            marketItems:rest,
            pageNo:1
        })
    }

    confirm = async (hash: string) => {
        let intervalId: any = 0;
        this.setState({
            showLoading:true
        })
        intervalId = setInterval(() => {
            rpc.getTxInfo(ChainType.SERO, hash).then(rest => {
                if (rest) {
                    clearInterval(intervalId)
                    this.setState({
                        showLoading:false
                    })
                    url.transactionInfo(ChainType.SERO, hash, "LIGHT",window.location.hash);
                }
            }).catch((e: any) => {
                this.setShowLoading(false);
                console.error(e);
            })
        }, 1000)
    }

    setShowToast = (f:boolean,msg:string)=>{
        this.setState({
            showToast:f,
            toastMessage:msg
        })
    }

    setSegment = async (v:any)=>{
        const {showOnSaleOny} = this.state;
        const account = await walletWorker.accountInfo();
        const mainPKr = account.addresses[ChainType.SERO];
        let items:Array<MarketItem> = [];
        if(v == "sellRecords"){
            items = await epochMarketRpc.sellItem(mainPKr,showOnSaleOny,0,defaultPageSize);
        }else if(v == "buyRecords"){
            items = await epochMarketRpc.buyItem(mainPKr,0,defaultPageSize);
        }else if (v == "market"){
            items = await this.marketItems(0,defaultPageSize);
        }
        this.setState({
            marketItems:items,
            segment:v,
            pageSize:defaultPageSize,
            pageNo:1
        })
    }
    //
    // getWrappedDevice = async (tkt:string):Promise<WrappedDevice>=>{
    //     const account = await walletWorker.accountInfo();
    //     const device:WrappedDevice = await epochRemainsService.wrappedDevice(tkt,account.addresses[ChainType.SERO]);
    //     return device
    // }

    buy = async ()=>{
        const {selectItem} = this.state;
        if(!selectItem){
            return
        }
        const data = await epochMarketService.buy(selectItem.itemNo);
        const account = await walletWorker.accountInfo();
        const Currency="LIGHT"
        const tx: Transaction | any = {
            from: account.addresses && account.addresses[ChainType.SERO],
            to: epochMarketService.address,
            cy: Currency,
            gasPrice: "0x" + new BigNumber(1).multipliedBy(1e9).toString(16),
            chain: ChainType.SERO,
            amount: "0x0",
            feeCy: Currency,
            value: utils.toHex(selectItem.price),
            data: data,
        }
        tx.gas = await epochMarketService.estimateGas(tx)
        if (tx.gas && tx.gasPrice) {
            tx.feeValue = await epochMarketService.tokenRate(tx.gasPrice, tx.gas);
        }
        this.setState({
            tx: tx,
            showConfirm: true
        })
        this.setShowInfoModal(false)
    }

    withdraw = async ()=>{
        const {selectItem} = this.state;
        if(!selectItem){
            return
        }
        const data = await epochMarketService.withdraw(selectItem.itemNo);
        const account = await walletWorker.accountInfo();
        const Currency="LIGHT"
        const tx: Transaction | any = {
            from: account.addresses && account.addresses[ChainType.SERO],
            to: epochMarketService.address,
            cy: Currency,
            gasPrice: "0x" + new BigNumber(1).multipliedBy(1e9).toString(16),
            chain: ChainType.SERO,
            amount: "0x0",
            feeCy: Currency,
            value: "0x0",
            data: data,
        }
        tx.gas = await epochMarketService.estimateGas(tx)
        if (tx.gas && tx.gasPrice) {
            tx.feeValue = await epochMarketService.tokenRate(tx.gasPrice, tx.gas);
        }
        console.log(tx)
        this.setState({
            tx: tx,
            showConfirm: true
        })
        this.setShowInfoModal(false)
    }

    setShowHistoryModal = (f:boolean)=>{
        this.setState({
            showHistoryModal:f
        })
    }

    convertQuery = (key:string,value:any)=>{
        const queryLocal:MarketItemQuery = selfStorage.getItem("marketSearch")
        if(key == "showId"){
            const showId= value;
            let convertStyle = "";
            if(showId.min && showId.min == "0" && showId.max && showId.max == "2"){
                convertStyle = "LEGENDARY"
            }else if(showId.min && showId.min == "3" && showId.max && showId.max == "18"){
                convertStyle = "RARE"
            }else if(showId.min && showId.min == "19" && showId.max && showId.max == "48"){
                convertStyle = "MAGIC"
            }else if(showId.min && showId.min == "49" && showId.max && showId.max == "255"){
                convertStyle = "COMMON"
            }
            return <IonChip color="warning" style={{border:"1px solid "}} onClick={()=>{
                delete queryLocal.showId;
                this.setStorage(queryLocal);
            }}>{convertStyle}<IonIcon icon={close}/></IonChip>
        }else if(key == "gene"){
            return <IonChip color="warning" style={{border:"1px solid "}} onClick={()=>{
                delete queryLocal.gene;
                this.setStorage(queryLocal);
            }}>Blank<IonIcon icon={close}/></IonChip>
        }else if(key == "darkStar"){
            let style = "";
            if(value == 0 ){
                style = "LIGHT"
            }else {
                style = "DARK"
            }
            return <IonChip color="warning" style={{border:"1px solid "}} onClick={()=>{
                delete queryLocal.darkStar;
                this.setStorage(queryLocal);
            }}>{style}<IonIcon icon={close}/></IonChip>
        }else if(key == "price"){
            const price = queryLocal.price;
            if(price){
                return <IonChip color="warning" style={{border:"1px solid "}} onClick={()=>{
                    delete queryLocal.price;
                    this.setStorage(queryLocal);
                }}>Price: {price.min ? nFormatter(utils.fromValue(price.min,18).toFixed(8,1),2):0}
                    {price.max && `-${nFormatter(utils.fromValue(price.max,18).toFixed(8,1),2)}`}<IonIcon icon={close}/></IonChip>
            }
        }else if(key == "capacity"){
            const capacity = queryLocal.capacity;
            if(capacity){
                return <IonChip color="warning" style={{border:"1px solid "}} onClick={()=>{
                    delete queryLocal.capacity;
                    this.setStorage(queryLocal);
                }}>Healthy: {capacity.min ? nFormatter(utils.fromValue(capacity.min,18).toFixed(8,1),2):0}
                    {capacity.max && `-${nFormatter(utils.fromValue(capacity.max,18).toFixed(8,1),2)}`}<IonIcon icon={close}/></IonChip>
            }
        }else if(key == "rate"){
            const rate = queryLocal.rate;
            if(rate){
                return <IonChip color="warning" style={{border:"1px solid "}} onClick={()=>{
                    delete queryLocal.rate;
                    this.setStorage(queryLocal);
                }}>Healthy: {rate.min ? nFormatter(utils.fromValue(rate.min,18).toFixed(8,1),2):0}
                    {rate.max && `-${nFormatter(utils.fromValue(rate.max,18).toFixed(8,1),2)}`}<IonIcon icon={close}/></IonChip>
            }
        }else if(key == "ticket"){
            const ticket = queryLocal.ticket;
            if(ticket){
                return <IonChip color="warning" style={{border:"1px solid "}} onClick={()=>{
                    delete queryLocal.ticket;
                    this.setStorage(queryLocal);
                }}>{utils.ellipsisStr(ticket,5)}<IonIcon icon={close}/></IonChip>
            }
        }
    }

    setStorage = (queryLocal:any)=>{
        selfStorage.setItem("marketSearch",queryLocal)
        this.setShowLoading(true);
        this.init().then(()=>{
            this.setShowLoading(false)
        }).catch(e=>{console.error(e);
        this.setShowLoading(false);})
    }

    loadMore = async (event:any) =>{
        const {pageSize,pageNo,marketItems,segment,showOnSaleOny} = this.state;
        const account = await walletWorker.accountInfo();
        const mainPKr = account.addresses[ChainType.SERO];
        let items:Array<MarketItem> = [];
        if(segment == "sellRecords"){
            items = await epochMarketRpc.sellItem(mainPKr,showOnSaleOny,pageNo*pageSize,pageSize);
        }else if(segment == "buyRecords"){
            items = await epochMarketRpc.buyItem(mainPKr,pageNo*pageSize,pageSize);
        }else if (segment == "market"){
            items = await this.marketItems(pageNo*pageSize,pageSize);
        }
        if(!items || items.length == 0){
            // event.target.disabled = true;
        }else{
            this.setState({
                pageNo:pageNo+1,
                marketItems:marketItems.concat(items),
            })
        }
        event.target.complete();
    }

    doRefresh = (event:CustomEvent<RefresherEventDetail>) =>{
        const {segment,account,showOnSaleOny,pageSize} = this.state;
        this.setState({
            pageNo:1,
            marketItems:[]
        })
        const mainPKr= account && account.addresses[ChainType.SERO];
        let rest:any;
        if(segment == "sellRecords"){
            rest = epochMarketRpc.sellItem(mainPKr,showOnSaleOny,0,pageSize);
        }else if(segment == "buyRecords"){
            rest = epochMarketRpc.buyItem(mainPKr,0,pageSize);
        }else if (segment == "market"){
            rest = this.marketItems(0,pageSize);
        }
        rest.then((items:Array<MarketItem>)=>{
            this.setState({
                marketItems:items,
            })
            setTimeout(()=>{
                event.detail.complete();
            },500)
        }).catch((e:any)=>{
            console.log(e)
        })
    }

    openSellModal = async ()=>{
        rpc.initNFT();
        const ticket = await rpc.getTicket(ChainType.SERO, "")
        const remains:Array<NftInfo> = ticket["WRAPPED_EMIT_AX"]
        this.setState({
            nfts:remains?remains.reverse():[],
            showSellModal:true,
            selectTicket:remains&&remains.length>0?remains[0].tokenId:"",
            sellPrice:""
        })
    }
    render() {
        const {showInfoModal,marketItems,selectItem,nfts,showSellModal,showConfirm,tx,segment,showOnSaleOny,wrappedInfo,account,
            showHistoryModal,historyRecords,selectTicket,sellPrice,showToast,showLoading,toastMessage} = this.state;
        const queryLocal = selfStorage.getItem("marketSearch");
        return (
            <IonPage>

                <IonHeader mode="ios">
                    <IonToolbar color="primary" mode="ios" className="heard-bg">
                        <IonIcon src={chevronBack} size="large"  style={{color: "#edcc67"}} slot="start" onClick={() => {
                            Plugins.StatusBar.setBackgroundColor({
                                color: "#194381"
                            }).catch(e => {
                            })
                            url.back()
                        }}/>
                        <IonTitle className="text-center text-bold" style={{
                            color: "#edcc67",
                        }}>{i18n.t("relics")} {i18n.t("market")}</IonTitle>
                        <IonButtons slot="end">
                            <IonIcon size="large"  style={{
                                color: "#edcc67",
                            }} icon={searchOutline} onClick={()=>{
                                url.tradeMarketSearch();
                            }}/>
                            {/*<IonMenuButton mode="ios" menu="nft-menu"><IonIcon icon={funnelOutline}/></IonMenuButton>*/}
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent fullscreen>
                    <IonRefresher slot="fixed" onIonRefresh={this.doRefresh} pullFactor={0.5} pullMin={100} pullMax={160}>
                        <IonRefresherContent
                            pullingIcon={chevronDownCircleOutline}
                            pullingText="Pull to refresh"
                            refreshingSpinner="circles"
                            refreshingText="Refreshing...">
                        </IonRefresherContent>
                    </IonRefresher>

                    <IonFab vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton  color="light" onClick={()=>{
                            url.tradeMarketStatics()
                        }}>
                            <IonIcon icon={barChartOutline}/>
                        </IonFabButton>
                        <IonFabButton  color="danger" onClick={()=>{
                            this.setShowLoading(true)
                            this.openSellModal().then(()=>{
                                this.setShowLoading(false)
                            }).catch(e=>{
                                this.setShowLoading(false)
                            })
                        }}>
                            <IonIcon icon={addCircleOutline}/>
                        </IonFabButton>
                    </IonFab>

                    <div className="content-ion">
                        <IonSegment mode="md" value={segment} color="light" onIonChange={e => {
                            this.setSegment( e.detail.value)
                        }}>
                            <IonSegmentButton value="market">
                                <IonLabel color={segment=="market"?"warning":"white"}>{i18n.t("market")}</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="sellRecords">
                                <IonLabel color={segment=="sellRecords"?"warning":"white"}>{i18n.t("sell")} {i18n.t("records")}</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="buyRecords">
                                <IonLabel color={segment=="buyRecords"?"warning":"white"}>{i18n.t("buy")} {i18n.t("records")}</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                        {
                            segment == "market" && queryLocal && Object.keys(queryLocal).length>1 && <div style={{padding:"12px 0 6px",borderBottom:"1px solid #ddd"}}>
                                {Object.keys(queryLocal).map(k=>{
                                    return this.convertQuery(k,queryLocal[k])
                                })}
                            </div>
                        }
                        <IonGrid>
                            { segment=="sellRecords" && <IonRow>
                                <IonCol>
                                    <IonItem className="light-background" lines="full">
                                        <IonLabel>Only show on sale</IonLabel>
                                        <IonCheckbox mode="ios" slot="start" color="warning" checked={showOnSaleOny} onIonChange={(v)=>{
                                            this.setShowSuccess(v.detail.checked);}
                                        }/>
                                    </IonItem>
                                </IonCol>
                            </IonRow>}

                            <IonRow>
                                {
                                    marketItems && marketItems.map(item => {
                                        const info =  utils.convertMarketItemToNFTInfo(item);
                                        return <IonCol sizeXl="3" sizeMd="6" sizeXs="12" sizeSm="6" sizeLg="4">
                                            <div className="nft-mkt-item" onClick={(e)=>{
                                                this.setSelectItem(item);
                                                e.stopPropagation();
                                            }}>
                                                <IonRow>
                                                    <IonCol size="5">
                                                        <div>
                                                            <CardTransform info={info} hideButton={true} showSimple={true}/>
                                                            <div className="nft-card-name">
                                                                {info.meta&&info.meta.alis?info.meta.alis:utils.ellipsisStr(info.tokenId,5)}
                                                            </div>
                                                            <div className="nft-mkt-state">
                                                                {
                                                                    item.valid ?"":<IonBadge color="medium">SOLD</IonBadge>
                                                                }
                                                            </div>
                                                            <div style={{top:"4px" ,position:"absolute"}}>
                                                                <IonBadge color="tertiary" mode="ios">#{item.itemNo}</IonBadge>
                                                                {
                                                                    account&&item.owner==account.addresses[ChainType.SERO] &&
                                                                <IonBadge color="danger" mode="ios">{i18n.t("my")}</IonBadge>
                                                                }
                                                            </div>
                                                        </div>
                                                    </IonCol>
                                                    <IonCol size="7">
                                                        <div>
                                                            <EpochAttribute hiddenButton={false} showDevice={true} showDriver={false} device={info.meta.attributes} color={"light"}/>
                                                        </div>
                                                        <div style={{color:"#fff"}}>
                                                            <small>{i18n.t("seal")} {i18n.t("period")}: <IonText color="secondary">{item.attach.start}</IonText><br/></small>
                                                            <small>{i18n.t("seal")} {i18n.t("fee")}: <IonText color="secondary">{utils.nFormatter(utils.fromValue(item.attach.fee,18),4)} LIGHT/period</IonText></small><br/>
                                                            <small>{i18n.t("total")} {i18n.t("fee")}: <IonText color="secondary">{utils.nFormatter(utils.fromValue(item.totalFee,18),4)} LIGHT</IonText></small>
                                                        </div>
                                                        <div className="nft-mkt-info">
                                                            <div style={{float:"left"}}>
                                                                <IonBadge color="warning" mode="ios">
                                                                    <IonIcon icon={pricetag}/>&nbsp;
                                                                    {nFormatter(utils.fromValue(item.price,18).toFixed(8,1),2)} L
                                                                </IonBadge>
                                                            </div>
                                                            <div style={{float:"right"}}>
                                                                {
                                                                    info.meta.attributes && info.meta.attributes.mode && <IonBadge mode="ios" color={utils.reColor(info.meta.attributes.mode.category)}>
                                                                        <IonIcon src={utils.reIcon(info.meta.attributes.mode.category)}/>&nbsp;
                                                                        {info.meta.attributes.mode && info.meta.attributes.mode.category=="normal"?"BLANK":info.meta.attributes.mode.category.toUpperCase()}
                                                                    </IonBadge>

                                                                }

                                                            </div>
                                                        </div>
                                                    </IonCol>
                                                </IonRow>

                                            </div>
                                        </IonCol>
                                    })
                                }
                            </IonRow>
                        </IonGrid>
                        <IonInfiniteScroll onIonInfinite={(e)=>this.loadMore(e)}>
                            <IonInfiniteScrollContent
                                loadingSpinner="bubbles"
                                loadingText="Loading more data..."
                            >
                            </IonInfiniteScrollContent>
                        </IonInfiniteScroll>
                    </div>

                </IonContent>
                <IonModal
                    mode="ios"
                    isOpen={showInfoModal}
                    cssClass='nft-mkt-modal-info'
                    // swipeToClose={true}
                    onDidDismiss={() => this.setShowInfoModal(false)}
                >

                    <div className="box-center">
                        <div style={{textAlign:"center",overflowY:"scroll",height:"75vh",maxWidth:"280px"}} >
                            { selectItem && wrappedInfo &&
                            <>
                                <CardTransform info={wrappedInfo} hideButton={true}/>
                                <div className="nft-mkt-info-2">
                                    <div style={{float:"left"}}>
                                        <IonBadge color="tertiary">#{selectItem.itemNo}</IonBadge>
                                    </div>
                                    <div style={{float:"right"}}>
                                        <IonBadge color="warning">
                                            {utils.fromValue(selectItem.price,18).toString(10)} LIGHT
                                        </IonBadge>
                                    </div>
                                </div>
                            </>
                            }
                        </div>
                    </div>
                    <div className="btn-bottom">
                    {
                        selectItem && selectItem.valid ?
                            <IonRow>
                                <IonCol size="12">
                                    <div className="nft-mkt-remark">
                                        You may need <IonText color="secondary">{selectItem && utils.fromValue(selectItem.totalFee,18).toFixed(4)} LIGHT</IonText> for unseal to DEVICE.
                                    </div>
                                </IonCol>
                                <IonCol size="4">
                                    <IonButton onClick={()=>{this.queryHistory(selectItem.ticket).catch(e=>{
                                        console.error(e)
                                    })}} expand="block" fill="outline">{i18n.t("history")}</IonButton>
                                </IonCol>
                                {
                                    selectItem && account && selectItem.owner == account.addresses[ChainType.SERO] ?
                                        <>
                                            <IonCol size="8">
                                                <IonButton onClick={()=>{
                                                    this.setShowLoading(true)
                                                    this.withdraw().then(()=>{
                                                        this.setShowLoading(false)
                                                    }).catch((e)=>{
                                                        const err = typeof e == "string"?e:e.message;
                                                        this.setShowToast(true,err)
                                                        this.setShowLoading(false)
                                                        console.error(e)
                                                    })
                                                }} expand="block" color="primary" >{i18n.t("offShelf")}</IonButton>
                                            </IonCol>
                                        </>:
                                        <>
                                            <IonCol size="8">
                                                <IonButton onClick={()=>{
                                                    this.setShowLoading(true)
                                                    this.buy().then(()=>{
                                                        this.setShowLoading(false)
                                                    }).catch((e)=>{
                                                        const err = typeof e == "string"?e:e.message;
                                                        this.setShowToast(true,err)
                                                        this.setShowLoading(false)
                                                        this.init()
                                                    })
                                                }} expand="block" >{i18n.t("buy")}</IonButton>
                                            </IonCol>
                                        </>
                                }
                            </IonRow>
                        : selectItem && <IonButton onClick={()=>{this.queryHistory(selectItem.ticket).catch(e=>{
                                console.error(e)
                            })}} expand="block" fill="outline">{i18n.t("history")}</IonButton>
                    }
                        </div>
                </IonModal>

                <IonModal
                    mode="ios"
                    isOpen={showSellModal}
                    cssClass='nft-mkt-modal-info'
                    // swipeToClose={true}
                    onDidDismiss={() => this.setShowSellModal(false)}
                >

                    <div style={{textAlign:"center",overflowY:"scroll"}}>
                        <div>
                            <IonRadioGroup value={selectTicket} onIonChange={e => this.setState({
                                selectTicket:e.detail.value
                            })}>
                            <IonGrid>
                                <IonRow>
                                        { nfts && nfts.length>0 &&
                                        nfts.map((nftInfo)=>{
                                                return <IonCol sizeSm="6" sizeXs="12" sizeMd="4" sizeXl="6">
                                                    <div style={{padding:"0 12px"}}>
                                                        <CardTransform info={nftInfo} hideButton={true}/>
                                                        <div className="nft-mkt-info-2">
                                                            <div>
                                                                <IonRadio mode="md" value={nftInfo.tokenId}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </IonCol>
                                            })
                                        }
                                </IonRow>
                            </IonGrid>
                            </IonRadioGroup>
                        </div>

                    </div>
                    <div style={{    boxShadow:" 0 0 5px 1px #ddd"}}>
                        <IonItem>
                            <IonLabel position="stacked">{i18n.t("sell")} {i18n.t("price")}</IonLabel>
                            <IonInput placeholder="0.0 LIGHT" onIonChange={(e)=>{this.setState({sellPrice:e.detail.value})}}/>
                        </IonItem>
                        <IonButton disabled={!selectTicket || !sellPrice}  expand="block" onClick={()=>{
                            this.setShowLoading(true)
                            this.sell().then(()=>{
                                this.setShowLoading(false)
                            }).catch((e)=>{
                                const err = typeof e == "string"?e:e.message;
                                this.setShowToast(true,err)
                                this.setShowLoading(false)
                            })
                        }}>{i18n.t("sell")}</IonButton>
                    </div>
                </IonModal>

                <IonModal
                    mode="ios"
                    isOpen={showHistoryModal}
                    cssClass='nft-mkt-modal'
                    swipeToClose={true}
                    onDidDismiss={() => this.setShowHistoryModal(false)}
                >
                    <div className="pool-modal">
                        <div className="pool-info-content">
                            <div className="pool-head">
                                <IonRow>
                                    {/*<IonCol size="2"><small>{i18n.t("ItemNo")}</small></IonCol>*/}
                                    <IonCol size="4"><small>{i18n.t("price")}</small></IonCol>
                                    <IonCol size="5"><small>{i18n.t("owner")}</small></IonCol>
                                    <IonCol size="3"><small>{i18n.t("period")}</small></IonCol>
                                </IonRow>
                            </div>
                            <div className="pool-info-detail">
                                {
                                    historyRecords && historyRecords.map(item => {
                                        return <div className="pool-info-item">
                                            <IonRow>
                                                {/*<IonCol size="2"><small>{item.itemNo}</small></IonCol>*/}
                                                <IonCol size="4"><small><IonText color="secondary">{utils.fromValue(item.price,18).toString(10)}</IonText> {item.currency}</small></IonCol>
                                                <IonCol size="5"><small className="no-wrap">{utils.ellipsisStr(item.owner,3)}</small></IonCol>
                                                <IonCol size="3"><small>{item.periods}
                                                </small></IonCol>
                                            </IonRow>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </IonModal>
                <IonToast
                    color={"danger"}
                    position="top"
                    isOpen={showToast}
                    onDidDismiss={() => this.setShowToast(false,"")}
                    message={toastMessage}
                    duration={1500}
                    mode="ios"
                />

                <IonLoading
                    mode="ios"
                    spinner={"bubbles"}
                    cssClass='my-custom-class'
                    isOpen={showLoading}
                    onDidDismiss={() => {
                        this.setState({
                            showLoading:false
                        })
                    }}
                    message={'Please wait...'}
                    duration={120000}
                />
                <ConfirmTransaction show={showConfirm} transaction={tx} onProcess={(f) => this.setShowConfirm(f)}
                                    onCancel={() => this.setShowConfirm(false)} onOK={this.confirm}/>
            </IonPage>
        );
    }
}

export default NFTMarketPlace