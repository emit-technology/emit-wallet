import {Hex, HexInfo, Orientation, Point} from "../models";
import { ORIENTATIONS_CONSTS, OrientationsEnum } from "./orientation";
import BigNumber from "bignumber.js";
import BN from "bn.js";
import {Land} from "../../../types";
import {isEmptyCounter, isEmptyPlanet} from "../../../pages/epoch/starGrid/utils";

const linearInterpolation = (a: number, b: number, t: number): number => a + ((b - a) * t);

export const subtract = (a: Hex, b: Hex): Hex => new Hex(a.x - b.x, a.y - b.y, a.z - b.z);

export const add = (a: Hex, b: Hex): Hex => new Hex(a.x + b.x, a.y + b.y, a.z + b.z);

export const hexToScreenPosition = (hex: Hex, orientation: Orientation, origin: Point, size: number, spacing: number, cubic = false): Point => {
  const { f0, f1, f2, f3 } = orientation;
  const x = (f0 * hex.x + f1 * (cubic ? hex.z : hex.y)) * size * spacing;
  const y = (f2 * hex.x + f3 * (cubic ? hex.z : hex.y)) * size * spacing;

  return { x: x + origin.x, y: y + origin.y };
};

export const interpolateHexes = (a: Hex, b: Hex, t: number) => {
  return new Hex(linearInterpolation(a.x, b.x, t), linearInterpolation(a.y, b.y, t), linearInterpolation(a.z, b.z, t))
}

export const distanceBetweenHexes = (begin: Hex, end: Hex): number => {
  const diff = subtract(begin, end);
  const length = +((Math.abs(diff.x) + Math.abs(diff.y) + Math.abs(diff.z)) / 2);

  return length;
}
export const reachableHexes = (movement:number,powerMap:Map<string,number>,pathHexes:Array<HexInfo>,maxPower?:number) =>{
  if(pathHexes.length == 0 || movement<=0 ){
    return []
  }
  if(movement>maxPower){
    movement = maxPower
  }
  const start = pathHexes[pathHexes.length-1].hex;
  const visited:Array<Hex> = [];
  visited.push(start)
  const fringes:Array<Array<Hex>> = [];
  fringes.push([start])

  const movementMap:Map<string, number> = new Map<string, number>()

  if(pathHexes && pathHexes.length>1){
    for(let i=1;i<pathHexes.length;i++){
      const hex = pathHexes[i].hex;
      const power = powerMap.has(hex.uKey())?powerMap.get(hex.uKey()):1;
      movement -= power;
    }
  }
  if(movement<=0){
    return visited;
  }
  movementMap.set(start.uKey(),movement);
  for(let k = 1 ;k<=movement;k++){
    fringes.push([]);
    for(let hex of fringes[k-1]){
      for(let dir =0;dir<6;dir++){
        // @ts-ignore
        const neighbor = neighboor(hex,dir);
        if(powerMap){
          const hexMove = movementMap.has(hex.uKey())?movementMap.get(hex.uKey()):1;
          const neighborPower = powerMap.has(neighbor.uKey())?powerMap.get(neighbor.uKey()):1;
          if(!movementMap.has(neighbor.uKey())||(hexMove-neighborPower)> movementMap.get(neighbor.uKey())){
            movementMap.set(neighbor.uKey(),hexMove-neighborPower);
          }
        }
        // const neighbor = axialCoordinatesToCube(neighborHex.x,neighborHex.y);
        if(!containHex(visited,neighbor) && movementMap.get(neighbor.uKey())>=0){
          visited.push(neighbor)
          fringes[k].push(neighbor)
        }
      }
    }
  }
  return visited;
}

export const reachableHexesNeighbor = (movement:number,powerMap:Map<string,number>,pathHexes:Array<HexInfo>,langArr:Array<Land>) =>{
  if(pathHexes.length == 0 || movement < 0 ){
    return []
  }
  const visited:Array<Hex> = [];
  for(let i=1;i<pathHexes.length;i++){
    const hex = pathHexes[i].hex
    const power = powerMap.has(hex.uKey())?powerMap.get(hex.uKey()):1;
    movement -= power;
  }
  if(movement < 0 ){
    return [];
  }
  const info = pathHexes[pathHexes.length-1];
  const origin = pathHexes[0];
  const force = origin.counter ? new BigNumber(origin.counter.force).toNumber():0
  if(info){
    for(let dir =0;dir<6;dir++){
      const neighbor = neighboor(info.hex,dir as Directions)
      const arr = langArr && langArr.length>0 && langArr.filter(v=> v.coordinate == toUINT256(neighbor))
      if(arr && arr.length>0 && force>0 && !isEmptyCounter(arr[0].counter)){
        visited.push(neighbor)
      }else {
        if(!arr || arr.length==0 || isEmptyPlanet(arr[0]) || isEmptyCounter(arr[0].counter)){
          const power = powerMap.has(neighbor.uKey())?powerMap.get(neighbor.uKey()):1;
          if(movement>=power){
            visited.push(neighbor)
          }
        }
      }
    }
    return visited
  }
}


export function containHex(arr:Array<Hex>,hex:Hex){
  if(!arr){
   return false;
  }
  for(let h of arr){
    if(h.equalHex(hex)){
      return true
    }
  }
  return false
}

export const roundToHex = ({ x, y, z }: Hex): Hex => {
  let rx = Math.round(x)
  let ry = Math.round(y)
  let rz = Math.round(z)

  const diff_x = Math.abs(rx - x)
  const diff_y = Math.abs(ry - y)
  const diff_z = Math.abs(rz - z)

  if (diff_x > diff_y && diff_x > diff_z)
      rx = -ry-rz
  else if (diff_y > diff_z)
      ry = -rx-rz
  else
      rz = -rx-ry

  return new Hex(rx, ry, rz);
}

