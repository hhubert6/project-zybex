import MapCollider from './colliders/MapCollider';
import World from './world/World';

export default class Game {
  world = new World();
  pause = false;

  update(deltaTime: number) {
    if (this.pause) return;

    // updating current world map
    this.world.updateMap();

    // updating player state
    this.world.player.update(deltaTime);

    // updating player with world physics
    this.world.player.velocity[0] *= this.world.friction;
    this.world.player.velocity[1] *= this.world.friction;

    // handling world boundings collision
    this.world.collideObject(this.world.player);

    // handling map collisions
    this.world.player.colliding = MapCollider.collide(
      this.world.player,
      this.world.currentViewMap,
    );
  }

  togglePause() {
    this.pause = !this.pause;
  }
}
