import World from './world/World';

export default class Game {
  world = new World();

  update(deltaTime: number) {
    this.world.player.update(deltaTime);

    this.world.player.velocity[0] *= this.world.friction;
    this.world.player.velocity[1] *= this.world.friction;

    this.world.collideObject(this.world.player);
  }
}
