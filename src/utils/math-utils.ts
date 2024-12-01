export class MathUtils {
  static readonly DEG_TO_RAD = Math.PI / 180;
  static readonly RAD_TO_DEG = 180 / Math.PI;

  static addVectors(v1: { x: number; y: number }, v2: { x: number; y: number }) {
    return { x: v1.x + v2.x, y: v1.y + v2.y };
  }

  static subtractVectors(v1: { x: number; y: number }, v2: { x: number; y: number }) {
    return { x: v1.x - v2.x, y: v1.y - v2.y };
  }

  static multiplyVector(v: { x: number; y: number }, scalar: number) {
    return { x: v.x * scalar, y: v.y * scalar };
  }

  static magnitude(v: { x: number; y: number }) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  static normalize(v: { x: number; y: number }) {
    const mag = this.magnitude(v);
    return mag === 0 ? { x: 0, y: 0 } : this.multiplyVector(v, 1 / mag);
  }

  static degreesToRadians(degrees: number) {
    return degrees * this.DEG_TO_RAD;
  }

  static radiansToDegrees(radians: number) {
    return radians * this.RAD_TO_DEG;
  }

  static clampAngle(angle: number) {
    return (angle + 360) % 360;
  }

  static angleBetweenPoints(p1: { x: number; y: number }, p2: { x: number; y: number }) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
  }

  static lerp(start: number, end: number, t: number) {
    return start + (end - start) * t;
  }

  static smoothstep(start: number, end: number, t: number) {
    t = Math.max(0, Math.min(1, (t - start) / (end - start)));
    return t * t * (3 - 2 * t);
  }

  static randomRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  static randomInt(min: number, max: number) {
    return Math.floor(this.randomRange(min, max));
  }

  static randomDirection() {
    const angle = this.randomRange(0, 2 * Math.PI);
    return { x: Math.cos(angle), y: Math.sin(angle) };
  }

  static distance(p1: { x: number; y: number }, p2: { x: number; y: number }) {
    return this.magnitude(this.subtractVectors(p1, p2));
  }

  static closestPointOnLine(
    lineStart: { x: number; y: number },
    lineEnd: { x: number; y: number },
    point: { x: number; y: number }
  ) {
    const line = this.subtractVectors(lineEnd, lineStart);
    const lineMag = this.magnitude(line);
    const lineNorm = this.normalize(line);

    const pointToStart = this.subtractVectors(point, lineStart);
    const projection = Math.max(0, Math.min(lineMag, this.dotProduct(pointToStart, lineNorm)));

    return this.addVectors(lineStart, this.multiplyVector(lineNorm, projection));
  }

  static dotProduct(v1: { x: number; y: number }, v2: { x: number; y: number }) {
    return v1.x * v2.x + v1.y * v2.y;
  }

  static rectOverlap(
    r1: { x: number; y: number; width: number; height: number },
    r2: { x: number; y: number; width: number; height: number }
  ) {
    return r1.x < r2.x + r2.width && r1.x + r1.width > r2.x && r1.y < r2.y + r2.height && r1.y + r1.height > r2.y;
  }
}
