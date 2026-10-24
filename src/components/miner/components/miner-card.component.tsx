import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Card, CardProps, ViewProps, View, Colors, Text,
} from 'react-native-ui-lib';

export type MinerCardProps = ViewProps & {
  title?: string;
  subTitle?: string;
  value?: string | number;
  disabled?: boolean;
  cardProps?: CardProps;
};

export const MinerCard: React.FC<MinerCardProps> = ({
  style,
  children,
  title = '',
  subTitle = '',
  value,
  disabled = false,
  cardProps = {},
}) => (
  <Card
    flex
    enableShadow
    borderRadius={18}
    containerStyle={styles.card}
    style={[style, disabled ? styles.disabledCard : undefined]}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...cardProps}
  >
    <View paddingH-14 paddingT-14 paddingB-12>
      {title ? <Text style={styles.label}>{title}</Text> : null}
      {value != null && value !== '' ? (
        <Text style={styles.value} numberOfLines={2}>{`${value}`}</Text>
      ) : null}
      {subTitle ? <Text style={styles.accent} numberOfLines={1}>{subTitle}</Text> : null}
    </View>
    {children}
  </Card>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  disabledCard: {
    opacity: 0.35,
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Colors.$textNeutral,
    fontWeight: '600',
  },
  value: {
    marginTop: 8,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '700',
    color: Colors.$textDefault,
  },
  accent: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.$textPrimary,
  },
});
