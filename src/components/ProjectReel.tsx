import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { PROJECTS } from '../lib/projects';
import { ProjectFlag } from './ProjectFlag';

interface ProjectReelProps {
  isActive: boolean;
  liteMode: boolean;
  onComplete: () => void;
}

export const ProjectReel: React.FC<ProjectReelProps> = ({
  isActive,
  liteMode,
  onComplete,
}) => {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const reelRef = useRef<HTMLElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const lastWheelTime = useRef(0);
  const completionTimer = useRef<number | null>(null);
  const hasFinished = useRef(false);
  const [activeIndex, setActiveIndex] = useState(() => prefersReducedMotion ? 0 : -1);
  const [isFinishing, setIsFinishing] = useState(false);

  const finishReel = useCallback(() => {
    if (hasFinished.current) return;
    hasFinished.current = true;
    setIsFinishing(true);
    completionTimer.current = window.setTimeout(
      onComplete,
      prefersReducedMotion ? 0 : 620,
    );
  }, [onComplete, prefersReducedMotion]);

  const showNext = useCallback(() => {
    if (activeIndex < 0) {
      setActiveIndex(0);
    } else if (activeIndex >= PROJECTS.length - 1) {
      finishReel();
    } else {
      setActiveIndex((index) => index + 1);
    }
  }, [activeIndex, finishReel]);

  const showPrevious = useCallback(() => {
    if (activeIndex > 0) setActiveIndex((index) => index - 1);
  }, [activeIndex]);

  useEffect(() => {
    if (!isActive) return;

    const body = document.body;
    const html = document.documentElement;
    const scrollY = window.scrollY;
    const originalBody = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
      touchAction: body.style.touchAction,
    };
    const originalHtmlOverflow = html.style.overflow;

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    body.style.touchAction = 'none';
    html.style.overflow = 'hidden';
    reelRef.current?.focus({ preventScroll: true });

    return () => {
      body.style.position = originalBody.position;
      body.style.top = originalBody.top;
      body.style.width = originalBody.width;
      body.style.overflow = originalBody.overflow;
      body.style.touchAction = originalBody.touchAction;
      html.style.overflow = originalHtmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive || prefersReducedMotion || isFinishing) return;

    const timer = window.setTimeout(() => {
      if (activeIndex < 0) {
        setActiveIndex(0);
      } else if (activeIndex >= PROJECTS.length - 1) {
        finishReel();
      } else {
        setActiveIndex((index) => index + 1);
      }
    }, activeIndex < 0 ? 720 : 1450);

    return () => window.clearTimeout(timer);
  }, [activeIndex, finishReel, isActive, isFinishing, prefersReducedMotion]);

  useEffect(() => () => {
    if (completionTimer.current !== null) {
      window.clearTimeout(completionTimer.current);
    }
  }, []);

  useEffect(() => {
    if (!isActive) {
      hasFinished.current = false;
      setIsFinishing(false);
      setActiveIndex(prefersReducedMotion ? 0 : -1);
    }
  }, [isActive, prefersReducedMotion]);

  useEffect(() => {
    const reel = reelRef.current;
    if (!isActive || !reel) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const now = performance.now();
      if (now - lastWheelTime.current < 430) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;
      if (Math.abs(delta) < 24) return;
      lastWheelTime.current = now;
      if (delta > 0) showNext();
      else showPrevious();
    };

    reel.addEventListener('wheel', handleWheel, { passive: false });
    return () => reel.removeEventListener('wheel', handleWheel);
  }, [isActive, showNext, showPrevious]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'PageDown') {
      event.preventDefault();
      showNext();
    } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      showPrevious();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      finishReel();
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    const touch = event.changedTouches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (!touchStart.current) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) showNext();
      else showPrevious();
    }
    touchStart.current = null;
  };

  if (!isActive) return null;

  return (
    <section
      id="projects"
      ref={reelRef}
      className={`project-reel${isFinishing ? ' is-finishing' : ''}${prefersReducedMotion ? ' is-reduced-motion' : ''}`}
      aria-label="Horizontal project reel"
      aria-roledescription="carousel"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="project-reel__topline">
        <span>SELECTED WORKS / {String(PROJECTS.length).padStart(2, '0')}</span>
        <span className="project-reel__instruction">
          {prefersReducedMotion ? 'ARROWS / SWIPE TO NAVIGATE' : 'REEL IN MOTION / ARROWS OR SWIPE'}
        </span>
      </div>

      <div className="project-reel__viewport">
        <div
          className="project-reel__track"
          style={{
            transform: `translate3d(${
              activeIndex < 0 ? 0 : -activeIndex * 100
            }vw, 0, 0)`,
          }}
        >
          {PROJECTS.map((project, index) => {
            const offset = activeIndex < 0 && index === 0
              ? -100
              : index < activeIndex
                ? 2 * (activeIndex - index) * 100
                : index === activeIndex + 1
                  ? -200
                  : 0;

            return (
              <div
                className="project-reel__slide"
                key={project.id}
                style={{ transform: `translate3d(${offset}vw, 0, 0)` }}
                aria-hidden={index !== activeIndex}
              >
                <ProjectFlag
                  project={project}
                  index={index}
                  total={PROJECTS.length}
                  isActive={index === activeIndex && !isFinishing}
                  liteMode={liteMode}
                  reducedMotion={prefersReducedMotion}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="project-reel__controls">
        <div className="project-reel__navigation">
          <button type="button" onClick={showPrevious} disabled={activeIndex <= 0 || isFinishing}>
            PREVIOUS
          </button>
          <div className="project-reel__progress" role="meter" aria-label="Project reel progress"
            aria-valuemin={1} aria-valuemax={PROJECTS.length}
            aria-valuenow={Math.max(1, activeIndex + 1)}
          >
            {PROJECTS.map((project, index) => (
              <span
                key={project.id}
                className={index <= activeIndex ? 'is-complete' : ''}
                aria-hidden="true"
              />
            ))}
          </div>
          <button type="button" onClick={showNext} disabled={isFinishing}>
            {activeIndex >= PROJECTS.length - 1 ? 'FINISH' : 'NEXT'}
          </button>
        </div>
        <button
          type="button"
          className="project-reel__skip"
          onClick={finishReel}
          disabled={isFinishing}
        >
          VIEW QUALIFICATIONS <span aria-hidden="true">↗</span>
        </button>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {activeIndex >= 0
          ? `Project ${activeIndex + 1} of ${PROJECTS.length}: ${PROJECTS[activeIndex]?.title}`
          : 'Project reel starting'}
      </p>
    </section>
  );
};
