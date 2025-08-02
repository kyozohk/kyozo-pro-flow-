"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { colors } from '../styles/theme';

// Component for the expanding gradient circles
const ExpandingCircles: React.FC = () => {
  const [circles, setCircles] = useState<{ id: number; createdAt: number }[]>([]);
  const [renderTime, setRenderTime] = useState(Date.now());

  const EXPANSION_RATE_PX_PER_S = 120; // Slower expansion
  const MAX_DIAMETER_PX = 1600; // Even larger maximum diameter
  const CIRCLE_GAP_PX = 600; // Much larger gap between circles
  const STATE_UPDATE_INTERVAL_MS = 50;
  const BORDER_WIDTH = 35; // Much thicker border for the circles

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      setCircles(currentCircles => {
        let updatedCircles = currentCircles.filter(circle => {
          const ageMs = now - circle.createdAt;
          const diameter = (ageMs / 1000) * EXPANSION_RATE_PX_PER_S;
          return diameter < MAX_DIAMETER_PX;
        });

        const newestCircle = updatedCircles[updatedCircles.length - 1];

        if (!newestCircle) {
          updatedCircles.push({ id: now, createdAt: now });
        } else {
          const newestCircleAgeMs = now - newestCircle.createdAt;
          const newestCircleDiameter = (newestCircleAgeMs / 1000) * EXPANSION_RATE_PX_PER_S;

          if (newestCircleDiameter >= CIRCLE_GAP_PX) {
            updatedCircles.push({ id: now, createdAt: now });
          }
        }
        return updatedCircles;
      });
    }, STATE_UPDATE_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const loop = () => {
      setRenderTime(Date.now());
      animationFrameId = requestAnimationFrame(loop);
    };
    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="absolute inset-0 flex items-end justify-center z-0 pointer-events-none overflow-visible">
      {circles.map(circle => {
        const ageMs = renderTime - circle.createdAt;
        const diameter = (ageMs / 1000) * EXPANSION_RATE_PX_PER_S;

        if (diameter <= 0) return null;

        const normalizedDiameter = Math.min(diameter, MAX_DIAMETER_PX);
        // Transparency gradient from 50% to 80%
        const opacity = 0.8 - 0.3 * (normalizedDiameter / MAX_DIAMETER_PX);

        return (
          <div
            key={circle.id}
            className="absolute rounded-full"
            style={{
              width: `${diameter}px`,
              height: `${diameter}px`,
              opacity: opacity,
              border: `${BORDER_WIDTH}px solid transparent`,
              backgroundImage: 'linear-gradient(to right top, #8B5CF6, #D946EF, #06B6D4)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'border-box',
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
        );
      })}
    </div>
  );
};

const ConnectExplore: React.FC = () => {
  return (
    <div 
      className="rounded-[40px] mx-12 relative w-full overflow-hidden"
      style={{ 
        backgroundColor: colors.bgExclusive, 
        border: `2px solid ${colors.borderMedium}`,
        height: '80vh' // Reduced by 40% from 100vh
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
        {/* Left Column: Content */}
        <div 
          className="flex flex-col justify-end ml-30 pb-16 lg:pb-20 z-10 px-8 md:px-12 lg:px-12"
          style={{ gridColumn: 'span 5 / span 5' }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Connect.
            <br />
            Explore.
            <br />
            Engage.
          </h2>
          <p className="text-lg text-gray-300 max-w-md leading-relaxed mb-10">
            Connect with visionary creators and forward-thinking communities.
          </p>
          <div className="flex">
            <button 
              onClick={() => console.log('Join waitlist clicked')}
              className="text-lg font-semibold text-white px-8 py-4 border border-[#D45E9B] rounded-full hover:bg-[#D45E9B]/20 transition-all duration-300"
            >
              Join the waitlist
            </button>
          </div>
        </div>

        {/* Right Column: Phone with animated circle */}
        <div 
          className="relative z-10 h-full overflow-hidden flex items-end justify-center"
          style={{ gridColumn: 'span 7 / span 7' }}
        >
          {/* Animated expanding circles */}
          <ExpandingCircles />
          
          {/* Phone image */}
          <div className="relative z-20 flex items-end justify-center pb-0">
            <div className="overflow-hidden" style={{ height: '90vh' }}>
              <Image 
                src="/iphone.png" 
                alt="iPhone" 
                width={550} 
                height={1100} 
                className="object-contain translate-y-1/4"
                style={{ marginBottom: '-10%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectExplore;
