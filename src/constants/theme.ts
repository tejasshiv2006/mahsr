export const Colors = {
  primary: '#0B1F3A',
  secondary: '#1685D5',
  accent: '#F6B93B',
  success: '#10B981',
  available: '#1685D5',
  selected: '#F6B93B',
  unavailable: '#D5DCE5',
  surface: '#F4F7FB',
  surfaceCard: '#FFFFFF',
  background: '#FFFFFF',
  divider: '#E1E7EF',
  textPrimary: '#14253D',
  textSecondary: '#65758B',
  textLight: '#B8C7DA',
  textOnDark: '#FFFFFF',
  demoRed: '#EF4444',
} as const;

export const Spacing = {
  sm: 8,
  base: 16,
  xl: 24,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  full: 999,
} as const;

export const Shadow = {
  md: {
    shadowColor: '#0B1F3A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
} as const;
