import * as React from 'react';
import {
    IonButton,
    IonChip, IonCol, IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonList, IonLoading,
    IonModal,
    IonRow,
    IonSelect,
    IonSelectOption, IonToast
} from "@ionic/react";
import ConfirmTransaction from "./ConfirmTransaction";
import epochService from "../contract/epoch/sero";
import {MinerScenes, MintData} from "../pages/epoch/miner";
import {AccountModel, ChainType, Transaction} from "../types";
import BigNumber from "bignumber.js";
import * as utils from "../utils";
import rpc from "../rpc";
import {Device, UserInfo} from "../contract/epoch/sero/types";

interface State {
    showProgress: boolean
    amount: any
    showAlert: boolean
    tx: any
    showToast: boolean
    toastMessage?: string
    color?: string
    showLoading: boolean
    selectAxe: string
}

interface Props {
    tkt: Array<any>
    mintData: MintData
    userInfo?: UserInfo
    device?: Device
    showModal: boolean
    account?: AccountModel
    callback: () => void
    setShowModal: (f: boolean) => void
    scenes: MinerScenes
}

const Currency = "LIGHT";
const Category = "EMIT_AX";

class EpochOrigin extends React.Component<Props, State> {


    state: State = {
        showProgress: false,
        amount: "0",
        showAlert: false,
        tx: {},
        showToast: false,
        showLoading: false,
        selectAxe: ""
    }

    done = async () => {
        this.setShowProgress(true)
        this.setShowLoading(true)
        const data = await epochService.done(this.props.scenes)
        await this.do(data)
    }

    prepare = async () => {
        const {mintData} = this.props;
        this.setShowProgress(true)
        this.setShowLoading(true)
        if (mintData.nonce) {
            const data = await epochService.prepare(this.props.scenes, mintData.nonce)
            await this.do(data)
        }
    }

    do = async (data: string) => {
        const {account} = this.props;
        const {amount, selectAxe} = this.state;
        if (account) {
            let tx: Transaction | any = {
                from: account.addresses && account.addresses[ChainType.SERO],
                to: epochService.address,
                cy: Currency,
                gasPrice: "0x" + new BigNumber(1).multipliedBy(1e9).toString(16),
                chain: ChainType.SERO,
                amount: "0x0",
                feeCy: "SERO",
                value: utils.toHex(amount, 18),
                data: data,
            }
            if (selectAxe) {
                tx.catg = Category
                tx.tkt = selectAxe
                tx.tickets= [{
                    Category: Category,
                    Value: selectAxe
                }]
            }
            tx.gas = await epochService.estimateGas(tx)
            if (tx.gas && tx.gasPrice) {
                tx.feeValue = new BigNumber(tx.gas).multipliedBy(new BigNumber(tx.gasPrice)).toString(10)
            }
            this.setState({
                tx: tx,
                showAlert: true
            })
        }

    }

    setShowProgress = (f: boolean) => {
        this.setState({
            showProgress: f
        })
    }

    setShowAlert = (f: boolean) => {
        this.setState({
            showAlert: f
        })
    }

    confirm = async (hash: string) => {
        let intervalId: any = 0;
        const chain = ChainType.SERO;
        intervalId = setInterval(() => {
            rpc.getTxInfo(chain, hash).then((rest) => {
                if (rest) {
                    // this.setShowToast(true,"success","Commit Successfully!")
                    clearInterval(intervalId);
                    // url.transactionInfo(chain,hash,Currency);

                    this.props.setShowModal(false)
                    this.props.callback();
                }
            }).catch(e => {
                console.error(e)
            })
        }, 1000)

        this.setShowLoading(false)
        this.setShowProgress(false)

        this.setShowAlert(false)
    }

    setShowToast = (f: boolean, color?: string, m?: string) => {
        this.setState({
            showToast: f,
            toastMessage: m,
            color: color
        })
    }

    setShowLoading = (f: boolean) => {
        this.setState({
            showLoading: f
        })
    }

