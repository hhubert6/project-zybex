import { Vector } from './types';

export default class Display {
  private ctx: CanvasRenderingContext2D;
  private buffer: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
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

  drawRectangle(rect: Drawable) {
    this.buffer.fillStyle = rect.color;
    this.buffer.fillRect(...rect.pos, ...rect.dimensions);
  }

  render() {
    this.ctx.drawImage(this.buffer.canvas, 0, 0);
  }
}

interface Drawable {
  pos: Vector;
  dimensions: Vector;
  color: string;
}