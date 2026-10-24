import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { View, ViewProps } from 'react-native-ui-lib';
import _ from 'lodash';
import { AnsiText } from '../../core/ansi-text';
import { ILoggerLine } from '../../../core/logger';
import { palette, radius } from '../../../core/theme';

type LogViewProps = ViewProps & {
    data: ILoggerLine[];
}

export const XMRigLogView: React.FC<LogViewProps> = ({
  data,
}) => (
  <View flex-1 style={styles.terminal}>
    {_.takeRight(data, 100).map((value, index) => (
      <AnsiText
        textStyle={styles.logTextDefault}
        containerStyle={styles.logContainer}
        ansi={value.message}
        key={`key-${value.id}-${index}`}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  terminal: {
    backgroundColor: palette.heroFrom,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  logContainer: {
    paddingVertical: 2,
  } as ViewStyle,
  logTextDefault: {
    color: 'rgba(255, 255, 255, 0.86)',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'monospace',
  },
});
