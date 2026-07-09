export const Colors = {
  bgDark: '#021B3A',
  bgCardDark: '#04285A',
  bgLight: '#F8FBFF',
  bgCardLight: '#FFFFFF',

  accentNeon: '#00CFFF',
  accentBlue: '#065A82',
  accentTeal: '#0891B2',

  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  purple: '#7C3AED',
  pink: '#EC4899',
  cyan: '#14B8A6',

  textPrimary: '#021B3A',
  textSecondary: '#4A6580',
  textMuted: '#8EA8BE',
  textWhite: '#FFFFFF',
  textOff: '#AACCEE',
  textDim: '#6699BB',

  hubspot: '#FF7A59',
  borderDark: 'rgba(255,255,255,0.08)',
  borderLight: 'rgba(2,27,58,0.09)',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  card: 14,
  button: 10,
  sm: 8,
  lg: 20,
  full: 999,
} as const;

export const Typography = {
  displayLg: { fontSize: 32, fontWeight: '800' as const },
  displayMd: { fontSize: 26, fontWeight: '700' as const },
  displaySm: { fontSize: 20, fontWeight: '700' as const },
  bodyLg: { fontSize: 15, fontWeight: '400' as const },
  bodyMd: { fontSize: 13, fontWeight: '400' as const },
  bodySm: { fontSize: 11, fontWeight: '400' as const },
  label: { fontSize: 10, fontWeight: '700' as const, textTransform: 'uppercase' as const, letterSpacing: 1.5 },
} as const;

export const Layout = {
  bottomNavHeight: 60,
  headerHeight: 56,
  screenPadding: 16,
  accentStripeHeight: 3,
} as const;
