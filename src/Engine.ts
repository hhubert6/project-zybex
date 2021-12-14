export default class Engine {
  private animationRequestFrameId: number | null = null;
  private readonly frameTime: number;
  private accumulatedTime = 0;
  private lastTime = 0;
  private updated = false;

  constructor(
    fps: number,
    private readonly update: () => void,
    private readonly render: () => void,
  ) {
    this.frameTime = 1000 / fps;
  }

  private run(curTime: number) {
    this.accumulatedTime += curTime - this.lastTime;
    this.lastTime = curTime;

    while (this.accumulatedTime > this.frameTime) {
      this.accumulatedTime -= this.frameTime;

      this.update();
      this.updated = true;
    }

    if (this.updated) {
      this.updated = false;
      this.render();
    }

    this.animationRequestFrameId = requestAnimationFrame((t) => this.run(t));
  }

  start() {
    this.lastTime = performance.now();
    this.animationRequestFrameId = requestAnimationFrame((t) => this.run(t));
  }

  stop() {
    if (this.animationRequestFrameId) {
      cancelAnimationFrame(this.animationRequestFrameId);
    }
  }
}
