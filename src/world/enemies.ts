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
  private health = 4;
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
  ) {
    this.spritePos = type.spritePos as Vector;
    this.dimensions = type.dimensions as Vector;
    this.shooter = new EnemyShooter(
      4,
      this.pos,
      this.dimensions,
      bullets,
      bulletsPool,
    );

    this.setupByType();
  }

  setup(typeName: string, type: enemyType, pos: Vector, behaviour: number) {
    let fireDelay = null;

    switch (typeName) {
      case 'square-spinner':
        if (behaviour !== 3) fireDelay = 5;
        break;
    }

    this.shooter.setup(fireDelay, pos, this.dimensions);
    this.typeName = typeName;
    this.pos = pos;
    this.behaviour = behaviour;
    this.spritePos = type.spritePos as Vector;
    this.dimensions = type.dimensions as Vector;

    (this.velocity[0] = 0), (this.velocity[1] = 0);
    this.health = 4;
    this.finished = false;
    this.timeCounter = 0;
    this.moveStage = 1;

    this.setupByType();
  }

  private setupByType() {
    switch (this.typeName) {
      case 'square-spinner':
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
        switch (this.behaviour) {
          case 1:
            this.velocity[0] = -3;
            this.velocity[1] = 0;
            break;
          case 2:
            this.velocity[0] = -3;
            this.velocity[1] = 0;
            break;
          case 3:
            this.velocity[0] = -3;
            this.velocity[1] = 0.5 * (Math.round(Math.random()) * 2 - 1);
            break;
        }
        break;
    }
  }

  update(bullets: bullet[], bulletsPool: bullet[]) {
    this.shooter.start();

    switch (this.typeName) {
      case 'ship-spinner':
        this.updateShipSpinner();
        break;
    }

    this.pos[0] += this.velocity[0];
    this.pos[1] += this.velocity[1];

    this.timeCounter++;
  }

  private updateShipSpinner() {
    if (this.behaviour === 2 || this.behaviour === 3) return;

    if (this.moveStage === 1 && this.pos[0] <= 320 - this.dimensions[0] - 1) {
      this.velocity[0] = 0;
      this.moveStage++;
    }

    if (this.timeCounter === 60 * 5) {
      this.velocity[0] = -3;
    }
  }
}
