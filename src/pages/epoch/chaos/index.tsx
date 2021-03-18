import * as React from 'react';
import {IonCol, IonContent, IonIcon, IonItem, IonLabel, IonPage, IonProgressBar, IonRow, IonText} from "@ionic/react";
import {chevronBack} from "ionicons/icons";
import url from "../../../utils/url";
import "./index.scss"
import {Plugins} from "@capacitor/core";

interface State{
    showProgress:boolean
}

class Chaos extends React.Component<any, State>{

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
                            <IonLabel className="text-center text-bold" style={{color:"#edcc67"}}>CHAOS</IonLabel>
                            <img src={require("../img/help.png")} width={28}/>
                        </IonItem>

                        <div className="starfield">
                            <div className="static"></div>
                            <div className="moving-1"></div>
                            <div className="moving-2"></div>
                            <div className="moving-3"></div>
                        </div>

                        <div className="axe-btn">Change Axe</div>
                        <div style={{margin:"30px 0 0"}}></div>
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

                        <div className="chaos">
                            <div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <div>
                                <img src={require("../img/axe_0.png")}/>
                            </div>
                            <div>
                                <img src={require("../img/axe_1.png")}/>
                            </div>
                        </div>

                        <div>
                            <div className="chaos-light">
                                <img src={require("../img/light.png")}/>
                            </div>
                            <div className="chaos-dark">
                                <img src={require("../img/dark.png")}/>
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

export default Chaos