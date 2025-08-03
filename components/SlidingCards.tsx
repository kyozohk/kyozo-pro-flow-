import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { Card1 } from './cards/Card1';
import { Card2 } from './cards/Card2';
import { Card3 } from './cards/Card3';
import { spacing } from '../styles/theme';

interface SlidingCardsProps {
  children?: ReactNode;
}

export const SlidingCards: React.FC<SlidingCardsProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Use provided children or default to the card components
  const cardComponents = [<Card1 key="card1" />, <Card2 key="card2" />, <Card3 key="card3" />];
  const childrenArray = children ? React.Children.toArray(children) : cardComponents;
  const numCards = childrenArray.length;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { top, height } = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollableDistance = height - viewportHeight;
      const scrolled = -top;
      
      if (scrollableDistance > 0) {
        const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
        setScrollProgress(progress);
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
    <div ref={containerRef} style={{ height: `${100 + 120 * cardsToScrollPast}vh`, paddingLeft: spacing['10'], paddingRight: spacing['10'] }} className="relative w-full mx-auto">
      <div className="sticky top-[10vh] h-[80vh] w-full">
        {childrenArray.map((child, i) => {
          // Cards now have their own spacing with inner bordered divs
          const cardGap = 0; // No additional gap needed between cards
          let transform = `translateY(calc(100% + ${cardGap}px)) scale(1)`;
          const zIndex = i;

          if (i <= activeCardIndex) {
            // Cards stack directly on top of each other
            const stackOffset = 0;
            transform = `translateY(${stackOffset}px) scale(1)`;
          } else if (i === activeCardIndex + 1) {
            // Smoothly slide up the next card
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