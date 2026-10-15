import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { dampPosition } from '../lib/portfolio-logic';

interface SilkCanvasProps {
  liteMode: boolean;
  activeColor?: string;
  isHoveringProject?: boolean;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform vec2 uPointerVelocity;
  uniform float uIntensity;
  uniform vec3 uAccentColor;
  varying vec2 vUv;

  // Procedural 2D Simplex Noise for silky fluid waves
  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
      + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
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
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 centeredUv = (st - 0.5) * aspect;
    vec2 pointerUv = (uPointer - 0.5) * aspect;

    // Radial distance and influence from damped cursor position
    float dist = length(centeredUv - pointerUv);
    float radial = smoothstep(0.65, 0.0, dist);

    // Offset along velocity vector and perpendicular shear
    vec2 vel = uPointerVelocity * 0.85;
    vec2 perpVel = vec2(-vel.y, vel.x) * 0.6;
    vec2 totalDisplacement = (vel + perpVel) * radial * (0.8 + uIntensity * 0.8);

    // Coordinated silky folds with anisotropic frequency
    vec2 foldCoord = st * 3.4 + totalDisplacement;
    float t = uTime * 0.14;

    float wave1 = sin(foldCoord.x * 4.2 + foldCoord.y * 2.8 + t);
    float wave2 = cos(foldCoord.x * 2.1 - foldCoord.y * 5.4 - t * 1.2);
    float noise1 = snoise(foldCoord * 1.3 + vec2(t * 0.25));
    float noise2 = snoise(foldCoord * 2.8 - vec2(t * 0.45));

    // Combine into continuous soft silk folds
    float silk = (wave1 * 0.42 + wave2 * 0.32 + noise1 * 0.2 + noise2 * 0.1);
    float silkFolds = smoothstep(-0.8, 0.8, silk);

    // Highlights and deep fold shadows
    float cursorGlow = radial * (0.12 + length(vel) * 2.2) * (0.4 + uIntensity * 0.6);
    float foldHighlight = pow(silkFolds, 3.2) * 0.16;
    float foldShadow = pow(1.0 - silkFolds, 2.8) * 0.1;

    // Base dark canvas: #141414 (faithfully restrained)
    vec3 baseColor = vec3(0.078, 0.078, 0.082);
    
    // Subtle monochromatic sheen with optional restrained project tint
    vec3 tone = mix(baseColor, uAccentColor * 0.15, silkFolds * 0.35);
    tone += uAccentColor * (cursorGlow * 0.3 + foldHighlight * 0.2);
    tone -= vec3(foldShadow);

    // Edge vignette
    float vignette = 1.0 - smoothstep(0.45, 1.2, length(st - 0.5));
    tone *= (0.88 + vignette * 0.12);

    gl_FragColor = vec4(tone, 1.0);
  }
`;

function SilkMesh({
  activeColor,
  isHoveringProject,
}: {
  activeColor: string;
  isHoveringProject: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport, gl } = useThree();

  // Pointer smoothing state
  const targetPointer = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const smoothedPointer = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const prevSmoothedPointer = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const velocity = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const intensity = useRef<number>(0);

  const parsedAccent = useMemo(() => new THREE.Color(activeColor || '#d4d4d8'), [activeColor]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uPointerVelocity: { value: new THREE.Vector2(0, 0) },
      uIntensity: { value: 0 },
      uAccentColor: { value: parsedAccent },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uAccentColor.value.copy(parsedAccent);
    }
  }, [parsedAccent]);

  useEffect(() => {
    if (materialRef.current) {
      const dpr = gl.getPixelRatio();
      materialRef.current.uniforms.uResolution.value.set(size.width * dpr, size.height * dpr);
    }
  }, [size, gl]);

  // Window pointer move listener
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const normX = e.clientX / window.innerWidth;
      const normY = 1.0 - e.clientY / window.innerHeight;
      targetPointer.current = { x: normX, y: normY };
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  useFrame((state, delta) => {
    if (!materialRef.current) return;

    const clampedDelta = Math.min(delta, 0.1);
    const elapsed = state.clock.getElapsedTime();

    // Smooth damped pointer position
    const prev = smoothedPointer.current;
    const next = dampPosition(prev, targetPointer.current, 7.0, clampedDelta);
    smoothedPointer.current = next;

    // Calculate damped velocity
    const dt = clampedDelta > 0 ? clampedDelta : 0.016;
    const rawVx = (next.x - prevSmoothedPointer.current.x) / dt;
    const rawVy = (next.y - prevSmoothedPointer.current.y) / dt;
    prevSmoothedPointer.current = { ...next };

    velocity.current.x += (rawVx - velocity.current.x) * Math.min(1, clampedDelta * 9);
    velocity.current.y += (rawVy - velocity.current.y) * Math.min(1, clampedDelta * 9);

    // Target intensity boosts on project hover
    const targetIntensity = isHoveringProject ? 1.0 : 0.2;
    intensity.current += (targetIntensity - intensity.current) * Math.min(1, clampedDelta * 6);

    // Uniform updates
    materialRef.current.uniforms.uTime.value = elapsed;
    materialRef.current.uniforms.uPointer.value.set(next.x, next.y);
    materialRef.current.uniforms.uPointerVelocity.value.set(
      velocity.current.x * 0.09,
      velocity.current.y * 0.09
    );
    materialRef.current.uniforms.uIntensity.value = intensity.current;
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export const SilkCanvas: React.FC<SilkCanvasProps> = ({
  liteMode,
  activeColor = '#d4d4d8',
  isHoveringProject = false,
}) => {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Headless CPU detection
  const isHeadless =
    typeof navigator !== 'undefined' &&
    (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));

  if (liteMode || prefersReducedMotion) {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-40 transition-colors duration-700"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${activeColor}12 0%, #141414 75%)`,
        }}
        aria-hidden="true"
      />
    );
  }

  const dpr = isHeadless ? 1 : Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.75);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        dpr={dpr}
        gl={{
          powerPreference: 'high-performance',
          antialias: false,
          alpha: false,
        }}
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      >
        <SilkMesh activeColor={activeColor} isHoveringProject={isHoveringProject} />
      </Canvas>
    </div>
  );
};
