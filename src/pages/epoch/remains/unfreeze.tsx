import * as React from "react";
import {
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonLoading,
    IonPage,
    IonTitle,IonChip,IonText,
    IonToast,
    IonToolbar,IonBadge
} from "@ionic/react";
import i18n from "../../../locales/i18n";
import {ChainType, NftInfo, Transaction} from "../../../types";
import rpc from "../../../rpc";
import * as utils from "../../../utils";
import epochRemainsService from "../../../contract/epoch/sero/remains";
import walletWorker from "../../../worker/walletWorker";
import BigNumber from "bignumber.js";
import url from "../../../utils/url";
import {chevronBack} from "ionicons/icons";
import CardTransform from "../../../components/CardTransform";
import ConfirmTransaction from "../../../components/ConfirmTransaction";
import {DeviceInfo, WrappedDevice} from "../../../contract/epoch/sero/types";
import EpochAttribute from "../../../components/EpochAttribute";

interface State{
    ticket?:NftInfo
    showModal:boolean
    showProgress:boolean
    showLoading:boolean
    showToast:boolean
    toastMessage:string
    tx:any
    fee:any
}
class Unfreeze extends React.Component<any, State>{

    state:State = {
        showModal:false,
        showProgress:false,
        showLoading:false,
        showToast:false,
        toastMessage:"",
        tx:{},
        fee:0
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
            const ticketObj = await rpc.getTicket(ChainType.SERO,"")
            const tickets = ticketObj[utils.getCategoryBySymbol(category,ChainType[ChainType.SERO])]
            let ticket = null;
            if(tickets && tickets.length>0){
                for(let v of tickets){
                    if(tkt == v.tokenId){
                        ticket = v;
                    }
                }
            }
            const account = await walletWorker.accountInfo();
            const value = await epochRemainsService.unsealFee(ticket.tokenId,account.addresses[ChainType.SERO])
            this.setState({
                ticket:ticket,
                fee:utils.fromValue(value,18).toString(10)
            })
        }
    }

    unfreeze = async ()=>{
        const {ticket} = this.state;
        if(!ticket){
            return
        }
        const data = await epochRemainsService.unseal()
        const account = await walletWorker.accountInfo();
        const value = await epochRemainsService.unsealFee(ticket.tokenId,account.addresses[ChainType.SERO])
        const Currency="LIGHT"
        const tx: Transaction | any = {
            from: account.addresses && account.addresses[ChainType.SERO],
            to: epochRemainsService.address,
            cy: Currency,
            gasPrice: "0x" + new BigNumber(1).multipliedBy(1e9).toString(16),
            chain: ChainType.SERO,
            amount: "0x0",
            feeCy: Currency,
            value: utils.toHex(value),
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
        this.setShowModal(false)
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

    remainsToDeviceNftInfo = (remains?:NftInfo)=>{
        if(remains){
            const device:NftInfo = JSON.parse(JSON.stringify(remains));
            const deviceInfo:DeviceInfo = utils.convertWrappedDeviceToDevice(device.meta.attributes);
            device.symbol="DEVICES";
            device.meta.image=`./assets/img/epoch/device/${deviceInfo.mode?.style}.png`
            device.meta.attributes=JSON.parse(JSON.stringify(deviceInfo))
            return device
        }
    }

    renderStar = (num:number)=>{
        const starElement = [];
        for(let i=0;i<num;i++){
            starElement.push(<img src="./assets/img/epoch/remains/device/light/star.png" width={24}/>)
        }
        return starElement;
    }

    render() {
        const {ticket,showLoading,showModal,showToast,toastMessage,tx,fee} = this.state;

        const wrappedDevice:WrappedDevice = ticket && ticket.meta.attributes;
        const device = this.remainsToDeviceNftInfo(ticket);
        const deviceInfo:DeviceInfo = device && device.meta.attributes;
        return (
            <IonPage>
                <IonHeader mode="ios">
                    <IonToolbar color="primary" mode="ios">
                        <IonIcon src={chevronBack} slot="start" size="large" onClick={()=>{url.back()}}/>
                        <IonTitle>{i18n.t("unseal")}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen >
                    <div style={{padding:"0 0 50px"}} className="content-ion">
                        <div className="box-center" style={{height:"calc(100vw/1.9)",maxHeight:"269px"}}>
                            <img src="./assets/img/market/remains.jpeg" style={{maxWidth:"512px",width:"100%",position:"fixed"}}/>
                            <div style={{position:"fixed",top:"45px",width:"100%",maxWidth:"512px"}}>
                                <div style={{width:"138px",float:"left",opacity:1}}>
                                    {ticket && <CardTransform info={ticket} hideButton={true} showSimple={true}/>}
                                </div>
                                <div style={{width:"145px",float:"right" ,minWidth:"115px",opacity:1}}>
                                    {device && <CardTransform info={device} hideButton={true} showSimple={true}/>}
                                </div>
                                <div style={{position:"absolute"}}>
                                    <img src="./assets/img/epoch/remains/rightward.png" width="20%"/>
                                </div>
                            </div>
                        </div>

                        <div style={{padding:"12px"}} >
                            <div className="nft-attr-item">
                                <div>Token Id {ticket && ticket.meta && ticket.meta.alis?<small><IonText color="secondary">({ticket.meta.alis})</IonText></small>:""}</div>
                                <div>{ticket?.tokenId}</div>
                            </div>
                            {/*<div className="nft-attr-item">*/}
                            {/*    <div>Device Type</div>*/}
                            {/*    <div>*/}
                            {/*        <IonBadge color="tertiary">{deviceInfo&& utils.isDark(deviceInfo.gene)?"DARK AXE":"LIGHT AXE"}</IonBadge>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            <div className="nft-attr-item">
                                <div>{i18n.t("attribute")}</div>
                                <div>
                                    {
                                        device && <EpochAttribute color="light" showDevice={true} showDriver={false} hiddenButton={true} device={deviceInfo}/>
                                    }
                                </div>
                            </div>
                            <div className="nft-attr-item">
                                <div>{i18n.t("estimate")} {i18n.t("unseal")} {i18n.t("fee")}</div>
                                <div>
                                    {wrappedDevice && <p style={{lineHeight:"1.5em"}}>
                                        {i18n.t("seal")} {i18n.t("period")}: <IonText color="secondary">{wrappedDevice.freezeStartPeriod}</IonText><br/>
                                        {i18n.t("currentPeriod")}: <IonText color="secondary">{wrappedDevice.current}</IonText><br/>
                                        {i18n.t("seal")} {i18n.t("fee")}: <IonText color="secondary">
                                            {utils.nFormatter(utils.fromValue(wrappedDevice.freezeFee,18).toNumber(),4)}
                                        </IonText> LIGHT/{i18n.t("period")}<br/>
                                        {i18n.t("total")} {i18n.t("fee")}: <IonText color="secondary">{fee}</IonText> LIGHT
                                    </p>}

                                </div>
                            </div>

                        </div>
                        <div style={{position:"fixed",width:"100%",bottom:"5px"}}>
                            <IonButton expand="block" mode="ios" color="secondary" onClick={()=>{
                                this.setShowLoading(true);
                                this.unfreeze().then(()=>{
                                    this.setShowLoading(false)
                                }).catch(e=>{console.error(e);this.setShowLoading(false)})
                            }}>{i18n.t("unseal")}</IonButton>
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

export default Unfreeze