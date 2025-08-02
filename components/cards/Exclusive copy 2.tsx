import React from 'react';

// Update as needed to match your /public/videos folder
const videoSources = [
  'event1.mp4',
  'pottery.mp4',
  'painting.mp4',
  'theatre.mp4',
  'dance.mp4',
  'mixing.mp4',
  'studio.mp4',
  'neon.mp4',
];

// Double sequence for seamless looping
const doubledVideos = [...videoSources, ...videoSources];

// Animation keyframes for smooth vertical scroll
const AnimationStyles = () => (
  <style jsx global>{`
    @keyframes scrollVertical {
      0% { transform: translateY(0%); }
      100% { transform: translateY(-50%); }
    }
    .bubble-animation-container {
      animation: scrollVertical 24s linear infinite;
    }
    .bubble-video::-webkit-media-controls { display: none !important; }
  `}</style>
);

function VideoBrick({ src }) {
  return (
    <div
      className="rounded-full shadow-lg overflow-hidden flex-shrink-0 border"
      style={{
        width: 260,          // Rectangle width: Feel free to tune
        height: 120,         // Rectangle height
        background: '#19191A',
        borderColor: '#424243',
        margin: '0 1rem',
        boxShadow: '0 8px 48px 0 #0000001a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <video
        src={`/videos/${src}`}
        autoPlay
        loop
        muted
        playsInline
        className="bubble-video w-full h-full object-cover"
        preload="auto"
      />
    </div>
  );
}

function RollingBrickStack() {
  // Only 5 rows, 2 bricks per row
  const rows = 5;
  const cols = 2;
  // Guarantee enough for seamless loop
  const totalBricks = rows * cols * 2; // double for smooth looping
  const brickVideos = Array.from({ length: totalBricks }, (_, i) =>
    doubledVideos[i % doubledVideos.length]
  );
  return (
    <div className="flex flex-col items-center justify-center"
      style={{
        minHeight: '560px', // or tune as needed
        maxHeight: 650,
        position: 'relative',
        width: '100%',
      }}
    >
      <div
        className="bubble-animation-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          height: '200%',
        }}
      >
        {[...Array(rows * 2)].map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="flex flex-row"
            style={{
              gap: '48px',
              // Offset every odd row for "brick" layout
              marginLeft: rowIdx % 2 !== 0 ? 130 : 0, // half the brick width + half the gap
            }}
          >
            {[...Array(cols)].map((_, colIdx) => {
              const brickIdx = (rowIdx * cols + colIdx) % brickVideos.length;
              return <VideoBrick src={brickVideos[brickIdx]} key={colIdx} />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export const Exclusive = () => (
  <>
    <AnimationStyles />
    <div
      className="not-prose relative left-1/2 w-dvw max-w-none -translate-x-1/2 flex justify-center py-8"
      style={{ background: '#2A2A2B' /* fill background behind the brick wall */ }}
    >
      <div
        className="border border-[#262627] rounded-[40px] p-8 md:p-16 w-full max-w-7xl mx-4 md:mx-12 overflow-hidden"
        style={{
          boxShadow: '0 4px 60px 0 #00000025',
          background: '#2A2A2B',
        }}
      >
        <div className="grid lg:grid-cols-2 gap-x-12">
          {/* Left Content */}
          <div className="flex flex-col justify-center z-10">
            <p className="text-sm font-medium tracking-[0.2em] text-gray-400 mb-4">
              INSIDER ACCESS
            </p>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Exclusive access and insights
            </h1>
            <p className="text-lg text-gray-300 max-w-md leading-relaxed mb-10">
              Experience the creative world through an insider's lens. Kyozo is an eco-system of creative communities - that gives you exclusive access to updates and insights from the creative luminaries driving cultural evolution.
            </p>
            <div className="flex">
              <button className="text-lg font-semibold text-white px-8 py-4 border-2 border-[#D45E9B] rounded-full hover:bg-[#D45E9B]/20 transition-all duration-300">
                Join the waitlist
              </button>
            </div>
          </div>
          {/* Right: Brick Stack */}
          <div className="flex items-center justify-center relative w-full">
            <RollingBrickStack />
          </div>
        </div>
      </div>
    </div>
  </>
);
