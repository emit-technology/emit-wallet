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
    IonSlides,
    IonSlide,
    IonContent,
    IonApp,
    IonButton,
    IonPage,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonText
} from '@ionic/react';
import url from "../utils/url";
import {
    Plugins,
} from '@capacitor/core';
import selfStorage from "../utils/storage";
import i18n from "../locales/i18n";
const { StatusBar,Camera } = Plugins;

const slideOpts = {
    initialSlide: 0,
    speed: 400
};

class Slides extends React.Component<any,any>{

    state:any = {}

    componentDidMount() {
        StatusBar.setBackgroundColor({
            color:"#FFFFFF"
        })
        setTimeout(()=>{
            this.setState({
                render:true
            })
        },100)
    }

    render() {
        const {checked} = this.state;
        return <IonApp>
            <IonPage>
                <IonContent fullscreen style={{overscroll: "unset"}} className="ion-padding" scrollY={false}>
                    <IonSlides pager={true} options={slideOpts} mode="ios">
                        <IonSlide>
                            <div>
                                <img src="./assets/img/slide-1.png"/><br/>
                                <h2>{i18n.t("slide.page1.title")}</h2>
                                <p>{i18n.t("slide.page1.desc")}</p>
                            </div>

                        </IonSlide>
                        <IonSlide>
                            <div>
                                <img src="./assets/img/slide-2.png"/>
                                <h2>{i18n.t("slide.page2.title")}</h2>
                                <p>
                                    {i18n.t("slide.page2.desc")}
                                    {/*<b>DeWe</b> is Decentralized World Economy use EMIT. <b>EPOCH</b> is ecological cluster implements DeWe*/}
                                </p>
                                 </div>
                        </IonSlide>
                        <IonSlide>
                            <div>
                                <img src="./assets/img/slide-3.png"/>
                                <h2>{i18n.t("slide.page3.title")}</h2>
                                <p>{i18n.t("slide.page3.desc")}</p>
                                <IonButton disabled={!checked} onClick={()=>{
                                    const accountId = selfStorage.getItem("accountId");
                                    if(!accountId){
                                        url.accountCreate();
                                    }else{
                                        selfStorage.setItem("viewedSlide",true);
                                        url.home();
                                    }
                                }}>{i18n.t("slide.gettingStarted")}</IonButton>
                                <div style={{textAlign:"center",padding:"0 20vw"}}>
                                    <IonItem mode="ios">
                                        <IonCheckbox mode="ios" onIonChange={(e)=>{
                                            this.setState({
                                                checked:e.detail.checked
                                            })
                                            Plugins.Browser.open({url:"https://emit.technology/wallet/terms-of-service.html"}).catch()
                                        }}/>
                                        <IonLabel color="primary" >{i18n.t("termOfService")}</IonLabel>
                                    </IonItem>
                                </div>
                            </div>
                        </IonSlide>
                    </IonSlides>
                </IonContent>
            </IonPage>
        </IonApp>
    }
}




export default Slides;