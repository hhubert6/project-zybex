import { Vector } from '../vector';
import Player from './Player';
import { map, mapElement, mapElementTypes } from './map';
import SpatialHashArray from '../SpatialHashArray';

export default class World {
  friction = 0.8;
  dimensions: Vector = [320, 192];

  player = new Player();

  mapHashArray: SpatialHashArray;
  mapElementTypes: mapElementTypes;
  currentViewMap: mapElement[] = [];
  currentViewIndex = 0; // current map x position

  constructor(map: map) {
    const [playerWidth, playerHeight] = this.player.dimensions;
    const [worldWidth, worldHeight] = this.dimensions;

    this.player.pos[0] = worldWidth / 2 - playerWidth / 2;
    this.player.pos[1] = worldHeight / 2 - playerHeight / 2;

    this.mapHashArray = new SpatialHashArray(100, Math.ceil(map.width / 100));
    this.mapElementTypes = map.types;
    this.setupMap(map);
  }

  setupMap({ elements, types }: map) {
    for (let i = 0; i < elements.length; i++) {
      this.mapHashArray.addClient(
        elements[i].pos[0],
        types[elements[i].type].dimensions[0],
        elements[i],
      );
    }
  }

  updateMap() {
    const resolvePosition = ({ pos, type }: mapElement): Vector => {
      return [
        pos[0] - this.currentViewIndex,
        this.dimensions[1] - pos[1] - this.mapElementTypes[type].dimensions[1],
      ];
    };

    this.currentViewMap = this.mapHashArray
      .getInRange(this.currentViewIndex, this.dimensions[0])
      .map((el) => ({ ...el, pos: resolvePosition(el) }));

    this.currentViewIndex += 1;

    // temporary
    if (this.currentViewIndex >= 2 * 320) this.currentViewIndex = -0;
  }

  collidePlayer(object: Player) {
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
