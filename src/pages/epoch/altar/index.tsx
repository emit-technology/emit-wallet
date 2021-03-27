import * as React from 'react';
import {IonCol, IonContent, IonIcon, IonItem, IonLabel, IonPage, IonProgressBar, IonRow, IonText} from "@ionic/react";
import {chevronBack} from "ionicons/icons";
import url from "../../../utils/url";
import "./index.scss";
import {Plugins} from "@capacitor/core";
import {MinerScenes, MintData} from "../miner";
import miner from "../miner/altar";
import walletWorker from "../../../worker/walletWorker";
import interVar from "../../../interval";
import epochService from "../../../contract/epoch/sero"
import {AccountModel, ChainType} from "../../../types";
import {Device, UserInfo} from "../../../contract/epoch/sero/types";
import * as utils from "../../../utils";
import rpc from "../../../rpc";
import EpochOrigin from "../../../components/EpochOrigin";

interface State {
    isMining: boolean
    mintData: MintData
    userInfo?: UserInfo
    device?: Device
    showModal: boolean
    account?: AccountModel
    tkt: Array<any>
}

const scenes = MinerScenes.altar;
const Currency = "LIGHT";

class Altar extends React.Component<any, State> {
    state: State = {
        isMining: false,
        mintData: {ne: "0", accountId: "", accountScenes: "", scenes: "", phash: "", address: "", index: ""},
        showModal: false,
        tkt: []
    }

    componentDidMount() {
        this.init().catch(e => {
            console.error(e)
        });
        interVar.start(() => {
            this.mintState().then(() => {
            }).catch(e => {
                console.error(e)
            })
        }, 5 * 1000)
    }

    init = async () => {
        const account = await walletWorker.accountInfo()
        miner.setMiner(account.accountId ? account.accountId : "")
        await miner.init();
        await this.mintState();

        const userInfo = await epochService.userInfo(MinerScenes.altar, account.addresses[ChainType.SERO])
        const device = await epochService.lockedDevice(MinerScenes.altar, account.addresses[ChainType.SERO])

        console.log("userInfo>", userInfo)
        console.log("device>", device)

        const tkt = await this.getTicket(account.addresses[ChainType.SERO])
        this.setState({
            isMining: await miner.isMining(),
            userInfo: userInfo,
            device: device,
            account: account,
            tkt: tkt
        })
    }

    getTicket = async (address: string) => {
        const rest = await rpc.getTicket(ChainType.SERO, address)
        return rest["EMIT_AX"]
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
        const {account, userInfo} = this.state;
        if (account && userInfo && userInfo.pImage && userInfo && userInfo.pImage.hash && userInfo && userInfo.pImage.serial) {
            await miner.start({
                phash: userInfo.pImage.hash,
                address: await utils.getShortAddress(account.addresses[ChainType.SERO]),
                index: utils.toHex(userInfo.pImage.serial),
                scenes: scenes,
                accountScenes: miner.uKey(),
                accountId: account.accountId
            })
            this.setState({
                isMining: true
            })
        }
    }

    stop = async () => {
        await miner.stop();
        this.setShowModal(true)
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

    setShowModal = (f: boolean) => {
        this.setState({
            showModal: f
        })
    }

    render() {
        const {showModal, isMining, account, mintData, device, userInfo, tkt} = this.state;
        return (
            <IonPage>
                <IonContent fullscreen color="light">
                    <div className="content-ion">
                        <IonItem className="heard-bg" color="primary" lines="none">
                            <IonIcon src={chevronBack} style={{color: "#edcc67"}} slot="start" onClick={() => {
                                url.back()
                                Plugins.StatusBar.setBackgroundColor({
                                    color: "#194381"
                                }).catch(e => {
                                })

                            }}/>
                            <IonLabel className="text-center text-bold" style={{color: "#edcc67"}}>ALTAR</IonLabel>
                            <img src={require("../img/help.png")} width={28}/>
                        </IonItem>
                        <div className="axe-btn">Change Axe</div>
                        <div style={{margin: "30px 0 0"}}></div>
                        <div className="progress">
                            <div>
                                <IonRow>
                                    <IonCol>
                                        <IonText color="white" className="text-little">AEX</IonText>
                                    </IonCol>
                                    <IonCol style={{textAlign: "right"}}>
                                        <IonText color="white"
                                                 className="text-little">LV{device && device.power}</IonText><br/>
                                    </IonCol>
                                </IonRow>
                            </div>
                            <IonProgressBar className="progress-background"
                                            value={device && (device.capacity ? device.base / device.capacity : 0)}/>
                            <div style={{textAlign: "right"}}>
                                <IonText color="white"
                                         className="text-little">{device && `${device.base}/${device.capacity}`}</IonText>
                            </div>
                        </div>
                        <div className="progress">
                            <div>
                                <IonRow>
                                    <IonCol>
                                        <IonText color="white" className="text-little">DRIVER</IonText>
                                    </IonCol>
                                </IonRow>
                            </div>
                            <IonProgressBar className="progress-background"
                                            value={userInfo && userInfo.driver && userInfo.driver.capacity > 0 ? (userInfo.driver.base / userInfo.driver.capacity) : 0}/>
                            <div style={{textAlign: "right"}}>
                                <IonText color="white"
                                         className="text-little">{userInfo && userInfo.driver && `${userInfo.driver.base}/${userInfo.driver.capacity}`}</IonText>
                            </div>
                        </div>

                        <div className="altar">
                            <div><img src={require("../img/altar_1.png")}/></div>
                            <div><img src={require("../img/altar_2.png")}/></div>
                            <div><img src={require("../img/altar_3.png")}/></div>
                            <div>
                                <img src={require("../img/axe_0.png")}/>
                                <div></div>
                            </div>
                            <div>
                                <img src={require("../img/axe_1.png")}/>
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

                    <EpochOrigin mintData={mintData} userInfo={userInfo} device={device} showModal={showModal}
                                 account={account} callback={() => this.init()} tkt={tkt}
                                 setShowModal={(f) => this.setShowModal(f)} scenes={MinerScenes.altar}/>
                </IonContent>
            </IonPage>
        );
    }
}

export default Altar