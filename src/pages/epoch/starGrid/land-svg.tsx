import * as React from 'react';
import {Counter, Land, StarGridType} from "../../../types";
import {calcCounterRgb, ORIENTATIONS_CONSTS, OrientationsEnum, rgbToHex} from "../../../components/hexagons/utils";
import {calculateCoordinates, HexGrid} from "../../../components/hexagons";
import * as utils from "../../../utils";
import {blueColors, yellowColors} from "./index";

interface Props {
    land?:Land
}
class LandSvg extends React.Component<Props, any>{

    componentDidMount() {
    }

    render() {
        const {land} = this.props;
        const hexSize = 40;
        let landStyle = ""
        if(land){
            const i = utils.calcLandRate(land.level)//Math.floor(utils.fromValue(land.capacity,18).toNumber())
            if(land.enType == StarGridType.WATER){
                landStyle = blueColors[i]
            }else if(land.enType == StarGridType.EARTH){
                landStyle = yellowColors[i]
            }
        }

        const cornerCoords = calculateCoordinates(ORIENTATIONS_CONSTS.pointy, hexSize-0.65);
        const points = cornerCoords
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
                    pieceColors:[]
                }}
            >
                <g>
                    <g className="hexagon-head-svg">
                        {
                            landStyle ?  <>
                                <polygon points={points} style={{filter:`url(#spotlight_${landStyle})`}} />
                                <polygon points={points} style={{filter:'url(#line)'}} />
                            </>:<polygon points={points} />
                        }
                    </g>
                </g>
            </HexGrid>
        );
    }
}

export default LandSvg