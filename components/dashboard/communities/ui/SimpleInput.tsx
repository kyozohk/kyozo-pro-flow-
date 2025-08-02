"use client";

import React from 'react';
import { colors, borderRadius } from '../../../../styles/theme';

interface SimpleInputProps {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

const SimpleInput: React.FC<SimpleInputProps> = ({ 
  type, 
  value, 
  onChange, 
  placeholder, 
  className = '', 
  required = false,
  disabled = false
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`w-full px-4 py-3 bg-[${colors.bgDarker}] ${borderRadius.lg} text-[${colors.textPrimary}] border border-[${colors.borderDark}] focus:border-[${colors.primary}] focus:outline-none transition-colors ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
    />
  );
};

export default SimpleInput;
