import { Vector } from '../vector';

export enum weapon {
  ORBIT,
  WAY,
  GUN,
  PULSE,
  WALL,
}

export enum bulletType {
  BASIC,
  SECONDARY,
  TERTIARY,
}

export interface bullet {
  pos: Vector;
  dimensions: Vector;
  type: bulletType;
}

abstract class Shooter {
  protected timeCounter = 0;
  bullets: bullet[] = [];

  constructor(protected srcPos: Vector, protected bulletsPool: bullet[]) {}

  abstract update(): void;

  protected abstract fire(): void;
}

export class EnemyShooter extends Shooter {
  private readonly delay: number;

  constructor(delay: number, srcPos: Vector, bulletsPool: bullet[]) {
    super(srcPos, bulletsPool);
    this.delay = delay * 60;
  }

  update() {
    this.timeCounter++;

    if (this.timeCounter >= this.delay) {
      this.timeCounter = 0;
      this.fire();
    }
  }

  fire() {}
}
