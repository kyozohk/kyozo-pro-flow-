import React, { useRef } from 'react';
import { useScroll } from 'framer-motion';
import Engage from './Engage';
import Exclusive from './Exclusive';
import Grow from './Grow';

export const ParallaxCardsContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <div ref={containerRef} className="w-full">
      {/* Each card gets a different scale range to create the staggered effect */}
      <Engage progress={scrollYProgress} range={[0, 0.33]} targetScale={0.95} />
      <Exclusive progress={scrollYProgress} range={[0.33, 0.67]} targetScale={0.9} />
      <Grow progress={scrollYProgress} range={[0.67, 1]} targetScale={0.85} />
    </div>
  );
};
