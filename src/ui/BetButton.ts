import { Container, Graphics, Text, FederatedPointerEvent } from 'pixi.js';

export class BetButton extends Container {
  private background: Graphics;
  private text: Text;
  private callback: () => void = () => {};
  private btnWidth: number;
  private btnHeight: number;

  constructor(label: string, width: number, height: number) {
    super();

    this.btnWidth = width;
    this.btnHeight = height;

    this.background = new Graphics();
    this.background.roundRect(0, 0, width, height, 10);
    this.background.fill({ color: 0x2a2a4e });
    this.background.stroke({ color: 0xffd23f, width: 2 });
    this.addChild(this.background);

    this.text = new Text({
      text: label,
      style: {
        fontSize: 32,
        fontWeight: 'bold',
        fill: 0xffd23f
      }
    });
    this.text.anchor.set(0.5);
    this.text.x = width / 2;
    this.text.y = height / 2;
    this.addChild(this.text);

    this.eventMode = 'static';
    this.cursor = 'pointer';

    this.on('pointerdown', this.onPointerDown.bind(this));
    this.on('pointerup', this.onPointerUp.bind(this));
    this.on('pointerover', this.onPointerOver.bind(this));
    this.on('pointerout', this.onPointerOut.bind(this));
  }

  private onPointerDown(): void {
    this.background.clear();
    this.background.roundRect(0, 0, this.btnWidth, this.btnHeight, 10);
    this.background.fill({ color: 0x1a1a3e });
    this.background.stroke({ color: 0xffd23f, width: 2 });
  }

  private onPointerUp(event: FederatedPointerEvent): void {
    this.background.clear();
    this.background.roundRect(0, 0, this.btnWidth, this.btnHeight, 10);
    this.background.fill({ color: 0x3a3a6e });
    this.background.stroke({ color: 0xffd23f, width: 2 });
    
    if (event.target === this) {
      this.callback();
    }
  }

  private onPointerOver(): void {
    this.background.clear();
    this.background.roundRect(0, 0, this.btnWidth, this.btnHeight, 10);
    this.background.fill({ color: 0x3a3a6e });
    this.background.stroke({ color: 0xffd23f, width: 2 });
  }

  private onPointerOut(): void {
    this.background.clear();
    this.background.roundRect(0, 0, this.btnWidth, this.btnHeight, 10);
    this.background.fill({ color: 0x2a2a4e });
    this.background.stroke({ color: 0xffd23f, width: 2 });
  }

  onClick(callback: () => void): void {
    this.callback = callback;
  }

  setEnabled(enabled: boolean): void {
    this.eventMode = enabled ? 'static' : 'none';
    this.alpha = enabled ? 1 : 0.5;
  }
}

