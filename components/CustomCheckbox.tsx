
import React from 'react';

interface CustomCheckboxProps {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ id, name, label, checked, onChange }) => {
  return (
    <label htmlFor={id} className="flex items-center space-x-4 cursor-pointer group">
      <div className="relative">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer absolute opacity-0 w-6 h-6"
        />
        <div className={`w-6 h-6 rounded flex items-center justify-center transition-all duration-200 ease-in-out ${checked ? 'bg-[#E0407B] border-[#E0407B]' : 'bg-transparent border-2 border-gray-500 group-hover:border-gray-400'}`}>
          <CheckIcon className={`w-4 h-4 text-white transition-opacity duration-200 ${checked ? 'opacity-100' : 'opacity-0'}`} />
        </div>
      </div>
      <span className="text-gray-300 select-none">{label}</span>
    </label>
  );
};

export default CustomCheckbox;
