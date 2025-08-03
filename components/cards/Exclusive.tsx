import React from 'react';
import VideoWall from '../VideoWall';
import { colors } from '../../styles/theme';
import { MotionValue } from 'framer-motion';

interface ExclusiveProps {
  progress?: MotionValue<number>;
  range?: [number, number];
  targetScale?: number;
}

const Exclusive: React.FC<ExclusiveProps> = ({ progress, range, targetScale }) => {
  return (
    <div 
      className="border-[1px] border-[#ffffff] rounded-[40px] m-8 mx-50 mb-50 mt-20 relative w-full mx-auto overflow-hidden h-[calc(100vh-10rem)] exclusive-card"
      style={{ 
        backgroundColor: colors.bgExclusive
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
        {/* Left Column: Content */}
        <div 
          className="flex flex-col pt-16 lg:pt-20 z-10 px-8 md:px-12 lg:px-12"
          style={{ gridColumn: 'span 5 / span 5' }}
        >
          <p className="text-sm font-medium tracking-[0.2em] text-gray-400 mb-4">
            INSIDER ACCESS
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Exclusive access and insights
          </h2>
          <p className="text-lg text-gray-300 max-w-md leading-relaxed mb-10">
            Experience the creative world through an insider's lens. Kyozo is an eco-system of creative communities - that gives you exclusive access to updates and insights from the creative luminaries driving cultural evolution.
          </p>
          <div className="flex">
            <button 
              onClick={() => console.log('Join waitlist clicked')}
              className="text-lg font-semibold text-white px-8 py-4 border-1 border-[#D45E9B] rounded-full hover:bg-[#D45E9B]/20 transition-all duration-300"
            >
              Join the waitlist
            </button>
          </div>
        </div>

        {/* Right Column: Content */}
        <div 
          className="z-10 h-full overflow-hidden"
          style={{ gridColumn: 'span 7 / span 7' }}
        >
          <VideoWall />
        </div>
      </div>
    </div>
  );
};

export default Exclusive;
