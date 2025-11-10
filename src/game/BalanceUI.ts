import { Container, Graphics, Text } from 'pixi.js';

export class BalanceUI extends Container {
  private balanceText: Text;
  private betText: Text;
  private balance: number;
  private bet: number;

  constructor(initialBalance: number = 1000, initialBet: number = 10) {
    super();
    
    this.balance = initialBalance;
    this.bet = initialBet;

    const panel = new Graphics();
    panel.roundRect(0, 0, 300, 100, 10);
    panel.fill({ color: 0x1a1a2e, alpha: 0.9 });
    panel.stroke({ color: 0xffd23f, width: 2 });
    this.addChild(panel);

    this.balanceText = new Text({
      text: `Balance: $${this.balance}`,
      style: {
        fontSize: 24,
        fontWeight: 'bold',
        fill: 0xffd23f
      }
    });
    this.balanceText.x = 20;
    this.balanceText.y = 20;
    this.addChild(this.balanceText);

    this.betText = new Text({
      text: `Bet: $${this.bet}`,
      style: {
        fontSize: 24,
        fontWeight: 'bold',
        fill: 0xffffff
      }
    });
    this.betText.x = 20;
    this.betText.y = 55;
    this.addChild(this.betText);
  }

  getBalance(): number {
    return this.balance;
  }

  getBet(): number {
    return this.bet;
  }

  setBet(amount: number): void {
    this.bet = Math.max(1, Math.min(amount, this.balance));
    this.updateDisplay();
  }

  addBalance(amount: number): void {
    this.balance += amount;
    this.updateDisplay();
  }

  subtractBalance(amount: number): boolean {
    if (this.balance >= amount) {
      this.balance -= amount;
      this.updateDisplay();
      return true;
    }
    return false;
  }

  private updateDisplay(): void {
    this.balanceText.text = `Balance: $${this.balance}`;
    this.betText.text = `Bet: $${this.bet}`;
  }
}

