/**
 * Copyright 2020 EMIT Foundation.
 This file is part of E.M.I.T. .

 E.M.I.T. is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 E.M.I.T. is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with E.M.I.T. . If not, see <http://www.gnu.org/licenses/>.
 */
import * as React from "react";
import {
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonModal,
    IonRadio,
    IonRadioGroup, IonRow, IonCol
} from "@ionic/react";
import i18n from "../locales/i18n";
import BigNumber from "bignumber.js";
import rpc from "../rpc";
import {ChainType, GasPriceLevel} from "../types";
import './gasPrice.css'

interface State {
    gasPriceLevel: GasPriceLevel
    gasPrice: string
}

interface Props {
    onClose: ()=>void;
    onSelect: (gasPrice: string) => void;
    value?: string
    chain: ChainType
    show: boolean
}

class GasPriceActionSheet extends React.Component<Props, State> {

    state: State = {
        gasPrice: "1",
        gasPriceLevel: {}
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        console.log("gasPrice componentDidUpdate",prevProps,this.props)
        if(prevProps.show !== this.props.show){
            this.init().catch()
        }
    }

    init = async () => {
        if (this.props.show) {
            const chain = this.props.chain;
            let defaultGasPrice;
            let data: GasPriceLevel = {};
            if (chain == ChainType.ETH) {
                // @ts-ignore
                data = await rpc.post("eth_gasTracker", [])
            } else if (chain == ChainType.SERO) {
                data = {
                    AvgGasPrice: {
                        gasPrice: "1",
                        second: 15,
                    }
                }
            } else if (chain == ChainType.TRON) {
                //TODO
            }
            if (this.props.value) {
                defaultGasPrice = this.props.value;
            } else {
                defaultGasPrice = data.AvgGasPrice ? data.AvgGasPrice?.gasPrice : "1"
            }
            this.setState({
                gasPriceLevel: data,
                gasPrice: defaultGasPrice
            })
        }

    }

    sort(a: any, b: any) {
        return new BigNumber(a.gasPrice).comparedTo(new BigNumber(b.gasPrice))
    }

    radioItems = (): Array<any> => {
        const {gasPriceLevel} = this.state;
        const options: Array<any> = [];
        const keys = Object.keys(gasPriceLevel);
        const arr: Array<any> = [];
        const trimKey: any = [];
        for (let key of keys) {
            // @ts-ignore
            const gasTracker = gasPriceLevel[key];
            if (trimKey.indexOf(gasTracker.gasPrice) == -1) {
                trimKey.push(gasTracker.gasPrice)
                arr.push(gasTracker);
            }
        }
        arr.sort(this.sort);
        const desc = [i18n.t("slow"), i18n.t("general"), i18n.t("fast"), i18n.t("fastest")];
        for (let i = arr.length - 1; i >= 0; i--) {
            const a = arr[i];
            options.push(
                <IonItem>
                    <IonLabel>{`${desc[i]},${a.gasPrice}GWei , ${Math.floor(a.second / 60)}m ${a.second % 60}s`}</IonLabel>
                    <IonRadio slot="start" value={a.gasPrice}/>
                </IonItem>
            )
        }
        return options;
    }

    setGasPrice = (v: any) => {
        this.setState({
            gasPrice: v?parseInt(v).toString():""
        })
    }

    render() {
        const {gasPrice} = this.state;
        // console.log("radioItems",this.radioItems())
        return <>
            <IonModal
                mode="ios"
                cssClass="gas-price-modal"
                isOpen={this.props.show}
                onDidDismiss={() => this.props.onClose()}>
                <IonList>
                    <IonRadioGroup value={gasPrice} onIonChange={e => this.setGasPrice(e.detail.value)}>
                        <IonListHeader>
                            <IonLabel>{i18n.t('selectGasPrice')}</IonLabel>
                        </IonListHeader>
                        {this.radioItems()}
                    </IonRadioGroup>
                    <IonListHeader>
                        <IonLabel>{i18n.t('custom')}</IonLabel>
                    </IonListHeader>
                    <IonItem>
                        <IonInput type="number" min="1" value={gasPrice} onIonChange={e => {
                            this.setGasPrice(e.detail.value)
                        }}/>
                    </IonItem>
                </IonList>
                <IonRow>
                    <IonCol size="4">
                        <IonButton expand="block" fill="outline" onClick={() => {
                            this.props.onClose();
                        }}>{i18n.t("cancel")}</IonButton>
                    </IonCol>
                    <IonCol size="8">
                        <IonButton expand="block" onClick={() => {
                            this.props.onSelect(gasPrice)
                            this.props.onClose();
                        }}>{i18n.t("ok")}</IonButton>
                    </IonCol>
                </IonRow>
            </IonModal>
        </>;
    }
}

export default GasPriceActionSheet