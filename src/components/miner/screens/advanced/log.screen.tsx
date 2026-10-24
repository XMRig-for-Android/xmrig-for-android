import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Assets, Incubator } from 'react-native-ui-lib';
import Anser from 'anser';
import Clipboard from '@react-native-clipboard/clipboard';
import { XMRigLogView } from '../../containers/xmrig-log';
import { ILoggerLine, LoggerActionType, LoggerContext } from '../../../../core/logger';
import { useToaster } from '../../../../core/hooks/use-toaster/use-toaster.hook';
import { SessionDataContext } from '../../../../core/session-data/session-data.context';
import { WorkingState } from '../../../../core/session-data/session-data.interface';
import { palette } from '../../../../core/theme';
import { Choice, IconButton, ScreenHeader } from '../../../core/ui';

enum LogFilter {
  ALL = 'all',
  SHARES = 'shares',
  ERRORS = 'errors',
}

const sharePattern = /accepted|rejected|new job/i;
const errorPattern = /error|fail|rejected|not available|disconnect|timeout|refused/i;

const matches = (line: ILoggerLine, filter: LogFilter) => {
  if (filter === LogFilter.ALL) {
    return true;
  }
  const text = Anser.ansiToText(line.message);
  return filter === LogFilter.SHARES ? sharePattern.test(text) : errorPattern.test(text);
};

const emptyText = {
  [LogFilter.ALL]: 'No output yet.\nStart mining to see XMRig\'s log here.',
  [LogFilter.SHARES]: 'No share activity yet.',
  [LogFilter.ERRORS]: 'No errors. Everything looks healthy.',
};

const LogScreen: React.FC = () => {
  const { loggerState, loggerDispatcher } = React.useContext(LoggerContext);
  const { workingState } = React.useContext(SessionDataContext);
  const toaster = useToaster();
  const [filter, setFilter] = React.useState<LogFilter>(LogFilter.ALL);

  const lines = React.useMemo(
    () => (filter === LogFilter.ALL ? loggerState : loggerState.filter((line) => matches(line, filter))),
    [loggerState, filter],
  );

  const copyToClipboard = () => {
    Clipboard.setString(
      lines
        .map((item) => `${new Date(item.ts).toISOString()} ${Anser.ansiToText(item.message)}`)
        .join('\n'),
    );
    toaster({
      message: `Copied ${lines.length} lines to clipboard`,
      position: 'top',
      preset: Incubator.ToastPresets.SUCCESS,
    });
  };

  const clearLog = () => Alert.alert('Clear log?', 'This only clears the on-screen history.', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Clear',
      style: 'destructive',
      onPress: () => loggerDispatcher({ type: LoggerActionType.RESET }),
    },
  ]);

  const live = workingState === WorkingState.MINING;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Log"
        subtitle={`${loggerState.length} lines${live ? ' · live' : ''}`}
        action={(
          <View style={styles.actions}>
            <IconButton icon={Assets.icons.clipboard} onPress={copyToClipboard} accessibilityLabel="Copy log" />
            <IconButton icon={Assets.icons.trash} tone="danger" onPress={clearLog} accessibilityLabel="Clear log" />
          </View>
        )}
      />
      <View style={styles.filters}>
        <Choice
          value={filter}
          onChange={setFilter}
          options={[
            { label: 'All', value: LogFilter.ALL },
            { label: 'Shares', value: LogFilter.SHARES },
            { label: 'Errors', value: LogFilter.ERRORS },
          ]}
        />
      </View>
      <View style={styles.body}>
        <XMRigLogView data={lines} emptyText={emptyText[filter]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  filters: {
    paddingHorizontal: 16,
    marginTop: -10,
    marginBottom: 12,
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
});

export default LogScreen;
