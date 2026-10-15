import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { PROJECTS, PROFILE_INFO } from '../lib/projects';

const sectionReveal = (reducedMotion: boolean) => reducedMotion
  ? {}
  : {
      initial: { opacity: 0, y: 18 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.15 },
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
    };

export const QualificationsSection: React.FC = () => {
  const reducedMotion = useReducedMotion() ?? false;
  const projectYears = PROJECTS.map(({ year }) => Number(year)).filter(Number.isFinite);
  const projectPeriod = projectYears.length
    ? `${Math.min(...projectYears)}—${Math.max(...projectYears)}`
    : '—';

  return (
    <motion.section
      id="qualifications"
      tabIndex={-1}
      className="portfolio-section"
      {...sectionReveal(reducedMotion)}
    >
      <div className="portfolio-section__heading">
        <div>
          <span className="portfolio-section__eyebrow">01 / BACKGROUND</span>
          <h1>Qualifications</h1>
        </div>
        <p>Selected background and project practice.</p>
      </div>

      <div className="qualification-list">
        <div className="qualification-row">
          <div className="qualification-row__type">EDUCATION</div>
          <div className="qualification-row__main">
            <h2>Education details not listed</h2>
            <p>Institution and qualification information has not been provided.</p>
          </div>
          <div className="qualification-row__date">—</div>
        </div>
        <div className="qualification-row">
          <div className="qualification-row__type">CURRENT ROLE</div>
          <div className="qualification-row__main">
            <h2>{PROFILE_INFO.role} / {PROFILE_INFO.roleSecondary}</h2>
            <p>
              Building considered digital experiences across creative technology,
              interactive graphics, and interface engineering.
            </p>
            <span className="qualification-row__institution">Organization not listed</span>
          </div>
          <div className="qualification-row__date">CURRENT</div>
        </div>
        <div className="qualification-row">
          <div className="qualification-row__type">PROJECT PRACTICE</div>
          <div className="qualification-row__main">
            <h2>Selected engineering and creative technology work</h2>
            <p>
              Project-based roles spanning real-time 3D, spatial audio, WebGPU,
              cartography, haptics, and procedural interaction.
            </p>
            <span className="qualification-row__institution">Portfolio projects</span>
          </div>
          <div className="qualification-row__date">{projectPeriod}</div>
        </div>
      </div>
    </motion.section>
  );
};

const SKILL_GROUPS = [
  {
    label: 'FRONTEND ENGINEERING',
    skills: ['React', 'TypeScript', 'Next.js', 'Vite', 'Zustand'],
  },
  {
    label: 'CREATIVE CODING / GPU',
    skills: ['Three.js', 'WebGL2', 'WebGPU', 'GLSL', 'WGSL'],
  },
  {
    label: 'MOTION / AUDIO',
    skills: ['Motion design', 'Web Audio API', 'AudioWorklet', 'Real-time interaction'],
  },
  {
    label: 'DESIGN / SYSTEMS',
    skills: ['UI/UX design', 'Interaction design', 'Web Workers', 'WebAssembly'],
  },
];

export const SkillsSection: React.FC = () => {
  const reducedMotion = useReducedMotion() ?? false;
  return (
    <motion.section
      id="skills"
      tabIndex={-1}
      className="portfolio-section"
      {...sectionReveal(reducedMotion)}
    >
      <div className="portfolio-section__heading">
        <div>
          <span className="portfolio-section__eyebrow">02 / INDEX</span>
          <h2>Skills &amp; capabilities</h2>
        </div>
        <p>A working toolkit across design, code, and real-time systems.</p>
      </div>

      <div className="skill-index">
        {SKILL_GROUPS.map((group, index) => (
          <div className="skill-index__row" key={group.label}>
            <span className="skill-index__number">{String(index + 1).padStart(2, '0')}</span>
            <h3>{group.label}</h3>
            <ul>
              {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export const CertificatesSection: React.FC = () => {
  const reducedMotion = useReducedMotion() ?? false;
  return (
    <motion.section
      id="certificates"
      tabIndex={-1}
      className="portfolio-section"
      {...sectionReveal(reducedMotion)}
    >
      <div className="portfolio-section__heading">
        <div>
          <span className="portfolio-section__eyebrow">03 / RECORDS</span>
          <h2>Certificates</h2>
        </div>
        <p>Credentials and supporting documents.</p>
      </div>
      <div className="certificate-empty">
        <span className="certificate-empty__mark" aria-hidden="true">—</span>
        <div>
          <h3>No certificates listed</h3>
          <p>Issuing organizations, years, and credential links have not been provided.</p>
        </div>
        <a href={`mailto:${PROFILE_INFO.email}?subject=Portfolio%20credentials`}>
          REQUEST DETAILS <span aria-hidden="true">↗</span>
        </a>
      </div>
    </motion.section>
  );
};
