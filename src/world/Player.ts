import { Moveable } from './Moveable';
import { Vector } from '../vector';
import { bullet, weapon } from './shooters/shooter';
import { WORLD_HEIGHT, WORLD_WIDTH } from './World';
import { PlayerShooter } from './shooters/PlayerShooter';

export const PLAYER_WIDTH = 20;
export const PLAYER_HEIGHT = 20;

enum animation {
  NONE = 0,
  EMERGING = 1,
  DYING = 2,
}
export default class Player implements Moveable {
  score = 0;
  timeCounter = 0;
  color = '#dddddd';
  animation: animation = animation.EMERGING;

  velocity: Vector = [0, 0];
  readonly dimensions: Vector = [PLAYER_WIDTH, PLAYER_HEIGHT];

  transparent = false;
  colliding = false;
  health = 5;
  levels: Record<weapon, number> = {
    [weapon.ORBIT]: 1,
    [weapon.WAY]: 4,
    [weapon.GUN]: 1,
    [weapon.PULSE]: 1,
    [weapon.WALL]: 1,
  };

  bullets: bullet[] = [];
  bulletsPool: bullet[] = [];
  currentWeapon: weapon = weapon.ORBIT;
  readonly shooter: PlayerShooter;

  onChange: (type: string, data: any) => void = () => null;

  constructor(public pos: Vector) {
    this.shooter = new PlayerShooter(
      this.pos,
      this.dimensions,
      this.bullets,
      this.bulletsPool,
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

  update() {
    if (this.colliding) return this.die();
    if (this.animation === animation.DYING) return this.updateDie();
    else if (this.transparent) this.updateTransparent();
    if (this.animation === animation.EMERGING) this.updateEmerge();

    this.updateBullets();

    this.pos[0] += this.velocity[0];
    this.pos[1] += this.velocity[1];
  }

  private die() {
    this.color = '#ff0000';
    this.health--;
    this.colliding = false;
    this.transparent = true;
    this.animation = animation.DYING;
    this.clearBullets();
    this.onChange('health', this.health);
  }

  private updateEmerge() {
    this.pos[0] += 1;
    if (this.pos[0] >= PLAYER_WIDTH / 2) {
      this.animation = animation.NONE;
    }
  }

  private updateDie() {
    this.timeCounter++;

    if (this.timeCounter >= 120) {
      this.timeCounter = 0;
      this.pos[0] = -PLAYER_WIDTH;
      this.animation = animation.EMERGING;
      this.color = '#999999';
      this.shooter.start(this.currentWeapon, this.levels[this.currentWeapon]);
    }
  }

  private updateTransparent() {
    this.timeCounter++;

    if (this.timeCounter >= 180) {
      this.timeCounter = 0;
      this.transparent = false;
      this.color = '#dddddd';
    }
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
    this.onChange('weapon', this.currentWeapon);
  }

  private updateBullets() {
    if (this.currentWeapon === weapon.ORBIT)
      this.shooter.handleOrbit(this.levels[this.currentWeapon]);

    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].pos[0] += this.bullets[i].velocity[0];
      this.bullets[i].pos[1] += this.bullets[i].velocity[1];
    }

    const removalIndices = [];

    for (let i = 0; i < this.bullets.length; i++) {
      if (
        this.bullets[i].striked ||
        this.bullets[i].pos[0] < 0 ||
        this.bullets[i].pos[0] > WORLD_WIDTH + 10 ||
        this.bullets[i].pos[1] < 0 ||
        this.bullets[i].pos[1] > WORLD_HEIGHT
      ) {
        removalIndices.push(i);
      }
    }

    while (removalIndices.length) {
      this.bulletsPool.push(...this.bullets.splice(removalIndices.pop()!, 1));
    }

    this.shooter.refire();
  }

  private clearBullets() {
    this.bullets.length = 0;
    this.bulletsPool.length = 0;
  }
}
