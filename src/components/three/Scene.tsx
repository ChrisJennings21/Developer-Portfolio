import { useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FloatingParticles } from './FloatingParticles';
import { WarpEffect } from './WarpEffect';
import { InteractiveTechLogos } from './InteractiveTechLogos';
import { useWarp } from '@/context/WarpContext';

const MAX_WARP_SPEED = 2.5;

function CameraController() {
  const { camera } = useThree();
  const { warpSpeed } = useWarp();
  const targetX = useRef(0);
  const targetY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      targetX.current = (event.clientX / window.innerWidth - 0.5) * 0.5;
      targetY.current = (event.clientY / window.innerHeight - 0.5) * 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    const perspCamera = camera as THREE.PerspectiveCamera;

    // Adjust FOV based on warp
    const targetFOV = warpSpeed > 0.01 ? 75 + warpSpeed * 25 : 75;
    perspCamera.fov += (targetFOV - perspCamera.fov) * (warpSpeed > 0.01 ? 0.1 : 0.05);
    perspCamera.updateProjectionMatrix();

    // Mouse parallax effect (reduced during warp)
    const mouseInfluence = 1 - (warpSpeed / MAX_WARP_SPEED) * 0.8;
    camera.position.x += (targetX.current * mouseInfluence - camera.position.x) * 0.05;
    camera.position.y += (-targetY.current * mouseInfluence - camera.position.y) * 0.05;
    camera.lookAt(new THREE.Vector3(0, 0, -10));
  });

  return null;
}

interface SceneContentProps {
  onLogoHover: (name: string | null, event?: { clientX: number; clientY: number }) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

function SceneContent({ onLogoHover, onDragStart, onDragEnd }: SceneContentProps) {
  return (
    <>
      <CameraController />
      <FloatingParticles />
      <WarpEffect />
      <InteractiveTechLogos
        onHover={onLogoHover}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    </>
  );
}

interface SceneProps {
  onLogoHover: (name: string | null, event?: { clientX: number; clientY: number }) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export function Scene({ onLogoHover, onDragStart, onDragEnd }: SceneProps) {
  return (
    <div id="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 75, near: 0.1, far: 1000 }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <SceneContent
          onLogoHover={onLogoHover}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      </Canvas>
    </div>
  );
}
