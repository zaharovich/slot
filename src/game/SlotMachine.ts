import { Container, Graphics, Text } from 'pixi.js';
import { Reel } from './Reel';
import { Button } from '@ui/Button';
import { BetButton } from '@ui/BetButton';
import { CoinAnimation } from './CoinAnimation';
import { BalanceUI } from './BalanceUI';
import { GAME_CONFIG, REEL_CONFIG, type SymbolType } from '@config/gameConfig';
import { AssetLoader } from '@core/AssetLoader';
import { shouldGenerateWin, generateWinningCombination, generateLosingCombination, CASINO_CONFIG } from '@config/casinoConfig';

type WinLine = {
  row: number;
  symbol: SymbolType;
};

export class SlotMachine extends Container {
  private reels: Reel[] = [];
  private spinButton!: Button;
  private betMinusButton!: BetButton;
  private betPlusButton!: BetButton;
  private board!: Graphics;
  private winText!: Text;
  private coinAnimation!: CoinAnimation;
  private balanceUI!: BalanceUI;
  private isSpinning = false;

  constructor() {
    super();
    
    this.createReels();
    this.createBoard();
    this.createCoinAnimation();
    this.createBalanceUI();
    this.createButton();
    this.createBetButtons();
    this.createWinText();
    
    this.position.set(
      GAME_CONFIG.width / 2,
      GAME_CONFIG.height / 2
    );
  }

  private createBoard(): void {
    this.board = new Graphics();
    
    const totalWidth = REEL_CONFIG.columns * REEL_CONFIG.symbolWidth + (REEL_CONFIG.columns - 1) * REEL_CONFIG.symbolSpacing;
    const totalHeight = REEL_CONFIG.rows * REEL_CONFIG.symbolHeight + (REEL_CONFIG.rows - 1) * REEL_CONFIG.rowSpacing;
    
    this.board.roundRect(-totalWidth / 2, -totalHeight / 2, totalWidth, totalHeight, 20);
    this.board.stroke({ color: 0xffd23f, width: 4 });
    
    this.addChild(this.board);
  }

  private createReels(): void {
    const totalWidth = REEL_CONFIG.columns * REEL_CONFIG.symbolWidth + (REEL_CONFIG.columns - 1) * REEL_CONFIG.symbolSpacing;
    const totalHeight = REEL_CONFIG.rows * REEL_CONFIG.symbolHeight + (REEL_CONFIG.rows - 1) * REEL_CONFIG.rowSpacing;
    
    const startX = -totalWidth / 2;
    const startY = -totalHeight / 2;
    
    const reelLayer = new Container();
    
    for (let i = 0; i < REEL_CONFIG.columns; i++) {
      const reel = new Reel();
      reel.x = startX + i * (REEL_CONFIG.symbolWidth + REEL_CONFIG.symbolSpacing);
      reel.y = startY;
      this.reels.push(reel);
      reelLayer.addChild(reel);
    }
    
    const reelMask = new Graphics();
    const maskPadding = 2;
    reelMask.roundRect(
      startX + maskPadding, 
      startY + maskPadding, 
      totalWidth - maskPadding * 2, 
      totalHeight - maskPadding * 2, 
      18
    );
    reelMask.fill({ color: 0xffffff, alpha: 1 });
    reelLayer.addChild(reelMask);
    reelLayer.mask = reelMask;
    
    this.addChild(reelLayer);
  }

  private createCoinAnimation(): void {
    const frames = AssetLoader.getCoinFrames();
    this.coinAnimation = new CoinAnimation(frames);
    this.coinAnimation.x = 0;
    this.coinAnimation.y = 0;
    this.addChild(this.coinAnimation);
  }

  private createBalanceUI(): void {
    this.balanceUI = new BalanceUI(1000, 10);
    const totalWidth = REEL_CONFIG.columns * REEL_CONFIG.symbolWidth + (REEL_CONFIG.columns - 1) * REEL_CONFIG.symbolSpacing;
    const totalHeight = REEL_CONFIG.rows * REEL_CONFIG.symbolHeight + (REEL_CONFIG.rows - 1) * REEL_CONFIG.rowSpacing;
    
    this.balanceUI.x = -totalWidth / 2 - 320;
    this.balanceUI.y = -totalHeight / 2;
    this.addChild(this.balanceUI);
  }

  private createButton(): void {
    this.spinButton = new Button('SPIN', 200, 70);
    const totalWidth = REEL_CONFIG.columns * REEL_CONFIG.symbolWidth + (REEL_CONFIG.columns - 1) * REEL_CONFIG.symbolSpacing;
    const totalHeight = REEL_CONFIG.rows * REEL_CONFIG.symbolHeight + (REEL_CONFIG.rows - 1) * REEL_CONFIG.rowSpacing;
    
    this.spinButton.x = totalWidth / 4 - 50;
    this.spinButton.y = totalHeight / 2 + 20;
    this.spinButton.onClick(() => this.spin());
    this.addChild(this.spinButton);
  }

