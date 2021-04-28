import * as React from 'react';
import {
    IonContent,
    IonHeader,
    IonLabel,
    IonPage,
    IonSegment,
    IonSegmentButton,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import rpc from "../rpc";
import walletWorker from "../worker/walletWorker";
import {ChainType, NftInfo} from "../types";
import {CONTRACT_ADDRESS} from "../config"
import "./NFT.css";
import NFCRender from "../components/NFCRender";
import interVar from "../interval/index";
import i18n from "../locales/i18n";

class NFT extends React.Component<any, any> {

    state: any = {
        wrapTicket: [],
        tab:"MEDAL",
        drivers:{}
    }

    constructor(props:any) {
        super(props);
    }

    componentDidMount() {

        interVar.start(()=>{
            this.init().then(() => {
            }).catch(e=>{
                console.error(e)
            })
        },10*1000)
    }

    init = async () => {
        const account = await walletWorker.accountInfo()
        const keys = Object.keys(CONTRACT_ADDRESS.ERC721);
        const seroTicket = await rpc.getTicket(ChainType.SERO, account.addresses[ChainType.SERO])
        const ethTicket = await rpc.getTicket(ChainType.ETH, account.addresses[ChainType.ETH])
        const ticketMap: Map<string,Array<NftInfo>> = new Map<string, Array<NftInfo>>()

        for (let key of keys) {
            let wrapTicket: Array<NftInfo> = [];
            const ethSymbol = CONTRACT_ADDRESS.ERC721[key]["SYMBOL"]["ETH"];
            const seroSymbol = CONTRACT_ADDRESS.ERC721[key]["SYMBOL"]["SERO"];
            if(seroSymbol){
                const data:Array<NftInfo> = seroTicket[seroSymbol];
                if(data && data.length>0){
                    wrapTicket = wrapTicket.concat(data)
                }
            }

            if(ethSymbol){
                const data:Array<NftInfo> = ethTicket[ethSymbol];
                if(data && data.length>0){
                    wrapTicket = wrapTicket.concat(data)
                }
            }
            wrapTicket.reverse()
            ticketMap.set(key,wrapTicket);
        }

        // const styles = ["ax",
        //     "axe",
        //     "baseball",
        //     "bone",
        //     "boomerang",
        //     "bow",
        //     "broom",
        //     "claw",
        //     "crossbow",
        //     "darts",
        //     "fork",
        //     "grenade",
        //     "hammer",
        //     "hammerball",
        //     "lightsaber",
        //     "magic",
        //     "massage",
        //     "nail",
        //     "pistol",
        //     "poniard",
        //     "samurai",
        //     "saucepan",
        //     "saw",
        //     "shovel",
        //     "sickle",
        //     "spear",
        //     "staff",
        //     "sword",
        //     "syringe",
        //     "trident",
        //     "whip",
        //     "wooden",
        //     "wrench"]
        //
        // if(ticketMap.has("DEVICES")){
        //     // @ts-ignore
        //     const da:Array<NftInfo> = ticketMap.get("DEVICES")
        //     for(let s of styles){
        //         const d = JSON.parse(JSON.stringify(da[0]))
        //         if(d.meta){
        //             d.meta.image = `./assets/img/epoch/device/${s}.png`
        //             da.push(d)
        //         }
        //     }
        //     ticketMap.set("DEVICES",da)
        // }

        this.setState({
            ticketMap: ticketMap,
        })
    }

    setTab = (v:any)=>{

        const {ticketMap} = this.state;

        const tmp:any = ticketMap;
        this.setState({tab:v,ticketMap:new Map()})
        this.setState({
            ticketMap:tmp
        })
        // this.initDriver(v).catch(e=>{
        //     console.log(e)
        // })
    }

    // initDriver = async (v:any ) =>{
    //     if(v == "DRIVER"){
    //         const account = await walletWorker.accountInfo();
    //         const drivers:any = {};
    //         for(let k in MinerScenes){
    //             const scene = parseInt(k);
    //             if(scene && scene !== 0){
    //                 const rest = await epochService.userInfo(scene, account.addresses[ChainType.SERO])
    //                 drivers[scene]=rest
    //             }
    //         }
    //         this.setState({
    //             drivers:drivers
    //         })
    //     }
    // }

    render() {
        const {ticketMap,tab,drivers} = this.state;
        return <IonPage>
            <IonHeader mode="ios">
                <IonToolbar color="primary" mode="ios">
                    <IonTitle>{i18n.t("NFT")}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen >
                <div style={{padding:"12px 12px 0"}}>
                    <IonSegment mode="ios"value={tab} onIonChange={e => this.setTab(e.detail.value)}>
                        <IonSegmentButton mode="ios" value="MEDAL">
                            <IonLabel>Medal</IonLabel>
                        </IonSegmentButton>
                        {/*<IonSegmentButton mode="ios" value="DRIVER">*/}
                        {/*    <IonLabel>Driver</IonLabel>*/}
                        {/*</IonSegmentButton>*/}
                        <IonSegmentButton value="DEVICES">
                            <IonLabel>Devices</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </div>
                {["MEDAL","DEVICES"].indexOf(tab)>-1 && ticketMap && ticketMap.has(tab) &&
                    <NFCRender data={ticketMap.get(tab)}/>
                //     :
                // <div className="card-page">
                //     <div className="card-inset">
                //
                //     { drivers && Object.keys(drivers).map((k:any)=>{
                //         const userInfo:UserInfo = drivers[k];
                //         return <div className="progress">
                //             <div>
                //                 <IonRow>
                //                     <IonCol>
                //                         <IonText style={{textTransform:"uppercase",fontWeight:"800"}} className="text-little">{MinerScenes[k]}</IonText>
                //                     </IonCol>
                //                 </IonRow>
                //             </div>
                //             <IonProgressBar className="progress-background" value={userInfo && userInfo.driver && utils.fromValue(userInfo.driver.rate,16).toNumber() > 0 ? (utils.fromValue(userInfo.driver.rate,16).div(100).toNumber()) : 0}/>
                //             <div style={{textAlign: "right"}}>
                //                 <IonText  style={{textTransform:"uppercase",fontWeight:"800"}} className="text-little">{userInfo && userInfo.driver && `${utils.fromValue(userInfo.driver.rate,16).toFixed(0,1)}/100`}</IonText>
                //             </div>
                //         </div>
                //     })}
                //     </div>
                // </div>
                }
            </IonContent>
        </IonPage>;
    }
}

export default NFT