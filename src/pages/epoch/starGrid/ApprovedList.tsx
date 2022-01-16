import * as React from 'react';
import {
    IonList,
    IonLabel,
    IonItem,
    IonItemDivider,
    IonModal,
    IonText,
    IonButton,
    IonListHeader,
    IonCol, IonRow,IonInput
} from "@ionic/react"
import {StarGridTrustInfo} from "../../../types";
interface Props{
    title?:string
    show:boolean
    onCancel:()=>void;
    onCancelApprove:(address:string)=>void;
    onApprove:(address:string)=>void;
    data: StarGridTrustInfo
}
export const ApprovedList:React.FC<Props> = ({show,title,onCancel,data,onCancelApprove,onApprove})=>{

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
                    You have trusted <IonText color="secondary">&nbsp;{data.approvedCount}&nbsp;</IonText> users,
                    and <IonText color="secondary">&nbsp;{data.beApprovedCount}&nbsp;</IonText> users trusted you,
                    the trust rate is <IonText color="secondary">&nbsp;{data.trustRate}&nbsp;</IonText>
                </IonItemDivider>}
                {data && data.approved && data.approved.length>0 && <IonItemDivider  sticky color="primary">Trusted User List</IonItemDivider>}
                {
                    data && data.approved &&  data.approved.map((v,i)=>{
                        return <IonItem>
                            <IonLabel className="ion-text-wrap">
                                <IonRow>
                                    <IonCol size="2">
                                        <small>{i+1}</small>
                                    </IonCol>
                                    <IonCol size="7">
                                        <small>{v.user}</small>
                                    </IonCol>
                                    <IonCol size="3">
                                        <IonButton mode="ios" expand="block" fill="outline" size="small" onClick={()=>{
                                            onCancelApprove(v.user)
                                        }}>Untrust</IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonLabel>
                        </IonItem>
                    })
                }
                <IonItemDivider  sticky color="primary">Trust New User</IonItemDivider>
                <IonItem>
                    <IonLabel position={"stacked"}>BSC Address</IonLabel>
                    <IonInput ref={inputRef} placeholder="0x00000000000000000..."/>
                </IonItem>
            </IonList>
            </div>
            <IonRow>
                <IonCol size={"4"}>
                    <IonButton mode="ios" onClick={() => onCancel()} expand="block" fill="outline" color="secondary">CANCEL</IonButton>
                </IonCol>
                <IonCol size={"8"}>
                    <IonButton expand="block" mode="ios" onClick={()=>{
                        onApprove(inputRef.current.value);
                    }}>Trust</IonButton>
                </IonCol>
            </IonRow>
        </IonModal>
    </>)
}
