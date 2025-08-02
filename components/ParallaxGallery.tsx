
import React, { useState, useEffect } from 'react';

// Using placeholder images that evoke a mood similar to the provided collage.
const IMAGES = [
  { src: '/Parallax1.jpg', alt: 'DJ at a concert with hands up' },
  { src: '/Parallax2.jpg', alt: 'Singer on stage with smoke' },
  { src: '/Parallax3.jpg', alt: 'Breakdancer performing a handstand' },
  { src: '/Parallax4.jpg', alt: 'Audience enjoying a concert' },
  { src: '/Parallax5.jpg', alt: 'Abstract red light streaks' },
];

// Target end-state transformations for each image (x in vw, y in vh, rotate in deg)
const TARGET_TRANSFORMS = [
  { x: -12, y: -15, rotate: -8 }, // Top-left
  { x: 12, y: -12, rotate: 5 },  // Top-right
  { x: 0, y: 0, rotate: 0 },      // Center
  { x: -15, y: 15, rotate: -5 }, // Bottom-left
  { x: 15, y: 15, rotate: 8 },   // Bottom-right
];

// The scroll distance over which the animation occurs
const ANIMATION_SCROLL_RANGE = 600; // in pixels

const ParallaxImage = ({ image, targetTransform, progress }: { image: { src: string, alt: string }, targetTransform: { x: number, y: number, rotate: number }, progress: number }) => {
  const translateX = targetTransform.x * progress;
  const translateY = targetTransform.y * progress;
  const rotate = targetTransform.rotate * progress;

  return (
    <div
      className="absolute top-1/2 left-1/2"
      style={{
        transform: `translate(calc(-50% + ${translateX}vw), calc(-50% + ${translateY}vh)) rotate(${rotate}deg)`,
        transition: 'transform 150ms ease-out',
      }}
    >
      <div className="overflow-hidden rounded-xl bg-neutral-800 shadow-lg shadow-black/30 md:rounded-2xl">
        <img
          src={image.src}
          alt={image.alt}
          className="h-[25vh] w-auto max-w-none object-cover md:h-[30vh]"
          draggable="false"
        />
      </div>
    </div>
  );
};


const ParallaxGallery = () => {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const animationProgress = Math.min(scrollY / ANIMATION_SCROLL_RANGE, 1);

  return (
    <div className="relative w-full">
      <div className="h-[250vh] bg-neutral-900 text-white">
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
          {/* This div acts as a viewport for the absolutely positioned images */}
          <div className="relative h-full w-full">
            {IMAGES.map((image, index) => (
              <ParallaxImage
                key={image.src}
                image={image}
                targetTransform={TARGET_TRANSFORMS[index]}
                progress={animationProgress}
              />
            ))}
          </div>         
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <main className="bg-neutral-900 antialiased">
      <ParallaxGallery />
    </main>
  );
}
