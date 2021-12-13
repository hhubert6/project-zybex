import { Vector } from '../vector';

export interface enemyType {
  spritePos: number[];
  dimensions: number[];
}

export interface enemyTypes {
  [name: string]: enemyType;
}

export interface enemy {
  type: string;
  behaviour: number;
  activationPoint: number;
  startPos: number[];
}

export interface enemies {
  types: enemyTypes;
  elements: enemy[];
}

export class Enemy {
  velocity: Vector = [0, 0];

  constructor(
    public typeName: string,
    public type: enemyType,
    public pos: Vector,
    public behaviour: number,
  ) {}

  update() {}
}
