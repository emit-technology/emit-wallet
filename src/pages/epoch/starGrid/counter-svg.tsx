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

    componentDidMount() {
    }

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
        if(land){
            const i = Math.floor(utils.fromValue(land.capacity,18).toNumber())
            if(land.enType == StarGridType.WATER){
                landStyle = blueColors[i]
            }else if(land.enType == StarGridType.EARTH){
                landStyle = yellowColors[i]
            }
        }

        const cornerCoordsLand = calculateCoordinates(ORIENTATIONS_CONSTS.pointy, hexSize);
        const pointLand = cornerCoordsLand
            .map((point) => `${point.x},${point.y}`)
            .join(" ");

        return (
            <HexGrid
                width="100%"
                height="100%"
                hexSize={1}
                origin={{ x: 0, y: 0}}
                orientation={OrientationsEnum.pointy}
                spacing={1}
                colorsDefs={{
                    colorsBlue:[landStyle],
                    colorsYellow:[landStyle],
                    pieceColors:[backgroundColor]
                }}
            >
                <g>
                    <g className="hexagon">
                        {
                            land?<>
                                <polygon points={pointLand} style={{filter:`url(#spotlight_${landStyle})`}} />
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
            </HexGrid>
        );
    }
}

export default CounterSvg