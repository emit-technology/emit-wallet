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

import * as React from 'react';
import {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonList,
    IonChip,
    IonItem,
    IonSegment,
    IonSegmentButton,
    IonPage,
    IonTitle,
    IonRefresher,
    IonRefresherContent,
    IonToolbar,
    IonSpinner,
    IonIcon,
    IonAvatar,
    IonLabel,
    IonButton,
    IonText,
    IonSearchbar,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonLoading
} from "@ionic/react";
import { RefresherEventDetail } from '@ionic/core';
import {
    add,
    chevronDownCircleOutline,
    reloadCircleOutline,
    chevronBack, arrowRedoOutline, arrowUndoOutline
} from 'ionicons/icons'
import * as utils from "../utils";

import './Transaction.css'
import rpc from "../rpc";
import walletWorker from "../worker/walletWorker";
import {ChainType} from "../types";
import BigNumber from "bignumber.js";
import url from "../utils/url";
import i18n from "../locales/i18n"

class TransactionList extends React.Component<any, any>{

    state:any = {
        cy:"",
        chain:ChainType._,
        address:"",
        records:[],
        pageSize:15,
        pageNo:1,
        searchText:'',
        showLoading:true
    }

    componentDidMount() {
        this.init().then(()=>{
            this.setShowLoading(false)
        }).catch((e)=>{
            console.error(e)
            this.setShowLoading(false)
        })
    }

    init = async () =>{
        const {pageSize,pageNo,searchText} = this.state;
        const account = await walletWorker.accountInfo()

        const cy = this.props.match.params.cy;
        const chainName = this.props.match.params.chain;
        const cyName = utils.getCyName(cy,chainName)
        const chain = utils.getChainIdByName(chainName);
        const address = account.addresses[chain];
        const rest:any = await rpc.getTransactions(chain,address,cyName,searchText,pageSize,pageNo)
        this.setState({
            cy:cy,
            cyName:cyName,
            chain:chain,
            address:address,
            records:rest.data,
            meta:rest.meta,
        })
    }

    loadMore = async (event:any) =>{
        const {pageSize,pageNo,chain,address,cy,records,cyName,searchText,meta} = this.state;
        if(!meta || meta&&meta.fingerprint){
            const rest:any = await rpc.getTransactions(chain,address,cyName,searchText,pageSize,pageNo+1,meta&&meta.fingerprint)
            if(rest && rest.total>0){
                if(rest.data.length == 0){
                    event.target.disabled = true;

                }else{
                    this.setState({
                        pageNo:pageNo+1,
                        records:records.concat(rest.data),
                        meta:rest.meta,
                    })
                }
            }
        }
        event.target.complete();
    }

    setSearchText = (v:string)=>{
        this.setState({
            searchText:v
        })
        this.init().then().catch()
    }

    doRefresh = (event:CustomEvent<RefresherEventDetail>) =>{
        this.setState({
            pageNo:1,
            records:[],
            searchText:""
        })
        this.init().then(()=>{
            setTimeout(()=>{
                event.detail.complete();
            },500)
        }).catch((e:any)=>{
            console.log(e)
        })
    }

    setShowLoading = (f:boolean)=>{
        this.setState({
            showLoading:f
        })
    }

    render() {

        const {cy,chain,address,records,cyName,searchText,showLoading} = this.state;
        return <IonPage>
            <IonHeader>
                <IonToolbar mode="ios" color="primary">
                    <IonIcon src={chevronBack} slot="start" size="large" onClick={()=>{url.back()}}/>
                    <IonTitle>{cyName}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={this.doRefresh} pullFactor={0.5} pullMin={100} pullMax={160}>
                    <IonRefresherContent
                        pullingIcon={chevronDownCircleOutline}
                        pullingText="Pull to refresh"
                        refreshingSpinner="circles"
                        refreshingText="Refreshing...">
                    </IonRefresherContent>
                </IonRefresher>
                <IonSearchbar mode="ios" value={searchText} onIonChange={e => this.setSearchText(e.detail.value!)}/>
                <IonList>
                    {
                        records && records.length>0 ? records.map((record:any)=>{
                            let value = new BigNumber(record.amount);

                            const color = record.num == 0 && chain != ChainType.TRON?"warning":value.toNumber()>0 ?"primary":"secondary";
                            const icon = record.num == 0 && chain != ChainType.TRON? reloadCircleOutline:value.toNumber()>0 ?arrowRedoOutline:arrowUndoOutline;
                            const prefix = value.toNumber()>0?"+":"";
                            console.debug("record>>",record)
                            return <IonItem mode="ios" onClick={()=>{
                                // window.location.href = `#/transaction/info/${chain}/${record.txHash}`
                                // Use temp storage
                                if(ChainType.TRON){
                                    sessionStorage.setItem(record.txHash,JSON.stringify(record));
                                }
                                url.transactionInfo(chain,record.txHash,cy);
                            }}>
                                {
                                    record.num == 0 && chain != ChainType.TRON?
                                        <IonSpinner name="bubbles" slot="start"/> : <IonAvatar slot="start">
                                    <IonIcon src={icon} size="large" color={color}/>
                                </IonAvatar>
                                }
                                <IonLabel>
                                    <h2>
                                        <IonText color="dark" className="text-bold text-small">
                                            {utils.ellipsisStr(record.txHash)}
                                        </IonText>
                                    </h2>
                                    <p style={{margin:"5px 0"}}>{
                                        chain != ChainType.TRON && <IonText color="dark">{i18n.t("block")}: <b>{record.num>0?record.num:"PENDING"}</b></IonText>
                                    }</p>
                                    <p  className="text-small">{utils.formatDate(record.timestamp*1000)}</p>
                                </IonLabel>
                                <IonText slot="end" className="text-small" color={color}>
                                    <IonChip color={color}>{prefix}{utils.fromValue(value,utils.getCyDecimal(cyName,ChainType[chain])).toString(10)}</IonChip>
                                </IonText>
                            </IonItem>
                        }):""
                        //     <div style={{margin:"45px 0 20px",textAlign:"center"}}>
                        //     <IonIcon src={sadOutline} size="large" color="medium" style={{fontSize:"100px !important"}}/><br/>
                        //     <IonText color="medium">No content</IonText>
                        // </div>
                    }
                </IonList>
                <IonInfiniteScroll onIonInfinite={(e)=>this.loadMore(e)}>
                    <IonInfiniteScrollContent
                        loadingSpinner="bubbles"
                        loadingText="Loading more data..."
                    >
                    </IonInfiniteScrollContent>
                </IonInfiniteScroll>
                <IonLoading
                    mode="ios"
                    isOpen={showLoading}
                    onDidDismiss={() => this.setShowLoading(false)}
                    message={'Please wait...'}
                    duration={60000}
                />
            </IonContent>
        </IonPage>;
    }
}

export default TransactionList