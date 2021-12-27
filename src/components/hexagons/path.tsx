import * as React from "react";
import { useLayoutContext } from "./layout-context";
import {Hex, HexInfo} from "./models";
import {
  hexToScreenPosition,
  interpolateHexes,
  distanceBetweenHexes,
  roundToHex,
  axialCoordinatesToCube, neighboor, containHex,
} from "./utils/hex-math";

interface PathProps {
  start?: Hex;
  end?: Hex;
  powerMap?:Map<string,number>
  movement?:number
  pathHex?:Array<HexInfo>
}
//@ts-ignore
export const Path: React.FC<PathProps> = ({ start, end,powerMap,movement }) => {
  const {
    layoutData: { orientation, origin, hexSize, spacing },
  } = useLayoutContext();

  const points = React.useMemo(() => {
    if (!start || !end) return "";

    const [nextStart, nextEnd] =
      start.z !== undefined
        ? [start, end]
        : [
            axialCoordinatesToCube(start.x, start.y),
            axialCoordinatesToCube(end.x, end.y),
          ];

    const distance = distanceBetweenHexes(nextStart, nextEnd);
    let intersections:Array<Hex>=[];
    let step = 1 / Math.max(distance, 1);
    if (powerMap&&movement){
      const insections = () =>{
        const sections:Array<Hex> = [];
        sections.push(nextStart)
        const fringe:Array<Array<Hex>> = [];
        fringe.push([nextStart])
        for(let k=1;k<=movement;k++){
          fringe.push([])
          for(let hex of fringe[k-1]){
            let best = neighboor(hex, 0);
            for(let dir =1;dir<6;dir++) {
              // @ts-ignore
              const neighbor = neighboor(hex, dir);
              const minPowerNeighbor = (powerMap.has(neighbor.uKey())?powerMap.get(neighbor.uKey()):1)+distanceBetweenHexes(neighbor,nextEnd);
              const minPowerBest = (powerMap.has(best.uKey())?powerMap.get(best.uKey()):1) + distanceBetweenHexes(best,nextEnd);
              if(minPowerNeighbor<=minPowerBest && !containHex(sections,neighbor)){
                best = neighbor
              }
            }
            fringe[k].push(best)
            sections.push(best)
            if(best.uKey() === nextEnd.uKey()){
              return sections
            }
          }
        }
        sections.push(nextEnd)
        return sections
      }
      intersections = intersections.concat(insections()) ;
    }else{
      intersections = Array.from({ length: distance + 1 }, (_, i) => {
        // if(powerMap && powerMap.has(nextEnd.uKey()) && powerMap.get(nextEnd.uKey())>1){
        //   step = step/powerMap.get(nextEnd.uKey())
        // }
        return roundToHex(interpolateHexes(nextStart, nextEnd, step * i));
      });
    }
    console.log(intersections,"intersections");
    let nextPoints = "M";
    nextPoints += intersections
      .map((hex) => {
        let p = hexToScreenPosition(
          hex,
          orientation,
          origin,
          hexSize,
          spacing,
          hex.z !== undefined
        );

        return ` ${p.x},${p.y} `;
      })
      .join("L");

    return nextPoints;
  }, [orientation, origin, hexSize, spacing, start, end]);

  return points && <path d={points}></path>;
};


export const PathCustom: React.FC<PathProps> = ({ pathHex }) => {
  const {
    layoutData: { orientation, origin, hexSize, spacing },
  } = useLayoutContext();
  const start = pathHex[0].hex;
  const end = pathHex[1].hex;

  const points = React.useMemo(() => {


    const [nextStart, nextEnd] =
        start.z !== undefined
            ? [start, end]
            : [
              axialCoordinatesToCube(start.x, start.y),
              axialCoordinatesToCube(end.x, end.y),
            ];

    const distance = pathHex.length;
    let intersections:Array<HexInfo>=pathHex;
    // let step = 1 / Math.max(distance, 1);
    let nextPoints = "M";
    nextPoints += intersections
        .map((hex) => {
          let p = hexToScreenPosition(
              hex.hex,
              orientation,
              origin,
              hexSize,
              spacing,
              hex.hex.z !== undefined
          );

          return ` ${p.x},${p.y} `;
        })
        .join("L");

    return nextPoints;
  }, [orientation, origin, hexSize, spacing, start, end]);

  return points && <path d={points}></path>;
};

