import React from 'react';
import {
  Image, ImageSourcePropType, StyleSheet, Text, View, ViewProps,
} from 'react-native';
import { palette, radius, shadow } from '../../../core/theme';

export type MinerCardProps = ViewProps & {
  title?: string;
  value?: string | number;
  unit?: string;
  icon?: ImageSourcePropType;
  tone?: 'default' | 'accent' | 'success' | 'danger';
  disabled?: boolean;
};

const toneColors = {
  default: { fg: palette.ink, iconBg: palette.surfaceMuted, iconTint: palette.inkMuted },
  accent: { fg: palette.ink, iconBg: palette.accentSoft, iconTint: palette.accent },
  success: { fg: palette.success, iconBg: palette.successSoft, iconTint: palette.success },
  danger: { fg: palette.danger, iconBg: palette.dangerSoft, iconTint: palette.danger },
};

const MinerCardBase: React.FC<MinerCardProps> = ({
  style,
  children,
  title = '',
  value,
  unit,
  icon,
  tone = 'default',
  disabled = false,
}) => {
  const colors = toneColors[tone];
  return (
    <View style={[styles.card, disabled ? styles.disabledCard : undefined, style]}>
      <View style={styles.header}>
        {title ? <Text style={styles.label} numberOfLines={1}>{title}</Text> : null}
        {icon ? (
          <View style={[styles.iconWrap, { backgroundColor: colors.iconBg }]}>
            <Image source={icon} style={[styles.icon, { tintColor: colors.iconTint }]} resizeMode="contain" />
          </View>
        ) : null}
      </View>
      {value != null && value !== '' ? (
        <View style={styles.valueRow}>
          <Text style={[styles.value, { color: colors.fg }]} numberOfLines={1} adjustsFontSizeToFit>
            {`${value}`}
          </Text>
          {unit ? <Text style={styles.unit}>{unit}</Text> : null}
        </View>
      ) : null}
      {children}
    </View>
  );
};

export const MinerCard = React.memo(MinerCardBase);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.hairline,
    ...shadow(1),
  },
  disabledCard: {
    opacity: 0.35,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 28,
  },
  label: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: palette.inkSubtle,
    letterSpacing: 0.2,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 14,
    height: 14,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 6,
  },
  value: {
    flexShrink: 1,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    letterSpacing: -0.6,
    fontVariant: ['tabular-nums'],
  },
  unit: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '600',
    color: palette.inkSubtle,
  },
});
