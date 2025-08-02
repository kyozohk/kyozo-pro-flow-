import React from 'react';
import BaseCard from './BaseCard';
import ParallaxGallery from '../ParallaxGallery';
import { colors } from '../../styles/theme';

const Engage: React.FC = () => {
  return (
    <BaseCard
      title="Engage with your audience"
      subtitle="CONNECT"
      description="Build meaningful connections with your audience through our suite of engagement tools. From personalized messaging to interactive content, we provide everything you need to create a vibrant community around your creative work."
      buttonText="Learn more"
      buttonAction={() => console.log('Learn more clicked')}
      rightContent={<ParallaxGallery />}
      bgColor={colors.bgExclusive}
      className="engage-card"
      leftColSpan={6}
      rightColSpan={6}
    />
  );
};

export default Engage;
