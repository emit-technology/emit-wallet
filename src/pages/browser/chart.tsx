import * as React from 'react';
import {IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar,IonLabel,IonSelect,IonSelectOption} from "@ionic/react";
import {chevronBackOutline, closeOutline, ellipsisHorizontal, statsChartOutline} from "ionicons/icons";
import url from "../../utils/url";
import {TOKEN_PAIRS,CHART_URL} from "../../config";
import {Plugins} from "@capacitor/core";
const dollar = require('../../img/icon/dollar.svg')

class Chart extends React.Component<any, any>{

    state:any = {
        symbolIn:"",
        useDollar:false,
    }

    componentDidMount() {
        Plugins.StatusBar.setBackgroundColor({
            color: "#222428"
        }).catch(e => {
            const err = typeof e == "string"?e:e.message;
            Plugins.Toast.show({
                text: err
            })
        })
    }

    render() {
        // const browserUrl = decodeURIComponent(this.props.match.params.url)
        let symbol = this.props.match.params.symbol
        let browserUrl = "https://www.dextools.io/app/bsc/pair-explorer/0x2e650c27320911abd7de4131a61120f6efee4fea"//[CHART_URL,"symbol","=",symbol,"&t=",Date.now()].join("")
        const {symbolIn,useDollar} = this.state;
        if(symbolIn){
            symbol = symbolIn;
            browserUrl = [CHART_URL,"symbol","=",symbol.split("/").join("_"),"&t=",Date.now()].join("")
        }else{
            symbol = symbol.split("_").join("/")
        }

        return <IonPage>
            <IonHeader mode="ios">
                <IonToolbar color="dark" mode="ios">
                    <IonIcon slot="start" src={closeOutline} style={{fontSize:"24px",marginRight:"15px"}} onClick={()=>{
                        Plugins.StatusBar.setBackgroundColor({
                            color: "#194381"
                        }).catch(e => {
                        })
                        url.back();
                    }}/>
                    <IonSelect slot="start" value={symbol} color="white" onIonChange={e=>{
                        this.setState({
                            symbolIn:e.detail.value
                        })
                    }}>
                        {
                            TOKEN_PAIRS.map(key=>{
                                // const value = key.split("/").join("_");
                                return <IonSelectOption value={key}>{key}</IonSelectOption>
                            })
                        }
                    </IonSelect>
                    {/*<IonTitle>Swap</IonTitle>*/}
                    {
                        (symbol=="LIGHT/BNB"||symbol=="LIGHT/BUSD") && <IonIcon slot="end" src={dollar} color={symbol=="LIGHT/BUSD"?"warning":"medium"} style={{fontSize:"24px",marginRight:"15px"}} onClick={()=>{
                            if(symbol=="LIGHT/BNB"){
                                this.setState({
                                    symbolIn:"LIGHT/BUSD"
                                })
                            }else{
                                this.setState({
                                    symbolIn:"LIGHT/BNB"
                                })
                            }
                        }}/>
                    }

                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen color="light">
                <iframe className="h5-iframe"
                        // scrolling="true"
                        style={{overflow: 'visible'}}
                        id="ifrModel"
                        ref="iframe"
                        src={browserUrl}
                        width="100%"
                        height="100%"
                        frameBorder="no"
                />
            </IonContent>


        </IonPage>
    }
}

export default Chart