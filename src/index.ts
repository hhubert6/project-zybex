import AssetsManager from './AssetsManager';
import Display from './Display';
import Game from './Game';
import Engine from './Engine';
import Controller from './Controller';

import map from './assets/arcturus-map.json';
import enemies from './assets/arcturus-enemies.json';
import { WORLD_HEIGHT, WORLD_WIDTH } from './world/World';
import { weapon } from './world/shooters/shooter';
const bgImg = require('./assets/background.png');

const update = () => {
  game.update();

  if (game.world.player.animation) return;

  if (controller.left.active) game.world.player.moveLeft();
  if (controller.right.active) game.world.player.moveRight();
  if (controller.up.active) game.world.player.moveUp();
  if (controller.down.active) game.world.player.moveDown();
  if (controller.ctrl.active) {
    game.world.player.changeWeapon();
    controller.ctrl.active = false;
  }

  if (controller.space.active) {
    game.togglePause();
    controller.space.active = false;
  }
};

const render = () => {
  display.clear();
  display.drawMap(assetsManager.bgImg!, game.world.currentViewMap);
  display.drawBullets([...game.world.enemiesBullets, ...game.world.player.bullets]);
  display.drawEnemies(game.world.currentEnemies);
  display.drawRectangle(game.world.player);
  display.render();
};

const assetsManager = new AssetsManager();
const controller = new Controller();
const game = new Game(map, enemies);
const display = new Display(
  document.querySelector('.score-info')!,
  document.querySelector('canvas')!,
  WORLD_WIDTH,
  WORLD_HEIGHT,
  map.types,
);
const engine = new Engine(60, update, render);

window.addEventListener('keydown', controller.handleKeyDownUp);
window.addEventListener('keyup', controller.handleKeyDownUp);

game.subscribe((type: string, data: any) => {
  if (type === 'score') display.updateScore(data);
  if (type === 'health') display.updateHealth(data);
  if (type === 'weapon') display.updateWeapon(data);
});

(async () => {
  assetsManager.bgImg = await assetsManager.loadImage(bgImg);

  engine.start();
})();
