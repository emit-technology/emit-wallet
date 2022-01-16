import {StarGridType} from "../types";

interface CyType {
    base:string;
    attach:string
}

export const enType2Cy = (enType:StarGridType):CyType => {
    if(enType == StarGridType.EARTH){
        return {base:"bDARK",attach:"WATER"}
    }else if (enType == StarGridType.WATER){
        return {base:"bLIGHT",attach:"EARTH"}
    }
}

export const enType2ProductCy = (enType:StarGridType):string => {
    if(enType == StarGridType.EARTH){
        return "EARTH"
    }else if (enType == StarGridType.WATER){
        return "WATER"
    }
}