import * as React from 'react';
import {Counter, Land, LockedInfo, StarGridType} from "../../../types";
import {
    IonList,
    IonLabel,
    IonItem,
    IonItemDivider,
    IonAvatar,
    IonModal,
    IonInput,IonText,
    IonButton,
    IonRadioGroup,
    IonListHeader,
    IonRadio,IonCheckbox,IonSegment,IonSegmentButton,
    IonCol, IonRow
} from "@ionic/react"
import HexInfoCard from "./hex-info";
import {toAxial} from "../../../components/hexagons/utils";
interface Props{
    title?:string
    show:boolean
    onCancel:()=>void;
    onOk: (land:Land)=>void;
    ownerData:Array<Land>
    checkedCoo?:string
    onTabChange?:(tab:string)=>void;
    tab?:string
    lockedInfo?:LockedInfo
}
export const PlanetList:React.FC<Props> = ({show,tab,title,onCancel,ownerData,lockedInfo,onTabChange,checkedCoo,onOk})=>{

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
                    {
                        onTabChange &&
                        <IonItemDivider sticky>
                            <IonSegment mode="ios" color="primary" value={tab} onIonChange={(e)=>onTabChange(e.detail.value)}>
                                <IonSegmentButton value="owner">Owner</IonSegmentButton>
                                <IonSegmentButton value="marker">Marker</IonSegmentButton>
                            </IonSegment>
                        </IonItemDivider>
                    }
                    <IonItemDivider mode="md"/>
                    {
                        ownerData && ownerData.map((v, i)=>{
                            const hex = toAxial(v.coordinate);
                            return <IonItem onClick={()=>{
                                onOk(v)
                            }}>
                                <IonLabel className="ion-text-wrap">
                                    <IonRow>
                                        <IonCol size="4">
                                            <div>
                                                <small><IonText color="primary">[{hex.x},{hex.z}]</IonText></small>
                                                {checkedCoo && checkedCoo == v.coordinate &&
                                                <IonCheckbox checked disabled/>}
                                            </div>
                                        </IonCol>
                                        <IonCol size="8">
                                            {v && <HexInfoCard sourceHexInfo={{land:v,hex:hex,counter:v.counter}} lockedInfo={lockedInfo}/>}
                                        </IonCol>
                                    </IonRow>
                                </IonLabel>
                            </IonItem>
                        })
                    }
                </IonList>
            </div>
            <IonRow>
                <IonCol>
                    <IonButton mode="ios" onClick={() => onCancel()} expand="block" fill="outline" color="secondary">CLOSE</IonButton>
                </IonCol>
            </IonRow>
        </IonModal>
    </>)
}
