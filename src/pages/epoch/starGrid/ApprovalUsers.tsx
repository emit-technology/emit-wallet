import * as React from 'react';
import {
    IonList,
    IonLabel,
    IonItem,
    IonModal,
    IonButton,
    IonCol, IonRow, IonInput
} from "@ionic/react"
interface Props{
    show:boolean
    onOk?:(address:string)=>void;
    onCancelApprove?:(address:string)=>void;
    onCancel?:()=>void;
    data:Array<string>
}
export const ApprovalUsersModal:React.FC<Props> = ({show,onOk,onCancelApprove,onCancel,data})=>{

    const inputRef:any = React.createRef();

    return (<>
        <IonModal
            isOpen={show}
            onDidDismiss={() => onCancel()}
            cssClass="counter-list-modal"
        >
            <IonList>
                {
                    data && Object.keys(data).map((v,i)=>{
                        return <IonItem>
                            <IonLabel>
                                {i+1}
                            </IonLabel>
                            <IonLabel>
                                {v}
                            </IonLabel>
                            <IonButton size="small" onClick={()=>{
                               onCancelApprove(v)
                            }}>Cancel</IonButton>
                        </IonItem>
                    })
                }
                <IonItem>
                    <IonLabel>Approve To User</IonLabel>
                    <IonInput ref={inputRef}/>
                </IonItem>
            </IonList>
            <IonRow>
                <IonCol size="4">
                    <IonButton onClick={() => onCancel()} expand="block" fill="outline" color="secondary">CANCEL</IonButton>
                </IonCol>
                <IonCol  size="8">
                    <IonButton expand="block" onClick={() => {
                        const addr = inputRef.current.value;
                        onOk(addr)
                    }} color="primary">OK</IonButton>
                </IonCol>
            </IonRow>
        </IonModal>
    </>)
}
