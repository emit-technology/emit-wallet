import { Orientation } from "../models";

export enum OrientationsEnum {
  flat = "flat",
  pointy = "pointy",
}

// https://www.redblobgames.com/grids/hexagons/#pixel-to-hex
export const ORIENTATIONS_CONSTS: {
  [key in keyof typeof OrientationsEnum]: Orientation;
} = {
  [OrientationsEnum.flat]: new Orientation(
    3 / 2,
    0,
    Math.sqrt(3) / 2,
    Math.sqrt(3),

    2 / 3,
    0, 
    -1 / 3,
    Math.sqrt(3) / 3,

    0.0
  ),
  [OrientationsEnum.pointy]: new Orientation(
    Math.sqrt(3),
    Math.sqrt(3) / 2,
    0.0,
    3 / 2,
    
    Math.sqrt(3) / 3,
    -1 / 3,
    0,
    2 / 3,

    0.5
  ),
};
