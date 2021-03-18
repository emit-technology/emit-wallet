import * as React from 'react';
import {IonContent, IonButton, IonIcon, IonPage,IonItem,IonRow,IonCol,IonText, IonLabel,IonProgressBar, IonTitle, IonToolbar} from "@ionic/react";
import {chevronBack} from "ionicons/icons";
import url from "../../../utils/url";
import "./index.scss";
import {Plugins} from "@capacitor/core";

interface State{
    showProgress:boolean
}

class Altar extends React.Component<any, State>{
    state:State = {
        showProgress:false
    }

    componentDidMount() {
        Plugins.StatusBar.setBackgroundColor({
            color: "#1e274e"
        })
    }

    render() {
        const {showProgress} = this.state;

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
                            <IonLabel className="text-center text-bold" style={{color:"#edcc67"}}>ALTAR</IonLabel>
                            <img src={require("../img/help.png")} width={28}/>
                        </IonItem>

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
                        </div>
                        <div className="progress">
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
                            <div className="start-btn">START</div>
                        </div>
                    </div>
                </IonContent>
            </IonPage>
        );
    }
}

export default Altar