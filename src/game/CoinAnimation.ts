import { Container, AnimatedSprite, Texture } from 'pixi.js';

export class CoinAnimation extends Container {
  private animatedSprite: AnimatedSprite;

  constructor(frames: Texture[]) {
    super();
    
    this.animatedSprite = new AnimatedSprite(frames);
    this.animatedSprite.anchor.set(0.5);
    this.animatedSprite.animationSpeed = 0.3;
    this.animatedSprite.loop = true;
    
    const scale = 1.5;
    this.animatedSprite.scale.set(scale);
    
    this.addChild(this.animatedSprite);
    this.visible = false;
  }

  play(): void {
    this.visible = true;
    this.animatedSprite.gotoAndPlay(0);
  }

  stop(): void {
    this.animatedSprite.stop();
    this.visible = false;
  }
}

