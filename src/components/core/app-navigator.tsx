import React from 'react';
import {
  TabController,
  View,
  Text,
  ViewProps,
} from 'react-native-ui-lib';

import { createStackNavigator } from '@react-navigation/stack';
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
  <TabController items={[{ label: 'Miner' }, { label: 'Settings' }]}>
    <TabController.TabBar
      enableShadow
    />
    <View flex>
      <TabController.TabPage index={0}><LazyMiner /></TabController.TabPage>
      <TabController.TabPage index={1} lazy><LazySettings /></TabController.TabPage>
    </View>
  </TabController>
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
        headerTitleContainerStyle: { marginLeft: 10 },
        headerRightContainerStyle: { marginRight: 10 },
        headerRight: () => (
          <Text>
            Version
            {' '}
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
