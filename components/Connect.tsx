"use client";

import React from "react";
import Image from "next/image";
import { colors, shadows, fonts } from "../styles/theme";
import CustomButton from "./CustomButton";

const Connect: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-center py-8" style={{ height: 'calc(100% + 140px)' }}>
      <div
        className="w-full rounded-3xl p-8 md:p-12 flex overflow-hidden border mx-10"
        style={{ 
          backgroundColor: colors.card.background, 
          borderColor: colors.card.border, 
          boxShadow: shadows.card, 
          height: '80%' 
        }}
      >
        <div className="w-full flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Left Column: Content */}
          <div className="w-full md:w-1/2 text-center md:text-center z-10 flex flex-col justify-center h-full py-10">
            <h2
              className="text-4xl md:text-7xl font-bold leading-none tracking-tighter"
              style={{ color: colors.card.headingText, fontFamily: fonts.card, letterSpacing: '-0.03em' }}
            >
              Connect.
              <br />
              Explore.
              <br />
              Engage.
            </h2>
            <div className="mt-4">
              <CustomButton variant="card-outline">
                Join the waitlist
              </CustomButton>
            </div>
          </div>

          {/* Right Column: Phone */}
          <div className="w-full md:w-1/2 relative">            
            <div className="relative z-10 h-full flex items-end justify-end overflow-hidden">
              <div className="relative" style={{ width: '600px', height: '800px', marginBottom: '-100px', marginRight: '-50px' }}>
                <Image
                  src="/iphone.png"
                  alt="Kyozo app on smartphone"
                  width={300}
                  height={600}
                  className="object-contain scale-125"
                  style={{ 
                    filter: `drop-shadow(0 20px 40px rgba(0,0,0,0.5))`,
                    transform: 'scale(1.25) translateY(10%)'
                  }}
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;