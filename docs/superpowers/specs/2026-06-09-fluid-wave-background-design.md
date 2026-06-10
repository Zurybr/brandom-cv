# Fluid Wave Background Design

## Goal

Add an animated water-wave background effect to the portfolio that fills from the bottom as the user scrolls, using Three.js with a custom GLSL shader.

## Context

- Astro v6 portfolio with dark theme (`--background: #0a0a0a`)
- 7 sections: Hero, About, Experience, Education, Skills, Projects, Contact
- User chose: waves style, fill-from-bottom behavior, cyan/turquoise palette, animated motion

## Visual Design

### Style
Layered sine waves resembling ocean water surface. Three overlapping wave layers with different frequencies, amplitudes, and speeds.

### Behavior
- Waves fill from the **bottom** of the viewport
- Scroll position controls water **height** (0% at top of page, ~80% at bottom)
- Waves animate continuously with their own motion independent of scroll
- Water appears instantly with scroll — no transition delay

### Colors
Cyan/turquoise palette on black background:
- Back layer: `#0891b2` at opacity 0.25
- Mid layer: `#06b6d4` at opacity 0.4
- Front layer: `#22d3ee` at opacity 0.55

## Architecture

### Component Structure

```
src/components/fluid-background.astro   (new)
  └── <canvas id="fluid-bg"> + Three.js setup + GLSL shader

src/layouts/Layout.astro                (modified)
  └── imports and renders FluidBackground before Header
```

### Canvas Setup

- `<canvas id="fluid-bg">` with `position: fixed`, `z-index: -1`, `pointer-events: none`
- Covers full viewport (`100vw × 100vh`)
- Three.js `WebGLRenderer` with `alpha: true`, `antialias: false`
- Pixel ratio capped at `Math.min(devicePixelRatio, 2)`
- Resize handled via `ResizeObserver` on document body

### Shader Design

A fullscreen quad (`PlaneGeometry(2, 2)`) with an `ShaderMaterial` using:

**Uniforms:**
- `uTime` — `float`, elapsed seconds for wave animation
- `uWaterLevel` — `float`, 0.0 to 1.0, scroll-driven water height
- `uResolution` — `vec2`, canvas pixel dimensions

**Fragment Shader Logic:**
1. Convert UV to screen-space coordinates
2. For each of 3 wave layers, compute wave surface y-position using: `sin(x * freq + uTime * speed) * amplitude + sin(x * freq2 + uTime * speed2) * amp2`
3. `smoothstep` the wave edge for soft transitions
4. Below wave surface: blend layer color with opacity
5. Above all waves but below `uWaterLevel`: subtle depth gradient
6. Above `uWaterLevel`: fully transparent (alpha 0.0)

### Scroll Integration

- `window.addEventListener('scroll', ...)` calculates progress: `scrollY / (scrollHeight - innerHeight)`
- Clamped to [0, 1] and passed as `uWaterLevel` uniform
- Uses `{ passive: true }` for performance
- Direct uniform update — no animation tweening on scroll

### Animation Loop

- `renderer.setAnimationLoop(animate)` — Three.js managed loop
- Each frame: update `uTime` from `performance.now() / 1000`
- Render the single fullscreen quad

## Accessibility

- `prefers-reduced-motion: reduce` → `uTime` stops advancing (waves freeze), but scroll-level still works
- Canvas has `aria-hidden="true"` and `role="presentation"`
- `pointer-events: none` ensures no interaction blocking

## Performance

- Single fullscreen quad with trivial shader (sin + smoothstep) — ~60fps on any GPU
- Pixel ratio capped at 2x
- `antialias: false` — waves don't need it
- ResizeObserver for efficient resize handling
- Passive scroll listener

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/fluid-background.astro` | Create | Canvas + Three.js + shader |
| `src/layouts/Layout.astro` | Modify | Import and render FluidBackground |
| `package.json` | Modify | Add `three` dependency |

## Out of Scope

- Mouse/touch interaction with the water
- Sound effects
- Per-section wave behavior
- Three.js post-processing passes
- Mobile-specific behavior (same effect works everywhere)
