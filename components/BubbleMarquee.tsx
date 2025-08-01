
import React, { useState } from 'react';
import Marquee from './Marquee';

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
      className="rounded-full border-2 px-16 py-10 m-2 cursor-pointer"
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="text-2xl whitespace-nowrap py-8 px-10">{text}</span>
    </div>
  );
};

const bubbleRows = [
    { color: '#89CFF0', duration: '30s', reverse: false, tags: ['Funk', 'Hip-Hop', 'Rock', 'Jazz', 'R&B', 'Soul', 'Blues'] },
    { color: '#C3B1E1', duration: '35s', reverse: true, tags: ['Classicism', 'Cubism', 'Modernism', 'Impressionism', 'Baroque', 'Rococo'] },
    { color: '#FDFD96', duration: '25s', reverse: false, tags: ['Recycling', 'Tufting', 'Wood Burning', 'Candle-making', 'Glassblowing', 'Weaving'] },
    { color: '#FF6961', duration: '32s', reverse: true, tags: ['Vintage', 'Boho', 'Punk', 'Avant-garde', 'Gothic', 'Steampunk'] },
    { color: '#DFFF00', duration: '38s', reverse: false, tags: ['Slam Poetry', 'Improv', 'Stand-ups', 'Musical', 'Spoken Word', 'Freestyle Rap'] },
];

const BubbleMarquee: React.FC = () => {
    return (
        <section className="py-24 sm:py-32 overflow-hidden">
            <div className="flex flex-col space-y-[-0.85rem]">
                {bubbleRows.map((row, rowIndex) => (
                    <Marquee key={rowIndex} duration={row.duration} reverse={row.reverse}>
                        {row.tags.map((tag, tagIndex) => (
                            <Bubble key={tagIndex} text={tag} color={row.color} />
                        ))}
                    </Marquee>
                ))}
            </div>
        </section>
    );
};

export default BubbleMarquee;