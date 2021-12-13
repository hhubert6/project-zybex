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
  velocity: Vector = [-2, 0];
  finished = false;

  constructor(
    public typeName: string,
    public type: enemyType,
    public pos: Vector,
    public behaviour: number,
  ) {}

  update() {
    this.pos[0] += this.velocity[0];
    this.pos[1] += this.velocity[1];
  }
}
