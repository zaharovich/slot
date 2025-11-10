export const GAME_CONFIG = {
  width: 1280,
  height: 720,
  backgroundColor: 0x1a1a2e
} as const;

export const REEL_CONFIG = {
  columns: 3,
  rows: 3,
  symbolWidth: 185, //symbolWidth
  symbolHeight: 168, //symbolHeight
  symbolSize: 168, //symbolSize
  symbolSpacing: 15, //symbolSpacing
  rowSpacing: 0, //rowSpacing
  spinDuration: 2200, //spinDuration
  spinDelay: 220, //spinDelay
  acceleration: 850, //acceleration
  deceleration: 300, //deceleration
  minSpeed: 0, //minSpeed
  maxSpeed: 38 //maxSpeed
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

