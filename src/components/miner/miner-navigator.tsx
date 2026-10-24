import React from 'react';
import { ViewProps } from 'react-native';
import { SegmentedTabs } from '../core/segmented-tabs';
import MinerScreen from './screens/advanced/miner.screen';
import LogScreen from './screens/advanced/log.screen';

const tabs = [{ label: 'Dashboard' }, { label: 'Log' }];
const pages = [<MinerScreen />, <LogScreen />];

export const TabNavigator:React.FC<ViewProps> = () => (
  <SegmentedTabs items={tabs} pages={pages} lazyIndexes={[1]} tabBarPosition="bottom" />
);
