import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PROFILE_INFO } from '../lib/projects';
import { generateBarcodeBars } from '../lib/portfolio-logic';
import { soundEngine } from '../lib/sound-engine';

interface LoaderTicketProps {
  onReady: () => void;
  onEnter: () => void;
}

export const LoaderTicket: React.FC<LoaderTicketProps> = ({ onReady, onEnter }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [canEnter, setCanEnter] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  const barcodeBars = generateBarcodeBars('AENGEL-SOUNAK-PASS-2026', 28);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 1200; // swift 1.2s load

    const timer = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const current = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(current);

      if (current >= 100) {
        clearInterval(timer);
        setCanEnter(true);
        onReady();
        soundEngine.playTick(600, 0.04);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [onReady]);

  const handleEnter = () => {
    if (!canEnter || isEntering) return;
    setIsEntering(true);
    soundEngine.playTick(720, 0.05);
    setIsDone(true);
    window.setTimeout(onEnter, 450);
  };

  const formattedPercentage = String(progress).padStart(progress < 100 ? 3 : 3, '0');

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 bg-[#141414] text-[#d4d4d8] select-none overflow-hidden font-mono"
          role="dialog"
          aria-label="Portfolio Loading Pass"
        >
          {/* Subtle Viewport Grid Lines */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.06]" 
            style={{
              backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          {/* Viewport Frame Border */}
          <div className="absolute inset-4 md:inset-8 border border-white/[0.08] pointer-events-none" />

          {/* Top-Left: Brand & Role (Faithful to Reference) */}
          <div className="absolute top-8 left-8 md:top-12 md:left-12 z-10 space-y-0.5">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-[#f4f4f5] font-sans leading-none">
              {PROFILE_INFO.name}
            </h1>
            <p className="text-sm md:text-base font-bold tracking-wider text-[#a1a1aa] font-sans">
              {PROFILE_INFO.role}
            </p>
          </div>

          {/* Top-Right: Original Minimalist Geometric Logo */}
          <div className="absolute top-8 right-8 md:top-12 md:right-12 z-10">
            <div className="w-8 h-8 border border-white/20 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/80">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Center-Left: Hairline + Enter in the Experience Button */}
          <div className="absolute left-8 md:left-12 top-1/2 -translate-y-1/2 z-10 w-[240px] sm:w-[320px]">
            <div className="relative pb-2">
              <button
                type="button"
                onClick={handleEnter}
                disabled={!canEnter || isEntering}
                aria-label="Enter the project experience"
                className={`text-xs md:text-sm tracking-[0.25em] font-mono uppercase transition-colors flex items-center gap-3 ${
                  canEnter
                    ? 'text-white hover:text-white cursor-pointer'
                    : 'text-white/40 cursor-wait'
                }`}
              >
                <span>ENTER THE EXPERIENCE</span>
                {canEnter && <span className="text-white">→</span>}
              </button>
            </div>
            {/* Horizontal Hairline */}
            <div className="w-full h-[1px] bg-white/20 relative">
              <div 
                className="h-full bg-white transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Bottom-Right: Collectible Pass / Ticket Layout (Faithful to Reference) */}
          <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-10 flex items-end gap-3 sm:gap-4">
            
            {/* Left Box: Procedural Mesh Graphic (.GLB) */}
            <div className="hidden sm:flex flex-col justify-between w-36 h-48 md:w-44 md:h-56 bg-[#18181b] border border-white/10 p-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-[9px] text-white/40">
                <span>SPECIMEN</span>
                <span>.GLB</span>
              </div>

              {/* Procedural Leaf / Organic Ribbon SVG */}
              <div className="my-auto flex items-center justify-center opacity-75">
                <svg width="110" height="110" viewBox="0 0 100 100" fill="none">
                  <path
                    d="M 20 80 C 40 40, 60 20, 85 15 C 80 45, 60 70, 20 80 Z"
                    fill="url(#leafGrad)"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="1"
                  />
                  <path
                    d="M 25 75 C 45 50, 65 35, 80 20"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="1"
                  />
                  <defs>
                    <linearGradient id="leafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#27272a" />
                      <stop offset="50%" stopColor="#52525b" />
                      <stop offset="100%" stopColor="#a1a1aa" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="text-[10px] tracking-widest text-white/40 font-bold uppercase">
                PLANTS // 3D
              </div>
            </div>

            {/* Right Box: Technical Ticket Pass */}
            <div className="w-56 sm:w-64 bg-[#18181b] border border-white/10 p-4 space-y-3 relative shadow-2xl">
              
              {/* Top metadata strip */}
              <div className="flex items-center justify-between text-[10px] text-white/50 border-b border-white/10 pb-2">
                <span className="text-[#a1a1aa] font-semibold">{PROFILE_INFO.arch}</span>
                <span className="text-white/60">{PROFILE_INFO.variant}</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[9px]">Online</span>
                </span>
              </div>

              {/* Wireframe Architectural Arch Plot */}
              <div className="relative h-20 bg-black/40 border border-white/5 overflow-hidden flex items-center justify-center">
                <svg className="w-full h-full opacity-60" viewBox="0 0 120 70">
                  {/* Grid */}
                  <line x1="0" y1="35" x2="120" y2="35" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                  <line x1="60" y1="0" x2="60" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                  {/* Arch Wireframe */}
                  <path
                    d="M 35 60 L 35 35 Q 35 15 60 15 Q 85 15 85 35 L 85 60"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    fill="none"
                  />
                  <path
                    d="M 45 60 L 45 38 Q 45 25 60 25 Q 75 25 75 38 L 75 60"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Middle Section: Cube Wireframe + Made in Earth + Grid Marks */}
              <div className="flex items-center justify-between text-[10px] text-white/50 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border border-white/30 rotate-45" />
                  <div className="text-[9px] uppercase leading-tight">
                    <span className="block text-white/80">{PROFILE_INFO.madeIn}</span>
                    <span className="text-white/40 font-mono tracking-tighter">
                      + + + + + × + + + +
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-[9px] text-white/40 uppercase">ASSETS</span>
                  <span className="text-white/80 text-[10px]">6 / 6 CACHED</span>
                </div>
              </div>

              {/* Large Typography: PORTFOLIO & Large Percentage */}
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-sm font-extrabold tracking-[0.2em] text-white font-sans">
                  PORTFOLIO
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold text-[#f4f4f5] tabular-nums font-sans">
                  {formattedPercentage}
                </span>
              </div>

              {/* Barcode & Footer info */}
              <div className="pt-2 border-t border-dashed border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-[2px] h-6 opacity-75">
                  {barcodeBars.map((w, idx) => (
                    <div key={idx} className="h-full bg-white/80" style={{ width: `${w}px` }} />
                  ))}
                </div>
                <div className="text-[9px] text-white/40 text-right">
                  <span>sounaksarkar.com</span>
                  <span className="block">{PROFILE_INFO.copyright}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom-Center Status */}
          <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-10 text-[10px] tracking-widest text-white/40 uppercase">
            <span>STATUS: {canEnter ? 'READY // PRESS ENTER' : `LOADING // ${progress}%`}</span>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};
