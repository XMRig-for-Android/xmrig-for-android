import React from 'react';
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  StyleSheet,
  Switch,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Slider, TextField, TextFieldProps } from 'react-native-ui-lib';
import { palette, radius, shadow } from '../../core/theme';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, subtitle, action }) => (
  <View style={styles.screenHeader}>
    <View style={styles.flex}>
      <Text style={styles.screenTitle} numberOfLines={1}>{title}</Text>
      {subtitle ? <Text style={styles.screenSubtitle}>{subtitle}</Text> : null}
    </View>
    {action}
  </View>
);

type SectionProps = React.PropsWithChildren<{
  title: string;
  description?: string;
  action?: React.ReactNode;
  invalid?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

export const Section: React.FC<SectionProps> = ({
  title, description, action, invalid = false, style, children,
}) => (
  <View style={[styles.section, invalid && styles.sectionInvalid, style]}>
    <View style={styles.sectionHeader}>
      <View style={styles.flex}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {invalid ? <Badge label="Needs attention" tone="danger" /> : null}
        </View>
        {description ? <Text style={styles.sectionDescription}>{description}</Text> : null}
      </View>
      {action ? <View style={styles.sectionAction}>{action}</View> : null}
    </View>
    {children}
  </View>
);

type BadgeProps = { label: string; tone?: 'accent' | 'success' | 'danger' | 'warning' | 'neutral' };

const badgeTones = {
  accent: { bg: palette.accentSoft, fg: palette.accent },
  success: { bg: palette.successSoft, fg: palette.success },
  danger: { bg: palette.dangerSoft, fg: palette.danger },
  warning: { bg: palette.warningSoft, fg: '#B4730B' },
  neutral: { bg: palette.surfaceMuted, fg: palette.inkMuted },
};

export const Badge: React.FC<BadgeProps> = ({ label, tone = 'neutral' }) => (
  <View style={[styles.badge, { backgroundColor: badgeTones[tone].bg }]}>
    <Text style={[styles.badgeText, { color: badgeTones[tone].fg }]}>{label}</Text>
  </View>
);

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  icon?: ImageSourcePropType;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

const buttonVariants: Record<string, { bg: string; fg: string }> = {
  primary: { bg: palette.ink, fg: palette.onHero },
  secondary: { bg: palette.accentSoft, fg: palette.accent },
  danger: { bg: palette.dangerSoft, fg: palette.danger },
  ghost: { bg: 'transparent', fg: palette.inkMuted },
};

export const Button: React.FC<ButtonProps> = ({
  label, onPress, variant = 'primary', size = 'md', icon, disabled = false, loading = false, style,
}) => {
  const colors = buttonVariants[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        size === 'sm' && styles.buttonSm,
        { backgroundColor: colors.bg },
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? <ActivityIndicator size="small" color={colors.fg} style={styles.buttonIcon} /> : null}
      {icon && !loading ? (
        <Image source={icon} style={[styles.buttonIcon, styles.buttonIconImage, { tintColor: colors.fg }]} resizeMode="contain" />
      ) : null}
      <Text style={[styles.buttonLabel, size === 'sm' && styles.buttonLabelSm, { color: colors.fg }]}>
        {label}
      </Text>
    </Pressable>
  );
};

export const IconButton: React.FC<{
  icon: ImageSourcePropType;
  onPress: () => void;
  tone?: 'neutral' | 'danger';
  accessibilityLabel: string;
}> = ({
  icon, onPress, tone = 'neutral', accessibilityLabel,
}) => (
  <Pressable
    onPress={onPress}
    accessibilityLabel={accessibilityLabel}
    hitSlop={8}
    style={({ pressed }) => [
      styles.iconButton,
      { backgroundColor: tone === 'danger' ? palette.dangerSoft : palette.surface },
      pressed && styles.pressed,
    ]}
  >
    <Image
      source={icon}
      style={[styles.iconButtonImage, { tintColor: tone === 'danger' ? palette.danger : palette.inkMuted }]}
      resizeMode="contain"
    />
  </Pressable>
);

type ToggleRowProps = {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  first?: boolean;
};

export const ToggleRow: React.FC<ToggleRowProps> = ({
  label, description, value, onValueChange, first = false,
}) => (
  <Pressable
    onPress={() => onValueChange(!value)}
    style={[styles.row, !first && styles.rowBorder]}
  >
    <View style={styles.flex}>
      <Text style={styles.rowLabel}>{label}</Text>
      {description ? <Text style={styles.rowDescription}>{description}</Text> : null}
    </View>
    <Switch
      value={!!value}
      onValueChange={onValueChange}
      trackColor={{ false: palette.track, true: palette.accent }}
      thumbColor={palette.surface}
    />
  </Pressable>
);

type ChoiceOption<T> = { label: string; value: T; description?: string };

type ChoiceProps<T> = {
  options: ChoiceOption<T>[];
  value?: T;
  onChange: (value: T) => void;
  layout?: 'segmented' | 'cards';
};

