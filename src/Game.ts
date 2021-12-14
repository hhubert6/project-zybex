import MapCollider from './colliders/MapCollider';
import { enemies } from './world/enemies';
import { map } from './world/map';
import World from './world/World';

export default class Game {
  world: World;
  mapCollider: MapCollider;
  pause = false;

  constructor(map: map, enemies: enemies) {
    this.world = new World(map, enemies);
    this.mapCollider = new MapCollider(map.types);
  }

  update() {
    if (this.pause) return;

    // updating current world map
    this.world.updateMap();

    // updating enemies state
    this.world.updateEnemies();

    // updating player state
    this.world.player.update();

    // updating player with world physics
    this.world.player.velocity[0] *= this.world.friction;
    this.world.player.velocity[1] *= this.world.friction;

    // handling world boundings collision
    this.world.collidePlayer(this.world.player);
    this.world.collideEnemies(this.world.currentEnemies);

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
