class CanvasGame {
  constructor({ width = 800, height = 600, backgroundColor = "black" } = {}) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.width = width;
    this.height = height;
    this.backgroundColor = backgroundColor;
    this.canvas.width = width;
    this.canvas.height = height;
    document.body.appendChild(this.canvas);

    this.objects = [];
    this.lastTime = 0;

    this.camera = {
      x: 0,
      y: 0,
      zoom: 1,
      target: null,
      bounds: null,
    };

    this.events = {};
  }

  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  off(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter((cb) => cb !== callback);
    }
  }

  emit(eventName, payload) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => callback(payload));
    }
  }

  add(obj, layer = 0) {
    obj.layer = layer;

    if (!obj.events) {
      obj.events = {};
      obj.on = (eventName, callback) => {
        if (!obj.events[eventName]) obj.events[eventName] = [];
        obj.events[eventName].push(callback);
      };
      obj.off = (eventName, callback) => {
        if (obj.events[eventName]) {
          obj.events[eventName] = obj.events[eventName].filter((cb) => cb !== callback);
        }
      };
      obj.emit = (eventName, payload) => {
        if (obj.events[eventName]) {
          obj.events[eventName].forEach((callback) => callback(payload));
        }
      };
    }

    this.objects.push(obj);
    this.objects.sort((a, b) => a.layer - b.layer);
  }

  remove(obj) {
    this.objects = this.objects.filter((o) => o !== obj);
  }

  setCamera({ target = null, bounds = null, zoom = 1 } = {}) {
    this.camera.target = target;
    this.camera.bounds = bounds;
    this.camera.zoom = zoom;
  }

  #applyCamera(ctx) {
    const { x, y, zoom } = this.camera;
    ctx.setTransform(zoom, 0, 0, zoom, -x * zoom, -y * zoom);
  }

  start() {
    const gameLoop = (timestamp) => {
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

      this.#applyCamera(this.ctx);

      this.objects.forEach((obj) => {
        if (obj.update) obj.update(delta);
        if (obj.draw) obj.draw(this.ctx);
      });

      requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);
  }

  addPhysics(obj, { gravity = 0, bounce = 0 } = {}) {
    obj.velocity = obj.velocity || { x: 0, y: 0 };
    obj.gravity = gravity;
    obj.bounce = bounce;

    const originalUpdate = obj.update || (() => {});
    obj.update = (delta) => {
      obj.velocity.y += obj.gravity * delta;

      obj.x += obj.velocity.x * delta;
      obj.y += obj.velocity.y * delta;

      originalUpdate(delta);
    };
  }

  enableCollision(obj, obstacles, { bounce = false } = {}) {
    const originalUpdate = obj.update || (() => {});
    obj.update = (delta) => {
      obstacles.forEach((obstacle) => {
        if (this.checkCollision(obj, obstacle)) {
          if (bounce) {
            obj.velocity.y *= -obj.bounce;
          } else {
            obj.velocity.y = 0;
            obj.y = obstacle.y - obj.height;
          }
        }
      });

      originalUpdate(delta);
    };
  }

  checkCollision(objA, objB) {
    return (
      objA.x < objB.x + objB.width &&
      objA.x + objA.width > objB.x &&
      objA.y < objB.y + objB.height &&
      objA.y + objA.height > objB.y
    );
  }
}

class AssetLoader {
  constructor() {
    this.assets = {};
  }

  loadImage(name, src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.assets[name] = img;
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  loadAudio(name, src) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(src);
      audio.onloadeddata = () => {
        this.assets[name] = audio;
        resolve(audio);
      };
      audio.onerror = reject;
    });
  }

  get(name) {
    return this.assets[name];
  }
}

class Tilemap {
  constructor({ tileset, tileWidth, tileHeight, data }) {
    this.tileset = tileset;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.data = data;
  }

  draw(ctx) {
    this.data.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile) {
          ctx.drawImage(
            this.tileset,
            tile * this.tileWidth,
            0,
            this.tileWidth,
            this.tileHeight,
            x * this.tileWidth,
            y * this.tileHeight,
            this.tileWidth,
            this.tileHeight
          );
        }
      });
    });
  }
}
