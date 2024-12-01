export class Particle {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  lifespan: number;

  constructor(position: { x: number; y: number }, velocity: { x: number; y: number }, lifespan: number) {
    this.position = position;
    this.velocity = velocity;
    this.lifespan = lifespan;
  }

  update(delta: number) {
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
    this.lifespan -= delta;
  }

  isAlive(): boolean {
    return this.lifespan > 0;
  }
}

export class ParticleEmitter {
  private particles: Particle[] = [];
  private emitRate: number;
  private timeSinceLastEmit: number = 0;

  constructor(
    private position: { x: number; y: number },
    private createParticle: () => Particle,
    emitRate: number
  ) {
    this.emitRate = emitRate;
  }

  update(delta: number) {
    this.timeSinceLastEmit += delta;
    while (this.timeSinceLastEmit > this.emitRate) {
      this.particles.push(this.createParticle());
      this.timeSinceLastEmit -= this.emitRate;
    }

    this.particles = this.particles.filter((particle) => {
      particle.update(delta);
      return particle.isAlive();
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.particles.forEach((particle) => {
      ctx.fillStyle = "white";
      ctx.fillRect(particle.position.x, particle.position.y, 2, 2);
    });
  }
}
