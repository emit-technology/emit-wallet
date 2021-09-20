import * as React from 'react';
import {
    IonGrid,
    IonRow,
    IonCol,
    IonSearchbar,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonAvatar,IonChip,
    IonBadge
} from '@ionic/react';
import "./index.scss"
import url from "../../utils/url";
import i18n from "../../locales/i18n";
import epochMarketRpc, {VolumeOf24h} from "../../rpc/epoch/market";
import {fromValue, nFormatter} from "../../utils";

interface State{
    marketVolume?:VolumeOf24h
}
class Trade extends React.Component<any, State>{

    state:State = {
    }

    componentDidMount() {
        this.init()
    }

    init = async ()=>{
        const volume = await epochMarketRpc.marketVolumeOf24h();
        this.setState({
            marketVolume:volume
        })

    }
    render() {
        const {marketVolume} = this.state;
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar color="primary" mode="ios">
                        <IonTitle>{i18n.t("trade")}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>

                    <IonList>
                        <IonItem onClick={()=>{url.tradeTokenSwap()}}>
                            <IonAvatar slot="start" className="ex-item-avatar" color="primary">
                                <img src="./assets/img/market/pancake.jpeg" />
                            </IonAvatar>
                            <IonLabel className="ion-text-wrap">
                                <div className="ex-item">
                                    <div><IonText color="primary">{i18n.t("swap")}</IonText></div>
                                    {/*<div><IonText color="secondary">Wrapped PancakeSwap</IonText></div>*/}
                                    <div><IonText color="medium">Wrapped PancakeSwap</IonText></div>
                                </div>
                            </IonLabel>
                        </IonItem>
                        <IonItem onClick={()=>{url.tradeNftMarket()}}>
                            <IonAvatar slot="start" className="ex-item-avatar" color="primary">
                                <img src="./assets/img/market/remain.png" />
                            </IonAvatar>
                            <IonLabel className="ion-text-wrap">
                                <div className="ex-item">
                                    <div><IonText color="primary">{i18n.t("relics")} {i18n.t("market")}</IonText></div>
                                    <div><IonText color="medium">NFT free trading market</IonText></div>
                                </div>
                                {
                                    marketVolume &&
                                    <IonText color="secondary">
                                        <p style={{lineHeight:"1.5em"}}>
                                            24H Vol:&nbsp;&nbsp;<IonText color="secondary" className="font-weight-800">{marketVolume.count}</IonText><br/>
                                            24H Total: {marketVolume.amounts.map(v=>{
                                            return <IonText color="secondary" className="font-weight-800">&nbsp;&nbsp;{nFormatter(fromValue(v.amount,18),3)} {v.cy}</IonText>
                                        })}<br/>
                                            24H High: {marketVolume.amounts.map(v=>{
                                            return <IonText color="secondary" className="font-weight-800">&nbsp;&nbsp;{nFormatter(fromValue(v.high,18),3)} {v.cy}</IonText>
                                        })}
                                        </p>
                                    </IonText>

                                }
                            </IonLabel>

                        </IonItem>
                    </IonList>
                </IonContent>
            </IonPage>

        );
    }
}

export default Trade;