import React from 'react';

const CoCircles: React.FC = () => {
  // Base classes for a single ripple circle, adapted for the large background effect.
  const rippleClasses = `
    absolute top-1/2 left-1/2 
    w-[30rem] h-[30rem] sm:w-[60rem] sm:h-[60rem] md:w-[80rem] md:h-[80rem]
    -translate-x-1/2 -translate-y-1/2 
    rounded-full 
    border-2 border-cyan-400/30
    [animation:concentric-ripple_2s_cubic-bezier(0,0.2,0.8,1)_infinite]
  `;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="absolute w-full h-full">
        {/* We render multiple divs, each representing a concentric circle.
            The animation-delay is staggered to create the ripple effect. */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={rippleClasses}
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default CoCircles;