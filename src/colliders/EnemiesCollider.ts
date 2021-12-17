import { Enemy } from '../world/enemies';
import { getBoundings, Moveable } from '../world/Moveable';

export default class EnemiesCollider {
  collide(obj: Moveable, enemies: Enemy[]): boolean {
    for (let i = 0; i < enemies.length; i++) {
      if (enemies[i].dying) continue;

      if (this.collideObject(obj, enemies[i])) {
        enemies[i].striked = 10;
        return true;
      }
    }
    return false;
  }

  private collideObject(obj1: Moveable, obj2: Moveable): boolean {
    const [obj1Left, obj1Right, obj1Top, obj1Bottom] = getBoundings(obj1);
    const [obj2Left, obj2Right, obj2Top, obj2Bottom] = getBoundings(obj2);

    if (obj1Top > obj2Bottom) return false;
    if (obj2Top > obj1Bottom) return false;
    if (obj1Left > obj2Right) return false;
    if (obj2Left > obj1Right) return false;

    return true;
  }
}
