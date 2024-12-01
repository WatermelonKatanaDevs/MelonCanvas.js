export interface LayeredTilemapConfig {
  tileset: HTMLImageElement;
  tileWidth: number;
  tileHeight: number;
  layers: number[][][];
}

export class LayeredTilemap {
  private layers: number[][][];
  private tileWidth: number;
  private tileHeight: number;
  private tileset: HTMLImageElement;

  constructor({ tileset, tileWidth, tileHeight, layers }: LayeredTilemapConfig) {
    this.tileset = tileset;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.layers = layers;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.layers.forEach((layer) => {
      layer.forEach((row, y) => {
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
    });
  }
}
