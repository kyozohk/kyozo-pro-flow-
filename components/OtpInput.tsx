import React, { useState, useRef } from 'react';

interface OtpInputProps {
  length: number;
  onComplete: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ length, onComplete }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^0-9]/g, '');
    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      } else {
        onComplete(newOtp.join(''));
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length);
    if (paste) {
      const newOtp = paste.split('').concat(new Array(length).fill('')).slice(0, length);
      setOtp(newOtp);
      const lastDigitIndex = Math.min(paste.length, length - 1);
      inputRefs.current[lastDigitIndex]?.focus();
      if(paste.length === length) {
        onComplete(paste);
      }
    }
  };

  return (
    <div className="flex justify-center gap-2 md:gap-4" onPaste={handlePaste}>
      {otp.map((data, index) => (
        <div key={index} className="relative group">
           <div className={`absolute -inset-0.5 bg-gray-700 rounded-xl opacity-0 group-focus-within:opacity-100 group-focus-within:bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 transition duration-300`}></div>
           <input
            ref={el => { inputRefs.current[index] = el; }}
            type="text"
            maxLength={1}
            value={data}
            onChange={e => handleChange(e.target, index)}
            onKeyDown={e => handleKeyDown(e, index)}
            className="relative w-12 h-14 md:w-14 md:h-16 text-center text-2xl md:text-3xl font-semibold bg-[#2C2C2E] text-white rounded-xl border border-gray-600 focus:border-transparent focus:outline-none transition-colors"
           />
        </div>
      ))}
    </div>
  );
};

export default OtpInput;