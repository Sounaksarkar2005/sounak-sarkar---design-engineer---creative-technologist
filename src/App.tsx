/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { soundEngine } from './lib/sound-engine';
import { LoaderTicket } from './components/LoaderTicket';
import { SiteChrome } from './components/SiteChrome';
import { ProjectReel } from './components/ProjectReel';
import {
  QualificationsSection,
  SkillsSection,
  CertificatesSection,
} from './components/PortfolioSections';
import { AboutSection } from './components/AboutSection';
import { SiteFooter } from './components/SiteFooter';

type ExperiencePhase =
  | 'intro'
  | 'experience-ready'
  | 'reel-active'
  | 'reel-complete'
  | 'vertical-content';

export default function App() {
  const [phase, setPhase] = useState<ExperiencePhase>('intro');
  const [isMuted, setIsMuted] = useState(true);
  const [liteMode, setLiteMode] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setPhase('reel-active');
    }
    if (params.get('lite') === '1') {
      setLiteMode(true);
    }
  }, []);

  useEffect(() => {
    if (phase !== 'reel-complete') return;

    const frame = window.requestAnimationFrame(() => {
      const destinationId = pendingNavigation ?? 'qualifications';
      const destination = document.getElementById(destinationId);
      destination?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });
      destination?.focus({ preventScroll: true });
      setPendingNavigation(null);
      setPhase('vertical-content');
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pendingNavigation, phase]);

  const handleToggleSound = () => {
    const newMuted = soundEngine.toggleMute();
    setIsMuted(newMuted);
  };

  const handleToggleLiteMode = () => {
    soundEngine.playTick(440, 0.04);
    setLiteMode((prev) => !prev);
  };

  const handleNavigate = (sectionId: string) => {
    const destinationId = sectionId === 'top' ? 'qualifications' : sectionId;
    if (phase === 'reel-active' && destinationId !== 'projects') {
      setPendingNavigation(destinationId);
      setPhase('reel-complete');
      return;
    }

    if (sectionId === 'projects' && phase === 'vertical-content') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setPhase('reel-active');
      return;
    }

    const target = document.getElementById(destinationId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoaderReady = useCallback(() => {
    setPhase((current) => current === 'intro' ? 'experience-ready' : current);
  }, []);
  const handleEnter = useCallback(() => {
    setPhase('reel-active');
  }, []);
  const handleReelComplete = useCallback(() => {
    setPhase('reel-complete');
  }, []);

  return (
    <div className="relative min-h-screen bg-[#141414] text-[#d4d4d8] selection:bg-white selection:text-black antialiased font-sans">

      {(phase === 'intro' || phase === 'experience-ready') && (
        <LoaderTicket
          onReady={handleLoaderReady}
          onEnter={handleEnter}
        />
      )}

      <SiteChrome
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        liteMode={liteMode}
        onToggleLiteMode={handleToggleLiteMode}
        onNavigate={handleNavigate}
      />

      <main className="relative z-10">
        <QualificationsSection />
        <SkillsSection />
        <CertificatesSection />
        <AboutSection />
      </main>

      <SiteFooter
        onNavigate={handleNavigate}
        liteMode={liteMode}
        onToggleLiteMode={handleToggleLiteMode}
      />

      <ProjectReel
        isActive={phase === 'reel-active'}
        liteMode={liteMode}
        onComplete={handleReelComplete}
      />
    </div>
  );
}
