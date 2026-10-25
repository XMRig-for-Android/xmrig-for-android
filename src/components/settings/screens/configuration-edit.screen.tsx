import {
  NavigationProp, RouteProp, useNavigation, useRoute,
} from '@react-navigation/native';
import isEqual from 'lodash/fp/isEqual';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Assets } from 'react-native-ui-lib';
import { RootStackParamList } from '../../../core/navigation';
import { SettingsActionType, SettingsContext } from '../../../core/settings';
import { Configuration, ConfigurationMode } from '../../../core/settings/settings.interface';
import { palette } from '../../../core/theme';
import { IconButton, SaveBar } from '../../core/ui';
import ConfigurationEditSimple from '../containers/configurations/edit-simple';
import ConfigurationEditAdvance from '../containers/configurations/edit-advance';

const ConfigurationEditScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Configuration'>>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { settings, settingsDispatcher } = React.useContext(SettingsContext);
  const savedConfiguration = React.useMemo(() => settings.configurations.find(
    (item) => item.id === route.params?.id,
  ), [settings.configurations, route.params?.id]);

  const [configuration, setConfiguration] = React.useState<Configuration | undefined>(
    savedConfiguration,
  );
  const [revision, setRevision] = React.useState(0);
  const allowLeave = React.useRef(false);

  React.useEffect(() => {
    if (!configuration && savedConfiguration) {
      setConfiguration(savedConfiguration);
    }
  }, [savedConfiguration]);

  const isDirty = !!configuration && !!savedConfiguration
    && !isEqual(configuration, savedConfiguration);

  const handleDelete = React.useCallback(() => {
    Alert.alert(
      'Delete profile?',
      `"${savedConfiguration?.name}" will be removed permanently.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            allowLeave.current = true;
            settingsDispatcher({
              type: SettingsActionType.DELETE_CONFIGURATIONS,
              value: [savedConfiguration?.id as string],
            });
            navigation.goBack();
          },
        },
      ],
    );
  }, [savedConfiguration]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: savedConfiguration?.name || 'Edit profile',
      headerRight: () => (
        <IconButton
          icon={Assets.icons.trash}
          tone="danger"
          onPress={handleDelete}
          accessibilityLabel="Delete profile"
        />
      ),
      headerRightContainerStyle: { paddingRight: 16 },
    });
  }, [navigation, savedConfiguration?.name, handleDelete]);

  React.useEffect(() => navigation.addListener('beforeRemove' as never, (event: any) => {
    if (!isDirty || allowLeave.current) {
      return;
    }
    event.preventDefault();
    Alert.alert('Discard changes?', 'You have unsaved changes in this profile.', [
      { text: 'Keep editing', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => navigation.dispatch(event.data.action),
      },
    ]);
  }), [navigation, isDirty]);

  const handleSave = () => {
    if (!configuration) {
      return;
    }
    allowLeave.current = true;
    settingsDispatcher({
      type: SettingsActionType.UPDATE_CONFIGURATION,
      value: configuration,
    });
    navigation.goBack();
  };

  const handleDiscard = () => {
    setConfiguration(savedConfiguration);
    setRevision((value) => value + 1);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        {configuration?.mode === ConfigurationMode.SIMPLE && (
          <ConfigurationEditSimple
            key={revision}
            configuration={configuration}
            onUpdate={setConfiguration}
          />
        )}
        {configuration?.mode === ConfigurationMode.ADVANCE && (
          <ConfigurationEditAdvance
            key={revision}
            configuration={configuration}
            onUpdate={setConfiguration}
          />
        )}
      </View>
      <SaveBar dirty={isDirty} onSave={handleSave} onDiscard={handleDiscard} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    flex: 1,
  },
});

export default ConfigurationEditScreen;
