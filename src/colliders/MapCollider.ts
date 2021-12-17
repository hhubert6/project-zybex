import { Vector } from '../vector';
import { mapElement, mapElementTypes } from '../world/map';
import { getBoundings, Moveable } from '../world/Moveable';
import { bullet } from '../world/shooters/shooter';

export default class MapCollider {
  constructor(private mapElementTypes: mapElementTypes) {}

  collideBullets(bullets: bullet[], mapObject: mapElement[]) {
    for (let i = 0; i < bullets.length; i++) {
      this.collideObject(bullets[i], mapObject);
    }
  }

  collideObject(obj: Moveable, mapObjects: mapElement[]): boolean {
    for (let i = 0; i < mapObjects.length; i++) {
      if (this.collideObjects(obj, mapObjects[i])) {
        if (obj.hasOwnProperty('striked')) {
          (obj as bullet).striked = true;
        }
        return true;
      }
    }

    return false;
  }

  private collideObjects(player: Moveable, { type, pos }: mapElement): boolean {
    if (type === 'ground') return false;
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
