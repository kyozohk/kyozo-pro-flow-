import React from 'react';
import { colors, borderRadius, fontWeights, fontSizes } from '../../styles/theme';

const ImageContainer = ({ className = '', src = '' }: { className?: string, src?: string }) => (
    <div className={`absolute ${borderRadius['2xl']} overflow-hidden shadow-2xl border border-[${colors.borderLight}] ${className}`}>
        <img src={src} className="w-full h-full object-cover" alt="" />
    </div>
);

export const Card1: React.FC = () => (
    <div className={`w-full h-full bg-[${colors.bgCard}] ${borderRadius['3xl']} p-8 md:p-12 flex items-center overflow-hidden border border-[${colors.borderLight}] shadow-[0_0_40px_rgba(255,255,255,0.05)]`}>
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            <div className="w-full md:w-2/5 space-y-6 text-center md:text-left z-10">
                <p className={`text-sm ${fontWeights.bold} tracking-[0.2em] text-[${colors.textSecondary}] uppercase`}>INSIDER ACCESS</p>
                <h2 className={`${fontSizes['4xl']} md:${fontSizes['5xl']} ${fontWeights.black} leading-tight`}>Exclusive access and insights</h2>
                <p className={`text-[${colors.textSecondary}] ${fontSizes.lg}`}>
                    Experience the creative world through an insider's lens. Kyozo is an eco-system of creative communities - that gives you exclusive access to updates and insights from the creative luminaries driving cultural evolution.
                </p>
                <button className={`border border-[${colors.borderMedium}] ${borderRadius.full} px-8 py-3 text-[${colors.textPrimary}] ${fontWeights.bold} hover:bg-[${colors.textPrimary}] hover:text-[${colors.bgDarker}] transition-colors`}>
                    Join the waitlist
                </button>
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
);
