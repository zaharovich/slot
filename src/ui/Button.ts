import { Container, Graphics, Text } from 'pixi.js';

export class Button extends Container {
  private bg: Graphics;
  private buttonLabel: Text;
  private callback?: () => void;
  private isEnabled = true;

  constructor(text: string, width: number, height: number) {
    super();
    
    this.eventMode = 'static';
    this.cursor = 'pointer';
    
    this.bg = new Graphics();
    this.bg.roundRect(0, 0, width, height, 12);
    this.bg.fill({ color: 0xff6b35 });
    this.bg.stroke({ color: 0xffd23f, width: 3 });
    this.addChild(this.bg);
    
    this.buttonLabel = new Text({
      text,
      style: {
        fontSize: 32,
        fontWeight: 'bold',
        fill: 0xffffff
      }
    });
    this.buttonLabel.anchor.set(0.5);
    this.buttonLabel.x = width / 2;
    this.buttonLabel.y = height / 2;
    this.addChild(this.buttonLabel);
    
    this.on('pointerdown', this.onPress);
    this.on('pointerup', this.onRelease);
    this.on('pointerupoutside', this.onRelease);
    this.on('pointerover', this.onOver);
    this.on('pointerout', this.onOut);
  }

  onClick(callback: () => void): void {
    this.callback = callback;
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    this.alpha = enabled ? 1 : 0.5;
    this.cursor = enabled ? 'pointer' : 'not-allowed';
  }

  private onPress = (): void => {
    if (!this.isEnabled) return;
    this.scale.set(0.95);
  };

  private onRelease = (): void => {
    if (!this.isEnabled) return;
    this.scale.set(1);
    if (this.callback) {
      this.callback();
    }
  };

  private onOver = (): void => {
    if (!this.isEnabled) return;
    this.bg.tint = 0xffaa66;
  };

  private onOut = (): void => {
    this.bg.tint = 0xffffff;
    this.scale.set(1);
  };
}

