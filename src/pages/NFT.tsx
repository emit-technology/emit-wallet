import * as React from 'react';
import {
    IonContent, IonHeader, IonLabel,
    IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar,
} from "@ionic/react";
import rpc from "../rpc";
import walletWorker from "../worker/walletWorker";
import {ChainType} from "../types";
import {CONTRACT_ADDRESS} from "../config"
import "./NFT.css";
import NFCRender from "../components/NFCRender";
import interVar from "../interval";
import {Plugins} from "@capacitor/core";
import i18n from "../locales/i18n";


class NFT extends React.Component<any, any> {

    state: any = {
        wrapTicket: [],
        tab:"MEDAL",
    }

    constructor(props:any) {
        super(props);
        Plugins.StatusBar.setBackgroundColor({
            color: "#222428"
        })
    }

    componentDidMount() {

        interVar.start(()=>{
            this.init().then(() => {
            }).catch(e=>{
                console.error(e)
            })
        },10*1000)
    }

    init = async () => {
        const account = await walletWorker.accountInfo()

        const keys = Object.keys(CONTRACT_ADDRESS.ERC721);

        const seroTicket = await rpc.getTicket(ChainType.SERO, account.addresses[ChainType.SERO])
        const ethTicket = await rpc.getTicket(ChainType.ETH, account.addresses[ChainType.ETH])
        const ticketMap: Map<string,Array<any>> = new Map<string, Array<any>>()
        for (let key of keys) {
            const wrapTicket: Array<any> = [];
            const type = key;

            const ethSymbol = CONTRACT_ADDRESS.ERC721[key]["SYMBOL"]["ETH"];
            const seroSymbol = CONTRACT_ADDRESS.ERC721[key]["SYMBOL"]["SERO"];

            if(seroSymbol){
                const data:any = seroTicket[seroSymbol];
                if(data && data.length>0){
                    for(let d of data){
                        wrapTicket.push({
                            symbol:key,
                            value:d.tokenId,
                            uri:d.uri,
                            chain:ChainType[ChainType.SERO]
                        })
                    }
                }

            }

            if(ethSymbol){
                const data2:Array<any> = ethTicket[ethSymbol];
                if(data2 && data2.length>0){
                    for(let d of data2){
                        wrapTicket.push({
                            symbol:key,
                            value:d.tokenId,
                            uri:d.uri,
                            chain:ChainType[ChainType.ETH]
                        })
                    }
                }
            }

            if(ticketMap.has(type)){
                const temp:any = ticketMap.get(type);
                temp.concat(wrapTicket)
                ticketMap.set(type,temp);
            }else{
                ticketMap.set(type,wrapTicket);
            }

        }
        console.log(ticketMap)
        this.setState({
            ticketMap: ticketMap,
        })
    }

    render() {
        const {ticketMap,tab} = this.state;
        return <IonPage>
            <IonContent fullscreen color="dark">
                <IonHeader mode="ios">
                    <IonToolbar color="dark" mode="ios">
                        <IonTitle>{i18n.t("NFT")}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <div style={{padding:"12px 12px 0",background:"#000"}}>
                    <IonSegment mode="ios" color="light" value={tab} style={{background:"#000"}} onIonChange={e => this.setState({tab:e.detail.value})}>
                        <IonSegmentButton  color="light" mode="ios" style={{background:"#000"}} value="MEDAL">
                            <IonLabel color={tab=="MEDAL"?"dark":"light"}>Medal</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton  color="light" mode="ios" style={{background:"#000"}} value="DRIVER">
                            <IonLabel color={tab=="DRIVER"?"dark":"light"}>Driver</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton  color="light" mode="ios" style={{background:"#000"}} value="DEVICES">
                            <IonLabel color={tab=="DEVICES"?"dark":"light"}>Devices</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </div>
                {ticketMap && ticketMap.has(tab) && <NFCRender data={ticketMap.get(tab)}/>}
            </IonContent>
        </IonPage>;
    }
}

export default NFT