import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import { palette, radius, shadow } from '../../core/theme';

type TabItem = {
  label: string;
};

type SegmentedTabsProps = {
  items: TabItem[];
  pages: React.ReactNode[];
  lazyIndexes?: number[];
  tabBarPosition?: 'top' | 'bottom';
  tabBarStyle?: StyleProp<ViewStyle>;
};

export const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  items,
  pages,
  lazyIndexes = [],
  tabBarPosition = 'top',
  tabBarStyle,
}) => {
  const [index, setIndex] = React.useState(0);
  const [visited, setVisited] = React.useState<number[]>([0]);

  const select = (next: number) => {
    setIndex(next);
    setVisited((current) => (current.includes(next) ? current : [...current, next]));
  };

  const isBottom = tabBarPosition === 'bottom';

  const bar = (
    <View style={[isBottom ? styles.bottomWrap : styles.topWrap, tabBarStyle]}>
      <View row style={[styles.track, isBottom && styles.trackDark]}>
        {items.map((item, itemIndex) => {
          const selected = itemIndex === index;
          return (
            <Pressable
              key={item.label}
              style={[
                styles.tab,
                selected && styles.tabSelected,
                selected && isBottom && styles.tabSelectedDark,
              ]}
              onPress={() => select(itemIndex)}
            >
              <Text
                style={[
                  styles.tabLabel,
                  isBottom && styles.tabLabelDark,
                  selected && styles.tabLabelSelected,
                  selected && isBottom && styles.tabLabelSelectedDark,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const content = (
    <View flex style={styles.content}>
      {pages.map((page, pageIndex) => {
        const shouldMount = !lazyIndexes.includes(pageIndex) || visited.includes(pageIndex);
        if (!shouldMount) {
          return null;
        }
        return (
          <View
            key={items[pageIndex].label}
            flex
            style={pageIndex === index ? styles.visiblePage : styles.hiddenPage}
            pointerEvents={pageIndex === index ? 'auto' : 'none'}
          >
            {page}
          </View>
        );
      })}
    </View>
  );

  return (
    <View flex>
      {tabBarPosition === 'top' ? bar : null}
      {content}
      {tabBarPosition === 'bottom' ? bar : null}
    </View>
  );
};

const styles = StyleSheet.create({
  topWrap: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    backgroundColor: palette.background,
  },
  bottomWrap: {
    paddingHorizontal: 40,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: palette.background,
  },
  track: {
    backgroundColor: palette.track,
    borderRadius: radius.md,
    padding: 4,
  },
  trackDark: {
    backgroundColor: palette.ink,
    borderRadius: radius.pill,
    padding: 5,
    ...shadow(3),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 14,
  },
  tabSelected: {
    backgroundColor: palette.surface,
    ...shadow(1),
  },
  tabSelectedDark: {
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    elevation: 0,
    shadowOpacity: 0,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.inkSubtle,
  },
  tabLabelDark: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  tabLabelSelected: {
    fontWeight: '700',
    color: palette.ink,
  },
  tabLabelSelectedDark: {
    color: palette.onHero,
  },
  content: {
    minHeight: 0,
    overflow: 'hidden',
  },
  visiblePage: {
    flex: 1,
    minHeight: 0,
  },
  hiddenPage: {
    display: 'none',
  },
});
