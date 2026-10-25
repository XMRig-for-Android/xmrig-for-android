import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import { SettingsActionType, SettingsContext } from '../../../core/settings';
import { RootStackParamList } from '../../../core/navigation';
import { ConfigurationsListView } from '../containers/configurations/list-view';
import AddConfigurationsModal from '../modals/add-configuration.modal';
import { Button, ScreenHeader } from '../../core/ui';
import { palette, radius } from '../../../core/theme';

const ConfigurationsScreen: React.FC = () => {
  const { settings, settingsDispatcher } = React.useContext(SettingsContext);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [addVisible, setAddVisible] = React.useState<boolean>(false);

  const count = settings.configurations.length;

  return (
    <View style={styles.screen}>
      <AddConfigurationsModal
        visible={addVisible}
        onDismiss={() => setAddVisible(false)}
        onAdd={(name, mode) => {
          const id = uuid.v4() as string;
          settingsDispatcher({
            type: SettingsActionType.ADD_CONFIGURATION,
            value: { id, name, mode },
          });
          if (!settings.selectedConfiguration) {
            settingsDispatcher({ type: SettingsActionType.SET_SELECTED_CONFIGURAION, value: id });
          }
          setAddVisible(false);
          navigation.navigate('Configuration', { id });
        }}
      />
      <ScreenHeader
        title="Profiles"
        subtitle={count > 0 ? `${count} saved · tap a profile to edit` : 'Pool and miner presets'}
        action={count > 0 ? <Button label="+  New" size="sm" onPress={() => setAddVisible(true)} /> : null}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {count > 0 ? (
          <ConfigurationsListView
            configurations={settings.configurations}
            activeId={settings.selectedConfiguration}
            onActivate={(id) => settingsDispatcher({
              type: SettingsActionType.SET_SELECTED_CONFIGURAION,
              value: id,
            })}
          />
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No profiles yet</Text>
            <Text style={styles.emptyText}>
              A profile holds your pool, wallet and CPU settings.
              Create one to start mining.
            </Text>
            <Button label="Create profile" onPress={() => setAddVisible(true)} style={styles.emptyButton} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  empty: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: palette.track,
    paddingVertical: 36,
    paddingHorizontal: 28,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.ink,
  },
  emptyText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: palette.inkMuted,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 20,
    alignSelf: 'stretch',
  },
});

export default ConfigurationsScreen;
