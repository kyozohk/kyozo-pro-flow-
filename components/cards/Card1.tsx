import React from 'react';
import { colors, shadows, fonts } from '../../styles/theme';
import CustomButton from '../CustomButton';

const ImageContainer = ({ className = '', src = '' }: { className?: string, src?: string }) => (
    <div className={`absolute rounded-2xl overflow-hidden shadow-2xl border ${className}`} style={{ borderColor: colors.card.border }}>
        <img src={src} className="w-full h-full object-cover" alt="" />
    </div>
);

export const Card1: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center py-8" style={{ height: 'calc(100% + 40px)' }}>
      <div className="w-full rounded-3xl p-8 md:p-12 flex overflow-hidden border" style={{ backgroundColor: colors.card.background, borderColor: colors.card.border, boxShadow: shadows.card, height: 'calc(90% + 80px)' }}>
        <div className="w-full flex flex-col md:flex-row items-start gap-8 md:gap-12">
            <div className="w-full md:w-2/5 space-y-6 text-center md:text-left z-10">
                <p className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: colors.card.tagText, fontFamily: fonts.card }}>INSIDER ACCESS</p>
                <h2 className="text-4xl md:text-5xl font-black leading-tight" style={{ color: colors.card.headingText, fontFamily: fonts.card }}>Exclusive access and insights</h2>
                <p className="text-base md:text-lg" style={{ color: colors.card.bodyText, fontFamily: fonts.card }}>Get exclusive access to our community of creators, early product releases, and special events.</p>
                <div className="mt-4">
                    <CustomButton variant="card-outline">
                        Join the waitlist
                    </CustomButton>
                </div>                  
            </div>
            <div className="w-full md:w-3/5 h-[450px] relative -mr-12">
                <ImageContainer className="w-[28%] h-[20%] top-[2%] left-[25%]" src="https://images.pexels.com/photos/3757144/pexels-photo-3757144.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
                <ImageContainer className="w-[20%] h-[30%] top-[5%] right-[22%]" src="https://images.pexels.com/photos/1484516/pexels-photo-1484516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
                <ImageContainer className="w-[25%] h-[35%] top-[25%] left-[0%]" src="https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
                <ImageContainer className="w-[18%] h-[25%] top-[40%] left-[30%]" src="https://images.pexels.com/photos/777059/pexels-photo-777059.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
                <ImageContainer className="w-[25%] h-[40%] top-[48%] right-[10%]" src="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
                <ImageContainer className="w-[30%] h-[25%] bottom-[8%] left-[15%]" src="https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
                <ImageContainer className="w-[22%] h-[28%] bottom-[5%] right-[40%]" src="https://images.pexels.com/photos/2085998/pexels-photo-2085998.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
            </div>
        </div>
      </div>
    </div>
);