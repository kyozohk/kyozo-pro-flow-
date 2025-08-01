
import React from 'react';

interface CustomInputProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({ label, name, type, value, onChange, error, disabled = false }) => {
  return (
    <div className="relative">
      <div className="relative group">
        <div 
            className={`absolute -inset-0.5 bg-gray-700 rounded-full transition duration-300 opacity-0 group-focus-within:opacity-100 group-focus-within:bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 ${!!error ? '!opacity-100' : ''}`}
            style={error ? { background: 'rgb(239 68 68)' } : {}}
        ></div>
        <div className="relative">
            <input
              type={type}
              name={name}
              id={name}
              value={value}
              onChange={onChange}
              placeholder=" " 
              disabled={disabled}
              className={`peer w-full px-6 py-3 bg-[#2C2C2E] rounded-full text-white border transition-colors ${error ? 'border-red-500' : 'border-gray-600'} focus:border-transparent focus:outline-none ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
              required
            />
            <label
              htmlFor={name}
              className={`absolute duration-300 transform -translate-y-3.5 scale-75 top-3.5 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 ${error ? 'text-red-400' : 'text-gray-400 peer-focus:text-pink-400'}`}
            >
              {label}
            </label>
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400 px-1">{error}</p>}
    </div>
  );
};

export default CustomInput;
