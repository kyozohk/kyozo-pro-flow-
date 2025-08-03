import React from 'react';
import { colors, shadows, fonts } from '../../styles/theme';
import CustomButton from '../CustomButton';

const ImageContainer = ({ className = '', src = '' }: { className?: string, src?: string }) => (
    <div className={`absolute rounded-2xl overflow-hidden shadow-2xl border ${className}`} style={{ borderColor: colors.card.border }}>
        <img src={src} className="w-full h-full object-cover" alt="" />
    </div>
);

export const Card2: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center py-8" style={{ height: 'calc(100% + 140px)' }}>
      <div className="w-full rounded-3xl p-8 md:p-12 flex overflow-hidden border" style={{ backgroundColor: colors.card.background, borderColor: colors.card.border, boxShadow: shadows.card, height: '80%' }}>
        <div className="w-full flex flex-col md:flex-row items-start gap-8 md:gap-12">
            <div className="w-full md:w-2/5 space-y-6 text-center md:text-left z-10">
                <p className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: colors.card.tagText, fontFamily: fonts.card }}>COMMUNITY CONNECTIONS</p>
                <h2 className="text-4xl md:text-7xl font-bold leading-none tracking-tighter"
  style={{ color: colors.card.headingText, fontFamily: fonts.card, letterSpacing: '-0.03em' }}
>Engage with visionary communities</h2>
                <p className="text-lg" style={{ color: colors.card.bodyText, fontFamily: fonts.card }}>
                    Connect with visionary creators and forward-thinking communities. Kyozo brings together passionate individuals who share your creative interests.
                </p>
                <div className="mt-4">
                    <CustomButton variant="card-outline">
                        Join the waitlist
                    </CustomButton>
                </div>
            </div>
            <div className="w-full md:w-3/5 h-[450px] relative -mr-12">
                <ImageContainer className="w-[50%] h-[45%] top-[0%] left-[5%] rotate-[-3deg]" src="https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
                <ImageContainer className="w-[40%] h-[55%] top-[10%] right-[5%] rotate-[5deg]" src="https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
                <ImageContainer className="w-[60%] h-[45%] bottom-[0%] left-[20%] rotate-[-6deg]" src="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
            </div>
        </div>
      </div>
    </div>
);