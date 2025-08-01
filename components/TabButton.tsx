
import React from 'react';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-center py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 ease-in-out ${
        isActive ? 'bg-[#1C1C1E] text-white shadow-md' : 'text-gray-400 hover:bg-[#3A3A3C]'
      }`}
    >
      {label}
    </button>
  );
};

export default TabButton;
