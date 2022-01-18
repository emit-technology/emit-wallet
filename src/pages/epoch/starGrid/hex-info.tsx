import * as React from 'react'
import * as utils from "../../../utils";
import CounterSvg from "./counter-svg";
import {Hex, HexInfo} from "../../../components/hexagons/models";
import {IonIcon,IonButton,IonProgressBar,IonText} from "@ionic/react";
import {eyeOffOutline, eyeOutline} from "ionicons/icons";
import {Counter, LockedInfo} from "../../../types";
import BigNumber from "bignumber.js";
import {CountDown} from "../../../components/countdown";
import {toAxial} from "../../../components/hexagons/utils";
import {isEmptyCounter, isEmptyPlanet} from "./utils";
import {STAR_GRID_DEFAULT_LEVEL} from "../../../config";
interface Props{
    sourceHexInfo: HexInfo;
    attackHexInfo?: HexInfo;
    onShowDistribute?: ()=>void;
    onMove?:(setTag:boolean,createPlanet:boolean)=>void;
    onMoveTo?:(hex:Hex)=>void;
    onCapture?:()=>void;
    lockedInfo?:LockedInfo;
    hasCounters?:boolean;
    showSimple?:boolean;
    onShowDetail?:(address:string) =>void;
    owner?:string
}

class HexInfoCard extends React.Component<Props, any>{

    state:any = {
        eyeOff:false,
        eyeOffAttack:false
    }

    getLevel = (counter:Counter) =>{
        const accumulate = utils.fromValue(counter.level,0).minus(STAR_GRID_DEFAULT_LEVEL).toNumber()
        // .minus(new BigNumber(counter.force))
        // .minus(new BigNumber(counter.defense))
        // .minus(new BigNumber(counter.luck))
        // .minus(new BigNumber(counter.move)).toNumber();
        return accumulate>0?accumulate:0
    }

    getAccum = (counter:Counter) =>{
        const accumulate = utils.fromValue(counter.level,0)
        .minus(new BigNumber(counter.force))
        .minus(new BigNumber(counter.defense))
        .minus(new BigNumber(counter.luck))
        .minus(new BigNumber(counter.move)).toNumber();
        return accumulate>0?accumulate:0
    }

