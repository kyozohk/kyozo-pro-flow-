import React from 'react';
import BaseCard from './BaseCard';
import ParallaxGallery from '../ParallaxGallery';
import { colors } from '../../styles/theme';

const Engage: React.FC = () => {
  return (
    <BaseCard
      title="Engage with visionary communities"
      subtitle="COMMUNITY CONNECTIONS"
      description="Join and interact with diverse communities, from niche artistic circles to industry-leading collectives. Engage with passionate individuals who share your creative interests."
      buttonText="Join the waitlist"
      buttonAction={() => console.log('Join waitlist clicked')}
      rightContent={<ParallaxGallery />}
      bgColor={colors.bgExclusive}
      className="engage-card"
    />
  );
};

export default Engage;
