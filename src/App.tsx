import { useState, useCallback, useEffect } from 'react';
import { WarpProvider, useWarp } from '@/context/WarpContext';
import { Scene } from '@/components/three/Scene';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { TechTooltip } from '@/components/ui/TechTooltip';
import { Hero } from '@/components/sections/Hero';
import { Projects } from '@/components/sections/Projects';
import { Skills } from '@/components/sections/Skills';
import { Experience } from '@/components/sections/Experience';
import { Contact } from '@/components/sections/Contact';
import { checkReveal } from '@/hooks/useScrollReveal';

function AppContent() {
  const [isCursorHovering, setIsCursorHovering] = useState(false);
  const [tooltipData, setTooltipData] = useState<{
    name: string | null;
    position: { x: number; y: number } | null;
  }>({ name: null, position: null });
  const { isFading } = useWarp();

  const handleCursorHover = useCallback((hovering: boolean) => {
    setIsCursorHovering(hovering);
  }, []);

  const handleLogoHover = useCallback((name: string | null, event?: { clientX: number; clientY: number }) => {
    if (name && event) {
      setTooltipData({ name, position: { x: event.clientX, y: event.clientY } });
      setIsCursorHovering(true);
    } else {
      setTooltipData({ name: null, position: null });
      setIsCursorHovering(false);
    }
  }, []);

  const handleDragStart = useCallback(() => {
    setTooltipData({ name: null, position: null });
  }, []);

  const handleDragEnd = useCallback(() => {
    // Nothing special needed
  }, []);

  // Initial scroll reveal check
  useEffect(() => {
    checkReveal();
    window.addEventListener('scroll', checkReveal);
    return () => window.removeEventListener('scroll', checkReveal);
  }, []);

  return (
    <>
      {/* Custom Cursor */}
      <CustomCursor isHovering={isCursorHovering} />

      {/* Tech Tooltip */}
      <TechTooltip name={tooltipData.name} position={tooltipData.position} />

      {/* Three.js Scene */}
      <Scene
        onLogoHover={handleLogoHover}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />

      {/* Floating Background Elements */}
      <div className="floating-element circle-1"></div>
      <div className="floating-element circle-2"></div>

      {/* Navigation */}
      <Navigation onHover={handleCursorHover} />

      {/* Main Content */}
      <main className={isFading ? 'fading' : ''}>
        <Hero onHover={handleCursorHover} />
        <Projects onHover={handleCursorHover} />
        <Skills onHover={handleCursorHover} />
        <Experience />
        <Contact onHover={handleCursorHover} />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

function App() {
  return (
    <WarpProvider>
      <AppContent />
    </WarpProvider>
  );
}

export default App;
