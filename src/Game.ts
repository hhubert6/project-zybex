import { Vector } from './types';

interface Moveable {
  pos: Vector;
  velocity: Vector;
  dimensions: Vector;
}

export default class Game {
  world = new World();

  update(deltaTime: number) {
    this.world.player.pos[1] += this.world.gravity;
    this.world.player.update();

    this.world.player.velocity[0] *= this.world.friction;
    this.world.player.velocity[1] *= this.world.friction;

    this.world.collideObject(this.world.player);
  }
}

class World {
  gravity = 0.5;
  friction = 0.9;
  dimensions: Vector = [500, 300];
  player = new Player();

  collideObject(object: Moveable) {
    for (let i = 0; i < 2; i++) {
      if (object.pos[i] <= i) {
        object.pos[i] = i;
        object.velocity[i] = i;
      } else if (object.pos[i] + object.dimensions[i] >= this.dimensions[i]) {
        object.pos[i] = this.dimensions[i] - object.dimensions[i];
        object.velocity[i] = i;
      }
    }
  }
}

class Player implements Moveable {
  color = '#ff0000';
  pos: Vector = [0, 0];
  velocity: Vector = [0, 0];
  dimensions: Vector = [20, 20];
  jumping = false;

  moveRight() {
    this.velocity[0] += 0.5;
  }

  moveLeft() {
    this.velocity[0] -= 0.5;
  }

  jump() {
    if (!this.jumping) {
      this.jumping = true;
      this.velocity[1] -= 20;
    }
  }

  update() {
    this.pos[0] += this.velocity[0];
    this.pos[1] += this.velocity[1];
  }
}
