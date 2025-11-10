import type { SymbolType } from './gameConfig';
export const CASINO_CONFIG = {
 
  
  
  winProbability: 25, //winProbability
  
  symbolWeights: {
    cherry: 30,      
    lemon: 28,       
    orange: 25,      
    plum: 20,       
    watermelon: 18,  
    banana: 15,      
    seven: 10,      
    bar: 8,         
    bigwin: 5     
  } as Record<SymbolType, number>,
  

  payoutMultipliers: {
    cherry: 5,
    lemon: 8,
    orange: 10,
    plum: 15,
    watermelon: 20,
    banana: 30,
    seven: 50,
    bar: 75,
    bigwin: 100
  } as Record<SymbolType, number>
} as const;


export function getWeightedRandomSymbol(): SymbolType {
  const weights = CASINO_CONFIG.symbolWeights;
  const symbols = Object.keys(weights) as SymbolType[];

  const totalWeight = symbols.reduce((sum, symbol) => sum + weights[symbol], 0);
  

  let random = Math.random() * totalWeight;
  

  for (const symbol of symbols) {
    random -= weights[symbol];
    if (random <= 0) {
      return symbol;
    }
  }
  

  return symbols[symbols.length - 1];
}


export function shouldGenerateWin(): boolean {
  return Math.random() * 100 < CASINO_CONFIG.winProbability;
}


export function generateWinningCombination(rows: number, columns: number): SymbolType[][] {
  const result: SymbolType[][] = [];
  

  const winningRowsCount = Math.floor(Math.random() * Math.min(3, rows)) + 1;
  const winningRows = new Set<number>();
  

  while (winningRows.size < winningRowsCount) {
    winningRows.add(Math.floor(Math.random() * rows));
  }
  

  const firstColumnSymbols: SymbolType[] = [];
  for (let row = 0; row < rows; row++) {
    firstColumnSymbols.push(getWeightedRandomSymbol());
  }
  

  for (let col = 0; col < columns; col++) {
    const column: SymbolType[] = [];
    
    for (let row = 0; row < rows; row++) {
      if (winningRows.has(row)) {
        column.push(firstColumnSymbols[row]);
      } else {
        column.push(getWeightedRandomSymbol());
      }
    }
    
    result.push(column);
  }
  
  return result;
}


export function generateLosingCombination(rows: number, columns: number): SymbolType[][] {
  const result: SymbolType[][] = [];
  
  for (let col = 0; col < columns; col++) {
    const column: SymbolType[] = [];
    
    for (let row = 0; row < rows; row++) {
      let symbol: SymbolType;
      
      symbol = getWeightedRandomSymbol();
      
      if (col === columns - 1) {
        const firstSymbol = result[0][row];
        let isWinningLine = true;
        
        for (let c = 1; c < columns - 1; c++) {
          if (result[c][row] !== firstSymbol) {
            isWinningLine = false;
            break;
          }
        }

        if (isWinningLine) {
          const allSymbols = Object.keys(CASINO_CONFIG.symbolWeights) as SymbolType[];
          const differentSymbols = allSymbols.filter(s => s !== firstSymbol);
          symbol = differentSymbols[Math.floor(Math.random() * differentSymbols.length)];
        }
      }
      
      column.push(symbol);
    }
    
    result.push(column);
  }
  
  return result;
}

