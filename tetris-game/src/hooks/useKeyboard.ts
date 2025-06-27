// キーボード入力を管理するカスタムフック
// 矢印キー、スペースキー、その他のゲーム操作キーを処理

import { useEffect, useCallback } from 'react';

interface KeyboardHandlers {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onPause: () => void;
  onRestart: () => void;
}

export const useKeyboard = (handlers: KeyboardHandlers) => {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // ゲーム中にページがスクロールしないように
    if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '].includes(event.code)) {
      event.preventDefault();
    }

    switch (event.code) {
      case 'ArrowLeft':
        handlers.onMoveLeft();
        break;
      case 'ArrowRight':
        handlers.onMoveRight();
        break;
      case 'ArrowDown':
        handlers.onMoveDown();
        break;
      case 'ArrowUp':
      case 'KeyX':
        handlers.onRotate();
        break;
      case 'Space':
        handlers.onHardDrop();
        break;
      case 'KeyP':
      case 'Escape':
        handlers.onPause();
        break;
      case 'KeyR':
        handlers.onRestart();
        break;
    }
  }, [handlers]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
};