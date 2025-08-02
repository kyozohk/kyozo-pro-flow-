import React from 'react';
import BaseCard from './BaseCard';

// Example of animated bubbles
const AnimatedBubbles = () => {
  // Custom animation styles
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
  ];
  
  const BubbleGrid = () => (
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

  return (
    <div className="relative h-[400px] overflow-hidden">
      <AnimationStyles />
      <div className="absolute top-0 left-0 w-full bubble-animation-container">
        <BubbleGrid />
        <BubbleGrid /> {/* Second grid for seamless loop */}
      </div>
      {/* Gradient overlay for smoother fade effect */}
      <div className="absolute inset-0 pointer-events-none" style={{ 
        background: 'linear-gradient(to bottom, rgba(42,42,43,1) 0%, rgba(42,42,43,0) 10%, rgba(42,42,43,0) 90%, rgba(42,42,43,1) 100%)'
      }}></div>
    </div>
  );
};

export const InsightCard: React.FC = () => {
  return (
    <BaseCard
      title="Exclusive Access"
      subtitle="Insider Content"
      description="Experience the creative world through an insider's lens. Get exclusive access to updates and insights from the creative luminaries driving cultural evolution."
      buttonText="Join the waitlist"
      rightContent={<AnimatedBubbles />}
    />
  );
};

export default InsightCard;
