import { Vector } from '../vector';
import Player from './Player';
import { map, mapElement, mapElementTypes } from './map';
import SpatialHashArray from '../SpatialHashArray';
import { enemies, enemy, Enemy, enemyTypes } from './enemies';

export default class World {
  friction = 0.8;
  dimensions: Vector = [320, 192];

  player = new Player();

  enemiesHashArray: SpatialHashArray;
  enemyTypes: enemyTypes;
  currentEnemies: Enemy[] = [];
  enemiesPool: Enemy[] = [];

  mapHashArray: SpatialHashArray;
  mapElementTypes: mapElementTypes;
  currentViewMap: mapElement[] = [];
  currentViewIndex = 0; // current map x position

  constructor(map: map, enemies: enemies) {
    const [playerWidth, playerHeight] = this.player.dimensions;
    const [worldWidth, worldHeight] = this.dimensions;

    this.player.pos[0] = worldWidth / 2 - playerWidth / 2;
    this.player.pos[1] = worldHeight / 2 - playerHeight / 2;

    this.mapHashArray = new SpatialHashArray(40, Math.ceil(map.width / 40));
    this.mapElementTypes = map.types;
    this.setupMap(map);

    this.enemiesHashArray = new SpatialHashArray(40, Math.ceil(map.width / 40));
    this.enemyTypes = enemies.types;
    this.setupEnemies(enemies);
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

  setupEnemies({ elements }: enemies) {
    for (let i = 0; i < elements.length; i++) {
      this.enemiesHashArray.addClient(elements[i].activationPoint, 1, elements[i]);
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
      .map<mapElement>(({ data }) => ({ ...data, pos: resolvePosition(data) }));

    this.currentViewIndex += 1;

    // temporary
    if (this.currentViewIndex >= 2 * 320) this.currentViewIndex = -0;
  }

  updateEnemies() {
    const currentPoint = this.currentViewIndex + this.dimensions[0];
    const enemiesToActivate = this.enemiesHashArray
      .getInRange(currentPoint, 1)
      .filter(({ data: { activationPoint } }) => currentPoint >= activationPoint);

    for (let i = 0; i < enemiesToActivate.length; i++) {
      this.enemiesHashArray.removeClient(enemiesToActivate[i]);
      this.activateEnemy(enemiesToActivate[i].data);
    }

    this.removeFinishedEnemies();

    for (let i = 0; i < this.currentEnemies.length; i++) {
      this.currentEnemies[i].update();
    }

    console.log(this.currentEnemies.length, this.enemiesPool.length);
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

  collideEnemies(objects: Enemy[]) {
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].pos[0] + objects[i].type.dimensions[0] <= 0) {
        objects[i].finished = true;
      }
    }
  }

  private activateEnemy({ type, startPos, behaviour }: enemy) {
    let enemy = this.enemiesPool.pop();

    if (enemy) {
      enemy.typeName = type;
      enemy.type = this.enemyTypes[type];
      enemy.pos = startPos as Vector;
      enemy.behaviour = behaviour;
      enemy.finished = false;
    } else {
      enemy = new Enemy(type, this.enemyTypes[type], startPos as Vector, behaviour);
    }

    this.currentEnemies.push(enemy);
  }

  private removeFinishedEnemies() {
    const removalIndices = [];

    for (let i = 0; i < this.currentEnemies.length; i++) {
      if (this.currentEnemies[i].finished) {
        removalIndices.push(i);
      }
    }

    while (removalIndices.length) {
      this.enemiesPool.push(...this.currentEnemies.splice(removalIndices.pop()!, 1));
    }
  }
}
