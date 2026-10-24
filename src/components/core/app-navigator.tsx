import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ViewProps } from 'react-native-ui-lib';
import { createStackNavigator } from '@react-navigation/stack';
import { SegmentedTabs } from './segmented-tabs';
import { RootStackParamList } from '../../core/navigation';
import { LazyLoader } from './lazy-loader';
import ConfigurationEditScreen from '../settings/screens/configuration-edit.screen';
import { version } from '../../version';
import { palette, radius } from '../../core/theme';

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
        headerShadowVisible: false,
        headerStyle: { backgroundColor: palette.background },
        headerTitleContainerStyle: { marginLeft: 8 },
        headerRightContainerStyle: { marginRight: 16 },
        headerTitle: () => (
          <View>
            <Text style={styles.brand}>XMRig</Text>
            <Text style={styles.brandSub}>for Android</Text>
          </View>
        ),
        headerRight: () => (
          <View style={styles.versionPill}>
            <Text style={styles.versionText}>{`v${version}`}</Text>
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="Configuration"
      component={ConfigurationEditScreen}
      getId={({ params }: any) => params.id}
      options={{
        title: 'Configuration',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: palette.background },
        headerTitleStyle: styles.screenTitle,
        headerTintColor: palette.ink,
      }}
    />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  brand: {
    fontSize: 22,
    fontWeight: '800',
    color: palette.ink,
    letterSpacing: -0.6,
  },
  brandSub: {
    marginTop: -2,
    fontSize: 12,
    fontWeight: '600',
    color: palette.inkSubtle,
  },
  versionPill: {
    backgroundColor: palette.surface,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.hairline,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.inkMuted,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.ink,
  },
});
