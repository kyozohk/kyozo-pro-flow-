export const colors = {
  // Background colors
  bgPrimary: '#121212',
  bgSecondary: '#181818', // Card background color
  bgAccent: '#1C1C1C',
  
  // Border colors
  borderPrimary: '#3B3B3B', // Card border color
  borderSecondary: 'rgba(255, 255, 255, 0.1)',
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#A3A3A3',
  textAccent: '#D45E9B',
  
  // Brand colors
  primary: '#D45E9B', // Pink
  secondary: '#4A6CF7', // Blue
  tertiary: '#FFD166', // Yellow
  
  // Utility colors
  dark: '#121212',
  light: '#FFFFFF',
  success: '#4CAF50',
  error: '#FF5252',
  warning: '#FFC107',
};

export const fonts = {
  // Font families
  primary: 'var(--font-inter), system-ui, sans-serif',
  secondary: 'var(--font-montserrat), Georgia, serif',
  
  // Font weights
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  black: 900,
  
  // Font sizes
  xs: '0.75rem',     // 12px
  sm: '0.875rem',    // 14px
  base: '1rem',      // 16px
  lg: '1.125rem',    // 18px
  xl: '1.25rem',     // 20px
  '2xl': '1.5rem',   // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
  '5xl': '3rem',     // 48px
  '6xl': '3.75rem',  // 60px
  '7xl': '4.5rem',   // 72px
};

export const spacing = {
  // Spacing scale
  '0': '0',
  '1': '0.25rem',    // 4px
  '2': '0.5rem',     // 8px
  '3': '0.75rem',    // 12px
  '4': '1rem',       // 16px
  '5': '1.25rem',    // 20px
  '6': '1.5rem',     // 24px
  '8': '2rem',       // 32px
  '10': '2.5rem',    // 40px
  '12': '3rem',      // 48px
  '16': '4rem',      // 64px
  '20': '5rem',      // 80px
  '24': '6rem',      // 96px
  '32': '8rem',      // 128px
  '40': '10rem',     // 160px
  '48': '12rem',     // 192px
  '56': '14rem',     // 224px
  '64': '16rem',     // 256px
};

export const borderRadius = {
  none: '0',
  sm: '0.125rem',    // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',     // 16px
  '3xl': '1.5rem',   // 24px
  '4xl': '2rem',     // 32px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  card: '0 0 40px rgba(255, 255, 255, 0.05)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
};

export const zIndices = {
  auto: 'auto',
  '0': '0',
  '10': '10',
  '20': '20',
  '30': '30',
  '40': '40',
  '50': '50',
  '60': '60',
  '70': '70',
  '80': '80',
  '90': '90',
  '100': '100',
  modal: '1000',
  tooltip: '1100',
};

export const transitions = {
  DEFAULT: 'all 0.3s ease',
  fast: 'all 0.15s ease',
  slow: 'all 0.5s ease',
};

const theme = {
  colors,
  fonts,
  spacing,
  borderRadius,
  shadows,
  zIndices,
  transitions,
};

export default theme;
