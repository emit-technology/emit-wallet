
interface PeriodNE {
    userNE:string;
    totalNE:string;
    totalEN:string;
}

interface PeriodUserNE{
    enType: StarGridType;
    period: string;
    base: PeriodNE;
    attach: PeriodNE;
    UserEN: string;
}

interface UserENInfo {
    enType:StarGridType;
    userNEs: Array<PeriodUserNE>;
    baseCanUsed:string;
    attachCanUsed:string;
}

interface ResourceInfo {
    enType: StarGridType;
    user: string;
    total: string
}

export interface Land {
    coordinate: string;
    owner: string;
    marker: string;
    birth: string;
    level: string;
    base: string;
    capacity: string;
    gene: string;
    enType: StarGridType;
    counter?: Counter
    gis: Gis
    canCapture: boolean,
}

export interface Counter {
    counterId: string
    base: string
    level:string
    capacity: string
    rate: string
    move: string
    defense: string
    force: string
    luck: string
    life: string
    gene: string
    enType: StarGridType
    counterType: COUNTER_TYPE
}

export enum COUNTER_TYPE {
    _,
    RAIDER
}

export interface Gis {
    q: number
    s: number
    r?: number
}

export enum StarGridType {
    _,
    WATER,
    EARTH
}

export interface DriverStarGrid {
    owner: string
    name: string
    base: string
    capacity: string
    rate: string
    gene: string
}

export interface Position {
    coordinate: string
    operator: string
    user: string
}

export interface UserInfo {
    nextCaptureTime: string;
    locked: LockedInfo;
}

export interface LockedInfo {
    counter?: Counter
    currentPeriod: string;
    nextSettlementPeriod: string;
    endPeriod: string;
    userNEInfo:UserENInfo;
    current: Array<PeriodUserNE>;
    last: Array<PeriodUserNE>;
    resources: Array<ResourceInfo>
    unsettlement:string;
    userCoordinate:string;
    userDefaultWaterCoordinate:string;
    userDefaultEarthCoordinate:string;
    nextCaptureTime: string;
    nextOpTime: string;
}

export interface Token {
    symbol:string
    decimal:number
    total:string
}

interface Range {
    maxQ: number,
    maxS: number
}

export interface UserPosition{
    maxRange: Range,
    positions: Array<Position>,
    recommendation:Range
}

export interface StargridApproveInfo {
    user:string;
    operator:string;
    approved:boolean
}