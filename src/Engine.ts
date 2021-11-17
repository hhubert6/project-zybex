export default class Engine {
  private animationRequestFrameId: number | null = null;
  private frameTime: number;
  private accumulatedTime = 0;
  private lastTime = 0;
  private updated = false;

  constructor(
    fps: number,
    private update: (d: number) => void,
    private render: () => void,
  ) {
    this.frameTime = 1000 / fps;
  }

  run(curTime: number) {
    this.accumulatedTime += curTime - this.lastTime;
    this.lastTime = curTime;

    while (this.accumulatedTime > this.frameTime) {
      this.accumulatedTime -= this.frameTime;

      this.update(this.frameTime);
      this.updated = true;
    }

    if (this.updated) {
      this.updated = false;
      this.render();
    }

    this.animationRequestFrameId = requestAnimationFrame((t) => this.run(t));
  }

  public start() {
    this.lastTime = performance.now();
    this.animationRequestFrameId = requestAnimationFrame((t) => this.run(t));
  }

  public stop() {
    if (this.animationRequestFrameId) {
      cancelAnimationFrame(this.animationRequestFrameId);
    }
  }
}
