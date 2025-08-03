'use client';
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ConcentricCircles } from './index';
import CenterCircle from './CenterCircle';

const Toolkit: React.FC = () => {
  const controlsLeft = useAnimation();
  const controlsRight = useAnimation();
  
  useEffect(() => {
    const animateShapes = async () => {
      await Promise.all([
        controlsLeft.start({
          x: 0,
          opacity: 1,
          transition: { duration: 1.2, ease: 'easeOut' }
        }),
        controlsRight.start({
          x: 0,
          opacity: 1,
          transition: { duration: 1.2, ease: 'easeOut' }
        })
      ]);
    };
    
    animateShapes();
  }, [controlsLeft, controlsRight]);
  return (
    <section className="py-24 sm:py-32 px-4 overflow-hidden bg-black relative">
      {/* Left animated shape */}
      <motion.div
        initial={{ x: -400, y:-400, opacity: 0 }}
        animate={controlsLeft}
        className="absolute left-0 top-0 z-10 w-[30%] h-auto transform -translate-x-1/3 z-1000"
      >
        <ConcentricCircles />
      </motion.div>
      
      {/* Bottom right CenterCircle */}
      <motion.div
        initial={{ x: 30, y: 30, opacity: 0 }}
        animate={controlsRight}
        className="absolute right-0 bottom-0 z-10 w-[25%] h-auto transform translate-x-1/4 translate-y-1/4"
      >
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <CenterCircle cx={50} cy={50} radius={50} />
        </svg>
      </motion.div>
      <div className="max-w-7xl mx-auto relative z-10">        
        {/* We are not Social Media section */}
        <div className="text-center mb-20">
        <h1 className="text-6xl md:text-8xl font-bold text-white leading-tight">
        We are not
      </h1>
        <div className="inline-block bg-zinc-900 rounded-full px-10 py-4">
        <h1 className="text-6xl md:text-8xl font-bold text-white leading-tight">
        Social Media
        </h1>

        </div>
        </div>
        
        {/* CreativeLab section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-32">
          {/* Left column with heading */}
          <div>
            <h2 className="text-5xl md:text-6xl font-black leading-tight tracking-tighter text-white">
              CreativeLab<br />Your creative<br />toolkit
            </h2>
          </div>
          
          {/* Right column with description and CTA */}
          <div className="space-y-6">
            <p className="text-gray-300 text-lg leading-relaxed">
              Explore a dynamic resources hub where creativity meets community. 
              Here you'll find a curated collection of articles, videos and resources 
              designed to inspire, inform and ignite your creative journey. Explore a 
              dynamic resources hub where creativity meets community. Here you'll 
              find a curated collection of articles, videos and resources designed to 
              inspire, inform and ignite your creative journey.
            </p>
            
            {/* CTA with arrow icon */}
            <div className="flex items-center space-x-4">
              <a href="#" className="inline-flex items-center font-bold text-white group text-lg">
                Check out CreativeLab
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" 
                  className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default Toolkit;