    isHomeless = (hex:Hex):boolean =>{
        const {lockedInfo} = this.props;
        if(lockedInfo && (
            toAxial(lockedInfo.userInfo.userDefaultEarthCoordinate).equalHex(hex)
            || toAxial(lockedInfo.userInfo.userDefaultWaterCoordinate).equalHex(hex)
        )){
            return true;
        }
        return false;
    }
    render() {

        const {eyeOff,eyeOffAttack} = this.state;
        const {sourceHexInfo,attackHexInfo,onMoveTo,onMove,onShowDistribute,onCapture,lockedInfo,hasCounters,showSimple,owner,
            onShowDetail} = this.props;
        const sourceCounter = sourceHexInfo.counter;
        const sourceLand = !isEmptyPlanet(sourceHexInfo.land)?sourceHexInfo.land:undefined;
        const sourceHex = sourceHexInfo.hex;

        const attackCounter = attackHexInfo && !isEmptyCounter(attackHexInfo.counter)?attackHexInfo.counter:undefined;
        const attackLand = attackHexInfo && !isEmptyPlanet(attackHexInfo.land)?attackHexInfo.land:undefined;
        const attackHex = attackHexInfo && attackHexInfo.hex;

        const sourceCountdown = sourceCounter ? new BigNumber(sourceCounter.nextOpTime).multipliedBy(1000).toNumber():lockedInfo?
            new BigNumber(lockedInfo.userInfo.nextOpTime).multipliedBy(1000).toNumber():0;
        const attackCountdown = attackCounter ? new BigNumber(attackCounter.nextOpTime).multipliedBy(1000).toNumber():0;
        const now = Date.now();

        const isMarker = sourceLand && sourceLand.marker == owner;
        const isOwner = sourceLand && sourceLand.owner == owner;
        const isHome = sourceLand && lockedInfo && (sourceLand.coordinate == lockedInfo.userInfo.userDefaultWaterCoordinate || sourceLand.coordinate == lockedInfo.userInfo.userDefaultEarthCoordinate);

        const isMarkerAttack = attackLand && attackLand.marker == owner;
        const isOwnerAttack = attackLand && attackLand.owner == owner;
        const isHomeAttack = attackLand && lockedInfo && (attackLand.coordinate == lockedInfo.userInfo.userDefaultWaterCoordinate || attackLand.coordinate == lockedInfo.userInfo.userDefaultEarthCoordinate);

        const ctime = sourceCountdown>now && <div className="ctime">
            <img src="./assets/img/epoch/stargrid/icons/time.png" width={20}/><CountDown time={sourceCountdown} className="op-countdown"/>
        </div>;

        const attackTime = attackCountdown>now && <div className="ctime">
            <img src="./assets/img/epoch/stargrid/icons/time.png" width={20}/><CountDown time={attackCountdown} className="op-countdown"/>
        </div>;
        const isMineCounter = lockedInfo && sourceCounter && lockedInfo.userInfo.counter.counterId == sourceCounter.counterId;
        return (
            <>
                {
                    sourceCounter && !eyeOff ?
                    <div className="owner-info">
                        <div className="avatar-l">
                            <div className="hex-head" onClick={()=>{
                                if(onShowDetail){
                                    onShowDetail(sourceLand.owner)
                                }
                            }}>
                                <CounterSvg counter={sourceCounter} land={sourceLand}  isHomeless={isHome} isOwner={isOwner} isApproval={sourceLand&&sourceLand.canCapture} isMarker={isMarker}/>
                                {!showSimple&&sourceHex && <div className="coo"><small>[{sourceHex.x},{sourceHex.z}]</small></div>}
                                <div className="counter-id">{sourceCounter.counterId}</div>
                            </div>
                            <div className="attr">
                                {
                                    sourceCounter && new BigNumber(sourceCounter.force).toNumber()>0
                                    && <div><img src="./assets/img/epoch/stargrid/icons/sword.png" width={20}/></div>
                                }
                                <div><img src="./assets/img/epoch/stargrid/icons/defense.png" width={20}/></div>
                                <div><img src="./assets/img/epoch/stargrid/icons/shot.png" width={20}/></div>
                                <div><img src="./assets/img/epoch/stargrid/icons/lucky.png" width={20}/></div>
                            </div>
                            <div className="attr">
                                {
                                    sourceCounter && new BigNumber(sourceCounter.force).toNumber()>0 &&
                                    <div>{sourceCounter.force}</div>
                                }
                                <div>{sourceCounter.defense}</div>
                                <div>{sourceCounter.move}</div>
                                <div>{sourceCounter.luck}</div>
                            </div>
                        </div>
                        <div className="cap-info">
                            <div className="life"><IonProgressBar className="life-progress" value={utils.fromValue(sourceCounter.life,18).dividedBy(new BigNumber(sourceCounter.defense)).toNumber()}/>
                                <div className="life-value">{utils.fromValue(sourceCounter.life,16).dividedBy(new BigNumber(sourceCounter.defense)).toFixed(2)}</div>
                            </div>
                            <div className="capacity">
                                <img src="./assets/img/epoch/stargrid/icons/level.png" width={20}/><span>{utils.nFormatter(utils.fromValue(sourceCounter.capacity,18),3)}</span>
                            </div>
                            <div className="rate"><img src="./assets/img/epoch/stargrid/icons/rate.png" width={20}/><span>{utils.fromValue(sourceCounter.rate,16).toFixed(2,2)}%</span></div>
                            <div className="attribute" onClick={()=>{
                                if(onShowDistribute && isMineCounter){
                                    onShowDistribute()
                                }
                            }}><img src="./assets/img/epoch/stargrid/icons/plus.png" width={20}/>
                                <span>LV{this.getLevel(sourceCounter)}&nbsp;{ isMineCounter && this.getAccum(sourceCounter)>0&&<small><IonText color="secondary">[+{this.getAccum(sourceCounter)}]</IonText></small>}</span>
                            </div>
                            {ctime}
                            {
                                onMove && !isEmptyPlanet(sourceLand) && sourceLand.marker != owner && sourceCounter && lockedInfo && lockedInfo.userInfo && (!attackHexInfo || !attackHexInfo.hex) &&
                                sourceLand.coordinate == lockedInfo.userInfo.userCoordinate &&  <IonButton size="small" color="secondary" disabled={sourceCountdown>now} onClick={()=>{
                                   onMove(true,false)
                                }}>Mark</IonButton>
                            }
                            {
                                onMove&&(!sourceLand || sourceLand.capacity == "0") && lockedInfo && sourceCounter.counterId == lockedInfo.userInfo.counter.counterId && (!attackHexInfo || !attackHexInfo.hex) &&
                                <IonButton size="small" color="secondary" disabled={sourceCountdown>now} onClick={()=>{
                                    onMove(false,true)
                                }}>Create Planet</IonButton>
                            }
                        </div>
                        <div className="eye">
                           <IonIcon src={eyeOutline} color="light" onClick={(e)=>{
                               e.stopPropagation();
                               this.setState({
                                   eyeOff:!eyeOff
                               })
                           }}/>
                        </div>
                    </div>
                        :
                        !isEmptyPlanet(sourceLand) && (eyeOff || !sourceCounter || sourceCounter.capacity=="0")?
                            <div className="owner-info">
                                <div className="avatar-l">
                                    <div className="hex-head" onClick={()=>{
                                        if(onShowDetail){
                                            onShowDetail(sourceLand.owner)
                                        }
                                    }}>
                                        <CounterSvg land={sourceLand} isHomeless={isHome} isOwner={isOwner} isApproval={sourceLand&&sourceLand.canCapture} isMarker={isMarker}/>
                                        {!showSimple&&sourceHex && <div className="coo"><small>[{sourceHex.x},{sourceHex.z}]</small></div>}
                                    </div>
                                    {!showSimple && <div className="attr">
                                        <div><img src="./assets/img/epoch/stargrid/icons/rdefense.png" width={20}/></div>
                                        <div><img src="./assets/img/epoch/stargrid/icons/ldefense.png" width={20}/></div>
                                    </div> }
                                    {!showSimple && <div className="attr">
                                        <div>-1</div>
                                        <div>-{sourceLand && new BigNumber(sourceLand.level).plus(2).toNumber()}</div>
                                    </div> }
                                </div>
                                <div className="cap-info">
                                    <div className="capacity"><img src="./assets/img/epoch/stargrid/icons/level.png" width={20}/><span>{utils.nFormatter(utils.fromValue(sourceLand.capacity,18),3)}</span></div>
                                    <div className="rate"><img src="./assets/img/epoch/stargrid/icons/plus.png" width={20}/><span>LV{sourceLand.level}</span></div>
                                    {
                                        lockedInfo&&lockedInfo.userInfo.counter.counterId!="0" ? (sourceLand && sourceLand.canCapture||isMarker) && !sourceCounter && onMoveTo && <div className="operator-btn">
                                            <IonButton size="small" color="success" disabled={sourceCountdown>now} onClick={()=>{
                                                onMoveTo(sourceHex)
                                            }}>Move</IonButton>
                                        </div>:
                                            onCapture && hasCounters && (isMarker||sourceLand&&sourceLand.canCapture) &&
                                            <div className="operator-btn">
                                                <IonButton size="small" color="warning" disabled={sourceCountdown>now} onClick={()=>{
                                                    onCapture()
                                                }}>Capture</IonButton>
                                            </div>
                                    }
                                    {ctime}
                                </div>
                                {
                                    !showSimple &&
                                    <div className="eye">
                                        <IonIcon src={eyeOffOutline} color="light"  onClick={(e)=>{
                                            e.stopPropagation();
                                            this.setState({
                                                eyeOff:!eyeOff
                                            })
                                        }}/>
                                    </div>
                                }
                            </div>
                            :
                            <div className="owner-info">
                                <div className="avatar-l">
                                    <div className="hex-head" style={{backgroundColor:"#000"}}>
                                        <CounterSvg/>
                                        {sourceHex && <div className="coo"><small>[{sourceHex.x},{sourceHex.z}]</small></div>}
                                    </div>
                                    <div className="attr">
                                        <div><img src="./assets/img/epoch/stargrid/icons/rdefense.png" width={20}/></div>
                                    </div>
                                    <div className="attr"><div>-1</div></div>
                                </div>
                                <div className="cap-info">
                                    <div style={{border:"none"}}></div>
                                    {ctime}
                                    {
                                        (!lockedInfo || lockedInfo.userInfo.counter.counterId == "0") && onCapture && hasCounters &&
                                        <div className="operator-btn">
                                            <IonButton size="small" disabled={sourceCountdown>now} color="warning" onClick={()=>{
                                                onCapture()
                                            }}>Capture</IonButton>
                                        </div>
                                    }
                                </div>
                                {
                                    !showSimple &&
                                    <div className="eye">
                                        <IonIcon src={eyeOffOutline} color="light"  onClick={(e)=>{
                                            e.stopPropagation();
                                            this.setState({
                                                eyeOff: !eyeOff
                                            })
                                        }}/>
                                    </div>
                                }
                            </div>
                }
                {
                    attackCounter && !eyeOffAttack ? <div className="enemy-info">
                            <div className="avatar-l">
                                <div className="hex-head" onClick={()=>{
                                    if(onShowDetail){
                                        onShowDetail(attackLand.owner)
                                    }
                                }}>
                                    <CounterSvg counter={attackCounter} land={attackLand} isHomeless={isHomeAttack} isOwner={isOwnerAttack} isApproval={attackLand&&attackLand.canCapture} isMarker={isMarkerAttack}/>
                                    {attackHex && <div className="coo"><small>[{attackHex.x},{attackHex.z}]</small></div>}
                                    <div className="counter-id">{attackCounter.counterId}</div>
                                </div>
                                <div className="attr">
                                    {
                                        attackCounter && new BigNumber(attackCounter.force).toNumber()>0 &&
                                    <div><img src="./assets/img/epoch/stargrid/icons/sword.png" width={20}/></div>
                                    }
                                    <div><img src="./assets/img/epoch/stargrid/icons/defense.png" width={20}/></div>
                                    <div><img src="./assets/img/epoch/stargrid/icons/shot.png" width={20}/></div>
                                    <div><img src="./assets/img/epoch/stargrid/icons/lucky.png" width={20}/></div>
                                </div>
                                <div className="attr">
                                    { attackCounter && new BigNumber(attackCounter.force).toNumber()>0 &&
                                    <div>{attackCounter.force}</div>}
                                    <div>{attackCounter.defense}</div>
                                    <div>{attackCounter.move}</div>
                                    <div>{attackCounter.luck}</div>
                                </div>
                            </div>
                        <div className="cap-info">
                            <div className="life"><IonProgressBar className="life-progress" value={utils.fromValue(attackCounter.life,18).dividedBy(new BigNumber(attackCounter.defense)).toNumber()}/>
                            <div className="life-value">{utils.fromValue(attackCounter.life,16).dividedBy(new BigNumber(attackCounter.defense)).toFixed(2)}</div>
                            </div>
                            <div className="capacity"><img src="./assets/img/epoch/stargrid/icons/level.png" width={20}/><span>{utils.fromValue(attackCounter.capacity,18).toFixed(2,2)}</span></div>
                            <div className="rate"><img src="./assets/img/epoch/stargrid/icons/rate.png" width={20}/><span>{utils.fromValue(attackCounter.rate,16).toFixed(2,2)}%</span></div>
                            <div className="attribute"><img src="./assets/img/epoch/stargrid/icons/plus.png" width={20}/>
                                <span>LV{this.getLevel(attackCounter)}</span>
                            </div>
                            <div className="operator-btn">
                                {
                                    onMove &&sourceCounter && new BigNumber(sourceCounter.move).toNumber()>0 && <IonButton size="small" disabled={sourceCountdown>now} color="danger" onClick={()=>{
                                        onMove(false,false)
                                    }}>Attack</IonButton>
                                }
                            </div>
                            {attackTime}
                        </div>

                        <div className="eye">
                            <IonIcon src={eyeOutline} color="light" onClick={(e)=>{
                                e.stopPropagation();
                                this.setState({
                                    eyeOffAttack:!eyeOffAttack
                                })
                            }}/>
                        </div>
                    </div>:
                        !isEmptyPlanet(attackLand) && (eyeOffAttack || !attackCounter || attackCounter.capacity=="0") ? <div className="enemy-info">
                            <div className="avatar-l">
                                <div className="hex-head" onClick={()=>{
                                    if(onShowDetail){
                                        onShowDetail(attackLand.owner)
                                    }
                                }}>
                                    <CounterSvg land={attackLand} isHomeless={isHomeAttack} isOwner={isOwnerAttack} isApproval={attackLand&&attackLand.canCapture} isMarker={isMarkerAttack}/>
                                    {attackHex && <div className="coo"><small>[{attackHex.x},{attackHex.z}]</small></div>}
                                </div>
                                {!showSimple && <div className="attr">
                                    <div><img src="./assets/img/epoch/stargrid/icons/rdefense.png" width={20}/></div>
                                    <div><img src="./assets/img/epoch/stargrid/icons/ldefense.png" width={20}/></div>
                                </div> }
                                {!showSimple && <div className="attr">
                                    <div>-1</div>
                                    <div>-{attackLand && new BigNumber(attackLand.level).plus(2).toNumber()}</div>
                                </div> }
                            </div>
                            <div className="cap-info">
                                <div className="capacity"><img src="./assets/img/epoch/stargrid/icons/level.png" width={20}/><span>{utils.fromValue(attackLand.capacity,18).toFixed(2,2)}</span></div>
                                <div className="rate"><img src="./assets/img/epoch/stargrid/icons/plus.png" width={20}/><span>{attackLand.level}</span></div>
                                <div className="operator-btn">
                                    {
                                        onMove && sourceCounter && new BigNumber(sourceCounter.move).toNumber()>0 &&
                                            <>
                                                <IonButton size="small" disabled={sourceCountdown>now} color={attackCounter?"danger":"success"} onClick={()=>{
                                                    onMove(false,false)
                                                }}>{attackCounter?"ATTACK":"MOVE"}</IonButton>
                                                {!attackCounter && !isEmptyPlanet(attackLand) && attackLand.marker != owner &&
                                                <IonButton size="small" disabled={sourceCountdown>now} color={"secondary"} onClick={()=>{
                                                    onMove(true,false)
                                                }}>Move&Mark</IonButton>
                                                }
                                        </>

                                    }
                                </div>
                            </div>

                            <div className="eye">
                                <IonIcon src={eyeOffOutline} color="light" onClick={(e)=>{
                                    e.stopPropagation();
                                    this.setState({
                                        eyeOffAttack:!eyeOffAttack
                                    })
                                }}/>
                            </div>
                        </div>
                            : attackHex ?
                            <div className="enemy-info">
                                <div className="avatar-l">
                                    <div className="hex-head" style={{backgroundColor:"#000"}}>
                                        <CounterSvg/>
                                        {attackHex && <div className="coo"><small>[{attackHex.x},{attackHex.z}]</small></div>}
                                    </div>
                                    <div className="attr">
                                        <div><img src="./assets/img/epoch/stargrid/icons/rdefense.png" width={20}/></div>
                                    </div>
                                    <div className="attr"><div>-1</div></div>
                                </div>
                                <div className="cap-info">
                                    <div style={{border:"none"}}></div>
                                    <div className="operator-btn">
                                        {
                                            onMove && (!attackCounter || attackCounter.counterId =="0") && new BigNumber(sourceCounter.move).toNumber()>0 && <>
                                                <IonButton size="small" disabled={sourceCountdown>now} color="success" onClick={()=>{
                                                    onMove(false,false)
                                                }}>Move</IonButton>
                                                <IonButton size="small" disabled={sourceCountdown>now} color="tertiary" onClick={()=>{
                                                    onMove(false,true)
                                                }}>Move&Create Planet</IonButton>
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className="eye">
                                    <IonIcon src={eyeOffOutline} color="light" onClick={(e)=>{
                                        e.stopPropagation();
                                        this.setState({
                                            eyeOffAttack:!eyeOffAttack
                                        })
                                    }}/>
                                </div>
                            </div>:
                            !showSimple &&
                            <div style={{flex:1,background:"rgb(108 81 75 / 50%)"}}>

                            </div>
                }

            </>

    );
    }

    componentDidMount() {

    }
}

export default HexInfoCard