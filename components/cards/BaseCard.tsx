import React, { ReactNode } from 'react';
import { colors, borderRadius, fontWeights, fontSizes } from '../../styles/theme';

interface BaseCardProps {
  title: string;
  subtitle?: string;
  description: string;
  buttonText?: string;
  buttonAction?: () => void;
  rightContent?: ReactNode;
  bgColor?: string;
  borderColor?: string;
  className?: string;
}

const BaseCard: React.FC<BaseCardProps> = ({
  title,
  subtitle,
  description,
  buttonText = 'Learn More',
  buttonAction = () => {},
  rightContent,
  bgColor = '#2A2A2B', // Default dark background color from the image
  borderColor = 'white/10', // Default border color with opacity
  className = '',
}) => {
  return (
    <div 
      className={`border border-${borderColor} rounded-[40px] p-8 md:p-12 lg:p-16 relative w-full mx-auto my-8 overflow-hidden ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column: Content */}
        <div className="flex flex-col justify-center z-10">
          {subtitle && (
            <p className="text-sm font-medium tracking-[0.2em] text-gray-400 mb-4">
              {subtitle.toUpperCase()}
            </p>
          )}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {title}
          </h2>
          <p className="text-lg text-gray-300 max-w-md leading-relaxed mb-10">
            {description}
          </p>
          {buttonText && (
            <div className="flex">
              <button 
                onClick={buttonAction}
                className="text-lg font-semibold text-white px-8 py-4 border-2 border-[#D45E9B] rounded-full hover:bg-[#D45E9B]/20 transition-all duration-300"
              >
                {buttonText}
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Media */}
        <div className="hidden lg:block relative">
          {rightContent}
        </div>

        {/* Mobile view for right content */}
        <div className="lg:hidden">
          {rightContent}
        </div>
      </div>
    </div>
  );
};

export default BaseCard;
