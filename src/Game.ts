import MapCollider from './colliders/MapCollider';
import { map } from './world/map';
import World from './world/World';

export default class Game {
  world: World;
  mapCollider: MapCollider;
  pause = false;

  constructor(map: map) {
    this.world = new World(map);
    this.mapCollider = new MapCollider(map.types);
  }

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
    this.world.collidePlayer(this.world.player);

    // handling map collisions
    this.world.player.colliding = this.mapCollider.collide(
      this.world.player,
      this.world.currentViewMap,
    );
  }

  togglePause() {
    this.pause = !this.pause;
  }
}
