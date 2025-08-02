import React from 'react';
import { colors, borderRadius, fontWeights, fontSizes } from '../../styles/theme';

const Avatar = ({ className = '', src = '' }: { className?: string, src?: string }) => (
    <div className={`absolute rounded-full overflow-hidden w-12 h-12 bg-[${colors.borderDark}] border-2 border-[${colors.borderMedium}] shadow-lg ${className}`}>
        <img src={src} className="w-full h-full object-cover" alt="avatar" />
    </div>
);

const PerformancesChart = () => (
    <div className={`bg-[${colors.bgDarker}]/50 backdrop-blur-sm p-4 ${borderRadius['2xl']} border border-[${colors.borderLight}] shadow-xl`}>
        <div className="flex justify-between items-center mb-3">
            <h4 className={`${fontWeights.semibold} ${fontSizes.sm} flex items-center gap-2`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-purple-400"><path fillRule="evenodd" d="M1 2.75A.75.75 0 0 1 1.75 2h16.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h16.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h16.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Zm0 4.25a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H1.75Z" clipRule="evenodd" /></svg>
                Performances
            </h4>
        </div>
        <div className="flex items-end h-24 space-x-1.5">
            {[20, 40, 60, 30, 80, 50, 70, 45, 90, 55, 65, 25, 45].map((h, i) => (
                <div key={i} className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-sm opacity-80" style={{ height: `${h}%` }}></div>
            ))}
        </div>
    </div>
);

const EmojiResponses = () => (
    <div className={`absolute top-[5%] right-[15%] flex items-center space-x-2 bg-green-400/20 backdrop-blur-sm text-[${colors.textPrimary}] px-3 py-1.5 ${borderRadius.full} border border-green-400/50 shadow-lg`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-300"><path fillRule="evenodd" d="M10 2a.75.75 0 0 1 .75.75v.518a9 9 0 0 1 8.242 7.112a.75.75 0 0 1-.676 1.002H16.5a.75.75 0 0 0-.75.75v.001a.75.75 0 0 1-1.5 0v-.001a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75v.001a.75.75 0 0 1-1.5 0v-.001a.75.75 0 0 0-.75-.75H7.5a.75.75 0 0 0-.75.75v.001a.75.75 0 0 1-1.5 0v-.001A.75.75 0 0 0 4.5 11.5h-1.818a.75.75 0 0 1-.676-1.002A9 9 0 0 1 10 2.768V2.75A.75.75 0 0 1 10 2Z" clipRule="evenodd" /></svg>
        <span className={`${fontWeights.bold} ${fontSizes.sm}`}>52</span>
        <span className={`${fontSizes.xs} text-[${colors.textSecondary}]`}>Emoji responses</span>
    </div>
);

const TotalMessages = () => (
    <div className="absolute top-[40%] right-[15%] text-center">
        <p className={`text-[${colors.textSecondary}] ${fontSizes.sm}`}>Total messages sent</p>
        <p className={`${fontSizes['6xl']} ${fontWeights.black} text-[${colors.textPrimary}]`}>30</p>
    </div>
);

const GrowthChart = () => (
    <div className="absolute bottom-[5%] right-[25%] w-48 h-24">
        <div className="relative w-full h-full">
            <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
                <path d="M 0 40 Q 25 10, 50 30 T 100 20" stroke="#A78BFA" fill="none" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div className={`absolute -top-2 right-0 bg-[${colors.primary}] text-[${colors.textPrimary}] ${fontSizes.xs} ${fontWeights.bold} px-2 py-0.5 ${borderRadius.full}`}>+34%</div>
        </div>
    </div>
);

export const Card3: React.FC = () => (
    <div className={`w-full h-full bg-[${colors.bgCard}] ${borderRadius['3xl']} p-8 md:p-12 flex items-center overflow-hidden border border-[${colors.borderLight}] shadow-[0_0_40px_rgba(255,255,255,0.05)]`}>
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            <div className="w-full md:w-2/5 space-y-6 text-center md:text-left z-10">
                <p className={`${fontSizes.sm} ${fontWeights.bold} tracking-[0.2em] text-[${colors.textSecondary}] uppercase`}>GO PRO</p>
                <h2 className={`${fontSizes['4xl']} md:${fontSizes['5xl']} ${fontWeights.black} leading-tight`}>Grow your creative community</h2>
                <p className={`text-[${colors.textSecondary}] ${fontSizes.lg}`}>
                    Are you a creative professional, community organizer, or small business owner working within the creative industries? We understand the challenges of nurturing and growing a dedicated audience, so we built KyozoPro...
                </p>
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
                <div className={`absolute w-10 h-10 rounded-full bg-[${colors.primary}]/50 bottom-[25%] left-[35%] blur-lg`}></div>
                <div className={`absolute w-5 h-5 rounded-full bg-[${colors.gradientEnd}]/50 top-[45%] right-[50%] blur-md`}></div>
            </div>
        </div>
    </div>
);
