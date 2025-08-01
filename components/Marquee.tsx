
import React, { ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  duration?: string;
  reverse?: boolean;
}

const Marquee: React.FC<MarqueeProps> = ({ children, duration = '40s', reverse = false }) => {
  const animationClass = reverse ? 'animate-marquee-reverse' : 'animate-marquee';
  const childrenArray = React.Children.toArray(children);

  return (
    <div className="w-full overflow-x-hidden">
      <div
        className={`flex w-max items-center ${animationClass}`}
        style={{ animationDuration: duration }}
      >
        {/* Render children twice for a seamless loop */}
        {childrenArray.map((child, index) => (
          <div key={index} className="px-3">
            {child}
          </div>
        ))}
        {childrenArray.map((child, index) => (
          <div key={`clone-${index}`} className="px-3" aria-hidden="true">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
