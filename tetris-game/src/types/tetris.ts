// テトリスゲームの型定義ファイル
// ゲームの基本的な状態とテトリミノの構造を定義

// セルの状態を表す型（空のセルは0、埋まっているセルは1-7で色を識別）
export type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

// ゲーム盤面の型（20行 × 10列のマトリックス）
export type Board = CellValue[][];

// テトリミノの座標を表す型
export interface Position {
  x: number;
  y: number;
}

// テトリミノの形状を表す型
export type TetrominoShape = number[][];

// テトリミノの種類
export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

// 現在のテトリミノの状態
export interface CurrentTetromino {
  shape: TetrominoShape;
  position: Position;
  type: TetrominoType;
  rotation: number;
}

// ゲーム全体の状態
export interface GameState {
  board: Board;
  currentTetromino: CurrentTetromino | null;
  nextTetromino: TetrominoType | null;
  score: number;
  lines: number;
  level: number;
  isGameOver: boolean;
  isPaused: boolean;
}

// ゲームの定数
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const TETROMINO_COLORS = [
  'bg-gray-900',    // 0: 空のセル
  'bg-cyan-400',    // 1: I-テトリミノ
  'bg-yellow-400',  // 2: O-テトリミノ
  'bg-purple-400',  // 3: T-テトリミノ
  'bg-green-400',   // 4: S-テトリミノ
  'bg-red-400',     // 5: Z-テトリミノ
  'bg-blue-400',    // 6: J-テトリミノ
  'bg-orange-400',  // 7: L-テトリミノ
];