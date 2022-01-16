import * as React from "react";
import { Layout, LayoutProps } from "./layout";
import {rgbToHex} from "./utils";
import BigNumber from "bignumber.js";

export interface HexGridProps extends LayoutProps {
  width: string | number;
  height: string | number;
  viewBox?: string;
  children: React.ReactElement;
    colorsDefs:ColorsDefs;
}

interface ColorsDefs{
    colorsYellow:Array<string>;
    colorsBlue:Array<string>;
    pieceColors:Array<Array<string>>;
}

export const HexGrid = React.forwardRef<SVGSVGElement, HexGridProps>(
  (
    {
      width = 800,
      height = 600,
      viewBox = "-50 -50 100 100",
        colorsDefs,
      children,
      ...layoutProps
    },
    ref
  ) => (
    <svg
      className="grid"
      width={width}
      height={height}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"//
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref}
    >
        <defs>
            <filter id="shadow2">
                <feDropShadow dx="0" dy="0" stdDeviation={0.5} className="bg-select">
                    {/*<animate attributeName="stdDeviation" values="0;0.3;0.6;0.2;0.1;" dur="2s"*/}
                    {/*         repeatCount="indefinite" />*/}
                </feDropShadow>
            </filter>
            <filter id="shadow">
                <feDropShadow dx="0" dy="0" stdDeviation={0.1} className="bg-select"/>
            </filter>
            <filter id="shadow3">
                <feDropShadow dx="0" dy="0" stdDeviation={0.15} floodColor="#fff"/>
            </filter>
            {colorsDefs.colorsYellow.map(v=>{
                const y = new BigNumber(v,16).toNumber()%5 +1;
                return <filter id={`spotlight_${v}`} filterUnits="objectBoundingBox">
                    <feImage href={`./assets/img/epoch/stargrid/yellow/${y}.png`} result="ffImg"/>
                    <feFlood result="floodFill"  floodColor={`#${v}`} floodOpacity="1" width="100%" height="100%"/>
                    <feBlend in="ffImg" mode="overlay" in2="floodFill" result="fBle"/>
                    <feComposite in2="ffImg" operator="in"/>
                </filter>
            })}
            {colorsDefs.colorsBlue.map(v=>{
                const y = new BigNumber(v,16).toNumber()%5 +1;
                return <filter id={`spotlight_${v}`} filterUnits="objectBoundingBox">
                    <feImage href={`./assets/img/epoch/stargrid/blue/${y}.png`} result="ffImg"/>
                    <feFlood result="floodFill"  floodColor={`#${v}`} floodOpacity="1" width="100%" height="100%"/>
                    <feBlend in="ffImg" mode="overlay" in2="floodFill" result="fBle"/>
                    <feComposite in2="ffImg" operator="in"/>
                </filter>
            })}
            {
                colorsDefs.pieceColors.map(p=>{
                    return <linearGradient id={`${rgbToHex(p[0])}_${rgbToHex(p[1])}`} gradientTransform="rotate(90)">
                        <stop offset="10%"  stopColor={p[0]} />
                        <stop offset="90%" stopColor={p[1]} />
                    </linearGradient>
                })
            }
            <filter id="line">
                <feImage href="./assets/img/epoch/stargrid/line.png"/>
            </filter>
            <filter id="coordinate" x="55%" y="5%" width="30%" height="30%">
                <feImage href="./assets/img/epoch/stargrid/coordinate.png"/>
            </filter>
            <filter id="coordinateMarker" x="75%" y="30%" width="30%" height="30%">
                <feImage href="./assets/img/epoch/stargrid/coordinateMarker.png"/>
            </filter>
            <filter id="coordinateApproval" x="55%" y="55%" width="30%" height="30%">
                <feImage href="./assets/img/epoch/stargrid/coordinateApproval.png"/>
            </filter>
            <filter id="thinLine">
                <feImage href="./assets/img/epoch/stargrid/thinLine.png"/>
            </filter>
            <filter id="thinLine2">
                <feImage href="./assets/img/epoch/stargrid/thinLine2.png"/>
            </filter>
            <filter id="focalPoint" filterUnits="objectBoundingBox">
                <feImage href="./assets/img/epoch/stargrid/focalPoint.png"/>
            </filter>
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
            <filter id="attack" >
                <feImage href="./assets/img/epoch/stargrid/attack.png"/>
            </filter>
            <filter id="walk" >
                <feImage href="./assets/img/epoch/stargrid/walk.png"/>
            </filter>
            <filter id="movable" >
                <feImage href="./assets/img/epoch/stargrid/movable.png"/>
            </filter>
            <filter id="homeless" >
                <feImage href="./assets/img/epoch/stargrid/homeless.png"/>
            </filter>
            <filter id="flag" x="30%" y="15%"  width="50%" height="50%">
                <feImage href="./assets/img/epoch/stargrid/flag.png"/>
            </filter>
        </defs>
      <Layout {...layoutProps}>{children}</Layout>
    </svg>
  )
);
