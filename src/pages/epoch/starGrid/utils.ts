import {Counter, Land, StarGridType} from "../../../types";

export const isEmptyPlanet = (l:Land) =>{
    return !l || l.enType == StarGridType._;
}

export const isEmptyCounter = (c:Counter) =>{
    return !c || c.enType == StarGridType._;
}