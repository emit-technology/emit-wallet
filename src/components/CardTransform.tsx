import * as React from 'react';
import {IonButton, IonCol, IonGrid, IonIcon, IonChip,IonLabel, IonProgressBar, IonRow, IonText, IonToast} from '@ionic/react'

import "./CardTransform.scss"
import url from "../utils/url";
import {ChainType, NftInfo} from "../types";
import * as utils from "../utils"
import {DeviceInfo, DeviceInfoRank} from "../contract/epoch/sero/types";
import EpochAttribute from "./EpochAttribute";
import i18n from "../locales/i18n";
import copy from 'copy-to-clipboard';
import {
    bookmarkOutline,
    buildOutline, colorWandOutline,
    constructOutline,
    copyOutline,
    createOutline,
    hammerOutline,
    restaurantOutline, ribbonOutline, rocketOutline
} from "ionicons/icons";
import ModifyName from "./epoch/ModifyName";
import {DeviceCategory} from "../utils/device-style";

interface Props {
    info:NftInfo

    hideButton?:boolean
    defaultTranslate?:boolean
}

interface State {
    deg:number
    device?: DeviceInfo
    showToast:boolean
    showModify:boolean
}

class CardTransform extends React.Component<Props, State> {

    state: State = {
        deg:0,
        showToast:false,
        showModify:false,
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
        const {info} = this.props
        // const account = await walletWorker.accountInfo();
        if(info.symbol == "DEVICES"){
            // const device = await epochService.axInfo(utils.getCategoryBySymbol(symbol,ChainType[ChainType.SERO]),subTitle,account.addresses[ChainType.SERO])
            // device.alis = await epochNameService.getDeviceName(device.ticket)
            this.setState({
                device:info.meta.attributes
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

    setShowModify = (f:boolean)=>{
        this.setState({
            showModify:f
        })
    }

    reColor = (v:string)=>{
        const keys = Object.keys(DeviceCategory)
        if(v == keys[3]){
            return "success"
        }else if(v == keys[2]){
            return "primary"
        }else if(v == keys[1]){
            return "tertiary"
        }else if(v == keys[0]){
            return "dark"
        }
    }

    reIcon = (v:string)=>{
        const keys = Object.keys(DeviceCategory)
        if(v == keys[3]){
            return bookmarkOutline
        }else if(v == keys[2]){
            return colorWandOutline
        }else if(v == keys[1]){
            return constructOutline
        }else if(v == keys[0]){
            return ribbonOutline
        }
    }

    render() {
        const {deg,device,showToast,showModify} = this.state;
        const {info,hideButton,defaultTranslate} = this.props;
        const cardBackground = device && device.gene ? utils.isDark(device.gene) ?"dark-element-bg":"light-element-bg":"";
        return <>
            <div className="n-card">
                <div className="card-display" style={{transform: `rotateY(${deg}deg)`}} onClick={(e)=>{
                    e.stopPropagation();
                    this.change()
                }}>
                    <div className={`card-front ${cardBackground}`}>
                        <img src={info.meta.image} style={{width:"100vw",maxWidth:"600px"}}/>
                    </div>
                    <div className={`card-back ${cardBackground}`}>
                        <img src={info.meta.image} style={{width:"100vw",maxWidth:"600px"}}/>
                        <div className="card-back-f">
                            <IonGrid>
                                <IonRow className="row-line">
                                    <IonCol className="col-line">
                                        <h3>{info.meta.name}</h3>
                                        <div ><IonText>{info.tokenId}</IonText><div><IonIcon src={copyOutline} size="small" onClick={(e:any)=>{
                                            e.stopPropagation();
                                            copy(info.tokenId)
                                            copy(info.tokenId)
                                            this.setState({
                                                showToast:true
                                            })
                                        }}/></div></div>
                                    </IonCol>
                                </IonRow>
                                <IonRow className="row-line">
                                    <IonCol className="col-line">
                                        <div className="font-sm">{i18n.t("chain")}</div>
                                        <div className="font-md">{ChainType[info.chain]}</div>
                                    </IonCol>
                                    <IonCol className="col-line">
                                        <div className="font-sm">{i18n.t("symbol")}</div>
                                        <div className="font-md">{info.category}</div>
                                    </IonCol>
                                    {
                                        device && utils.isDark(device.gene) &&
                                        <IonCol className="col-line">
                                            <div className="font-sm">DARK {i18n.t("rate")}</div>
                                            <div className="font-md">{utils.calcDark(device.gene)*100/4}%</div>
                                        </IonCol>
                                    }
                                </IonRow>

                                <IonRow className="row-line" style={{minHeight:"100px"}}>
                                    <IonCol className="col-line">
                                        { device ?
                                            <EpochAttribute device={device} showDevice={true} showDriver={false} hiddenButton={hideButton}/>
                                            :
                                            info.meta.description
                                        }
                                    </IonCol>
                                </IonRow>
                                {
                                    device && device.gene && device.gene != "0x0000000000000000000000000000000000000000000000000000000000000000"
                                    && <IonRow className="row-line" style={{minHeight:"120px"}}>
                                        <IonCol>
                                            <h6>DNA</h6>
                                            <div>
                                                <IonText>{device.gene}</IonText>
                                                <div>
                                                    <IonIcon src={copyOutline} size="small"  onClick={(e:any)=>{
                                                        e.stopPropagation();
                                                        copy(device.gene)
                                                        copy(device.gene)
                                                        this.setState({
                                                            showToast:true
                                                        })
                                                    }}/>
                                                </div>
                                            </div>
                                        </IonCol>
                                    </IonRow>
                                }

                            </IonGrid>
                        </div>
                    </div>
                </div>
                <div className="card-foo">
                    <div>
                        <h5>{info.meta.name} &nbsp;&nbsp;</h5>
                        <p>
                            <IonText>({device && device.alis?device.alis:utils.ellipsisStr(info.tokenId)}) {info.symbol == "DEVICES" && !hideButton && <IonIcon src={createOutline} size="medium" color="dark"   onClick={(e)=>{
                                e.stopPropagation();
                                this.setShowModify(true)
                            }}/>}
                            </IonText>
                        </p>
                        {
                            device && device.mode && device.mode.category &&
                            <p>
                                <IonChip color={this.reColor(device.mode.category)}>
                                    <IonIcon src={this.reIcon(device.mode.category)}/>
                                    <IonLabel>{device.mode && device.mode.category.toUpperCase()}</IonLabel>
                                </IonChip>
                            </p>
                        }
                    </div>
                    {
                        !hideButton && <IonGrid>
                            <IonRow>
                                {
                                    utils.crossAbleBySymbol(info.symbol) &&
                                    <IonCol>
                                        <IonButton mode="ios" fill="outline" expand="block" size="small"  onClick={()=>{
                                            url.tunnelNFT(info.symbol,info.chain,info.tokenId)
                                        }}>{i18n.t("cross")}</IonButton>
                                    </IonCol>
                                }

                                <IonCol>
                                    <IonButton mode="ios" fill="outline" expand="block" size="small" onClick={() => {
                                        url.transferNFT(info.symbol,info.chain,info.tokenId)
                                    }}>{i18n.t("transfer")}</IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    }
                </div>
            </div>
            <ModifyName show={showModify} device={device} onDidDismiss={(f)=>this.setShowModify(f)} defaultName={device?.alis}/>
            <IonToast
                color="dark"
                position="top"
                isOpen={showToast}
                onDidDismiss={() => this.setState({showToast:false})}
                message="Copied to clipboard!"
                duration={1000}
                mode="ios"
            />
        </>;
    }
}

export default CardTransform