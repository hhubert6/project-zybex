import { Moveable } from './Moveable';
import { Vector } from '../vector';
import { bullet, weapon } from './shooters/shooter';
import { WORLD_HEIGHT, WORLD_WIDTH } from './World';
import { PlayerShooter } from './shooters/PlayerShooter';

export const PLAYER_WIDTH = 20;
export const PLAYER_HEIGHT = 20;

export default class Player implements Moveable {
  color = '#dddddd';
  velocity: Vector = [0, 0];
  readonly dimensions: Vector = [PLAYER_WIDTH, PLAYER_HEIGHT];
  colliding = false;
  health = 5;
  levels: Record<weapon, number> = {
    [weapon.ORBIT]: 1,
    [weapon.WAY]: 0,
    [weapon.GUN]: 0,
    [weapon.PULSE]: 1,
    [weapon.WALL]: 0,
  };
  bullets: bullet[] = [];
  currentWeapon: weapon = weapon.ORBIT;
  readonly shooter: PlayerShooter;

  constructor(public pos: Vector, bulletsPool: bullet[]) {
    this.shooter = new PlayerShooter(
      this.pos,
      this.dimensions,
      this.bullets,
      bulletsPool,
    );

    this.shooter.start(this.currentWeapon, this.levels[this.currentWeapon]);
  }

  moveRight() {
    this.velocity[0] = 2.1;
  }

  moveLeft() {
    this.velocity[0] = -2.1;
  }

  moveUp() {
    this.velocity[1] = -2.1;
  }

  moveDown() {
    this.velocity[1] = 2.1;
  }

  update(bulletsPool: bullet[]) {
    this.updateBullets(bulletsPool);

    this.pos[0] += this.velocity[0];
    this.pos[1] += this.velocity[1];
    this.color = this.colliding ? '#ff0000' : '#dddddd';
  }

  changeWeapon() {
    const weapons = Object.entries(this.levels)
      .filter(([_, v]) => v > 0)
      .map(([k, _]) => k);

    if (weapons.length === 1) return;

    this.clearBullets();

    const index = weapons.indexOf(this.currentWeapon);
    const newIndex = index + 1 === weapons.length ? 0 : index + 1;

    this.currentWeapon = weapons[newIndex] as weapon;

    this.shooter.start(this.currentWeapon, this.levels[this.currentWeapon]);
  }

  private updateBullets(bulletsPool: bullet[]) {
    if (this.currentWeapon === weapon.ORBIT)
      this.shooter.handleOrbit(this.levels[this.currentWeapon]);

    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].pos[0] += this.bullets[i].velocity[0];
      this.bullets[i].pos[1] += this.bullets[i].velocity[1];
    }

    const removalIndices = [];
    const refireBullets = [];

    for (let i = 0; i < this.bullets.length; i++) {
      if (
        this.bullets[i].striked ||
        this.bullets[i].pos[0] < 0 ||
        this.bullets[i].pos[0] > WORLD_WIDTH + 10 ||
        this.bullets[i].pos[1] < 0 ||
        this.bullets[i].pos[1] > WORLD_HEIGHT
      ) {
        removalIndices.push(i);
        refireBullets.push(this.bullets[i]);
      }
    }

    while (removalIndices.length) {
      bulletsPool.push(...this.bullets.splice(removalIndices.pop()!, 1));
    }

    this.shooter.refire(refireBullets);
  }

  private clearBullets() {
    this.bullets.length = 0;
  }
}
