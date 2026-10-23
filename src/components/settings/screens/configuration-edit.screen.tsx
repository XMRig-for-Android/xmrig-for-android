import {
  NavigationProp, RouteProp, useNavigation, useRoute,
} from '@react-navigation/native';
import isEqual from 'lodash/fp/isEqual';
import React, { Suspense } from 'react';
import {
  Assets, Button, ButtonProps, Colors, FloatingButton, LoaderScreen, Text, View,
} from 'react-native-ui-lib';
import { RootStackParamList } from '../../../core/navigation';
import { SettingsActionType, SettingsContext } from '../../../core/settings';
import { Configuration, ConfigurationMode } from '../../../core/settings/settings.interface';

const ConfigurationEditSimple = React.lazy(() => import('../containers/configurations/edit-simple'));
const ConfigurationEditAdvance = React.lazy(() => import('../containers/configurations/edit-advance'));

const actionsButtonDefault: ButtonProps = {
  label: 'Menu',
  iconSource: Assets.icons.barsOpen,
  iconStyle: {
    width: 22,
    height: 22,
    margin: 0,
    tintColor: Colors.$iconDefaultLight,
  },
};

const ConfigurationEditScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Configuration'>>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [changesCount, setChangesCount] = React.useState<number>(0);

  const { settings, settingsDispatcher } = React.useContext(SettingsContext);
  const savedConfiguration = React.useMemo(() => settings.configurations.find(
    (item) => item.id === route.params?.id,
  ), [settings.configurations]);
  const [configuration, setConfiguration] = React.useState<Configuration>();
  React.useEffect(() => {
    setConfiguration(savedConfiguration);
  }, [route.params]);

  React.useEffect(() => {
    if (!configuration || !savedConfiguration) {
      setChangesCount(0);
      return;
    }
    setChangesCount(isEqual(configuration, savedConfiguration) ? 0 : 1);
  }, [configuration, savedConfiguration]);

  const handleUpdate = (data: Configuration) => {
    settingsDispatcher({
      type: SettingsActionType.UPDATE_CONFIGURATION,
      value: data,
    });
    navigation.goBack();
  };

  const [actionsVisible, setActionVisible] = React.useState<boolean>(false);
  const [actionsButtonProps, setActionButtonProps] = React.useState<ButtonProps>({
    ...actionsButtonDefault,
  });
  React.useEffect(() => {
    if (actionsVisible) {
      setActionButtonProps({
        iconSource: Assets.icons.barsClose,
        iconStyle: {
          width: 15,
          height: 15,
          margin: 8,
          tintColor: Colors.$iconDefaultLight,
        },
      });
    } else {
      setActionButtonProps({
        ...actionsButtonDefault,
      });
    }
  }, [actionsVisible]);

  return (
    <View bg-screenBG flex>
      <View
        row
        spread
        paddingV-10
        paddingH-10
        paddingB-5
        centerV
      >
        <View row centerV>
          <Text text60>{configuration?.name}</Text>
        </View>
        <Button
          size={Button.sizes.small}
          onPress={() => setActionVisible(!actionsVisible)}
          animateLayout
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...actionsButtonProps}
        />
      </View>
      {changesCount > 0 && (
        <View padding-10 paddingT-0 center>
          <Text text90 $textDanger>
            Please save changes (
            {changesCount}
            ) using the Menu button
          </Text>
        </View>
      )}
      <View
        flex
        paddingH-10
        paddingB-10
        useSafeArea
        style={{ zIndex: 0 }}
      >
        {configuration?.mode === ConfigurationMode.SIMPLE && (
          <Suspense fallback={<LoaderScreen />}>
            <ConfigurationEditSimple
              configuration={configuration}
              onUpdate={setConfiguration}
            />
          </Suspense>
        )}
        {configuration?.mode === ConfigurationMode.ADVANCE && (
          <Suspense fallback={<LoaderScreen />}>
            <ConfigurationEditAdvance
              configuration={configuration}
              onUpdate={setConfiguration}
            />
          </Suspense>
        )}
      </View>
      <FloatingButton
        duration={500}
        visible={actionsVisible}
        button={{
          size: Button.sizes.large,
          disabled: changesCount === 0,
          onPress: () => {
            if (configuration) {
              handleUpdate(configuration);
              setChangesCount(0);
            }
            setActionVisible(false);
          },
          backgroundColor: Colors.$backgroundPrimaryHeavy,
          label: `Save ${changesCount} Changes`,
          iconSource: Assets.icons.save,
          iconStyle: {
            display: 'flex',
            width: 16,
            height: 20,
            tintColor: Colors.$iconDefaultLight,
          },
        }}
        secondaryButton={{
          size: Button.sizes.medium,
          label: 'Delete Configuration',
          onPress: () => {
            if (configuration?.id) {
              settingsDispatcher({
                type: SettingsActionType.DELETE_CONFIGURATIONS,
                value: [configuration?.id],
              });
            }
            setActionVisible(false);
            navigation.goBack();
          },
          backgroundColor: Colors.$backgroundDangerHeavy,
          link: false,
          animateLayout: true,
          iconSource: Assets.icons.trash,
          iconStyle: {
            display: 'flex',
            width: 16,
            height: 20,
            tintColor: Colors.$iconDefaultLight,
          },
        }}
      />
    </View>
  );
};

export default ConfigurationEditScreen;
