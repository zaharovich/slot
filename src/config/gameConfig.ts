export const GAME_CONFIG = {
  width: 1280,
  height: 720,
  backgroundColor: 0x1a1a2e
} as const;

export const REEL_CONFIG = {
  columns: 3,
  rows: 3,
  symbolWidth: 185,  // Ширина красного квадрата (БЕЗ отступов)
  symbolHeight: 168, // Высота красного квадрата (БЕЗ отступов)
  symbolSize: 168,   // Для обратной совместимости (используем высоту)
  symbolSpacing: 15,  // Отступы между колонками (по бокам центральной линии)
  rowSpacing: 0,      // Без отступов между рядами (вертикально)
  spinDuration: 2200,
  spinDelay: 220,
  acceleration: 850,
  deceleration: 300,
  minSpeed: 0,
  maxSpeed: 38
} as const;

export type SymbolType = 
  | 'bigwin' 
  | 'banana' 
  | 'seven' 
  | 'plum' 
  | 'watermelon' 
  | 'lemon' 
  | 'cherry' 
  | 'orange' 
  | 'bar';

export const SYMBOLS: SymbolType[] = [
  'bigwin',
  'banana',
  'seven',
  'plum',
  'watermelon',
  'lemon',
  'cherry',
  'orange',
  'bar'
];

