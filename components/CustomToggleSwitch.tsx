import React from 'react';

interface CustomToggleSwitchProps {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomToggleSwitch: React.FC<CustomToggleSwitchProps> = ({ id, name, label, checked, onChange }) => {
  return (
    <label htmlFor={id} className="flex items-center justify-between cursor-pointer group">
      <span className="text-gray-300 select-none">{label}</span>
      <div className="relative">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <div className="w-12 h-6 bg-gray-600 rounded-full peer-checked:bg-[#E0407B] transition-colors duration-300"></div>
        <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-6"></div>
      </div>
    </label>
  );
};

export default CustomToggleSwitch;