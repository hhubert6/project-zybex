import { Moveable } from './Moveable';
import { Vector } from '../vector';

export default class Player implements Moveable {
  color = '#dddddd';
  pos: Vector = [0, 0];
  velocity: Vector = [0, 0];
  dimensions: Vector = [20, 20];
  colliding = false;

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

  update() {
    this.pos[0] += this.velocity[0];
    this.pos[1] += this.velocity[1];
    this.color = this.colliding ? '#ff0000' : '#dddddd';
  }
}
