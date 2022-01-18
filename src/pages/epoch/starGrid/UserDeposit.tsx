import * as React from 'react';
import {
    IonList,
    IonLabel,
    IonItem,
    IonModal,
    IonButton,
    IonListHeader,IonItemDivider,
    IonCol, IonRow,IonText,IonBadge
} from "@ionic/react"
import {DepositType, StarGridType, UserDeposit} from "../../../types";
import {formatDate, fromValue, nFormatter} from "../../../utils";
import {NoData} from "./NoData";
interface Props{
    title?:string
    show:boolean
    onCancel:()=>void;
    onWithdraw:(userDeposit:UserDeposit)=>void;
    data: Array<UserDeposit>
}
export const UserDepositModal:React.FC<Props> = ({show,title,onCancel,data,onWithdraw})=>{

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
            <IonList mode="ios">
                {
                    title &&
                    <IonListHeader mode="ios">
                        {title}
                    </IonListHeader>
                }
                <IonItem color="primary">
                    <IonLabel className="ion-text-wrap">
                        <IonRow>
                            <IonCol size="3"><IonLabel>Index</IonLabel></IonCol>
                            <IonCol size="6"><IonLabel>Info</IonLabel></IonCol>
                            <IonCol size="3"><IonLabel>Operator</IonLabel></IonCol>
                        </IonRow>
                    </IonLabel>
                </IonItem>
                {
                    data && data.length>0  ?  data.map((v,i)=>{
                        return <IonItem>
                            <IonLabel className="ion-text-wrap">
                                <IonRow>
                                    <IonCol size="3">
                                        <b><IonText color="primary">{v.index}</IonText></b><br/>
                                        <small><IonText color="medium">{formatDate(v.createTime*1000)}</IonText></small>
                                    </IonCol>
                                    <IonCol size="6">
                                        <p>
                                               Deposited&nbsp;<b><IonText color="secondary">{nFormatter(fromValue(v.totalAmount,18),3)}</IonText></b>
                                               &nbsp;<IonText color="primary">{
                                                   DepositType.LP == v.depositType ?`${StarGridType[v.enType]}-BUSD-LQ`:"BUSD"
                                           }</IonText>
                                        </p>
                                        <p>Created&nbsp;<b><IonText color="secondary">{v.count}</IonText></b>&nbsp;<IonText color="primary">EMIT-{StarGridType[v.enType]}</IonText></p>
                                        <p>{v.canWithDraw ? <IonBadge color="success">FINISHED</IonBadge>:<IonBadge>STAKING</IonBadge>}</p>
                                    </IonCol>
                                    <IonCol size="3">
                                        <IonButton mode="ios" expand="block" fill="outline" size="small" onClick={()=>{
                                           onWithdraw(v)
                                        }}>Withdraw</IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonLabel>
                        </IonItem>
                    }):
                        <IonItem>
                            <IonLabel className="ion-text-wrap">
                                <IonRow>
                                    <IonCol size="12">
                                        <NoData title={"No Data"}/>
                                    </IonCol>
                                </IonRow>
                            </IonLabel>
                        </IonItem>
                }
            </IonList>
            </div>
            <IonRow>
                <IonCol size={"12"}>
                    <IonButton mode="ios" onClick={() => onCancel()} expand="block" fill="outline" color="secondary">CLOSE</IonButton>
                </IonCol>
            </IonRow>
        </IonModal>
    </>)
}
