import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import type { SymbolType } from '@config/gameConfig';
import { REEL_CONFIG } from '@config/gameConfig';

export class Symbol extends Container {
  private sprite: Sprite;
  private background: Graphics;
  public symbolType: SymbolType;

  constructor(texture: Texture, symbolType: SymbolType) {
    super();
    
    this.symbolType = symbolType;
    
    this.background = new Graphics();
    this.background.rect(0, 0, REEL_CONFIG.symbolWidth, REEL_CONFIG.symbolHeight);
    this.background.fill({ color: 0xffffff });
    this.addChild(this.background);
    
    this.sprite = new Sprite(texture);
    this.sprite.width = REEL_CONFIG.symbolWidth * 0.80;
    this.sprite.height = REEL_CONFIG.symbolHeight * 0.80;
    
    this.sprite.anchor.set(0.5);
    this.sprite.x = REEL_CONFIG.symbolWidth / 2;
    this.sprite.y = REEL_CONFIG.symbolHeight / 2;
    
    this.addChild(this.sprite);
  }

  setTexture(texture: Texture, symbolType: SymbolType): void {
    this.symbolType = symbolType;
    this.sprite.texture = texture;
    
    this.sprite.width = REEL_CONFIG.symbolWidth * 0.80;
    this.sprite.height = REEL_CONFIG.symbolHeight * 0.80;
    
    this.sprite.anchor.set(0.5);
    this.sprite.x = REEL_CONFIG.symbolWidth / 2;
    this.sprite.y = REEL_CONFIG.symbolHeight / 2;
  }
}

