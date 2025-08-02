"use client";

import React from 'react';
import { colors, borderRadius } from '../../../../styles/theme';

interface Option {
  value: string;
  label: string;
}

interface SimpleSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

const SimpleSelect: React.FC<SimpleSelectProps> = ({ 
  options, 
  value, 
  onChange, 
  className = '', 
  disabled = false 
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-4 py-3 bg-[${colors.bgDarker}] ${borderRadius.lg} text-[${colors.textPrimary}] border border-[${colors.borderDark}] focus:border-[${colors.primary}] focus:outline-none transition-colors ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SimpleSelect;
