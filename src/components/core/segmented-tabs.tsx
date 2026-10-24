import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Colors, Text, View } from 'react-native-ui-lib';

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

  const bar = (
    <View style={[tabBarPosition === 'bottom' ? styles.bottomWrap : styles.topWrap, tabBarStyle]}>
      <View row style={styles.track}>
        {items.map((item, itemIndex) => {
          const selected = itemIndex === index;
          return (
            <Pressable
              key={item.label}
              style={[styles.tab, selected ? styles.tabSelected : undefined]}
              onPress={() => select(itemIndex)}
            >
              <Text style={[styles.tabLabel, selected ? styles.tabLabelSelected : undefined]}>
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
    paddingTop: 10,
    paddingBottom: 4,
  },
  bottomWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  track: {
    backgroundColor: '#E7E9EE',
    borderRadius: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  tabSelected: {
    backgroundColor: Colors.white,
    shadowColor: '#101828',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.$textNeutral,
  },
  tabLabelSelected: {
    fontWeight: '700',
    color: Colors.$textPrimary,
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
