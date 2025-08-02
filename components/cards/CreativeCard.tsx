import React from 'react';
import BaseCard from './BaseCard';
import { VideoWall } from '../';

// Video data using videos from public folder
const videoData = [
  { id: 'v1', videoSrc: '/city.mp4' },
  { id: 'v2', videoSrc: '/concert.mp4' },
  { id: 'v3', videoSrc: '/crafting.mp4' },
  { id: 'v4', videoSrc: '/dancer.mp4' },
  { id: 'v5', videoSrc: '/lights.mp4' },
  { id: 'v6', videoSrc: '/paint.mp4' },
  { id: 'v7', videoSrc: '/performance.mp4' },
  { id: 'v8', videoSrc: '/pottery.mp4' },
  { id: 'v9', videoSrc: '/prod.mp4' },
  { id: 'v10', videoSrc: '/producing.mp4' },
];

// Video wall component for the right side
const VideoWallContainer = () => (
  <div className="h-full w-full">
    <VideoWall videos={videoData} />
  </div>
);

export const CreativeCard: React.FC = () => {
  return (
    <BaseCard
      title="Creative Communities"
      subtitle="Connect & Collaborate"
      description="Join a network of creative professionals and collaborate on innovative projects that push boundaries and create new opportunities."
      buttonText="Join Now"
      rightContent={<VideoWallContainer />}
    />
  );
};

export default CreativeCard;
