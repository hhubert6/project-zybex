import { MapElement } from '../world/Map';
import { getBoundings, Moveable } from '../world/Moveable';

export default class MapCollider {
  static collide(player: Moveable, objects: MapElement[]): boolean {
    let collisionDetected = false;

    for (let i = 0; i < objects.length; i++) {
      if (this.collideObject(player, objects[i])) {
        collisionDetected = true;
        break;
      }
    }

    return collisionDetected;
  }

  private static collideObject(player: Moveable, object: MapElement): boolean {
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
