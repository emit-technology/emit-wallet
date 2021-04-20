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
import DeviceRank from "../../../components/epoch/DeviceRank";

class Rank extends React.Component<any, any>{

    componentDidMount() {
    }

    render() {
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
                    }}>RANK</IonTitle>
                    <IonLabel slot="end">
                        <img src={"./assets/img/epoch/help.png"} width={28} onClick={() => {
                        }}/>
                    </IonLabel>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen color="light">
                <div className="content-ion">

                    <DeviceRank devices={[]}/>
                </div>
            </IonContent>
        </IonPage>;
    }
}

export default Rank