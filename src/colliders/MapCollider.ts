import { Vector } from '../vector';
import { mapElement, mapElementType, mapElementTypes } from '../world/map';
import { getBoundings, Moveable } from '../world/Moveable';

export default class MapCollider {
  constructor(private mapElementTypes: mapElementTypes) {}

  collide(player: Moveable, mapObjects: mapElement[]): boolean {
    let collisionDetected = false;

    for (let i = 0; i < mapObjects.length; i++) {
      if (this.collideObject(player, mapObjects[i])) {
        collisionDetected = true;
        break;
      }
    }

    return collisionDetected;
  }

  private collideObject(player: Moveable, { type, pos }: mapElement): boolean {
    const object: Moveable = {
      pos: pos as Vector,
      dimensions: this.mapElementTypes[type].dimensions as Vector,
    };

    const [playerLeft, playerRight, playerTop, playerBottom] = getBoundings(player);
    const [objectLeft, objectRight, objectTop, objectBottom] = getBoundings(object);

    if (playerBottom < objectTop) return false;

    if (
      (playerLeft < objectRight && playerLeft > objectLeft) ||
      (playerRight > objectLeft && playerRight < objectRight)
    )
      return true;

    return false;
  }
}
