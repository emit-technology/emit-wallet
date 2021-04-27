import * as React from 'react';
import {
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {chevronBack} from "ionicons/icons";
import {Plugins} from "@capacitor/core";
import url from "../../../utils/url";
import DeviceRank from "../../../components/epoch/DeviceRank";
import walletWorker from "../../../worker/walletWorker";
import epochRankService from "../../../contract/epoch/sero/rank";
import {DeviceInfoRank} from "../../../contract/epoch/sero/types";

interface State{
    devices:Array<DeviceInfoRank>
    account?:any
}
class Rank extends React.Component<any, State>{

    state:State = {
        devices:[]
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
        const account = await walletWorker.accountInfo()

        const devices = await epochRankService.epochTopDevice(10)
        this.setState({
            devices:devices,
            account:account
        })
    }

    render() {
        const { devices} = this.state;

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
                    }}>DEVICE RANK</IonTitle>
                    {/*<IonLabel slot="end">*/}
                    {/*    <img src={"./assets/img/epoch/help.png"} width={28} onClick={() => {*/}
                    {/*    }}/>*/}
                    {/*</IonLabel>*/}
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen color="light">
                <div className="content-ion-rank">
                    <DeviceRank devices={devices}/>
                </div>
            </IonContent>
        </IonPage>;
    }
}

export default Rank