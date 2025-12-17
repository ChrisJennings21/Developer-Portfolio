import { useRef, useEffect, useState } from 'react';

interface CustomCursorProps {
  isHovering: boolean;
}

export function CustomCursor({ isHovering }: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop for smooth cursor following
    let animationId: number;
    const animate = () => {
      if (cursorRef.current) {
        // Lerp factor for smooth movement
        cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
        cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;

        cursorRef.current.style.left = `${cursorPos.current.x - 10}px`;
        cursorRef.current.style.top = `${cursorPos.current.y - 10}px`;
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [isVisible]);

  // Hide on touch devices
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      setIsVisible(false);
    }
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`cursor ${isHovering ? 'hover' : ''}`}
      style={{
        opacity: isVisible ? 1 : 0,
        display: window.innerWidth <= 768 ? 'none' : 'block',
      }}
    />
  );
}
