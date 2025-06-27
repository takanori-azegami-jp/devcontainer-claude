// ゲームループを管理するカスタムフック
// テトリミノの自動落下タイマーを制御

import { useEffect, useRef } from 'react';

interface GameLoopProps {
  isActive: boolean;
  isPaused: boolean;
  level: number;
  onTick: () => void;
}

export const useGameLoop = ({ isActive, isPaused, level, onTick }: GameLoopProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // レベルによって落下速度を調整（レベルが上がるほど速くなる）
  const getDropInterval = (level: number): number => {
    return Math.max(100, 1000 - (level - 1) * 50);
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      const interval = getDropInterval(level);
      
      intervalRef.current = setInterval(() => {
        onTick();
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, isPaused, level, onTick]);
};