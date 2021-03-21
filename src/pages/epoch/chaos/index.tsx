import * as React from 'react';
import {IonCol, IonContent, IonIcon, IonItem, IonLabel, IonPage, IonProgressBar, IonRow, IonText} from "@ionic/react";
import {chevronBack} from "ionicons/icons";
import url from "../../../utils/url";
import "./index.scss"
import {Plugins} from "@capacitor/core";
import {MinerScenes, MintData} from "../miner";

import miner from "../miner/chaos";
import interVar from "../../../interval";
import walletWorker from "../../../worker/walletWorker";

interface State{
    showProgress:boolean
    mintData:MintData
    isMining:boolean
}
const scenes = MinerScenes.chaos;
class Chaos extends React.Component<any, State>{

    state:State = {
        showProgress:false,
        mintData: {ne: "0", accountId: "", accountScenes: "", scenes: "", phash: "", address: "", index: ""},
        isMining:false
    }
    componentDidMount() {
        Plugins.StatusBar.setBackgroundColor({
            color: "#1e274e"
        })

        this.init().catch(e => {
            console.error(e)
        });
        interVar.start(() => {
            this.mintState().then(() => {
            }).catch(e => {
                console.error(e)
            })
        }, 1 * 1000)
    }

    init = async () => {
        const account: any = await walletWorker.accountInfo()
        miner.setMiner(account.accountId)
        await miner.init();
        await this.mintState();
        this.setState({
            isMining: await miner.isMining()
        })
    }

    operate = async () => {
        const {isMining} = this.state;
        if (isMining) {
            await this.stop()
        } else {
            await this.start()
        }
    }

    start = async () => {
        const account: any = await walletWorker.accountInfo()
        await miner.start({
            phash: "0x6643536dbd7163921fef7f59c2c75e876d176f8bdc9a154536acf72e4d3c9d64",
            address: "0xBc149B2e61C169394C8d7Fd9bF4912B3B8C1c8E1",
            index: "0x1",
            scenes: scenes,
            accountScenes: miner.uKey(),
            accountId: account.accountId
        })
        this.setState({
            isMining: true
        })
    }

    stop = async () => {
        await miner.stop();
        this.setState({
            isMining: false
        })
    }

    async mintState() {
        const rest = await miner.mintState()
        this.setState({
            mintData: rest
        })
    }

    render() {
        const {showProgress,mintData,isMining} = this.state;

        return (
            <IonPage>
                <IonContent fullscreen color="light">
                    <div className="content-ion">
                        <IonItem className="heard-bg" color="primary" lines="none">
                            <IonIcon src={chevronBack} style={{color:"#edcc67"}} slot="start" onClick={()=>{
                                Plugins.StatusBar.setBackgroundColor({
                                    color: "#194381"
                                })
                                url.back()
                            }}/>
                            <IonLabel className="text-center text-bold" style={{color:"#edcc67"}}>CHAOS</IonLabel>
                            <img src={require("../img/help.png")} width={28}/>
                        </IonItem>

                        <div className="starfield">
                            <div className="static"></div>
                            <div className="moving-1"></div>
                            <div className="moving-2"></div>
                            <div className="moving-3"></div>
                        </div>

                        <div className="axe-btn">Change Axe</div>
                        <div style={{margin:"30px 0 0"}}></div>
                        <div className="progress">
                            <div>
                                <IonRow>
                                    <IonCol>
                                        <IonText color="white" className="text-little">AEX1</IonText>
                                    </IonCol>
                                    <IonCol style={{textAlign:"right"}}>
                                        <IonText  color="white" className="text-little">LV1</IonText><br/>
                                    </IonCol>
                                </IonRow>
                            </div>
                            <IonProgressBar className="progress-background" value={0.5}></IonProgressBar>
                            <div style={{textAlign:"right"}}>
                                <IonText  color="white" className="text-little">50/100</IonText>
                            </div>

                            <div>
                                <IonRow>
                                    <IonCol>
                                        <IonText color="white" className="text-little">DRIVER</IonText>
                                    </IonCol>
                                    <IonCol style={{textAlign:"right"}}>
                                        <IonText  color="white" className="text-little">LV1</IonText><br/>
                                    </IonCol>
                                </IonRow>
                            </div>
                            <IonProgressBar className="progress-background" value={0.5}></IonProgressBar>
                            <div style={{textAlign:"right"}}>
                                <IonText  color="white" className="text-little">50/100</IonText>
                            </div>
                        </div>

                        <div className="chaos">
                            <div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <div>
                                <img src={require("../img/axe_0.png")}/>
                            </div>
                            <div>
                                <img src={require("../img/axe_1.png")}/>
                            </div>
                        </div>

                        <div>
                            <div className="chaos-light">
                                <img src={require("../img/light.png")}/>
                            </div>
                            <div className="chaos-dark">
                                <img src={require("../img/dark.png")}/>
                            </div>
                        </div>

                        <div>
                            {mintData && mintData.ne && <div className="ne-text">
                                {mintData && mintData.ne}
                            </div>}
                            {mintData && mintData.nonce && <div className="nonce-text">
                                <span className="nonce-span">{mintData && mintData.nonce}</span>
                            </div>}
                            <div className="start-btn" style={{background: !!isMining ? "red" : "green"}}
                                 onClick={() => {
                                     this.operate().then(() => {
                                     }).catch((e) => {
                                         console.error(e)
                                     })
                                 }}>{!!isMining ? "STOP" : "START"}</div>
                        </div>
                    </div>
                </IonContent>
            </IonPage>
        );
    }
}

export default Chaos