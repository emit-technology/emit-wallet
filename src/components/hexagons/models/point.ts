export interface Point {
  x: number;
  y: number;
}

export class Point implements Point {
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  x: number;
  y: number;
}
