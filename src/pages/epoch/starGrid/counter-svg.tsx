import * as React from 'react';
import {Counter, Land, StarGridType} from "../../../types";
import {calcCounterRgb, ORIENTATIONS_CONSTS, OrientationsEnum, rgbToHex} from "../../../components/hexagons/utils";
import {calculateCoordinates, HexGrid} from "../../../components/hexagons";
import * as utils from "../../../utils";
import {blueColors, yellowColors} from "./index";

interface Props {
    counter:Counter
    land?:Land
}
class CounterSvg extends React.Component<Props, any>{

    componentDidMount() {
    }

    render() {
        const {counter,land} = this.props;
        const hexSize = 40;
        const rate = Math.floor(utils.fromValue( counter.rate,16).toNumber());
        const bg = calcCounterRgb(rate);
        const backgroundColor = [ `rgb(${bg[0]})`,`rgb(${bg[1]})`];

        const piece = {
            style:counter.type == StarGridType.WATER?"white":"black",
            backgroundColor: backgroundColor
        }
        const cornerCoords = calculateCoordinates(ORIENTATIONS_CONSTS.flat, hexSize*0.8);
        const points = cornerCoords
            .map((point) => `${point.x},${point.y}`)
            .join(" ");

        let landStyle = ""
        if(land){
            const i = Math.floor(utils.fromValue(land.capacity,18).toNumber())
            if(land.type == StarGridType.WATER){
                landStyle = blueColors[i]
            }else if(land.type == StarGridType.EARTH){
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
                    colorsBlue:[],
                    colorsYellow:[],
                    pieceColors:[backgroundColor]
                }}
            >
                <g>
                    <g className="hexagon">
                        {
                            land &&  <>
                                <polygon points={pointLand} style={{filter:`url(#spotlight_${landStyle})`}} />
                                <polygon points={pointLand} style={{filter:'url(#line)'}} />
                            </>
                        }
                        <polygon points={points}  style={{fill:`url('#${rgbToHex(piece.backgroundColor[0])}_${rgbToHex(piece.backgroundColor[1])}')`}}/>
                        <polygon points={points} style={{filter:`url(#${piece.style})`}} />
                    </g>
                </g>
            </HexGrid>
        );
    }
}

export default CounterSvg