import * as React from 'react';
import {IonButton, IonCol, IonGrid, IonProgressBar, IonRow, IonText} from '@ionic/react'

import "./CardTransform.scss"
import url from "../utils/url";
import {ChainType} from "../types";
import epochService from "../contract/epoch/sero";
import walletWorker from "../worker/walletWorker";
import * as utils from "../utils"
import {MinerScenes} from "../pages/epoch/miner";
import {DeviceInfo} from "../contract/epoch/sero/types";

interface Props {
    src: string
    title: string
    subTitle: string
    chain: ChainType
    timestamp: number
    description: string
    dna: string
    symbol:string
}

interface State {
    deg:number
    device?: DeviceInfo
}

class CardTransform extends React.Component<Props, State> {

    state: State = {
        deg:0
    }

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        this.init().catch();
            this.setState({
                deg:0
            })
    }

    init = async ()=>{
        const {symbol,subTitle} = this.props
        const account = await walletWorker.accountInfo();
        if(symbol == "DEVICES"){
            const device = await epochService.axInfo(utils.getCategoryBySymbol(symbol,ChainType[ChainType.SERO]),subTitle,account.addresses[ChainType.SERO])
            console.log("device",device)
            this.setState({
                device:device
            })
        }else {
            this.setState({
                device:undefined,
            })
        }
        // else if(symbol == "DRIVER"){
        //     const altarUserInfo = await epochService.userInfo(MinerScenes.altar, account.addresses[ChainType.SERO])
        //     const chaosUserInfo = await epochService.userInfo(MinerScenes.chaos, account.addresses[ChainType.SERO])
        // }
    }

    change = ()=>{
        let {deg} = this.state;
        if(deg == 0 ){
            deg = 180;
        }else{
            deg = 0 ;
        }
        this.setState({
            deg:deg
        })
        this.init().catch(e=>{
            console.log(e)
        })
        // const d:any = document.getElementsByClassName("card-display")[0];
        // console.log(d);
        // d.style.transform = "transform: rotateY(0deg);"
    }

    render() {
        const {deg,device} = this.state;
        const {src, title, subTitle, chain, timestamp, description,dna,symbol} = this.props;
        return <>
            <div className="n-card">
                <div className="card-display" style={{transform: `rotateY(${deg}deg)`}} onClick={()=>{
                    this.change()
                }}>
                    <div className="card-front">
                        <img src={src}/>
                    </div>
                    <div className="card-back">
                        <img src={src}/>
                        <div className="card-back-f">
                            <IonGrid>
                                <IonRow className="row-line">
                                    <IonCol className="col-line">
                                        <h3>{title}</h3>
                                        <p><IonText>{subTitle}</IonText></p>
                                    </IonCol>
                                </IonRow>
                                <IonRow className="row-line">
                                    <IonCol className="col-line">
                                        <div>Chain</div>
                                        <div>{chain}</div>
                                    </IonCol>
                                    <IonCol className="col-line">
                                        <div>Year</div>
                                        <div>{new Date(timestamp).getFullYear()}</div>
                                    </IonCol>
                                </IonRow>
                                <IonRow className="row-line">
                                    <IonCol className="col-line">
                                        <div>
                                            <IonText>
                                                { device ? <div className="progress">
                                                    <div>
                                                        <IonRow>
                                                            <IonCol size="4">
                                                                <IonText color="white" className="text-little">AEX</IonText>
                                                            </IonCol>
                                                            <IonCol style={{textAlign: "right"}} size="8">
                                                                <IonText color="white" className="text-little">Rate:{utils.getDeviceLv(device && device.rate)}%</IonText><br/>
                                                            </IonCol>
                                                        </IonRow>
                                                    </div>
                                                    <IonProgressBar className="progress-background" value={device && (device.capacity ? device.power / device.capacity : 0)}/>
                                                    <div style={{textAlign: "right"}}>
                                                        <IonText color="white" className="text-little">{device && `${utils.fromValue(device.power,16).toFixed(0,1)}/${utils.fromValue(device.capacity,16).toFixed(0,1)}`}</IonText>
                                                    </div>
                                                </div>:description}
                                            </IonText>
                                        </div>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </div>
                    </div>
                </div>
                <div className="card-foo">
                    <p><IonText color="light">{title}</IonText></p>
                    <IonGrid>
                        <IonRow>
                            <IonCol size="6">
                                <IonButton color="light" mode="ios" fill="outline" expand="block" size="small"  onClick={()=>{
                                    url.tunnelNFT(symbol,chain,subTitle)
                                }}>CROSS</IonButton>
                            </IonCol>
                            <IonCol size="6">
                                <IonButton color="light" mode="ios" fill="outline" expand="block" size="small" onClick={() => {
                                    url.transferNFT(symbol,chain,subTitle)
                                }}>Transfer</IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
            </div>

        </>;
    }
}

export default CardTransform