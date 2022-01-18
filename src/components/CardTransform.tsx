import * as React from 'react';
import {
    IonBadge,
    IonButton,
    IonCol,
    IonGrid,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonPopover,
    IonRow,
    IonText,
    IonToast
} from '@ionic/react'

import "./CardTransform.scss"
import url from "../utils/url";
import {ChainType, Counter, NftInfo, StarGridType} from "../types";
import * as utils from "../utils"
import {DeviceInfo, WrappedDevice} from "../contract/epoch/sero/types";
import EpochAttribute from "./EpochAttribute";
import i18n from "../locales/i18n";
import copy from 'copy-to-clipboard';
import {arrowForwardOutline, chevronForwardOutline, copyOutline, createOutline,} from "ionicons/icons";
import ModifyName from "./epoch/ModifyName";
import BigNumber from "bignumber.js";
import {BRIDGE_NFT} from "../config";
import CounterAttribute from "./epoch/CounterAttribute";
import CounterSvg from "../pages/epoch/starGrid/counter-svg";
import HexInfoCard from "../pages/epoch/starGrid/hex-info";

interface Props {
    info:NftInfo

    hideButton?:boolean
    defaultTranslate?:boolean
    showSimple?:boolean
    // wrappedDevice?:WrappedDevice
}

interface State {
    deg:number
    showToast:boolean
    showModify:boolean
    crossArray:Array<string>
    popoverState:any
}

class CardTransform extends React.Component<Props, State> {

    state: State = {
        deg:0,
        showToast:false,
        showModify:false,
        crossArray:[],
        popoverState:""
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
    }

    setShowModify = (f:boolean)=>{
        this.setState({
            showModify:f
        })
    }

    setShowPopover = (symbol:string,e:any,f:boolean,tokenId:any)=>{
        const crossArray: Array<string> = Object.keys(BRIDGE_NFT[symbol])
        const ret:any = {};
        ret[tokenId] = {
            event:e,
            showPopover:f
        }
        this.setState({
            crossArray:crossArray,
            popoverState: ret
        })
    }

