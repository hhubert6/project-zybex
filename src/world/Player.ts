import { Moveable } from './Moveable';
import { Vector } from '../types';

export default class Player implements Moveable {
  color = '#ff0000';
  pos: Vector = [0, 0];
  velocity: Vector = [0, 0];
  dimensions: Vector = [20, 20];

  moveRight() {
    this.velocity[0] = 1;
  }

  moveLeft() {
    this.velocity[0] = -1;
  }

  moveUp() {
    this.velocity[1] = -1;
  }

  moveDown() {
    this.velocity[1] = 1;
  }

  update(deltaTime: number) {
    this.pos[0] += this.velocity[0] * (deltaTime / 10);
    this.pos[1] += this.velocity[1] * (deltaTime / 10);
  }
}
