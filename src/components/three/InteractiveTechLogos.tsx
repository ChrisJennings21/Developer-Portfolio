import { useRef, useState, useCallback, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { TechLogo } from './TechLogo';
import { techLogosConfig } from '@/data/techLogos';

interface InteractiveTechLogosProps {
  onHover: (name: string | null, event?: { clientX: number; clientY: number }) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export function InteractiveTechLogos({ onHover, onDragStart, onDragEnd }: InteractiveTechLogosProps) {
  const { camera, gl } = useThree();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const logoRefs = useRef<(THREE.Group | null)[]>([]);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const dragOffset = useRef(new THREE.Vector3());
  const lastClickTime = useRef<number>(0);

  // Get interactive objects
  const getInteractiveObjects = useCallback(() => {
    return logoRefs.current.filter((ref): ref is THREE.Group => ref !== null);
  }, []);

  // Find parent with userData.name
  const findInteractiveParent = useCallback((object: THREE.Object3D | null): THREE.Group | null => {
    let current = object;
    while (current) {
      if (current.userData.name !== undefined && logoRefs.current.includes(current as THREE.Group)) {
        return current as THREE.Group;
      }
      current = current.parent;
    }
    return null;
  }, []);

  // Handle mouse move
  const handlePointerMove = useCallback((event: PointerEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Handle dragging
    if (isDragging && selectedIndex !== null) {
      const selectedObj = logoRefs.current[selectedIndex];
      if (!selectedObj) return;

      raycaster.current.setFromCamera(mouse.current, camera);
      const planeZ = selectedObj.position.z;
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -planeZ);
      const intersection = new THREE.Vector3();
      raycaster.current.ray.intersectPlane(plane, intersection);

      if (intersection) {
        selectedObj.position.x = intersection.x + dragOffset.current.x;
        selectedObj.position.y = intersection.y + dragOffset.current.y;
      }

      // Update tooltip position during drag
      onHover(selectedObj.userData.name || null, { clientX: event.clientX, clientY: event.clientY });
      return;
    }

    // Raycast for hover detection
    raycaster.current.setFromCamera(mouse.current, camera);
    const interactiveObjects = getInteractiveObjects();
    const intersects = raycaster.current.intersectObjects(interactiveObjects, true);

    let hitObject: THREE.Group | null = null;
    if (intersects.length > 0) {
      hitObject = findInteractiveParent(intersects[0].object);
    }

    if (hitObject) {
      const index = logoRefs.current.indexOf(hitObject);
      if (index !== hoveredIndex) {
        setHoveredIndex(index);
        onHover(hitObject.userData.name || null, { clientX: event.clientX, clientY: event.clientY });
        gl.domElement.style.cursor = 'grab';
      } else {
        // Update tooltip position
        onHover(hitObject.userData.name || null, { clientX: event.clientX, clientY: event.clientY });
      }
    } else if (hoveredIndex !== null) {
      setHoveredIndex(null);
      onHover(null);
      gl.domElement.style.cursor = 'default';
    }
  }, [camera, gl, isDragging, selectedIndex, hoveredIndex, getInteractiveObjects, findInteractiveParent, onHover]);

  // Handle pointer down
  const handlePointerDown = useCallback((event: PointerEvent) => {
    if (hoveredIndex === null) return;

    const hoveredObj = logoRefs.current[hoveredIndex];
    if (!hoveredObj) return;

    event.preventDefault();

    // Check for double click
    const now = Date.now();
    if (now - lastClickTime.current < 300 && selectedIndex === hoveredIndex) {
      // Double click - reset to original position
      const userData = hoveredObj.userData;
      userData.spinBoost = 0.2;

      const originalPos = userData.originalPosition as THREE.Vector3;
      const startPos = hoveredObj.position.clone();
      const startTime = Date.now();
      const duration = 800;

      const obj = hoveredObj;
      function animateBack() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        obj.position.lerpVectors(startPos, originalPos, eased);

        if (progress < 1) {
          requestAnimationFrame(animateBack);
        }
      }
      animateBack();

      lastClickTime.current = 0;
      return;
    }

    lastClickTime.current = now;

    // Start dragging
    setSelectedIndex(hoveredIndex);
    setIsDragging(true);
    onDragStart();
    document.body.classList.add('dragging-3d');
    gl.domElement.style.cursor = 'grabbing';
    // Keep tooltip visible during drag with current position
    onHover(hoveredObj.userData.name || null, { clientX: event.clientX, clientY: event.clientY });

    // Calculate drag offset
    raycaster.current.setFromCamera(mouse.current, camera);
    const planeZ = hoveredObj.position.z;
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -planeZ);
    const intersection = new THREE.Vector3();
    raycaster.current.ray.intersectPlane(plane, intersection);

    if (intersection) {
      dragOffset.current.x = hoveredObj.position.x - intersection.x;
      dragOffset.current.y = hoveredObj.position.y - intersection.y;
    }

    // Add spin boost on grab
    hoveredObj.userData.spinBoost = 0.05;
  }, [hoveredIndex, selectedIndex, camera, gl, onDragStart, onHover]);

  // Handle pointer up
  const handlePointerUp = useCallback(() => {
    if (isDragging) {
      document.body.classList.remove('dragging-3d');
      gl.domElement.style.cursor = hoveredIndex !== null ? 'grab' : 'default';
      setIsDragging(false);
      setSelectedIndex(null);
      onDragEnd();
    }
  }, [isDragging, hoveredIndex, gl, onDragEnd]);

  // Add/remove event listeners
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [gl, handlePointerMove, handlePointerDown, handlePointerUp]);

  return (
    <>
      {techLogosConfig.map((config, index) => (
        <group
          key={config.name || `decorative-${index}`}
          ref={(el) => {
            logoRefs.current[index] = el;
            // Set userData on the wrapper group so raycasting can find it
            if (el) {
              el.userData.name = config.name;
              el.userData.originalPosition = new THREE.Vector3(...config.position);
              el.userData.spinBoost = 0;
            }
          }}
        >
          <TechLogo
            config={config}
            isHovered={hoveredIndex === index}
            isDragging={isDragging && selectedIndex === index}
          />
        </group>
      ))}
    </>
  );
}
