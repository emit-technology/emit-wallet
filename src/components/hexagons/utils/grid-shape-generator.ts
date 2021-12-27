import { Hex } from "../models/hex";
import { axialCoordinatesToCube } from "./hex-math";

export const parallelogram = (
  q1: number,
  q2: number,
  r1: number,
  r2: number,
  cubic = false
): Hex[] => {
  let hexas = [];
  for (let q = q1; q <= q2; q++) {
    for (let r = r1; r <= r2; r++) {
      let hex = new Hex(q, r);

      if (cubic) hex = axialCoordinatesToCube(hex.x, hex.y);

      hexas.push(hex);
    }
  }

  return hexas;
};

export const hexagon = (
  mapRadius: number,
  cubic = false
): Hex[] => {
  let hexas = [];
  for (let q = -mapRadius; q <= mapRadius; q++) {
    let r1 = Math.max(-mapRadius, -q - mapRadius);
    let r2 = Math.min(mapRadius, -q + mapRadius);
    for (let r = r1; r <= r2; r++) {
      let hex = new Hex(q, r);

      if (cubic) hex = axialCoordinatesToCube(hex.x, hex.y);

      hexas.push(hex);
    }
  }

  return hexas;
};

export const rectangle = (
  mapWidth: number,
  mapHeight: number,
  cubic = false,
  zeroAsCentralPoint = false
): Hex[] => {
  let hexas = [];

  if (zeroAsCentralPoint) {
    const r1 = -Math.floor(mapHeight / 2);
    const r2 = Math.ceil(mapHeight / 2);

    for (let r = r1; r < r2; r++) {
      let offset = Math.floor(r / 2);

      const q1 = -Math.floor(mapWidth / 2);
      const q2 = Math.ceil(mapWidth / 2);

      for (let q = q1 - offset; q < q2 - offset; q++) {
        let hex = new Hex(q, r);

        if (cubic) hex = axialCoordinatesToCube(hex.x, hex.y);

        hexas.push(hex);
      }
    }
  } else {
    for (let r = 0; r < mapHeight; r++) {
      let offset = Math.floor(r / 2); // or r>>1
      for (let q = -offset; q < mapWidth - offset; q++) {
        let hex = new Hex(q, r);

        if (cubic) hex = axialCoordinatesToCube(hex.x, hex.y);

        hexas.push(hex);
      }
    }
  }

  return hexas;
};

export const orientedRectangle = (
  width: number,
  height: number,
  cubic = false
): Hex[] => {
  let hexas = [];
  for (let q = 0; q < width; q++) {
    let offset = Math.floor(q / 2); // or q>>1
    for (let r = -offset; r < height - offset; r++) {
      let hex = new Hex(q, r);

      if (cubic) hex = axialCoordinatesToCube(hex.x, hex.y);

      hexas.push(hex);
    }
  }

  return hexas;
};

export const gridGenerator = {
  parallelogram,
  hexagon,
  rectangle,
  orientedRectangle,
};

export default gridGenerator;
