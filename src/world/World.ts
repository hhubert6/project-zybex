import { Vector } from '../vector';
import Player, { PLAYER_HEIGHT, PLAYER_WIDTH } from './Player';
import { map, mapElement, mapElementTypes } from './map';
import SpatialHashArray from '../SpatialHashArray';
import { enemies, enemy, Enemy, enemyTypes } from './enemies';
import { bullet } from './shooters/shooter';

export const WORLD_WIDTH = 320;
export const WORLD_HEIGHT = 175;

export default class World {
  friction = 0.8;

  player: Player;

  private readonly enemiesHashArray: SpatialHashArray;
  private readonly enemyTypes: enemyTypes;
  currentEnemies: Enemy[] = [];
  enemiesPool: Enemy[] = [];

  private readonly mapHashArray: SpatialHashArray;
  private readonly mapElementTypes: mapElementTypes;
  currentViewMap: mapElement[] = [];
  currentViewIndex = 0; // current map x position

  enemiesBullets: bullet[] = [];
  bulletsPool: bullet[] = [];

  constructor(map: map, enemies: enemies) {
    this.player = new Player([-PLAYER_WIDTH, WORLD_HEIGHT / 2 - PLAYER_HEIGHT / 2]);

    this.mapHashArray = new SpatialHashArray(40, Math.ceil(map.width / 40));
    this.mapElementTypes = map.types;
    this.setupMap(map);

    this.enemiesHashArray = new SpatialHashArray(40, Math.ceil(map.width / 40));
    this.enemyTypes = enemies.types;
    this.setupEnemies(enemies);
  }

  private setupMap({ elements, types }: map) {
    for (let i = 0; i < elements.length; i++) {
      this.mapHashArray.addClient(
        elements[i].pos[0],
        types[elements[i].type].dimensions[0],
        elements[i],
      );
    }
  }

  private setupEnemies({ elements }: enemies) {
    for (let i = 0; i < elements.length; i++) {
      this.enemiesHashArray.addClient(elements[i].activationPoint, 1, elements[i]);
    }
  }

  updateMap() {
    const resolvePosition = ({ pos, type }: mapElement): Vector => {
      return [
        pos[0] - this.currentViewIndex,
        WORLD_HEIGHT - pos[1] - this.mapElementTypes[type].dimensions[1],
      ];
    };

    this.currentViewMap = this.mapHashArray
      .getInRange(this.currentViewIndex, WORLD_WIDTH)
      .map<mapElement>(({ data }) => ({ ...data, pos: resolvePosition(data) }));

    this.currentViewIndex += 1.77;

    // temporary
    if (this.currentViewIndex >= 22 * 320) this.currentViewIndex = 0;
  }

  updateEnemies() {
    const currentPoint = this.currentViewIndex + WORLD_WIDTH;
    const enemiesToActivate = this.enemiesHashArray
      .getInRange(currentPoint, 1)
      .filter(({ data: { activationPoint } }) => currentPoint >= activationPoint);

    for (let i = 0; i < enemiesToActivate.length; i++) {
      this.enemiesHashArray.removeClient(enemiesToActivate[i]);
      this.activateEnemy(enemiesToActivate[i].data, i);
    }

    this.removeFinishedEnemies();

    for (let i = 0; i < this.currentEnemies.length; i++) {
      this.currentEnemies[i].update();
    }
  }

  updateBullets() {
    for (let i = 0; i < this.enemiesBullets.length; i++) {
      this.enemiesBullets[i].pos[0] += this.enemiesBullets[i].velocity[0];
      this.enemiesBullets[i].pos[1] += this.enemiesBullets[i].velocity[1];
    }

    const removalIndices = [];

    for (let i = 0; i < this.enemiesBullets.length; i++) {
      if (
        this.enemiesBullets[i].pos[0] < 0 ||
        this.enemiesBullets[i].pos[1] < 0 ||
        this.enemiesBullets[i].pos[1] > WORLD_HEIGHT
      ) {
        removalIndices.push(i);
      }
    }

    while (removalIndices.length) {
      this.bulletsPool.push(...this.enemiesBullets.splice(removalIndices.pop()!, 1));
    }
  }

  collidePlayer(object: Player) {
    if (object.animation) return;

    if (object.pos[0] <= 0) {
      object.pos[0] = 0;
      object.velocity[0] = 0;
    } else if (object.pos[0] + object.dimensions[0] >= WORLD_WIDTH - 5) {
      object.pos[0] = WORLD_WIDTH - 5 - object.dimensions[0];
      object.velocity[0] = 0;
    }
    if (object.pos[1] <= 0) {
      object.pos[1] = 0;
      object.velocity[1] = 0;
    } else if (object.pos[1] + object.dimensions[1] >= WORLD_HEIGHT) {
      object.pos[1] = WORLD_HEIGHT - object.dimensions[1];
      object.velocity[1] = 0;
    }
  }

  collideEnemies(objects: Enemy[]) {
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].pos[0] + objects[i].dimensions[0] <= 0) {
        objects[i].finished = true;
      }
    }
  }

  private activateEnemy({ type, startPos, behaviour }: enemy, i: number) {
    let enemy = this.enemiesPool.pop();

    if (enemy) {
      enemy.setup(type, this.enemyTypes[type], startPos as Vector, behaviour, i);
    } else {
      enemy = new Enemy(
        type,
        this.enemyTypes[type],
        startPos as Vector,
        behaviour,
        this.enemiesBullets,
        this.bulletsPool,
        i,
      );
    }

    this.currentEnemies.push(enemy);
  }

  private removeFinishedEnemies() {
    const removalIndices = [];

    for (let i = 0; i < this.currentEnemies.length; i++) {
      if (this.currentEnemies[i].finished) {
        if (this.currentEnemies[i].health === 0) this.increaseScore();

        removalIndices.push(i);
      }
    }

    while (removalIndices.length) {
      this.enemiesPool.push(...this.currentEnemies.splice(removalIndices.pop()!, 1));
    }
  }

  private increaseScore() {
    this.player.score += 50;
    this.player.onChange('score', this.player.score);
  }
}
