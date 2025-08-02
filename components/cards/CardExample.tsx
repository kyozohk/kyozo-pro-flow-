import React from 'react';
import BaseCard from './BaseCard';
import { colors } from '../../styles/theme';

// Example of an image grid for the right side
const ImageGrid = () => (
  <div className="grid grid-cols-2 gap-4">
    {[1, 2, 3, 4].map((item) => (
      <div 
        key={item}
        className={`rounded-[24px] ${
          item === 1 ? 'bg-teal-500/80' : 
          item === 2 ? 'bg-pink-500/80' : 
          item === 3 ? 'bg-sky-500/80' : 
          'bg-indigo-500/80'
        } h-40 shadow-lg`}
      />
    ))}
  </div>
);

// Example of a video placeholder
const VideoPlaceholder = () => (
  <div className="relative rounded-[24px] overflow-hidden bg-gray-800 aspect-video">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-16 border-l-white border-b-8 border-b-transparent ml-1"></div>
      </div>
    </div>
  </div>
);

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
                className={`h-24 w-48 ${placeholderColors[colorIndex]} rounded-[24px] shadow-lg flex-shrink-0`}
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

export const CardExamples: React.FC = () => {
  return (
    <div className="m-15">
      {/* Example with image grid */}
      <BaseCard
        title="Creative Communities"
        subtitle="Connect & Collaborate"
        description="Join a network of creative professionals and collaborate on innovative projects that push boundaries and create new opportunities."
        buttonText="Join Now"
        rightContent={<ImageGrid />}
      />

      {/* Example with video placeholder */}
      <BaseCard
        title="Learn From Experts"
        subtitle="Knowledge Sharing"
        description="Access exclusive tutorials and masterclasses from industry leaders who share their expertise and insights on the latest trends and techniques."
        buttonText="Watch Videos"
        bgColor="#1E1E20"
        rightContent={<VideoPlaceholder />}
      />

      {/* Example with animated bubbles */}
      <BaseCard
        title="Exclusive Access"
        subtitle="Insider Content"
        description="Experience the creative world through an insider's lens. Get exclusive access to updates and insights from the creative luminaries driving cultural evolution."
        buttonText="Join the waitlist"
        rightContent={<AnimatedBubbles />}
      />
    </div>
  );
};

export default CardExamples;
