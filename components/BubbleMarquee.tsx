
"use client";

import React, { useState } from 'react';
import { Marquee } from './Marquee';
import { bubbleRowColors } from '../lib/colors';

const Bubble = ({ text, color }: { text: string; color: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  const style = {
    borderColor: color,
    backgroundColor: isHovered ? color : 'transparent',
    color: isHovered ? '#0D0D0D' : 'white',
    transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
  };

  return (
    <div
      className="rounded-full border-2 px-26 py-10 cursor-pointer inline-flex items-center justify-center"
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="text-2xl font-medium whitespace-nowrap">{text}</span>
    </div>
  );
};

const bubbleRows = [
    { color: bubbleRowColors.music, duration: '30s', reverse: false, tags: ['Rock', 'Jazz', 'R&B', 'Trance', 'Techno'] },
    { color: bubbleRowColors.artMovements, duration: '35s', reverse: true, tags: ['Expressionism', 'Futurism', 'Classicism', 'Cubism'] },
    { color: bubbleRowColors.crafts, duration: '25s', reverse: false, tags: ['Wood Burning', 'Candle-making', 'Crochet', 'Jewelry', 'Candle-making', 'Crochet', 'Jewelry'] },
    { color: bubbleRowColors.fashion, duration: '32s', reverse: true, tags: ['Chic', 'Grunge', 'Vintage', 'Boho', 'Chic', 'Grunge', 'Vintage', 'Boho'] },
    { color: bubbleRowColors.performance, duration: '38s', reverse: false, tags: ['Stand-ups', 'Musical', 'Digital', 'Stand-ups', 'Musical', 'Digital'] },
];

const BubbleMarquee: React.FC = () => {
    return (
        <section className="py-24 sm:py-32 overflow-hidden">
            <div className="flex flex-col space-y-1">
                {bubbleRows.map((row, rowIndex) => {
                    // Calculate a slight curve for each row
                    const rotationAngle = rowIndex % 2 === 0 ? 0.2 : -0.2;
                    
                    return (
                        <div 
                            key={rowIndex} 
                            className="py-0"
                            style={{
                                transform: `rotate(${rotationAngle}deg)`,
                            }}
                        >
                            <Marquee duration={row.duration} reverse={row.reverse}>
                                {row.tags.map((tag, tagIndex) => (
                                    <Bubble key={tagIndex} text={tag} color={row.color} />
                                ))}
                            </Marquee>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default BubbleMarquee;