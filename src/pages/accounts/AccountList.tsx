import * as React from 'react';
import {
    IonAlert,
    IonAvatar,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonModal,
    IonPage,
    IonRow,
    IonText,
    IonTitle,
    IonToast,
    IonToolbar
} from "@ionic/react";
import {arrowBackOutline, chevronForwardOutline, closeOutline, personAddOutline} from "ionicons/icons";
import url from "../../utils/url";
import {AccountModel, ChainType} from "@emit-technology/emit-lib";
import walletWorker from "../../worker/walletWorker";
import Avatar from 'react-avatar';
import * as utils from "../../utils"
import {AccountDetail} from "../../components/AccountDetail";
import {config} from "../../config";
import selfStorage from "../../utils/storage";
import i18n from "../../locales/i18n"
import copy from "copy-to-clipboard";
import {NoneData} from "../../components/None";

interface Props{
    version?: number
}
interface State{
    accounts: Array<AccountModel>
    showAccountDetail: boolean
    account?: AccountModel
    showChain: ChainType
    showAlert:boolean
    showToast:boolean
    toastMsg:string
    showAlertRemove: boolean
    data: Array<string>
    showConnectedSitesModal:boolean
    showCopyAlert:boolean
    privateKey?:string
    exportPrivateKey:boolean
}
export class AccountList extends React.Component<Props, State> {

    state:State = {
        accounts: [],
        showAccountDetail:false,
        showAlertRemove: false,
        showAlert: false,
        showToast:false,
        toastMsg: "",
        showChain: ChainType._,
        data:[],
        showConnectedSitesModal:false,
        showCopyAlert:false,
        exportPrivateKey:false
    }

    componentDidMount() {
       this.init().catch(e=>console.error(e))
    }

    init = async () =>{
        const accounts = await walletWorker.accounts();
        let account = this.state.account;
        if(!account){
            account = await walletWorker.accountInfo();
        }
        this.setState({
            accounts: accounts,
        })
    }

    setShowAlert = (f:boolean)=>{
        this.setState({
            showAlert: f
        })
    }

    setShowToast = (f:boolean,msg?:string)=>{
        this.setState({
            showToast:f,
            toastMsg:msg
        })
    }

    setShowAlertRemove = (f:boolean)=>{
        this.setState({
            showAlertRemove: f
        })
    }

