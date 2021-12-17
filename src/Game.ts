import BulletsCollider from './colliders/BulletsCollider';
import MapCollider from './colliders/MapCollider';
import { enemies } from './world/enemies';
import { map } from './world/map';
import World from './world/World';

export default class Game {
  private readonly mapCollider: MapCollider;
  private readonly bulletsCollider = new BulletsCollider();
  readonly world: World;
  pause = false;

  constructor(map: map, enemies: enemies) {
    this.world = new World(map, enemies);
    this.mapCollider = new MapCollider(map.types);
  }

  update() {
    if (this.pause) return;
    if (this.world.player.health === 0) return;

    // updating current world map
    this.world.updateMap();

    // updating enemies state
    this.world.updateEnemies();

    this.world.updateBullets();

    // updating player state
    this.world.player.update();

    // updating player with world physics
    this.world.player.velocity[0] *= this.world.friction;
    this.world.player.velocity[1] *= this.world.friction;

    // handling world boundings collision
    if (!this.world.player.animation) this.world.collidePlayer(this.world.player);
    this.world.collideEnemies(this.world.currentEnemies);

    // handling collisions
    this.bulletsCollider.collideEnemies(
      this.world.currentEnemies,
      this.world.player.bullets,
    );

    this.mapCollider.collideBullets(
      this.world.player.bullets,
      this.world.currentViewMap,
    );

    if (this.world.player.transparent) return;

    if (
      this.mapCollider.collideObject(this.world.player, this.world.currentViewMap) ||
      this.bulletsCollider.collidePlayer(
        this.world.player,
        this.world.enemiesBullets,
      )
    ) {
      this.world.player.colliding = true;
    }
  }

  togglePause() {
    this.pause = !this.pause;
  }

  subscribe(subscriber: (type: string, data: any) => void) {
    this.world.player.onChange = subscriber;
  }
}
