import React from 'react';
import { PROFILE_INFO } from '../lib/projects';
import { soundEngine } from '../lib/sound-engine';

interface SiteFooterProps {
  onNavigate: (id: string) => void;
  liteMode: boolean;
  onToggleLiteMode: () => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  onNavigate,
  liteMode,
  onToggleLiteMode,
}) => {
  return (
    <footer id="contact" tabIndex={-1} className="border-t border-white/[0.08] bg-[#111112] py-16 px-6 md:px-12 font-mono text-xs text-[#a1a1aa]">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Site Navigation Links (Faithful to Reference) */}
        <nav aria-label="Site">
          <ul className="flex flex-wrap items-center gap-6 text-sm text-[#f4f4f5]">
            <li>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTick(440, 0.03);
                  onNavigate('qualifications');
                }}
                className="hover:text-white transition-colors uppercase tracking-wider"
              >
                Qualifications
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTick(480, 0.03);
                  onNavigate('projects');
                }}
                className="hover:text-white transition-colors uppercase tracking-wider"
              >
                Projects
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTick(520, 0.03);
                  onNavigate('skills');
                }}
                className="hover:text-white transition-colors uppercase tracking-wider"
              >
                Skills
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTick(540, 0.03);
                  onNavigate('certificates');
                }}
                className="hover:text-white transition-colors uppercase tracking-wider"
              >
                Certificates
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTick(560, 0.03);
                  onNavigate('about');
                }}
                className="hover:text-white transition-colors uppercase tracking-wider"
              >
                About
              </button>
            </li>
            <li>
              <a
                href={`mailto:${PROFILE_INFO.email}`}
                className="hover:text-white transition-colors uppercase tracking-wider"
              >
                Contact
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={onToggleLiteMode}
                className="text-[#71717a] hover:text-white transition-colors uppercase tracking-wider"
              >
                Lite Mode [{liteMode ? 'ON' : 'OFF'}]
              </button>
            </li>
          </ul>
        </nav>

        {/* Identity & Legal & Social Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-white/[0.06] text-xs">
          
          {/* Brand & Title */}
          <div className="space-y-1">
            <div className="text-white font-bold tracking-tight text-sm font-sans uppercase">
              {PROFILE_INFO.name}
            </div>
            <div className="text-[#71717a] tracking-wider text-[11px]">
              {PROFILE_INFO.role}
            </div>
          </div>

          {/* Copyright & Lab */}
          <div className="space-y-1 text-[#71717a]">
            <div>sounaksarkar.com — {PROFILE_INFO.year}</div>
            <div className="flex items-center gap-4">
              <span>Legal notice</span>
              <span>·</span>
              <button
                type="button"
                onClick={() => onNavigate('projects')}
                className="hover:text-white transition-colors"
              >
                Lab & Experiments
              </button>
            </div>
          </div>

          {/* Email & Social Links */}
          <div className="space-y-2 md:text-right">
            <div>
              <a
                href={`mailto:${PROFILE_INFO.email}`}
                className="text-white hover:text-white/80 transition-colors font-medium"
              >
                {PROFILE_INFO.email}
              </a>
            </div>
            <div className="flex items-center md:justify-end gap-4 text-[#71717a]">
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

      </div>
    </footer>
  );
};
