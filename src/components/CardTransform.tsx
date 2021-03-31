import * as React from 'react';
import {IonButton, IonCol, IonGrid, IonProgressBar, IonRow, IonText} from '@ionic/react'

import "./CardTransform.scss"
import url from "../utils/url";
import {ChainType} from "../types";
import epochService from "../contract/epoch/sero";
import walletWorker from "../worker/walletWorker";
import * as utils from "../utils"
import {DeviceInfo} from "../contract/epoch/sero/types";
import EpochAttribute from "./EpochAttribute";

interface Props {
    src: string
    title: string
    subTitle: string
    chain: string
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
                                        <div className="font-sm">Chain</div>
                                        <div className="font-md">{chain}</div>
                                    </IonCol>
                                    <IonCol className="col-line">
                                        <div className="font-sm">Symbol</div>
                                        <div className="font-md">{utils.getCategoryBySymbol(symbol,chain+"")}</div>
                                    </IonCol>
                                    {
                                        device && utils.isDark(device.gene) &&
                                        <IonCol className="col-line">
                                            <div className="font-sm">DARK Rate</div>
                                            <div className="font-md">{utils.calcDark(device.gene)}</div>
                                        </IonCol>
                                    }
                                </IonRow>
                                <IonRow className="row-line" style={{minHeight:"14vh"}}>
                                    <IonCol className="col-line">
                                        { device ?
                                            <EpochAttribute device={device} showDevice={true} showDriver={false}/>
                                            :
                                            description
                                        }
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </div>
                    </div>
                </div>
                <div className="card-foo">
                    <p><IonText>{title}</IonText></p>
                    <IonGrid>
                        <IonRow>
                            <IonCol size="6">
                                <IonButton mode="ios" fill="outline" expand="block" size="small"  onClick={()=>{
                                    url.tunnelNFT(symbol,utils.getChainIdByName(chain),subTitle)
                                }}>CROSS</IonButton>
                            </IonCol>
                            <IonCol size="6">
                                <IonButton mode="ios" fill="outline" expand="block" size="small" onClick={() => {
                                    url.transferNFT(symbol,utils.getChainIdByName(chain),subTitle)
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