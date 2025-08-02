"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heading1 } from "./ui/Typography";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-x-hidden">
      {/* Top-left radial purple gradient (shorter height) */}
      <div
        className="absolute top-[-100px] left-0 rounded-full -translate-x-1/3 -translate-y-1/3"
        style={{
          width: "1600px",
          height: "1000px", // shorter height
          background:
            "radial-gradient(circle at center, rgba(64,192,172,0.3) 0%, rgba(11,11,12,0) 50%)",
        }}
      ></div>

      {/* Top-right radial teal gradient (shorter height) */}
      <div
        className="absolute top-[-300px] right-0 [rounded-full translate-x-1/3 -translate-y-1/3"
        style={{
          width: "1000px",
          height: "1400px", // shorter height
          background:
            "radial-gradient(circle at center, rgba(187, 98, 73, 0.3) 0%, rgba(11,11,12,0) 70%)",
        }}
      ></div>

      {/* Bottom-right radial purple gradient (new) */}
      <div
        className="absolute bottom-0  right-40 z-0 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle at center, rgba(185,163,255,0.34) 0%, rgba(11,11,12,0) 70%)",
        }}
      ></div>

      {/* Top SVG - Golden Circles with only 2 circles, thicker lines, clipped 60% height */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[50%] opacity-80 w-full max-w-[800px] overflow-hidden"
        style={{ height: "480px" }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <circle
              cx="400"
              cy="400"
              r="100"
              stroke="#EEC87E"
              strokeOpacity="1.0"
              strokeWidth="60"
            />
            <circle
              cx="400"
              cy="400"
              r="200"
              stroke="#EEC87E"
              strokeOpacity="1.0"
              strokeWidth="60"
            />
          </motion.g>
          <defs>
            <linearGradient
              id="gold_gradient"
              x1="400"
              y1="0"
              x2="400"
              y2="800"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#D4AF37" />
              <stop offset="1" stopColor="#D4AF37" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Bottom Left Shape */}
      <motion.div
        className="absolute bottom-[-280px] left-0 z-0"
        style={{ transform: "translateY(calc(75% + 100px))" }}
        initial={{ opacity: 0, x: -50, y: 50 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
      >
        <Image
          src="/bottom-left.png"
          alt="Bottom Left Shape"
          width={300}
          height={300}
          className="opacity-80"
        />
      </motion.div>

      {/* Bottom Right Shape */}
      <motion.div
        className="absolute bottom-[-140px] right-[-10px] z-0"
        style={{ transform: "translateY(calc(75% + 100px))" }}
        initial={{ opacity: 0, x: 50, y: 50 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
      >
        <Image
          src="/bottom-right.png"
          alt="Bottom Right Shape"
          width={300}
          height={300}
          className="opacity-80"
        />
      </motion.div>

      {/* Main Heading */}
      <div className="z-10 flex flex-col items-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="z-10 mb-8"
        >
          <Heading1>Discover your creative universe</Heading1>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
