import { merge } from 'lodash/fp';
import React from 'react';
import {
  Card, Colors, SkeletonView, Switch, Text, View,
} from 'react-native-ui-lib';
import { Dimensions, ScaledSize } from 'react-native';
import { ItemGrid } from '../../../../core/item-grid';
import { Algorithems, Algorithm } from '../../../../../core/settings/settings.interface';
import { EditSimpleCardProps } from './index';

const screen = Dimensions.get('screen');

export const EditSimpleAlgorithemsCard: React.FC<EditSimpleCardProps> = (
  { setLocalState, localState },
) => {
  const [dimensions, setDimensions] = React.useState<ScaledSize>({
    ...screen,
    width: screen.width - 20,
  });

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ screen: nextScreen }: { screen: ScaledSize }) => {
        setDimensions({
          ...nextScreen,
          width: nextScreen.width - 20,
        });
      },
    );
    return () => subscription?.remove();
  }, []);

  const renderItem = React.useCallback((item: Algorithm) => (
    <View marginB-5 key={`algo-${item}`} style={{ borderBottomWidth: 1, borderColor: Colors.$outlineDisabled }} marginR-10 paddingB-10>
      <View row flex>
        <Text text90 $textNeutralLight flex column marginB-5>{item}</Text>
        <Switch
          value={localState.properties?.algos ? localState.properties?.algos[item] : true}
          onValueChange={(value) => setLocalState((oldState) => merge(
            oldState,
            {
              properties: {
                algos: {
                  [`${item}`]: value,
                },
              },
            },
          ))}
        />
      </View>
    </View>
  ), [localState.properties]);

  return React.useMemo(() => (
    <Card
      enableShadow
    >
      <View centerV spread padding-20 paddingB-5>
        <Card.Section
          style={{ flexShrink: 1 }}
          content={[
            { text: 'Algorithems', text65: true, $textDefault: true },
            { text: 'Enable/Disable miner supported algorithems, some of the algorithems can casue problems on some devices. If the miner is stuck/crash on some algorithem you can disable these algorithem.', text90: true, $textNeutral: true },
          ]}
        />
      </View>
      <View spread padding-20 paddingT-10>
        <ItemGrid
          numColumns={2}
          viewWidth={dimensions.width - 20}
          itemSpacing={10}
          items={
          [...Algorithems].sort().map((item) => ({
            key: item,
            renderCustomItem: () => renderItem(item),
          }))
        }
        />
      </View>
    </Card>
  ), [dimensions.width, Algorithems, localState.properties?.algos]);
};

const EditSimpleAlgorithemsCardSkeleton: React.FC<EditSimpleCardProps> = (props) => {
  const [loaded, setLoaded] = React.useState<boolean>(false);
  React.useEffect(() => {
    const interval = setTimeout(() => setLoaded(true), 800);
    return () => {
      clearTimeout(interval);
      setLoaded(false);
    };
  }, []);

  return (
    <SkeletonView
      template={SkeletonView.templates.TEXT_CONTENT}
      customValue={props}
      showContent={loaded}
      renderContent={
        // eslint-disable-next-line react/jsx-props-no-spreading
        (customProps: EditSimpleCardProps) => (<EditSimpleAlgorithemsCard {...customProps} />)
      }
      times={5}
    />
  );
};

export default EditSimpleAlgorithemsCardSkeleton;
