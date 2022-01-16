import React, { useMemo, CSSProperties, FC, MouseEvent } from "react";

import { Hex } from "./models";
import { useLayoutContext } from "./layout-context";
import {hexToScreenPosition, ORIENTATIONS_CONSTS, rgbToHex} from "./utils";
import {calculateCoordinates} from "./layout";

export type HexEvent = (
  id: string,
  coordinates: Hex,
  event: MouseEvent<SVGGElement, globalThis.MouseEvent>
) => void;

export interface HexagonProps {
  id: number | string;
  coordinates: Hex;

  patternFill?: string;
  cellStyle?: CSSProperties;
  className?: string;
  colorStyle?:string
  onMouseEnter?: HexEvent;
  onMouseOver?: HexEvent;
  onMouseLeave?: HexEvent;
  onClick?: HexEvent;
  onDragStart?: HexEvent;
  onDragEnd?: HexEvent;
  onDragOver?: HexEvent;
  onDrop?: HexEvent;
  onDoubleClick?:HexEvent;
  counter?:CounterStyle
  block?:boolean
  attack?:boolean
  movable?:boolean
  focus?:boolean
  flag?:boolean
  approval?:boolean
  marker?:boolean
  owner?:boolean
  inRange?:boolean
  isHomeless?:boolean
}
interface CounterStyle{
  backgroundColor:Array<string>//rgb range
  style:string
}

export const Hexagon: FC<HexagonProps> = ({
  id,
  coordinates,
  patternFill,
  cellStyle,
  className,
  children,
  colorStyle,
  counter,
  block,
  attack,
  focus,
  movable,
  flag,
    owner,
  approval,
  marker,
    inRange,
    isHomeless,
  ...pointerEvents
}) => {
  const {
    layoutData: { orientation, origin, hexSize, spacing, points },
  } = useLayoutContext();

  const position = useMemo(() => {
    return hexToScreenPosition(
      coordinates,
      orientation,
      origin,
      hexSize,
      spacing,
      coordinates.z !== undefined
    );
  }, [orientation, origin, hexSize, spacing, coordinates]);

  const fillId = patternFill ? `url(#${patternFill})` : "";
  const events = Object.keys(pointerEvents).reduce(
      (prev, key) => ({
        ...prev,
        [key]: (e:any) =>
            // @ts-ignore
        pointerEvents[key] && pointerEvents[key](id, coordinates, e),
    }),
    {}
  );
  const cornerCoords = calculateCoordinates(ORIENTATIONS_CONSTS.flat, hexSize*0.8);
  const pointsFlag = cornerCoords
      .map((point) => `${point.x},${point.y}`)
      .join(" ");

  const cornerCoords1 = calculateCoordinates(ORIENTATIONS_CONSTS.pointy, hexSize*1.2);
  const pointsDropShadow = cornerCoords1
      .map((point) => `${point.x},${point.y}`)
      .join(" ");

  const cornerWalk = calculateCoordinates(ORIENTATIONS_CONSTS.pointy, hexSize*1.08);
  const pointsWalk = cornerWalk
      .map((point) => `${point.x},${point.y}`)
      .join(" ");

  return (
    <g
      className={className}
      transform={`translate(${position.x}, ${position.y})`}
      {...events}
    >
      <g className="hexagon">
        {/*<polygon points={points} fill={fillId} style={{...cellStyle,filter:'url(#non)'}} />*/}
        { focus && <>
          {/*<polygon points={pointsDropShadow2} style={{...cellStyle,filter:`url("#shadow")`}} />*/}
          {/*<polygon points={pointsDropShadow3} style={{...cellStyle,filter:`url("#shadow3")`}} />*/}
          <polygon points={pointsDropShadow} style={{...cellStyle,filter:`url("#shadow2")`}} />
        </> }
        {colorStyle ?<>
          <polygon points={points} fill={fillId} style={{...cellStyle,filter:`url(#spotlight_${colorStyle})`}} />
              <polygon points={points} fill={fillId} style={{...cellStyle,filter:'url(#line)'}} />
              {isHomeless&&<polygon points={pointsWalk} fill={fillId} style={{...cellStyle,filter:'url(#homeless)'}} />}
          </>:
            inRange ?<polygon points={points} fill={fillId} style={{...cellStyle,filter:'url(#thinLine)'}} />:
                <polygon points={points} fill={fillId} style={{...cellStyle,filter:'url(#thinLine2)',opacity:"0.8"}} />
        }
        {counter&&<>
            <polygon points={pointsFlag}  style={{fill:`url('#${rgbToHex(counter.backgroundColor[0])}_${rgbToHex(counter.backgroundColor[1])}')`}}/>
            <polygon points={pointsFlag} style={{...cellStyle,filter:`url(#${counter.style})`}} />
          </>
        }
        {movable&&!attack && <polygon points={pointsWalk} style={{...cellStyle,filter:`url("#movable")`}} />}
        {/*{movable && <polygon points={pointsWalk} style={{...cellStyle}} className="cap-polygon"/>}*/}
        {block&&!attack && <polygon points={pointsWalk} style={{...cellStyle,opacity:"1",filter:`url("#walk")`}} />}

        {attack && <polygon points={points} style={{...cellStyle,opacity:"1",filter:`url("#attack")`}} />}
        {flag && <>
          <polygon points={points} style={{...cellStyle,filter:`url(#coordinate)`}} />
        </> }
        {marker && <polygon points={points} style={{...cellStyle,filter:`url(#coordinateMarker)`}} /> }
        {approval && <polygon points={points} style={{...cellStyle,filter:`url(#coordinateApproval)`}} /> }
        { focus && <>
          <polygon points={pointsDropShadow} style={{...cellStyle,filter:`url("#flag")`}} />
        </> }
        {owner&&!focus && <polygon points={pointsWalk} style={{...cellStyle,opacity:"1",filter:`url("#focalPoint")`}} />}
        {children}
      </g>
    </g>
  );
};
