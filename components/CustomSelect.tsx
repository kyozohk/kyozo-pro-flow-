import React, { useState, useRef, useEffect } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  label: string;
  name: string;
  options: SelectOption[];
  value: string | number;
  onChange: (name: string, value: string | number) => void;
}

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const CustomSelect: React.FC<CustomSelectProps> = ({ label, name, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(option => option.value === value);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectOption = (option: SelectOption) => {
    onChange(name, option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative group" ref={selectRef}>
      <div className={`absolute -inset-0.5 bg-gray-700 rounded-xl transition duration-300 ${isOpen ? 'opacity-100 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500' : 'opacity-0'}`}></div>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-[#2C2C2E] rounded-xl text-white border border-gray-600 focus:outline-none transition-colors flex justify-between items-center"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={value ? 'text-white' : 'text-gray-400'}>
            {selectedOption?.label || label}
          </span>
          <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <div 
          className={`absolute z-20 w-full mt-2 bg-[#2C2C2E] border border-white/10 rounded-xl shadow-lg transition-[clip-path,opacity] duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          style={{ clipPath: isOpen ? 'inset(0 0 0 0)' : 'inset(10% 50% 90% 50%)' }}
        >
            <ul className="py-2 max-h-60 overflow-y-auto" role="listbox">
                {options.map((option) => (
                    <li
                        key={option.value}
                        onClick={() => handleSelectOption(option)}
                        className="px-4 py-2 text-gray-300 hover:bg-[#3A3A3C] hover:text-white cursor-pointer"
                        role="option"
                        aria-selected={value === option.value}
                    >
                        {option.label}
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default CustomSelect;