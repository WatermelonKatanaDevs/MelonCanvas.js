export class SoundManager {
    private sounds: { [key: string]: HTMLAudioElement } = {};
  
    loadSound(name: string, src: string): void {
      const audio = new Audio(src);
      this.sounds[name] = audio;
    }
  
    playSound(name: string): void {
      const sound = this.sounds[name];
      if (sound) {
        sound.currentTime = 0;
        sound.play();
      } else {
        console.warn(`Sound "${name}" not found`);
      }
    }
  
    stopSound(name: string): void {
      const sound = this.sounds[name];
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
      }
    }
  
    loopSound(name: string): void {
      const sound = this.sounds[name];
      if (sound) {
        sound.loop = true;
        sound.play();
      }
    }
  }
  