import * as THREE from 'three';

export interface TechLogoConfig {
  name: string;
  type: 'vue' | 'torusknot' | 'angular' | 'python' | 'dotnet' | 'sql' | 'typescript' | 'azure' | 'decorative-torus' | 'decorative-ico';
  position: [number, number, number];
  scale: number;
  rotation?: [number, number, number];
  baseOpacity: number;
  hoverOpacity: number;
  baseColor: number;
  hoverColor: number;
  rotationSpeed: { x: number; y: number };
  wanderSpeed: number;
  wanderRadius: number;
  wanderFreqX: number;
  wanderFreqX2: number;
  wanderFreqY: number;
  wanderFreqY2: number;
  wanderFreqZ: number;
  floatSpeed: number;
  wireframe?: boolean;
}

export const techLogosConfig: TechLogoConfig[] = [
  // Vue.js - Green V shape
  {
    name: 'Vue.js',
    type: 'vue',
    position: [-7, 3, -4],
    scale: 0.8,
    rotation: [0, 0, Math.PI],
    baseOpacity: 0.15,
    hoverOpacity: 0.4,
    baseColor: 0x42b883,
    hoverColor: 0x42b883,
    rotationSpeed: { x: 0.002, y: 0.003 },
    wanderSpeed: 0.8,
    wanderRadius: 2.5,
    wanderFreqX: 1.0,
    wanderFreqX2: 0.6,
    wanderFreqY: 0.7,
    wanderFreqY2: 0.4,
    wanderFreqZ: 0.3,
    floatSpeed: 0.4,
  },
  // Visual Studio - Purple torus knot
  {
    name: 'Visual Studio',
    type: 'torusknot',
    position: [8, 4, -6],
    scale: 0.7,
    baseOpacity: 0.12,
    hoverOpacity: 0.35,
    baseColor: 0x854cc7,
    hoverColor: 0xb97eff,
    rotationSpeed: { x: 0.003, y: 0.002 },
    wanderSpeed: 0.5,
    wanderRadius: 3,
    wanderFreqX: 0.8,
    wanderFreqX2: 1.2,
    wanderFreqY: 0.5,
    wanderFreqY2: 0.9,
    wanderFreqZ: 0.4,
    floatSpeed: 0.5,
    wireframe: true,
  },
  // Angular - Red shield/A shape
  {
    name: 'Angular',
    type: 'angular',
    position: [6, -3, -3],
    scale: 0.6,
    baseOpacity: 0.15,
    hoverOpacity: 0.4,
    baseColor: 0xdd0031,
    hoverColor: 0xff4057,
    rotationSpeed: { x: 0.002, y: 0.004 },
    wanderSpeed: 1.2,
    wanderRadius: 2,
    wanderFreqX: 1.3,
    wanderFreqX2: 0.4,
    wanderFreqY: 0.9,
    wanderFreqY2: 0.6,
    wanderFreqZ: 0.5,
    floatSpeed: 0.45,
  },
  // Python - Blue/Yellow double helix
  {
    name: 'Python',
    type: 'python',
    position: [-9, 0, -5],
    scale: 0.9,
    baseOpacity: 0.2,
    hoverOpacity: 0.5,
    baseColor: 0x3776ab,
    hoverColor: 0x4b8bbe,
    rotationSpeed: { x: 0.001, y: 0.005 },
    wanderSpeed: 0.6,
    wanderRadius: 2.8,
    wanderFreqX: 0.7,
    wanderFreqX2: 1.1,
    wanderFreqY: 0.4,
    wanderFreqY2: 0.8,
    wanderFreqZ: 0.25,
    floatSpeed: 0.35,
  },
  // .NET - Purple dot + wireframe icosahedron
  {
    name: '.NET',
    type: 'dotnet',
    position: [0, 5, -7],
    scale: 1.2,
    baseOpacity: 0.2,
    hoverOpacity: 0.5,
    baseColor: 0x512bd4,
    hoverColor: 0x7b5cd6,
    rotationSpeed: { x: 0.003, y: 0.002 },
    wanderSpeed: 0.4,
    wanderRadius: 3.5,
    wanderFreqX: 0.9,
    wanderFreqX2: 0.5,
    wanderFreqY: 0.3,
    wanderFreqY2: 0.7,
    wanderFreqZ: 0.2,
    floatSpeed: 0.5,
  },
  // SQL Server - Orange stacked cylinders
  {
    name: 'SQL Server',
    type: 'sql',
    position: [10, 0, -5],
    scale: 0.9,
    baseOpacity: 0.15,
    hoverOpacity: 0.4,
    baseColor: 0xf29111,
    hoverColor: 0xffaa33,
    rotationSpeed: { x: 0.001, y: 0.004 },
    wanderSpeed: 0.7,
    wanderRadius: 2.2,
    wanderFreqX: 1.1,
    wanderFreqX2: 0.8,
    wanderFreqY: 0.6,
    wanderFreqY2: 1.0,
    wanderFreqZ: 0.35,
    floatSpeed: 0.4,
  },
  // TypeScript - Blue square with T
  {
    name: 'TypeScript',
    type: 'typescript',
    position: [-6, -4, -4],
    scale: 0.8,
    baseOpacity: 0.15,
    hoverOpacity: 0.4,
    baseColor: 0x3178c6,
    hoverColor: 0x5a9bd5,
    rotationSpeed: { x: 0.002, y: 0.003 },
    wanderSpeed: 0.9,
    wanderRadius: 2.3,
    wanderFreqX: 0.6,
    wanderFreqX2: 1.0,
    wanderFreqY: 0.8,
    wanderFreqY2: 0.5,
    wanderFreqZ: 0.4,
    floatSpeed: 0.38,
  },
  // Azure - Blue wireframe icosahedron
  {
    name: 'Azure',
    type: 'azure',
    position: [0, -4, -5],
    scale: 1,
    baseOpacity: 0.12,
    hoverOpacity: 0.35,
    baseColor: 0x0089d6,
    hoverColor: 0x00b4ff,
    rotationSpeed: { x: 0.003, y: 0.002 },
    wanderSpeed: 0.55,
    wanderRadius: 3,
    wanderFreqX: 1.2,
    wanderFreqX2: 0.7,
    wanderFreqY: 0.5,
    wanderFreqY2: 0.3,
    wanderFreqZ: 0.45,
    floatSpeed: 0.42,
  },
  // Decorative torus knot
  {
    name: '',
    type: 'decorative-torus',
    position: [12, 3, -12],
    scale: 1,
    baseOpacity: 0.05,
    hoverOpacity: 0.15,
    baseColor: 0xa855f7,
    hoverColor: 0x00ffd5,
    rotationSpeed: { x: 0.001, y: 0.002 },
    wanderSpeed: 0.3,
    wanderRadius: 2.5,
    wanderFreqX: 0.5,
    wanderFreqX2: 0.9,
    wanderFreqY: 0.4,
    wanderFreqY2: 0.6,
    wanderFreqZ: 0.2,
    floatSpeed: 0.3,
    wireframe: true,
  },
  // Decorative icosahedron
  {
    name: '',
    type: 'decorative-ico',
    position: [-12, -2, -10],
    scale: 1,
    baseOpacity: 0.06,
    hoverOpacity: 0.18,
    baseColor: 0x00ffd5,
    hoverColor: 0xa855f7,
    rotationSpeed: { x: 0.002, y: 0.001 },
    wanderSpeed: 0.35,
    wanderRadius: 3,
    wanderFreqX: 0.8,
    wanderFreqX2: 0.4,
    wanderFreqY: 0.6,
    wanderFreqY2: 0.9,
    wanderFreqZ: 0.3,
    floatSpeed: 0.32,
    wireframe: true,
  },
];

