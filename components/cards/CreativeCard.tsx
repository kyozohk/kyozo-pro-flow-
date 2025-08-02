import React from 'react';
import BaseCard from './BaseCard';

// Example of an image grid for the right side
const ImageGrid = () => (
  <div className="grid grid-cols-2 gap-4">
    {[1, 2, 3, 4].map((item) => (
      <div 
        key={item}
        className={`rounded-[24px] ${
          item === 1 ? 'bg-teal-500/80' : 
          item === 2 ? 'bg-pink-500/80' : 
          item === 3 ? 'bg-sky-500/80' : 
          'bg-indigo-500/80'
        } h-40 shadow-lg`}
      />
    ))}
  </div>
);

export const CreativeCard: React.FC = () => {
  return (
    <BaseCard
      title="Creative Communities"
      subtitle="Connect & Collaborate"
      description="Join a network of creative professionals and collaborate on innovative projects that push boundaries and create new opportunities."
      buttonText="Join Now"
      rightContent={<ImageGrid />}
    />
  );
};

export default CreativeCard;
