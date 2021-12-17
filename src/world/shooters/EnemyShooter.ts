import { Vector } from '../../vector';
import { bullet, ENEMY_BULLET_SPEED, getCenterPos, Shooter } from './shooter';

const BULLET_SIZE = 6;

export class EnemyShooter extends Shooter {
  delay: number | null = null;

  constructor(
    srcPos: Vector,
    diemnsions: Vector,
    bullets: bullet[],
    bulletsPool: bullet[],
  ) {
    super(srcPos, diemnsions, bullets, bulletsPool);
  }

  setup(srcPos: Vector, dimensions: Vector) {
    this.srcPos = srcPos;
    this.dimensions = dimensions;
  }

  set fireDelay(v: number) {
    this.delay = v * 60;
    this.timeCounter = this.delay;
  }

  update() {
    if (!this.delay) return;

    this.timeCounter++;

    if (this.timeCounter >= this.delay) {
      this.timeCounter = 0;
      this.fire();
    }
  }

  fire() {
    let bullet = this.bulletsPool.pop();

    const posX = getCenterPos(this.srcPos[0], this.dimensions[0], BULLET_SIZE);
    const posY = getCenterPos(this.srcPos[1], this.dimensions[1], BULLET_SIZE);

    if (bullet) {
      bullet.pos[0] = posX;
      bullet.pos[1] = posY;

      bullet.velocity[0] = -ENEMY_BULLET_SPEED;
      bullet.velocity[1] = 0;

      bullet.striked = false;

      bullet.dimensions[0] = BULLET_SIZE;
      bullet.dimensions[1] = BULLET_SIZE;
      bullet.weapon = undefined;
      bullet.type = undefined;
    } else {
      bullet = {
        pos: [posX, posY],
        velocity: [-ENEMY_BULLET_SPEED, 0],
        dimensions: [BULLET_SIZE, BULLET_SIZE],
        striked: false,
        power: 1,
      };
    }

    this.bullets.push(bullet);
  }
}
