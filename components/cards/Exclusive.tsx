import React from 'react';
import { colors, borderRadius, fontWeights, fontSizes } from '../../styles/theme';

// Custom animation styles component
const AnimationStyles = () => (
  <style jsx global>{`
    @keyframes scrollVertical {
      0% {
        transform: translateY(0);
      }
      100% {
        transform: translateY(-50%);
      }
    }
    
    .bubble-animation-container {
      animation: scrollVertical 30s linear infinite;
    }
  `}</style>
);
const placeholderColors = [
    'bg-teal-500/80', 'bg-pink-500/80',
    'bg-sky-500/80', 'bg-indigo-500/80',
    'bg-rose-500/80', 'bg-amber-500/80',
    'bg-emerald-500/80', 'bg-fuchsia-500/80',
    'bg-cyan-500/80', 'bg-purple-500/80',
  ];
  
  // Reusable grid component for the scrolling animation
  const ImageGrid = () => (
      <div className="space-y-8 py-2">
          {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div
                  key={rowIndex}
                  className={`flex items-center justify-center gap-4 ${rowIndex % 2 !== 0 ? 'ml-12' : 'mr-12'}`}
              >
                  {Array.from({ length: 2 }).map((_, itemIndex) => {
                      const colorIndex = (rowIndex * 2 + itemIndex) % placeholderColors.length;
                      return (
                          <div
                              key={itemIndex}
                              className={`h-30 w-60 ${placeholderColors[colorIndex]} rounded-full shadow-lg flex-shrink-0`}
                          />
                      );
                  })}
              </div>
          ))}
      </div>
  );
export const Exclusive: React.FC = () => (
    <div className="bg-[#2A2A2B] border border-white/10 rounded-[40px] p-8 md:p-16 relative w-full max-w-7xl overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-x-12">
        {/* Left Text Content */}
        <div className="flex flex-col justify-center z-10">
          <p className="text-sm font-medium tracking-[0.2em] text-gray-400 mb-4">INSIDER ACCESS</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Exclusive access and insights
          </h1>
          <p className="text-lg text-gray-300 max-w-md leading-relaxed mb-10">
            Experience the creative world through an insider's lens. Kyozo is an eco-system of creative communities - that gives you exclusive access to updates and insights from the creative luminaries driving cultural evolution.
          </p>
          <div className="flex">
            <button className="text-lg font-semibold text-white px-8 py-4 border-2 border-[#D45E9B] rounded-full hover:bg-[#D45E9B]/20 transition-all duration-300">
              Join the waitlist
            </button>
          </div>
        </div>

        {/* Right Animated Collage Area */}
        <div className="hidden lg:block relative overflow-hidden ">
          <AnimationStyles />
          <div className="absolute top-0 left-0 w-full bubble-animation-container">
            <ImageGrid />
            <ImageGrid /> {/* Second grid for seamless loop */}
          </div>
            </div>
      </div>
    </div>
);
