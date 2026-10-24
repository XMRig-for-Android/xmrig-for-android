import React from 'react';
import { ViewProps } from 'react-native';
import { LazyLoader } from '../core/lazy-loader';
import { SegmentedTabs } from '../core/segmented-tabs';

const MinerScreen = React.lazy(() => import('./screens/advanced/miner.screen'));
const LogScreen = React.lazy(() => import('./screens/advanced/log.screen'));

const LazyMinerScreen = () => (<LazyLoader><MinerScreen /></LazyLoader>);
const LazyLogScreen = () => (<LazyLoader><LogScreen /></LazyLoader>);

export const TabNavigator:React.FC<ViewProps> = () => (
  <SegmentedTabs
    items={[{ label: 'Miner' }, { label: 'Log' }]}
    pages={[<LazyMinerScreen />, <LazyLogScreen />]}
    lazyIndexes={[1]}
    tabBarPosition="bottom"
  />
);
