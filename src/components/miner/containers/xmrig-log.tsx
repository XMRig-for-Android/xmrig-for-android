import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { View, ViewProps } from 'react-native-ui-lib';
import _ from 'lodash';
import { AnsiText } from '../../core/ansi-text';
import { ILoggerLine } from '../../../core/logger';

type LogViewProps = ViewProps & {
    data: ILoggerLine[];
}

export const XMRigLogView: React.FC<LogViewProps> = ({
  data,
}) => (
  <View flex-1 paddingV-10 bg-black br40>
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
  logContainer: {
    backgroundColor: 'black',
    paddingVertical: 2,
    borderRadius: 0,
  } as ViewStyle,
  logTextDefault: {
    color: 'white',
    fontSize: 13,
  },
});
