import { Vector } from '../../vector';
import {
  bullet,
  bulletType,
  dir,
  getCenterPos,
  GUN_BULLET_SPEED,
  PLAYER_BULLET_SPEED,
  PULSE_SIDE_BULLET_SPEED,
  Shooter,
  weapon,
} from './shooter';

export class PlayerShooter extends Shooter {
  private fireCounter = 0;

  constructor(
    srcPos: Vector,
    dimensions: Vector,
    bullets: bullet[],
    bulletsPool: bullet[],
  ) {
    super(srcPos, dimensions, bullets, bulletsPool);
  }

  start(currentWeapon: weapon, level: number) {
    switch (currentWeapon) {
      case weapon.ORBIT:
        this.fireCounter = 0;
        this.handleOrbit(level);
        break;
      case weapon.WAY:
        this.startWay(level);
        break;
      case weapon.GUN:
        this.startGun(level);
        break;
      case weapon.PULSE:
        this.startPulse(level);
        break;
      case weapon.WALL:
        this.startWall(level);
        break;
    }
  }

  refire(bullets: bullet[]) {
    for (let i = 0; i < bullets.length; i++) {
      this.fire(
        bullets[i].velocity,
        bullets[i].dimensions,
        bullets[i].weapon!,
        bullets[i].type!,
      );
    }
  }

  handleOrbit(level: number) {
    if (this.fireCounter >= 2 * level) return;

    this.timeCounter++;

    if (this.timeCounter >= 8) {
      this.timeCounter = 0;
      this.fireCounter++;
      this.fire([PLAYER_BULLET_SPEED, 0], [5, 4], weapon.ORBIT, bulletType.PRIMARY);
    }
  }

  private startWay(level: number) {
    if (level-- > 0) this.fireWay(dir.VERTICAL);
    if (level-- > 0) this.fireWay(dir.HORIZONTAL);
    if (level-- > 0) this.fireWay(dir.CROSS_RIGHT);
    if (level-- > 0) this.fireWay(dir.CROSS_LEFT);
  }

  private fireWay(direction: dir) {
    let velocity1: Vector;
    let velocity2: Vector;

    switch (direction) {
      case dir.VERTICAL:
        velocity1 = [0, PLAYER_BULLET_SPEED];
        velocity2 = [0, -PLAYER_BULLET_SPEED];
        break;
      case dir.HORIZONTAL:
        velocity1 = [PLAYER_BULLET_SPEED, 0];
        velocity2 = [-PLAYER_BULLET_SPEED, 0];
        break;
      case dir.CROSS_RIGHT:
        velocity1 = [PLAYER_BULLET_SPEED, -PLAYER_BULLET_SPEED];
        velocity2 = [-PLAYER_BULLET_SPEED, PLAYER_BULLET_SPEED];
        break;
      case dir.CROSS_LEFT:
        velocity1 = [PLAYER_BULLET_SPEED, PLAYER_BULLET_SPEED];
        velocity2 = [-PLAYER_BULLET_SPEED, -PLAYER_BULLET_SPEED];
        break;
    }

    this.fire(velocity1, [4, 4], weapon.WAY, bulletType.PRIMARY);
    this.fire(velocity2, [4, 4], weapon.WAY, bulletType.PRIMARY);
  }

  private startGun(level: number) {
    this.timeCounter = 0;
    this.fire(
      [GUN_BULLET_SPEED, 0],
      [10 + 10 * level, 6],
      weapon.GUN,
      bulletType.PRIMARY,
    );
  }

  private startPulse(level: number) {
    if (level > 2) {
      this.firePulseSides(level);
    }

    this.fire(
      [PLAYER_BULLET_SPEED, 0],
      [6, 25 + (level > 1 ? 10 : 0)],
      weapon.PULSE,
      bulletType.PRIMARY,
    );

    if (level > 2) this.firePulseSides(level);
  }

  private firePulseSides(level: number) {
    for (let i = -1; i < 2; i += 2) {
      this.fire(
        [PULSE_SIDE_BULLET_SPEED, PULSE_SIDE_BULLET_SPEED * i],
        [4, 4],
        weapon.PULSE,
        bulletType.SECONDARY,
      );
    }

    if (level > 3) {
      for (let i = -1; i < 2; i += 2) {
        this.fire(
          [PULSE_SIDE_BULLET_SPEED, PULSE_SIDE_BULLET_SPEED * i],
          [4, 4],
          weapon.PULSE,
          bulletType.TERTIARY,
        );
      }
    }
  }

  private startWall(level: number) {
    this.fire(
      [PLAYER_BULLET_SPEED, 0],
      [10, 5 + level * 14],
      weapon.WALL,
      bulletType.PRIMARY,
    );
  }

  protected fire(
    velocity: Vector,
    dimensions: Vector,
    weaponType: weapon,
    type: bulletType,
  ) {
    let b = this.bulletsPool.pop();

    const posX = velocity[0]
      ? this.srcPos[0] + this.dimensions[0] / 2
      : this.srcPos[0] + this.dimensions[0] / 2 - dimensions[0] / 2;
    const posY = getCenterPos(this.srcPos[1], this.dimensions[1], dimensions[1]);

    if (b) {
      b.pos[0] = posX - (type === bulletType.SECONDARY ? 10 : 0);
      b.pos[1] = posY;

      b.velocity[0] = velocity[0];
      b.velocity[1] = velocity[1];

      b.dimensions[0] = dimensions[0];
      b.dimensions[1] = dimensions[1];

      b.striked = false;
      b.weapon = weaponType;
      b.type = type;
    } else {
      b = {
        pos: [posX, posY],
        velocity,
        dimensions,
        striked: false,
        weapon: weaponType,
        type,
      };
    }

    this.bullets.push(b);
  }
}
