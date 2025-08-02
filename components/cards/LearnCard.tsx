import React from 'react';
import BaseCard from './BaseCard';

// Example of a video placeholder
const VideoPlaceholder = () => (
  <div className="relative rounded-[24px] overflow-hidden bg-gray-800 aspect-video">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-16 border-l-white border-b-8 border-b-transparent ml-1"></div>
      </div>
    </div>
  </div>
);

export const LearnCard: React.FC = () => {
  return (
    <BaseCard
      title="Learn From Experts"
      subtitle="Knowledge Sharing"
      description="Access exclusive tutorials and masterclasses from industry leaders who share their expertise and insights on the latest trends and techniques."
      buttonText="Watch Videos"
      bgColor="#1E1E20"
      rightContent={<VideoPlaceholder />}
    />
  );
};

export default LearnCard;
