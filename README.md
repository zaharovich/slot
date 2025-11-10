

## Quick Start

```bash
npm install
npm run dev
```

## Game Configuration

settings in `src/config/casinoConfig.ts`:

```typescript
export const CASINO_CONFIG = {
  winProbability: 25,  // Win chance (%)
  
  symbolWeights: {    
    cherry: 30,
    lemon: 28,
  },
  
  payoutMultipliers: {
    cherry: 5,
    lemon: 8,
  }
}
```

### Win Probability

Change `winProbability` value (0-100):
- `10` = 10% win chance (1 in 10 spins)
- `25` = 25% win chance (1 in 4 spins)
- `50` = 50% win chance (1 in 2 spins)

## Tech Stack

- PixiJS v8
- TypeScript
- Vite


