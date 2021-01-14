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
    IonContent,
    IonHeader,
    IonList,
    IonItem,
    IonText,
    IonPage,
    IonTitle,
    IonToolbar,
    IonLabel,
    IonIcon
} from "@ionic/react";
import {chevronBack, chevronForward} from "ionicons/icons";
import url from "../../utils/url";
import {Plugins} from "@capacitor/core";
import i18n from "../../locales/i18n"

const {Browser} = Plugins;

const items = [
    {name: "Website", url: "https://emit.technology", value: "https://emit.technology"},
    {name: "Blog", url: "https://blog.emit.technology", value: "https://blog.emit.technology"},
    {name: "Community", url: "https://community.emit.technology", value: "https://community.emit.technology"},
    {name: "Github", url: "https://github.com/emit-technology", value: "https://github.com/emit-technology"},
    {name: "Telegram", url: "https://t.me/EMITCommunication", value: "https://t.me/EMITCommunication"},
    {name: "Facebook", url: "https://www.facebook.com/EMIT.Tec", value: "https://www.facebook.com/EMIT.Tec"},
    {name: "Twitter", url: "https://twitter.com/EMIT_Technology", value: "https://twitter.com/EMIT_Technology"},
    {name: "Medium", url: "https://medium.com/@emittechnology", value: "https://medium.com/@emittechnology"},
    {name: "Reddit", url: "https://www.reddit.com/user/emittechnology", value: "https://www.reddit.com/emittechnology"},
]

class About extends React.Component<any, any> {

    state: any = {
        info: {}
    }

    componentDidMount() {
        Plugins.Device.getInfo().then((rest: any) => {
            console.log(rest, "rest")
            this.setState({
                info: rest
            })
        })
    }

    render() {
        const {info} = this.state;
        return <IonPage>
            <IonContent fullscreen color="light">
                <IonHeader>
                    <IonToolbar mode="ios" color="primary">
                        <IonIcon src={chevronBack} slot="start" size="large" onClick={() => {
                            url.back()
                        }}/>
                        <IonTitle><IonText>{i18n.t("aboutUs")}</IonText></IonTitle>
                    </IonToolbar>
                </IonHeader>
                <div style={{textAlign: "center", margin: "24px 0 30px"}}>
                    <img src={require("../../img/EMIT.png")} height={100} width={100}/>
                    <h3>EMIT Wallet</h3>
                    {info.appVersion && <IonText color="medium">V{info.appVersion}({info.appBuild})</IonText>}
                </div>
                <IonList>
                    {
                        items.map((v) => {
                            return <IonItem onClick={() => {
                                Browser.open({url: v.url, windowName: v.name}).catch(error => {
                                    console.log(error)
                                })
                            }}>
                                <IonLabel position="stacked">{v.name}</IonLabel>
                                <IonText color="secondary">{v.value}</IonText>
                                <IonIcon src={chevronForward} color="medium" slot="end"/>
                            </IonItem>
                        })
                    }
                    <IonItem lines="none">
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPage>;
    }
}

export default About