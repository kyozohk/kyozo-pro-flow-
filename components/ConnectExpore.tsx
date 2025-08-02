"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export const ConnectExplore = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    // Start animation after component mounts
    setIsAnimating(true);
    
    // Set up repeating animation
    const interval = setInterval(() => {
      setIsAnimating(false);
      setTimeout(() => setIsAnimating(true), 100);
    }, 3000); // Repeat every 3 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative mt-500 z-20 px-4 sm:px-6 lg:px-8 mx-auto h-[100vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-[#111111] rounded-3xl overflow-hidden shadow-2xl border border-gray-300 mx-[10px] h-[80vh]"
      >
        <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12">
          {/* Left side content */}
          <div className="md:w-1/2 mb-12 md:mb-0 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="max-w-lg"
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                <div>Connect.</div>
                <div>Explore.</div>
                <div>Engage.</div>
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Connect with visionary creators and forward-thinking communities.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="inline-block border border-white rounded-full px-6 py-2 text-white cursor-pointer">
                  Join the waitlist
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Right side iPhone with radial animations */}
          <div className="md:w-1/2 relative flex justify-center">
            {/* Radial animations */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    background: `radial-gradient(circle at center, rgba(124, 58, 237, ${0.3 - i * 0.07}) 0%, rgba(11,11,12,0) 70%)`,
                    width: `${400 + i * 150}px`,
                    height: `${400 + i * 150}px`,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isAnimating ? { 
                    opacity: [0.2, 0.5, 0.2], 
                    scale: [0.8, 1.1, 0.8],
                  } : { opacity: 0.2, scale: 0.8 }}
                  transition={{
                    duration: 2.5,
                    ease: "easeInOut",
                    delay: i * 0.2,
                    repeat: isAnimating ? 0 : 0,
                  }}
                />
              ))}
            </div>
            
            {/* iPhone image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative z-10"
            >
              <Image
                src="/iphone.png"
                alt="Kyozo App on iPhone"
                width={300}
                height={600}
                className="drop-shadow-2xl"
                priority
              />
            </motion.div>
          </div>
        </div>        
      </motion.div>
    </section>
  );
};

// import React from 'react';
// import Image from 'next/image';
// import { Heading2, Paragraph, Button } from './ui/Typography';
// import CirclePhone from './CirclePhone';

// const ConnectExpore: React.FC = () => {
//   return (
//     <section className="relative overflow-hidden bg-[#0D0D0D]">
//       <div className="absolute inset-0 z-0 opacity-40">
//         <div className="absolute -top-32 -left-48 w-96 h-96 bg-purple-900/50 rounded-full filter blur-3xl"></div>
//         <div className="absolute -bottom-32 -right-48 w-96 h-96 bg-cyan-900/50 rounded-full filter blur-3xl"></div>
//       </div>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 sm:py-32 lg:py-40">
//         <div className="grid lg:grid-cols-2 gap-16 items-center">
//           <div className="text-center lg:text-left">
//             <Heading2>
//               Connect.
//               <br />
//               Explore.
//               <br />
//               Engage.
//             </Heading2>
//             <div className="mt-6 max-w-lg mx-auto lg:mx-0">
//               <Paragraph>
//                 Connect with visionary creators and forward-thinking communities.
//               </Paragraph>
//             </div>
//             <div className="mt-10">
//               <Button>
//                 Join the waitlist
//               </Button>
//             </div>
//           </div>
//           <div className="flex justify-center lg:justify-end -mr-8 lg:-mr-24">
//             <div className="relative w-[300px] h-[600px] transform rotate-12">
//                <CirclePhone />  
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

export default ConnectExplore;
