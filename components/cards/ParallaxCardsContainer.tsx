import React, { useRef } from 'react';
import { useScroll, motion, useTransform } from 'framer-motion';
import Engage from './Engage';
import Exclusive from './Exclusive';
import Grow from './Grow';

export const ParallaxCardsContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Create motion values for each card
  const engageScale = useTransform(scrollYProgress, [0, 0.33], [1, 0.95]);
  const exclusiveScale = useTransform(scrollYProgress, [0.33, 0.67], [1, 0.9]);
  const growScale = useTransform(scrollYProgress, [0.67, 1], [1, 0.85]);

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-16">
      {/* Each card gets a different scale range to create the staggered effect */}
      <motion.div style={{ scale: engageScale }}>
        <Engage progress={scrollYProgress} range={[0, 0.33]} targetScale={0.95} />
      </motion.div>
      
      <motion.div style={{ scale: exclusiveScale }}>
        <Exclusive progress={scrollYProgress} range={[0.33, 0.67]} targetScale={0.9} />
      </motion.div>
      
      <motion.div style={{ scale: growScale }}>
        <Grow progress={scrollYProgress} range={[0.67, 1]} targetScale={0.85} />
      </motion.div>
    </div>
  );
};
