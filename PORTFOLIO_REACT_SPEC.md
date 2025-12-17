# React Portfolio Website Specification

## Overview
Build an interactive portfolio website for a .NET developer using React, Three.js, and TypeScript. The site features a dark cyberpunk aesthetic with interactive 3D tech logo shapes that wander around the screen, a warp drive navigation effect, and smooth animations.

## Tech Stack
- **Framework**: React 18+ with TypeScript
- **3D Graphics**: Three.js with @react-three/fiber and @react-three/drei
- **Styling**: Tailwind CSS or CSS Modules (maintain the custom CSS variables)
- **Build Tool**: Vite
- **Animation**: Framer Motion (optional, for content animations)

## Design System

### Color Palette (CSS Variables)
```css
--bg-dark: #0a0a0f
--bg-card: #12121a
--accent-cyan: #00ffd5
--accent-purple: #a855f7
--accent-blue: #3b82f6
--accent-coral: #ff6b6b
--text-primary: #f0f0f5
--text-secondary: #8888a0
--border-subtle: rgba(255,255,255,0.06)
```

### Typography
- **Headings**: 'Syne' (Google Fonts) - weights 400-800
- **Code/Monospace**: 'JetBrains Mono' (Google Fonts) - weights 400-700

## Component Architecture

```
src/
├── components/
│   ├── three/
│   │   ├── Scene.tsx                    # Main Three.js canvas wrapper
│   │   ├── WarpEffect.tsx               # Particle system + warp streaks + tunnel rings
│   │   ├── InteractiveTechLogos.tsx     # Tech logo shapes (Vue, .NET, etc)
│   │   ├── FloatingParticles.tsx        # Ambient background particles
│   │   ├── TechLogo.tsx                 # Individual tech logo component
│   │   └── useWarpDrive.ts              # Custom hook for warp state management
│   ├── layout/
│   │   ├── Navigation.tsx               # Fixed top nav bar
│   │   ├── Section.tsx                  # Reusable section wrapper with reveal animation
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── Hero.tsx                     # Hero section with intro + tech stack
│   │   ├── CodePreview.tsx              # Syntax-highlighted code block
│   │   ├── Projects.tsx                 # Project cards grid
│   │   ├── Skills.tsx                   # Skills categories with progress bars
│   │   ├── Experience.tsx               # Timeline component
│   │   └── Contact.tsx                  # Contact links
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── CustomCursor.tsx             # Animated cursor that follows mouse
│   │   ├── TechTooltip.tsx              # Tooltip showing tech name on hover
│   │   ├── TechIcon.tsx
│   │   └── ProgressBar.tsx
│   └── effects/
│       └── ScrollReveal.tsx             # Intersection observer wrapper
├── hooks/
│   ├── useMousePosition.ts
│   ├── useScrollReveal.ts
│   ├── useWarpNavigation.ts             # Handles nav click -> warp -> scroll -> fade
│   └── useRaycaster.ts                  # Three.js raycasting for hover/drag detection
├── context/
│   └── WarpContext.tsx                  # Global warp state for coordinating animations
├── data/
│   ├── projects.ts                      # Project data
│   ├── skills.ts                        # Skills data
│   ├── experience.ts                    # Experience timeline data
│   └── techLogos.ts                     # Tech logo configurations
├── utils/
│   └── threeHelpers.ts                  # Helper functions for Three.js geometries
├── styles/
│   └── globals.css                      # Base styles, CSS variables, fonts
├── App.tsx
└── main.tsx
```

## Feature Specifications

### 1. Three.js Scene (Critical)

#### 1.1 Ambient Particles
- 2000 particles distributed in a cylindrical pattern around camera
- Colors: cyan (50%), purple (30%), white (20%)
- Gentle floating motion with velocity-based animation
- Particles bounce off invisible boundaries

#### 1.2 Interactive Tech Logo Shapes

**Tech logos with authentic brand colors and recognizable shapes:**

