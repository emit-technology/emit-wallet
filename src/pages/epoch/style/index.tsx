import * as React from "react";
import {IonBadge, IonIcon, IonLabel} from "@ionic/react"
import * as utils from "../../../utils";
class EpochStyle extends React.Component<any, any>{

    renderContent = ()=>{
        const colors = ["light","dark"];
        const elements = [];
        const data:any = {
            "ax":[],
            "legendary":["broom","bone","massage"].reverse(),
            "rare":["wooden","hammer","syringe","fork","baseball","wrench","saucepan","saw"].reverse(),
            "magic":["nail","staff","magic","grenade","lightsaber","pistol"].reverse(),
            "common":["axe","bow","spear","crossbow","samurai","sword","boomerang","trident","sickle","hammerball","shovel","claw","poniard","darts","whip"].reverse()
        }
        const keys = Object.keys(data);
        for(let category of keys){
            const styles = data[category];
            for(let style of styles){
                for(let color of colors){
                    const bgImg = style=="ax"?"./assets/img/epoch/remains/device/ax.png":color=="light" ? "./assets/img/epoch/remains/device/light_bg.png" : "./assets/img/epoch/remains/device/dark_bg.png";
                    elements.push(
                        <div style={{maxWidth:"160px",float:"left",position:"relative",margin:"6px"}}>
                            <div>
                                <img src={bgImg} style={{
                                    border: "1px solid #fff",
                                    boxShadow: "0 0 5px 1px #ddd",
                                    borderRadius: "20% /13%"
                                }}/>
                            </div>
                            {
                                style!="ax" && <div style={{position:"absolute",top:"0"}}><img src={`./assets/img/epoch/remains/device/${color}/${style}.png`}/></div>

                            }
                            { style != "ax" && <div style={{position:"absolute",top:"0"}}><img src={`./assets/img/epoch/remains/tag/${color}/${category}.png`}/></div>}
                            {
                                color == "dark" && style!="ax" && <div style={{position:"absolute",top:"0"}}><img src={`./assets/img/epoch/remains/device/star/4.png`}/></div>
                            }
                            <div style={{textAlign:"center"}}>
                                <div style={{padding:"12px 0"}}>
                                    <IonBadge mode="ios" color={utils.reColor(category)}>
                                        <IonIcon src={utils.reIcon(category)}/>&nbsp;
                                        <IonLabel className="font-weight-800">{category.toUpperCase()}</IonLabel>
                                    </IonBadge>
                                </div>
                            </div>
                        </div>
                    )
                }
            }
        }

        return elements
    }

    render() {
        return (
            <div style={{overflowY:"scroll",width:"100%"}} className="content-ion">
                <div style={{maxWidth:"160px",position:"relative",margin:"6px"}}>
                    <div>
                        <img src={"./assets/img/epoch/remains/device/ax.png"}/>
                    </div>
                    <div style={{textAlign:"center"}}>
                        <div style={{padding:"12px 0"}}>
                            <IonBadge mode="ios" color={utils.reColor("normal")}>
                                <IonIcon src={utils.reIcon("normal")}/>&nbsp;
                                <IonLabel className="font-weight-800">{"blank".toUpperCase()}</IonLabel>
                            </IonBadge>
                        </div>
                    </div>
                </div>
                <br/>
                {this.renderContent()}
            </div>
        );
    }
}

export default EpochStyle