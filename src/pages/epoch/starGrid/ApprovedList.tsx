import * as React from 'react';
import {
    IonList,
    IonLabel,
    IonItem,
    IonItemDivider,
    IonModal,
    IonText,
    IonButton,
    IonListHeader,IonBadge,
    IonCol, IonRow,IonInput
} from "@ionic/react"
import {StarGridTrustInfo} from "../../../types";
import {fromValue} from "../../../utils";
import i18n from "../../../locales/i18n"
interface Props{
    title?:string
    show:boolean
    onCancel:()=>void;
    onCancelApprove:(address:string)=>void;
    onApprove:(address:string)=>void;
    data: StarGridTrustInfo
    owner:string
}
export const ApprovedList:React.FC<Props> = ({show,title,owner,onCancel,data,onCancelApprove,onApprove})=>{

    const inputRef:any = React.createRef();

    return (<>
        <IonModal
            isOpen={show}
            onDidDismiss={() => onCancel()}
            cssClass="epoch-modal"
            mode="ios"
            swipeToClose={false}
        >
            <div className="epoch-md">
            <IonList mode="md">
                {
                    title &&
                    <IonListHeader mode="ios">
                        {title}
                    </IonListHeader>
                }
                {data &&
                <IonItemDivider mode="md">
                    To: <IonText color="secondary"><b>&nbsp;{data.approvedCount}&nbsp;</b></IonText> users,
                    From: <IonText color="secondary"><b>&nbsp;{data.beApprovedCount}&nbsp;</b></IonText> users,
                    Added: <IonText color="secondary"><b>&nbsp;{fromValue(data.trustRate,16).toFixed(2)}%&nbsp;</b></IonText>
                </IonItemDivider>}
                <div  className="counter-list-half">
                    {data && data.approved && data.approved.length>0 && <IonItemDivider  sticky color="primary">Trusted User List</IonItemDivider>}
                    {
                        data && data.approved &&  data.approved.map((v,i)=>{
                            return <>
                                <IonItem key={i}>
                                    <IonLabel className="ion-text-wrap">
                                        <IonRow>
                                            <IonCol size="2">
                                                <IonBadge color="secondary">{v.user == owner?"To":"From"}</IonBadge>
                                            </IonCol>
                                            <IonCol size="7">
                                                <small>{v.user == owner?v.operator:v.user}</small>
                                            </IonCol>
                                            <IonCol size="3">
                                                {v.user == owner ?<IonBadge color="success">Trusted</IonBadge>:<IonButton mode="ios" expand="block" fill="outline" size="small" onClick={()=>{
                                                    onCancelApprove(v.user)
                                                }}>{i18n.t("untrust")}</IonButton>}
                                            </IonCol>
                                        </IonRow>
                                    </IonLabel>
                                </IonItem>
                            </>
                        })
                    }
                </div>
                <IonItemDivider  sticky color="primary">{i18n.t("trustNewUser")}</IonItemDivider>
                <IonItem>
                    <IonLabel position={"stacked"}>BSC {i18n.t("address")}</IonLabel>
                    <IonInput ref={inputRef} placeholder="0x00000000000000000..."/>
                </IonItem>
            </IonList>
            </div>
            <IonRow>
                <IonCol size={"4"}>
                    <IonButton mode="ios" onClick={() => onCancel()} expand="block" fill="outline" color="secondary">{i18n.t("cancel")}</IonButton>
                </IonCol>
                <IonCol size={"8"}>
                    <IonButton expand="block" mode="ios" onClick={()=>{
                        onApprove(inputRef.current.value);
                    }}>{i18n.t("trust")}</IonButton>
                </IonCol>
            </IonRow>
        </IonModal>
    </>)
}
