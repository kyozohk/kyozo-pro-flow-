import React, { useState, useRef, useEffect, ReactNode } from 'react';
import Exclusive from './cards/Exclusive';
import Engage from './cards/Engage';
import Grow from './cards/Grow';

interface SlidingCardsProps {
  children?: ReactNode;
}

export const SlidingCards: React.FC<SlidingCardsProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Use provided children or default to the card components
  const cardComponents = [
    <Exclusive key="exclusive" />,
    <Engage key="engage" />,
    <Grow key="grow" />
  ];
  const childrenArray = children ? React.Children.toArray(children) : cardComponents;
  const numCards = childrenArray.length;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { top, height } = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // Add a threshold to delay the effect until the component is more in view
      const threshold = viewportHeight * 0.2;
      
      // Only start the effect when the container is at least partially in view
      if (top < viewportHeight && top > -height + threshold) {
        const scrollableDistance = height - viewportHeight + threshold;
        const scrolled = Math.max(0, -top + threshold);
        
        if (scrollableDistance > 0) {
          const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
          setScrollProgress(progress);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 

    return () => window.removeEventListener('scroll', handleScroll);
  }, [numCards]);

  const cardsToScrollPast = numCards - 1;
  const cardProgress = scrollProgress * cardsToScrollPast;
  const activeCardIndex = Math.floor(cardProgress);
  const progressInSegment = cardProgress - activeCardIndex;

  return (
    <div ref={containerRef} style={{ height: `${60 + 60 * cardsToScrollPast}vh` }} className="relative mx-12 pb-12">
      <div className="sticky top-[20vh] h-[60vh] w-full">
        {childrenArray.map((child, i) => {
          let transform = 'translateY(100%) scale(1)';
          const zIndex = i;

          if (i <= activeCardIndex) {
            transform = 'translateY(0) scale(1)';
          } else if (i === activeCardIndex + 1) {
            const translateY = 100 - progressInSegment * 100;
            transform = `translateY(${translateY}%) scale(1)`;
          }
          
          if (scrollProgress === 1 && i === numCards - 1) {
             transform = `translateY(0) scale(1)`;
          }

          return (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                zIndex,
                transform,
                transition: 'transform 150ms linear',
              }}
            >
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SlidingCards;