export const Choice = <T extends string>({
  options, value, onChange, layout = 'segmented',
}: ChoiceProps<T>) => {
  if (layout === 'cards') {
    return (
      <View style={styles.choiceCards}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={[styles.choiceCard, selected && styles.choiceCardSelected]}
            >
              <View style={[styles.radio, selected && styles.radioSelected]}>
                {selected ? <View style={styles.radioDot} /> : null}
              </View>
              <View style={styles.flex}>
                <Text style={styles.choiceCardLabel}>{option.label}</Text>
                {option.description ? (
                  <Text style={styles.choiceCardDescription}>{option.description}</Text>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    );
  }
  return (
    <View style={styles.segmented}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.segment, selected && styles.segmentSelected]}
          >
            <Text style={[styles.segmentLabel, selected && styles.segmentLabelSelected]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export const FieldLabel: React.FC<{ label: string; value?: string; style?: StyleProp<TextStyle> }> = ({
  label, value, style,
}) => (
  <View style={styles.fieldLabelRow}>
    <Text style={[styles.fieldLabel, style]}>{label}</Text>
    {value ? <Text style={styles.fieldValue}>{value}</Text> : null}
  </View>
);

export const HelperText: React.FC<{ children: React.ReactNode; tone?: 'neutral' | 'danger' }> = ({
  children, tone = 'neutral',
}) => (
  <Text style={[styles.helper, tone === 'danger' && { color: palette.danger }]}>{children}</Text>
);

export const textFieldStyles = {
  containerStyle: { marginTop: 14 } as ViewStyle,
  fieldStyle: {
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: palette.track,
    paddingHorizontal: 14,
    paddingVertical: 12,
  } as ViewStyle,
  labelStyle: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.inkMuted,
    marginBottom: 6,
  } as TextStyle,
  style: { fontSize: 15, color: palette.ink } as TextStyle,
  validationMessageStyle: { fontSize: 12, marginTop: 4 } as TextStyle,
  charCounterStyle: { fontSize: 11, color: palette.inkSubtle } as TextStyle,
  placeholderTextColor: palette.inkSubtle,
};

type SliderRowProps = {
  label: string;
  description?: string;
  value: number;
  minimumValue: number;
  maximumValue: number;
  step?: number;
  format?: (value: number) => string;
  onCommit: (value: number) => void;
  first?: boolean;
};

export const SliderRow: React.FC<SliderRowProps> = ({
  label, description, value, minimumValue, maximumValue, step = 1,
  format = (v) => `${v}`, onCommit, first = false,
}) => {
  const [current, setCurrent] = React.useState(value);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => setCurrent(value), [value]);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <View style={[styles.sliderRow, !first && styles.rowBorder]}>
      <View style={styles.sliderHeader}>
        <Text style={[styles.rowLabel, styles.flex]}>{label}</Text>
        <View style={styles.sliderValue}>
          <Text style={styles.sliderValueText}>{format(current)}</Text>
        </View>
      </View>
      {description ? <Text style={styles.rowDescription}>{description}</Text> : null}
      <Slider
        containerStyle={styles.slider}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        value={value}
        minimumTrackTintColor={palette.accent}
        maximumTrackTintColor={palette.track}
        thumbTintColor={palette.accent}
        onValueChange={(next: number) => {
          setCurrent(next);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => onCommit(next), 400);
        }}
      />
    </View>
  );
};

export const FormField: React.FC<TextFieldProps> = ({
  containerStyle, fieldStyle, enableErrors, validationMessage, ...props
}) => (
  <TextField
    enableErrors={!!enableErrors && !!validationMessage}
    validationMessage={validationMessage}
    labelStyle={textFieldStyles.labelStyle}
    style={textFieldStyles.style}
    validationMessageStyle={textFieldStyles.validationMessageStyle}
    charCounterStyle={textFieldStyles.charCounterStyle}
    placeholderTextColor={textFieldStyles.placeholderTextColor}
    containerStyle={[textFieldStyles.containerStyle, containerStyle]}
    fieldStyle={[textFieldStyles.fieldStyle, fieldStyle]}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  />
);

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: palette.ink,
    letterSpacing: -0.6,
  },
  screenSubtitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '500',
    color: palette.inkSubtle,
  },
  section: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.hairline,
    padding: 18,
    marginBottom: 14,
    ...shadow(1),
  },
  sectionInvalid: {
    borderWidth: 1,
    borderColor: palette.danger,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: palette.ink,
    letterSpacing: -0.3,
  },
  sectionDescription: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: palette.inkMuted,
  },
  sectionAction: {
    marginLeft: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: radius.md,
    paddingHorizontal: 20,
  },
  buttonSm: {
    height: 36,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonIconImage: {
    width: 14,
    height: 14,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  buttonLabelSm: {
    fontSize: 13,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.4,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonImage: {
    width: 16,
    height: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  rowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.track,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.ink,
  },
  rowDescription: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 17,
    color: palette.inkSubtle,
  },
  sliderRow: {
    paddingVertical: 12,
  },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderValue: {
    backgroundColor: palette.accentSoft,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  sliderValueText: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.accent,
    fontVariant: ['tabular-nums'],
  },
  slider: {
    marginTop: 6,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: palette.track,
    padding: 3,
    marginTop: 10,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 9,
  },
  segmentSelected: {
    backgroundColor: palette.surface,
    ...shadow(1),
  },
  segmentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.inkSubtle,
  },
  segmentLabelSelected: {
    color: palette.ink,
    fontWeight: '700',
  },
  choiceCards: {
    gap: 10,
    marginTop: 10,
  },
  choiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: palette.track,
    padding: 14,
  },
  choiceCardSelected: {
    borderColor: palette.accent,
    backgroundColor: palette.accentSoft,
  },
  choiceCardLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.ink,
  },
  choiceCardDescription: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 17,
    color: palette.inkMuted,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: palette.inkSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: palette.accent,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.accent,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.inkMuted,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.ink,
    fontVariant: ['tabular-nums'],
  },
  helper: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 17,
    color: palette.inkSubtle,
  },
});
