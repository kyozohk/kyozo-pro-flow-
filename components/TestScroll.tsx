"use client";

import React from "react";

const TestScroll: React.FC = () => {
  return (
    <section className="w-full py-16">
      <div className="px-4">
        <div
          className="rounded-[40px] mx-auto relative w-full overflow-hidden max-w-[calc(100vw-6rem)]"
          style={{
            backgroundColor: "#1C1C1C",
            border: `2px solid #1C1C1C`,
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
