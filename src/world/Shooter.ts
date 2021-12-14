import { Vector } from '../vector';

export enum weapon {
  ORBIT,
  WAY,
  GUN,
  PULSE,
  WALL,
}

export enum bulletType {
  PRIMARY,
  SECONDARY,
  TERTIARY,
}

export interface bullet {
  pos: Vector;
  velocity: Vector;
  dimensions: Vector;
  type: bulletType;
}

abstract class Shooter {
  protected timeCounter = 0;
  bullets?: bullet[];

  constructor(protected srcPos: Vector) {}

  abstract update(...args: any[]): void;

  protected abstract fire(...args: any[]): void;
}

export class EnemyShooter extends Shooter {
  private delay: number | null;

  constructor(delay: number | null, srcPos: Vector, private height: number) {
    super(srcPos);
    this.delay = delay ? delay * 60 : delay;
  }

  setup(delay: number | null, srcPos: Vector, height: number) {
    this.delay = delay ? delay * 60 : delay;
    this.srcPos = srcPos;
    this.height = height;
  }

  update(bullets: bullet[], bulletsPool: bullet[]) {
    if (!this.delay) return;

    this.timeCounter++;

    if (this.timeCounter >= this.delay) {
      this.timeCounter = 0;
      this.fire(bullets, bulletsPool);
    }
  }

  fire(bullets: bullet[], bulletsPool: bullet[]) {
    let bullet = bulletsPool.pop();

    if (bullet) {
      bullet.pos[0] = this.srcPos[0];
      bullet.pos[1] = this.srcPos[1] + this.height / 2;
    } else {
      bullet = {
        pos: [this.srcPos[0], this.srcPos[1] + this.height / 2],
        velocity: [-3, 0],
        dimensions: [5, 3],
        type: bulletType.PRIMARY,
      };
    }

    bullets.push(bullet);
  }
}
