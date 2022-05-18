import * as React from 'react';
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonSearchbar,IonList,IonListHeader,IonLabel,IonItem,IonItemDivider,IonAvatar} from "@ionic/react";

interface State {
    bUrl:string
}
class TabBrowser extends React.Component<any, State>{

    state:State = {
        bUrl: ""
    }

    render() {
        const {bUrl} = this.state;
        return (
            <IonPage>
                <IonHeader>
                    <IonSearchbar value={bUrl} mode="ios"></IonSearchbar>
                </IonHeader>
                <IonContent fullscreen style={{textAlign:"center"}}>

                    <IonItemDivider sticky color="primary" mode="ios">EPOCH/Origin</IonItemDivider>
                    <IonItem>
                        <IonAvatar>

                        </IonAvatar>
                        <IonLabel>

                        </IonLabel>
                    </IonItem>
                </IonContent>
            </IonPage>
        );
    }
}

export default TabBrowser;