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

        this.init().then(() => {
        }).catch(e=>{
            console.error(e)
        })
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

        this.setState({
            ticketMap: ticketMap,
        })

        this.initNFT()
    }

    setTab = (v:any)=>{

        this.init().then(() => {
        }).catch(e=>{
            console.error(e)
        })

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

    initNFT = ()=>{
        walletWorker.accountInfo().then(account=>{
            const address = account && account.addresses[ChainType.SERO]
            if(address){
                rpc.getTicketSero(address).catch(e=>{
                    console.error(e)
                })
                rpc.getTicketEth(account.addresses[ChainType.ETH]).catch(e=>{
                    console.error(e)
                })
            }
        })
    }

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