    render() {
        const {accounts,showAccountDetail,exportPrivateKey,showCopyAlert,privateKey,account,showToast,toastMsg,showAlert,showChain,showAlertRemove,data,showConnectedSitesModal} = this.state;

        const {version} = this.props;

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonIcon color="primary" slot="start" icon={arrowBackOutline} size="large" onClick={()=>{
                           url.back();
                        }}/>
                        <IonTitle>{i18n.t("accounts")}</IonTitle>
                        <IonIcon slot="end" style={{marginRight: "12px"}} icon={personAddOutline} size="large" onClick={()=>{
                            url.accountCreate(url.path_settings_accounts());
                        }}/>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen scrollY>
                    {
                        accounts.map((v,i)=>{
                            const chains = [ChainType.EMIT,ChainType.ETH,ChainType.BSC,ChainType.TRON,ChainType.SERO];
                            return <IonCard key={i}>
                                <IonCardHeader>
                                    <IonCardTitle>
                                       <IonRow>
                                           <IonCol size="1">
                                               <IonAvatar>
                                                   <Avatar name={v.name} round size="30"/>
                                               </IonAvatar>
                                           </IonCol>
                                           <IonCol size="10">
                                               <IonLabel>{v.name}</IonLabel>
                                           </IonCol>
                                       </IonRow>
                                    </IonCardTitle>
                                    {v.timestamp && <IonCardSubtitle>{i18n.t("createdAt")} {utils.dateFormat(new Date(v.timestamp * 1000))}</IonCardSubtitle>}
                                </IonCardHeader>
                                <IonCardContent>
                                    {
                                        v.addresses && chains.map(chainId =>{
                                            return <IonItem key={chainId} detail detailIcon={chevronForwardOutline} onClick={()=>{
                                                this.setState({
                                                    account: v,
                                                    showAccountDetail: true,
                                                    showChain: chainId
                                                })
                                            }}>
                                                <IonAvatar slot="start">
                                                    <img src={`./assets/img/logo/${ChainType[chainId]}.png`}/>
                                                </IonAvatar>
                                                <IonLabel className="ion-text-wrap">
                                                    {v.addresses[chainId]}
                                                </IonLabel>
                                            </IonItem>
                                        })
                                    }
                                    <IonRow>
                                        <IonCol>
                                            <IonButton size="small" fill="outline" expand="block" color="danger" onClick={()=>{
                                                this.setState({
                                                    account: v,
                                                    showAlertRemove: true
                                                })
                                            }}>{i18n.t("removeAccount")}</IonButton>
                                        </IonCol>
                                        <IonCol>
                                            <IonButton size="small" fill="outline" expand="block" onClick={()=>{
                                                this.setState({
                                                    account: v,
                                                    showAlert: true
                                                })
                                            }}>{i18n.t("backupAccount")}</IonButton>
                                        </IonCol>
                                        <IonCol>
                                            <IonButton size="small" fill="outline" expand="block" onClick={()=>{
                                                this.setState({
                                                    showConnectedSitesModal:true,
                                                    account: v
                                                })
                                            }}>{i18n.t("connectedSites")}</IonButton>
                                        </IonCol>
                                    </IonRow>
                                </IonCardContent>
                            </IonCard>
                        })
                    }
                    <IonModal isOpen={showAccountDetail} cssClass="common-modal" swipeToClose onDidDismiss={() =>
                        this.setState({showAccountDetail: false})}>
                        {
                            account && <AccountDetail account={account} onBackup={()=>{
                                this.setState({showAccountDetail: false})
                                this.setShowAlert(true)
                            }} showChainId={showChain} onClose={() => {
                                this.setState({showAccountDetail: false})
                            }} onExportPrivateKey={version && version==2 ? ()=>{
                                this.setState({showAccountDetail: false, exportPrivateKey:true})
                                this.setShowAlert(true)
                            }:undefined}/>
                        }
                    </IonModal>
                    <IonAlert
                        isOpen={showAlertRemove}
                        onDidDismiss={() => this.setShowAlertRemove(false)}
                        cssClass='my-custom-class'
                        header={`${i18n.t("removeAccount")}`}
                        message={i18n.t("removeTips")}
                        subHeader={account && account.name}
                        inputs={[
                            {
                                name: 'password',
                                type: 'password',
                                placeholder: i18n.t("inputPassword")
                            }]}
                        buttons={[
                            {
                                text:  i18n.t("cancel"),
                                role: 'cancel',
                                cssClass: 'secondary',
                                handler: () => {
                                    console.log('Confirm Cancel');
                                }
                            },
                            {
                                text: i18n.t("ok"),
                                handler: (d) => {
                                    if(!d["password"]){
                                        this.setShowToast(true, i18n.t("inputPassword"))
                                        return;
                                    }
                                    const accountId = account.accountId;
                                    const accountIdLocal = selfStorage.getItem("accountId");
                                    walletWorker.removeAccount(accountId,d["password"]).then((rest: any) => {
                                        if(accountIdLocal == accountId){
                                            selfStorage.removeItem("accountId");
                                            selfStorage.removeItem(accountId);
                                            walletWorker.accounts().then(acts=>{
                                                if(acts && acts.length>0){
                                                    selfStorage.setItem("accountId",acts[0].accountId);
                                                    selfStorage.setItem(accountId,acts[0]);
                                                }
                                            })
                                        }
                                        this.setShowToast(true,`Removed ${account && account.name} successfully`)
                                        this.init().catch(e=>console.error(e))
                                    }).catch(e=>{
                                        const err = typeof e == 'string'?e:e.message;
                                        this.setShowToast(true,err);
                                        console.error(e)
                                    })
                                }
                            }
                        ]}
                    />
                    <IonAlert
                        isOpen={showAlert}
                        onDidDismiss={() => this.setShowAlert(false)}
                        cssClass='my-custom-class'
                        header={`${i18n.t("backupAccount")} ${account && account.name}`}
                        inputs={[
                            {
                                name: 'password',
                                type: 'password',
                                placeholder: i18n.t("inputPassword")
                            }]}
                        buttons={[
                            {
                                text: i18n.t("cancel"),
                                role: 'cancel',
                                cssClass: 'secondary',
                                handler: () => {
                                    console.log('Confirm Cancel');
                                }
                            },
                            {
                                text:  i18n.t("ok"),
                                handler: (d) => {
                                    if(!d["password"]){
                                        this.setShowToast(true,i18n.t("inputPassword"))
                                        return;
                                    }
                                    const accountId = account.accountId;
                                    if(exportPrivateKey){
                                        walletWorker.exportPrivateKey(accountId, d["password"],showChain).then((rest: any) => {
                                            this.setState({showCopyAlert:true,privateKey: rest})
                                        }).catch(e=>{
                                            const err = typeof e == 'string'?e:e.message;
                                            this.setShowToast(true,err);
                                            console.error(e)
                                        })
                                    }else{
                                        walletWorker.exportMnemonic(accountId, d["password"]).then((rest: any) => {
                                            if(rest && rest.split(" ").length == 12){
                                                config.TMP.MNEMONIC = rest;
                                                url.accountBackup(url.path_settings_accounts())
                                            }else {
                                                this.setState({showCopyAlert:true,privateKey: rest})
                                            }
                                        }).catch(e=>{
                                            const err = typeof e == 'string'?e:e.message;
                                            this.setShowToast(true,err);
                                            console.error(e)
                                        })
                                    }
                                }
                            }
                        ]}
                    />
                    <IonToast
                        mode="ios"
                        isOpen={showToast}
                        color="primary"
                        position="top"
                        onDidDismiss={() => this.setShowToast(false)}
                        message={toastMsg}
                        duration={2000}
                    />

                    <IonModal isOpen={showConnectedSitesModal}  cssClass="common-modal" swipeToClose onDidDismiss={() =>
                        this.setState({showConnectedSitesModal: false})}>
                        <IonPage>
                            <IonHeader>
                                <IonToolbar>
                                    <IonTitle>{i18n.t("connectedSites")}</IonTitle>
                                    <IonIcon slot="end" style={{marginRight: "12px"}} icon={closeOutline} size="large" onClick={()=>{
                                       this.setState({showConnectedSitesModal:false})
                                    }}/>
                                </IonToolbar>
                            </IonHeader>
                            <IonContent fullscreen scrollY>
                                <IonItem lines="none">
                                    <IonLabel color="medium" className="ion-text-wrap">
                                        {i18n.t("accounts")} <b><IonText color="primary">{account && account.name}</IonText></b> {i18n.t("connectTip")}
                                    </IonLabel>
                                </IonItem>
                                {
                                    data && data.length>0 ? data.map((v,i)=>{
                                        return <IonItem key={i}>
                                            <IonAvatar slot="start">
                                                <Avatar round name={v && v.replace("http://","").replace("https://","")} size="30"/>
                                            </IonAvatar>
                                            <IonLabel>
                                                {v}
                                            </IonLabel>
                                            <IonButton fill="outline" size="small" slot="end" onClick={()=>{
                                                this.init().catch(e=>console.log(e))
                                            }}>{i18n.t("disconnect")}</IonButton>
                                        </IonItem>
                                    }):<NoneData desc={i18n.t("noData")}/>
                                }
                            </IonContent>
                        </IonPage>
                    </IonModal>

                    <IonAlert
                        isOpen={showCopyAlert}
                        onDidDismiss={() => this.setState({
                            showCopyAlert:false
                        })}
                        header={i18n.t("backupAccount")}
                        message={privateKey}
                        buttons={[
                            {
                                text: i18n.t("cancel"),
                                role: 'cancel',
                                cssClass: 'secondary',
                                handler: () => {
                                    this.setState({showCopyAlert:false,privateKey:""});
                                }
                            },
                            {
                                text: i18n.t("copy"),
                                handler: () => {
                                    copy(privateKey)
                                    copy(privateKey)
                                    this.setState({showCopyAlert:false,privateKey:""});
                                    this.setShowToast(true,i18n.t("copied"))
                                }
                            }
                        ]}
                    />
                </IonContent>
            </IonPage>
        );
    }
}