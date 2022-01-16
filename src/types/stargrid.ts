interface PeriodNE {
    userNE: string;
    totalNE: string;
}

export interface PeriodUserNE {
    enType: StarGridType;
    period: string;
    base: PeriodNE;
    attach: PeriodNE;
}

interface UserENInfo {
    enType: StarGridType;
    userNEs: Array<PeriodUserNE>;
    baseCanUsed: string;
    attachCanUsed: string;
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
    level: string
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
    nextOpTime?:number
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

export interface UserNEInfo {
    enType: StarGridType;
    nextSettlementPeriod: string;
    endPeriod: string;
    unsettlement: string;
    userNEs: Array<PeriodUserNE>;
    currentOutput: string;
}

export interface UserInfo {
    nextCaptureTime: string;
    // locked: LockedInfo;

    counter: Counter;
    lightCanUsed: string;
    earthCanUsed: string;
    darkCanUsed: string;
    waterCanUsed: string;

    userNEInfo: UserNEInfo;
    resources: Array<ResourceInfo>;
    userCoordinate: string;
    userDefaultWaterCoordinate: string;
    userDefaultEarthCoordinate: string;
    nextOpTime: string;
}

export interface GlobalInfo {
    period: string;
    burnedLight: string;
    burnedEarth: string;
    burnedDark: string;
    burnedWater: string;
    totalEN:string;
    waterOutput: string;
    earthOutput: string;

    userBurnedLight: string;
    userBurnedEarth: string;
    userBurnedDark: string;
    userBurnedWater: string;
}

export interface LockedInfo {
    currentPeriod: string;
    current: GlobalInfo;
    last: GlobalInfo;
    userInfo: UserInfo;
}

export interface Token {
    symbol: string
    decimal: number
    total: string
}

interface Range {
    maxQ: number,
    maxS: number,
    minQ:number,
    minS: number
}

export interface UserPosition {
    maxRange: Range,
    positions: Array<Position>,
    recommendation: Range
}

export interface ApproveInfo {
    user: string;
    operator: string;
    approved: boolean
}
export interface StarGridTrustInfo {
    approved: Array<ApproveInfo>
    approvedCount:number
    beApprovedCount:number
    trustRate:string
}
export interface  ENDetails {
    inputEN:string;
    driverCapacity:string;
    driverRate:string;
    driverOutEN:string;
    counterCapacity:string;
    counterRate:string;
    counterOutEN:string;
    planetCapacity:string;
    planetOutEN:string;
    totalPower:string;
    output:string;
}

//{"index":"5","creator":"0xbe71f56ee5d6fee1efeb20b5fb048b6b491870d6","enType":2,"depositType":0,"count":2,"totalAmount":"2000000000000000000","createTime":1642060067,"canWithDraw":true}
export interface UserDeposit{
    index:string
    creator:string;
    enType:StarGridType
    depositType:number
    count:number
    totalAmount:number
    createTime:number
    canWithdraw:boolean
}