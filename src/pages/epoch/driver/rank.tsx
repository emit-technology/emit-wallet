import * as React from 'react';
import {
    IonContent,
    IonHeader,
    IonIcon,
    IonLabel, IonLoading,
    IonPage,
    IonSegment,
    IonSegmentButton,
    IonTitle,IonText,
    IonToolbar
} from "@ionic/react";
import {chevronBack, statsChartOutline} from "ionicons/icons";
import {Plugins} from "@capacitor/core";
import url from "../../../utils/url";
import {MinerScenes} from "../miner";
import DriverRank from "../../../components/epoch/DriverRank";
import {DriverInfoRank, PositionDriverInfoRank} from "../../../contract/epoch/sero/types";
import epochRankService from "../../../contract/epoch/sero/rank";
import walletWorker from "../../../worker/walletWorker";
import {ChainType} from "../../../types";

interface State{
    scenes:string
    drivers:Array<DriverInfoRank>
    myDriversRank?:PositionDriverInfoRank
    account?:any
    showLoading:boolean
    pageSize:number
    tabType:string
    position?:number
}

class Rank extends React.Component<any, State>{

    state:State = {
        scenes:MinerScenes[MinerScenes.altar],
        drivers:[],
        showLoading:false,
        pageSize:10,
        tabType:"top"

    }

    componentDidMount() {
        Plugins.StatusBar.setBackgroundColor({
            color: "#152955"
        }).catch(e => {
        })

        this.setShowLoading(true)
        this.init().then(()=>{
            this.setShowLoading(false)
        }).catch((e)=>{
            this.setShowLoading(false)
            console.error(e)
        })
    }

    setShowLoading = (f:boolean)=>{
        this.setState({showLoading:f})
    }

    init = async (pagesize?:number)=>{
        const {pageSize,tabType} = this.state;
        const scenesParams = this.props.match.params.scenes;
        const account = await walletWorker.accountInfo()

        if(tabType == "top"){
            const drivers = await epochRankService.epochTopDriver(scenesParams?parseInt(scenesParams):MinerScenes.altar,pagesize?pagesize:pageSize);
            this.setState({
                position:0,
                drivers:drivers,
                account:account
            })
        }else if(tabType == "my"){
            const myDriversRank = await epochRankService.epochPositionDriver(account.addresses[ChainType.SERO],scenesParams?parseInt(scenesParams):MinerScenes.altar)
            this.setState({
                drivers:myDriversRank.data,
                account:account,
                position:myDriversRank.position
            })
        }
    }

    setTabType = (v:string)=>{
        this.setState({
            tabType:v
        })
        this.setShowLoading(true)
        this.init().then(()=>{
            this.setShowLoading(false)
        }).catch((e)=>{
            this.setShowLoading(false)
            console.error(e)
        })
    }

    loadMore = (event:any)=>{
        this.setState({
            pageSize:100,
            showLoading:true
        })
        this.init(100).then(()=>{
            this.setShowLoading(false)
            event.target.disabled = true;
            event.target.complete();
        }).catch(e=>{
            this.setShowLoading(false)
            console.error(e)
        })
    }

    render() {
        const {drivers,tabType,account,showLoading,pageSize,position} = this.state;

        return <IonPage>
            <IonHeader>
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
                        textTransform: "uppercase"
                    }}>
                        <IonIcon src={statsChartOutline}/>&nbsp;&nbsp;
                        <IonText>{MinerScenes[this.props.match.params.scenes]} DRIVER</IonText>
                    </IonTitle>
                    {/*<IonLabel slot="end">*/}
                    {/*    <img src={"./assets/img/epoch/help.png"} width={28} onClick={() => {*/}
                    {/*    }}/>*/}
                    {/*</IonLabel>*/}
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen color="light">
                <div className="content-ion-rank">
                    <IonToolbar color="primary" mode="ios" className="heard-bg">
                        <IonSegment mode="ios" value={tabType} onIonChange={(e:any)=>this.setTabType(e.detail.value)}>
                            <IonSegmentButton value={"top"}>
                                <IonLabel>TOP</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value={"my"}>
                                <IonLabel>MINE</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                    </IonToolbar>
                    <DriverRank drivers={drivers} position={position} mainPKr={account && account.addresses[ChainType.SERO]} loadMore={(e)=>this.loadMore(e)} pageSize={pageSize}/>
                </div>
            </IonContent>

            <IonLoading
                mode="ios"
                spinner={"bubbles"}
                cssClass='my-custom-class'
                isOpen={showLoading}

                onDidDismiss={() => this.setShowLoading(false)}
                message={'Please wait...'}
                duration={120000}
            />
        </IonPage>;
    }
}

export default Rank