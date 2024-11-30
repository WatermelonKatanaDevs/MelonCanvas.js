export class PhysicsEngine {
    private objects: any[] = [];
  
    addObject(obj: any): void {
      this.objects.push(obj);
    }
  
    update(delta: number): void {
      this.objects.forEach((obj) => {
        if (obj.velocity) {
          obj.x += obj.velocity.x * delta;
          obj.y += obj.velocity.y * delta;
  
          // Apply gravity
          if (obj.gravity) {
            obj.velocity.y += obj.gravity * delta;
          }
  
          // Handle collisions
          this.objects.forEach((other) => {
            if (obj !== other && this.checkCollision(obj, other)) {
              obj.velocity.x = 0;
              obj.velocity.y = 0;
            }
          });
        }
      });
    }
  
    private checkCollision(objA: any, objB: any): boolean {
      return (
        objA.x < objB.x + objB.width &&
        objA.x + objA.width > objB.x &&
        objA.y < objB.y + objB.height &&
        objA.y + objA.height > objB.y
      );
    }
  }
  