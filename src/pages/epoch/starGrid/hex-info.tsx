import * as React from 'react'
import * as utils from "../../../utils";
import CounterSvg from "./counter-svg";
import {HexInfo} from "../../../components/hexagons/models";
import LandSvg from "./land-svg";
import {IonIcon} from "@ionic/react";
import {eyeOffOutline, eyeOutline} from "ionicons/icons";
interface Props{
    sourceHexInfo: HexInfo;
    attackHexInfo?: HexInfo
}
class HexInfoCard extends React.Component<Props, any>{

    state:any = {
        eyeOff:false
    }

    render() {

        const {eyeOff} = this.state;
        const {sourceHexInfo,attackHexInfo} = this.props;
        const sourceCounter = sourceHexInfo.counter;
        const sourceLand = sourceHexInfo.land;
        const sourceHex = sourceHexInfo.hex;

        const attackCounter = attackHexInfo.counter;
        const attackLand = attackHexInfo.land;
        const attackHex = attackHexInfo.hex;

        console.log(sourceHexInfo,"sourceHex")
        return (
            <>
                {
                    sourceCounter && !eyeOff ?
                    <div className="owner-info">
                        <div className="avatar-l">
                            <div className="hex-head">
                                <CounterSvg counter={sourceCounter} land={sourceLand}/>
                            </div>
                            <div className="attr">
                                <div><img src="./assets/img/epoch/stargrid/icons/sword.png" width={20}/></div>
                                <div><img src="./assets/img/epoch/stargrid/icons/defense.png" width={20}/></div>
                                <div><img src="./assets/img/epoch/stargrid/icons/shot.png" width={20}/></div>
                            </div>
                            <div className="attr">
                                <div>{sourceCounter.force}</div>
                                <div>{sourceCounter.defense}</div>
                                <div>{sourceCounter.move}</div>
                            </div>
                        </div>
                        <div className="cap-info">
                            <div className="capacity"><img src="./assets/img/epoch/stargrid/icons/level.png" width={20}/><span>{utils.fromValue(sourceCounter.capacity,18).toFixed(2,1)}</span></div>
                            <div className="rate"><img src="./assets/img/epoch/stargrid/icons/rate.png" width={20}/><span>{utils.fromValue(sourceCounter.rate,16).toFixed(2,1)}%</span></div>
                            <div className="attribute"><img src="./assets/img/epoch/stargrid/icons/plus.png" width={20}/>
                                <span>{sourceCounter.luck}<img src="./assets/img/epoch/stargrid/icons/add.png" width={20}/></span>
                            </div>
                        </div>
                        <div className="eye">
                           <IonIcon src={eyeOutline} onClick={()=>{
                               this.setState({
                                   eyeOff:true
                               })
                           }}/>
                        </div>
                    </div>
                        :
                        sourceLand && (eyeOff || !sourceCounter)?
                            <div className="owner-info">
                                <div className="avatar-l">
                                    <div className="hex-head">
                                       <LandSvg land={sourceLand} />
                                    </div>
                                    <div className="attr">
                                        <div style={{padding:"10px 0"}}>[{sourceHex.x},{sourceHex.z}]</div>
                                    </div>
                                </div>
                                <div className="cap-info">
                                    <div className="capacity"><img src="./assets/img/epoch/stargrid/icons/level.png" width={20}/><span>{utils.fromValue(sourceLand.capacity,18).toFixed(2,1)}</span></div>
                                    <div className="rate"><img src="./assets/img/epoch/stargrid/icons/rate.png" width={20}/><span>{utils.fromValue(sourceLand.rate,16).toFixed(2,1)}%</span></div>

                                </div>
                                <div className="eye">
                                    <IonIcon src={eyeOffOutline} onClick={()=>{
                                        this.setState({
                                            eyeOff:false
                                        })
                                    }}/>
                                </div>
                            </div>
                            :
                            <div className="owner-info">
                                <div className="avatar-l">
                                    <div className="hex-head" style={{backgroundColor:"#000"}}>
                                        <LandSvg />
                                    </div>
                                    <div className="attr">
                                        <div style={{padding:"10px 0"}}>[{sourceHex.x},{sourceHex.z}]</div>
                                    </div>
                                </div>
                                <div className="cap-info">
                                </div>
                            </div>
                }
                {
                    attackCounter ? <div className="enemy-info">
                        <div className="avatar-l">
                            <div className="hex-head">
                                <CounterSvg counter={attackCounter} land={attackLand}/>
                            </div>
                            <div className="attr">
                                <div><img src="./assets/img/epoch/stargrid/icons/sword.png" width={20}/></div>
                                <div><img src="./assets/img/epoch/stargrid/icons/defense.png" width={20}/></div>
                                <div><img src="./assets/img/epoch/stargrid/icons/shot.png" width={20}/></div>
                            </div>
                            <div className="attr">
                                <div>{attackCounter.force}</div>
                                <div>{attackCounter.defense}</div>
                                <div>{attackCounter.move}</div>
                            </div>
                        </div>
                        <div className="cap-info">
                            <div className="capacity"><img src="./assets/img/epoch/stargrid/icons/level.png" width={20}/><span>{utils.fromValue(sourceCounter.capacity,18).toFixed(2,1)}</span></div>
                            <div className="rate"><img src="./assets/img/epoch/stargrid/icons/rate.png" width={20}/><span>{utils.fromValue(sourceCounter.rate,16).toFixed(2,1)}%</span></div>
                            <div className="attribute"><img src="./assets/img/epoch/stargrid/icons/plus.png" width={20}/>
                                <span>{sourceCounter.luck}<img src="./assets/img/epoch/stargrid/icons/add.png" width={20}/></span>
                            </div>
                        </div>
                    </div>:
                        attackLand ? <div className="enemy-info">
                            <div className="avatar-l">
                                <div className="hex-head">
                                    <LandSvg land={attackLand} />
                                </div>
                                <div className="attr">
                                    <div style={{padding:"10px 0"}}>[{attackHex.x},{attackHex.z}]</div>
                                </div>
                            </div>
                            <div className="cap-info">
                                <div className="capacity"><img src="./assets/img/epoch/stargrid/icons/level.png" width={20}/><span>{utils.fromValue(attackLand.capacity,18).toFixed(2,1)}</span></div>
                                <div className="rate"><img src="./assets/img/epoch/stargrid/icons/rate.png" width={20}/><span>{utils.fromValue(attackLand.rate,16).toFixed(2,1)}%</span></div>
                            </div>
                        </div>
                            : attackHex ?
                            <div className="enemy-info">
                                <div className="avatar-l">
                                    <div className="hex-head" style={{backgroundColor:"#000"}}>
                                        <LandSvg />
                                    </div>
                                    <div className="attr">
                                        <div style={{padding:"10px 0"}}>[{attackHex.x},{attackHex.z}]</div>
                                    </div>
                                </div>
                                <div className="cap-info">

                                </div>
                            </div>:
                            <div style={{flex:1}}>

                            </div>
                }

            </>

    );
    }

    componentDidMount() {

    }
}

export default HexInfoCard