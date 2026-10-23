import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Card, CardProps, ViewProps, Badge, View, Colors, BadgeProps,
} from 'react-native-ui-lib';

export type MinerCardProps = ViewProps & {
    title?: string;
    subTitle?: string;
    disabled?: boolean;
    cardProps?: CardProps;
    badgeProps?: BadgeProps;
};

export const MinerCard:React.FC<MinerCardProps> = ({
  style,
  children,
  title = '',
  subTitle = '',
  disabled = false,
  cardProps = {},
  badgeProps = {},
}) => (
  <Card
    enableShadow
    flex
    style={[style, disabled ? styles.disabledCard : { overflow: 'hidden' }]}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...cardProps}
  >
    <View centerV spread padding-10 paddingB-5>
      {title && (
        <View row>
          <Card.Section
            content={[
              { text: title, text75: true, grey30: true },
            ]}
            style={{
              borderTopRightRadius: 0,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
          />
        </View>
      )}
      { subTitle && (
        <View row paddingT-5>
          <Badge
            backgroundColor={Colors.$backgroundPrimaryLight}
            labelStyle={{ color: Colors.$textPrimary }}
            label={subTitle}
            size={16}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...badgeProps}
          />
        </View>
      )}
    </View>
    {children}
  </Card>
);

const styles = StyleSheet.create({
  disabledCard: {
    opacity: 0.2,
  },
});
