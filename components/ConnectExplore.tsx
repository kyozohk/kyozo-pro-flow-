"use client";

import React from "react";
import Image from "next/image";
import { colors } from "../styles/theme";

const ConnectExplore: React.FC = () => {
  return (
    <div className="px-4" style={{ marginTop: "-20vh" }}>
      <div
        className="rounded-[40px] mx-auto relative w-full overflow-hidden max-w-[calc(100vw-6rem)]"
        style={{
          backgroundColor: colors.bgExclusive,
          border: `2px solid ${colors.borderMedium}`,
          height: "80vh",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
          {/* Left Column: Content */}
          <div
            className="flex flex-col justify-end ml-30 pb-16 lg:pb-20 z-10 px-8 md:px-12 lg:px-12"
            style={{ gridColumn: "span 5 / span 5" }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Connect.
              <br />
              Explore.
              <br />
              Engage.
            </h2>
            <p className="text-lg text-gray-300 max-w-md leading-relaxed mb-10">
              Connect with visionary creators and forward-thinking communities.
            </p>
            <div className="flex">
              <button
                onClick={() => console.log("Join waitlist clicked")}
                className="text-lg font-semibold text-white px-8 py-4 border border-[#D45E9B] rounded-full hover:bg-[#D45E9B]/20 transition-all duration-300"
              >
                Join the waitlist
              </button>
            </div>
          </div>

          {/* Right Column: Phone */}
          <div
            className="relative z-10 h-full overflow-hidden flex items-end justify-center"
            style={{ gridColumn: "span 7 / span 7" }}
          >
            {/* Phone image */}
            <div className="relative z-20 flex items-end justify-center pb-0" style={{ pointerEvents: "none" }}>
              <div className="overflow-hidden" style={{ height: "90vh", pointerEvents: "none" }}>
                <Image
                  src="/iphone.png"
                  alt="iPhone"
                  width={550}
                  height={1100}
                  className="object-contain translate-y-1/4"
                  style={{ marginBottom: "-10%", pointerEvents: "auto" }}
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

export default ConnectExplore;