    render() {
        const {showModal, mintData, device, userInfo, setShowModal, tkt} = this.props;
        const {showProgress, showLoading, showAlert, tx, toastMessage, color, showToast, selectAxe} = this.state;

        return <>

            <IonModal
                isOpen={showModal}
                cssClass='epoch-modal'
                swipeToClose={true}
                onDidDismiss={() => this.props.setShowModal(false)}>
                <div className="epoch-md">
                    <div className="close" onClick={() => {
                        this.props.setShowModal(false)
                    }}>X
                    </div>
                    <IonList>
                        <div className="modal-header">Settlement</div>
                        <IonItem>
                            <IonLabel>Current Period</IonLabel>
                            <IonChip color="primary"
                                     className="font-weight-800">{userInfo && userInfo.currentPeriod}</IonChip>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Settlement Period</IonLabel>
                            <IonChip color="primary"
                                     className="font-weight-800">{userInfo && userInfo.settlementPeriod}</IonChip>
                        </IonItem>
                        <IonItem>
                            <IonLabel>NE</IonLabel>
                            <IonChip color="tertiary" className="font-weight-800">{mintData && mintData.ne}</IonChip>
                        </IonItem>
                        {

                        }
                        <IonItem>
                            <IonLabel>AXE</IonLabel>
                            <IonSelect value={selectAxe} onIonChange={(e: any) => {
                                this.setState({
                                    selectAxe: e.detail.value
                                })
                            }
                            }>
                                {
                                    tkt && tkt.map(value => {
                                        return <IonSelectOption value={value.tokenId}>{value.tokenId}</IonSelectOption>
                                    })

                                }
                            </IonSelect>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Light</IonLabel>
                            <IonInput placeholder="0" onIonChange={(v) => {
                                this.setState({
                                    amount: v
                                })
                            }}/>
                        </IonItem>
                    </IonList>
                    <div className="epoch-desc">
                        <div className="ctx">
                            <p className="font-weight-800">Introduce</p>
                            <div>
                                <p>1. You do not have equipment for the first time, you need to use Prepare to
                                    submit</p>
                                <p>2. When Current period is greater than or equal to Settle, you can continue mining
                                    next time</p>
                                <p>3. Mining results can only be submitted once a day</p>
                                <p>4. You can also use Light to buy NE</p>
                            </div>
                        </div>
                    </div>
                    <div className="btn-bottom">
                        <IonRow>
                            <IonCol size="6">
                                <IonButton expand="block" mode="ios" color="primary"
                                           disabled={showProgress || userInfo && userInfo.currentPeriod < userInfo.settlementPeriod}
                                           onClick={() => {
                                               this.prepare().then(() => {
                                                   this.setShowProgress(false)
                                                   this.setShowLoading(false)
                                               }).catch(e => {
                                                   this.setShowProgress(false)
                                                   this.setShowLoading(false)
                                                   const err = typeof e == "string" ? e : e.message;
                                                   this.setShowToast(true, "warning", err)
                                               })
                                           }}>Prepare</IonButton>
                            </IonCol>
                            <IonCol size="6">
                                <IonButton expand="block" mode="ios"
                                           disabled={showProgress || userInfo && userInfo.currentPeriod < userInfo.settlementPeriod}
                                           color="primary" onClick={() => {
                                    this.done().then(() => {
                                        this.setShowProgress(false)
                                        this.setShowLoading(false)
                                    }).catch(e => {
                                        this.setShowProgress(false)
                                        this.setShowLoading(false)
                                        const err = typeof e == "string" ? e : e.message;
                                        this.setShowToast(true, "warning", err)
                                    })
                                }}>Done</IonButton>
                            </IonCol>
                        </IonRow>
                    </div>
                </div>
            </IonModal>

            <IonToast
                color={!color ? "warning" : color}
                position="top"
                isOpen={showToast}
                onDidDismiss={() => this.setShowToast(false)}
                message={toastMessage}
                duration={1500}
                mode="ios"
            />

            <IonLoading
                spinner={"bubbles"}
                cssClass='my-custom-class'
                isOpen={showLoading}
                onDidDismiss={() => this.setShowLoading(false)}
                message={'Please wait...'}
                duration={5000}
            />

            <ConfirmTransaction show={showAlert} transaction={tx} onProcess={(f) => this.setShowProgress(f)}
                                onCancel={() => this.setShowAlert(false)} onOK={this.confirm}/>

        </>;
    }
}

export default EpochOrigin