import React, { useState, useEffect, useRef } from 'react';
import { Heading1 } from './ui/Typography';

const RevealText: React.FC<{text: string}> = ({text}) => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    // Only update state if running in a browser environment
    if (typeof window !== 'undefined') {
      setScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    // Attach and detach scroll listener in a browser environment
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const chars = text.split('');
  const numChars = chars.length;

  const containerHeight = containerRef.current?.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 0);
  // Calculate overall progress of scroll within the first screen height.
  // The animation completes over a scroll distance equal to 100% of the container height for slower reveal
  const progress = containerHeight > 0 ? Math.min(1, scrollY / (containerHeight * 1.0)) : 0;

  return (
    <div ref={containerRef} className="h-[200vh] relative">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="text-center max-w-6xl px-4 z-10">
          <div className="whitespace-pre-wrap" aria-label={text.replace("\n", " ")}>
            {/* Use the same Heading1 component as in Hero */}
            <Heading1>
              {chars.map((char, index) => {
                // Determine the scroll progress range for the current character's animation
                // Slow down the animation by spreading out the character reveal
                const startProgress = index / (numChars * 1.5);
                const endProgress = (index + 1) / (numChars * 1.5);
                
                // Calculate the character's specific animation progress (from 0 to 1)
                let charProgress = 0;
                if (progress >= startProgress) {
                   charProgress = (progress - startProgress) / (endProgress - startProgress);
                }
                
                const clampedCharProgress = Math.max(0, Math.min(1, charProgress));

                // Convert character's progress to background-position-y (from 100% down to 0%)
                // Slow down the transition with a smaller multiplier
                const backgroundPositionY = 100 - (clampedCharProgress * 100);

                const spanStyle: React.CSSProperties = {
                  display: 'inline-block', // Essential for individual background positioning
                  backgroundImage: 'linear-gradient(to bottom, white 0%, #374151 50%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  backgroundSize: '100% 200%',
                  backgroundPosition: `0% ${backgroundPositionY}%`,
                  WebkitTextFillColor: 'transparent',
                  // Add transition for smoother animation
                  transition: 'background-position 0.3s ease-out',
                };

                return (
                  <span key={index} style={spanStyle}>
                    {char}
                  </span>
                );
              })}
            </Heading1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevealText;
