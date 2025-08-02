import React, { ReactNode } from 'react';
import { colors } from '../../styles/theme';

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
  leftColSpan?: number;
  rightColSpan?: number;
}

const BaseCard: React.FC<BaseCardProps> = ({
  title,
  subtitle,
  description,
  buttonText = 'Learn More',
  buttonAction = () => {},
  rightContent,
  bgColor = colors.bgExclusive, // Using our theme color
  borderColor = colors.borderMedium, // Using our theme color
  className = '',
  leftColSpan = 6,
  rightColSpan = 6,
}) => {
  return (
    <div 
      className={`rounded-[40px] m-8 mb-50 mt-20 relative w-full mx-auto overflow-hidden h-[calc(100vh-10rem)] ${className}`}
      style={{ 
        backgroundColor: bgColor, 
        border: `1px solid ${borderColor}`,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
        {/* Left Column: Content */}
        <div 
          className={`flex flex-col pt-16 lg:pt-20 z-10 px-8 md:px-12 lg:px-12`}
          style={{ gridColumn: `span ${leftColSpan} / span ${leftColSpan}` }}
        >
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
                className="text-lg font-semibold text-white px-8 py-4 border-1 border-[#D45E9B] rounded-full hover:bg-[#D45E9B]/20 transition-all duration-300"
              >
                {buttonText}
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Content */}
        <div 
          className={`z-10 h-full overflow-hidden`}
          style={{ gridColumn: `span ${rightColSpan} / span ${rightColSpan}` }}
        >
          {rightContent}
        </div>
      </div>
    </div>
  );
};

export default BaseCard;
