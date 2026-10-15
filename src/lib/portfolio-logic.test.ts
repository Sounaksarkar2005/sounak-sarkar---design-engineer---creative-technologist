import test from 'node:test';
import assert from 'node:assert/strict';
import {
  dampPosition,
  calculateVelocity,
  generateBarcodeBars,
  formatProjectNumber,
  filterProjects,
  validateEmail,
  clamp,
  type ProjectData,
} from './portfolio-logic.ts';

test('dampPosition converges toward target over time', () => {
  const current = { x: 0, y: 0 };
  const target = { x: 100, y: 100 };
  const stepped = dampPosition(current, target, 5, 0.016);
  assert.ok(stepped.x > 0);
  assert.ok(stepped.x < 100);
  assert.equal(stepped.x, stepped.y);
});

test('calculateVelocity accurately computes speed from delta position', () => {
  const prev = { x: 0, y: 0 };
  const current = { x: 30, y: 40 };
  const dt = 1; // 1 second
  const { vx, vy, speed } = calculateVelocity(prev, current, dt);
  assert.equal(vx, 30);
  assert.equal(vy, 40);
  assert.equal(speed, 50); // 3-4-5 triangle
});

test('generateBarcodeBars produces deterministic bar sequence', () => {
  const barsA = generateBarcodeBars('PROJ-01');
  const barsB = generateBarcodeBars('PROJ-01');
  const barsC = generateBarcodeBars('PROJ-02');
  assert.deepEqual(barsA, barsB);
  assert.notDeepEqual(barsA, barsC);
  assert.equal(barsA.length, 28);
});

test('formatProjectNumber formats 0-indexed integer to 2 digits', () => {
  assert.equal(formatProjectNumber(0), '01');
  assert.equal(formatProjectNumber(8), '09');
  assert.equal(formatProjectNumber(9), '10');
});

test('filterProjects handles ALL and specific category', () => {
  const sampleProjects: Partial<ProjectData>[] = [
    { id: '1', category: 'Physical Computing', passType: 'SPECIMEN' },
    { id: '2', category: 'Spatial Audio', passType: 'PROTOCOL' },
  ];
  assert.equal(filterProjects(sampleProjects as ProjectData[], 'ALL').length, 2);
  assert.equal(filterProjects(sampleProjects as ProjectData[], 'Physical Computing').length, 1);
  assert.equal(filterProjects(sampleProjects as ProjectData[], 'SPECIMEN').length, 1);
});

test('validateEmail checks standard email patterns', () => {
  assert.equal(validateEmail('sounaksarkar406@gmail.com'), true);
  assert.equal(validateEmail('invalid-address'), false);
  assert.equal(validateEmail(''), false);
});

test('clamp binds values within range', () => {
  assert.equal(clamp(5, 0, 10), 5);
  assert.equal(clamp(-10, 0, 10), 0);
  assert.equal(clamp(15, 0, 10), 10);
});
