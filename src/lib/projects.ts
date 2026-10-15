export interface Project {
  id: string;
  slug: string;
  projectNumber: string; // e.g. "Project 1"
  numberDigits: string; // e.g. "01"
  title: string;
  year: string;
  tagline: string;
  description: string;
  role: string;
  roleDescription: string;
  stack: string;
  technicalNote: string;
  visitUrl: string;
  visitLabel: string;
  category: string;
  accentColor: string; // subtle restrained accent, defaults to cool neutral
  barcode: string;
  variant: 'chronos' | 'aether' | 'lumina' | 'strata' | 'synapse' | 'currency';
}

export const PROJECTS: Project[] = [
  {
    id: 'chronos',
    slug: 'chronos-viewer',
    projectNumber: 'Project 1',
    numberDigits: '01',
    title: 'CHRONOS 3D',
    year: '2026',
    tagline: 'A browser-based inspection tool for kinetic temporal mechanisms and 3D horology',
    description: 'Chronos is an open web platform for micro-mechanical engineers and watchmakers to inspect, simulate, and export complex gear escapements and kinetic timepieces. It streams multi-part assemblies directly to WebGL, enabling real-time physics validation before physical CNC machining.',
    role: 'design engineer',
    roleDescription: 'I built the viewer end to end as a standalone module embedded in the platform, working closely with the CAD engineers and simulation team. Everything on the viewer side is mine: GLTF/STEP assembly loading, quad and boundary wireframe rendering, exploded-view kinematics, torque inspectors, and studio lighting presets.',
    stack: 'Three.js, TypeScript, Zustand, WebGL2',
    technicalNote: 'WebGL only renders triangles, so standard wireframes display noisy diagonal seams across flat gear faces. I built a coplanar quad cage filter: adjacent coplanar triangles are paired, their shared diagonals discarded, and only functional perimeter edges and pitch circles are drawn. For exploded views, offsets are computed dynamically from each part bounding box and its hierarchy depth, ensuring small escapement springs stay visible rather than buried inside heavy titanium plates.',
    visitUrl: 'https://chronos-viewer.example.com',
    visitLabel: 'Visit Chronos 3D',
    category: 'Kinetic Simulation & Tooling',
    accentColor: '#d4d4d8',
    barcode: 'CHR-3829-TK-2026',
    variant: 'chronos',
  },
  {
    id: 'aether',
    slug: 'aether-acoustics',
    projectNumber: 'Project 2',
    numberDigits: '02',
    title: 'AETHER ACOUSTICS',
    year: '2025',
    tagline: 'An algorithmic spatial audio synthesizer and binaural room acoustic sculptor',
    description: 'Aether is an interactive sound engine designed for electroacoustic composers and sound artists. It translates three-dimensional orbital gestures into quadraphonic ambisonic soundfields, simulating physical reverberation and acoustic wave propagation in real time.',
    role: 'design engineer',
    roleDescription: 'I designed the interface and built the entire Web Audio DSP pipeline: low-latency AudioWorklet nodes, the 3D ambisonic panner, harmonic oscillator clusters, and the WebGL spectral waterfall display that visualizes resonant room modes.',
    stack: 'Web Audio API, Three.js, TypeScript, Next.js',
    technicalNote: 'Main thread JavaScript introduces jitter into audio scheduling when rendering heavy canvas visuals. I decoupled the DSP entirely into a dedicated AudioWorklet thread running at 96kHz, transferring frequency buffers to the GPU via shared memory arrays. The spectral visualizer renders over 2048 frequency bins using custom instanced quad shaders, eliminating DOM overhead.',
    visitUrl: 'https://aether-sound.example.com',
    visitLabel: 'Visit Aether Acoustics',
    category: 'Spatial Audio DSP',
    accentColor: '#93c5fd',
    barcode: 'AET-9901-BL-2025',
    variant: 'aether',
  },
  {
    id: 'lumina',
    slug: 'lumina-optics',
    projectNumber: 'Project 3',
    numberDigits: '03',
    title: 'LUMINA REFRACTION',
    year: '2025',
    tagline: 'Real geometry and caustic light transport for architectural exhibitions',
    description: 'Lumina is a permanent media installation commissioned for an architectural pavilion in Kyoto. It coordinates laser projection arrays and suspended flint-glass prisms to cast evolving mathematical caustics across translucent walls.',
    role: 'design engineer',
    roleDescription: 'I authored the interactive light simulation in WebGPU and Three.js, built the calibration interface used by exhibition technicians on site, and engineered the camera-driven observer tracking that shifts the focal caustics based on audience presence.',
    stack: 'WebGPU, WGSL, Three.js, TypeScript',
    technicalNote: 'Simulating true glass refraction with internal total reflection in real time requires iterative raymarching. I developed a compute-shader pass that calculates secondary internal reflections across non-convex glass profiles. The resulting photon energy map is accumulated in a half-float texture and mapped to the exhibition laser controllers with sub-16ms latency.',
    visitUrl: 'https://lumina-optics.example.com',
    visitLabel: 'Visit Lumina Refraction',
    category: 'Volumetric Light & Optics',
    accentColor: '#fda4af',
    barcode: 'LUM-1142-KT-2025',
    variant: 'lumina',
  },
  {
    id: 'strata',
    slug: 'strata-cartography',
    projectNumber: 'Project 4',
    numberDigits: '04',
    title: 'STRATA TERRAIN',
    year: '2024',
    tagline: 'Multi-resolution vector bathymetry and oceanic planetary telemetry',
    description: 'Strata transforms high-resolution seafloor sonar and satellite altimetry data into fluid, interactive topographic maps for marine researchers and climate scientists studying sub-sea trenches.',
    role: 'design engineer',
    roleDescription: 'I engineered the WebGL elevation tile renderer, the contour-derivation pipeline running in Web Workers, and the minimal cartographic interface with precise coordinate readouts and profile cross-section inspectors.',
    stack: 'Three.js, WebGL2, Web Workers, TypeScript',
    technicalNote: 'Rendering millions of raw bathymetric points causes severe pipeline stalls on mobile GPUs. I implemented a quadtree level-of-detail (LOD) system where high-frequency contour lines are evaluated analytically inside the fragment shader using standard derivatives (fwidth). This preserves hair-thin vector lines regardless of zoom depth while keeping CPU memory under 35 MB.',
    visitUrl: 'https://strata-map.example.com',
    visitLabel: 'Visit Strata Terrain',
    category: 'Interactive Cartography',
    accentColor: '#a7f3d0',
    barcode: 'STR-7203-OC-2024',
    variant: 'strata',
  },
  {
    id: 'synapse',
    slug: 'synapse-haptics',
    projectNumber: 'Project 5',
    numberDigits: '05',
    title: 'SYNAPSE HAPTICS',
    year: '2024',
    tagline: 'Micro-gesture spatial computing and mid-air tactile interaction',
    description: 'Synapse is an experimental research prototype investigating non-contact gestural manipulation. By coupling optical hand tracking with ultrasonic acoustic arrays, it projects tactile clicks directly onto the fingertips in free space.',
    role: 'design engineer',
    roleDescription: 'I designed the interaction model and built the web-based experimentation testbed: low-latency hand skeleton tracking, spatial widget coordinate mapping, and acoustic emitter beamforming controls.',
    stack: 'Three.js, WebAssembly, Web Audio API, TypeScript',
    technicalNote: 'Optical tracking suffers from high-frequency jitter when fingers are held still. I implemented a double-exponential Kalman filter in WebAssembly that dampens micro-tremors while preserving instantaneous velocity when deliberate pinch gestures occur, yielding rock-solid spatial button actuation.',
    visitUrl: 'https://synapse-haptics.example.com',
    visitLabel: 'Visit Synapse Haptics',
    category: 'Spatial HCI & Gesture',
    accentColor: '#d8b4fe',
    barcode: 'SYN-5582-SF-2024',
    variant: 'synapse',
  },
  {
    id: 'currency',
    slug: 'stream-of-value',
    projectNumber: 'Project 6',
    numberDigits: '06',
    title: 'STREAM OF VALUE',
    year: '2026',
    tagline: 'Priceless, technically worthless. Procedural physical tokens in motion.',
    description: 'Stream of Value is a self-initiated technical study built around a fictional digital artifact: a procedural commemorative token with dynamic reeded edges, relief hallmarks, and simulated inertia.',
    role: 'design engineer',
    roleDescription: 'I designed and coded the entire experience: the procedural token geometry, the fluid spring kinematics connecting tokens in a looping stream, and the GPU physics simulation that reacts to scroll velocity.',
    stack: 'Three.js, GLSL, Vite, TypeScript',
    technicalNote: 'Every token is simulated as a rigid body with Verlet integration running directly in fragment shaders. Springs, inertia, and boundary collisions between adjacent tokens execute per particle slot, allowing hundreds of tokens to snake, lag, and settle smoothly with zero main-thread CPU cost.',
    visitUrl: 'https://stream-value.example.com',
    visitLabel: 'Visit Stream of Value',
    category: 'Procedural WebGL & Physics',
    accentColor: '#fde047',
    barcode: 'VAL-0041-TY-2026',
    variant: 'currency',
  },
];

export const PROFILE_INFO = {
  name: 'SOUNAK SARKAR',
  role: 'DESIGN ENGINEER',
  roleSecondary: 'CREATIVE TECHNOLOGIST',
  location: 'Tokyo & San Francisco',
  availability: 'Available for work',
  email: 'sounaksarkar406@gmail.com',
  year: '2026',
  variant: 'VARIANT 01',
  arch: 'ARCH //',
  madeIn: 'Made in Earth',
  copyright: '© 2026',
  social: [
    { label: 'GitHub', url: 'https://github.com' },
    { label: 'X (Twitter)', url: 'https://twitter.com' },
    { label: 'LinkedIn', url: 'https://linkedin.com' },
    { label: 'Lab', url: '#' },
  ],
};
