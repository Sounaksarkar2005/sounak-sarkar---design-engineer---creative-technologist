import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ProjectShaderCanvasProps {
  variant: 'chronos' | 'aether' | 'lumina' | 'strata' | 'synapse' | 'currency';
  isHovered: boolean;
  liteMode: boolean;
  reducedMotion: boolean;
  accentColor: string;
}

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uHover;
  uniform vec2 uPointer;
  uniform vec2 uPointerVelocity;
  uniform float uStrength;
  uniform int uVariant; // 0: chronos, 1: aether, 2: lumina, 3: strata, 4: synapse, 5: currency

  // Procedural Simplex Noise
  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 pointerUv = vec2(uPointer.x, 1.0 - uPointer.y);
    float pointerDistance = length((uv - pointerUv) * vec2(uResolution.x / uResolution.y, 1.0));
    float pointerInfluence = exp(-pointerDistance * 5.5);
    float lowerFalloff = pow(1.0 - uv.y, 1.6);
    float outerEdge = smoothstep(0.3, 1.0, abs(uv.x - 0.5) * 2.0);
    float foldPhase = uv.x * 8.0 + uv.y * 5.0 + uPointer.x * 2.0;
    float foldWave = sin(foldPhase + uPointerVelocity.x * 2.0);
    float wind = clamp(length(uPointerVelocity), 0.0, 1.5);
    float horizontalDeformation = uStrength * uHover * lowerFalloff * (
      foldWave * (0.006 + outerEdge * 0.006 + wind * 0.006)
      + uPointerVelocity.x * pointerInfluence * 0.014
      + uPointerVelocity.y * pointerInfluence * 0.006
    );
    float verticalDeformation = uStrength * uHover * lowerFalloff
      * sin(uv.x * 5.5 + uPointer.x * 3.0 + wind) * 0.006;
    uv.x += horizontalDeformation;
    uv.y += verticalDeformation;

    vec2 centered = uv - 0.5;
    centered.x *= uResolution.x / uResolution.y;

    float t = uTime * 0.2 + uHover * 0.4;
    float dist = length(centered);
    vec3 col = vec3(0.08, 0.08, 0.088); // Deep charcoal black canvas

    if (uVariant == 0) {
      // CHRONOS: Kinetic temporal dials, gear pitch lines, and tick marks
      float angle = atan(centered.y, centered.x);
      float rings = sin(dist * 40.0 - t * 2.0) * 0.5 + 0.5;
      float notches = sin(angle * 24.0 + t) * 0.5 + 0.5;
      float dial = smoothstep(0.05, 0.0, abs(rings - 0.5)) * smoothstep(0.2, 0.5, notches);
      float glow = smoothstep(0.4, 0.0, dist) * (0.15 + uHover * 0.2);
      col += vec3(0.85, 0.88, 0.9) * (dial * 0.18 + glow);
    } 
    else if (uVariant == 1) {
      // AETHER: Fluid acoustic waveforms & harmonic ambisonic dispersion
      float wave = sin(centered.x * 12.0 + t * 3.0) * cos(centered.y * 10.0 - t * 2.0);
      float ripple = sin(dist * 28.0 - t * 4.0);
      float field = snoise(centered * 3.5 + vec2(t * 0.5));
      float intensity = smoothstep(0.3, 0.0, abs(wave + ripple * 0.4 + field * 0.3));
      col += vec3(0.58, 0.77, 0.99) * (intensity * 0.22 + uHover * 0.15 * smoothstep(0.5, 0.0, dist));
    }
    else if (uVariant == 2) {
      // LUMINA: Refracted caustics, prismatic dispersion, geometric prism rays
      vec2 p = centered * 2.5;
      float r = snoise(p + vec2(t * 0.3, 0.0));
      float g = snoise(p + vec2(0.0, t * 0.3));
      float b = snoise(p - vec2(t * 0.3, t * 0.2));
      vec3 prismatic = vec3(r, g, b) * 0.5 + 0.5;
      float ray = pow(max(0.0, 1.0 - length(cross(vec3(centered, 0.0), vec3(0.707, 0.707, 0.0)))), 4.0);
      col += prismatic * 0.15 + vec3(0.9, 0.8, 0.6) * (ray * (0.2 + uHover * 0.3));
    }
    else if (uVariant == 3) {
      // STRATA: Topographic elevation lines and contour ridges
      float elevation = snoise(centered * 4.0 + vec2(t * 0.1)) * 3.0;
      float contour = abs(fract(elevation) - 0.5);
      float lines = smoothstep(0.08, 0.02, contour);
      col += vec3(0.4, 0.9, 0.7) * (lines * 0.24 + uHover * 0.12 * smoothstep(0.6, 0.0, dist));
    }
    else if (uVariant == 4) {
      // SYNAPSE: Neural node filaments and signal pulses
      float p1 = snoise(centered * 6.0 + vec2(t * 0.4));
      float p2 = snoise(centered * 9.0 - vec2(t * 0.6));
      float pulse = smoothstep(0.2, 0.0, abs(p1 * p2));
      col += vec3(0.75, 0.65, 0.98) * (pulse * 0.25 + uHover * 0.2 * smoothstep(0.45, 0.0, dist));
    }
    else {
      // CURRENCY: Fine guilloche moiré security patterns
      float g1 = sin(centered.x * 60.0 + sin(centered.y * 20.0 + t));
      float g2 = cos(centered.y * 60.0 + cos(centered.x * 20.0 - t));
      float moire = smoothstep(0.1, 0.0, abs(g1 * g2));
      col += vec3(0.85, 0.8, 0.7) * (moire * 0.2 + uHover * 0.15 * smoothstep(0.5, 0.0, dist));
    }

    // Peripheral vignette
    float vignette = 1.0 - smoothstep(0.3, 0.85, dist);
    col *= (0.7 + vignette * 0.3);
    float foldLight = foldWave * lowerFalloff * uHover * uStrength * 0.08;
    col += vec3(foldLight);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const variantMap: Record<string, number> = {
  chronos: 0,
  aether: 1,
  lumina: 2,
  strata: 3,
  synapse: 4,
  currency: 5,
};

