import { ViewStyle } from 'react-native';

export const palette = {
  background: '#F3F4F8',
  surface: '#FFFFFF',
  surfaceMuted: '#F7F8FB',
  ink: '#0E1022',
  inkMuted: '#5F6478',
  inkSubtle: '#9599AA',
  hairline: 'rgba(14, 16, 34, 0.06)',
  track: '#E6E8EF',
  accent: '#6E5BFF',
  accentSoft: '#EEEBFF',
  violet: '#A66BFF',
  success: '#1FBF75',
  successSoft: '#E3F7EE',
  danger: '#F2456B',
  dangerSoft: '#FDE8EE',
  warning: '#F5A524',
  warningSoft: '#FEF3DF',
  heroFrom: '#12142B',
  heroVia: '#1F1A4A',
  heroTo: '#3A2A86',
  onHero: '#FFFFFF',
  onHeroMuted: 'rgba(255, 255, 255, 0.62)',
  onHeroSubtle: 'rgba(255, 255, 255, 0.12)',
};

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  pill: 999,
};

export const shadow = (level: 1 | 2 | 3 = 1): ViewStyle => {
  const presets = {
    1: { opacity: 0.05, radius: 10, y: 3, elevation: 1 },
    2: { opacity: 0.08, radius: 18, y: 8, elevation: 3 },
    3: { opacity: 0.22, radius: 28, y: 14, elevation: 8 },
  }[level];
  return {
    shadowColor: '#1A1640',
    shadowOpacity: presets.opacity,
    shadowRadius: presets.radius,
    shadowOffset: { width: 0, height: presets.y },
    elevation: presets.elevation,
  };
};

export const splitHashrate = (formatted: string): { value: string; unit: string } => {
  const [value = '0', unit = 'H'] = formatted.split(' ');
  return { value, unit };
};