1. **Vue.js** - Green V-shaped extruded logo (#42b883)
   - Position: (-7, 3, -4)
   - Extruded 2D shape from points
   - Rotated 180° to show V properly

2. **Visual Studio** - Purple twisted torus knot (#854cc7)
   - Position: (8, 4, -6)
   - Represents the infinity/ribbon logo
   - Wireframe style

3. **Angular** - Red shield/A shape (#dd0031)
   - Position: (6, -3, -3)
   - Extruded shield geometry

4. **Python** - Blue/yellow double helix (#3776ab, #ffd43b)
   - Position: (-9, 0, -5)
   - Two intertwined tube geometries
   - Represents the two snakes

5. **.NET** - Purple dot + wireframe icosahedron (#512bd4)
   - Position: (0, 5, -7)
   - Group containing sphere + icosahedron
   - Represents "dot" + "net"work

6. **SQL Server** - Orange stacked cylinders (#f29111)
   - Position: (10, 0, -5)
   - 3 stacked cylinders with caps
   - Classic database icon

7. **TypeScript** - Blue square with white T (#3178c6)
   - Position: (-6, -4, -4)
   - Box geometry + extruded T letter
   - Group of meshes

8. **Azure** - Blue wireframe icosahedron (#0089d6)
   - Position: (0, -4, -5)
   - Cloud/globe representation

9. **Decorative shapes** (background) - Torus knot and large icosahedron
   - Very subtle, far back
   - Lower opacity (0.05-0.06)

**Interaction behaviors:**
- **Hover**: Increase opacity (to ~0.3-0.5), scale up 1.2x, show tooltip with tech name
- **Drag**: Click and drag to move shape on its z-plane, add spin boost on grab
- **Double-click**: Animate back to original position with eased movement + extra spin
- **Spin boost**: Decays at 0.98 multiplier per frame
- **Tooltip**: Cyan-bordered tooltip following cursor showing tech name

**Wandering Movement (NEW - Critical Feature):**
Each shape drifts organically using complex sine wave combinations:
- `wanderAngle` updates slowly (0.0008 * wanderSpeed per frame)
- X movement: `sin(angle * freqX1) + sin(angle * freqX2) * 0.5` multiplied by radius
- Y movement: Similar but at 50% of radius (less vertical drift)
- Z movement: Subtle depth changes
- Each shape has unique frequency values for different movement patterns
- Different speeds: .NET slowest (0.4), Angular fastest (1.2)
- Smooth interpolation (0.015 factor) creates gentle, dreamy motion
- Additional vertical float (0.15 amplitude) on top of wandering

**Implementation notes:**
- Use raycaster for hover/click detection on groups and meshes
- Raycaster should check `intersectObjects(interactiveObjects, true)` to hit children
- When hit, traverse up to find parent with `userData.name`
- Disable text selection on body when dragging (`user-select: none`)
- Content layer has `pointer-events: none` except on interactive elements
- Canvas z-index: 1, Content z-index: 5, Nav z-index: 100
- Store wander frequencies per object: `wanderFreqX`, `wanderFreqX2`, `wanderFreqY`, `wanderFreqY2`, `wanderFreqZ`

#### 1.3 Warp Drive Effect
Triggered when clicking navigation links.

**Components:**
1. **Warp streaks** (300 lines)
   - Start invisible, opacity increases with warp speed
   - Lines stretch based on speed (tail behind, head at current position)
   - Colors: cyan (60%), purple (25%), white (15%)

2. **Tunnel rings** (8 rings)
   - RingGeometry, subtle opacity (~0.15 at max)
   - Rush toward camera, loop back when passing
   - Rotate and pulse during warp

3. **FOV animation**
   - Normal: 75°
   - Max warp: 100° (75 + 25)
   - Smooth interpolation

**Warp timing sequence (1200ms total):**
- 0-30%: Accelerate (speed ramps up)
- 30-70%: Full speed
- 70-100%: Decelerate (speed ramps down)

**Coordinated with content:**
- 0ms: Start warp, fade out content (400ms transition)
- 600ms: Instant scroll to target section (while content invisible)
- 900ms: Fade in content
- 1200ms: Warp complete

#### 1.4 Camera
- Position: z = 6
- Subtle mouse follow (parallax effect)
- Mouse influence reduced during warp

### 2. Custom Cursor
- 20x20px circle, 2px cyan border
- Smooth follow with lerp (0.15 factor)
- Scale up 2x + fill with cyan on hover over interactive elements
- `mix-blend-mode: difference`

### 3. Tech Tooltip
- Fixed position following mouse (+20px X, -10px Y offset)
- Dark background with cyan border
- Shows tech name from `userData.name`
- Appears on hover, hides on drag
- Smooth fade in/out transition

### 4. Navigation
- Fixed position, z-index 100
- Gradient background fading to transparent
- Backdrop blur
- Links: About, Projects, Skills, Experience, Contact
- Click triggers warp navigation (not smooth scroll)
- Underline animation on hover

### 5. Content Sections

#### 5.1 Hero Section
- Label: "Full-Stack .NET Developer" with cyan accent line
- Headline: "Building **enterprise solutions** with clean code" (gradient on emphasized text)
- Description paragraph
- CTA buttons: "View Projects" (primary), "Get In Touch" (secondary)
- Tech stack icons: .NET, Vue, SQL, Azure (hover glow effect)
- Staggered entrance animations (fadeInUp with delays)

#### 5.2 Code Preview
- Fake terminal window with red/yellow/green dots
- Syntax highlighted C# code block
- Colors: keywords (purple), types (cyan), strings (green), comments (gray), methods (yellow)

#### 5.3 Projects Grid
- 2-column responsive grid (single column on mobile)
- Cards with:
  - Top gradient border (cyan to purple) on hover
  - Project number (01, 02, etc.)
  - Title, description
  - Tech tags (styled pills)
  - Lift + shadow on hover

**Project data:**
1. Document Management Platform - .NET 8, Vue 3, SQL Server, GdPicture
2. Identity Server Implementation - OpenIddict, OAuth 2.0, JWT, X.509
3. Vue.js Component Library - Vue 3, TypeScript, PrimeVue, Vite
4. Database Optimization Suite - SQL Server, T-SQL, Indexing, Performance

#### 5.4 Skills Section
- 3-column grid of skill categories
- Each category: title with purple accent dot, list of skills with progress bars
- Progress bar: gradient fill (cyan to purple), animate on scroll reveal

**Categories:**
1. Backend: C#/.NET Core (95%), ASP.NET Web API (90%), Entity Framework (88%), OpenIddict/OAuth (85%)
2. Frontend: Vue.js 3 (92%), TypeScript (85%), PrimeVue/CSS (88%), Vite/Webpack (80%)
3. Database & Cloud: SQL Server (90%), T-SQL/Stored Procs (85%), Azure DevOps (82%), CI/CD Pipelines (78%)

#### 5.5 Experience Timeline
- Vertical timeline with connecting line
- Circular markers on timeline
- Each item: date, title, company, description
- Left border extends between items

**Data:**
1. 2020-Present: Software Developer - Document Management Solutions
2. 2019-2020: Junior Developer - Software Development

#### 5.6 Contact Section
- Heading + description
- Link buttons with icons: Email, GitHub, LinkedIn
- Icon + text, hover glow effect

### 6. Scroll Reveal Animation
- Elements start with opacity 0, translateY 40px
- Trigger when element is 150px from bottom of viewport
- Use Intersection Observer
- Add `.active` class for transition

### 7. Responsive Design
- Mobile breakpoint: 768px
- Nav links hidden on mobile (hamburger menu optional)
- Single column layouts on mobile
- Reduced padding on mobile

## State Management

### Warp Context
```typescript
interface WarpState {
  isWarping: boolean;
  warpSpeed: number;       // 0 to maxWarpSpeed (2.5)
  warpProgress: number;    // 0 to 1
  triggerWarp: (targetId: string) => void;
}
```

### Content Fade State
```typescript
interface ContentState {
  isFading: boolean;
}
```

## Tech Logo Configuration Data Structure

```typescript
interface TechLogoConfig {
  name: string;
  type: 'extrude' | 'geometry' | 'group';
  geometry: GeometryConfig;
  material: MaterialConfig;
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
}
```

## Wandering Movement Algorithm

```typescript
// In animation loop for each object
function updateWandering(obj: Object3D, data: UserData, time: number) {
  if (isDragging && obj === selectedObject) return;
  
  // Update angle slowly
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
  
  const wanderZ = Math.sin(data.wanderAngle * data.wanderFreqZ) * 
                  data.wanderRadius * 0.4;
  
  // Smooth interpolation to target
  const targetPos = data.originalPosition.clone().add(
    new Vector3(wanderX, wanderY, wanderZ)
  );
  
  obj.position.lerp(targetPos, 0.015);
  
  // Additional gentle float
  const floatY = Math.sin(time * data.floatSpeed * 0.5 + data.floatOffset) * 0.15;
  obj.position.y += floatY;
}
```

## Performance Considerations

1. **Three.js optimization:**
   - Use `useMemo` for geometries and materials
   - Limit particle count on mobile (reduce to 1000)
   - Use `useFrame` efficiently, avoid creating objects in render loop
   - Set `pixelRatio` to `Math.min(window.devicePixelRatio, 2)`

2. **React optimization:**
   - Memoize expensive components
   - Use `React.lazy` for section components if bundle size is concern
   - Debounce scroll/mouse event handlers

3. **CSS:**
   - Use `will-change` sparingly
   - Hardware-accelerated transforms for animations

## Accessibility

- Semantic HTML structure
- Skip navigation link (optional)
- Reduced motion media query support
- Sufficient color contrast
- Keyboard navigation for interactive elements
- ARIA labels where appropriate

## Build & Deployment

### Scripts
```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext ts,tsx"
}
```

### Environment
- Node 18+
- npm or pnpm

## Reference Implementation

The original HTML implementation is included as `portfolio.html` in this repository. Use it as the source of truth for:
- Exact colors, spacing, and typography
- Animation timing and easing
- Three.js scene setup and parameters
- Interaction behaviors
- **Tech logo geometries and positioning** (CRITICAL)
- **Wandering movement implementation with frequency values** (CRITICAL)

## Acceptance Criteria

1. ✅ All sections render correctly with proper styling
2. ✅ Three.js scene loads with particles and tech logo shapes
3. ✅ Tech logos are recognizable (Vue V, .NET dot, Python helix, etc.)
4. ✅ Tech logos wander around smoothly with unique movement patterns
5. ✅ Different logos have different wander speeds (slow to fast)
6. ✅ Tech logos are draggable and respond to hover with tooltip
7. ✅ Tooltip shows tech name on hover
8. ✅ Double-click resets shapes to original position
9. ✅ Nav link clicks trigger warp effect with content fade
10. ✅ Scroll reveal animations work on all sections
11. ✅ Custom cursor follows mouse and reacts to hover states
12. ✅ Responsive layout works on mobile devices
13. ✅ No console errors or warnings
14. ✅ Smooth 60fps performance on modern devices

## Critical Implementation Notes for Claude Code

### Tech Logo Geometries

**Vue.js V-shape:**
```typescript
const points = [
  [0, 1.5], [-1.3, -0.8], [-0.8, -0.8], 
  [0, 0.5], [0.8, -0.8], [1.3, -0.8]
];
const shape = new THREE.Shape();
shape.moveTo(points[0][0], points[0][1]);
points.slice(1).forEach(p => shape.lineTo(p[0], p[1]));
const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.1, steps: 1, bevelEnabled: false });
// Rotate 180° (Math.PI) to show V right way up
```

**Python Double Helix:**
```typescript
// Create two helical curves offset by 180°
// Use TubeGeometry with radius 0.08
// Different colors: blue (#3776ab) and yellow (#ffd43b)
```

**.NET Dot + Net:**
```typescript
// Group containing:
// 1. Sphere at (-0.6, 0, 0) - the dot
// 2. Wireframe icosahedron at (0.4, 0, 0) - the net
```

**TypeScript T-shape:**
```typescript
// Group containing:
// 1. Box (1.2x1.2x0.1) - background square
// 2. Vertical bar (0.15x0.6x0.15) for T stem
// 3. Horizontal bar (0.5x0.12x0.15) for T top
```

### Raycasting for Groups
```typescript
// When raycasting, use recursive check
const intersects = raycaster.intersectObjects(interactiveObjects, true);

// Find parent with userData.name
let hitObject = intersects[0]?.object;
while (hitObject && !hitObject.userData.name && hitObject.parent) {
  hitObject = hitObject.parent;
}
```

### Pointer Events Layering
```css
/* Canvas can receive events */
#canvas-container { z-index: 1; }

/* Content blocks pointer events */
main { 
  z-index: 5; 
  pointer-events: none; 
}

/* Re-enable on interactive elements */
main a, main button, main .card { 
  pointer-events: auto; 
}

/* Nav always on top */
nav { z-index: 100; pointer-events: auto; }
```

## Getting Started Command

```bash
npm create vite@latest portfolio -- --template react-ts
cd portfolio
npm install three @react-three/fiber @react-three/drei
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

---

**Note to Claude Code**: The attached `portfolio.html` file contains the complete working implementation with all the latest changes including tech logos and wandering movement. Extract exact values (colors, positions, timings, wander frequencies, etc.) from this file rather than approximating. Pay special attention to:
1. Tech logo geometry creation (especially Vue V-shape and Python helix)
2. Wandering movement with unique frequency multipliers per shape
3. Raycaster setup for detecting clicks/hovers on grouped objects
4. Pointer events and z-index layering for proper interaction
