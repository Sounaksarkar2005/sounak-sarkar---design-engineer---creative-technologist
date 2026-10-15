import React from 'react';
import { PROFILE_INFO } from '../lib/projects';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" tabIndex={-1} className="py-20 border-t border-white/[0.08] max-w-[1400px] mx-auto px-6 md:px-12 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        
        {/* Left: About Heading */}
        <div className="lg:col-span-4 space-y-2 font-mono">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f4f4f5] font-sans">
            About
          </h2>
          <span className="text-xs text-[#a1a1aa] tracking-wider uppercase block">
            {PROFILE_INFO.role} & {PROFILE_INFO.roleSecondary}
          </span>
          <span className="text-xs text-[#71717a] block">
            {PROFILE_INFO.location}
          </span>
          <span className="text-xs text-[#71717a] block pt-2">
            CURRENTLY AVAILABLE FOR SELECT ENGAGEMENTS
          </span>
        </div>

        {/* Right: Editorial Narrative */}
        <div className="lg:col-span-8 space-y-6 text-[#a1a1aa] text-base leading-relaxed font-light">
          <p>
            I am a design engineer and creative technologist based in Tokyo and San Francisco. I design and build high-craft browser tools, 3D interaction layers, WebGL/WebGPU shaders, and kinetic installations.
          </p>
          <p>
            My work sits between technical architecture and sensory craft: turning complex CAD models, ambisonic soundfields, and planetary datasets into fast, responsive, and tactile web interfaces.
          </p>
          <p>
            My working philosophy is to make technical complexity feel clear and physical: purposeful motion, careful performance budgets, and interfaces that reward attention without getting in the way.
          </p>
          <p>
            Areas of interest include real-time graphics, spatial computing, interactive sound, scientific visualization, and the overlap between software and installation.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-6 font-mono text-xs">
            <div>
              <span className="text-white/40 uppercase block mb-1">AVAILABILITY</span>
              <span className="text-white font-medium">Open for select design engineering and creative technology work.</span>
            </div>
            <a
              href={`mailto:${PROFILE_INFO.email}`}
              className="inline-flex items-center gap-2 border-b border-white/40 pb-1 text-white hover:border-white"
            >
              CONTACT ME <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
