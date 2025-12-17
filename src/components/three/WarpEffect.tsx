import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWarp } from '@/context/WarpContext';

const STREAK_COUNT = 300;
const RING_COUNT = 8;
const MAX_WARP_SPEED = 2.5;

interface StreakData {
  x: number;
  y: number;
  z: number;
  baseZ: number;
  speed: number;
}

export function WarpEffect() {
  const streaksRef = useRef<THREE.LineSegments>(null);
  const ringsRef = useRef<(THREE.Mesh | null)[]>([]);
  const { warpSpeed, isWarping } = useWarp();

  const { streakPositions, streakColors, streakData } = useMemo(() => {
    const positions = new Float32Array(STREAK_COUNT * 6);
    const colors = new Float32Array(STREAK_COUNT * 6);
    const data: StreakData[] = [];

    for (let i = 0; i < STREAK_COUNT; i++) {
      const radius = 1 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;
      const z = (Math.random() - 0.5) * 30;

      data.push({ x, y, z, baseZ: z, speed: 0.5 + Math.random() * 1.5 });

      const idx = i * 6;
      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;
      positions[idx + 3] = x;
      positions[idx + 4] = y;
      positions[idx + 5] = z;

      // Color distribution: cyan (60%), purple (25%), white (15%)
      const colorChoice = Math.random();
      let r: number, g: number, b: number;
      if (colorChoice < 0.6) {
        r = 0; g = 1; b = 0.83;
      } else if (colorChoice < 0.85) {
        r = 0.66; g = 0.33; b = 0.97;
      } else {
        r = 1; g = 1; b = 1;
      }

      colors[idx] = r; colors[idx + 1] = g; colors[idx + 2] = b;
      colors[idx + 3] = r; colors[idx + 4] = g; colors[idx + 5] = b;
    }

    return { streakPositions: positions, streakColors: colors, streakData: data };
  }, []);

  useFrame(() => {
    if (!streaksRef.current) return;

    const streakGeom = streaksRef.current.geometry;
    const posAttr = streakGeom.attributes.position;
    const posArray = posAttr.array as Float32Array;
    const material = streaksRef.current.material as THREE.LineBasicMaterial;

    if (isWarping || warpSpeed > 0.01) {
      material.opacity = Math.min((warpSpeed / MAX_WARP_SPEED) * 0.8, 0.8);

      for (let i = 0; i < STREAK_COUNT; i++) {
        const streak = streakData[i];
        const idx = i * 6;

        streak.z += warpSpeed * streak.speed;

        if (streak.z > 15) {
          streak.z = -15;
          const radius = 1 + Math.random() * 10;
          const theta = Math.random() * Math.PI * 2;
          streak.x = Math.cos(theta) * radius;
          streak.y = Math.sin(theta) * radius;
        }

        // Tail position (behind)
        posArray[idx] = streak.x;
        posArray[idx + 1] = streak.y;
        posArray[idx + 2] = streak.z - warpSpeed * streak.speed * 3;

        // Head position (current)
        posArray[idx + 3] = streak.x;
        posArray[idx + 4] = streak.y;
        posArray[idx + 5] = streak.z;
      }

      posAttr.needsUpdate = true;

      // Update rings
      ringsRef.current.forEach((ring, i) => {
        if (!ring) return;
        const ringMat = ring.material as THREE.MeshBasicMaterial;
        ringMat.opacity = Math.min((warpSpeed / MAX_WARP_SPEED) * 0.15, 0.15);
        ring.position.z += warpSpeed * 2;
        ring.rotation.z += warpSpeed * 0.05;
        if (ring.position.z > 10) ring.position.z = -50;
        const scale = 1 + Math.sin(Date.now() * 0.005 + i) * 0.1 * warpSpeed;
        ring.scale.set(scale, scale, 1);
      });
    } else {
      material.opacity *= 0.9;
      ringsRef.current.forEach((ring) => {
        if (!ring) return;
        const ringMat = ring.material as THREE.MeshBasicMaterial;
        ringMat.opacity *= 0.9;
      });
    }
  });

  return (
    <>
      {/* Warp streak lines */}
      <lineSegments ref={streaksRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[streakPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[streakColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Tunnel rings */}
      {Array.from({ length: RING_COUNT }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { ringsRef.current[i] = el; }}
          position={[0, 0, -20 - i * 8]}
        >
          <ringGeometry args={[8, 8.1, 64]} />
          <meshBasicMaterial
            color={0x00ffd5}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
}
