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
    <View row style={tabBarStyle}>
      {items.map((item, itemIndex) => {
        const selected = itemIndex === index;
        return (
          <Pressable
            key={item.label}
            style={styles.tab}
            onPress={() => select(itemIndex)}
          >
            <Text
              text80
              style={{ color: selected ? Colors.$textPrimary : Colors.$textNeutral }}
            >
              {item.label}
            </Text>
            <View
              style={[
                styles.indicator,
                { backgroundColor: selected ? Colors.$backgroundPrimaryHeavy : 'transparent' },
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );

  const content = (
    <View flex>
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
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  indicator: {
    marginTop: 8,
    height: 3,
    width: '40%',
    borderRadius: 2,
  },
  visiblePage: {
    display: 'flex',
  },
  hiddenPage: {
    display: 'none',
  },
});
