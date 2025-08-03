import React from 'react';
import ParallaxGallery from '../ParallaxGallery';
import { colors } from '../../styles/theme';
import { MotionValue } from 'framer-motion';

interface EngageProps {
  progress?: MotionValue<number>;
  range?: [number, number];
  targetScale?: number;
}

const Engage: React.FC<EngageProps> = ({ progress, range, targetScale }) => {
  return (
    <div 
      className="border-[1px] border-[#ffffff] rounded-[40px] m-8 mx-50 mb-50 mt-20 relative w-full mx-auto overflow-hidden h-[calc(100vh-10rem)] engage-card"
      style={{ 
        backgroundColor: colors.bgExclusive
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
        {/* Left Column: Content */}
        <div 
          className="flex flex-col pt-16 lg:pt-20 z-10 px-8 md:px-12 lg:px-12"
          style={{ gridColumn: 'span 6 / span 6' }}
        >
          <p className="text-sm font-medium tracking-[0.2em] text-gray-400 mb-4">
            CONNECT
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Engage with your audience
          </h2>
          <p className="text-lg text-gray-300 max-w-md leading-relaxed mb-10">
            Build meaningful connections with your audience through our suite of engagement tools. From personalized messaging to interactive content, we provide everything you need to create a vibrant community around your creative work.
          </p>
          <div className="flex">
            <button 
              onClick={() => console.log('Learn more clicked')}
              className="text-lg font-semibold text-white px-8 py-4 border-1 border-[#D45E9B] rounded-full hover:bg-[#D45E9B]/20 transition-all duration-300"
            >
              Learn more
            </button>
          </div>
        </div>

        {/* Right Column: Content */}
        <div 
          className="z-10 h-full overflow-hidden"
          style={{ gridColumn: 'span 6 / span 6' }}
        >
          <ParallaxGallery />
        </div>
      </div>
    </div>
  );
};

export default Engage;
