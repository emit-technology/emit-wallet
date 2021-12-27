export interface Land{
    coordinate:string
    base:string
    capacity:string
    rate:string
    gene:string
    type:StarGridType;
    gis:Gis;
    operator?:Counter
}

export interface Counter{
    id:string
    base:string
    capacity:string
    rate:string
    move:string
    defense:string
    force:string
    luck:string
    gene:string
    position:string
    type:StarGridType
}

export interface Gis {
    q:number
    s:number
    r?:number
}

export enum StarGridType{
    _,
    WATER,
    EARTH
}

export interface DriverStarGrid{
    owner:string
    name:string
    base:string
    capacity:string
    rate:string
    gene:string
}

export interface Position{
    coordinate: string
    operator: string
    user: string

}