  private createBetButtons(): void {
    const totalWidth = REEL_CONFIG.columns * REEL_CONFIG.symbolWidth + (REEL_CONFIG.columns - 1) * REEL_CONFIG.symbolSpacing;
    const totalHeight = REEL_CONFIG.rows * REEL_CONFIG.symbolHeight + (REEL_CONFIG.rows - 1) * REEL_CONFIG.rowSpacing;
    
    this.betMinusButton = new BetButton('-', 60, 60);
    this.betMinusButton.x = -totalWidth / 2 - 320;
    this.betMinusButton.y = -totalHeight / 2 + 120;
    this.betMinusButton.onClick(() => this.decreaseBet());
    this.addChild(this.betMinusButton);

    this.betPlusButton = new BetButton('+', 60, 60);
    this.betPlusButton.x = -totalWidth / 2 - 240;
    this.betPlusButton.y = -totalHeight / 2 + 120;
    this.betPlusButton.onClick(() => this.increaseBet());
    this.addChild(this.betPlusButton);
  }

  private createWinText(): void {
    this.winText = new Text({
      text: '',
      style: {
        fontSize: 48,
        fontWeight: 'bold',
        fill: 0xffd23f,
        stroke: { color: 0x000000, width: 4 }
      }
    });
    this.winText.anchor.set(0.5);
    this.winText.y = 100;
    this.winText.visible = false;
    this.addChild(this.winText);
  }

  update(delta: number): void {
    if (!this.isSpinning) return;
    
    this.reels.forEach(reel => reel.update(delta));
    
    if (this.reels.every(reel => !reel.isSpinning())) {
      this.isSpinning = false;
      this.spinButton.setEnabled(true);
      this.betMinusButton.setEnabled(true);
      this.betPlusButton.setEnabled(true);
      AssetLoader.stopSpinSound();
      this.checkWin();
    }
  }

  private decreaseBet(): void {
    const currentBet = this.balanceUI.getBet();
    this.balanceUI.setBet(currentBet - 10);
  }

  private increaseBet(): void {
    const currentBet = this.balanceUI.getBet();
    this.balanceUI.setBet(currentBet + 10);
  }

  private spin(): void {
    if (this.isSpinning) return;
    
    const bet = this.balanceUI.getBet();
    if (!this.balanceUI.subtractBalance(bet)) {
      return;
    }
    
    this.isSpinning = true;
    this.spinButton.setEnabled(false);
    this.betMinusButton.setEnabled(false);
    this.betPlusButton.setEnabled(false);
    this.winText.visible = false;
    this.coinAnimation.stop();
    
    AssetLoader.playSpinSound();
    
    const shouldWin = shouldGenerateWin();
    const result = shouldWin 
      ? generateWinningCombination(REEL_CONFIG.rows, REEL_CONFIG.columns)
      : generateLosingCombination(REEL_CONFIG.rows, REEL_CONFIG.columns);
    
    this.reels.forEach((reel, index) => {
      const delay = index * REEL_CONFIG.spinDelay;
      const duration = REEL_CONFIG.spinDuration + delay;
      
      setTimeout(() => {
        reel.spin(duration, [...result[index]].reverse());
      }, delay);
    });
  }

  private checkWin(): void {
    const grid: SymbolType[][] = [];
    
    for (let col = 0; col < REEL_CONFIG.columns; col++) {
      grid.push(this.reels[col].getVisibleSymbols());
    }
    
    const wins: WinLine[] = [];
    
    for (let row = 0; row < REEL_CONFIG.rows; row++) {
      const symbol = grid[0][row];
      let isWin = true;
      
      for (let col = 1; col < REEL_CONFIG.columns; col++) {
        if (grid[col][row] !== symbol) {
          isWin = false;
          break;
        }
      }
      
      if (isWin) {
        wins.push({ row, symbol });
      }
    }
    
    if (wins.length > 0) {
      this.showWin(wins);
    }
  }

  private showWin(wins: WinLine[]): void {
    let totalWin = 0;
    const bet = this.balanceUI.getBet();
    
    wins.forEach(win => {
      const multiplier = CASINO_CONFIG.payoutMultipliers[win.symbol];
      totalWin += bet * multiplier;
    });
    
    this.balanceUI.addBalance(totalWin);
    
    const text = wins.length === 1 
      ? `WIN! $${totalWin}\n${wins[0].symbol.toUpperCase()}`
      : `BIG WIN! $${totalWin}\n${wins.length} LINES!`;
    
    AssetLoader.playWinSound();
    this.coinAnimation.play();
    
    this.winText.text = text;
    this.winText.visible = true;
    this.winText.scale.set(0);
    
    const animate = () => {
      if (this.winText.scale.x < 1) {
        this.winText.scale.x += 0.05;
        this.winText.scale.y += 0.05;
        requestAnimationFrame(animate);
      }
    };
    animate();
  }
}

