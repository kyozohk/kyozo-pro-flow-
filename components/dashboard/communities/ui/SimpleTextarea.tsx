"use client";

import React from 'react';
import { colors, borderRadius } from '../../../../styles/theme';

interface SimpleTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

const SimpleTextarea: React.FC<SimpleTextareaProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  rows = 4, 
  className = '',
  required = false,
  disabled = false
}) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      required={required}
      disabled={disabled}
      className={`w-full px-4 py-3 bg-[${colors.bgDarker}] ${borderRadius.lg} text-[${colors.textPrimary}] border border-[${colors.borderDark}] focus:border-[${colors.primary}] focus:outline-none transition-colors resize-none ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
    />
  );
};

export default SimpleTextarea;
