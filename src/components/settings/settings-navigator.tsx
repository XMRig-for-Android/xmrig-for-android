import React from 'react';
import {
  Colors,
} from 'react-native-ui-lib';
import { ViewProps } from 'react-native';
import { LazyLoader } from '../core/lazy-loader';
import { SegmentedTabs } from '../core/segmented-tabs';

const ConfigurationsScreen = React.lazy(() => import('./screens/configurations.screen'));
const LazyConfigurationsScreen = () => (<LazyLoader><ConfigurationsScreen /></LazyLoader>);

const SettingsScreen = React.lazy(() => import('./screens/settings.screen'));
const LazySettingsScreen = () => (<LazyLoader><SettingsScreen /></LazyLoader>);

export const TabNavigator:React.FC<ViewProps> = () => (
  <SegmentedTabs
    items={[{ label: 'Configurations' }, { label: 'Settings' }]}
    pages={[<LazyConfigurationsScreen />, <LazySettingsScreen />]}
    lazyIndexes={[1]}
    tabBarPosition="bottom"
    tabBarStyle={{
      overflow: 'hidden',
      borderColor: Colors.$outlinePrimary,
      borderTopWidth: 2,
      borderLeftWidth: 0.3,
      borderRightWidth: 0.3,
    }}
  />
);
