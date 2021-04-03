import * as React from 'react';
import {
    IonButton,
    IonContent,
    IonHeader, IonInput,
    IonItem, IonLabel,
    IonList, IonPage,
    IonProgressBar, IonSpinner,
    IonText,
    IonTitle, IonToast,
    IonToolbar
} from "@ionic/react";
import i18n from "../../locales/i18n";
import url from "../../utils/url";
import {type} from "os";
import walletWorker from "../../worker/walletWorker";

interface State {
    password:string
    showToast:boolean;
    toastMessage?:string
    showProgress:boolean
    showPasswordTips:boolean
}

class Unlock extends React.Component<any, State>{

    state: State = {
        password:"",
        showToast:false,
        toastMessage:"",
        showProgress:false,
        showPasswordTips:false
    }

    componentDidMount() {
    }

    setShowToast = (f:boolean,m?:string) =>{
        this.setState({
            showToast:f,
            toastMessage:m
        })
    }

    confirm = async ()=>{
        const {password} = this.state;
        if(!password){
            this.setShowToast(true,"Please Input Password!");
            return;
        }
        this.setState({
            showProgress:true
        })
        const rest = await walletWorker.unlockWallet(password)
        if(rest){
            this.setState({
                showProgress:false
            })
            return Promise.resolve()
        }
    }

    render() {
        const {showToast,toastMessage,showProgress,password} = this.state;

        return <>
            <IonPage>
                <IonContent fullscreen>
                    <IonHeader>
                        <IonToolbar mode="ios" color="primary">
                            <IonTitle>
                                <IonText>{i18n.t("unlock")} {i18n.t("wallet")}</IonText>
                            </IonTitle>
                        </IonToolbar>
                        {showProgress && <IonProgressBar type="indeterminate"/>}
                    </IonHeader>
                    <div style={{padding:"15px 15px 0",textAlign:"center"}}>
                        <img src={"./assets/img/welcome.png"} style={{width:"200px"}}/>
                        <h1>{i18n.t("welcome")}</h1>
                        <p><IonText color="medium">The decentralized word waits</IonText></p>
                    </div>
                    <div style={{padding:"0 24px"}}>
                        <IonList>
                            <IonItem mode="ios">
                                <IonLabel position="floating"><IonText color="medium">{i18n.t("wallet")} {i18n.t("password")}</IonText></IonLabel>
                                <IonInput mode="ios" type="password" value={password} onIonChange={(e: any) => {
                                    this.setState({
                                        password:e.target.value!
                                    })
                                }}/>
                            </IonItem>
                        </IonList>
                    </div>
                    <div style={{padding:"12px 24px 0"}}>
                        <IonButton mode="ios" expand="block" size="large" disabled={!password || showProgress} onClick={()=>{
                            this.confirm().then(()=>{
                                url.home()
                            }).catch(e=>{
                                this.setState({
                                    showProgress:false
                                })
                                const err = typeof e=="string"?e:e.message;
                                this.setShowToast(true,err)
                            });
                        }}>{showProgress&&<IonSpinner name="bubbles" />}{i18n.t("unlock")}</IonButton>
                    </div>
                    <IonToast
                        mode="ios"
                        isOpen={showToast}
                        color="warning"
                        position="top"
                        onDidDismiss={() => this.setShowToast(false)}
                        message={toastMessage}
                        duration={2000}
                    />
                </IonContent>
            </IonPage>
        </>;
    }
}

export default Unlock