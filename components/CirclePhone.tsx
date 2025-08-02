
import React from 'react';
import Image from 'next/image';

const CirclePhone: React.FC = () => {
  return (
    // A container to establish a positioning context and responsive size
    <div className="relative flex items-center justify-center w-[300px] h-[600px] sm:w-[350px] sm:h-[700px]">

      {/* Animated Outer Ring: Expands and pulses infinitely */}
      <div className="absolute w-[240%] h-auto aspect-square rounded-full flex items-center justify-center animate-expand-pulse blur-2xl">
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-fuchsia-500 via-purple-600 to-cyan-500 p-[16px]">
            <div className="w-full h-full bg-black rounded-full" />
        </div>
      </div>

      {/* Static Inner Ring */}
      <div className="absolute w-[180%] h-auto aspect-square rounded-full flex items-center justify-center blur-xl">
         <div className="w-full h-full rounded-full bg-gradient-to-tr from-fuchsia-500 via-purple-600 to-cyan-500 p-[12px]">
            <div className="w-full h-full bg-black rounded-full" />
        </div>
      </div>
      
      {/* Phone Screen with Content */}
      <Image src="/iphone.png" alt="iPhone" width={270} height={585} />                            
    </div>
  );
};

export default CirclePhone;
