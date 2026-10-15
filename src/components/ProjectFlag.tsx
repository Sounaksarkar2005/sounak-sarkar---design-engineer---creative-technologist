import React from 'react';
import { Project } from '../lib/projects';
import { generateBarcodeBars } from '../lib/portfolio-logic';
import { ProjectShaderCanvas } from './ProjectShaderCanvas';

interface ProjectFlagProps {
  project: Project;
  index: number;
  total: number;
  isActive: boolean;
  liteMode: boolean;
  reducedMotion: boolean;
}

const ProjectGraphic: React.FC<{ variant: Project['variant'] }> = ({ variant }) => {
  if (variant === 'chronos') {
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="42" stroke="currentColor" strokeDasharray="2 3" />
        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="50" cy="50" r="16" stroke="currentColor" strokeDasharray="4 2" />
        <path d="M50 10v80M10 50h80M50 25 72 50 50 75 28 50z" stroke="currentColor" />
        <circle cx="50" cy="50" r="3" fill="currentColor" />
      </svg>
    );
  }
  if (variant === 'aether') {
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((step) => (
          <ellipse
            key={step}
            cx="50"
            cy="50"
            rx={18 + step * 5}
            ry={9 + step * 4}
            stroke="currentColor"
            strokeDasharray={step % 2 === 0 ? '4 2' : '1 2'}
            opacity={0.9 - step * 0.12}
          />
        ))}
        <path d="M15 50h70" stroke="currentColor" />
      </svg>
    );
  }
  if (variant === 'lumina') {
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 15 85 80H15zM10 35l32 20 48-10M42 55l50 3M42 55l46 15" stroke="currentColor" />
        <circle cx="42" cy="55" r="2.5" fill="currentColor" />
      </svg>
    );
  }
  if (variant === 'strata') {
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path d="M15 30q35-20 70-5M12 45q33-15 76-3M15 60q40-15 70-2M10 75q38-10 80-3" stroke="currentColor" />
        <circle cx="55" cy="52" r="8" stroke="currentColor" strokeDasharray="2 2" />
      </svg>
    );
  }
  if (variant === 'synapse') {
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="24" stroke="currentColor" strokeDasharray="3 2" />
        <path d="m50 50-25-25m25 25 25-25M50 50 30 75m20-25 20 25" stroke="currentColor" />
        <circle cx="25" cy="25" r="4" fill="currentColor" />
        <circle cx="75" cy="25" r="4" fill="currentColor" />
        <circle cx="30" cy="75" r="4" fill="currentColor" />
        <circle cx="70" cy="75" r="4" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="34" stroke="currentColor" strokeDasharray="2 2" />
      <rect x="36" y="36" width="28" height="28" rx="3" stroke="currentColor" />
      <circle cx="50" cy="50" r="6" stroke="currentColor" />
    </svg>
  );
};

export const ProjectFlag: React.FC<ProjectFlagProps> = ({
  project,
  index,
  total,
  isActive,
  liteMode,
  reducedMotion,
}) => {
  const barcodeBars = generateBarcodeBars(project.barcode, 22);
  const accentStyle: React.CSSProperties & { '--flag-accent': string } = {
    '--flag-accent': project.accentColor,
  };

  return (
    <article
      className={`project-flag${isActive ? ' is-active' : ''}`}
      aria-label={`${project.projectNumber}: ${project.title}`}
      style={accentStyle}
    >
      <header className="project-flag__header">
        <span>{project.projectNumber} <i>/</i> {project.year}</span>
        <span>{project.category}</span>
        <span className="project-flag__serial">{project.barcode}</span>
      </header>

      <div className="project-flag__body">
        <div className="project-flag__copy">
          <span className="project-flag__eyebrow">
            SELECTED WORK <i>//</i> {project.numberDigits}
          </span>
          <h2>{project.title}</h2>
          <p className="project-flag__tagline">{project.tagline}</p>
          <p className="project-flag__description">{project.description}</p>
          <div className="project-flag__specs">
            <div>
              <span>ROLE</span>
              <p>{project.role}</p>
            </div>
            <div>
              <span>STACK</span>
              <p>{project.stack}</p>
            </div>
          </div>
          <a
            href={project.visitUrl}
            target="_blank"
            rel="noreferrer"
            tabIndex={isActive ? 0 : -1}
            className="project-flag__visit"
          >
            {project.visitLabel} <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="project-flag__visual-wrap" aria-hidden="true">
          <div className="project-flag__hanger">
            <span />
            <span />
          </div>
          <div className="project-flag__visual">
            <ProjectShaderCanvas
              variant={project.variant}
              isHovered={isActive}
              liteMode={liteMode || !isActive}
              reducedMotion={reducedMotion}
              accentColor={project.accentColor}
            />
            <div className="project-flag__visual-overlay">
              <div className="project-flag__visual-meta">
                <span>ARCH // VARIANT {project.numberDigits}</span>
                <span><i /> ONLINE</span>
              </div>
              <div className={`project-flag__graphic project-flag__graphic--${project.variant}`}>
                <ProjectGraphic variant={project.variant} />
              </div>
              <div className="project-flag__visual-footer">
                <div className="project-flag__barcode">
                  {barcodeBars.map((width, barIndex) => (
                    <span key={barIndex} style={{ width: `${width}px` }} />
                  ))}
                </div>
                <span>FLEXIBLE SURFACE / {project.numberDigits}</span>
              </div>
            </div>
          </div>
          <div className="project-flag__visual-caption">
            <span>SOUNAK SARKAR // ARCHITECTURE</span>
            <span>INDEX {index + 1} / {total}</span>
          </div>
        </div>
      </div>

      <footer className="project-flag__bottom">
        <span>{project.slug.toUpperCase()}</span>
        <span>PORTFOLIO / 2026</span>
      </footer>
    </article>
  );
};
