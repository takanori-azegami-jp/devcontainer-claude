// ゲーム盤面を描画するコンポーネント
// 20×10のマトリックスを表示し、各セルの色を管理

import React from 'react';
import { Board, TETROMINO_COLORS } from '@/types/tetris';

interface GameBoardProps {
  board: Board;
  className?: string;
}

export const GameBoard: React.FC<GameBoardProps> = ({ board, className = '' }) => {
  return (
    <div className={`inline-block border-4 border-gray-300 bg-black ${className}`}>
      <div className="grid grid-cols-10 gap-0">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                w-6 h-6 border border-gray-700
                ${TETROMINO_COLORS[cell]}
                ${cell === 0 ? 'opacity-30' : 'opacity-100'}
              `}
            />
          ))
        )}
      </div>
    </div>
  );
};