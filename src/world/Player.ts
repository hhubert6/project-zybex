import { Moveable } from './Moveable';
import { Vector } from '../vector';
import { bullet, PlayerShooter, weapon } from './Shooter';
import { WORLD_HEIGHT, WORLD_WIDTH } from './World';

export default class Player implements Moveable {
  color = '#dddddd';
  pos: Vector = [0, 0];
  velocity: Vector = [0, 0];
  dimensions: Vector = [20, 20];
  colliding = false;
  health = 5;
  levels = {
    [weapon.ORBIT]: 4,
    [weapon.WAY]: 0,
    [weapon.GUN]: 0,
    [weapon.PULSE]: 0,
    [weapon.WALL]: 0,
  };
  bullets: bullet[] = [];
  currentWeapon: weapon = weapon.ORBIT;
  readonly shooter: PlayerShooter;

  constructor() {
    this.shooter = new PlayerShooter(this.pos, this.dimensions[1]);
  }

  moveRight() {
    this.velocity[0] = 2;
  }

  moveLeft() {
    this.velocity[0] = -2;
  }

  moveUp() {
    this.velocity[1] = -2;
  }

  moveDown() {
    this.velocity[1] = 2;
  }

  update(bulletsPool: bullet[]) {
    this.shooter.update(
      this.currentWeapon,
      this.levels[this.currentWeapon],
      this.bullets,
      bulletsPool,
    );

    this.updateBullets(bulletsPool);

    this.pos[0] += this.velocity[0];
    this.pos[1] += this.velocity[1];
    this.color = this.colliding ? '#ff0000' : '#dddddd';
  }

  private updateBullets(bulletsPool: bullet[]) {
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].pos[0] += this.bullets[i].velocity[0];
      this.bullets[i].pos[1] += this.bullets[i].velocity[1];
    }

    const removalIndices = [];

    for (let i = 0; i < this.bullets.length; i++) {
      if (
        this.bullets[i].pos[0] < 0 ||
        this.bullets[i].pos[0] > WORLD_WIDTH ||
        this.bullets[i].pos[1] < 0 ||
        this.bullets[i].pos[1] > WORLD_HEIGHT
      ) {
        removalIndices.push(i);
      }
    }

    while (removalIndices.length) {
      bulletsPool.push(...this.bullets.splice(removalIndices.pop()!, 1));
    }
  }
}
