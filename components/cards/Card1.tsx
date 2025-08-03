import React from 'react';
import { colors, shadows, fonts } from '../../styles/theme';
import CustomButton from '../CustomButton';
import VideoWall from '../VideoWall';

const ImageContainer = ({ className = '', src = '' }: { className?: string, src?: string }) => (
    <div className={`absolute rounded-2xl overflow-hidden shadow-2xl border ${className}`} style={{ borderColor: colors.card.border }}>
        <img src={src} className="w-full h-full object-cover" alt="" />
    </div>
);

export const Card1: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center py-8" style={{ height: 'calc(100% + 140px)' }}>
      <div className="w-full rounded-3xl p-8 md:p-12 flex overflow-hidden border" style={{ backgroundColor: colors.card.background, borderColor: colors.card.border, boxShadow: shadows.card, height: '80%' }}>
        <div className="w-full flex flex-col md:flex-row items-start gap-8 md:gap-12">
            <div className="w-full md:w-2/5 space-y-6 text-center md:text-left z-10">
                <p className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: colors.card.tagText, fontFamily: fonts.card }}>INSIDER ACCESS</p>
                <h2 className="text-4xl md:text-7xl font-bold leading-none tracking-tighter"
  style={{ color: colors.card.headingText, fontFamily: fonts.card, letterSpacing: '-0.03em' }}
>Exclusive access and insights</h2>
                <p className="text-base md:text-lg" style={{ color: colors.card.bodyText, fontFamily: fonts.card }}>Get exclusive access to our community of creators, early product releases, and special events.</p>
                <div className="mt-4">
                    <CustomButton variant="card-outline">
                        Join the waitlist
                    </CustomButton>
                </div>                  
            </div>
            <div className="w-full relative top-[-3rem] left-[17rem]">
                <VideoWall />
            </div>
        </div>
      </div>
    </div>
);