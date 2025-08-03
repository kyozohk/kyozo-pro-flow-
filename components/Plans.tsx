
import React, { useState, useEffect } from 'react';
import { FaCircleCheck } from "react-icons/fa6";

interface PricingPlan {
  name: string;
  subtitle: string;
  price: string;
  priceDetail: string;
  features: { text: string }[];
  borderColorClass: string;
  titleColorClass: string;
  subtitleColorClass: string;
}

const plansData: PricingPlan[] = [
  {
    name: 'Kyozo',
    subtitle: 'Community Connection',
    price: 'FREE',
    priceDetail: 'membership',
    features: [
      { text: 'Creative Labs content' },
      { text: 'Connect with like-minded creatives' },
      { text: 'Explore exclusive content' },
      { text: 'Discover communities' },
      { text: 'Early adopter benefits' },
    ],
    borderColorClass: 'bg-gradient-to-br from-fuchsia-500 from-0% via-purple-600 via-30% to-neutral-600 to-70%',
    titleColorClass: 'text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-400 to-purple-500',
    subtitleColorClass: 'text-fuchsia-400',
  },
  {
    name: 'KyozoPro',
    subtitle: 'Community Growth',
    price: 'PREMIUM',
    priceDetail: 'subscription',
    features: [
      { text: 'Creative Labs content' },
      { text: 'Build and manage your communities' },
      { text: 'Advanced community app' },
      { text: 'Audience dashboards' },
      { text: 'Custom group messaging' },
      { text: 'Enhanced CRM toolkit' },
    ],
    borderColorClass: 'bg-gradient-to-br from-blue-400 from-0% via-indigo-600 via-30% to-neutral-600 to-70%',
    titleColorClass: 'text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-indigo-500',
    subtitleColorClass: 'text-blue-400',
  },
];

const BackgroundCircles: React.FC = () => {
    const [circles, setCircles] = useState<{ id: number; createdAt: number }[]>([]);
    const [renderTime, setRenderTime] = useState(Date.now());

    const EXPANSION_RATE_PX_PER_S = 150;
    const MAX_DIAMETER_PX = 1050; // 7 circles * 150px gap
    const CIRCLE_GAP_PX = 150;
    const STATE_UPDATE_INTERVAL_MS = 50;

    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = Date.now();
            setCircles(currentCircles => {
                let updatedCircles = currentCircles.filter(circle => {
                    const ageMs = now - circle.createdAt;
                    const diameter = (ageMs / 1000) * EXPANSION_RATE_PX_PER_S;
                    return diameter < MAX_DIAMETER_PX;
                });

                const newestCircle = updatedCircles[updatedCircles.length - 1];

                if (!newestCircle) {
                    updatedCircles.push({ id: now, createdAt: now });
                } else {
                    const newestCircleAgeMs = now - newestCircle.createdAt;
                    const newestCircleDiameter = (newestCircleAgeMs / 1000) * EXPANSION_RATE_PX_PER_S;

                    if (newestCircleDiameter >= CIRCLE_GAP_PX) {
                        updatedCircles.push({ id: now, createdAt: now });
                    }
                }
                return updatedCircles;
            });
        }, STATE_UPDATE_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        let animationFrameId: number;
        const loop = () => {
            setRenderTime(Date.now());
            animationFrameId = requestAnimationFrame(loop);
        };
        animationFrameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
            {circles.map(circle => {
                const ageMs = renderTime - circle.createdAt;
                const diameter = (ageMs / 1000) * EXPANSION_RATE_PX_PER_S;

                if (diameter <= 0) return null;

                const normalizedDiameter = Math.min(diameter, MAX_DIAMETER_PX);
                // Increased transparency: fades from 1.0 down to 0.2 (80% transparent)
                const opacity = 1.0 - 0.8 * (normalizedDiameter / MAX_DIAMETER_PX);

                return (
                    <div
                        key={circle.id}
                        className="absolute rounded-full border-2 border-white"
                        style={{
                            width: `${diameter}px`,
                            height: `${diameter}px`,
                            opacity: opacity,
                        }}
                    />
                );
            })}
        </div>
    );
};


const PlanCard: React.FC<{ plan: PricingPlan }> = ({ plan }) => {
  return (
    <div className={`rounded-3xl p-0.5 ${plan.borderColorClass}`}>
      <div className="bg-[#121212] rounded-[23px] p-8 md:p-10 h-full flex flex-col shadow-2xl">
        <h3 className={`text-4xl font-black mb-2 ${plan.titleColorClass}`}>{plan.name}</h3>
        <p className={`font-semibold text-sm mb-4 ${plan.subtitleColorClass}`}>{plan.subtitle}</p>
        
        <div className="mb-6">
          <span className="text-3xl font-bold text-white">{plan.price}</span>
          <span className="text-gray-400 ml-2">{plan.priceDetail}</span>
        </div>
        
        <ul className="space-y-6 text-gray-300">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              {/* <div className="text-white">
                <IoCheckmarkCircle />
              </div> */}
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Plans: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center gap-14 z-10 w-full px-4">
      <BackgroundCircles />
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl">
        {plansData.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </div>
      <button className="relative bg-[#1a1a1a]/50 backdrop-blur-sm border border-gray-700 text-gray-300 font-semibold py-3 px-8 rounded-full hover:bg-gray-800 hover:border-gray-600 transition-all duration-300 shadow-lg">
        Join the waitlist
      </button>
    </div>
  );
};

export default Plans;