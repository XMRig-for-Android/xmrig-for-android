import React from 'react';
import {
  FlatList, NativeScrollEvent, NativeSyntheticEvent, Pressable, StyleSheet, Text, View,
} from 'react-native';
import { AnsiText } from '../../core/ansi-text';
import { ILoggerLine } from '../../../core/logger';
import { palette, radius } from '../../../core/theme';

type LogViewProps = {
  data: ILoggerLine[];
  emptyText: string;
};

const pad = (value: number) => `${value}`.padStart(2, '0');
const formatTime = (ts: Date) => {
  const date = new Date(ts);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

type LogRowProps = { line: ILoggerLine };

const LogRow = React.memo(({ line }: LogRowProps) => (
  <View style={styles.row}>
    <Text style={styles.time}>{formatTime(line.ts)}</Text>
    <AnsiText ansi={line.message} textStyle={styles.message} containerStyle={styles.messageWrap} />
  </View>
));

const keyExtractor = (item: ILoggerLine) => item.id;
const renderItem = ({ item }: { item: ILoggerLine }) => <LogRow line={item} />;

export const XMRigLogView: React.FC<LogViewProps> = ({ data, emptyText }) => {
  const listRef = React.useRef<FlatList<ILoggerLine>>(null);
  const [showJump, setShowJump] = React.useState(false);
  const newestFirst = React.useMemo(() => [...data].reverse(), [data]);

  const onScroll = React.useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const awayFromLatest = event.nativeEvent.contentOffset.y > 48;
    setShowJump((current) => (current === awayFromLatest ? current : awayFromLatest));
  }, []);

  const jumpToLatest = () => {
    setShowJump(false);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  if (data.length === 0) {
    return (
      <View style={[styles.terminal, styles.emptyContainer]}>
        <Text style={styles.empty}>{emptyText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.terminal}>
      <FlatList
        ref={listRef}
        inverted
        data={newestFirst}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onScroll={onScroll}
        scrollEventThrottle={64}
        maintainVisibleContentPosition={showJump ? { minIndexForVisible: 0 } : undefined}
        initialNumToRender={30}
        maxToRenderPerBatch={20}
        windowSize={7}
        removeClippedSubviews
        contentContainerStyle={styles.content}
      />
      {showJump ? (
        <Pressable onPress={jumpToLatest} style={styles.jump}>
          <Text style={styles.jumpText}>↓  Jump to latest</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  terminal: {
    flex: 1,
    backgroundColor: palette.heroFrom,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  content: {
    paddingVertical: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  empty: {
    color: palette.onHeroMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 3,
  },
  time: {
    width: 64,
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 11,
    lineHeight: 18,
    fontFamily: 'monospace',
  },
  messageWrap: {
    flex: 1,
  },
  message: {
    color: 'rgba(255, 255, 255, 0.86)',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'monospace',
  },
  jump: {
    position: 'absolute',
    bottom: 14,
    alignSelf: 'center',
    backgroundColor: palette.accent,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  jumpText: {
    color: palette.onHero,
    fontSize: 13,
    fontWeight: '700',
  },
});
