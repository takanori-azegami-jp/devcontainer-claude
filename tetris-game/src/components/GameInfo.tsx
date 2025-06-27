// ゲームの情報（スコア、レベル、ライン数）を表示するコンポーネント
// プレイヤーの現在の進行状況を表示

import React from 'react';

interface GameInfoProps {
  score: number;
  lines: number;
  level: number;
  className?: string;
}

export const GameInfo: React.FC<GameInfoProps> = ({ 
  score, 
  lines, 
  level, 
  className = '' 
}) => {
  return (
    <div className={`bg-gray-800 p-4 rounded-lg border border-gray-600 ${className}`}>
      <div className="space-y-3">
        <div className="text-center">
          <h3 className="text-white text-sm font-bold mb-1">SCORE</h3>
          <p className="text-yellow-400 text-xl font-mono">{score.toLocaleString()}</p>
        </div>
        
        <div className="text-center">
          <h3 className="text-white text-sm font-bold mb-1">LINES</h3>
          <p className="text-green-400 text-xl font-mono">{lines}</p>
        </div>
        
        <div className="text-center">
          <h3 className="text-white text-sm font-bold mb-1">LEVEL</h3>
          <p className="text-blue-400 text-xl font-mono">{level}</p>
        </div>
      </div>
    </div>
  );
};