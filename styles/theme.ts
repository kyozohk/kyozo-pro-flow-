// Theme constants for consistent styling across the application

export const colors = {
  // Primary colors
  primary: '#E0407B',
  primaryHover: '#D03A6F',
  primaryLight: '#F06A9C',
  
  // Background colors
  bgDark: '#1C1C1E',
  bgDarker: '#000000',
  bgCard: '#1C1C1E',
  bgCardAlt: '#2A2A2B',
  bgExclusive: '#181818',
  
  // Border colors
  borderDark: '#2C2C2E',
  borderLight: '#3C3C3E',
  borderMedium: '#3B3B3B55',
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textMuted: '#707070',
  
  // Gradient colors
  gradientStart: '#8B5CF6', // purple-600
  gradientMiddle: '#EC4899', // pink-500
  gradientEnd: '#3B82F6', // blue-500
};

export const fontSizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
};

export const fontWeights = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export const spacing = {
  xs: 'p-2',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
  '2xl': 'p-12',
};

export const borderRadius = {
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
};

// Tailwind class combinations for common UI elements
export const uiElements = {
  card: `bg-[${colors.bgCard}] ${borderRadius['2xl']} border border-[${colors.borderDark}] shadow-lg`,
  heroHeading: `${fontSizes['5xl']} md:${fontSizes['6xl']} ${fontWeights.bold} text-[${colors.textPrimary}] font-hero`,
  sectionHeading: `${fontSizes['3xl']} ${fontWeights.bold} text-[${colors.textPrimary}]`,
  paragraph: `${fontSizes.base} text-[${colors.textSecondary}]`,
  gradientBorder: `bg-gradient-to-br from-[${colors.gradientStart}] via-[${colors.gradientMiddle}] to-[${colors.gradientEnd}]`,
};

export default {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  uiElements,
};
