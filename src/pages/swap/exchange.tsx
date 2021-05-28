import * as React from 'react';
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from "@ionic/react";

class Exchange extends React.Component<any, any>{

    render() {
        return  <IonPage>
            <IonHeader>
                <IonToolbar color="primary" mode="ios">
                    <IonTitle>Exchange</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen color="light">
                <div>

                </div>
            </IonContent>
        </IonPage>;
    }
}

export default Exchange