import * as React from 'react';
import {
    IonContent,
    IonHeader,
    IonIcon,
    IonLabel,
    IonPage,
    IonSegment,
    IonSegmentButton,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {chevronBack} from "ionicons/icons";
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
}

class Rank extends React.Component<any, State>{

    state:State = {
        scenes:MinerScenes[MinerScenes.altar],
        drivers:[],
    }


    componentDidMount() {
        Plugins.StatusBar.setBackgroundColor({
            color: "#152955"
        }).catch(e => {
        })

        this.init().catch((e)=>{
            console.error(e)
        })
    }

    init = async ()=>{
        const {scenes} = this.state;
        let scenesParams = MinerScenes.altar
        if(scenes){
            scenesParams = scenes==MinerScenes[ MinerScenes.chaos]?MinerScenes.chaos:MinerScenes.altar;
        }
        const account = await walletWorker.accountInfo()

        const drivers = await epochRankService.epochTopDriver(scenesParams?scenesParams:MinerScenes.altar,10);
        const myDriversRank = await epochRankService.epochPositionDriver(account.addresses[ChainType.SERO],scenesParams?scenesParams:MinerScenes.altar)
        this.setState({
            drivers:drivers,
            myDriversRank:myDriversRank,
            account:account
        })
    }

    setScenes = (v:any)=>{
        this.setState({
            scenes:v
        })
        this.init().catch(e=>{
            console.error(e)
        })
    }

    render() {
        const {scenes,drivers,myDriversRank,account} = this.state;

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
                    }}>DRIVER RANK</IonTitle>
                    {/*<IonLabel slot="end">*/}
                    {/*    <img src={"./assets/img/epoch/help.png"} width={28} onClick={() => {*/}
                    {/*    }}/>*/}
                    {/*</IonLabel>*/}
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen color="light">
                <div className="content-ion-rank">
                    <IonToolbar color="primary" mode="ios" className="heard-bg">
                        <IonSegment mode="ios" value={scenes} onIonChange={(e:any)=>this.setScenes(e.detail.value)}>
                            <IonSegmentButton value={MinerScenes[MinerScenes.altar]}>
                                <IonLabel>ALTAR</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value={MinerScenes[MinerScenes.chaos]}>
                                <IonLabel>CHAOS</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                    </IonToolbar>
                    <DriverRank drivers={drivers} myDriversRank={myDriversRank} mainPKr={account && account.addresses[ChainType.SERO]}/>
                </div>
            </IonContent>
        </IonPage>;
    }
}

export default Rank