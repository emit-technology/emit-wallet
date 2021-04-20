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
}

interface Props{
    devices:Array<DeviceInfo>
}

class DeviceRank extends React.Component<Props, State>{

    state:State = {
        tab:"device"
    }

    componentDidMount() {

    }

    setTab = (v:any)=>{
        this.setState({
            tab:v
        })
    }

    render() {
        const {tab} = this.state;
        return <>
            <IonToolbar color="primary" mode="ios" className="heard-bg">
                <IonSegment value={tab} onIonChange={e => this.setTab(e.detail.value)}>
                    <IonSegmentButton value="device">
                        Device
                    </IonSegmentButton>
                    <IonSegmentButton value="driver">
                        Driver
                    </IonSegmentButton>
                </IonSegment>
            </IonToolbar>
            <div className="device-box">
                <IonList className="device-list">
                    {
                        [1,2,3,4,5,6,7,8,9,10].map((v:number,i:number)=>{
                            return <IonItem lines="none" className="device-item" detail={true} detailIcon="chevron-forward" >
                                <IonBadge slot="start">{i+1}</IonBadge>
                                <IonAvatar slot="start" className="device-rank-avatar">
                                    <img src="./assets/img/axe.png" />
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