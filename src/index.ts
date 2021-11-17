import Display from "./Display";
import Game from "./Game";
import Engine from "./Engine";
import Controller from './Controller';

const update = (d: number) => {
  game.update();
}

const render = () => {

}

const controller = new Controller();
const display = new Display(document.querySelector('canvas')!);
const game = new Game();
const engine = new Engine(60, update, render);

engine.start()
