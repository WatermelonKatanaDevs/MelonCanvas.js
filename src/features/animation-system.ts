export class Animation {
  private frames: HTMLImageElement[];
  private frameDuration: number;
  private loop: boolean;
  private currentFrame: number;
  private elapsed: number;

  constructor(frames: HTMLImageElement[], frameDuration: number, loop: boolean = true) {
    this.frames = frames;
    this.frameDuration = frameDuration;
    this.loop = loop;
    this.currentFrame = 0;
    this.elapsed = 0;
  }

  update(delta: number) {
    this.elapsed += delta;
    if (this.elapsed >= this.frameDuration) {
      this.elapsed = 0;
      this.currentFrame = this.loop
        ? (this.currentFrame + 1) % this.frames.length
        : Math.min(this.currentFrame + 1, this.frames.length - 1);
    }
  }

  getFrame(): HTMLImageElement {
    return this.frames[this.currentFrame];
  }
}
