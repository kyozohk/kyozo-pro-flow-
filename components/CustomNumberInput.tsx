"use client";

import React, { useRef, useState, useEffect } from 'react';

interface CustomNumberInputProps {
  length: number;
  onChange: (code: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

const CustomNumberInput: React.FC<CustomNumberInputProps> = ({
  length = 6,
  onChange,
  disabled = false,
  autoFocus = false
}) => {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(length).fill(null));

  useEffect(() => {
    // Auto-focus the first input when component mounts if autoFocus is true
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleDigitChange = (index: number, value: string) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1); // Take only the last character
    setDigits(newDigits);
    
    // Call onChange with the complete code
    onChange(newDigits.join(''));

    // Auto-focus to next input if value is entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedDigits = pastedData.replace(/\D/g, '').slice(0, length).split('');
    
    const newDigits = [...digits];
    pastedDigits.forEach((digit, index) => {
      if (index < length) newDigits[index] = digit;
    });
    
    setDigits(newDigits);
    onChange(newDigits.join(''));
    
    // Focus the next empty input or the last input if all are filled
    const nextEmptyIndex = newDigits.findIndex(d => !d);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else if (inputRefs.current[length - 1]) {
      inputRefs.current[length - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleDigitChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          className="w-12 h-14 text-center text-xl font-bold bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:border-[#E0407B] focus:outline-none"
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default CustomNumberInput;
