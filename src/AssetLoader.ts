export class AssetLoader {
    private assets: { [key: string]: HTMLImageElement | HTMLAudioElement } = {};
  
    loadImage(name: string, src: string): Promise<HTMLImageElement> {
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
  
    loadAudio(name: string, src: string): Promise<HTMLAudioElement> {
      return new Promise((resolve, reject) => {
        const audio = new Audio(src);
        audio.onloadeddata = () => {
          this.assets[name] = audio;
          resolve(audio);
        };
        audio.onerror = reject;
      });
    }
  
    get(name: string): HTMLImageElement | HTMLAudioElement | undefined {
      return this.assets[name];
    }
  }
  