export const ProjectShaderCanvas: React.FC<ProjectShaderCanvasProps> = ({
  variant,
  isHovered,
  liteMode,
  reducedMotion,
  accentColor,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTargetRef = useRef(isHovered ? 1 : 0);
  const [webGLFailed, setWebGLFailed] = useState(false);
  const supportsFinePointer =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches &&
    !('ontouchstart' in window);
  const fallbackStyle: React.CSSProperties & {
    '--flag-accent': string;
    '--flag-tilt-x': string;
    '--flag-tilt-y': string;
    '--flag-sheen-x': string;
  } = {
    '--flag-accent': accentColor,
    '--flag-tilt-x': '0deg',
    '--flag-tilt-y': '0deg',
    '--flag-sheen-x': '50%',
  };

  useEffect(() => {
    hoverTargetRef.current = isHovered ? 1 : 0;
  }, [isHovered]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setWebGLFailed(false);
    if (liteMode || reducedMotion || !supportsFinePointer) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        powerPreference: 'low-power',
        antialias: false,
        alpha: false,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);
    } catch (error) {
      if (renderer?.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      renderer?.dispose();
      console.warn('Project flag WebGL is unavailable; using the CSS fabric fallback.', error);
      setWebGLFailed(true);
      return;
    }

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width * renderer.getPixelRatio(), height * renderer.getPixelRatio()) },
        uHover: { value: 0 },
        uPointer: { value: new THREE.Vector2(0.5, 0.5) },
        uPointerVelocity: { value: new THREE.Vector2(0, 0) },
        uStrength: { value: supportsFinePointer ? 1 : 0 },
        uVariant: { value: variantMap[variant] ?? 0 },
      },
      depthWrite: false,
      depthTest: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    const targetPointer = new THREE.Vector2(0.5, 0.5);
    const smoothedPointer = new THREE.Vector2(0.5, 0.5);
    const pointerVelocity = new THREE.Vector2(0, 0);
    const rawPointerVelocity = new THREE.Vector2(0, 0);
    let startTime = performance.now();
    let previousTime = startTime;
    let isVisible = true;
    let frameId: number | null = null;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        scheduleRender();
      } else if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    }, { threshold: 0.1 });
    observer.observe(container);

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      material.uniforms.uResolution.value.set(
        w * renderer.getPixelRatio(),
        h * renderer.getPixelRatio(),
      );
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!supportsFinePointer || event.pointerType !== 'mouse') return;
      const rect = container.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) return;

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      targetPointer.set(x, y);
      container.style.setProperty('--flag-pointer-x', `${x * 100}%`);
      container.style.setProperty('--flag-pointer-y', `${y * 100}%`);
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (frameId !== null) {
          cancelAnimationFrame(frameId);
          frameId = null;
        }
      } else {
        scheduleRender();
      }
    };

    const drawFrame = (now: number) => {
      if (isVisible && !document.hidden) {
        const delta = Math.min((now - previousTime) / 1000, 0.1);
        previousTime = now;
        const pointerEase = 1 - Math.exp(-delta * 8);
        const previousX = smoothedPointer.x;
        const previousY = smoothedPointer.y;
        smoothedPointer.lerp(targetPointer, pointerEase);

        const dt = Math.max(delta, 1 / 120);
        const velocityEase = 1 - Math.exp(-delta * 7);
        rawPointerVelocity.set(
          (smoothedPointer.x - previousX) / dt,
          (smoothedPointer.y - previousY) / dt,
        );
        pointerVelocity.lerp(rawPointerVelocity, velocityEase);
        pointerVelocity.clampLength(0, 1.2);

        material.uniforms.uTime.value = (now - startTime) * 0.001;
        material.uniforms.uHover.value +=
          (hoverTargetRef.current - material.uniforms.uHover.value) * Math.min(1, delta * 6);
        material.uniforms.uPointer.value.copy(smoothedPointer);
        material.uniforms.uPointerVelocity.value.copy(pointerVelocity);
        renderer?.render(scene, camera);
      }

      if (!reducedMotion && !document.hidden && isVisible) {
        frameId = requestAnimationFrame(drawFrame);
      } else {
        frameId = null;
      }
    };
    const scheduleRender = () => {
      if (document.hidden || !isVisible) return;
      if (reducedMotion) {
        drawFrame(performance.now());
      } else if (frameId === null) {
        frameId = requestAnimationFrame(drawFrame);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    scheduleRender();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
      if (renderer) {
        if (renderer.domElement.parentElement === container) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
      geometry.dispose();
      material.dispose();
    };
  }, [variant, liteMode, reducedMotion, supportsFinePointer]);

  if (liteMode || reducedMotion || !supportsFinePointer || webGLFailed) {
    return (
      <div
        ref={containerRef}
        className="project-flag-fallback absolute inset-0 w-full h-full"
        onPointerMove={(event) => {
          if (
            liteMode ||
            reducedMotion ||
            !supportsFinePointer ||
            event.pointerType !== 'mouse'
          ) return;
          const rect = event.currentTarget.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width;
          const y = (event.clientY - rect.top) / rect.height;
          event.currentTarget.style.setProperty(
            '--flag-pointer-x',
            `${x * 100}%`,
          );
          event.currentTarget.style.setProperty(
            '--flag-pointer-y',
            `${y * 100}%`,
          );
          event.currentTarget.style.setProperty('--flag-tilt-x', `${(0.5 - y) * 3}deg`);
          event.currentTarget.style.setProperty('--flag-tilt-y', `${(x - 0.5) * 3}deg`);
          event.currentTarget.style.setProperty('--flag-sheen-x', `${x * 100}%`);
        }}
        onPointerLeave={(event) => {
          event.currentTarget.style.setProperty('--flag-tilt-x', '0deg');
          event.currentTarget.style.setProperty('--flag-tilt-y', '0deg');
          event.currentTarget.style.setProperty('--flag-sheen-x', '50%');
        }}
        style={fallbackStyle}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="project-flag-shader absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};
