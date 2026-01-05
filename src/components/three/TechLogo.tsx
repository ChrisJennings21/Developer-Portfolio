import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  TechLogoConfig,
  createVueGeometry,
  createAngularGeometry
} from '@/data/techLogos';

interface TechLogoProps {
  config: TechLogoConfig;
  isHovered: boolean;
  isDragging: boolean;
}

interface UserData {
  name: string;
  baseOpacity: number;
  hoverOpacity: number;
  baseColor: number;
  hoverColor: number;
  baseScale: number;
  rotationSpeed: { x: number; y: number };
  originalPosition: THREE.Vector3;
  originalRotation: THREE.Euler;
  spinBoost: number;
  wanderAngle: number;
  wanderSpeed: number;
  wanderRadius: number;
  wanderFreqX: number;
  wanderFreqX2: number;
  wanderFreqY: number;
  wanderFreqY2: number;
  wanderFreqZ: number;
  floatOffset: number;
  floatSpeed: number;
  isGroup?: boolean;
  materials?: THREE.Material[];
}

export function TechLogo({ config, isHovered, isDragging }: TechLogoProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialsRef = useRef<THREE.Material[]>([]);

  const userData: UserData = useMemo(() => ({
    name: config.name,
    baseOpacity: config.baseOpacity,
    hoverOpacity: config.hoverOpacity,
    baseColor: config.baseColor,
    hoverColor: config.hoverColor,
    baseScale: config.scale,
    rotationSpeed: config.rotationSpeed,
    originalPosition: new THREE.Vector3(...config.position),
    originalRotation: new THREE.Euler(...(config.rotation || [0, 0, 0])),
    spinBoost: 0,
    wanderAngle: Math.random() * Math.PI * 2,
    wanderSpeed: config.wanderSpeed,
    wanderRadius: config.wanderRadius,
    wanderFreqX: config.wanderFreqX,
    wanderFreqX2: config.wanderFreqX2,
    wanderFreqY: config.wanderFreqY,
    wanderFreqY2: config.wanderFreqY2,
    wanderFreqZ: config.wanderFreqZ,
    floatOffset: Math.random() * Math.PI * 2,
    floatSpeed: config.floatSpeed,
  }), [config]);

  // Set userData on the group when it mounts
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.userData = userData;
    }
  }, [userData]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const data = groupRef.current.userData as UserData;
    if (!data || !data.rotationSpeed) return;

    const time = state.clock.getElapsedTime();

    // Hover effects
    const targetOpacity = isHovered ? data.hoverOpacity : data.baseOpacity;
    const targetScale = isHovered ? data.baseScale * 1.2 : data.baseScale;

    // Update materials
    materialsRef.current.forEach((mat) => {
      if (mat instanceof THREE.MeshBasicMaterial) {
        mat.opacity += (targetOpacity - mat.opacity) * 0.1;

        // Color transition for non-group meshes
        if (!data.isGroup) {
          const targetColor = new THREE.Color(isHovered ? data.hoverColor : data.baseColor);
          mat.color.lerp(targetColor, 0.05);
        }
      }
    });

    // Smooth scale transitions
    const currentScale = groupRef.current.scale.x;
    const newScale = currentScale + (targetScale - currentScale) * 0.1;
    groupRef.current.scale.set(newScale, newScale, newScale);

    // Rotation with spin boost
    const spinMultiplier = 1 + data.spinBoost;
    groupRef.current.rotation.x += data.rotationSpeed.x * spinMultiplier;
    groupRef.current.rotation.y += data.rotationSpeed.y * spinMultiplier;

    // Decay spin boost
    data.spinBoost *= 0.98;

    // Wandering movement (only when not being dragged)
    if (!isDragging) {
      // Update wander angle slowly
      data.wanderAngle += 0.0008 * data.wanderSpeed;

      // Calculate offsets using unique frequencies
      const wanderX = (
        Math.sin(data.wanderAngle * data.wanderFreqX) +
        Math.sin(data.wanderAngle * data.wanderFreqX2) * 0.5
      ) * data.wanderRadius;

      const wanderY = (
        Math.sin(data.wanderAngle * data.wanderFreqY) +
        Math.cos(data.wanderAngle * data.wanderFreqY2) * 0.3
      ) * data.wanderRadius * 0.5;

      const wanderZ = Math.sin(data.wanderAngle * data.wanderFreqZ) * data.wanderRadius * 0.4;

      // Smooth interpolation to target
      const targetPosX = data.originalPosition.x + wanderX;
      const targetPosY = data.originalPosition.y + wanderY;
      const targetPosZ = data.originalPosition.z + wanderZ;

      groupRef.current.position.x += (targetPosX - groupRef.current.position.x) * 0.015;
      groupRef.current.position.y += (targetPosY - groupRef.current.position.y) * 0.015;
      groupRef.current.position.z += (targetPosZ - groupRef.current.position.z) * 0.015;

      // Additional gentle vertical float
      const floatY = Math.sin(time * data.floatSpeed * 0.5 + data.floatOffset) * 0.15;
      groupRef.current.position.y += floatY;
    }
  });

  const renderLogo = () => {
    switch (config.type) {
      case 'vue':
        return <VueLogo config={config} materialsRef={materialsRef} />;
      case 'torusknot':
        return <TorusKnotLogo config={config} materialsRef={materialsRef} />;
      case 'angular':
        return <AngularLogo config={config} materialsRef={materialsRef} />;
      case 'python':
        return <PythonLogo config={config} materialsRef={materialsRef} />;
      case 'dotnet':
        return <DotNetLogo config={config} materialsRef={materialsRef} />;
      case 'sql':
        return <SQLLogo config={config} materialsRef={materialsRef} />;
      case 'typescript':
        return <TypeScriptLogo config={config} materialsRef={materialsRef} />;
      case 'azure':
        return <AzureLogo config={config} materialsRef={materialsRef} />;
      case 'decorative-torus':
        return <DecorativeTorusLogo config={config} materialsRef={materialsRef} />;
      case 'decorative-ico':
        return <DecorativeIcoLogo config={config} materialsRef={materialsRef} />;
      default:
        return null;
    }
  };

  return (
    <group
      ref={groupRef}
      position={config.position}
      scale={config.scale}
      rotation={config.rotation || [0, 0, 0]}
    >
      {renderLogo()}
    </group>
  );
}

