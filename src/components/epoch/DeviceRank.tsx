import * as React from 'react';
import {IonAvatar, IonCol, IonIcon, IonItem, IonLabel, IonModal, IonProgressBar, IonText} from '@ionic/react'

import {DeviceInfo, DeviceInfoRank} from "../../contract/epoch/sero/types";
import "./DeviceRank.scss"
import * as utils from "../../utils";
import ModifyName from "./ModifyName";
import BigNumber from "bignumber.js";
import CardTransform from "../CardTransform";
import {NftInfo} from "../../types";
import EpochAttribute from "../EpochAttribute";
import {createOutline, star} from "ionicons/icons";

interface State{
    showModal:boolean
    showModify:boolean
    selectDevice?:DeviceInfo
    selectNFT?:NftInfo
}

interface Props{
    devices:Array<DeviceInfoRank>
    position?:number
    ticket?:string
}

class DeviceRank extends React.Component<Props, State>{

    state:State = {
        showModal:false,
        showModify:false
    }

    componentDidMount() {


    }

    setShowModal = (f:boolean,v?:DeviceInfoRank)=>{
        if(v){
            const info = utils.convertDeviceRankInfoToNFTInfo(v);
            this.setState({
                showModal:f,
                selectDevice:utils.toDevice(v),
                selectNFT:info
            })
        }else {
            this.setState({
                showModal:f,
            })
        }

    }

    setShowModify = (f:boolean,v?:DeviceInfoRank)=>{
        if(v){
            this.setState({
                showModify:f,
                selectDevice:utils.toDevice(v),
            })
        }else{
            this.setState({
                showModify:f,
            })
        }
    }

    render() {
        const {showModal,showModify,selectDevice,selectNFT} = this.state;
        const {devices,position,ticket} = this.props;

        let precate = 0;
        if(devices){
            for(let dr of devices){
                precate++
                if(dr.ticket == ticket){
                    break
                }
            }
        }
        let plusFlag = false;
        let index = 0;
        return <>
            <div className="device-box">
                <div className="rank-text">
                    {position?"MY RANKING":"TOP 10"}
                </div>
                <div className="device-list device-list-h1">
                    {
                        devices && devices.map((v,i:number)=>{
                            if(position){
                                if(v.ticket == ticket){
                                    plusFlag = true
                                    index = position-1
                                }else{
                                    if(plusFlag){
                                        index = index+1;
                                    }else{
                                        index = position - precate + i;
                                    }
                                }
                            }else{
                                index = i;
                            }

                            return <IonItem lines="none" color={ticket == v.ticket ?"warning":""} className="device-item" detail={true} detailIcon="chevron-forward" onClick={(e)=>{
                                e.stopPropagation();
                                this.setShowModal(true,v)
                            }} >
                                {index==0 && <IonAvatar slot="start" className="device-rank-avatar"><img src="./assets/img/epoch/top1.png"/></IonAvatar>}
                                {index==1 && <IonAvatar slot="start" className="device-rank-avatar"><img src="./assets/img/epoch/top2.png" /></IonAvatar>}
                                {index==2 && <IonAvatar slot="start" className="device-rank-avatar"><img src="./assets/img/epoch/top3.png" /></IonAvatar>}
                                {index>2 && <IonAvatar slot="start" className="device-rank-avatar"><div className="rank-digital">{index+1}</div></IonAvatar>}
                                <IonAvatar slot="start" className="device-rank-avatar">
                                    <div className={utils.isDark(v.gene)?"dark-element-bg":"light-element-bg"} style={{borderRadius:"5px",border:"1px solid #ddd"}}>
                                        <img src={`./assets/img/epoch/device/${utils.calcStyle(v.gene).style}.png`}  />
                                    </div>
                                </IonAvatar>
                                {/*<EpochAttribute showDevice={true} showDriver={false} device={this.toDevice()}/>*/}

                                <IonLabel className="ion-text-wrap">
                                    {utils.isMyDevice("EMIT_AX",v.ticket) && <IonIcon src={createOutline} size="small" onClick={(e)=>{
                                        e.stopPropagation();
                                        this.setShowModify(true,v)
                                    }}/>}<span className="overflow-cst">{v.name?v.name:utils.ellipsisStr(v.ticket)}</span>
                                    <IonProgressBar className="progress-background" value ={utils.fromValue(v.rate,18).toNumber()}/>
                                    <div>
                                        <div>
                                            <div style={{textAlign:"left"}}>
                                                {utils.renderDarkStar(v.gene).map(v=>{
                                                    return <IonIcon src={star} className="dark-star"/>
                                                })}
                                            </div>
                                        </div>
                                        <div style={{textAlign: "right"}}  className="overflow-cst">
                                            <IonText color="dark" className="text-little">{utils.fromValue(v.rate,16).toFixed(2,1)}%</IonText>
                                        </div>
                                    </div>
                                </IonLabel>

                            </IonItem>
                        })
                    }
                </div>
            </div>

            <ModifyName show={showModify} device={selectDevice} onDidDismiss={(f)=>this.setShowModify(f)} defaultName={""}/>

            <IonModal
                isOpen={showModal}
                cssClass='epoch-rank-modal'
                swipeToClose={true}
                onDidDismiss={() => this.setShowModal(false)}>
                {
                    selectNFT && <CardTransform info={selectNFT} hideButton={true}/>
                }
            </IonModal>
        </>;
    }
}

export default DeviceRank