
import React from 'react';

const Bottom: React.FC = () => {
  return (
    <section className="relative bg-[#0D0D0D] py-24 sm:py-48 text-center overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <h2 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
          Join the Kyozo <br />
          creative universe
        </h2>
        <button className="mt-8 bg-gradient-to-r from-[#D646FF] to-[#E74B92] text-white font-bold py-3 px-8 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-[#E74B92]/20">
          Join the waitlist
        </button>
        <p className="mt-24 text-sm text-zinc-500">
          Copyrights © 2025 Kyozo. All right reserved.
        </p>
      </div>

      {/* Bottom Left Shape */}
      <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 -translate-x-1/2 translate-y-1/2 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#D4AF37', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#B8860B', stopOpacity: 0.6 }} />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#goldGradient)" />
        </svg>
      </div>

      {/* Bottom Right Shape */}
      <div className="absolute bottom-0 right-0 w-80 h-80 md:w-[450px] md:h-[450px] translate-x-1/3 translate-y-1/3 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <radialGradient id="purpleGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style={{ stopColor: '#C3B1E1', stopOpacity: 0.7 }} />
              <stop offset="100%" style={{ stopColor: '#8A2BE2', stopOpacity: 0 }} />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="100" fill="url(#purpleGradient)" />
        </svg>
      </div>
    </section>
  );
};

export default Bottom;