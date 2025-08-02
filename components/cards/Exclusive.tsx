import React from 'react';
import BaseCard from './BaseCard';
import VideoWall from '../VideoWall';
import { colors } from '../../styles/theme';

const Exclusive: React.FC = () => {
  return (
    <BaseCard
      title="Exclusive access and insights"
      subtitle="INSIDER ACCESS"
      description="Experience the creative world through an insider's lens. Kyozo is an eco-system of creative communities - that gives you exclusive access to updates and insights from the creative luminaries driving cultural evolution."
      buttonText="Join the waitlist"
      buttonAction={() => console.log('Join waitlist clicked')}
      rightContent={<VideoWall />}
      bgColor={colors.bgExclusive}
      className="exclusive-card"
      leftColSpan={5}
      rightColSpan={7}
    />
  );
};

export default Exclusive;
