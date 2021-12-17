import { Enemy } from '../world/enemies';
import { getBoundings, Moveable } from '../world/Moveable';
import { bullet } from '../world/shooters/shooter';

export default class BulletsCollider {
  collideEnemies(enemies: Enemy[], bullets: bullet[]) {
    for (let i = 0; i < enemies.length; i++) {
      if (enemies[i].dying) continue;

      for (let j = 0; j < bullets.length; j++) {
        if (bullets[j].striked) continue;

        if (this.collideObject(enemies[i], bullets[j])) {
          bullets[j].striked = true;
          enemies[i].striked++;
        }
      }
    }
  }

  collidePlayer(player: Moveable, bullets: bullet[]): boolean {
    for (let i = 0; i < bullets.length; i++) {
      if (this.collideObject(player, bullets[i])) {
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
