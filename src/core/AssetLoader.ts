import { Assets, Texture, Rectangle } from 'pixi.js';
import type { SymbolType } from '@config/gameConfig';

class AssetLoaderClass {
  private symbolTextures: Map<SymbolType, Texture> = new Map();
  private coinFrames: Texture[] = [];
  private spinSound: HTMLAudioElement | null = null;
  private reelStopSound: HTMLAudioElement | null = null;
  private winSound: HTMLAudioElement | null = null;
  private loaded = false;

  async load(): Promise<void> {
    if (this.loaded) return;

    const baseTexture = await Assets.load<Texture>('/assets/slot.jpg');
    
    this.spinSound = new Audio('/assets/spin-sound.mp3');
    this.spinSound.loop = true; 
    this.spinSound.volume = 0.5; 
    
    // Загружаем звук остановки барабана
    this.reelStopSound = new Audio('/assets/reel-stop.wav');
    this.reelStopSound.volume = 0.6; 
    
    // Загружаем звук выигрыша
    this.winSound = new Audio('/assets/win-sound.wav');
    this.winSound.volume = 0.7;
    
    const coinTexture = await Assets.load<Texture>('/assets/coin-animation.png');
    const frameCount = 8;
    const frameWidth = coinTexture.width / frameCount;
    const frameHeight = coinTexture.height;
    
    for (let i = 0; i < frameCount; i++) {
      const frame = new Texture({
        source: coinTexture.source,
        frame: new Rectangle(i * frameWidth, 0, frameWidth, frameHeight)
      });
      this.coinFrames.push(frame);
    }
    
    const scale = baseTexture.width / 591;
    
    const cellWidthWithSpacing = Math.floor((185 + 12) * scale);  
    const cellHeightWithSpacing = Math.floor((168 + 14) * scale); 
    
    const cellWidth = Math.floor(185 * scale);   
    const cellHeight = Math.floor(168 * scale);  
    const symbols: SymbolType[] = [
      'bigwin', 'banana', 'seven',
      'plum', 'watermelon', 'lemon',
      'cherry', 'orange', 'bar'
    ];

    symbols.forEach((symbol, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      
      const x = col * cellWidthWithSpacing;
      const y = row * cellHeightWithSpacing;
      
      const texture = new Texture({
        source: baseTexture.source,
        frame: new Rectangle(x, y, cellWidth, cellHeight)
      });
      
      this.symbolTextures.set(symbol, texture);
    });

    this.loaded = true;
  }

  getTexture(symbol: SymbolType): Texture {
    const texture = this.symbolTextures.get(symbol);
    if (!texture) {
      throw new Error(`Texture for symbol "${symbol}" not found`);
    }
    return texture;
  }

  playSpinSound(): void {
    if (this.spinSound) {
      this.spinSound.currentTime = 0; 
      this.spinSound.play();
    }
  }

  stopSpinSound(): void {
    if (this.spinSound) {
      this.spinSound.pause();
      this.spinSound.currentTime = 0;
    }
  }

  playReelStopSound(): void {
    if (this.reelStopSound) {
      const sound = this.reelStopSound.cloneNode() as HTMLAudioElement;
      sound.volume = 0.6;
      sound.play();
    }
  }

  playWinSound(): void {
    if (this.winSound) {
      this.winSound.currentTime = 0; 
      this.winSound.play();
    }
  }

  getCoinFrames(): Texture[] {
    return this.coinFrames;
  }
}

export const AssetLoader = new AssetLoaderClass();

