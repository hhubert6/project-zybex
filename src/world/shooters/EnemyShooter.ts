import { Vector } from '../../vector';
import { bullet, ENEMY_BULLET_SPEED, getCenterPos, Shooter } from './shooter';

export class EnemyShooter extends Shooter {
  private delay: number | null;

  constructor(
    delay: number | null,
    srcPos: Vector,
    diemnsions: Vector,
    bullets: bullet[],
    bulletsPool: bullet[],
  ) {
    super(srcPos, diemnsions, bullets, bulletsPool);
    this.delay = delay ? delay * 60 : delay;
    if (this.delay) this.timeCounter = this.delay;
  }

  setup(delay: number | null, srcPos: Vector, dimensions: Vector) {
    this.srcPos = srcPos;
    this.dimensions = dimensions;
    this.delay = delay ? delay * 60 : delay;
    if (this.delay) this.timeCounter = this.delay;
  }

  update() {
    if (!this.delay) return;

    this.timeCounter++;

    if (this.timeCounter >= this.delay) {
      this.timeCounter = 0;
      // this.fire();
    }
  }

  fire() {
    let bullet = this.bulletsPool.pop();

    const posX = getCenterPos(this.srcPos[0], this.dimensions[0], 4);
    const posY = getCenterPos(this.srcPos[1], this.dimensions[1], 4);

    if (bullet) {
      bullet.pos[0] = posX;
      bullet.pos[1] = posY;

      bullet.velocity[0] = -ENEMY_BULLET_SPEED;
      bullet.velocity[1] = 0;

      bullet.striked = false;

      bullet.dimensions[0] = 4;
      bullet.dimensions[1] = 4;
      bullet.weapon = undefined;
      bullet.type = undefined;
    } else {
      bullet = {
        pos: [posX, posY],
        velocity: [-ENEMY_BULLET_SPEED, 0],
        dimensions: [4, 4],
        striked: false,
        power: 1,
      };
    }

    this.bullets.push(bullet);
  }
}
