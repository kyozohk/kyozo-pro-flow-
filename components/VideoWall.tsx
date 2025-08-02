import React, { useMemo } from 'react';

const ROW_COUNT = 12;
const ANIMATION_DURATION_S = ROW_COUNT * 3.5; // Adjust speed by changing the multiplier

// Using videos from the public folder
const VIDEO_SOURCES = [
  '/city.mp4',
  '/concert.mp4',
  '/crafting.mp4',
  '/dancer.mp4',
  '/lights.mp4',
  '/paint.mp4',
  '/performance.mp4',
  '/pottery.mp4',
  '/prod.mp4',
  '/producing.mp4',
];

const getRandomVideo = () => VIDEO_SOURCES[Math.floor(Math.random() * VIDEO_SOURCES.length)];

// Define keyframes for scroll-up animation
const scrollUpKeyframes = `
  @keyframes scroll-up {
    0% { transform: translateY(0); }
    100% { transform: translateY(-50%); }
  }
`;

// --- Helper Components (defined outside main component to prevent re-creation) ---

interface BrickProps {
  videoSrc: string;
}

const Brick: React.FC<BrickProps> = ({ videoSrc }) => (
  <div 
    className="w-[12rem] h-[4rem] rounded-full shadow-lg overflow-hidden relative"
  >
    <video 
      src={videoSrc}
      className="absolute inset-0 w-full h-full object-cover"
      autoPlay
      muted
      loop
      playsInline
    />
  </div>
);

interface RowProps {
  layout: 'A' | 'B';
  videos: [string, string];
  rowIndex: number;
}

const Row: React.FC<RowProps> = ({ layout, videos, rowIndex }) => {
  // Unique key for each brick within the doubled list
  const key1 = `brick-${rowIndex}-0`;
  const key2 = `brick-${rowIndex}-1`;

  // Layout 'A' bricks start at the left edge. They meet at the 12rem mark.
  // Layout 'B' bricks are positioned so the first brick is centered at that 12rem meeting point.
  // A 12rem-wide brick centered at 12rem must start at 6rem (12 - 12/2).
  // The second brick in layout 'B' follows, starting at 18rem (6 + 12).
  const brickStyles = layout === 'A'
    ? [{ left: '0rem' }, { left: '12rem' }]
    : [{ left: '6rem' }, { left: '18rem' }];

  return (
    <div className="relative w-[36rem] my-2 h-[4rem]">
      <div key={key1} className="absolute" style={brickStyles[0]}>
        <Brick videoSrc={videos[0]} />
      </div>
      <div key={key2} className="absolute" style={brickStyles[1]}>
        <Brick videoSrc={videos[1]} />
      </div>
    </div>
  );
};


// --- Main RollingWall Component ---

interface RowData {
  id: number;
  layout: 'A' | 'B';
  videos: [string, string];
}

const RollingWall: React.FC = () => {
  const initialRows = useMemo<RowData[]>(() =>
    Array.from({ length: ROW_COUNT }, (_, i) => ({
      id: i,
      layout: i % 2 === 0 ? 'A' : 'B',
      videos: [getRandomVideo(), getRandomVideo()],
    })), []);

  // Duplicate the rows to create a seamless loop
  const doubledRows = [...initialRows, ...initialRows];
  
  // Calculate viewport height to show ~6 rows. Each row is 4rem high with 1rem total margin (my-2).
  const viewportHeight = `calc(6 * (4rem + 0.5rem * 2))`; 
  
  // We're not using Tailwind's animation class because we need to define our own keyframes
  const animationStyle = {
    animation: `scroll-up ${ANIMATION_DURATION_S}s linear infinite`
  };

  return (
    <div 
      className="relative overflow-hidden w-full h-full" 
    >
      <div className="w-full h-full flex items-center justify-center">
        <style dangerouslySetInnerHTML={{ __html: scrollUpKeyframes }} />
        <div 
          className="relative overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]" 
          style={{ height: '100%', width: '100%' }}
        >
          <div style={animationStyle}>
            {doubledRows.map((row, index) => (
              <Row 
                key={`${row.id}-${index}`} 
                layout={row.layout} 
                videos={row.videos} 
                rowIndex={index} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RollingWall;
