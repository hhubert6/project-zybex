import { Vector } from './vector';
import { Enemy } from './world/enemies';
import { mapElement, mapElementTypes } from './world/map';

interface Drawable {
  pos: Vector;
  dimensions: Vector;
  color: string;
}

export default class Display {
  private ctx: CanvasRenderingContext2D;
  private buffer: CanvasRenderingContext2D;

  constructor(
    canvas: HTMLCanvasElement,
    [width, height]: Vector,
    private types: mapElementTypes,
  ) {
    this.ctx = canvas.getContext('2d')!;
    this.buffer = document.createElement('canvas').getContext('2d')!;

    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;

    this.buffer.canvas.width = width;
    this.buffer.canvas.height = height;

    this.ctx.imageSmoothingEnabled = false;
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
      const [sx, sy] = this.types[map[i].type].spritePos;
      const [w, h] = this.types[map[i].type].dimensions;
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

  render() {
    this.ctx.drawImage(this.buffer.canvas, 0, 0);
  }
}
