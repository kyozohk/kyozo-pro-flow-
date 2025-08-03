import React from 'react';
import { colors } from '../styles/theme';

interface CenterCircleProps {
  cx: number;
  cy: number;
  radius: number;
}

const CenterCircle: React.FC<CenterCircleProps> = ({ cx, cy, radius }) => {
  const gradientId = "centerGradient";

  return (
    <React.Fragment>
      <defs>
        {/* Using a linear gradient for the top-to-bottom effect on the center circle */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.svg.centerGradientStart} />
          <stop offset="100%" stopColor={colors.svg.centerGradientEnd} />
        </linearGradient>
      </defs>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={`url(#${gradientId})`}
      />
    </React.Fragment>
  );
};

export default CenterCircle;