import Display from './Display';
import Game from './Game';
import Engine from './Engine';
import Controller from './Controller';

const update = (deltaTime: number) => {
  if (controller.left.active) game.world.player.moveLeft();
  if (controller.right.active) game.world.player.moveRight();
  if (controller.up.active) game.world.player.moveUp();
  if (controller.down.active) game.world.player.moveDown();

  
  if (controller.space.active) {
    game.togglePause();
    controller.space.active = false;
  }

  game.update(deltaTime);
};

const render = () => {
  display.clear();
  display.drawMap(game.world.currentMapView);
  display.drawRectangle(game.world.player);
  display.render();
};

const controller = new Controller();
const game = new Game();
const display = new Display(
  document.querySelector('canvas')!,
  game.world.dimensions,
);
const engine = new Engine(60, update, render);

window.addEventListener('keydown', controller.handleKeyDownUp);
window.addEventListener('keyup', controller.handleKeyDownUp);

engine.start();
