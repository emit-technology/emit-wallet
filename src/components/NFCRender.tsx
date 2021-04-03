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

    componentDidMount() {
        // this.init().catch(e => {
        //     console.error(e)
        // })
    }
    //
    // componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<any>, snapshot?: any) {
    //     if(prevProps != this.props){
    //         this.init().catch(e => {
    //             console.error(e)
    //         })
    //     }
    // }

    // init = async () => {
    //     const {data} = this.props
    //     if(!data){
    //         return
    //     }
    //     const mateData:any = {};
    //     for(let d of data){
    //         //TODO for test
    //         mateData[d.value]  = META_TEMP[d.symbol]
    //
    //         //
    //         // if(!d.uri){
    //         //     continue;
    //         // }
    //         // const rest = await rpc.req(d.uri,{})
    //         // mateData[d.value] = rest
    //     }
    //     this.setState({
    //         mateData:mateData
    //     })
    // }

    showModal = (v:any,f:boolean)=>{
        this.setState({
            metaInfo:v,
            showModal:f
        })
    }

    render() {
        const {data} = this.props;
        return <>
            <div className="card-page">
                <div className="card-inset">
                    {
                        data && data.map((v: any,index:number) => {
                            //lines={index == data.length-1?"none":"inset"}
                            const meta = v.metaData?v.metaData:{};
                            return <CardTransform src={meta.image}
                                                  title={meta.name} subTitle={v.value} chain={v.chain}
                                                  timestamp={Date.now()} description={meta.description}
                                                  dna={utils.getAddressBySymbol(v.symbol,v.chain)} symbol={v.symbol}/>
                        })
                    }

                </div>
            </div>
        </>;
    }
}

export default NFCRender