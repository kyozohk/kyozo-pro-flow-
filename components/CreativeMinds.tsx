'use client';
import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const CreativeMinds: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <section className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Gradient overlay in bottom right */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-teal-400/30 to-transparent z-0"></div>
      
      {/* Main text */}
      <motion.div 
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={textVariants}
        className="z-10 text-center px-4"
      >
        <h1 className="text-6xl md:text-8xl font-bold text-white leading-tight">
          Where creative<br />minds converge
        </h1>
      </motion.div>    
    </section>
  );
};

export default CreativeMinds;
