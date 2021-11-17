import Display from './Display';
import Game from './Game';
import Engine from './Engine';
import Controller from './Controller';

const update = (deltaTime: number) => {
  game.update(deltaTime);
};

const render = () => {
  display.renderColor('red');
  display.render();
};

const controller = new Controller();
const display = new Display(document.querySelector('canvas')!);
const game = new Game();
const engine = new Engine(60, update, render);

window.addEventListener('keydown', controller.handleKeyDownUp);
window.addEventListener('keyup', controller.handleKeyDownUp);

engine.start();
