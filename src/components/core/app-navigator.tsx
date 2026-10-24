import React from 'react';
import {
  Text,
  ViewProps,
} from 'react-native-ui-lib';
import { createStackNavigator } from '@react-navigation/stack';
import { SegmentedTabs } from './segmented-tabs';
import { RootStackParamList } from '../../core/navigation';
import { LazyLoader } from './lazy-loader';
import ConfigurationEditScreen from '../settings/screens/configuration-edit.screen';
import { version } from '../../version';

const Stack = createStackNavigator<RootStackParamList>();

const Settings = React.lazy(() => import('../settings/settings-view'));
const Miner = React.lazy(() => import('../miner/miner-view'));

const LazySettings = () => (<LazyLoader><Settings /></LazyLoader>);
const LazyMiner = () => (<LazyLoader><Miner /></LazyLoader>);

const AppTabs:React.FC<ViewProps> = () => (
  <SegmentedTabs
    items={[{ label: 'Miner' }, { label: 'Settings' }]}
    pages={[<LazyMiner />, <LazySettings />]}
    lazyIndexes={[1]}
  />
);

export const AppNavigator:React.FC<ViewProps> = () => (
  <Stack.Navigator
    initialRouteName="Main"
  >
    <Stack.Screen
      name="Main"
      component={AppTabs}
        // eslint-disable-next-line react/jsx-one-expression-per-line
      options={{
        title: 'XMRig for Android',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#F7F8FA' },
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        headerTitleContainerStyle: { marginLeft: 8 },
        headerRightContainerStyle: { marginRight: 12 },
        headerRight: () => (
          <Text style={{ fontSize: 12, color: '#8B909A', fontWeight: '600' }}>
            {version}
          </Text>
        ),
      }}
    />
    <Stack.Screen
      name="Configuration"
      component={ConfigurationEditScreen}
      getId={({ params }: any) => params.id}
      options={{ title: 'XMRig for Android | Configurations' }}
    />
  </Stack.Navigator>
);
