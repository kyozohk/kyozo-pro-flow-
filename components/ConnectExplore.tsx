"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { colors } from '../styles/theme';

// Component for the expanding gradient circles
const ExpandingCircles: React.FC = () => {
  const [circles, setCircles] = useState<{ id: number; createdAt: number }[]>([]);
  const [renderTime, setRenderTime] = useState(Date.now());

  const EXPANSION_RATE_PX_PER_S = 120; // Slower expansion
  const MAX_DIAMETER_PX = 1200; // Larger maximum diameter
  const CIRCLE_GAP_PX = 600; // Much larger gap between circles
  const STATE_UPDATE_INTERVAL_MS = 50;

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
    <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
      {circles.map(circle => {
        const ageMs = renderTime - circle.createdAt;
        const diameter = (ageMs / 1000) * EXPANSION_RATE_PX_PER_S;

        if (diameter <= 0) return null;

        const normalizedDiameter = Math.min(diameter, MAX_DIAMETER_PX);
        // Increased thickness and opacity
        const opacity = 0.8 - 0.6 * (normalizedDiameter / MAX_DIAMETER_PX);

        return (
          <div
            key={circle.id}
            className="absolute rounded-full bg-gradient-to-tr from-fuchsia-500 via-purple-600 to-cyan-500"
            style={{
              width: `${diameter}px`,
              height: `${diameter}px`,
              opacity: opacity,
              filter: 'blur(30px)',
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
      className="rounded-[40px] m-8 mb-50 mt-20 relative w-full mx-auto overflow-hidden h-[calc(100vh-10rem)]"
      style={{ 
        backgroundColor: colors.bgExclusive, 
        border: `2px solid ${colors.borderMedium}`,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
        {/* Left Column: Content */}
        <div 
          className="flex flex-col justify-start pt-16 lg:pt-20 z-10 px-8 md:px-12 lg:px-12"
          style={{ gridColumn: 'span 6 / span 6' }}
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
          className="relative z-10 h-full overflow-hidden flex items-center justify-center"
          style={{ gridColumn: 'span 6 / span 6' }}
        >
          {/* Animated expanding circles */}
          <ExpandingCircles />
          
          {/* Phone image */}
          <div className="relative z-20">
            <Image 
              src="/iphone.png" 
              alt="iPhone" 
              width={270} 
              height={585} 
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectExplore;
