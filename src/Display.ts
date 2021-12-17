import { Vector } from './vector';
import { Enemy } from './world/enemies';
import { mapElement, mapElementTypes } from './world/map';
import { bullet, weapon } from './world/shooters/shooter';

interface Drawable {
  pos: Vector;
  dimensions: Vector;
  color: string;
}

export default class Display {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly buffer: CanvasRenderingContext2D;

  private readonly scoreEl: HTMLSpanElement;
  private readonly healthEl: HTMLSpanElement;
  private readonly weaponEl: HTMLSpanElement;

  constructor(
    info: HTMLDivElement,
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    private readonly mapTypes: mapElementTypes,
  ) {
    this.ctx = canvas.getContext('2d')!;
    this.buffer = document.createElement('canvas').getContext('2d')!;

    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;

    this.buffer.canvas.width = width;
    this.buffer.canvas.height = height;

    this.ctx.imageSmoothingEnabled = false;

    this.scoreEl = info.querySelector('.score')!;
    this.healthEl = info.querySelector('.health')!;
    this.weaponEl = info.querySelector('.current-weapon')!;
  }

  clear() {
    this.buffer.clearRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  drawRectangle({ pos, color, dimensions }: Drawable) {
    this.buffer.fillStyle = color;
    this.buffer.fillRect(
      pos[0] | 0,
      pos[1] | 0,
      dimensions[0] | 0,
      dimensions[1] | 0,
    );
  }

  drawMap(img: HTMLImageElement, map: mapElement[]) {
    for (let i = 0; i < map.length; i++) {
      const [sx, sy] = this.mapTypes[map[i].type].spritePos;
      const [w, h] = this.mapTypes[map[i].type].dimensions;
      const [dx, dy] = map[i].pos;

      this.buffer.drawImage(img, sx, sy, w, h, dx | 0, dy | 0, w, h);
    }
  }

  drawEnemies(enemies: Enemy[]) {
    for (let i = 0; i < enemies.length; i++) {
      const [sx, sy] = enemies[i].spritePos;
      const [w, h] = enemies[i].dimensions;
      const [dx, dy] = enemies[i].pos;

      this.buffer.fillStyle = 'orange';

      this.buffer.fillRect(dx | 0, dy | 0, w, h);
    }
  }

  drawBullets(bullets: bullet[]) {
    for (let i = 0; i < bullets.length; i++) {
      const [w, h] = bullets[i].dimensions;
      const [dx, dy] = bullets[i].pos;

      this.buffer.fillStyle = 'purple';

      this.buffer.fillRect(dx | 0, dy | 0, w, h);
    }
  }

  render() {
    this.ctx.drawImage(this.buffer.canvas, 0, 0);
  }

  updateScore(score: number) {
    let scoreStr = score.toString();
    const zerosCount = 6 - scoreStr.length;

    for (let i = 0; i < zerosCount; i++) {
      scoreStr = '0' + scoreStr;
    }

    this.scoreEl.textContent = scoreStr;
  }

  updateHealth(health: number) {
    this.healthEl.textContent = health.toString();
  }

  updateWeapon(currentWeapon: weapon) {
    this.weaponEl.textContent = currentWeapon;
  }
}
