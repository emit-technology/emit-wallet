import * as React from 'react';
import {
    IonCol,
    IonContent, IonText, IonAvatar, IonSegment, IonSegmentButton,
    IonImg, IonBadge,
    IonItem,
    IonItemGroup,
    IonItemDivider,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardSubtitle,
    IonCardHeader,
    IonCardTitle,
    IonModal,
    IonGrid,
    IonLabel,
    IonList,
    IonListHeader,
    IonRow,
    IonHeader, IonToolbar, IonTitle
} from "@ionic/react";
import rpc from "../rpc";
import * as utils from "../utils"
import url from "../utils/url";
import i18n from "../locales/i18n";
import {META_TEMP} from "../config";
import CardTransform from "./CardTransform";

interface Props {
    data: Array<any>
}

class NFCRender extends React.Component<Props, any> {

    state: any = {
        showModal: false,
        tab:"medal",
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<any>, snapshot?: any) {
        if(prevProps != this.props){
            this.init().catch(e => {
                console.error(e)
            })
        }
    }

    init = async () => {
        const {data} = this.props
        if(!data){
            return
        }
        const mateData:any = {};
        for(let d of data){
            //TODO for test
            mateData[d.value]  = META_TEMP.MEDAL

            //
            // if(!d.uri){
            //     continue;
            // }
            // const rest = await rpc.req(d.uri,{})
            // mateData[d.value] = rest
        }
        this.setState({
            mateData:mateData
        })
    }

    showModal = (v:any,f:boolean)=>{
        this.setState({
            metaInfo:v,
            showModal:f
        })
    }

