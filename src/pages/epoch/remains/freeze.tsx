import * as React from "react";
import {
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonLoading,
    IonPage,
    IonTitle,
    IonToast,
    IonToolbar,IonBadge,
    IonList,
    IonItem,IonText,
    IonLabel,
    IonRow,IonCol
} from "@ionic/react";
import i18n from "../../../locales/i18n";
import epochRemainsService from "../../../contract/epoch/sero/remains";
import rpc from "../../../rpc";
import * as utils from "../../../utils";
import {ChainType, NftInfo, Transaction} from "../../../types";
import CardTransform from "../../../components/CardTransform";
import {chevronBack} from "ionicons/icons";
import url from "../../../utils/url";
import "./index.scss";
import ConfirmTransaction from "../../../components/ConfirmTransaction";
import BigNumber from "bignumber.js";
import walletWorker from "../../../worker/walletWorker";
import {DeviceInfo} from "../../../contract/epoch/sero/types";
import EpochAttribute from "../../../components/EpochAttribute";
import {nFormatter} from "../../../utils";

interface State{
    ticket?:NftInfo
    showModal:boolean
    showProgress:boolean
    showLoading:boolean
    showToast:boolean
    toastMessage:string
    tx:any,
    estimateFee:any
}
class Freeze extends React.Component<any, State>{

    state:State = {
        showModal:false,
        showProgress:false,
        showLoading:false,
        showToast:false,
        toastMessage:"",
        tx:{},
        estimateFee:[0,0]
    }

    componentDidMount() {
        this.init().catch(e=>{
            console.error(e)
        })
    }

    init = async ()=>{
        const tkt = this.props.match.params.tkt;
        const category = this.props.match.params.category;
        if(tkt && category){
            const ticketObj = await rpc.getTicket(ChainType.SERO,"");
            const tickets = ticketObj[utils.getCategoryBySymbol(category,ChainType[ChainType.SERO])]
            let ticket:any;
            if(tickets && tickets.length>0){
                for(let v of tickets){
                    if(tkt == v.tokenId){
                        ticket = v;
                    }
                }
            }
            const account = await walletWorker.accountInfo();
            const rest = await epochRemainsService.estimateFee(tkt,ticket.category,account.addresses[ChainType.SERO])
            this.setState({
                ticket:ticket,
                estimateFee:rest
            })
        }
    }

    freeze = async ()=>{
        const {ticket} = this.state;
        const data = await epochRemainsService.freeze()
        const account = await walletWorker.accountInfo();
        const Currency="LIGHT"
        const tx: Transaction | any = {
            from: account.addresses && account.addresses[ChainType.SERO],
            to: epochRemainsService.address,
            cy: Currency,
            gasPrice: "0x" + new BigNumber(1).multipliedBy(1e9).toString(16),
            chain: ChainType.SERO,
            amount: "0x0",
            feeCy: Currency,
            value: "0x0",
            data: data,
        }
        tx.catg = ticket?.category
        tx.tkt = ticket?.tokenId
        tx.tickets = [{
            Category: tx.catg ,
            Value: tx.tkt
        }]

        tx.gas = await epochRemainsService.estimateGas(tx)
        if (tx.gas && tx.gasPrice) {
            tx.feeValue = await epochRemainsService.tokenRate(tx.gasPrice, tx.gas);
        }
        this.setState({
            tx: tx,
            showModal: true
        })
    }

    setShowModal = (f: boolean) => {
        this.setState({
            showModal: f
        })
    }

