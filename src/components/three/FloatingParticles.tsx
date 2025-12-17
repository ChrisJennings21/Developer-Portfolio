import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWarp } from '@/context/WarpContext';

const PARTICLE_COUNT = 2000;

export function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const { warpSpeed, isWarping } = useWarp();

  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT * 3; i += 3) {
      const radius = 2 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;

      positions[i] = Math.cos(theta) * radius;
      positions[i + 1] = Math.sin(theta) * radius;
      positions[i + 2] = (Math.random() - 0.5) * 40;

      velocities[i] = (Math.random() - 0.5) * 0.005;
      velocities[i + 1] = (Math.random() - 0.5) * 0.005;
      velocities[i + 2] = (Math.random() - 0.5) * 0.005;

      // Color distribution: cyan (50%), purple (30%), white (20%)
      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        colors[i] = 0;
        colors[i + 1] = 1;
        colors[i + 2] = 0.83;
      } else if (colorChoice < 0.8) {
        colors[i] = 0.66;
        colors[i + 1] = 0.33;
        colors[i + 2] = 0.97;
      } else {
        colors[i] = 1;
        colors[i + 1] = 1;
        colors[i + 2] = 1;
      }
    }

    return { positions, velocities, colors };
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;

    const geometry = pointsRef.current.geometry;
    const positionAttr = geometry.attributes.position;
    const posArray = positionAttr.array as Float32Array;
    const material = pointsRef.current.material as THREE.PointsMaterial;

    if (isWarping || warpSpeed > 0.01) {
      // Warp mode - particles rush toward camera
      material.size = 0.03 + warpSpeed * 0.02;

      for (let i = 0; i < PARTICLE_COUNT * 3; i += 3) {
        posArray[i + 2] += warpSpeed * 0.8;
        if (posArray[i + 2] > 20) {
          posArray[i + 2] = -20;
          const radius = 2 + Math.random() * 12;
          const theta = Math.random() * Math.PI * 2;
          posArray[i] = Math.cos(theta) * radius;
          posArray[i + 1] = Math.sin(theta) * radius;
        }
      }
    } else {
      // Normal mode - gentle floating motion
      material.size = 0.03;
      pointsRef.current.rotation.y += 0.0003;
      pointsRef.current.rotation.x += 0.0001;

      for (let i = 0; i < PARTICLE_COUNT * 3; i += 3) {
        posArray[i] += velocities[i];
        posArray[i + 1] += velocities[i + 1];
        posArray[i + 2] += velocities[i + 2];

        // Bounce off boundaries
        if (Math.abs(posArray[i]) > 12) velocities[i] *= -1;
        if (Math.abs(posArray[i + 1]) > 12) velocities[i + 1] *= -1;
        if (Math.abs(posArray[i + 2]) > 20) velocities[i + 2] *= -1;
      }
    }

    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
