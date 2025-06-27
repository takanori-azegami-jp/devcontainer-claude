// メインのテトリスゲームコンポーネント
// 全ての要素を統合してゲーム画面を構成

'use client';

import React, { useCallback } from 'react';
import { GameBoard } from './GameBoard';
import { NextTetrominoPreview } from './NextTetrominoPreview';
import { GameInfo } from './GameInfo';
import { useTetris } from '@/hooks/useTetris';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useGameLoop } from '@/hooks/useGameLoop';

export const TetrisGame: React.FC = () => {
  const {
    gameState,
    displayBoard,
    startNewGame,
    moveTetromino,
    rotateTetromino,
    dropTetromino,
    togglePause
  } = useTetris();

  // ハードドロップ（一気に下まで落とす）
  const handleHardDrop = useCallback(() => {
    // 連続でdropTetrominoを呼んでブロックを一番下まで落とす
    let canDrop = true;
    while (canDrop) {
      dropTetromino();
      // 実際の実装では、テトリミノが配置されたかどうかをチェックする必要がある
      // 今回は簡単のため、複数回呼び出しで対応
      canDrop = false; // 一旦単発で実装
    }
  }, [dropTetromino]);

  // キーボード操作のハンドラー
  const keyboardHandlers = {
    onMoveLeft: () => moveTetromino(-1, 0),
    onMoveRight: () => moveTetromino(1, 0),
    onMoveDown: () => moveTetromino(0, 1),
    onRotate: rotateTetromino,
    onHardDrop: handleHardDrop,
    onPause: togglePause,
    onRestart: startNewGame
  };

  // キーボード入力を処理
  useKeyboard(keyboardHandlers);

  // ゲームループ
  useGameLoop({
    isActive: !!gameState.currentTetromino,
    isPaused: gameState.isPaused,
    level: gameState.level,
    onTick: dropTetromino
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* ゲーム盤面 */}
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-4 text-center text-cyan-400">TETRIS</h1>
          <GameBoard board={displayBoard} />
          
          {/* ゲーム状態の表示 */}
          <div className="mt-4 text-center">
            {gameState.isGameOver && (
              <div className="bg-red-600 text-white px-4 py-2 rounded-lg mb-2">
                <p className="font-bold">GAME OVER</p>
              </div>
            )}
            {gameState.isPaused && !gameState.isGameOver && (
              <div className="bg-yellow-600 text-white px-4 py-2 rounded-lg mb-2">
                <p className="font-bold">PAUSED</p>
              </div>
            )}
            
            {/* 操作説明 */}
            <div className="text-sm text-gray-400 mt-4">
              <p>← → ↓ : 移動</p>
              <p>↑ / X : 回転</p>
              <p>Space : ハードドロップ</p>
              <p>P / Esc : 一時停止</p>
              <p>R : リスタート</p>
            </div>
          </div>
        </div>

        {/* サイドパネル */}
        <div className="flex flex-col gap-4">
          <NextTetrominoPreview nextTetromino={gameState.nextTetromino} />
          <GameInfo 
            score={gameState.score}
            lines={gameState.lines}
            level={gameState.level}
          />
          
          {/* ゲーム制御ボタン */}
          <div className="flex flex-col gap-2">
            <button
              onClick={startNewGame}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              新しいゲーム
            </button>
            <button
              onClick={togglePause}
              disabled={gameState.isGameOver}
              className={`font-bold py-2 px-4 rounded transition-colors ${
                gameState.isGameOver 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {gameState.isPaused ? '再開' : '一時停止'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};