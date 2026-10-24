import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';

const DEFAULT_ITEM_SPACING = 16;

type GridItem = {
  key?: string;
  renderCustomItem: () => React.ReactNode;
};

type ItemGridProps = {
  items: GridItem[];
  numColumns: number;
  viewWidth: number;
  itemSpacing?: number;
};

export const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  numColumns,
  viewWidth,
  itemSpacing = DEFAULT_ITEM_SPACING,
}) => {
  const width = Math.floor(viewWidth);
  const itemWidth = (width - itemSpacing * (numColumns - 1)) / numColumns;

  return (
    <View style={[styles.container, { width }]}>
      {items.map((item, index) => {
        const isLastInRow = (index + 1) % numColumns === 0;
        const rowCount = Math.ceil(items.length / numColumns);
        const isLastRow = index + 1 > (rowCount - 1) * numColumns;
        return (
          <View
            key={item.key ?? String(index)}
            style={{
              width: itemWidth,
              marginRight: isLastInRow ? 0 : itemSpacing,
              marginBottom: isLastRow ? 0 : itemSpacing,
            }}
          >
            {item.renderCustomItem()}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
