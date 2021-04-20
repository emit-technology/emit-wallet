import * as React from 'react';
import {
    IonList,
    IonListHeader,
    IonItemDivider,
    IonItem,
    IonGrid,
    IonCol,
    IonRow,
    IonText,
    IonLabel,
    IonAvatar,
    IonBadge,
    IonChip,
    IonProgressBar, IonIcon, IonSegment, IonSegmentButton, IonToolbar
} from '@ionic/react'

import {DeviceInfo} from "../../contract/epoch/sero/types";
import "./DeviceRank.scss"
import EpochAttribute from "../EpochAttribute";
import * as utils from "../../utils";
import i18n from "../../locales/i18n";

interface State{
    tab: string
    scenes:string
}

interface Props{
    devices:Array<DeviceInfo>
}

class DeviceRank extends React.Component<Props, State>{

    state:State = {
        tab:"device",
        scenes:"altar"
    }

    componentDidMount() {

    }

    setTab = (v:any)=>{
        this.setState({
            tab:v
        })
    }

    setScenes = (v:any)=>{
        this.setState({
            scenes:v
        })
    }
    render() {
        const {tab,scenes} = this.state;
        return <>
            <IonToolbar color="primary" mode="ios" className="heard-bg">
                <IonSegment value={tab} mode="ios" onIonChange={e => this.setTab(e.detail.value)}>
                    <IonSegmentButton value="device">
                        DEVICE
                    </IonSegmentButton>
                    <IonSegmentButton value="driver">
                        DRIVER
                    </IonSegmentButton>
                </IonSegment>
            </IonToolbar>
            {
                tab == "driver" && <div>
                    <IonSegment mode="ios" value={scenes} onIonChange={(e:any)=>this.setScenes(e.detail.value)}>
                        <IonSegmentButton value="altar">
                            <IonLabel color={scenes=="altar"?"":"white"}>ALTAR</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="chaos">
                            <IonLabel  color={scenes=="chaos"?"":"white"}>CHAOS</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </div>
            }
            <div className="device-box">
                <div className="rank-text">
                    TOP 10
                </div>
                <div className="device-list device-list-h1">

                    {
                        [1,2,3,4,5,6,7,8,9,10].map((v:number,i:number)=>{
                            return <IonItem lines="none" className="device-item" detail={true} detailIcon="chevron-forward" >
                                {v==1 && <IonAvatar slot="start" className="device-rank-avatar"><img src="./assets/img/epoch/top1.png" /></IonAvatar>}
                                {v==2 && <IonAvatar slot="start" className="device-rank-avatar"><img src="./assets/img/epoch/top2.png" /></IonAvatar>}
                                {v==3 && <IonAvatar slot="start" className="device-rank-avatar"><img src="./assets/img/epoch/top3.png" /></IonAvatar>}
                                {v>3 && <IonAvatar slot="start" className="device-rank-avatar"><div className="rank-digital">{v}</div></IonAvatar>}
                                <IonAvatar slot="start" className="device-rank-avatar">
                                    <img src="./assets/img/axe.png" />
                                </IonAvatar>
                                <IonLabel className="ion-text-wrap">

                                    <IonRow>
                                        <IonCol>
                                            <div>0x1dees..edx0</div>
                                        </IonCol>
                                        <IonCol>
                                            <div style={{textAlign: "right"}}>
                                                <IonText color="dark" className="text-little">45.00%</IonText>
                                            </div>
                                        </IonCol>
                                    </IonRow>
                                    <IonProgressBar className="progress-background" value ={0.8}/>

                                </IonLabel>

                            </IonItem>
                        })
                    }

                </div>
            </div>

            <div className="device-box">
                <div className="rank-text">
                    MY RANKING
                </div>
                <IonList className="device-list device-list-h2">

                    {
                        [1,2,3,4,5,6,7,8,9,10].map((v:number,i:number)=>{
                            return <IonItem lines="none" className="device-item" detail={true} detailIcon="chevron-forward" >
                                {v==1 && <IonAvatar slot="start" className="device-rank-avatar"><img src="./assets/img/epoch/top1.png" /></IonAvatar>}
                                {v==2 && <IonAvatar slot="start" className="device-rank-avatar"><img src="./assets/img/epoch/top2.png" /></IonAvatar>}
                                {v==3 && <IonAvatar slot="start" className="device-rank-avatar"><img src="./assets/img/epoch/top3.png" /></IonAvatar>}
                                {v>3 && <IonAvatar slot="start" className="device-rank-avatar"><div className="rank-digital">{v}</div></IonAvatar>}
                                <IonAvatar slot="start" className="device-rank-avatar">
                                    {v>0 && <img src="./assets/img/axe.png" />}
                                </IonAvatar>
                                <IonLabel className="ion-text-wrap">
                                    <h4>sdfsdf</h4>
                                    <IonProgressBar className="progress-background" value ={0.8}/>
                                </IonLabel>

                            </IonItem>
                        })
                    }

                </IonList>
            </div>
        </>;
    }
}

export default DeviceRank