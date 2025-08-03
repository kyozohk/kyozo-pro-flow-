import React from 'react';
import { colors, shadows, fonts } from '../../styles/theme';
import CustomButton from '../CustomButton';
import Image from 'next/image';

export const Card3: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center py-8" style={{ height: 'calc(100% + 140px)' }}>
      <div className="w-full rounded-3xl p-8 md:p-12 flex overflow-hidden border" style={{ backgroundColor: colors.card.background, borderColor: colors.card.border, boxShadow: shadows.card, height: '80%' }}>
        <div className="w-full flex flex-col md:flex-row items-start gap-8 md:gap-12">
            <div className="w-full md:w-2/5 space-y-6 text-center md:text-left z-10">
                <p className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: colors.card.tagText, fontFamily: fonts.card }}>GO PRO</p>
                <h2 className="text-4xl md:text-7xl font-bold leading-none tracking-tighter"
  style={{ color: colors.card.headingText, fontFamily: fonts.card, letterSpacing: '-0.03em' }}
>Grow your creative community</h2>
                <p className="text-lg" style={{ color: colors.card.bodyText, fontFamily: fonts.card }}>
                    Are you a creative professional, community organizer, or small business owner working within the creative industries? We understand the challenges of nurturing and growing a dedicated audience, so we built KyozoPro...
                </p>
                <div className="mt-4">
                    <CustomButton variant="card-outline">
                        Join the waitlist
                    </CustomButton>
                </div>
            </div>
            <div className="w-full md:w-3/5 h-[450px] relative">
            <Image 
                              src="/grow.png" 
                              alt="Kyozo app on smartphone"
                              width={600}
                              height={1200}
                              className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                           />
            </div>
        </div>
      </div>
    </div>
);