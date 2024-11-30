export class Particle {
    x: number;
    y: number;
    velocity: { x: number; y: number };
    lifetime: number;
    color: string;
  
    constructor(x: number, y: number, velocity: { x: number; y: number }, lifetime: number, color: string) {
      this.x = x;
      this.y = y;
      this.velocity = velocity;
      this.lifetime = lifetime;
      this.color = color;
    }
  
    update(delta: number): boolean {
      this.x += this.velocity.x * delta;
      this.y += this.velocity.y * delta;
      this.lifetime -= delta;
      return this.lifetime > 0;
    }
  
    draw(ctx: CanvasRenderingContext2D): void {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  export class ParticleSystem {
    private particles: Particle[] = [];
  
    addParticle(particle: Particle): void {
      this.particles.push(particle);
    }
  
    update(delta: number): void {
      this.particles = this.particles.filter((particle) => particle.update(delta));
    }
  
    draw(ctx: CanvasRenderingContext2D): void {
      this.particles.forEach((particle) => particle.draw(ctx));
    }
  }
  