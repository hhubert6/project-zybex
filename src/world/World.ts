import { Moveable } from './Moveable';
import { Vector } from '../vector';
import Player from './Player';
import { gameMap, map } from './Map';

export default class World {
  friction = 0.8;
  dimensions: Vector = [320, 192];
  player = new Player();
  map: gameMap = map;
  currentViewMap: gameMap = [];
  currentViewIndex = 0; // current map x position

  constructor() {
    const [playerWidth, playerHeight] = this.player.dimensions;
    const [worldWidth, worldHeight] = this.dimensions;

    this.player.pos[0] = worldWidth / 2 - playerWidth / 2;
    this.player.pos[1] = worldHeight / 2 - playerHeight / 2;
  }

  updateMap() {
    this.currentViewMap = this.map
      .filter(
        ({ pos: [x] }) =>
          x >= this.currentViewIndex - 100 &&
          x <= this.currentViewIndex + this.dimensions[0],
      )
      .map((el) => ({
        ...el,
        pos: [
          el.pos[0] - this.currentViewIndex,
          this.dimensions[1] - el.pos[1] - el.dimensions[1],
        ],
      }));

    this.currentViewIndex += 1;

    // temporary
    if (this.currentViewIndex > 2 * 320) this.currentViewIndex = -0;
  }

  collideObject(object: Moveable) {
    for (let i = 0; i < 2; i++) {
      if (object.pos[i] <= 0) {
        object.pos[i] = 0;
        object.velocity[i] = 0;
      } else if (object.pos[i] + object.dimensions[i] >= this.dimensions[i]) {
        object.pos[i] = this.dimensions[i] - object.dimensions[i];
        object.velocity[i] = 0;
      }
    }
  }
}
