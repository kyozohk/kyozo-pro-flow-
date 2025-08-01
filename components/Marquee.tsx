
"use client";

import React, { ReactNode } from 'react';
import './marquee.css';

interface MarqueeProps {
  children: ReactNode;
  duration?: string;
  reverse?: boolean;
}

export const Marquee: React.FC<MarqueeProps> = ({ children, duration = '40s', reverse = false }) => {
  const animationClass = reverse ? 'marquee-reverse' : 'marquee';
  const childrenArray = React.Children.toArray(children);

  return (
    <div className="marquee-container">
      <div
        className={`marquee-content ${animationClass}`}
        style={{ animationDuration: duration }}
      >
        {/* Render children twice for a seamless loop */}
        {childrenArray.map((child, index) => (
          <div key={index} className="marquee-item">
            {child}
          </div>
        ))}
        {childrenArray.map((child, index) => (
          <div key={`clone-${index}`} className="marquee-item" aria-hidden="true">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
