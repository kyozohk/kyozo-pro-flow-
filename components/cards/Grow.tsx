import React from 'react';
import BaseCard from './BaseCard';
import Image from 'next/image';
import { colors } from '../../styles/theme';

const Grow: React.FC = () => {
  return (
    <BaseCard
      title="Grow your creative community"
      subtitle="GO PRO"
      description="Are you a creative professional, community organizer, or small business owner working within the creative industries? We understand the challenges of nurturing and growing a dedicated audience, so we built KyozoPro, a comprehensive platform that enhances genuine connections and unlocks new opportunities."
      buttonText="Join the waitlist"
      buttonAction={() => console.log('Join waitlist clicked')}
      rightContent={
        <div className="relative w-full h-full flex items-center justify-center">
          <Image 
            src="/67ad6aa50a3e3ff8db2983a8_Data.png" 
            alt="Growth analytics dashboard" 
            width={600} 
            height={500}
            className="object-contain"
          />
        </div>
      }
      bgColor={colors.bgExclusive}
      className="grow-card"
      leftColSpan={6}
      rightColSpan={6}
    />
  );
};

export default Grow;
