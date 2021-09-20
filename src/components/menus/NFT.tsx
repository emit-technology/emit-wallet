import * as React from 'react';
import {
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonNote,IonChip,IonInput,IonRow,IonCol,IonButton
} from '@ionic/react';
import "./index.scss"
import {menuController} from "@ionic/core"
class MenuNFT extends React.Component<any, any>{

    render() {
        return (
            <IonMenu contentId="main" menuId="nft-menu" type="overlay" onIonDidClose={(e)=>{
                console.log(e)
            }}>
                <IonContent >
                    <div style={{padding:"12px 0 50px"}}>
                        <IonList id="inbox-list" mode="md">
                            <IonListHeader>Category</IonListHeader>
                            <IonItem className="ion-text-wrap">
                                <IonChip color="danger" style={{border:"1px solid"}}>
                                    <IonLabel>Device</IonLabel>
                                </IonChip>
                                <IonChip color="dark">
                                    <IonLabel>Medal</IonLabel>
                                </IonChip>
                            </IonItem>
                        </IonList>

                        <IonList id="inbox-list" mode="md">
                            <IonListHeader>Attribute</IonListHeader>
                            <IonItem className="ion-text-wrap">
                                <IonChip color="danger" style={{border:"1px solid"}}>
                                    <IonLabel>DARK</IonLabel>
                                </IonChip>
                                <IonChip color="dark">
                                    <IonLabel>LIGHT</IonLabel>
                                </IonChip>
                            </IonItem>
                        </IonList>

                        <IonList id="inbox-list" mode="md">
                            <IonListHeader>Price</IonListHeader>
                            <IonItem>
                                <IonRow>
                                    <IonCol><input size={12} className="input-price"/></IonCol>
                                    <IonCol>-</IonCol>
                                    <IonCol><input  size={12} className="input-price"/></IonCol>
                                </IonRow>
                            </IonItem>
                        </IonList>
                        <IonList id="inbox-list" mode="md">
                            <IonListHeader>Capacity</IonListHeader>
                            <IonItem>
                                <IonRow>
                                    <IonCol><input size={12} className="input-price"/></IonCol>
                                    <IonCol>-</IonCol>
                                    <IonCol><input  size={12} className="input-price"/></IonCol>
                                </IonRow>
                            </IonItem>
                        </IonList>
                        <IonList id="inbox-list" mode="md">
                            <IonListHeader>Power</IonListHeader>
                            <IonItem>
                                <IonRow>
                                    <IonCol><input size={12} className="input-price"/></IonCol>
                                    <IonCol>-</IonCol>
                                    <IonCol><input  size={12} className="input-price"/></IonCol>
                                </IonRow>
                            </IonItem>
                        </IonList>
                        <IonList id="inbox-list" mode="md">
                            <IonListHeader>Style</IonListHeader>
                            <IonItem className="ion-text-wrap">
                                <p>
                                    {["axe","baseball","bone","boomerang","bow","broom","claw","crossbow","darts","fork",
                                        "grenade","hammer","hammerball","lightsaber","magic","massage","nail","pistol","poniard","samurai","saucepan","saw",
                                        "shovel","sickle","spear","staff","sword","syringe","trident","whip","wooden","wrench"].map((v,i)=>{
                                        return <>
                                            <IonChip color={i %3 ==0?"danger":"dark"} style={{border:i%3==0?"1px solid":""}}>
                                                <IonLabel>{v.toUpperCase()}</IonLabel>
                                            </IonChip>
                                        </>
                                    })}
                                </p>
                            </IonItem>
                        </IonList>
                        <div className="btn-bottom-menu">
                            <IonRow>
                                <IonCol size="4">
                                    <IonButton mode="ios" expand="block" fill="outline" onClick={()=>{
                                        menuController.close()
                                    }}>Cancel</IonButton>
                                </IonCol>
                                <IonCol size="8">
                                    <IonButton mode="ios" expand="block" onClick={()=>{
                                        menuController.close()
                                    }}>Confirm(80)</IonButton>
                                </IonCol>
                            </IonRow>
                        </div>
                    </div>
                </IonContent>
            </IonMenu>
        );
    }
}

export default MenuNFT;