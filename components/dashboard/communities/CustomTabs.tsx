"use client";

import React from 'react';
import { colors, borderRadius, fontWeights, fontSizes } from '../../../styles/theme';

interface Tab {
  id: string;
  label: string;
}

interface CustomTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

const CustomTabs: React.FC<CustomTabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className={`bg-[${colors.bgCard}] ${borderRadius.xl} border border-[${colors.borderDark}] p-1`}>
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 py-3 px-4 ${borderRadius.lg} ${fontSizes.sm} ${fontWeights.semibold} transition-colors duration-300 ease-in-out ${
              activeTab === tab.id
                ? `bg-[${colors.primary}] text-white`
                : `text-[${colors.textSecondary}] hover:bg-[${colors.borderDark}]`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomTabs;
