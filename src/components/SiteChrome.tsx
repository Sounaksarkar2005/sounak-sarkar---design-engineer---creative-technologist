import React, { useState } from 'react';
import { PROFILE_INFO } from '../lib/projects';
import { soundEngine } from '../lib/sound-engine';

interface SiteChromeProps {
  isMuted: boolean;
  onToggleSound: () => void;
  liteMode: boolean;
  onToggleLiteMode: () => void;
  onNavigate: (sectionId: string) => void;
}

export const SiteChrome: React.FC<SiteChromeProps> = ({
  isMuted,
  onToggleSound,
  liteMode,
  onToggleLiteMode,
  onNavigate,
}) => {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCopyEmail = async () => {
    soundEngine.playTick(540, 0.04);
    try {
      await navigator.clipboard.writeText(PROFILE_INFO.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleMenuNav = (id: string) => {
    soundEngine.playTick(480, 0.04);
    setMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      {/* Minimal Fixed Site Chrome with frosted backing on scroll */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 md:px-10 py-3.5 bg-[#141414]/90 backdrop-blur-md border-b border-white/[0.06] transition-colors pointer-events-none font-mono">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          
          {/* Upper-Left: Minimal Geometric Logo + Name & Role */}
          <div className="flex items-center gap-3.5 pointer-events-auto">
            <button
              type="button"
              onClick={() => handleMenuNav('qualifications')}
              className="group flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
              aria-label="Scroll to qualifications"
            >
              {/* Original Geometric Icon (Square with concentric circle) */}
              <div className="w-6 h-6 border border-white/30 flex items-center justify-center group-hover:border-white transition-colors bg-[#141414]">
                <div className="w-2 h-2 rounded-full border border-white/60" />
              </div>
              <div className="leading-tight">
                <span className="block text-xs font-bold tracking-tight text-[#f4f4f5] font-sans">
                  {PROFILE_INFO.name}
                </span>
                <span className="block text-[10px] tracking-wider text-[#a1a1aa] font-sans">
                  {PROFILE_INFO.role}
                </span>
              </div>
            </button>
          </div>

          {/* Upper Edge Center/Right: Availability & Sound & Menu */}
          <div className="flex items-center gap-4 sm:gap-6 pointer-events-auto text-xs text-white/70">
            
            {/* Availability Indicator & Email Copy */}
            <button
              type="button"
              onClick={handleCopyEmail}
              className="flex items-center gap-2 hover:text-white transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 px-1 py-0.5"
              aria-label="Copy email address"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" aria-hidden="true" />
              <span className="text-[11px] tracking-wider">
                {copied ? 'Email copied' : PROFILE_INFO.availability}
              </span>
            </button>

            {/* Accessible Live Confirmation */}
            <div aria-live="polite" className="sr-only">
              {copied && `Email address ${PROFILE_INFO.email} copied to clipboard`}
            </div>

            {/* Small Sound Toggle Icon (Opt-in Web Audio) */}
            <button
              type="button"
              onClick={onToggleSound}
              className={`p-1.5 border border-white/10 hover:border-white/30 transition-colors flex items-center justify-center bg-[#141414] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${!isMuted ? 'text-white border-white/40' : 'text-white/40'}`}
              aria-label={isMuted ? 'Unmute ambient sound' : 'Mute ambient sound'}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>

            {/* Small Menu Control */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-[11px] tracking-wider text-white/80 hover:text-white transition-colors border border-white/15 px-2.5 py-1 bg-[#141414] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close navigation overlay' : 'Open navigation overlay'}
            >
              {menuOpen ? 'Close ✕' : 'Menu ☰'}
            </button>

          </div>

        </div>
      </header>

      {/* Compact Dark Overlay Menu (Faithful to Reference) */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#121214]/98 backdrop-blur-md flex flex-col justify-between p-8 md:p-14 font-mono select-none"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
        >
          {/* Menu Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="text-xs text-white/50 tracking-wider">
              {PROFILE_INFO.name} — {PROFILE_INFO.role}
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="text-xs text-white/60 hover:text-white transition-colors border border-white/15 px-3 py-1"
            >
              Close [ESC]
            </button>
          </div>

          {/* Menu Links */}
          <nav className="my-auto max-w-xl space-y-5">
            <div className="text-[10px] tracking-widest text-white/40 uppercase">
              NAVIGATION
            </div>
            <ul className="space-y-4 font-sans text-2xl sm:text-4xl font-bold tracking-tight text-white">
              <li>
                <button
                  type="button"
                  onClick={() => handleMenuNav('qualifications')}
                  className="hover:text-[#a1a1aa] transition-colors flex items-center gap-4 text-left"
                >
                  <span className="text-xs font-mono text-white/30 font-normal">01</span>
                  <span>Qualifications</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleMenuNav('projects')}
                  className="hover:text-[#a1a1aa] transition-colors flex items-center gap-4 text-left"
                >
                  <span className="text-xs font-mono text-white/30 font-normal">02</span>
                  <span>Projects</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleMenuNav('skills')}
                  className="hover:text-[#a1a1aa] transition-colors flex items-center gap-4 text-left"
                >
                  <span className="text-xs font-mono text-white/30 font-normal">03</span>
                  <span>Skills &amp; capabilities</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleMenuNav('certificates')}
                  className="hover:text-[#a1a1aa] transition-colors flex items-center gap-4 text-left"
                >
                  <span className="text-xs font-mono text-white/30 font-normal">04</span>
                  <span>Certificates</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleMenuNav('about')}
                  className="hover:text-[#a1a1aa] transition-colors flex items-center gap-4 text-left"
                >
                  <span className="text-xs font-mono text-white/30 font-normal">05</span>
                  <span>About</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleMenuNav('contact')}
                  className="hover:text-[#a1a1aa] transition-colors flex items-center gap-4 text-left"
                >
                  <span className="text-xs font-mono text-white/30 font-normal">06</span>
                  <span>Contact</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onToggleLiteMode}
                  className="hover:text-[#a1a1aa] transition-colors flex items-center gap-4 text-left"
                >
                  <span className="text-xs font-mono text-white/30 font-normal">07</span>
                  <span>Lite Version [{liteMode ? 'ON' : 'OFF'}]</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleMenuNav('projects')}
                  className="hover:text-[#a1a1aa] transition-colors flex items-center gap-4 text-left text-white/60"
                >
                  <span className="text-xs font-mono text-white/30 font-normal">08</span>
                  <span>Lab & Experiments ↗</span>
                </button>
              </li>
            </ul>
          </nav>

          {/* Menu Bottom Meta */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
            <div>
              <span>{PROFILE_INFO.email}</span>
            </div>
            <div className="flex items-center gap-4">
              {PROFILE_INFO.social.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
