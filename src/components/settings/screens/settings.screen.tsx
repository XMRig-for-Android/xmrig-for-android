import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ISettings, SettingsActionType, SettingsContext } from '../../../core/settings';
import { IPowerSettings, IThermalSettings } from '../../../core/settings/settings.interface';
import { palette } from '../../../core/theme';
import { ScreenHeader } from '../../core/ui';
import SettingsPowerCard from '../containers/settings/settings-power.card';
import SettingsThermalCard from '../containers/settings/settings-thermal.card';
import SettingsOthersCard from '../containers/settings/settings-others.card';

const SettingsScreen: React.FC = () => {
  const { settings, settingsDispatcher } = React.useContext(SettingsContext);

  const update = (value: Partial<ISettings>) => settingsDispatcher({
    type: SettingsActionType.UPDATE,
    value,
  });

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Settings" subtitle="Changes are saved automatically" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SettingsPowerCard
          settings={settings.power}
          onUpdate={(power: Partial<IPowerSettings>) => update({ power } as Partial<ISettings>)}
        />
        <SettingsThermalCard
          settings={settings.thermal}
          onUpdate={(thermal: Partial<IThermalSettings>) => update({ thermal } as Partial<ISettings>)}
        />
        <SettingsOthersCard settings={settings} onUpdate={update} />
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
});

export default SettingsScreen;