    renderDeviceInfo = ()=>{
        const {info,hideButton,showSimple} = this.props;
        let device:DeviceInfo | undefined;
        if(info.symbol == "DEVICES" || info.symbol == "WRAPPED_DEVICES"){
            device=info.meta.attributes
        }
        const cardBackground = device && device.gene ? utils.isDark(device.gene) ?"dark-element-bg":"light-element-bg":"";

        const cardDesc = <div>
            <div className={`${cardBackground} pd-35`}>
                <img src={info.meta.image}/>
            </div>
            <div>
                <div className={`card-desc-${device && device.gene ? utils.isDark(device.gene) ? "dark":"light":"default" }`}>
                    <div>
                        {!showSimple && <span style={{fontSize:"16px",fontWeight:600}}>{info.meta.name} &nbsp;&nbsp;</span>}
                        {
                            !showSimple &&
                            <div style={{marginTop:"12px"}}>
                                <IonText>({device && device.alis?device.alis:utils.ellipsisStr(info.tokenId)}) {info.symbol == "DEVICES" && !hideButton && <IonIcon src={createOutline} size="medium" color="light"   onClick={(e)=>{
                                    e.stopPropagation();
                                    this.setShowModify(true)
                                }}/>}
                                </IonText>
                            </div>
                        }
                        {
                            device && device.mode && device.mode.category &&
                            <div style={{padding:"12px 0"}}>
                                <IonBadge mode="ios" color={utils.reColor(device.mode.category)}>
                                    <IonIcon src={utils.reIcon(device.mode.category)}/>&nbsp;
                                    <IonLabel className="font-weight-800">{device.mode && device.mode.category=="normal"?"BLANK":device.mode.category.toUpperCase()}</IonLabel>
                                </IonBadge>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
        return cardDesc;
    }

    renderCounterInfo = ()=>{
        const {info,hideButton,showSimple} = this.props;
        let counter:Counter | undefined = info.meta.attributes;
        // if(counter){
        //     const isEarth = counter.typ == StarGridType.EARTH;
        //     let img = counter && isEarth ?"black":"white";
        //     const bg = calcCounterRgb(Math.floor(utils.fromValue(counter.rate,16).toNumber()),isEarth);
        //     if(counter.accumulated && new BigNumber(counter.accumulated).toNumber()>0){
        //         img = `./assets/img/epoch/stargrid/piece/${img}Sword`;
        //     }
        // }
        const cardDesc = <div>
            <div className={`pd-35`}>
                {/*<img src={info.meta.image}/>*/}
                <CounterSvg counter={counter}/>
            </div>
            <div>
                <div className={`card-desc-default`}>
                    <div>
                        {!showSimple && <span style={{fontSize:"16px",fontWeight:600}}>{info.meta.name} &nbsp;&nbsp;</span>}
                        <div style={{marginTop:"12px"}}>
                            <IonText>({utils.ellipsisStr(info.tokenId)})</IonText>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        return cardDesc;
    }

    renderStar = (num:number)=>{
        const starElement = [];
        for(let i=1;i<=num;i++){
            starElement.push(<div className="nft-mkt-axe"><img src={`./assets/img/epoch/remains/device/star/${i}.png`}/></div>)
        }
        return starElement;
    }

    renderWrappedDeviceInfo = ()=>{
        const {info,showSimple} = this.props;
        if(!info.meta.attributes){
            return <></>
        }
        let device:DeviceInfo = utils.convertWrappedDeviceToDevice(info.meta.attributes);
        // const mode = utils.calcStyle(device.gene)
        const isDark = device && device.gene && utils.isDark(device.gene);
        const isGenis = device&&device.mode && device.mode.style == "ax";
        const stylePath = isDark?"dark":"light";
        const bgImg = isGenis?"./assets/img/epoch/remains/device/ax.png":!isDark ? "./assets/img/epoch/remains/device/light_bg.png" : "./assets/img/epoch/remains/device/dark_bg.png";
        const cardDesc = <div>
            <div className="box-center">
                {device &&
                <div className="nft-mkt-box">
                    <div className="nft-mkt-card">
                        <div>
                            <img src={bgImg}/>
                        </div>
                        <div className="nft-mkt-axe">
                            {info.meta.image && <img src={info.meta.image}/>}
                        </div>
                        <div className="nft-mkt-axe">
                            <img src={device && device.mode && `./assets/img/epoch/remains/tag/${stylePath}/${device&&device.mode.category}.png`}/>
                        </div>
                        {/*<div className="nft-card-name" style={{color:isDark?"#deae35":"#5b451a"}}>*/}
                        {/*    {info.meta&&info.meta.alis ?info.meta.alis:`${device.ticket.slice(0,6)}...`}*/}
                        {/*</div>*/}
                        {isDark && utils.calcDark(device.gene)>0 && this.renderStar(utils.calcDark(device.gene))}

                        {
                            !showSimple &&
                            <div className="nft-card-name" style={{color:"#5b451a"}}>
                                <div>{info.meta&&info.meta.alis?info.meta.alis:utils.ellipsisStr(info.tokenId,5)}</div>

                            </div>
                        }
                    </div>
                    {!showSimple&&<div style={{position:"absolute",right:"0",writingMode:"vertical-rl",opacity: 0.8}}>
                        {info.chain == ChainType.BSC ?<img src={require("../img/BSC.png")} width="48px"/>:info.chain==ChainType.ETH?<img src={require("../img/ETH.png")} width="48px"/>:<img src={require("../img/SERO.png")} width="48px"/>}
                    </div>}
                </div>
                }
            </div>
        </div>
        return cardDesc;
    }

    render() {
        const {deg,showToast,showModify,popoverState} = this.state;
        const {info,hideButton,showSimple} = this.props;
        let device:DeviceInfo | undefined;
        let wrappedDevice:WrappedDevice | undefined;
        let counter:Counter | undefined;
        let  cardDesc = this.renderDeviceInfo();
        if(info.symbol == "DEVICES"){
            device=info.meta.attributes
            // cardDesc = this.renderDeviceInfo();
        }else if(info.symbol == "WRAPPED_DEVICES"){
            wrappedDevice = info.meta.attributes;
            if(wrappedDevice){
                device = utils.convertWrappedDeviceToDevice(wrappedDevice)
            }
            cardDesc = this.renderWrappedDeviceInfo();
        }else if(info.symbol == "COUNTER"){
            counter = info.meta.attributes;
            cardDesc = this.renderCounterInfo();
        }

        return <>
            <div>
                <div className="n-card">
                    <div className="card-display box-center" style={{transform: `rotateY(${deg}deg)`}} onClick={(e)=>{
                        if(!showSimple){
                            e.stopPropagation();
                            this.change()
                        }
                    }}>
                        <div className="card-front ">
                            {cardDesc}
                        </div>
                        <div className={`card-back`}>
                            <div>
                                {cardDesc}
                            </div>
                            <div className="card-back-f">
                                <IonGrid>
                                    <IonRow className="row-line">
                                        <IonCol className="col-line">
                                            <h3>{info.meta.name}</h3>
                                            <div ><IonText>{utils.ellipsisStr(info.tokenId)}</IonText><div><IonIcon src={copyOutline} size="small" onClick={(e:any)=>{
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
                                        {
                                            counter && <IonCol className="col-line">
                                                <div className="font-sm">TYPE</div>
                                                <div className="font-md">{StarGridType[counter.enType]}</div>
                                            </IonCol>
                                        }
                                    </IonRow>

                                    <IonRow className="row-line" style={{minHeight:"100px"}}>
                                        <IonCol className="col-line">
                                            { device ?
                                                <EpochAttribute device={device} showDevice={true} showDriver={false} hiddenButton={hideButton}/>
                                                :
                                                counter ?
                                                    <>
                                                        {/*<CounterAttribute counter={counter}/>*/}
                                                        <HexInfoCard sourceHexInfo={{counter:counter}} />
                                                    </>:
                                                info.meta.description
                                            }
                                        </IonCol>
                                    </IonRow>
                                    {
                                        wrappedDevice && <IonRow className="row-line">
                                            <IonCol className="col-line">
                                                <div style={{fontWeight:600,fontSize:"16px"}}>{i18n.t("seal")} {i18n.t("info")}</div>
                                                <IonRow className="row-line">
                                                    <IonCol className="col-line" size="6">
                                                        <div className="font-sm">{i18n.t("Seal Period")}</div>
                                                        <div className="font-md">{wrappedDevice.freezeStartPeriod}</div>
                                                    </IonCol>
                                                    <IonCol className="col-line" size="6">
                                                        <div className="font-sm">{i18n.t("Seal Fee")}</div>
                                                        <div className="font-md">{utils.nFormatter(utils.fromValue(wrappedDevice.freezeFee,18).toNumber(),4)} <small>LIGHT/Period</small></div>
                                                    </IonCol>
                                                    <IonCol className="col-line" size="6">
                                                        <div className="font-sm">{i18n.t("Current Period")}</div>
                                                        <div className="font-md">{wrappedDevice.current}</div>
                                                    </IonCol>
                                                    <IonCol className="col-line" size="6">
                                                        <div className="font-sm">{i18n.t("Total Fee")}</div>
                                                        <div className="font-md">{utils.nFormatter(utils.fromValue(wrappedDevice.freezeFee,18)
                                                            .multipliedBy(
                                                                new BigNumber(wrappedDevice.current).plus(1).minus(new BigNumber(wrappedDevice.freezeStartPeriod)
                                                                )).toNumber(),4)}</div>
                                                    </IonCol>
                                                </IonRow>
                                            </IonCol>
                                        </IonRow>
                                    }
                                    {
                                        device && device.gene && device.gene != "0x0000000000000000000000000000000000000000000000000000000000000000"
                                        && <IonRow className="row-line">
                                            <IonCol className="col-line">
                                                <div style={{fontWeight:600,fontSize:"16px"}}>DNA</div>
                                                <div>
                                                    <IonText>{utils.ellipsisStr(device.gene)}</IonText>
                                                    <div>
                                                        <IonIcon src={copyOutline} size="small"  onClick={(e:any)=>{
                                                            e.stopPropagation();
                                                            device && copy(device.gene);
                                                            device && copy(device.gene);
                                                            this.setState({
                                                                showToast:true
                                                            })
                                                        }}/>
                                                    </div>
                                                </div>
                                            </IonCol>
                                        </IonRow>
                                    }
                                    {
                                        counter && counter.gene && counter.gene != "0x0000000000000000000000000000000000000000000000000000000000000000"
                                        && <IonRow className="row-line">
                                            <IonCol className="col-line">
                                                <div style={{fontWeight:600,fontSize:"16px"}}>DNA</div>
                                                <div>
                                                    <IonText>{utils.ellipsisStr(counter.gene)}</IonText>
                                                    <div>
                                                        <IonIcon src={copyOutline} size="small"  onClick={(e:any)=>{
                                                            e.stopPropagation();
                                                            counter && copy(counter.gene);
                                                            counter && copy(counter.gene);
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
                </div>

                <div>
                    {
                        !hideButton && <IonGrid>
                            <IonRow>
                                {
                                    utils.crossAbleBySymbol(info.symbol) &&
                                    <IonCol>
                                        <IonButton size="small" fill="outline" expand="block" mode="ios" onClick={(e:any) => {
                                            e.persist();
                                            this.setShowPopover(info.symbol,e,true,info.tokenId);
                                            e.stopPropagation();
                                        }} >{i18n.t("cross")}
                                        </IonButton>
                                        <IonPopover
                                            mode="ios"
                                            cssClass='my-custom-class'
                                            event={popoverState[info.tokenId] && popoverState[info.tokenId].event}
                                            isOpen={popoverState[info.tokenId] && popoverState[info.tokenId].showPopover}
                                            onDidDismiss={() => this.setShowPopover(info.symbol,undefined,false,info.tokenId)}
                                        >
                                            <IonList>
                                                {
                                                    utils.getCrossNFTBySymbol(info.symbol).map((v:any) => {
                                                        if(ChainType[info.chain] !== v.from){
                                                           return <></>
                                                        }
                                                        return <IonItem onClick={()=>{
                                                            url.tunnelNFT(info.symbol,v.from,info.tokenId,v.to)
                                                        }}>
                                                            <IonText>{utils.getCyDisplayName(v.from)}</IonText>
                                                            <IonIcon icon={arrowForwardOutline} size={"small"}/>
                                                            <IonText>{v.to}</IonText>
                                                            <IonIcon icon={chevronForwardOutline} slot="end" color="medium" size={"small"}/>
                                                        </IonItem>
                                                    })
                                                }
                                            </IonList>
                                        </IonPopover>
                                    </IonCol>
                                }

                                <IonCol>
                                    <IonButton mode="ios" fill="outline" expand="block" color="primary"  size="small" onClick={() => {
                                        url.transferNFT(info.symbol,info.chain,info.tokenId)
                                    }}>{i18n.t("transfer")}</IonButton>
                                </IonCol>
                                {
                                    utils.frozeAbleBySymbol(info.symbol) &&
                                    <IonCol>
                                        <IonButton mode="ios" fill="outline" expand="block" color="primary" size="small"  onClick={()=>{
                                            url.epochFreeze(info.tokenId,info.symbol)
                                        }}>{i18n.t("seal")}</IonButton>
                                    </IonCol>
                                }

                                {
                                    info.chain == ChainType.SERO && utils.unFrozenAbleBySymbol(info.symbol) &&
                                    <IonCol>
                                        <IonButton mode="ios" fill="outline" expand="block" color="primary" size="small"  onClick={()=>{
                                            url.epochUnFreeze(info.tokenId,info.symbol)
                                        }}>{i18n.t("unseal")}</IonButton>
                                    </IonCol>
                                }
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