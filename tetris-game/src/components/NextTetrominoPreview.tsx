// 次に来るテトリミノを表示するプレビューコンポーネント
// 4×4のグリッドで次のテトリミノの形状を表示

import React from 'react';
import { TetrominoType, TETROMINO_COLORS } from '@/types/tetris';
import { getTetrominoShape, TETROMINO_COLORS as SHAPE_COLORS } from '@/utils/tetrominos';

interface NextTetrominoPreviewProps {
  nextTetromino: TetrominoType | null;
  className?: string;
}

export const NextTetrominoPreview: React.FC<NextTetrominoPreviewProps> = ({ 
  nextTetromino, 
  className = '' 
}) => {
  const shape = nextTetromino ? getTetrominoShape(nextTetromino, 0) : null;
  const colorIndex = nextTetromino ? SHAPE_COLORS[nextTetromino] : 0;

  return (
    <div className={`bg-gray-800 p-4 rounded-lg border border-gray-600 ${className}`}>
      <h3 className="text-white text-sm font-bold mb-2 text-center">NEXT</h3>
      <div className="grid grid-cols-4 gap-0">
        {Array.from({ length: 16 }, (_, index) => {
          const row = Math.floor(index / 4);
          const col = index % 4;
          const isActive = shape && shape[row] && shape[row][col] === 1;
          
          return (
            <div
              key={index}
              className={`
                w-4 h-4 border border-gray-700
                ${isActive ? TETROMINO_COLORS[colorIndex] : 'bg-gray-900'}
                ${isActive ? 'opacity-100' : 'opacity-30'}
              `}
            />
          );
        })}
      </div>
    </div>
  );
};