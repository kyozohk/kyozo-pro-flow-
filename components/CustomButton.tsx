import React from 'react';
import { colors } from '../styles/theme';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'form' | 'text' | 'card-outline';
  size?: 'default' | 'small';
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  variant = 'primary',
  size = 'default',
  ...props
}) => {
  const baseStyles = 'transition-all duration-300 ease-in-out';
  const fontStyles = variant === 'outline' || variant === 'card-outline' ? 'font-normal' : 'font-bold';

  const variantStyles = {
    primary: `bg-[${colors.accent}] text-white hover:bg-pink-600`,
    outline: `bg-transparent border-2 border-[${colors.accent}] text-[${colors.accent}] hover:bg-[${colors.accent}] hover:text-white`,
    form: `w-full bg-[${colors.accent}] text-white hover:bg-pink-600 rounded-xl text-lg py-4`,
    text: `bg-transparent text-[${colors.accent}] hover:text-pink-600 p-0 font-normal text-left`,
    'card-outline': `bg-transparent border border-[${colors.accent}] text-white hover:bg-[${colors.accent}] hover:text-white`,
  };

  const sizeStyles = {
    default: 'py-3 px-8 rounded-full text-lg',
    small: 'text-sm font-semibold px-5 py-2 rounded-full',
  };
  
  // The form button has its own padding/rounding etc., so we don't apply size styles to it.
  const appliedSizeStyles = variant === 'form' ? '' : sizeStyles[size];

  const combinedClassName = `${baseStyles} ${fontStyles} ${variantStyles[variant]} ${appliedSizeStyles}`;

  return (
    <button className={combinedClassName.trim()} {...props}>
      {children}
    </button>
  );
};

export default CustomButton;