import React from 'react';
import { colors, shadows, fonts } from '../../styles/theme';
import CustomButton from '../CustomButton';

const Avatar = ({ className = '', src = '' }: { className?: string, src?: string }) => (
    <div className={`absolute rounded-full overflow-hidden w-12 h-12 bg-zinc-700 border-2 shadow-lg ${className}`} style={{ borderColor: colors.card.border }}>
        <img src={src} className="w-full h-full object-cover" alt="avatar" />
    </div>
);

const PerformancesChart = () => (
    <div className="bg-zinc-900/50 backdrop-blur-sm p-4 rounded-2xl border shadow-xl" style={{ borderColor: colors.borderPrimary }}>
        <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" style={{ color: colors.secondary }}><path fillRule="evenodd" d="M1 2.75A.75.75 0 0 1 1.75 2h16.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h16.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h16.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Zm0 4.25a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H1.75Z" clipRule="evenodd" /></svg>
                Performances
            </h4>
        </div>
        <div className="flex items-end h-24 space-x-1.5">
            {[20, 40, 60, 30, 80, 50, 70, 45, 90, 55, 65, 25, 45].map((h, i) => (
                <div key={i} className="w-full bg-gradient-to-t rounded-t-sm opacity-80" style={{ height: `${h}%`, backgroundImage: `linear-gradient(to top, ${colors.secondary}, ${colors.primary})` }}></div>
            ))}
        </div>
    </div>
);

const EmojiResponses = () => (
    <div className="absolute top-[5%] right-[15%] flex items-center space-x-2 backdrop-blur-sm px-3 py-1.5 rounded-full border shadow-lg" style={{ backgroundColor: `${colors.success}20`, borderColor: `${colors.success}80`, color: colors.light }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" style={{ color: colors.success }}><path fillRule="evenodd" d="M10 2a.75.75 0 0 1 .75.75v.518a9 9 0 0 1 8.242 7.112a.75.75 0 0 1-.676 1.002H16.5a.75.75 0 0 0-.75.75v.001a.75.75 0 0 1-1.5 0v-.001a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75v.001a.75.75 0 0 1-1.5 0v-.001a.75.75 0 0 0-.75-.75H7.5a.75.75 0 0 0-.75.75v.001a.75.75 0 0 1-1.5 0v-.001A.75.75 0 0 0 4.5 11.5h-1.818a.75.75 0 0 1-.676-1.002A9 9 0 0 1 10 2.768V2.75A.75.75 0 0 1 10 2Z" clipRule="evenodd" /></svg>
        <span className="font-bold text-sm">52</span>
        <span className="text-xs" style={{ color: colors.textSecondary }}>Emoji responses</span>
    </div>
);

const TotalMessages = () => (
    <div className="absolute top-[40%] right-[15%] text-center">
        <p className="text-sm" style={{ color: colors.textSecondary }}>Total messages sent</p>
        <p className="text-6xl font-black" style={{ color: colors.textPrimary, fontFamily: fonts.card }}>30</p>
    </div>
);

const GrowthChart = () => (
    <div className="absolute bottom-[5%] right-[25%] w-48 h-24">
        <div className="relative w-full h-full">
            <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
                <path d="M 0 40 Q 25 10, 50 30 T 100 20" stroke={colors.secondary} fill="none" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div className="absolute -top-2 right-0 text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.secondary, color: colors.light }}>+34%</div>
        </div>
    </div>
);

export const Card3: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center py-8" style={{ height: 'calc(100% + 140px)' }}>
      <div className="w-full rounded-3xl p-8 md:p-12 flex overflow-hidden border" style={{ backgroundColor: colors.card.background, borderColor: colors.card.border, boxShadow: shadows.card, height: '80%' }}>
        <div className="w-full flex flex-col md:flex-row items-start gap-8 md:gap-12">
            <div className="w-full md:w-2/5 space-y-6 text-center md:text-left z-10">
                <p className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: colors.card.tagText, fontFamily: fonts.card }}>GO PRO</p>
                <h2 className="text-4xl md:text-5xl font-black leading-tight" style={{ color: colors.card.headingText, fontFamily: fonts.card }}>Grow your creative community</h2>
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
                <div className="absolute top-[10%] left-[5%] w-[50%]">
                    <PerformancesChart />
                </div>
                <EmojiResponses />
                <TotalMessages />
                <GrowthChart />
                <Avatar className="top-[35%] left-[55%]" src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" />
                <Avatar className="top-[55%] right-[5%]" src="https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" />
                <Avatar className="bottom-[10%] left-[10%]" src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" />
                <div className="absolute w-10 h-10 rounded-full bottom-[25%] left-[35%] blur-lg" style={{ backgroundColor: `${colors.primary}80` }}></div>
                <div className="absolute w-5 h-5 rounded-full top-[45%] right-[50%] blur-md" style={{ backgroundColor: `${colors.secondary}80` }}></div>
            </div>
        </div>
      </div>
    </div>
);