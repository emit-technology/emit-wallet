import * as React from 'react';
import {
    IonButtons,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonLabel,
    IonPage,
    IonRow,
    IonTitle,
    IonSegment,
    IonSegmentButton,
    IonBadge,
    IonToolbar,
    IonText,
    IonRefresherContent, IonRefresher, IonLoading
} from "@ionic/react";
import url from "../../utils/url";
import "./NFTMarketPlace.scss";
import {
    chevronBack, chevronDownCircleOutline, pricetag, searchOutline,
} from "ionicons/icons";
import epochMarketRpc, {MarketItem} from "../../rpc/epoch/market";
import CardTransform from "../../components/CardTransform";
import * as utils from "../../utils"
import {NftInfo} from "../../types";
import {AccountModel, ChainType} from "@emit-technology/emit-lib";
import walletWorker from "../../worker/walletWorker";
import i18n from "../../locales/i18n"
import {nFormatter} from "../../utils";
import {RefresherEventDetail} from "@ionic/core";
import {Plugins} from "@capacitor/core";
import EpochAttribute from "../../components/EpochAttribute";
interface State{
    marketItems:Array<MarketItem>
    selectItem?:MarketItem
    segment:string
    wrappedInfo?:NftInfo
    account?:AccountModel
    showLoading:boolean

}
class NFTMarketStatics extends React.Component<any, State> {

    state:State={
        marketItems:[],
        segment:"latest",
        showLoading:false
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
            console.error(e)
        })
    }
    init = async ()=>{
        const marketItems = await epochMarketRpc.marketTopExchange(50)
        const account = await walletWorker.accountInfo();
        this.setState({
            marketItems:marketItems,
            account:account
        })
    }

    setShowLoading = (f:boolean)=>{
        this.setState({
            showLoading:f
        })
    }

    doRefresh = (event:CustomEvent<RefresherEventDetail>) =>{
        const {segment} = this.state;
        this.setState({
            marketItems:[]
        })
        let rest:any = epochMarketRpc.marketTopExchange(50)
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


    setSegment = async (v:any)=>{
        if(v == "latest"){
            const items = await epochMarketRpc.marketTopExchange(50)
            this.setState({
                marketItems:items,
                segment:v,
            })
        }else if (v == "highest"){
            const items = await epochMarketRpc.marketTopPrice(50)
            this.setState({
                marketItems:items,
                segment:v,
            })
        }
    }

    render() {
        const {marketItems,segment,account,showLoading} = this.state;
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
                        }}>{i18n.t("Statistics")}</IonTitle>
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

                    <div className="content-ion">
                        <IonSegment mode="md" value={segment} color="light" onIonChange={e => {
                            this.setSegment( e.detail.value).catch(()=>{
                                this.setShowLoading(false)
                            })
                        }}>
                            <IonSegmentButton value="latest">
                                <IonLabel color={segment=="latest"?"warning":"white"}>Latest Records</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="highest">
                                <IonLabel color={segment=="highest"?"warning":"white"}>Highest price</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                        <IonGrid>
                            <IonRow>
                                {
                                    marketItems && marketItems.map(item => {
                                        const info =  utils.convertMarketItemToNFTInfo(item);
                                        return <IonCol sizeXl="3" sizeMd="6" sizeXs="12" sizeSm="6" sizeLg="4">
                                            <div className="nft-mkt-item">
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
                    </div>
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
                </IonContent>
            </IonPage>
        );
    }
}

export default NFTMarketStatics