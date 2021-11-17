export default class Display {
  private ctx: CanvasRenderingContext2D;
  private buffer: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.buffer = document.createElement('canvas').getContext('2d')!;

    this.buffer.canvas.width = canvas.width;
    this.buffer.canvas.height = canvas.height;

    this.ctx.imageSmoothingEnabled = false;
  }

  renderColor(color: string) {
    this.buffer.fillStyle = color;
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
  }

  render() {
    this.ctx.drawImage(this.buffer.canvas, 0, 0);
  }
}
