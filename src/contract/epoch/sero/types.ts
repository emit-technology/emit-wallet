import {MinerScenes} from "../../../pages/epoch/miner";

export interface Device {
    base: number;
    capacity: number;
    power: number;
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
    pImage: PImage;
    driver: Driver;
}