    render() {
        const {data} = this.props;
        const {showModal,mateData,metaInfo,tab} = this.state;
        return <>
            <IonHeader mode="ios">
                <IonToolbar color="dark" mode="ios">
                    <IonTitle>{i18n.t("NFT")}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <div style={{padding:"12px 12px 0",background:"#000"}}>
                <IonSegment mode="ios" color="light" value={tab} style={{background:"#000"}} onIonChange={e => this.setState({tab:e.detail.value})}>
                    <IonSegmentButton  color="light" mode="ios" style={{background:"#000"}} value="medal">
                        <IonLabel color={tab=="medal"?"dark":"light"}>Medal</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton  color="light" mode="ios" style={{background:"#000"}} value="driver">
                        <IonLabel color={tab=="driver"?"dark":"light"}>Driver</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton  color="light" mode="ios" style={{background:"#000"}} value="devices">
                        <IonLabel color={tab=="devices"?"dark":"light"}>Devices</IonLabel>
                    </IonSegmentButton>
                </IonSegment>
            </div>
            <div className="card-page">
                <div className="card-inset">


                {/*{*/}
                {/*    data && data.map((v: any,index:number) => {*/}
                {/*        //lines={index == data.length-1?"none":"inset"}*/}
                {/*        return <IonItem onClick={()=>this.showModal(v,true)} >*/}
                {/*            <IonAvatar slot="start" className="medal-avatar">*/}
                {/*                {mateData && mateData[v.value] && <img src={mateData[v.value].image} /> }*/}
                {/*            </IonAvatar>*/}
                {/*            <IonLabel>*/}
                {/*                <h2>{mateData && mateData[v.value] && mateData[v.value].name}</h2>*/}
                {/*                <h3><IonBadge color="light" mode="md">{v.chain} Chain</IonBadge></h3>*/}
                {/*                <p><IonText color="medium">Token Id: {v.value}</IonText></p>*/}
                {/*            </IonLabel>*/}
                {/*        </IonItem>*/}
                {/*    })*/}
                {/*}*/}

                    {
                        data && data.map((v: any,index:number) => {
                            //lines={index == data.length-1?"none":"inset"}
                            const meta = mateData && mateData[v.value]?mateData[v.value]:{};
                            return <CardTransform src={meta.image}
                                                  title={meta.name} subTitle={v.value} chain={v.chain}
                                                  timestamp={Date.now()} description={meta.description}
                                                  dna={utils.getAddressBySymbol(v.symbol,v.chain)} symbol={v.symbol}/>
                        })
                    }
                    {
                        data && data.map((v: any,index:number) => {
                            //lines={index == data.length-1?"none":"inset"}
                            const meta = mateData && mateData[v.value]?mateData[v.value]:{};
                            return <CardTransform src={meta.image}
                                                  title={meta.name} subTitle={v.value} chain={v.chain}
                                                  timestamp={Date.now()} description={meta.description}
                                                  dna={utils.getAddressBySymbol(v.symbol,v.chain)} symbol={v.symbol}/>
                        })
                    }
                    {
                        data && data.map((v: any,index:number) => {
                            //lines={index == data.length-1?"none":"inset"}
                            const meta = mateData && mateData[v.value]?mateData[v.value]:{};
                            return <CardTransform src={meta.image}
                                                  title={meta.name} subTitle={v.value} chain={v.chain}
                                                  timestamp={Date.now()} description={meta.description}
                                                  dna={utils.getAddressBySymbol(v.symbol,v.chain)} symbol={v.symbol}/>
                        })
                    }
                    {
                        data && data.map((v: any,index:number) => {
                            //lines={index == data.length-1?"none":"inset"}
                            const meta = mateData && mateData[v.value]?mateData[v.value]:{};
                            return <CardTransform src={meta.image}
                                                  title={meta.name} subTitle={v.value} chain={v.chain}
                                                  timestamp={Date.now()} description={meta.description}
                                                  dna={utils.getAddressBySymbol(v.symbol,v.chain)} symbol={v.symbol}/>
                        })
                    }

                </div>
            </div>

            {/*<div style={{height:"25vh",background:"#fff",overflowY:"scroll",margin:"12px 12px 0",border:"1px solid #ddd",borderRadius:"15px"}}>*/}
            {/*    <IonGrid>*/}
            {/*        <IonRow>*/}
            {/*            {*/}
            {/*                data && data.map((v: any) => {*/}
            {/*                    return <IonCol size={"3"}>*/}
            {/*                        <div className="elements" onClick={()=>this.showModal(v,true)}>*/}
            {/*                            {mateData && mateData[v.value] && <img src={mateData[v.value].image}/>}*/}
            {/*                            <div className="text-center">*/}
            {/*                                <IonText className="text-small-x2">{mateData && mateData[v.value].name}</IonText>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    </IonCol>*/}
            {/*                })*/}
            {/*            }*/}
            {/*            {*/}
            {/*                data && data.map((v: any) => {*/}
            {/*                    return <IonCol size={"3"}>*/}
            {/*                        <div className="elements" onClick={()=>this.showModal(v,true)}>*/}
            {/*                            {mateData && mateData[v.value] && <img src={mateData[v.value].image}/>}*/}
            {/*                        </div>*/}
            {/*                    </IonCol>*/}
            {/*                })*/}
            {/*            }*/}
            {/*            {*/}
            {/*                data && data.map((v: any) => {*/}
            {/*                    return <IonCol size={"3"}>*/}
            {/*                        <div className="elements" onClick={()=>this.showModal(v,true)}>*/}
            {/*                            {mateData && mateData[v.value] && <img src={mateData[v.value].image}/>}*/}
            {/*                        </div>*/}
            {/*                    </IonCol>*/}
            {/*                })*/}
            {/*            }*/}
            {/*            {*/}
            {/*                data && data.map((v: any) => {*/}
            {/*                    return <IonCol size={"3"}>*/}
            {/*                        <div className="elements" onClick={()=>this.showModal(v,true)}>*/}
            {/*                            {mateData && mateData[v.value] && <img src={mateData[v.value].image}/>}*/}
            {/*                        </div>*/}
            {/*                    </IonCol>*/}
            {/*                })*/}
            {/*            }*/}
            {/*        </IonRow>*/}
            {/*    </IonGrid>*/}
            {/*</div>*/}
            {/*<IonListHeader color="light" mode="ios">*/}
            {/*    <IonLabel>Driver</IonLabel>*/}
            {/*</IonListHeader>*/}
            {/*<div style={{height:"20vh",background:"#fff",margin:"12px 12px 0",border:"1px solid #ddd",borderRadius:"15px"}}>*/}

            {/*</div>*/}

            {/*<IonListHeader color="light"  mode="ios">*/}
            {/*    <IonLabel>Devices</IonLabel>*/}
            {/*</IonListHeader>*/}
            {/*<div  style={{height:"20vh",background:"#fff",margin:"12px",border:"1px solid #ddd",borderRadius:"15px"}}>*/}

            {/*</div>*/}
            <IonModal isOpen={showModal}
                      keyboardClose={true}
                      backdropDismiss={true}
                      onDidDismiss={()=>{this.showModal("",false)}}
                      mode="ios"
                      cssClass="confirm-transaction-modal"
                      swipeToClose={true}>
                <div className="nfc-modal">
                    {
                        metaInfo && mateData && mateData[metaInfo.value] && <IonCard>
                            <div>
                                <img src={mateData[metaInfo.value].image}/>
                            </div>
                            <IonCardHeader>
                                <IonCardTitle>{mateData[metaInfo.value].name}
                                <IonButton size="small" onClick={()=>{
                                    url.tunnelNFT(metaInfo.symbol,metaInfo.chain,metaInfo.value)
                                }}>CROSS</IonButton></IonCardTitle>
                                <IonCardSubtitle>
                                    {metaInfo && metaInfo.chain} Chain
                                </IonCardSubtitle>
                            </IonCardHeader>

                            <IonCardContent>
                                <IonItemGroup>
                                    <IonItemDivider mode="md">
                                        <IonLabel>Token Id</IonLabel>
                                    </IonItemDivider>
                                    <IonItem lines="none">
                                        <p className="work-break">{metaInfo && metaInfo.value}</p>
                                    </IonItem>
                                    <IonItemDivider mode="md">
                                        <IonLabel>Description</IonLabel>
                                    </IonItemDivider>
                                    <IonItem lines="none">
                                        <p className="work-break">{mateData[metaInfo.value].description}</p>
                                    </IonItem>
                                    <IonItemDivider mode="md">
                                        <IonLabel>Contract Address</IonLabel>
                                    </IonItemDivider>
                                    <IonItem lines="none">
                                        <p className="work-break">{metaInfo && utils.getAddressBySymbol(metaInfo.symbol,metaInfo.chain)}</p>
                                    </IonItem>
                                </IonItemGroup>
                            </IonCardContent>
                        </IonCard>
                    }
                    <div style={{position:"fixed",bottom:"0",background:"#fff",padding:"15px",width:"100%"}}>
                        <IonRow>
                            <IonCol>
                                <IonButton expand="block" fill="outline" onClick={() => this.showModal("",false)}>
                                    {i18n.t("close")}
                                </IonButton>
                            </IonCol>
                            <IonCol>
                                <IonButton expand="block" onClick={() => {
                                    url.transferNFT(metaInfo.symbol,metaInfo.chain,metaInfo.value)
                                }}>{i18n.t("transfer")}</IonButton>
                            </IonCol>
                        </IonRow>
                    </div>
                </div>
            </IonModal>
        </>;
    }
}

export default NFCRender