import React, { useMemo, useEffect } from 'react';
import { colors } from '../styles/theme';

const ROW_COUNT = 12;
const bubbleGapRem = 3; // Gap for horizontal and vertical spacing (1.25rem = 20px)

// Animation duration (seconds)
const ANIMATION_DURATION_S = ROW_COUNT * 3.5;

// Video sources
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

// Scroll-up keyframes for animation
const scrollUpKeyframes = `
  @keyframes scroll-up {
    0% { transform: translateY(0); }
    100% { transform: translateY(-50%); }
  }
`;

interface BrickProps {
  videoSrc: string;
}

const Brick: React.FC<BrickProps> = ({ videoSrc }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(e => console.error('Video play error:', e));
    }
  }, [videoSrc]);

  return (
    <div className="w-[18rem] h-[8rem] rounded-full shadow-lg overflow-hidden relative">
      <video
        ref={videoRef}
        src={videoSrc}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  );
};

interface RowProps {
  layout: 'A' | 'B';
  videos: [string, string];
  rowIndex: number;
}

const Row: React.FC<RowProps> = ({ layout, videos, rowIndex }) => {
  const key1 = `brick-${rowIndex}-0`;
  const key2 = `brick-${rowIndex}-1`;

  const spacing = `${bubbleGapRem}rem`;

  // Horizontal positions for bricks depending on layout
  const brickStyles = layout === 'A'
    ? [{ left: '0rem' }, { left: `calc(18rem + ${spacing})` }]
    : [{ left: '9rem' }, { left: `calc(27rem + ${spacing})` }];

  // Vertical margin equal to the gap
  const marginVertical = bubbleGapRem;

  return (
    <div
      className="relative w-[54rem]"
      style={{
        marginTop: `${marginVertical}rem`,
        marginBottom: `${marginVertical}rem`,
        height: '6.5rem'
      }}
    >
      <div key={key1} className="absolute" style={brickStyles[0]}>
        <Brick videoSrc={videos[0]} />
      </div>
      <div key={key2} className="absolute" style={brickStyles[1]}>
        <Brick videoSrc={videos[1]} />
      </div>
    </div>
  );
};

interface RowData {
  id: number;
  layout: 'A' | 'B';
  videos: [string, string];
}

const VideoWall: React.FC = () => {
  // Initialize rows
  const initialRows = useMemo<RowData[]>(() =>
    Array.from({ length: ROW_COUNT }, (_, i) => ({
      id: i,
      layout: i % 2 === 0 ? 'A' : 'B',
      videos: [getRandomVideo(), getRandomVideo()],
    })), []);

  // Duplicate rows for seamless animation
  const doubledRows = [...initialRows, ...initialRows];

  // Calculate viewport height for ~6 rows with vertical spacing
  const viewportHeight = `calc(6 * (7.2rem + ${bubbleGapRem * 2}rem))`;

  const animationStyle = {
    animation: `scroll-up ${ANIMATION_DURATION_S}s linear infinite`
  };

  return (
    <div className="relative overflow-hidden w-full h-full">
      <style dangerouslySetInnerHTML={{ __html: scrollUpKeyframes }} />
      <div
        className="relative overflow-hidden"
        style={{ height: viewportHeight, width: '100%' }}
      >
        <div className="w-full" style={animationStyle}>
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
      {/* Top fade-out gradient
      <div className="absolute top-0 left-0 right-0 h-[40px] bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" aria-hidden="true"></div>
      
      <div className="absolute bottom-0 left-0 right-0 h-[40px] bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" aria-hidden="true"></div> */}
    </div>    
  );
};

export default VideoWall;