// Helper function to create Vue.js V-shape geometry
export function createVueGeometry(): THREE.ExtrudeGeometry {
  const points: [number, number][] = [
    [0, 1.5], [-1.3, -0.8], [-0.8, -0.8], [0, 0.5], [0.8, -0.8], [1.3, -0.8]
  ];

  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i][0], points[i][1]);
  }
  shape.closePath();

  return new THREE.ExtrudeGeometry(shape, {
    steps: 1,
    depth: 0.1,
    bevelEnabled: false,
  });
}

// Helper function to create Angular shield/A geometry
export function createAngularGeometry(): THREE.ExtrudeGeometry {
  const points: [number, number][] = [
    [0, 1.6], [-1.2, -1.2], [-0.7, -1.2], [0, 0.3], [0.7, -1.2], [1.2, -1.2]
  ];

  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i][0], points[i][1]);
  }
  shape.closePath();

  return new THREE.ExtrudeGeometry(shape, {
    steps: 1,
    depth: 0.12,
    bevelEnabled: false,
  });
}

// Helper function to create Python helix curves
export function createPythonHelixCurves(): { curve1: THREE.CatmullRomCurve3; curve2: THREE.CatmullRomCurve3 } {
  const helixTurns = 2;
  const helixHeight = 2;
  const helixRadius = 0.5;

  const curve1Points: THREE.Vector3[] = [];
  const curve2Points: THREE.Vector3[] = [];

  for (let i = 0; i <= 50; i++) {
    const t = i / 50;
    const angle = t * Math.PI * 2 * helixTurns;
    const y = (t - 0.5) * helixHeight;

    curve1Points.push(new THREE.Vector3(
      Math.cos(angle) * helixRadius,
      y,
      Math.sin(angle) * helixRadius
    ));

    curve2Points.push(new THREE.Vector3(
      Math.cos(angle + Math.PI) * helixRadius,
      y,
      Math.sin(angle + Math.PI) * helixRadius
    ));
  }

  return {
    curve1: new THREE.CatmullRomCurve3(curve1Points),
    curve2: new THREE.CatmullRomCurve3(curve2Points),
  };
}
