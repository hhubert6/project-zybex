import { Moveable } from './Moveable';
import { Vector } from '../vector';
import Player from './Player';
import { map, MapElement } from './Map';
import SpatialHashArray from '../SpatialHashArray';

export default class World {
  friction = 0.8;
  dimensions: Vector = [320, 192];
  player = new Player();
  mapHashArray = new SpatialHashArray(50, 20);
  currentViewMap: MapElement[] = [];
  currentViewIndex = 0; // current map x position

  constructor() {
    const [playerWidth, playerHeight] = this.player.dimensions;
    const [worldWidth, worldHeight] = this.dimensions;

    this.player.pos[0] = worldWidth / 2 - playerWidth / 2;
    this.player.pos[1] = worldHeight / 2 - playerHeight / 2;

    for (let i = 0; i < map.length; i++) {
      this.mapHashArray.addClient(map[i].pos[0], map[i].dimensions[0], map[i]);
    }
  }

  updateMap() {
    const resolvePosition = ({ pos, dimensions }: MapElement): Vector => {
      return [
        pos[0] - this.currentViewIndex,
        this.dimensions[1] - pos[1] - dimensions[1],
      ];
    };

    this.currentViewMap = this.mapHashArray
      .getInRange(this.currentViewIndex, this.dimensions[0])
      .map((el) => ({ ...el, pos: resolvePosition(el) }));

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
