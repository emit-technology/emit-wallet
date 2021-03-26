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
            mateData[d.value]  = META_TEMP[d.symbol]

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
        const {showModal,mateData,metaInfo} = this.state;
        return <>
            <div className="card-page">
                <div className="card-inset">
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
                                <IonButton expand="block"  mode="ios" fill="outline" onClick={() => this.showModal("",false)}>
                                    {i18n.t("close")}
                                </IonButton>
                            </IonCol>
                            <IonCol>
                                <IonButton expand="block" mode="ios" onClick={() => {
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