// Vue.js V-shape logo
function VueLogo({ config, materialsRef }: { config: TechLogoConfig; materialsRef: React.MutableRefObject<THREE.Material[]> }) {
  const geometry = useMemo(() => createVueGeometry(), []);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        ref={(mat) => { if (mat) materialsRef.current = [mat]; }}
        color={config.baseColor}
        transparent
        opacity={config.baseOpacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Visual Studio - two interlocking angular ribbon pieces
function TorusKnotLogo({ config, materialsRef }: { config: TechLogoConfig; materialsRef: React.MutableRefObject<THREE.Material[]> }) {
  // Create triangular/arrow shaped ribbon geometry
  const createRibbonShape = useMemo(() => {
    const shape = new THREE.Shape();
    // Arrow/boomerang shape pointing right
    shape.moveTo(0, 0.08);
    shape.lineTo(0.8, 0.5);
    shape.lineTo(0.8, 0.35);
    shape.lineTo(0.15, 0);
    shape.lineTo(0.8, -0.35);
    shape.lineTo(0.8, -0.5);
    shape.lineTo(0, -0.08);
    shape.lineTo(0, 0.08);
    return shape;
  }, []);

  const extrudeSettings = {
    steps: 1,
    depth: 0.15,
    bevelEnabled: false,
  };

  return (
    <>
      {/* Left ribbon piece - darker purple */}
      <mesh position={[-0.35, 0, 0.08]} rotation={[0, 0, 0]}>
        <extrudeGeometry args={[createRibbonShape, extrudeSettings]} />
        <meshBasicMaterial
          ref={(mat) => { if (mat) materialsRef.current[0] = mat; }}
          color={0x68217a}
          transparent
          opacity={config.baseOpacity * 1.8}
        />
      </mesh>
      {/* Right ribbon piece - lighter purple, rotated 180 */}
      <mesh position={[0.35, 0, -0.08]} rotation={[0, Math.PI, 0]}>
        <extrudeGeometry args={[createRibbonShape, extrudeSettings]} />
        <meshBasicMaterial
          ref={(mat) => { if (mat) materialsRef.current[1] = mat; }}
          color={0x9b4dca}
          transparent
          opacity={config.baseOpacity * 1.8}
        />
      </mesh>
    </>
  );
}

// Angular shield/A shape
function AngularLogo({ config, materialsRef }: { config: TechLogoConfig; materialsRef: React.MutableRefObject<THREE.Material[]> }) {
  const geometry = useMemo(() => createAngularGeometry(), []);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        ref={(mat) => { if (mat) materialsRef.current = [mat]; }}
        color={config.baseColor}
        transparent
        opacity={config.baseOpacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Python logo - stylized double helix DNA-like structure
function PythonLogo({ config, materialsRef }: { config: TechLogoConfig; materialsRef: React.MutableRefObject<THREE.Material[]> }) {
  // Create a proper intertwined helix effect with torus segments
  const segments = 8;
  const helixRadius = 0.4;
  const helixHeight = 1.6;

  return (
    <>
      {/* Blue helix strand */}
      {Array.from({ length: segments }).map((_, i) => {
        const t = i / (segments - 1);
        const angle = t * Math.PI * 2;
        const y = (t - 0.5) * helixHeight;
        const x = Math.cos(angle) * helixRadius;
        const z = Math.sin(angle) * helixRadius;
        return (
          <mesh key={`blue-${i}`} position={[x, y, z]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial
              ref={(mat) => { if (mat && i === 0) materialsRef.current[0] = mat; }}
              color={0x3776ab}
              transparent
              opacity={config.baseOpacity * 1.2}
            />
          </mesh>
        );
      })}

      {/* Yellow helix strand (offset by PI) */}
      {Array.from({ length: segments }).map((_, i) => {
        const t = i / (segments - 1);
        const angle = t * Math.PI * 2 + Math.PI;
        const y = (t - 0.5) * helixHeight;
        const x = Math.cos(angle) * helixRadius;
        const z = Math.sin(angle) * helixRadius;
        return (
          <mesh key={`yellow-${i}`} position={[x, y, z]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial
              ref={(mat) => { if (mat && i === 0) materialsRef.current[1] = mat; }}
              color={0xffd43b}
              transparent
              opacity={config.baseOpacity * 1.2}
            />
          </mesh>
        );
      })}

      {/* Connecting bars between strands */}
      {Array.from({ length: 4 }).map((_, i) => {
        const t = (i + 0.5) / 4;
        const y = (t - 0.5) * helixHeight;
        return (
          <mesh key={`bar-${i}`} position={[0, y, 0]} rotation={[0, t * Math.PI * 2, 0]}>
            <boxGeometry args={[helixRadius * 2, 0.06, 0.06]} />
            <meshBasicMaterial
              color={0x888888}
              transparent
              opacity={config.baseOpacity * 0.6}
            />
          </mesh>
        );
      })}
    </>
  );
}

// .NET dot + net (icosahedron)
function DotNetLogo({ config, materialsRef }: { config: TechLogoConfig; materialsRef: React.MutableRefObject<THREE.Material[]> }) {
  return (
    <>
      <mesh position={[-0.6, 0, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial
          ref={(mat) => { if (mat) materialsRef.current[0] = mat; }}
          color={config.baseColor}
          transparent
          opacity={config.baseOpacity * 1.25}
        />
      </mesh>
      <mesh position={[0.4, 0, 0]}>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshBasicMaterial
          ref={(mat) => { if (mat) materialsRef.current[1] = mat; }}
          color={config.baseColor}
          wireframe
          transparent
          opacity={config.baseOpacity}
        />
      </mesh>
    </>
  );
}

// SQL Server stacked cylinders
function SQLLogo({ config, materialsRef }: { config: TechLogoConfig; materialsRef: React.MutableRefObject<THREE.Material[]> }) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, i * 0.3 - 0.3, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.25, 16, 1, true]} />
          <meshBasicMaterial
            ref={(mat) => { if (mat) materialsRef.current[i] = mat; }}
            color={config.baseColor}
            wireframe
            transparent
            opacity={config.baseOpacity}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 16]} />
        <meshBasicMaterial
          ref={(mat) => { if (mat) materialsRef.current[3] = mat; }}
          color={config.baseColor}
          transparent
          opacity={config.baseOpacity * 0.67}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

// TypeScript - blue square with white TS on both sides
function TypeScriptLogo({ config, materialsRef }: { config: TechLogoConfig; materialsRef: React.MutableRefObject<THREE.Material[]> }) {
  const letterOpacity = config.baseOpacity * 3;

  // Renders TS letters at a given z offset
  const renderLetters = (zOffset: number, keyPrefix: string) => (
    <>
      {/* T - vertical */}
      <mesh key={`${keyPrefix}-t-vert`} position={[-0.25, -0.1, zOffset]}>
        <boxGeometry args={[0.15, 0.6, 0.1]} />
        <meshBasicMaterial color={0xffffff} transparent opacity={letterOpacity} />
      </mesh>
      {/* T - horizontal */}
      <mesh key={`${keyPrefix}-t-horiz`} position={[-0.25, 0.25, zOffset]}>
        <boxGeometry args={[0.45, 0.15, 0.1]} />
        <meshBasicMaterial color={0xffffff} transparent opacity={letterOpacity} />
      </mesh>
      {/* S - top */}
      <mesh key={`${keyPrefix}-s-top`} position={[0.25, 0.25, zOffset]}>
        <boxGeometry args={[0.35, 0.12, 0.1]} />
        <meshBasicMaterial color={0xffffff} transparent opacity={letterOpacity} />
      </mesh>
      {/* S - middle */}
      <mesh key={`${keyPrefix}-s-mid`} position={[0.25, 0, zOffset]}>
        <boxGeometry args={[0.35, 0.12, 0.1]} />
        <meshBasicMaterial color={0xffffff} transparent opacity={letterOpacity} />
      </mesh>
      {/* S - bottom */}
      <mesh key={`${keyPrefix}-s-bot`} position={[0.25, -0.25, zOffset]}>
        <boxGeometry args={[0.35, 0.12, 0.1]} />
        <meshBasicMaterial color={0xffffff} transparent opacity={letterOpacity} />
      </mesh>
      {/* S - top-left vertical */}
      <mesh key={`${keyPrefix}-s-tl`} position={[0.1, 0.125, zOffset]}>
        <boxGeometry args={[0.12, 0.25, 0.1]} />
        <meshBasicMaterial color={0xffffff} transparent opacity={letterOpacity} />
      </mesh>
      {/* S - bottom-right vertical */}
      <mesh key={`${keyPrefix}-s-br`} position={[0.4, -0.125, zOffset]}>
        <boxGeometry args={[0.12, 0.25, 0.1]} />
        <meshBasicMaterial color={0xffffff} transparent opacity={letterOpacity} />
      </mesh>
    </>
  );

  return (
    <>
      {/* Blue background square - solid, not transparent */}
      <mesh>
        <boxGeometry args={[1.4, 1.4, 0.1]} />
        <meshBasicMaterial
          ref={(mat) => { if (mat) materialsRef.current[0] = mat; }}
          color={config.baseColor}
        />
      </mesh>

      {/* Front letters */}
      {renderLetters(0.1, 'front')}

      {/* Back letters (mirrored by flipping x positions) */}
      <group scale={[-1, 1, 1]}>
        {renderLetters(-0.1, 'back')}
      </group>
    </>
  );
}

// Azure wireframe icosahedron
function AzureLogo({ config, materialsRef }: { config: TechLogoConfig; materialsRef: React.MutableRefObject<THREE.Material[]> }) {
  return (
    <mesh>
      <icosahedronGeometry args={[0.9, 1]} />
      <meshBasicMaterial
        ref={(mat) => { if (mat) materialsRef.current = [mat]; }}
        color={config.baseColor}
        wireframe
        transparent
        opacity={config.baseOpacity}
      />
    </mesh>
  );
}

// Decorative torus knot
function DecorativeTorusLogo({ config, materialsRef }: { config: TechLogoConfig; materialsRef: React.MutableRefObject<THREE.Material[]> }) {
  return (
    <mesh>
      <torusKnotGeometry args={[2, 0.3, 100, 12]} />
      <meshBasicMaterial
        ref={(mat) => { if (mat) materialsRef.current = [mat]; }}
        color={config.baseColor}
        wireframe
        transparent
        opacity={config.baseOpacity}
      />
    </mesh>
  );
}

// Decorative icosahedron
function DecorativeIcoLogo({ config, materialsRef }: { config: TechLogoConfig; materialsRef: React.MutableRefObject<THREE.Material[]> }) {
  return (
    <mesh>
      <icosahedronGeometry args={[1.8, 1]} />
      <meshBasicMaterial
        ref={(mat) => { if (mat) materialsRef.current = [mat]; }}
        color={config.baseColor}
        wireframe
        transparent
        opacity={config.baseOpacity}
      />
    </mesh>
  );
}
