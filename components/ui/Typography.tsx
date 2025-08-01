import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

export const Heading1 = ({ children, className }: TypographyProps) => (
  <h1 className={cn(
    "text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none text-white",
    className
  )}>
    {children}
  </h1>
);

export const Heading2 = ({ children, className }: TypographyProps) => (
  <h2 className={cn(
    "text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-none",
    className
  )}>
    {children}
  </h2>
);

export const Heading3 = ({ children, className }: TypographyProps) => (
  <h3 className={cn(
    "text-4xl md:text-5xl font-black leading-tight text-white",
    className
  )}>
    {children}
  </h3>
);

export const Paragraph = ({ children, className }: TypographyProps) => (
  <p className={cn(
    "text-lg text-gray-300",
    className
  )}>
    {children}
  </p>
);

export const Button = ({ children, className }: TypographyProps) => (
  <button className={cn(
    "border border-gray-500 rounded-full px-8 py-3 text-white font-bold hover:bg-white hover:text-black transition-colors",
    className
  )}>
    {children}
  </button>
);
