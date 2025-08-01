import React from 'react';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'form';
  size?: 'default' | 'small';
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  variant = 'primary',
  size = 'default',
  ...props
}) => {
  const baseStyles = 'font-bold transition-all duration-300 ease-in-out';

  const variantStyles = {
    primary: 'bg-[#E0407B] text-white hover:bg-pink-600',
    outline: 'bg-transparent border-2 border-[#E0407B] text-[#E0407B] hover:bg-[#E0407B] hover:text-white',
    form: 'w-full bg-[#E0407B] text-white hover:bg-pink-600 rounded-xl text-lg py-4',
  };

  const sizeStyles = {
    default: 'py-3 px-8 rounded-full text-lg',
    small: 'text-sm font-semibold px-5 py-2 rounded-full',
  };
  
  // The form button has its own padding/rounding etc., so we don't apply size styles to it.
  const appliedSizeStyles = variant === 'form' ? '' : sizeStyles[size];

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${appliedSizeStyles}`;

  return (
    <button className={combinedClassName.trim()} {...props}>
      {children}
    </button>
  );
};

export default CustomButton;