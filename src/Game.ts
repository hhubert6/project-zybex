import World from './world/World';

export default class Game {
  world = new World();
  pause = false;

  update(deltaTime: number) {
    if (this.pause) return;

    this.world.update();

    this.world.player.update(deltaTime);

    this.world.player.velocity[0] *= this.world.friction;
    this.world.player.velocity[1] *= this.world.friction;

    this.world.collideObject(this.world.player);
  }

  togglePause() {
    this.pause = !this.pause;
  }
}
