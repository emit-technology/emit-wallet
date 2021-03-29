import {MinerScenes} from "../../../pages/epoch/miner";

// export interface Device {
//     base: number;
//     capacity: number;
//     power: number;
//     gene: string;
//     last: number;
// }

export interface DeviceInfo {
    category: string
    ticket: string;
    base: number;
    capacity: number;
    power: number;
    rate: string;
    gene: string;
    last: number;
}

export interface Driver {
    base: number;
    capacity: number;
    gene: string;
}

export interface PImage {
    serial: number;
    hash: string;
}

export interface UserInfo {
    scenes: MinerScenes;
    settlementPeriod: number;
    currentPeriod: number;
    lastUpdateTime: number;
    pImage: PImage;
    driver: DriverInfo;
}

export interface DriverInfo {
    name: string;
    base: number;
    capacity: number;
    rate: string;
    gene: string;
}