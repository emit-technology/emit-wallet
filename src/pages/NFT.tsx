import * as React from 'react';
import {
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonPage,
    IonTitle, IonGrid, IonRow, IonCol,
    IonToolbar
} from "@ionic/react";
import i18n from "../locales/i18n";
import rpc from "../rpc";
import walletWorker from "../worker/walletWorker";
import {ChainType} from "../types";
import {CONTRACT_ADDRESS} from "../config"
import "./NFT.css";
import NFCRender from "../components/NFCRender";

class NFT extends React.Component<any, any> {

    state: any = {
        wrapTicket: [],
    }

    componentDidMount() {
        this.init().catch(e => {
            console.error(e)
        })
    }

    init = async () => {
        const account = await walletWorker.accountInfo()

        const keys = Object.keys(CONTRACT_ADDRESS.ERC721);
        const wrapTicket: Array<any> = [];
        const seroTicket = await rpc.getTicket(ChainType.SERO, account.addresses[ChainType.SERO])
        const ethTicket = await rpc.getTicket(ChainType.ETH, account.addresses[ChainType.ETH])
        for (let key of keys) {
            const ethSymbol = CONTRACT_ADDRESS.ERC721[key]["SYMBOL"]["ETH"];
            const seroSymbol = CONTRACT_ADDRESS.ERC721[key]["SYMBOL"]["SERO"];

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
        this.setState({
            wrapTicket: wrapTicket,
        })
    }

    render() {
        const {wrapTicket} = this.state;
        console.log("wrapTicket: ",wrapTicket);
        return <>
            <IonPage>
                <IonContent fullscreen>
                    <IonHeader mode="ios">
                        <IonToolbar color="primary" mode="ios">
                            <IonTitle>{i18n.t("nft")}</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <NFCRender data={wrapTicket}/>

                </IonContent>
            </IonPage>
        </>;
    }
}

export default NFT