import * as React from 'react';
import {
    IonAvatar,
    IonIcon,
    IonItem,
    IonLabel, IonInfiniteScroll, IonInfiniteScrollContent,
    IonModal, IonList,
    IonProgressBar,
    IonText, IonButton
} from '@ionic/react'

import {DriverInfo, DriverInfoRank, PositionDriverInfoRank} from "../../contract/epoch/sero/types";
import "./DeviceRank.scss"
import * as utils from "../../utils";
import {createOutline} from "ionicons/icons";
import ModifyName from "./ModifyName";
import BigNumber from "bignumber.js";
import {MinerScenes} from "../../pages/epoch/miner";

interface State{
    showModal:boolean
    showModify:boolean
    selectDriver?:DriverInfo
    scenes:MinerScenes
}

interface Props{
    drivers: Array<DriverInfoRank>
    myDriversRank?:PositionDriverInfoRank
    mainPKr:string
    loadMore?:(e?:any)=>void;
    pageSize:number
    position?:number
}

class DriverRank extends React.Component<Props, State>{

    state:State = {
        showModal:false,
        showModify:false,
        scenes:MinerScenes.altar
    }

    componentDidMount() {

    }

    setShowModal = (f:boolean)=>{
        this.setState({
            showModal:f
        })
    }

    setShowModify = (f:boolean,v:DriverInfoRank|null)=>{
        if(v){
            this.setState({
                showModify:f,
                selectDriver:{
                    name: v.name,
                    base: new BigNumber(v.base).toNumber(),
                    capacity: new BigNumber(v.capacity).toNumber(),
                    rate: v.rate,
                    gene: v.gene,
                    alis:v.name,
                },
                scenes:v.scenes
            })
        }else {
            this.setState({
                showModify:f,
            })
        }

    }

    render() {
        const {showModal,showModify,selectDriver,scenes} = this.state;
        const {drivers,myDriversRank,mainPKr,pageSize,position} = this.props;

        let precate = 0;
        if(drivers && position){
            for(let dr of drivers){
                precate++
                if(dr.owner == mainPKr){
                    break
                }
            }
        }
        let plusFlag = false;
        let index = 0;
        return <>
            {
                drivers && !position && <div className="device-box">
                    <div className="rank-text">
                        TOP {pageSize}
                    </div>
                    <div className="device-list device-list-h3">
                        { drivers.map((v,i:number)=>{
                            return <IonItem lines="none" className="device-item" color={v.owner == mainPKr?"warning":""}>
                                {i==0 && <IonAvatar slot="start" className="device-rank-avatar"><img src="./assets/img/epoch/top1.png" /></IonAvatar>}
                                {i==1 && <IonAvatar slot="start" className="device-rank-avatar"><img src="./assets/img/epoch/top2.png" /></IonAvatar>}
                                {i==2 && <IonAvatar slot="start" className="device-rank-avatar"><img src="./assets/img/epoch/top3.png" /></IonAvatar>}
                                {i>2 && <IonAvatar slot="start" className="device-rank-avatar"><div className="rank-digital">{(i+1)}</div></IonAvatar>}

                                <IonLabel className="ion-text-wrap">

                                    {v.owner == mainPKr && <IonIcon src={createOutline} size="small" onClick={(e)=>{
                                        e.stopPropagation()
                                        this.setShowModify(true,v)
                                    }}/>}<span className="overflow-cst">{v.name?v.name:utils.ellipsisStr(v.owner)}</span>
                                    <IonProgressBar className="progress-background" value={utils.fromValue(v.rate,18).toNumber()}/>
                                    <div style={{textAlign: "right"}}  className="overflow-cst">
                                        <IonText color="dark" className="text-little">{utils.fromValue(v.rate,16).toFixed(2,1)}%</IonText>
                                    </div>
                                </IonLabel>

                            </IonItem>
                        })
                        }

                    </div>
                </div>
            }
            {
                drivers && position &&
                <div className="device-box">
                    <div className="rank-text">
                        MY RANKING
                    </div>
                    <IonList className="device-list device-list-h2">
                        {
                            drivers.map((v:DriverInfoRank,i:number)=>{
                                if(v.owner == mainPKr){
                                    plusFlag = true
                                    index = position-1
                                }else{
                                    if(plusFlag){
                                        index = index+1;
                                    }else{
                                        index = position - precate + i;
                                    }
                                }
                                return <IonItem lines="none" className="device-item" color={v.owner == mainPKr ?"warning":""} >
                                    {index==0 && <IonAvatar slot="start" className="device-rank-avatar"><img src="./assets/img/epoch/top1.png" /></IonAvatar>}
                                    {index==1 && <IonAvatar slot="start" className="device-rank-avatar"><img src="./assets/img/epoch/top2.png" /></IonAvatar>}
                                    {index==2 && <IonAvatar slot="start" className="device-rank-avatar"><img src="./assets/img/epoch/top3.png" /></IonAvatar>}
                                    {index>2 && <IonAvatar slot="start" className="device-rank-avatar"><div className="rank-digital">{(index+1)}</div></IonAvatar>}

                                    <IonLabel className="ion-text-wrap">

                                        {v.owner == mainPKr && <IonIcon src={createOutline} size="small" onClick={(e)=>{
                                            e.stopPropagation()
                                            this.setShowModify(true,v)
                                        }}/>}<span className="overflow-cst">{v.name?v.name:utils.ellipsisStr(v.owner)}</span>
                                        <IonProgressBar className="progress-background" value={utils.fromValue(v.rate,18).toNumber()}/>
                                        <div style={{textAlign: "right"}}  className="overflow-cst">
                                            <IonText color="dark" className="text-little">{utils.fromValue(v.rate,16).toFixed(2,1)}%</IonText>
                                        </div>
                                    </IonLabel>
                                </IonItem>
                            })
                        }
                        {
                            drivers && drivers.length == 10 && <div>
                                <IonButton expand="block" color="light" fill="outline" mode="ios" onClick={()=>{
                                    // @ts-ignore
                                    this.props.loadMore()
                                }}>SHOW TOP 100</IonButton>
                            </div>
                        }
                    </IonList>

                </div>
            }

            <IonInfiniteScroll  threshold="50%"  onIonInfinite={(e)=> {
                this.props.loadMore&&this.props.loadMore(e)
            }}>
                <IonInfiniteScrollContent
                    loadingSpinner="bubbles"
                    loadingText="Loading more data..."
                >
                </IonInfiniteScrollContent>
            </IonInfiniteScroll>
            <ModifyName show={showModify} driver={selectDriver} scenes={scenes}  onDidDismiss={(f)=>this.setShowModify(f,null)} defaultName={selectDriver && selectDriver.alis}/>

            <IonModal
                mode="ios"
                isOpen={showModal}
                cssClass='epoch-rank-modal'
                onDidDismiss={() => this.setShowModal(false)}>

                {/*<CardTransform src={"./assets/img/axe.png"} title={"EMIT_AX"}*/}
                {/*               subTitle={"0x11dc88c7d4ccd27ee60ae2f0ec737db0e5eb68157e015a7f472d61d9c8a00447"}*/}
                {/*               chain={"SERO"}*/}
                {/*               timestamp={Date.now()}*/}
                {/*               description={"1111"}*/}
                {/*               dna={utils.getAddressBySymbol("DEVICES","SERO")}*/}
                {/*               symbol={"DEVICES"}/>*/}

            </IonModal>
        </>;
    }
}

export default DriverRank