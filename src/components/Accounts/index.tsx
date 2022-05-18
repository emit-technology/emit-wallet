import * as React from 'react';
import {IonModal,IonItem,IonLabel,IonAvatar,IonRow,IonCol,IonButton,IonItemDivider,IonCheckbox,IonText} from '@ionic/react'
import {AccountModel, ChainType} from "../../types";
import i18n from "../../locales/i18n";
import Avatar from 'react-avatar';
import * as utils from "../../utils";

interface Props {
    isOpen:boolean;
    onSelect: (account:AccountModel) => void;
    onCancel: ()=>void;
    accounts:Array<AccountModel>;
    account?:AccountModel
}

const AccountsModal:React.FC<Props> = ({isOpen,onCancel,onSelect,accounts,account}) =>{
    return <>
        <IonModal isOpen={isOpen}
                  swipeToClose={true}
                  mode="ios"
                  cssClass='epoch-modal'
                  onDidDismiss={()=>onCancel()}>
            <div className="epoch-md">
                <IonItemDivider sticky color="primary" mode="ios">{i18n.t("selectAn")} {i18n.t("account")}</IonItemDivider>
                {
                    accounts && accounts.map((v,i)=>{
                        return <IonItem color={account && account.accountId == v.accountId?"primary":"white"} onClick={()=>{
                            if(!(account && account.accountId == v.accountId)){
                                onSelect(v)
                            }
                        }}>
                            <IonAvatar>
                                <Avatar name={v.name} size="30" round={true} />
                            </IonAvatar>
                            <IonLabel className="ion-text-wrap">
                                <h2><b>{v.name}</b></h2>
                                <p>{utils.ellipsisStr(v.addresses[ChainType.ETH],8)}</p>
                            </IonLabel>
                            {
                                account && account.accountId == v.accountId &&
                                    <IonCheckbox checked color="success"/>
                            }
                        </IonItem>
                    })
                }
                <div></div>
            </div>
            <div>
                <IonRow>
                    <IonCol size="4">
                        <IonButton onClick={()=>onCancel()} expand="block" fill="outline">{i18n.t("cancel")}</IonButton>
                    </IonCol>
                    <IonCol size="8">
                        <IonButton expand="block" onClick={()=>{
                            onCancel()
                        }}>{i18n.t("ok")}</IonButton>
                    </IonCol>
                </IonRow>
            </div>
        </IonModal>
    </>
}

export default AccountsModal