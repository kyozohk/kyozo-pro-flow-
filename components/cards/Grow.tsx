import React from 'react';
import Image from 'next/image';
import { colors } from '../../styles/theme';
import { MotionValue } from 'framer-motion';

interface GrowProps {
  progress?: MotionValue<number>;
  range?: [number, number];
  targetScale?: number;
}

const Grow: React.FC<GrowProps> = ({ progress, range, targetScale }) => {
  return (
    <div 
      className="border-[1px] border-[#ffffff] rounded-[40px] m-8 mx-50 mb-50 mt-20 relative w-full mx-auto overflow-hidden h-[calc(100vh-10rem)] grow-card"
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
            GO PRO
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Grow your creative community
          </h2>
          <p className="text-lg text-gray-300 max-w-md leading-relaxed mb-10">
            Are you a creative professional, community organizer, or small business owner working within the creative industries? We understand the challenges of nurturing and growing a dedicated audience, so we built KyozoPro, a comprehensive platform that enhances genuine connections and unlocks new opportunities.
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
          style={{ gridColumn: 'span 6 / span 6' }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <Image 
              src="/67ad6aa50a3e3ff8db2983a8_Data.png" 
              alt="Growth analytics dashboard" 
              width={600} 
              height={500}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grow;
