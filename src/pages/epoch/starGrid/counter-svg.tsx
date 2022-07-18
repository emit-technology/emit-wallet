import * as React from 'react';
import {Counter, Land, StarGridType} from "../../../types";
import {calcCounterRgb, ORIENTATIONS_CONSTS, OrientationsEnum, rgbToHex} from "../../../components/hexagons/utils";
import {calculateCoordinates, HexGrid} from "../../../components/hexagons";
import * as utils from "../../../utils";
import {blueColors, yellowColors} from "./index";
import BigNumber from "bignumber.js";
import {STAR_GRID_DEFAULT_LEVEL} from "../../../config";

interface Props {
    counter?:Counter
    land?:Land
    isHomeless?:boolean
    isApproval?:boolean
    isOwner?:boolean
    isMarker?:boolean
}

class CounterSvg extends React.Component<Props, any>{

    render() {
        const {counter,land,isHomeless,isMarker,isOwner,isApproval} = this.props;
        const hexSize = 40;
        const rate = counter?Math.floor(utils.fromValue( counter.rate,16).toNumber()):0;
        const bg = counter?calcCounterRgb(rate,counter.enType == StarGridType.EARTH):"";
        const backgroundColor = [ `rgb(${bg[0]})`,`rgb(${bg[1]})`];

        const piece = {
            style:counter && counter.enType == StarGridType.WATER?"white":"black",
            backgroundColor: backgroundColor
        }
        if(counter && new BigNumber(counter.level).toNumber()> STAR_GRID_DEFAULT_LEVEL){
            piece.style = counter.enType == StarGridType.WATER?"whiteSword":"blackSword";
        }
        const cornerCoords = calculateCoordinates(ORIENTATIONS_CONSTS.flat, hexSize*0.8);
        const points = cornerCoords
            .map((point) => `${point.x},${point.y}`)
            .join(" ");
        const cornerWalk = calculateCoordinates(ORIENTATIONS_CONSTS.pointy, hexSize*1.12);
        const pointsWalk = cornerWalk
            .map((point) => `${point.x},${point.y}`)
            .join(" ");

        let landStyle = ""
        let blues = [];
        let yellows = [];
        if(land){
            const i = utils.calcLandRate(land.level)//Math.floor(utils.fromValue(land.capacity,18).toNumber())
            if(land.enType == StarGridType.WATER){
                landStyle = blueColors[i]
                blues.push(landStyle)
            }else if(land.enType == StarGridType.EARTH){
                landStyle = yellowColors[i]
                yellows.push(landStyle)
            }
        }

        const cornerCoordsLand = calculateCoordinates(ORIENTATIONS_CONSTS.pointy, hexSize);
        const pointLand = cornerCoordsLand
            .map((point) => `${point.x},${point.y}`)
            .join(" ");

        return (
            <svg
                width={"100%"}
                height={"100%"}
                viewBox={ "-50 -50 100 100"}
                preserveAspectRatio="xMidYMid slice"//
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                key={counter ? counter.counterId: land ?land.coordinate:"1"}
            >
                <defs>
                    {yellows.map((v,i)=>{
                        const y = new BigNumber(v,16).toNumber() % 5 +1;
                        return <filter key={i} id={`spotlight_t_${v}`} filterUnits="objectBoundingBox">
                            <feImage href={`./assets/img/epoch/stargrid/yellow/${y}.png`} result="ffImg"/>
                            <feFlood result="floodFill"  floodColor={`#${v}`} floodOpacity="1" width="100%" height="100%"/>
                            <feBlend in="ffImg" mode="overlay" in2="floodFill" result="fBle"/>
                            <feComposite in2="ffImg" operator="in"/>
                        </filter>
                    })}
                    {blues.map((v,i)=>{
                        const y = new BigNumber(v,16).toNumber()%5 +1;
                        return <filter key={i} id={`spotlight_t_${v}`} filterUnits="objectBoundingBox">
                            <feImage href={`./assets/img/epoch/stargrid/blue/${y}.png`} result="ffImg"/>
                            <feFlood result="floodFill"  floodColor={`#${v}`} floodOpacity="1" width="100%" height="100%"/>
                            <feBlend in="ffImg" mode="overlay" in2="floodFill" result="fBle"/>
                            <feComposite in2="ffImg" operator="in"/>
                        </filter>
                    })}
                    {
                        piece.backgroundColor && piece.backgroundColor.length == 2 &&
                        <linearGradient id={`${rgbToHex(piece.backgroundColor[0])}_${rgbToHex(piece.backgroundColor[1])}`} gradientTransform="rotate(90)">
                            <stop offset="10%"  stopColor={piece.backgroundColor[0]} />
                            <stop offset="90%" stopColor={piece.backgroundColor[1]} />
                        </linearGradient>
                    }
                    <filter id="blackFlag" filterUnits="objectBoundingBox">
                        <feImage href="./assets/img/epoch/stargrid/piece/blackFlag.png" result="ffImg"/>
                    </filter>
                    <filter id="blackSword" >
                        <feImage href="./assets/img/epoch/stargrid/piece/blackSword.png"/>
                    </filter>
                    <filter id="whiteFlag" >
                        <feImage href="./assets/img/epoch/stargrid/piece/whiteFlag.png"/>
                    </filter>
                    <filter id="whiteSword" >
                        <feImage href="./assets/img/epoch/stargrid/piece/whiteSword.png"/>
                    </filter>
                    <filter id="black" >
                        <feImage href="./assets/img/epoch/stargrid/piece/black.png"/>
                    </filter>
                    <filter id="white" >
                        <feImage href="./assets/img/epoch/stargrid/piece/white.png"/>
                    </filter>
                </defs>

                <g>
                    <g className="hexagon">
                        {
                            land?<>
                                <polygon points={pointLand} style={{filter:`url(#spotlight_t_${landStyle})`}} />
                                <polygon points={pointLand} style={{filter:'url(#line)'}} />
                                {isHomeless &&<polygon points={pointsWalk} style={{filter:'url(#homeless)'}} />}
                            </>: !counter && <>
                                <polygon points={pointsWalk} />
                                <polygon points={pointLand} style={{filter:'url(#thinLine)'}} />
                            </>
                        }
                        {
                            counter && <>
                                <polygon points={points}  style={{fill:`url('#${rgbToHex(piece.backgroundColor[0])}_${rgbToHex(piece.backgroundColor[1])}')`}}/>
                                <polygon points={points} style={{filter:`url(#${piece.style})`}} />
                            </>
                        }
                        {isMarker && <polygon points={pointLand} style={{filter:`url(#coordinateMarker)`}} /> }
                        {isApproval && <polygon points={pointLand} style={{filter:`url(#coordinateApproval)`}} /> }
                        {isOwner&& <polygon points={pointLand} style={{filter:`url("#coordinate")`}} />}
                    </g>
                </g>
            </svg>
        );
    }
}

export default CounterSvg