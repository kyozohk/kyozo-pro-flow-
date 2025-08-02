import React from 'react';
import { colors, borderRadius, fontWeights, fontSizes } from '../../styles/theme';

const ImageContainer = ({ className = '', src = '' }: { className?: string, src?: string }) => (
    <div className={`absolute ${borderRadius['2xl']} overflow-hidden shadow-2xl border border-[${colors.borderLight}] ${className}`}>
        <img src={src} className="w-full h-full object-cover" alt="" />
    </div>
);

export const Card2: React.FC = () => (
    <div className={`w-full h-full bg-[${colors.bgCard}] ${borderRadius['3xl']} p-8 md:p-12 flex items-center overflow-hidden border border-[${colors.borderLight}] shadow-[0_0_40px_rgba(255,255,255,0.05)]`}>
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            <div className="w-full md:w-2/5 space-y-6 text-center md:text-left z-10">
                <p className={`text-sm ${fontWeights.bold} tracking-[0.2em] text-[${colors.textSecondary}] uppercase`}>COMMUNITY CONNECTIONS</p>
                <h2 className={`${fontSizes['4xl']} md:${fontSizes['5xl']} ${fontWeights.black} leading-tight`}>Engage with visionary communities</h2>
                <p className={`text-[${colors.textSecondary}] ${fontSizes.lg}`}>
                    Join and interact with diverse communities, from niche artistic circles to industry-leading collectives. Engage with passionate individuals who share your creative interests.
                </p>
                <button className={`border border-[${colors.borderMedium}] ${borderRadius.full} px-8 py-3 text-[${colors.textPrimary}] ${fontWeights.bold} hover:bg-[${colors.textPrimary}] hover:text-[${colors.bgDarker}] transition-colors`}>
                    Join the waitlist
                </button>
            </div>
            <div className="w-full md:w-3/5 h-[450px] relative -mr-12">
                <ImageContainer className="w-[50%] h-[45%] top-[0%] left-[5%] rotate-[-3deg]" src="https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
                <ImageContainer className="w-[40%] h-[55%] top-[10%] right-[5%] rotate-[5deg]" src="https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
                <ImageContainer className="w-[60%] h-[45%] bottom-[0%] left-[20%] rotate-[-6deg]" src="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
            </div>
        </div>
    </div>
);
