import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface WarpState {
  isWarping: boolean;
  warpSpeed: number;
  warpProgress: number;
  isFading: boolean;
  triggerWarp: (targetId: string) => void;
}

const WarpContext = createContext<WarpState | null>(null);

const MAX_WARP_SPEED = 2.5;
const WARP_DURATION = 1200;

export function WarpProvider({ children }: { children: React.ReactNode }) {
  const [isWarping, setIsWarping] = useState(false);
  const [warpSpeed, setWarpSpeed] = useState(0);
  const [warpProgress, setWarpProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const animationRef = useRef<number | null>(null);

  const triggerWarp = useCallback((targetId: string) => {
    if (isWarping) return;

    setIsWarping(true);
    setWarpProgress(0);
    setIsFading(true);

    const startTime = Date.now();

    // Scroll to target midway through warp (while content is faded out)
    setTimeout(() => {
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
      }
    }, 600);

    // Fade content back in
    setTimeout(() => {
      setIsFading(false);
    }, 900);

    function warpAnimation() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / WARP_DURATION, 1);

      setWarpProgress(progress);

      let speed: number;
      if (progress < 0.3) {
        speed = (progress / 0.3) * MAX_WARP_SPEED;
      } else if (progress < 0.7) {
        speed = MAX_WARP_SPEED;
      } else {
        speed = ((1 - progress) / 0.3) * MAX_WARP_SPEED;
      }

      setWarpSpeed(speed);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(warpAnimation);
      } else {
        setIsWarping(false);
        setWarpSpeed(0);
        animationRef.current = null;
      }
    }

    warpAnimation();
  }, [isWarping]);

  return (
    <WarpContext.Provider value={{ isWarping, warpSpeed, warpProgress, isFading, triggerWarp }}>
      {children}
    </WarpContext.Provider>
  );
}

export function useWarp() {
  const context = useContext(WarpContext);
  if (!context) {
    throw new Error('useWarp must be used within a WarpProvider');
  }
  return context;
}
