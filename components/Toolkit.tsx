import React from 'react';
import Marquee from './Marquee';
import { colors, borderRadius, shadows } from '../styles/theme';

const MarqueeItem = ({ text }: { text: string }) => (
  <div className="flex items-center space-x-3 bg-[${colors.bgSecondary}] border border-[${colors.borderPrimary}] rounded-full px-5 py-3" style={{ boxShadow: shadows.md }}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
    </svg>
    <span className="text-gray-300 font-medium whitespace-nowrap">{text}</span>
  </div>
);

const Toolkit: React.FC = () => {
  const marqueeItems = [
    "The creative paradox",
    "Rediscovering your creative passion",
    "Prompts to Turbocharge Your Creative Process",
    "BPM heartrate and running",
    "The art of storytelling",
    "Unlocking creative flow",
    "Collaborative brainstorming techniques"
  ];

  return (
    <section className="py-24 sm:py-32 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-5xl md:text-6xl font-black leading-tight tracking-tighter">
              CreativeLab<br />Your creative toolkit
            </h2>
          </div>
          <div className="space-y-6">
            <p className="text-gray-400 text-lg leading-relaxed">
              Explore a dynamic resources hub where creativity meets community. Here you'll find a curated collection of articles, videos and resources designed to inspire, inform and ignite your creative journey.
            </p>
            <a href="#" className="inline-flex items-center font-bold text-white group text-lg">
              Check out CreativeLab
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Marquee>
          {marqueeItems.map((item, index) => (
            <MarqueeItem key={index} text={item} />
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Toolkit;