    setShowLoading = (f: boolean) => {
        this.setState({
            showLoading: f
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
                    url.transactionInfo(ChainType.SERO, hash, "LIGHT","#/tabs/nft");
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

    render() {
        const {ticket,showLoading,showModal,showToast,toastMessage,tx,estimateFee} = this.state;
        const remains = ticket && utils.convertDeviceToRemains(ticket);
        const device:DeviceInfo = ticket?.meta.attributes;
        return (
            <IonPage>
                <IonHeader mode="ios">
                    <IonToolbar color="primary" mode="ios">
                        <IonIcon src={chevronBack} slot="start" size="large" onClick={()=>{url.back()}}/>
                        <IonTitle>{i18n.t("seal")}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen >
                    <div style={{padding:"0 0 50px"}} className="content-ion">
                        <div className="box-center" style={{height:"calc(100vw/1.9)",maxHeight:"269px"}}>
                            <img src="./assets/img/market/remains.jpeg" style={{maxWidth:"512px",width:"100%",position:"fixed"}}/>
                            <div style={{position:"fixed",top:"45px",width:"100%",maxWidth:"512px"}}>
                                <div style={{width:"145px",float:"left",opacity:1}}>
                                    {ticket && <CardTransform info={ticket} hideButton={true} showSimple={true}/>}
                                    {/*<div className="seal-move">*/}
                                    {/*    <div style={{animation:"star-move-out-mkt 20s cubic-bezier(0.55, 0, 1, 0.45) infinite"}}></div>*/}
                                    {/*    <div style={{animation:"star-move-out-mkt 16s cubic-bezier(0.55, 0, 1, 0.45) infinite"}}></div>*/}
                                    {/*    <div style={{animation:"star-move-out-mkt 10s cubic-bezier(0.55, 0, 1, 0.45) infinite"}}></div>*/}
                                    {/*    <div style={{animation:"star-move-out-mkt 8s cubic-bezier(0.55, 0, 1, 0.45) infinite"}}></div>*/}
                                    {/*    <div style={{animation:"star-move-out-mkt 17s cubic-bezier(0.55, 0, 1, 0.45) infinite"}}></div>*/}
                                    {/*    <div style={{animation:"star-move-out-mkt 14s cubic-bezier(0.55, 0, 1, 0.45) infinite"}}></div>*/}
                                    {/*    <div style={{animation:"star-move-out-mkt 11s cubic-bezier(0.55, 0, 1, 0.45) infinite"}}></div>*/}
                                    {/*    <div style={{animation:"star-move-out-mkt 7s cubic-bezier(0.55, 0, 1, 0.45) infinite"}}></div>*/}
                                    {/*    <div style={{animation:"star-move-out-mkt 9s cubic-bezier(0.55, 0, 1, 0.45) infinite"}}></div>*/}
                                    {/*    <div style={{animation:"star-move-out-mkt 5s cubic-bezier(0.55, 0, 1, 0.45) infinite"}}></div>*/}
                                    {/*    <div style={{animation:"star-move-out-mkt 6s cubic-bezier(0.55, 0, 1, 0.45) infinite"}}></div>*/}
                                    {/*</div>*/}
                                </div>
                                <div style={{width:"138px",float:"right" ,minWidth:"115px",opacity:1}}>
                                    {remains && <CardTransform info={remains} hideButton={true} showSimple={true}/>}
                                </div>
                                <div style={{position:"absolute"}}>
                                    <img src="./assets/img/epoch/remains/rightward.png" width="20%"/>
                                </div>
                            </div>
                        </div>

                        <div style={{padding:"12px"}} >
                            <div className="nft-attr-item">
                                <div>Token ID {ticket && ticket.meta && ticket.meta.alis?<small><IonText color="secondary">({ticket.meta.alis})</IonText></small>:""}</div>
                                <div>{ticket?.tokenId}</div>
                            </div>
                            {/*<div className="nft-attr-item">*/}
                            {/*    <div>Device Type</div>*/}
                            {/*    <div>*/}
                            {/*       <IonBadge color="tertiary">{device&& utils.isDark(device.gene)?"DARK AXE":"LIGHT AXE"}</IonBadge>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            <div className="nft-attr-item">
                                <div>{i18n.t("attribute")}</div>
                                <div>
                                    {
                                        device && <EpochAttribute color="light" showDevice={true} showDriver={false} device={device}/>
                                    }
                                </div>
                            </div>
                            <div className="nft-attr-item">
                                <div>{i18n.t("estimate")} {i18n.t("seal")} {i18n.t("fee")}</div>
                                <div>
                                    <p><IonText color="secondary">{nFormatter(utils.fromValue(estimateFee[0],18).toNumber(),4)}</IonText> LIGHT/<small>{i18n.t("period")}</small>,
                                        {i18n.t("max")} <IonText color="secondary">{nFormatter(utils.fromValue(new BigNumber(estimateFee[0]).multipliedBy(new BigNumber(estimateFee[1])),18).toNumber(),4)}</IonText> LIGHT
                                    </p>
                                </div>
                            </div>

                        </div>
                        <div style={{position:"fixed",width:"100%",bottom:"5px"}}>
                            <IonButton expand="block" mode="ios" color="secondary" onClick={()=>{
                                this.setShowLoading(true);
                                this.freeze().then(()=>{
                                    this.setShowLoading(false)
                                }).catch(e=>{console.error(e);this.setShowLoading(false)})
                            }}>{i18n.t("seal")}</IonButton>
                        </div>
                    </div>

                    <IonToast
                        mode="ios"
                        isOpen={showToast}
                        color="danger"
                        position="top"
                        onDidDismiss={() => this.setShowToast(false,"")}
                        message={toastMessage}
                        duration={1500}
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

                    <ConfirmTransaction show={showModal} transaction={tx} onProcess={(f) => this.setShowModal(f)}
                                        onCancel={() => this.setShowModal(false)} onOK={this.confirm}/>
                </IonContent>
            </IonPage>
        );
    }
}

export default Freeze