export const colors = {
  // Yllure Brand Colors
  taupe: '#8A7564',
  greige: '#A89F94',
  champagne: '#D6BFAF',
  ivory: '#F9F5F0',
  charcoal: '#1C1C1C',
  
  // Color variations
  taupeLight: '#9D8B7A',
  taupeDark: '#6B5A4A',
  greigeLight: '#B5ADA4',
  greigeDark: '#8A827A',
  champagneLight: '#E1D0C1',
  champagneDark: '#C8AD98',
  ivoryDark: '#F0EBE4',
  charcoalLight: '#2D2D2D',
  
  // System colors
  white: '#FFFFFF',
  black: '#000000',
  error: '#DC2626',
  warning: '#F59E0B',
  success: '#10B981',
  info: '#3B82F6',
};

export const fonts = {
  heading: 'CormorantGaramond_400Regular',
  body: 'System',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
};

export const shadows = {
  subtle: {
    shadowColor: colors.charcoal,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  elegant: {
    shadowColor: colors.charcoal,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  luxury: {
    shadowColor: colors.charcoal,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
};

export const typography = {
  heroTitle: {
    fontFamily: fonts.heading,
    fontSize: 42,
    fontWeight: '300' as const,
    lineHeight: 48,
    letterSpacing: -0.5,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 24,
    fontWeight: '500' as const,
    lineHeight: 28,
  },
  cardTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    fontWeight: '500' as const,
    lineHeight: 22,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
  },
  bodySmall: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
  },
};