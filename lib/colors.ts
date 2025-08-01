// Color palette for reusable colors across the application

// Base colors - aligned with CSS variables in globals.css
export const baseColors = {
  background: '#0a0a0a',    // --background
  foreground: '#ededed',    // --foreground
  black: '#0D0D0D',         // Near black
  white: '#FFFFFF',         // White
};

// Brand colors - aligned with CSS variables in globals.css
export const brandColors = {
  primary: '#EEC87E',       // Gold - matches --primary
  primaryLight: '#F5D89A',  // Light gold - matches --primary-light
  primaryDark: '#D4AF37',   // Dark gold - matches --primary-dark
  purple: '#7C3AED',        // Purple
  green: '#10B981',         // Green
  amber: '#F59E0B',         // Amber
  pink: '#EC4899',          // Pink
};

// Accent colors - aligned with CSS variables in globals.css
export const accentColors = {
  purple: 'rgba(185,163,255,0.34)', // --accent-purple
  teal: 'rgba(64,192,172,0.3)',     // --accent-teal
  orange: 'rgba(187, 98, 73, 0.3)', // --accent-orange
};

// Text colors - aligned with CSS variables in globals.css
export const textColors = {
  primary: '#ffffff',       // --text-primary
  secondary: '#ededed',     // --text-secondary
  muted: '#a1a1aa',         // --text-muted (gray-400)
};

// UI element colors - extracted from components
export const uiColors = {
  cardBackground: '#1C1C1C',    // Card and Footer background
  darkBackground: '#1A1A1A',    // Toolkit background
  borderColor: 'rgba(255, 255, 255, 0.1)', // white/10 in Tailwind
  shadowColor: 'rgba(255, 255, 255, 0.05)', // Shadow color for cards
};

// Gradient colors - extracted from components
export const gradientColors = {
  purpleBlue: {
    from: '#D646FF',
    to: '#46A3FF',
  },
  purplePink: {
    from: '#D646FF',
    to: '#E74B92',
  },
};

// SVG colors - extracted from components
export const svgColors = {
  gold: '#EEC87E',
  goldGradient: {
    start: '#D4AF37',
    end: '#D4AF37', // with opacity 0
  },
  purplePath: '#A78BFA',
  goldGradientWithOpacity: {
    start: '#D4AF37', // with opacity 0.8
    end: '#B8860B',   // with opacity 0.6
  },
  purpleGradient: {
    start: '#C3B1E1', // with opacity 0.7
    end: '#8A2BE2',   // with opacity 0
  },
};

// Bubble row colors - organized by row
export const bubbleRowColors = {
  music: '#89CFF0',          // Light blue
  artMovements: '#C3B1E1',   // Lavender
  crafts: '#FDFD96',         // Light yellow
  fashion: '#FF6961',        // Light red
  performance: '#DFFF00',    // Lime green
};

// Alternative bubble colors for different themes
export const bubbleThemeColors = {
  blue: {
    primary: '#3B82F6',
    secondary: '#60A5FA',
    tertiary: '#93C5FD',
  },
  purple: {
    primary: '#8B5CF6',
    secondary: '#A78BFA',
    tertiary: '#C4B5FD',
  },
  green: {
    primary: '#10B981',
    secondary: '#34D399',
    tertiary: '#6EE7B7',
  },
  red: {
    primary: '#EF4444',
    secondary: '#F87171',
    tertiary: '#FCA5A5',
  },
  yellow: {
    primary: '#F59E0B',
    secondary: '#FBBF24',
    tertiary: '#FCD34D',
  },
};

// Export a default color palette for easy import
export default {
  base: baseColors,
  brand: brandColors,
  accent: accentColors,
  text: textColors,
  ui: uiColors,
  gradient: gradientColors,
  svg: svgColors,
  bubbleRows: bubbleRowColors,
  themes: bubbleThemeColors,
};
