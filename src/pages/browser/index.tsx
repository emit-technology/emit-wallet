import * as React from 'react';
import {IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar} from "@ionic/react";
import {chevronBackOutline, closeOutline, ellipsisHorizontal, statsChartOutline} from "ionicons/icons";
import url from "../../utils/url";
import {Plugins} from "@capacitor/core";

class Browser extends React.Component<any, any>{

    componentDidMount() {

    }

    render() {
        const browserUrl = decodeURIComponent(this.props.match.params.url)

        return <IonPage>
            <IonHeader mode="ios">
                <IonToolbar color="dark" mode="ios">
                    <IonIcon slot="start" src={chevronBackOutline} style={{fontSize:"24px",marginRight:"15px"}} onClick={()=>{
                        Plugins.StatusBar.setBackgroundColor({
                            color: "#194381"
                        }).catch(e => {
                        })
                        window.history.back()
                    }}/>
                    <IonIcon slot="start" src={closeOutline} style={{fontSize:"24px",marginRight:"15px"}} onClick={()=>{
                        Plugins.StatusBar.setBackgroundColor({
                            color: "#194381"
                        }).catch(e => {
                        })
                        url.back();
                    }}/>
                    <IonTitle>Swap</IonTitle>
                    <IonIcon slot="end" src={ellipsisHorizontal} style={{fontSize:"24px",marginRight:"15px"}} onClick={()=>{

                    }}/>
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

export default Browser