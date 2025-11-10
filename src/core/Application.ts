import { Application as PixiApp, Container } from 'pixi.js';
import { GAME_CONFIG } from '@config/gameConfig';

export class Application {
  public app: PixiApp;
  public stage: Container;

  constructor() {
    this.app = new PixiApp();
    this.stage = new Container();
  }

  async init(canvas: HTMLCanvasElement): Promise<void> {
    await this.app.init({
      canvas,
      width: GAME_CONFIG.width,
      height: GAME_CONFIG.height,
      background: GAME_CONFIG.backgroundColor,
      resolution: window.devicePixelRatio,
      antialias: true
    });

    this.app.stage.addChild(this.stage);
  }

  get ticker() {
    return this.app.ticker;
  }
}

