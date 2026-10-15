/**
 * Pure portfolio utility logic and mathematical calculations
 * Decoupled for deterministic unit testing with node:test.
 */

export interface ProjectData {
  id: string;
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  year: string;
  category: string;
  client: string;
  role: string;
  duration: string;
  accentColor: string;
  textColor: string;
  passType: 'SPECIMEN' | 'PROTOCOL' | 'SYSTEM' | 'INSTALLATION' | 'ARCHIVE';
  description: string;
  overview: string;
  deliverables: string[];
  techStack: string[];
  metrics: { label: string; value: string }[];
  accentGradient: string;
  barcode: string;
}

/**
 * Calculates smoothed pointer position with exponential damping
 */
export function dampPosition(
  current: { x: number; y: number },
  target: { x: number; y: number },
  lambda: number,
  dt: number
): { x: number; y: number } {
  const factor = 1 - Math.exp(-lambda * dt);
  return {
    x: current.x + (target.x - current.x) * factor,
    y: current.y + (target.y - current.y) * factor,
  };
}

/**
 * Calculates pointer velocity given two positions and delta time
 */
export function calculateVelocity(
  prev: { x: number; y: number },
  current: { x: number; y: number },
  dt: number
): { vx: number; vy: number; speed: number } {
  if (dt <= 0) return { vx: 0, vy: 0, speed: 0 };
  const vx = (current.x - prev.x) / dt;
  const vy = (current.y - prev.y) / dt;
  const speed = Math.sqrt(vx * vx + vy * vy);
  return { vx, vy, speed };
}

/**
 * Deterministic pseudorandom barcode pattern generator based on seed string
 */
export function generateBarcodeBars(seed: string, count: number = 28): number[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    // Generate width between 1 and 4 px
    const val = Math.abs(Math.sin(hash + i * 1.618) * 4);
    bars.push(Math.max(1, Math.floor(val)));
  }
  return bars;
}

/**
 * Formats a project index as a padded two-digit string (e.g. 01, 02)
 */
export function formatProjectNumber(index: number): string {
  return String(index + 1).padStart(2, '0');
}

/**
 * Filter projects by category or return all
 */
export function filterProjects(projects: ProjectData[], category: string): ProjectData[] {
  if (!category || category === 'ALL') return projects;
  return projects.filter(
    (p) => p.category.toUpperCase() === category.toUpperCase() || p.passType === category
  );
}

/**
 * Validate email format for contact transmissions
 */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Clamps a number between min and max
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}
