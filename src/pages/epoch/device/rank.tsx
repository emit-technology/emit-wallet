import * as React from 'react';
import {IonContent, IonHeader, IonIcon, IonLoading, IonPage, IonText, IonTitle, IonToolbar} from "@ionic/react";
import {chevronBack, statsChartOutline} from "ionicons/icons";
import {Plugins} from "@capacitor/core";
import url from "../../../utils/url";
import DeviceRank from "../../../components/epoch/DeviceRank";
import walletWorker from "../../../worker/walletWorker";
import epochService from "../../../contract/epoch/sero";
import epochRankService from "../../../contract/epoch/sero/rank";
import {DeviceInfoRank} from "../../../contract/epoch/sero/types";
import selfStorage from "../../../utils/storage";
import * as utils from "../../../utils"
import {ChainType} from "../../../types";
import {MinerScenes} from "../miner";

interface State{
    devices:Array<DeviceInfoRank>
    account?:any
    showLoading:boolean
    pageSize:number
    myDevices:Array<string>
}
class Rank extends React.Component<any, State>{

    state:State = {
        devices:[],
        showLoading:false,
        pageSize:10,
        myDevices:[]
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

    init = async (pageSize?:number)=>{
        const account = await walletWorker.accountInfo()

        const devices = await epochRankService.epochTopDevice(pageSize?pageSize:this.state.pageSize)
        let myDevices:Array<string> = selfStorage.getItem(utils.ticketArrKey(ChainType.SERO))
        const altarLocked = await epochService.lockedDevice(MinerScenes.altar, account.addresses[ChainType.SERO])
        const chaosLocked = await epochService.lockedDevice(MinerScenes.chaos, account.addresses[ChainType.SERO])
        if(!myDevices){
            myDevices=[]
        }
        myDevices.push(altarLocked.ticket)
        myDevices.push(chaosLocked.ticket)
        this.setState({
            devices:devices,
            account:account,
            myDevices:myDevices
        })
    }

    setShowLoading = (f:boolean)=>{
        this.setState({showLoading:f})
    }

    loadMore = (event:any)=>{
        this.setState({
            pageSize:1000,
            showLoading:true
        })
        this.init(1000).then(()=>{
            this.setShowLoading(false)
            event.target.disabled = true;
            event.target.complete();
        }).catch(e=>{
            this.setShowLoading(false)
            console.error(e)
        })
    }

    render() {
        const { devices,showLoading,pageSize,myDevices} = this.state;

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
                        <IonText>DEVICE</IonText>
                    </IonTitle>
                    {/*<IonLabel slot="end">*/}
                    {/*    <img src={"./assets/img/epoch/help.png"} width={28} onClick={() => {*/}
                    {/*    }}/>*/}
                    {/*</IonLabel>*/}
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen color="light">
                <div className="content-ion-rank">
                    <DeviceRank devices={devices} loadMore={(e)=>this.loadMore(e)} pageSize={pageSize} myDevices={myDevices}/>
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