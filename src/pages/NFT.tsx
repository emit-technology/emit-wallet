import * as React from 'react';
import {
    IonContent,
    IonHeader,
    IonLabel,
    IonPage,
    IonSegment,
    IonSegmentButton,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import rpc from "../rpc";
import walletWorker from "../worker/walletWorker";
import {ChainType, NftInfo} from "../types";
import {CONTRACT_ADDRESS} from "../config"
import "./NFT.css";
import i18n from "../locales/i18n";
import CardTransform from "../components/CardTransform";
import {Plugins} from "@capacitor/core";

class NFT extends React.Component<any, any> {

    state: any = {
        wrapTicket: [],
        tab:"DEVICES",
        drivers:{}
    }

    constructor(props:any) {
        super(props);
    }

    componentDidMount() {
        Plugins.StatusBar.setBackgroundColor({
            color: "#194381"
        })
        this.init().then(() => {
        }).catch(e=>{
            console.error(e)
        })
    }

    init = async () => {

        const account = await walletWorker.accountInfo()
        const keys = Object.keys(CONTRACT_ADDRESS.ERC721);
        const seroTicket = await rpc.getTicket(ChainType.SERO, account.addresses[ChainType.SERO])
        const ethTicket = await rpc.getTicket(ChainType.ETH, account.addresses[ChainType.ETH])
        const bscTicket = await rpc.getTicket(ChainType.BSC, account.addresses[ChainType.BSC])
        const ticketMap: Map<string,Array<NftInfo>> = new Map<string, Array<NftInfo>>()

        for (let key of keys) {
            let wrapTicket: Array<NftInfo> = [];
            const ethSymbol = CONTRACT_ADDRESS.ERC721[key]["SYMBOL"]["ETH"];
            const seroSymbol = CONTRACT_ADDRESS.ERC721[key]["SYMBOL"]["SERO"];
            const bscSymbol = CONTRACT_ADDRESS.ERC721[key]["SYMBOL"]["BSC"];
            if(seroSymbol && seroTicket){
                const data:Array<NftInfo> = seroTicket[seroSymbol];
                if(data && data.length>0){
                    wrapTicket = wrapTicket.concat(data)
                }
            }

            if(ethSymbol && ethTicket){
                const data:Array<NftInfo> = ethTicket[ethSymbol];
                if(data && data.length>0){
                    wrapTicket = wrapTicket.concat(data)
                }
            }

            if(bscSymbol && bscTicket){
                const data:Array<NftInfo> = bscTicket[bscSymbol];
                if(data && data.length>0){
                    wrapTicket = wrapTicket.concat(data)
                }
            }

            wrapTicket.reverse()
            ticketMap.set(key,wrapTicket);
        }

        this.setState({
            ticketMap: ticketMap,
        })


    }

    setTab = (v:any)=>{

        this.init().then(() => {
        }).catch(e=>{
            console.error(e)
        })

        const {ticketMap} = this.state;

        const tmp:any = ticketMap;
        this.setState({tab:v,ticketMap:new Map()})
        this.setState({
            ticketMap:tmp
        })
        console.log(tmp)
        // this.initDriver(v).catch(e=>{
        //     console.log(e)
        // })
    }

    render() {
        const {ticketMap,tab,drivers} = this.state;
        return <IonPage>
            <IonHeader mode="ios">
                <IonToolbar color="primary" mode="ios">
                    <IonTitle>{i18n.t("NFT")}</IonTitle>
                    {/*<IonLabel slot="end" onClick={()=>{*/}
                    {/*    url.exchangeRemains();*/}
                    {/*}}>*/}
                    {/*    MARKET*/}
                    {/*</IonLabel>*/}
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen >
                <div style={{padding:"12px 12px 0"}}>
                    <IonSegment mode="ios"value={tab} onIonChange={e => this.setTab(e.detail.value)}>
                        {/*<IonSegmentButton mode="ios" value="DRIVER">*/}
                        {/*    <IonLabel>Driver</IonLabel>*/}
                        {/*</IonSegmentButton>*/}
                        <IonSegmentButton value="DEVICES">
                            <IonLabel>DEVICES</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="WRAPPED_DEVICES">
                            <IonLabel>RELICS</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton mode="ios" value="MEDAL">
                            <IonLabel>MEDAL</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton mode="ios" value="COUNTER">
                            <IonLabel>COUNTER</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </div>
                {["MEDAL","DEVICES","WRAPPED_DEVICES","COUNTER"].indexOf(tab)>-1 && ticketMap && ticketMap.has(tab) &&
                    <div className="card-page">
                    <div className="card-inset">
                    {
                        ticketMap.has(tab) && ticketMap.get(tab).map((v: NftInfo,index:number) => {
                            //lines={index == data.length-1?"none":"inset"}
                            // const meta = v.metaData?v.metaData:{};
                            console.log(v,"nftinfo")
                            return <CardTransform info={v}/>
                        })
                    }

                    </div>
                    </div>
                }
            </IonContent>
        </IonPage>;
    }
}

export default NFT