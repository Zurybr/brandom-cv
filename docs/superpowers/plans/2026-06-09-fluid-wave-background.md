# Fluid Wave Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an animated cyan water-wave background that fills from the bottom as the user scrolls, using Three.js with a custom GLSL shader.

**Architecture:** A fixed-position canvas rendered by Three.js with a fullscreen quad and a ShaderMaterial. The fragment shader draws 3 layered sine waves. Scroll position drives a `uWaterLevel` uniform; time drives `uTime` for animation.

**Tech Stack:** Astro v6, Three.js, GLSL, Tailwind CSS v4

---

### Task 1: Install Three.js dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install three**

Run: `npm install three`
Expected: `three` appears in `dependencies` in `package.json`

- [ ] **Step 2: Verify install**

Run: `ls node_modules/three/build/three.module.js`
Expected: file exists

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add three.js dependency"
```

---

### Task 2: Create the fluid background component

**Files:**
- Create: `src/components/fluid-background.astro`

This component contains:
1. A `<canvas>` element with inline styles for fixed positioning
2. A `<script>` block that sets up Three.js, the shader, and scroll listener

**Implementation:**

```astro
---
---

<canvas
  id="fluid-bg"
  aria-hidden="true"
  role="presentation"
  style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;pointer-events:none;"
></canvas>

<script>
  import * as THREE from 'three';

  const canvas = document.getElementById('fluid-bg') as HTMLCanvasElement;
  if (!canvas) throw new Error('fluid-bg canvas not found');

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const vertexShader = `
    void main() {
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `;

  const fragmentShader = `
    precision mediump float;

    uniform float uTime;
    uniform float uWaterLevel;
    uniform vec2 uResolution;

    // Wave function: returns wave surface Y in [0, 1] UV space
    float wave(float x, float freq1, float amp1, float freq2, float amp2, float speed) {
      return sin(x * freq1 + uTime * speed) * amp1
           + sin(x * freq2 + uTime * speed * 0.7) * amp2;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution;

      // Water level capped at 0.8 (80%) so water never covers the entire screen
      float waterY = uWaterLevel * 0.8;

      // Soft edge width for smoothstep transitions
      float edge = 0.02;

      // 3 wave layers with different frequencies/amplitudes
      float waveMargin = 0.06;

      // Back layer — slowest, widest
      float backWave = waterY + waveMargin * 2.0
        + wave(uv.x, 6.0, 0.02, 3.0, 0.01, 0.8);
      // Mid layer
      float midWave = waterY + waveMargin
        + wave(uv.x, 8.0, 0.015, 4.5, 0.008, 1.2);
      // Front layer — fastest, most detail
      float frontWave = waterY
        + wave(uv.x, 10.0, 0.012, 6.0, 0.006, 1.8);

      vec4 color = vec4(0.0);

      // Soft wave edges using smoothstep
      float backAlpha = smoothstep(backWave + edge, backWave - edge, uv.y);
      float midAlpha = smoothstep(midWave + edge, midWave - edge, uv.y);
      float frontAlpha = smoothstep(frontWave + edge, frontWave - edge, uv.y);

      color += vec4(0.031, 0.569, 0.698, 0.25) * backAlpha;   // #0891b2
      color += vec4(0.024, 0.714, 0.831, 0.40) * midAlpha;     // #06b6d4
      color += vec4(0.133, 0.827, 0.933, 0.55) * frontAlpha;   // #22d3ee

      gl_FragColor = color;
    }
  `;

  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0.0 },
      uWaterLevel: { value: 0.0 },
      uResolution: {
        value: new THREE.Vector2(
          window.innerWidth * renderer.getPixelRatio(),
          window.innerHeight * renderer.getPixelRatio()
        ),
      },
    },
    transparent: true,
    depthTest: false,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Scroll → uWaterLevel
  function updateWaterLevel() {
    const scrollMax = document.body.scrollHeight - window.innerHeight;
    const progress = scrollMax > 0 ? window.scrollY / scrollMax : 0;
    material.uniforms.uWaterLevel.value = Math.max(0, Math.min(1, progress));
  }

  window.addEventListener('scroll', updateWaterLevel, { passive: true });
  updateWaterLevel();

  // Reduced motion check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timeScale = prefersReducedMotion.matches ? 0 : 1;
  prefersReducedMotion.addEventListener('change', (e) => {
    timeScale = e.matches ? 0 : 1;
  });

  // Resize
  const resizeObserver = new ResizeObserver(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    material.uniforms.uResolution.value.set(
      w * renderer.getPixelRatio(),
      h * renderer.getPixelRatio()
    );
  });
  resizeObserver.observe(document.body);

  // Animation loop
  renderer.setAnimationLoop((timestamp: number) => {
    material.uniforms.uTime.value = (timestamp / 1000) * timeScale;
    renderer.render(scene, camera);
  });
</script>
```

- [ ] **Step 1: Create `src/components/fluid-background.astro`** with the code above

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx astro check`
Expected: no errors related to the new component

- [ ] **Step 3: Commit**

```bash
git add src/components/fluid-background.astro
git commit -m "feat: add fluid wave background component with Three.js shader"
```

---

### Task 3: Integrate into Layout

**Files:**
- Modify: `src/layouts/Layout.astro`

- [ ] **Step 1: Add import for FluidBackground**

In the frontmatter of `src/layouts/Layout.astro`, add after the existing imports (line 5):

```astro
import FluidBackground from '@/components/fluid-background.astro'
```

- [ ] **Step 2: Render FluidBackground in the body**

In the body, add `<FluidBackground />` right after the `<body>` tag and before `<Header />`:

```astro
<body class="min-h-screen flex flex-col">
    <FluidBackground />
    <Header />
```

- [ ] **Step 3: Verify the dev server starts**

Run: `npm run dev`
Expected: dev server starts without errors, page loads at localhost

- [ ] **Step 4: Visually verify in browser**

Open the dev server URL. Scroll down the page. Expected:
- At top: black background, no water visible
- As you scroll: cyan waves animate and fill from the bottom
- At bottom: water covers most of the viewport
- Waves move continuously with animation

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: integrate fluid wave background into layout"
```

---

### Task 4: Build verification

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: build completes without errors

- [ ] **Step 2: Lint check**

Run: `npm run lint`
Expected: no new lint errors

- [ ] **Step 3: Verify bundle includes Three.js**

Run: `ls dist/`
Expected: dist directory exists with built assets

- [ ] **Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: build verification adjustments" # only if needed
```
