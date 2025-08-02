"use client";

import React from "react";
import Image from "next/image";
import { colors } from "../styles/theme";

const TestScroll: React.FC = () => {
  return (
    <section className="w-full py-8">
      <div className="px-4">
        <div
          className="rounded-[40px] mx-auto relative w-full overflow-hidden max-w-[calc(100vw-6rem)]"
          style={{
            backgroundColor: colors.bgExclusive,
            border: `2px solid ${colors.borderMedium}`,
          }}
        >
          <div className="flex items-center justify-center h-full text-white text-2xl font-bold">
            Hello World
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestScroll;