// https://www.redblobgames.com/grids/hexagons/#pixel-to-hex
export const pixelToHex = (point: Point, orientation: OrientationsEnum, origin: Point, hexSize: Point)  => {
  const pt: Point = { x: (point.x - origin.x) / hexSize.x, y: (point.y - origin.y) / hexSize.y };
  
  const q = ORIENTATIONS_CONSTS[orientation].b0 * pt.x + ORIENTATIONS_CONSTS[orientation].b1 * pt.y;
  const r = ORIENTATIONS_CONSTS[orientation].b2 * pt.x + ORIENTATIONS_CONSTS[orientation].b3 * pt.y;
  const hex = new Hex(q, r, -q - r);
  return roundToHex(hex);
}

export const cubeCoordinatesToAxial = (x: number, z: number) => new Hex(x, z);

export const axialCoordinatesToCube = (x: number, y: number) => new Hex(x, -x - y, y);

type Directions = 0 | 1 | 2 | 3 | 4 | 5;

export const directions = {
  0: new Hex(1, 0, -1),
  1: new Hex(1, -1, 0),
  2: new Hex(0, -1, 1),
  3: new Hex(-1, 0, 1),
  4: new Hex(-1, 1, 0),
  5: new Hex(0, 1, -1),
};

export const neighboor = (hex: Hex, direction: Directions) => add(hex, directions[direction]);

export function testHexGrids(){
  // const center = axialCoordinatesToCube(0,0);
  // console.log(center,"center")
  // console.log(neighboor(center,3),"neighbor")
  // console.log(neighboor(center,5),"neighbor")
  //
  // const a = new Hex(1,0,-1);
  // const b = new Hex(1,0, -1 );
  // console.log(distanceBetweenHexes(center,axialCoordinatesToCube(65539,-65538)))
  // const id = toUINT256(axialCoordinatesToCube(65536,-65536))
  const hex = toAxial(new BigNumber(8589082611).toString(10));
  const hex2 = toAxial(new BigNumber(5636153).toString(10));
  const hex3 = toAxial(new BigNumber(5636239).toString(10));
  console.log(hex,hex2,hex3,"tessssss",toOpCode([1,2,3,4],4))

}

export const rgbToHex = function(color) {
  let arr = [],
      strHex;
  if (/^(rgb|RGB)/.test (color)) {
    arr = color.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
    strHex = ((1 << 24) + (arr[0] << 16) + (arr[1] << 8) + parseInt(arr[2])).toString(16).substr(1);
  } else {
    strHex = color;
  }
  return strHex;
};


const MASK_QS=0x1FFFF;
export const toUINT256 = function (hex:Hex):string{
  let ret:BigNumber=new BigNumber(Math.abs(hex.x));
  ret=ret.plus(new BigNumber(Math.abs(hex.z)).multipliedBy(2**17));
  return ret.toString(10)
}

export const toAxial = function (id:string):Hex{
  // const u256 = new BN(new BigNumber(id).toString(16), 16).toArrayLike(Buffer, "be", 32)
  const q = MASK_QS & new BigNumber(id).toNumber()
  const s = MASK_QS & Math.floor(new BigNumber(id).dividedBy(2**17).toNumber())
  // const q=int32(uint32(MASK_QS&_v));
  // const s=-int32(uint32(MASK_QS&(_v/2**17)));
  return axialCoordinatesToCube(q,-s)
}

export const isBlankLand = (hex:HexInfo):boolean =>{
  return !hex.land
}

export const noCounter = (hex:HexInfo):boolean =>{
  return !hex.land || !hex.land.counter
}

export const calcCounterRgb = (rate:number,black:boolean = false)=>{
  if(black){
    const rgba = [253,254,135];
    const rgbb = [243,247,207];//7d11ef    f265ff
    const rgbA = [157,55,0];
    const rgbB = [248,141,0];
    const start = convertRgb(rgba,rgbA,rate,true);
    const end = convertRgb(rgbb,rgbB,rate,true)
    return [start,end]
  }else{
    const rgba = [0,136,207];
    const rgbb = [47,187,246];//7d11ef    f265ff
    const rgbA = [36,5,74];
    const rgbB = [234,98,252];

    const start = convertRgb(rgba,rgbA,rate);
    const end = convertRgb(rgbb,rgbB,rate)
    return [start,end]
  }
}

const convertRgb = (rgba:Array<number>,rgbA:Array<number>,rate:number,black?:boolean)=>{
  const arr = [];
  for(let i=0;i<3;i++){
    arr.push(Math.floor((rgba[i]*(100-rate)+rgbA[i]*(rate))/100))
  }
  return arr
}

export const toOpCode = (arr:Array<number>,len:number) =>{
  const jArr:Array<string> = arr.map(v=>{return binary(v,len)})
  return jArr.join("")
}

function binary(num:number, bits:number):string {
  let resArry = [];
  let xresArry:Array<string> = [];
  let i = 0;
  for (; num > 0;) {
    resArry.push(num % 2);
    num = parseInt(String(num / 2));
    i++;
  }
  for (let j = i - 1; j >= 0; j--) {
    xresArry.push(resArry[j]);
  }
  if (bits < xresArry.length) {
    xresArry = xresArry.slice(xresArry.length-bits)
  }
  if (bits) {
    for (let r = xresArry.length; r < bits; r++) {
      xresArry.unshift("0");
    }
  }
  return xresArry.join().replace(/,/g, "");
}