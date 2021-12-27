import {Counter, Land} from "../../../types";

export interface Hex {
    x: number;
    y: number;
    z?: number;
}

export class Hex implements Hex {
    constructor(x: number, y: number, z?: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    x: number;
    y: number;
    z?: number;

    equalHex = (v: Hex): boolean => {
        if(this.z) {
            return (this.x == v.x && this.y == v.y && this.z == v.z)
        }
        return (this.x == v.x && this.y == v.y )
    }

    uKey = () =>{
        return this.z!==undefined ?[this.x,this.y,this.z].join("_"):[this.x,this.y].join("_")
    }
}

export interface HexInfo {
    hex:Hex
    land?:Land
    counter?:Counter
}