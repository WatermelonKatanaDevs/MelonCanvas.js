export class SceneManager {
    private scenes: { [key: string]: () => void } = {};
    private activeScene: string | null = null;
  
    addScene(name: string, scene: () => void): void {
      this.scenes[name] = scene;
    }
  
    setActiveScene(name: string): void {
      if (this.scenes[name]) {
        this.activeScene = name;
      } else {
        throw new Error(`Scene "${name}" not found.`);
      }
    }
  
    update(delta: number): void {
      if (this.activeScene && this.scenes[this.activeScene]) {
        this.scenes[this.activeScene]();
      }
    }
  }