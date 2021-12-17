import { Vector } from '../../vector';
import { Moveable } from '../Moveable';

export const ENEMY_BULLET_SPEED = 3;
export const PLAYER_BULLET_SPEED = 6;
export const GUN_BULLET_SPEED = 3;
export const PULSE_SIDE_BULLET_SPEED = 3;

export enum weapon {
  ORBIT = 'orbit',
  WAY = 'way',
  GUN = 'gun',
  PULSE = 'pulse',
  WALL = 'wall',
}

export enum bulletType {
  PRIMARY,
  SECONDARY,
  TERTIARY,
}

export interface bullet extends Moveable {
  pos: Vector;
  velocity: Vector;
  dimensions: Vector;
  striked: boolean;
  power: number;
  weapon?: weapon;
  type?: bulletType;
}

export const bulletPower = {
  [weapon.ORBIT]: 1,
  [weapon.WAY]: 2,
  [weapon.GUN]: 4,
  [weapon.PULSE]: 1,
  [weapon.WALL]: 1,
};

export const getCenterPos = (outerPos: number, outerDim: number, innerDim: number) =>
  outerPos + outerDim / 2 - innerDim / 2;

export abstract class Shooter {
  protected timeCounter = 0;

  constructor(
    protected srcPos: Vector,
    protected dimensions: Vector,
    protected bullets: bullet[],
    protected bulletsPool: bullet[],
  ) {}

  protected abstract fire(...args: any[]): void;
}

export enum dir {
  HORIZONTAL,
  VERTICAL,
  CROSS_RIGHT,
  CROSS_LEFT,
}
