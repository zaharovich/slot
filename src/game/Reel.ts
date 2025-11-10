import { Container } from 'pixi.js';
import { Symbol } from './Symbol';
import { AssetLoader } from '@core/AssetLoader';
import { REEL_CONFIG, type SymbolType } from '@config/gameConfig';
import { getWeightedRandomSymbol } from '@config/casinoConfig';

export class Reel extends Container {
  private symbols: Symbol[] = [];
  private symbolHeight: number;
  
  private spinning = false;
  private currentSpeed = 0;
  private targetSpeed = 0;
  private spinTime = 0;
  private targetStopTime = 0;
  private finalSymbols: SymbolType[] = [];
  private bouncing = false;
  private bounceTime = 0;
  private bounceDuration = 120;

  constructor() {
    super();
    
    this.symbolHeight = REEL_CONFIG.symbolHeight + REEL_CONFIG.rowSpacing;
    
    for (let i = 0; i < REEL_CONFIG.rows + 2; i++) {
      const symbolType = getWeightedRandomSymbol();
      const texture = AssetLoader.getTexture(symbolType);
      const symbol = new Symbol(texture, symbolType);
      
      symbol.y = (i - 1) * this.symbolHeight;
      this.symbols.push(symbol);
      this.addChild(symbol);
    }
    
  }

  spin(duration: number, finalSymbols: SymbolType[]): void {
    if (this.spinning) return;
    
    this.spinning = true;
    this.spinTime = 0;
    this.targetStopTime = duration;
    this.currentSpeed = REEL_CONFIG.minSpeed;
    this.targetSpeed = REEL_CONFIG.maxSpeed;
    this.finalSymbols = [...finalSymbols];
  }

  update(delta: number): void {
    if (!this.spinning && !this.bouncing) return;
    
    if (this.bouncing) {
      const deltaMS = (delta / 60) * 1000;
      this.bounceTime += deltaMS;
      
      const progress = Math.min(1, this.bounceTime / this.bounceDuration);
      const bounce = Math.sin(progress * Math.PI) * 6 * (1 - progress);
      
      const sorted = [...this.symbols].sort((a, b) => a.y - b.y);
      sorted.forEach((symbol, index) => {
        const targetY = (index - 1) * this.symbolHeight;
        symbol.y = targetY + bounce;
      });
      
      if (progress >= 1) {
        this.bouncing = false;
        this.snapToGrid();
      }
      return;
    }
    
    if (!this.spinning) return;
    
    const deltaMS = (delta / 60) * 1000;
    this.spinTime += deltaMS;
    
    if (this.spinTime < REEL_CONFIG.acceleration) {
      const progress = Math.min(1, this.spinTime / REEL_CONFIG.acceleration);
      const eased = this.easeOutCubic(progress);
      this.currentSpeed = REEL_CONFIG.minSpeed + (this.targetSpeed - REEL_CONFIG.minSpeed) * eased;
    }
    else if (this.spinTime >= this.targetStopTime) {
      this.currentSpeed = 0;
      this.snapToGrid();
      this.stop();
      return;
    }
    else {
      this.currentSpeed = this.targetSpeed;
    }
    
    const distance = (this.currentSpeed * deltaMS) / 16.6667;
    
    this.symbols.forEach(symbol => {
      symbol.y += distance;
      
      if (symbol.y >= this.symbolHeight * REEL_CONFIG.rows) {
        symbol.y -= this.symbols.length * this.symbolHeight;
        
        const symbolType = getWeightedRandomSymbol();
        const texture = AssetLoader.getTexture(symbolType);
        symbol.setTexture(texture, symbolType);
      }
    });
  }

  private stop(): void {
    this.spinning = false;
    this.currentSpeed = 0;
    
    this.setFinalSymbols();
    this.snapToGrid();
    
    this.bouncing = true;
    this.bounceTime = 0;
    
    AssetLoader.playReelStopSound();
  }
  
  private setFinalSymbols(): void {
    const sorted = [...this.symbols].sort((a, b) => a.y - b.y);
    
    for (let i = 0; i < REEL_CONFIG.rows && i < this.finalSymbols.length; i++) {
      const symbolIndex = i + 1;
      const symbol = sorted[symbolIndex];
      const symbolType = this.finalSymbols[i];
      const texture = AssetLoader.getTexture(symbolType);
      symbol.setTexture(texture, symbolType);
    }
  }
  
  private snapToGrid(): void {
    const sorted = [...this.symbols].sort((a, b) => a.y - b.y);
    const visibleSprites = sorted.slice(1, REEL_CONFIG.rows + 1);
    
    visibleSprites.forEach((symbol, index) => {
      symbol.y = index * this.symbolHeight;
    });
    
    sorted[0].y = -this.symbolHeight; 
    sorted[sorted.length - 1].y = REEL_CONFIG.rows * this.symbolHeight; 
  }

  isSpinning(): boolean {
    return this.spinning || this.bouncing;
  }

  getVisibleSymbols(): SymbolType[] {
    const sorted = [...this.symbols].sort((a, b) => a.y - b.y);
    return sorted.slice(1, REEL_CONFIG.rows + 1).map(s => s.symbolType);
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }
}

