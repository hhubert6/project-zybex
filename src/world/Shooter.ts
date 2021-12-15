import { Vector } from '../vector';

const PLAYER_BULLET_SPEED = 5;
const ENEMY_BULLET_SPEED = 3;

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

  constructor(protected srcPos: Vector, protected height: number) {}

  abstract update(...args: any[]): void;

  protected abstract fire(...args: any[]): void;
}

export class EnemyShooter extends Shooter {
  private delay: number | null;

  constructor(delay: number | null, srcPos: Vector, height: number) {
    super(srcPos, height);
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
      bullet.velocity[0] = -ENEMY_BULLET_SPEED;
      bullet.velocity[1] = 0;
      bullet.dimensions[0] = 5;
      bullet.dimensions[1] = 3;
      bullet.type = bulletType.PRIMARY;
    } else {
      bullet = {
        pos: [this.srcPos[0], this.srcPos[1] + this.height / 2],
        velocity: [-ENEMY_BULLET_SPEED, 0],
        dimensions: [5, 3],
        type: bulletType.PRIMARY,
      };
    }

    bullets.push(bullet);
  }
}

export class PlayerShooter extends Shooter {
  private fireCounter = 0;

  constructor(srcPos: Vector, height: number) {
    super(srcPos, height);
  }

  update(
    curWeapon: weapon,
    level: number,
    bullets: bullet[],
    bulletsPool: bullet[],
  ) {
    this.timeCounter++;

    switch (curWeapon) {
      case weapon.ORBIT:
        this.updateOrbit(level, bullets, bulletsPool);
        break;
    }
  }

  private updateOrbit(level: number, bullets: bullet[], bulletsPool: bullet[]) {
    if (this.fireCounter === level * 2) {
      this.fireCounter = 0;
      this.timeCounter = 0;
      return;
    }

    if (this.fireCounter === 0) {
      if (this.timeCounter >= 50) {
        console.log(0);
        this.fireOrbit(bullets, bulletsPool);
        this.fireCounter++;
        this.timeCounter = 0;
      }
    } else {
      if (this.timeCounter >= 15) {
        this.fireOrbit(bullets, bulletsPool);
        this.fireCounter++;
        this.timeCounter = 0;
      }
    }
  }

  private fireOrbit(bullets: bullet[], bulletsPool: bullet[]) {
    let bullet = bulletsPool.pop();

    if (bullet) {
      bullet.pos[0] = this.srcPos[0];
      bullet.pos[1] = this.srcPos[1] + this.height / 2;
      bullet.velocity[0] = PLAYER_BULLET_SPEED;
      bullet.velocity[1] = 0;
      bullet.dimensions[0] = 5;
      bullet.dimensions[1] = 4;
      bullet.type = bulletType.PRIMARY;
    } else {
      bullet = {
        pos: [this.srcPos[0], this.srcPos[1] + this.height / 2],
        velocity: [PLAYER_BULLET_SPEED, 0],
        dimensions: [5, 3],
        type: bulletType.PRIMARY,
      };
    }

    bullets.push(bullet);
  }

  fire() {
    // todo
  }
}
