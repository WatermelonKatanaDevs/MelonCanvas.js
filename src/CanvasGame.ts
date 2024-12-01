import { AssetLoader } from "./core/AssetLoader";
import { InputManager } from "./core/InputManager";
import { PhysicsEngine } from "./core/PhysicsEngine";
import { SoundManager } from "./core/SoundManager";
import { LayeredTilemap, LayeredTilemapConfig } from "./rendering/LayeredTilemap";
import { ShapeRenderer } from "./rendering/ShapeRenderer";
import { Tilemap, TilemapConfig } from "./rendering/Tilemap";
import { MathUtils } from "./utils/math-utils";

import { Animation } from "./features/animation-system";
import { Particle, ParticleEmitter } from "./features/particle-system";
import { StateManager } from "./features/state-manager";

export interface CameraConfig {
  target?: GameObject | null;
  bounds?: { x: number; y: number; width: number; height: number } | null;
  zoom?: number;
}

export interface PhysicsConfig {
  gravity?: number;
  bounce?: number;
}

export interface CollisionConfig {
  bounce?: boolean;
}

export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  velocity?: { x: number; y: number };
  gravity?: number;
  bounce?: number;
  layer?: number;
  update?: (delta: number) => void;
  draw?: (ctx: CanvasRenderingContext2D) => void;
  events?: { [key: string]: ((payload: any) => void)[] };
  on?: (eventName: string, callback: (payload: any) => void) => void;
  off?: (eventName: string, callback: (payload: any) => void) => void;
  emit?: (eventName: string, payload: any) => void;
}

export class CanvasGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private backgroundColor: string;
  private objects: GameObject[];
  private lastTime: number;
  private camera: {
    x: number;
    y: number;
    zoom: number;
    target: GameObject | null;
    bounds: { x: number; y: number; width: number; height: number } | null;
  };
  private events: { [key: string]: ((payload: any) => void)[] };

  constructor({
    width = 800,
    height = 600,
    backgroundColor = "black",
  }: { width?: number; height?: number; backgroundColor?: string } = {}) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d")!;
    this.width = width;
    this.height = height;
    this.backgroundColor = backgroundColor;
    this.canvas.width = width;
    this.canvas.height = height;
    document.body.appendChild(this.canvas);

    this.objects = [];
    this.lastTime = 0;
    this.camera = { x: 0, y: 0, zoom: 1, target: null, bounds: null };
    this.events = {};
  }

  on(eventName: string, callback: (payload: any) => void): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  off(eventName: string, callback: (payload: any) => void): void {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter((cb) => cb !== callback);
    }
  }

  emit(eventName: string, payload: any): void {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => callback(payload));
    }
  }

  add(obj: GameObject, layer = 0): void {
    obj.layer = layer;

    if (!obj.events) {
      obj.events = {};
      obj.on = (eventName, callback) => {
        if (!obj.events![eventName]) obj.events![eventName] = [];
        obj.events![eventName].push(callback);
      };
      obj.off = (eventName, callback) => {
        if (obj.events![eventName]) {
          obj.events![eventName] = obj.events![eventName].filter((cb) => cb !== callback);
        }
      };
      obj.emit = (eventName, payload) => {
        if (obj.events![eventName]) {
          obj.events![eventName].forEach((callback) => callback(payload));
        }
      };
    }

    this.objects.push(obj);
    this.objects.sort((a, b) => (a.layer || 0) - (b.layer || 0));
  }

  remove(obj: GameObject): void {
    this.objects = this.objects.filter((o) => o !== obj);
  }

  setCamera({ target = null, bounds = null, zoom = 1 }: CameraConfig = {}): void {
    this.camera.target = target;
    this.camera.bounds = bounds;
    this.camera.zoom = zoom;
  }

  private applyCamera(ctx: CanvasRenderingContext2D): void {
    const { x, y, zoom } = this.camera;
    ctx.setTransform(zoom, 0, 0, zoom, -x * zoom, -y * zoom);
  }

  start(): void {
    const gameLoop = (timestamp: number) => {
      const delta = (timestamp - this.lastTime) / 1000;
      this.lastTime = timestamp;

      if (this.camera.target) {
        const target = this.camera.target;
        this.camera.x = target.x - this.width / 2 / this.camera.zoom;
        this.camera.y = target.y - this.height / 2 / this.camera.zoom;

        if (this.camera.bounds) {
          this.camera.x = Math.max(
            this.camera.bounds.x,
            Math.min(this.camera.x, this.camera.bounds.width - this.width / this.camera.zoom)
          );
          this.camera.y = Math.max(
            this.camera.bounds.y,
            Math.min(this.camera.y, this.camera.bounds.height - this.height / this.camera.zoom)
          );
        }
      }

      this.ctx.resetTransform();
      this.ctx.fillStyle = this.backgroundColor;
      this.ctx.fillRect(0, 0, this.width, this.height);

      this.applyCamera(this.ctx);

      this.objects.forEach((obj) => {
        obj.update?.(delta);
        obj.draw?.(this.ctx);
      });

      requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);
  }

  addPhysics(obj: GameObject, { gravity = 0, bounce = 0 }: PhysicsConfig = {}): void {
    obj.velocity = obj.velocity || { x: 0, y: 0 };
    obj.gravity = gravity;
    obj.bounce = bounce;

    const originalUpdate = obj.update || (() => {});
    obj.update = (delta) => {
      obj.velocity!.y += obj.gravity! * delta;

      obj.x += obj.velocity!.x * delta;
      obj.y += obj.velocity!.y * delta;

      originalUpdate(delta);
    };
  }

  enableCollision(obj: GameObject, obstacles: GameObject[], { bounce = false }: CollisionConfig = {}): void {
    const originalUpdate = obj.update || (() => {});
    obj.update = (delta) => {
      obstacles.forEach((obstacle) => {
        if (this.checkCollision(obj, obstacle)) {
          if (bounce) {
            obj.velocity!.y *= -obj.bounce!;
          } else {
            obj.velocity!.y = 0;
            obj.y = obstacle.y - obj.height;
          }
        }
      });

      originalUpdate(delta);
    };
  }

  checkCollision(objA: GameObject, objB: GameObject): boolean {
    return (
      objA.x < objB.x + objB.width &&
      objA.x + objA.width > objB.x &&
      objA.y < objB.y + objB.height &&
      objA.y + objA.height > objB.y
    );
  }
}
