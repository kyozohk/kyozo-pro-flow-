import React from 'react';
import { colors, fontWeights, borderRadius, fontSizes } from '../styles/theme';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-center py-3 ${borderRadius.full} ${fontSizes.sm} ${fontWeights.semibold} transition-colors duration-300 ease-in-out ${
        isActive ? `bg-[${colors.bgCard}] text-[${colors.textPrimary}] shadow-md` : `text-[${colors.textSecondary}] hover:bg-[${colors.borderDark}]`
      }`}
    >
      {label}when
    </button>
  );
};

export default TabButton;
