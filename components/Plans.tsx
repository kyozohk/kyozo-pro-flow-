
import React from 'react';
import CoCircles from './CoCircles';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-zinc-400">
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143z" clipRule="evenodd" />
  </svg>
);

interface PlanCardProps {
  title: string;
  subtitle: string;
  features: string[];
  price: string;
  gradientClass: string;
  titleColor: string;
}

const PlanCard: React.FC<PlanCardProps> = ({ title, subtitle, features, price, gradientClass, titleColor }) => (
  <div className={`w-full lg:w-1/2 p-0.5 rounded-3xl bg-gradient-to-br ${gradientClass}`}>
    <div className="bg-[#1C1C1C] h-full rounded-[22px] p-8 flex flex-col">
      <h3 className={`text-4xl font-black ${titleColor}`}>{title}</h3>
      <p className="text-sm uppercase tracking-widest text-zinc-400 mt-4 mb-2">{subtitle}</p>
      <p className="text-xl font-bold mb-6">
        <span className="text-3xl font-black">{price}</span> {price !== 'FREE' && 'subscription'}
      </p>
      <ul className="space-y-3 text-zinc-300">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3">
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const Plans: React.FC = () => {
  const kyozoFeatures = [
    "Creative Labs content",
    "Connect with like-minded creatives",
    "Explore exclusive content",
    "Discover communities",
    "Early adopter benefits"
  ];

  const kyozoProFeatures = [
    "Creative Labs content",
    "Build and manage your communities",
    "Advanced community app",
    "Audience dashboards",
    "Custom group messaging",
    "Enhanced CRM toolkit"
  ];

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <CoCircles />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch">
          <PlanCard 
            title="Kyozo"
            subtitle="Community Connection"
            price="FREE"
            features={kyozoFeatures}
            gradientClass="from-purple-500 to-pink-500"
            titleColor="text-white"
          />
          <PlanCard 
            title="KyozoPro"
            subtitle="Community Growth"
            price="PREMIUM"
            features={kyozoProFeatures}
            gradientClass="from-blue-500 to-cyan-400"
            titleColor="text-white"
          />
        </div>
        <div className="text-center mt-12">
           <button className="border border-gray-500 rounded-full px-8 py-3 text-white font-bold hover:bg-white hover:text-black transition-colors">
            Join the waitlist
          </button>
        </div>
      </div>
    </section>
  );
};

export default Plans;