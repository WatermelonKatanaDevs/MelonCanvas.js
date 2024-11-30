export interface TilemapConfig {
    tileset: HTMLImageElement;
    tileWidth: number;
    tileHeight: number;
    data: number[][];
  }
  
  export class Tilemap {
    private tileset: HTMLImageElement;
    private tileWidth: number;
    private tileHeight: number;
    private data: number[][];
  
    constructor({ tileset, tileWidth, tileHeight, data }: TilemapConfig) {
      this.tileset = tileset;
      this.tileWidth = tileWidth;
      this.tileHeight = tileHeight;
      this.data = data;
    }
  
    draw(ctx: CanvasRenderingContext2D): void {
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
  