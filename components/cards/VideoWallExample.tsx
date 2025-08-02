'use client';

import React from 'react';
import VideoWall from '../VideoWall';
import { colors } from '../../styles/theme';
import CustomButton from '../CustomButton';

// Sample video data
const sampleVideos = [
  { id: 'v1', videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-woman-turning-off-her-alarm-clock-42897-large.mp4' },
  { id: 'v2', videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-man-under-multicolored-lights-1237-large.mp4' },
  { id: 'v3', videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-mother-with-her-little-daughter-eating-a-marshmallow-in-nature-39764-large.mp4' },
  { id: 'v4', videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4' },
  { id: 'v5', videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-winter-fashion-cold-looking-woman-concept-video-39874-large.mp4' },
  { id: 'v6', videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-womans-feet-splashing-in-the-pool-1261-large.mp4' },
  { id: 'v7', videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-a-girl-blowing-a-bubble-gum-at-an-amusement-park-1226-large.mp4' },
  { id: 'v8', videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-spinning-around-the-living-room-41495-large.mp4' },
  { id: 'v9', videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-1240-large.mp4' },
  { id: 'v10', videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-woman-running-above-the-camera-on-a-running-track-32807-large.mp4' },
];

const VideoWallExample: React.FC = () => {
  return (
    <div className="border border-[#3C3C3E] rounded-[40px] p-8 md:p-12 lg:p-16 my-12 relative w-full mx-auto overflow-hidden min-h-[calc(100vh-96px)]"
      style={{ backgroundColor: colors.bgCardAlt }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 h-full">
        {/* Left Column: Content */}
        <div className="flex flex-col pt-16 lg:pt-24 z-10">
          <p className="text-sm font-medium tracking-[0.2em] text-gray-400 mb-4">
            CREATIVE SHOWCASE
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Community Videos
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Explore videos from our creative community members. These videos showcase the diverse talents and projects from artists, designers, and creators around the world.
          </p>
          <div className="mt-auto">
            <CustomButton onClick={() => console.log('View more clicked')}>
              View More
            </CustomButton>
          </div>
        </div>
        
        {/* Right Column: Video Wall */}
        <div className="relative h-[400px] lg:h-full">
          <VideoWall videos={sampleVideos} />
        </div>
      </div>
    </div>
  );
};

export default VideoWallExample;
