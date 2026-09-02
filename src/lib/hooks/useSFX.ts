import { useCallback } from 'react';

const SOUNDS = {
  hover: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  complete: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
};

export function useSFX() {
  return useCallback((key: keyof typeof SOUNDS) => {
    try {
      const audio = new Audio(SOUNDS[key]);
      audio.volume = 0.2;
      audio.play().catch(() => {});
    } catch {
      // silent
    }
  }, []);
}
