import { Vector } from '../vector';
import { Moveable } from './Moveable';
import { EnemyShooter } from './shooters/EnemyShooter';
import { bullet } from './shooters/shooter';

export interface enemyType {
  spritePos: number[];
  dimensions: number[];
}

export interface enemyTypes {
  [name: string]: enemyType;
}

export interface enemy {
  type: string;
  behaviour: number;
  activationPoint: number;
  startPos: number[];
}

export interface enemies {
  types: enemyTypes;
  elements: enemy[];
}

export class Enemy implements Moveable {
  spritePos: Vector;
  dimensions: Vector;
  velocity: Vector = [0, 0];
  finished = false;
  striked = 0; // number of hits
  dying = false;
  health = 1;
  private timeCounter = 0;
  private moveStage = 1;
  readonly shooter: EnemyShooter;

  constructor(
    public typeName: string,
    type: enemyType,
    public pos: Vector,
    public behaviour: number,
    bullets: bullet[],
    bulletsPool: bullet[],
    index: number,
  ) {
    this.spritePos = type.spritePos as Vector;
    this.dimensions = type.dimensions as Vector;
    this.shooter = new EnemyShooter(this.pos, this.dimensions, bullets, bulletsPool);

    this.setupByType(index);
  }

  setup(
    typeName: string,
    type: enemyType,
    pos: Vector,
    behaviour: number,
    index: number,
  ) {
    this.shooter.setup(pos, this.dimensions);
    this.shooter.delay = null;
    this.typeName = typeName;
    this.pos = pos;
    this.behaviour = behaviour;
    this.spritePos = type.spritePos as Vector;
    this.dimensions = type.dimensions as Vector;

    (this.velocity[0] = 0), (this.velocity[1] = 0);
    this.health = 1;
    this.finished = false;
    this.timeCounter = 0;
    this.moveStage = 1;

    this.setupByType(index);
  }

  private setupByType(index: number) {
    switch (this.typeName) {
      case 'square-spinner':
        this.health = 2;
        this.shooter.fireDelay = 4;
        switch (this.behaviour) {
          case 1:
            this.velocity[0] = -0.9;
            this.velocity[1] = 0;
            break;
          case 2:
            this.velocity[0] = -2 + (Math.random() - 0.5);
            this.velocity[1] = 0;
            break;
          case 3:
            this.velocity[0] = -1;
            this.velocity[1] = 0;
            break;
        }
        break;

      case 'ship-spinner':
        this.health = 2;
        switch (this.behaviour) {
          case 1:
            this.shooter.fireDelay = 2 + ((Math.random() * 2) | 0);
            this.velocity[0] = -3;
            break;
          case 2:
            this.velocity[0] = -5;
            break;
          case 3:
            this.velocity[0] = -3;
            this.velocity[1] = 0.5 * (Math.round(Math.random()) * 2 - 1);
            break;
        }
        break;

      case 'worm-head':
        this.health = 4;
        this.shooter.fireDelay = 2 + Math.random() * 3;
        this.shooter.timeCounter = 2 * 60;
        this.velocity[0] = -0.4;
        this.timeCounter = index * 5.6;
        break;
      case 'worm-body':
        this.health = 4;
        this.shooter.fireDelay = 2 + Math.random() * 3;
        this.shooter.timeCounter = 2 * 60;
        this.velocity[0] = -0.4;
        this.timeCounter = index * 5.6;
        break;
    }
  }

  update() {
    if (this.striked) {
      this.health -= this.striked;
      this.striked = 0;
      if (this.health <= 0) this.die();
    }
    if (this.dying) return this.updateDie();

    this.shooter.update();

    switch (this.typeName) {
      case 'ship-spinner':
        this.updateShipSpinner();
        break;
      case 'worm-head':
        this.updateWorm();
        break;
      case 'worm-body':
        this.updateWorm();
        break;
    }

    this.pos[0] += this.velocity[0];
    this.pos[1] += this.velocity[1];
  }

  private die() {
    this.dying = true;
    this.timeCounter = 0;
  }

  private updateDie() {
    this.timeCounter++;

    if (this.timeCounter >= 50) {
      this.dying = false;
      this.finished = true;
    }
  }

  private updateShipSpinner() {
    if (this.behaviour === 2 || this.behaviour === 3) return;
    this.timeCounter++;

    if (this.moveStage === 1 && this.pos[0] <= 320 - this.dimensions[0] - 1) {
      this.velocity[0] = 0;
      this.moveStage++;
    }

    if (this.timeCounter === 60 * 2) {
      this.velocity[0] = -5;
      this.timeCounter = 0;
    }
  }

  private updateWorm() {
    this.timeCounter++;

    this.pos[0] += Math.sin(this.timeCounter / 6) * 2;
  }
}
