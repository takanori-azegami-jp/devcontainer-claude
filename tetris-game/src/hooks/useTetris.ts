// テトリスゲームのメインロジックを管理するカスタムフック
// ゲーム状態の管理、テトリミノの移動・回転、ライン消去などを処理

import { useState, useCallback } from 'react';
import { 
  GameState, 
  Board, 
  CurrentTetromino, 
  Position,
  TetrominoType,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  CellValue
} from '@/types/tetris';
import { 
  getRandomTetrominoType, 
  getTetrominoShape, 
  rotateTetromino as rotateTetrominoShape,
  TETROMINO_COLORS 
} from '@/utils/tetrominos';

// 空のボードを作成
const createEmptyBoard = (): Board => {
  return Array.from({ length: BOARD_HEIGHT }, () => 
    Array.from({ length: BOARD_WIDTH }, () => 0)
  );
};

// テトリミノが指定位置に配置可能かチェック
const canMoveTo = (board: Board, tetromino: CurrentTetromino, position: Position): boolean => {
  const { shape } = tetromino;
  
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] !== 0) {
        const newRow = position.y + row;
        const newCol = position.x + col;
        
        // 境界チェック
        if (newRow < 0 || newRow >= BOARD_HEIGHT || newCol < 0 || newCol >= BOARD_WIDTH) {
          return false;
        }
        
        // 既存のブロックとの衝突チェック
        if (board[newRow][newCol] !== 0) {
          return false;
        }
      }
    }
  }
  
  return true;
};

// テトリミノをボードに配置
const placeTetromino = (board: Board, tetromino: CurrentTetromino): Board => {
  const newBoard = board.map(row => [...row]);
  const colorIndex = TETROMINO_COLORS[tetromino.type] as CellValue;
  
  tetromino.shape.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell !== 0) {
        const boardRow = tetromino.position.y + rowIndex;
        const boardCol = tetromino.position.x + colIndex;
        if (boardRow >= 0 && boardRow < BOARD_HEIGHT && boardCol >= 0 && boardCol < BOARD_WIDTH) {
          newBoard[boardRow][boardCol] = colorIndex;
        }
      }
    });
  });
  
  return newBoard;
};

// 完成したラインを見つけて削除
const clearLines = (board: Board): { newBoard: Board; linesCleared: number } => {
  const newBoard = [...board];
  let linesCleared = 0;
  
  for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
    if (newBoard[row].every(cell => cell !== 0)) {
      newBoard.splice(row, 1);
      newBoard.unshift(Array.from({ length: BOARD_WIDTH }, () => 0));
      linesCleared++;
      row++; // 同じ行を再度チェック
    }
  }
  
  return { newBoard, linesCleared };
};

// 新しいテトリミノを生成
const createNewTetromino = (type?: TetrominoType | null): CurrentTetromino => {
  const tetrominoType = type || getRandomTetrominoType();
  return {
    shape: getTetrominoShape(tetrominoType),
    position: { x: Math.floor(BOARD_WIDTH / 2) - 2, y: 0 },
    type: tetrominoType,
    rotation: 0
  };
};

export const useTetris = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentTetromino: null,
    nextTetromino: getRandomTetrominoType(),
    score: 0,
    lines: 0,
    level: 1,
    isGameOver: false,
    isPaused: false,
  });


  // 新しいゲームを開始
  const startNewGame = useCallback(() => {
    setGameState({
      board: createEmptyBoard(),
      currentTetromino: createNewTetromino(),
      nextTetromino: getRandomTetrominoType(),
      score: 0,
      lines: 0,
      level: 1,
      isGameOver: false,
      isPaused: false,
    });
  }, []);

  // テトリミノを移動
  const moveTetromino = useCallback((dx: number, dy: number) => {
    setGameState(prev => {
      if (!prev.currentTetromino || prev.isGameOver || prev.isPaused) return prev;
      
      const newPosition = {
        x: prev.currentTetromino.position.x + dx,
        y: prev.currentTetromino.position.y + dy
      };
      
      if (canMoveTo(prev.board, prev.currentTetromino, newPosition)) {
        return {
          ...prev,
          currentTetromino: {
            ...prev.currentTetromino,
            position: newPosition
          }
        };
      }
      
      return prev;
    });
  }, []);

  // テトリミノを回転
  const rotateTetromino = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentTetromino || prev.isGameOver || prev.isPaused) return prev;
      
      const rotatedShape = rotateTetrominoShape(prev.currentTetromino.type, prev.currentTetromino.rotation);
      const newRotation = (prev.currentTetromino.rotation + 1) % 4;
      const rotatedTetromino = {
        ...prev.currentTetromino,
        shape: rotatedShape,
        rotation: newRotation
      };
      
      if (canMoveTo(prev.board, rotatedTetromino, prev.currentTetromino.position)) {
        return {
          ...prev,
          currentTetromino: rotatedTetromino
        };
      }
      
      return prev;
    });
  }, []);

  // テトリミノを下に落とす
  const dropTetromino = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentTetromino || prev.isGameOver || prev.isPaused) return prev;
      
      const newPosition = {
        x: prev.currentTetromino.position.x,
        y: prev.currentTetromino.position.y + 1
      };
      
      if (canMoveTo(prev.board, prev.currentTetromino, newPosition)) {
        return {
          ...prev,
          currentTetromino: {
            ...prev.currentTetromino,
            position: newPosition
          }
        };
      } else {
        // テトリミノを固定し、新しいテトリミノを生成
        const newBoard = placeTetromino(prev.board, prev.currentTetromino);
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
        
        const newTetromino = createNewTetromino(prev.nextTetromino);
        const nextTetromino = getRandomTetrominoType();
        
        // ゲームオーバーチェック
        const isGameOver = !canMoveTo(clearedBoard, newTetromino, newTetromino.position);
        
        const pointsPerLine = [0, 100, 300, 500, 800];
        const points = pointsPerLine[linesCleared] * prev.level;
        const newLines = prev.lines + linesCleared;
        const newLevel = Math.floor(newLines / 10) + 1;
        
        return {
          ...prev,
          board: clearedBoard,
          currentTetromino: isGameOver ? null : newTetromino,
          nextTetromino: nextTetromino,
          score: prev.score + points,
          lines: newLines,
          level: newLevel,
          isGameOver
        };
      }
    });
  }, []);

  // ゲームを一時停止/再開
  const togglePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  }, []);

  // ゲームの描画用ボードを取得（現在のテトリミノを含む）
  const getDisplayBoard = useCallback((): Board => {
    if (!gameState.currentTetromino) return gameState.board;
    
    const displayBoard = gameState.board.map(row => [...row]);
    const tetromino = gameState.currentTetromino;
    const colorIndex = TETROMINO_COLORS[tetromino.type] as CellValue;
    
    tetromino.shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell !== 0) {
          const boardRow = tetromino.position.y + rowIndex;
          const boardCol = tetromino.position.x + colIndex;
          if (boardRow >= 0 && boardRow < BOARD_HEIGHT && boardCol >= 0 && boardCol < BOARD_WIDTH) {
            displayBoard[boardRow][boardCol] = colorIndex;
          }
        }
      });
    });
    
    return displayBoard;
  }, [gameState]);

  return {
    gameState,
    displayBoard: getDisplayBoard(),
    startNewGame,
    moveTetromino,
    rotateTetromino: rotateTetromino,
    dropTetromino,
    togglePause
  };
};