import React from 'react';
import { colors, fontWeights, fontSizes, borderRadius } from '../styles/theme';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'form' | 'text';
  size?: 'default' | 'small';
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  variant = 'primary',
  size = 'default',
  ...props
}) => {
  // Using theme constants for consistent styling
  const baseStyles = `${fontWeights.bold} transition-all duration-300 ease-in-out`;

  const variantStyles = {
    primary: `bg-[${colors.primary}] text-white hover:bg-[${colors.primaryHover}]`,
    outline: `bg-transparent border-2 border-[${colors.primary}] text-[${colors.primary}] hover:bg-[${colors.primary}] hover:text-white`,
    form: `w-full bg-[${colors.primary}] text-white hover:bg-[${colors.primaryHover}] ${borderRadius.xl} ${fontSizes.lg} py-4`,
    text: `bg-transparent text-[${colors.primary}] hover:text-[${colors.primaryHover}] p-0 ${fontWeights.normal} text-left`,
  };

  const sizeStyles = {
    default: `py-3 px-8 ${borderRadius.full} ${fontSizes.lg}`,
    small: `${fontSizes.sm} ${fontWeights.semibold} px-5 py-2 ${borderRadius.full}`,
  };
  
  // The form button has its own padding/rounding etc., so we don't apply size styles to it.
  const appliedSizeStyles = variant === 'form' ? '' : sizeStyles[size];

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${appliedSizeStyles} ${props.className || ''}`;

  // Remove className from props to avoid duplication
  const { className, ...restProps } = props;

  return (
    <button className={combinedClassName.trim()} {...restProps}>
      {children}
    </button>
  );
};

export default CustomButton;