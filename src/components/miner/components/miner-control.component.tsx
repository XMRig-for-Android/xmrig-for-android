import _ from 'lodash';
import React from 'react';
import {
  Picker,
  View,
  Button,
  ViewProps,
  Colors,
  Typography,
  Incubator,
  Card,
  Assets,
  AnimatedScanner,
} from 'react-native-ui-lib';
import { useMiner } from '../../../core/hooks/use-miner.hook';
import { SessionDataContext } from '../../../core/session-data/session-data.context';
import { WorkingState } from '../../../core/session-data/session-data.interface';
import { SettingsActionType, SettingsContext } from '../../../core/settings';
import { useToaster } from '../../../core/hooks/use-toaster/use-toaster.hook';

export const MinerControl:React.FC<ViewProps> = () => {
  const toaster = useToaster();

  const { workingState } = React.useContext(SessionDataContext);
  const { startWithSelectedConfiguration, stop: handleStop } = useMiner();

  const { settings, settingsDispatcher } = React.useContext(SettingsContext);
  const [selectedConfiguration, setSelectedConfiguration] = React.useState<string | undefined>(
    settings.selectedConfiguration,
  );

  React.useEffect(() => {
    setSelectedConfiguration(settings.selectedConfiguration);
  }, [settings.selectedConfiguration]);

  const isWorking = React.useMemo<boolean>(
    () => workingState !== WorkingState.NOT_WORKING,
    [workingState],
  );

  const handleStart = React.useCallback(() => {
    console.log(settings.selectedConfiguration);
    if (!settings.selectedConfiguration) {
      if (_.isEmpty(settings.configurations)) {
        toaster({
          message: 'Please add a Configuration from Settings menu',
          position: 'top',
          preset: Incubator.ToastPresets.FAILURE,
        });
      } else {
        toaster({
          message: 'Please select a Configuration to start mining',
          position: 'top',
          preset: Incubator.ToastPresets.FAILURE,
        });
      }
    } else {
      startWithSelectedConfiguration();
    }
  }, [settings]);

  React.useEffect(() => {
    if (selectedConfiguration === settings.selectedConfiguration) {
      return;
    }
    settingsDispatcher({
      type: SettingsActionType.SET_SELECTED_CONFIGURAION,
      value: selectedConfiguration,
    });
  }, [selectedConfiguration, settings.selectedConfiguration]);

  const cardBorderColor = React.useMemo<string>(() => {
    if (!settings.selectedConfiguration) {
      if (_.isEmpty(settings.configurations)) {
        return Colors.$outlineDanger;
      }
      return Colors.$outlineWarning;
    }
    if (workingState === WorkingState.MINING) {
      return Colors.$outlinePrimary;
    }
    if (workingState === WorkingState.PAUSED) {
      return Colors.$outlineWarning;
    }
    return Colors.$outlinePrimary;
  }, [selectedConfiguration, settings, workingState]);

  return (
    <Card
      row
      center
      enableShadow
      selected={workingState !== WorkingState.MINING}
      selectionOptions={{
        hideIndicator: true,
        color: cardBorderColor,
      }}
      containerStyle={{ overflow: 'hidden' }}
    >
      {workingState === WorkingState.NOT_WORKING && (
        <View padding-10 flex>
          <Picker
            floatingPlaceholder
            placeholder={selectedConfiguration ? 'Selected configuration (click to change)' : 'Click here to select configuration'}
            topBarProps={{ title: 'Configurations' }}
            value={selectedConfiguration}
            getLabel={
              (value) => settings.configurations.find((config) => config.id === value)?.name || 'N/A'
            }
            showSearch
            searchPlaceholder="Search a Configurations"
            onChange={(value: any) => setSelectedConfiguration(value)}
            style={{ ...Typography.text60, color: Colors.$textDefault }}
            floatingPlaceholderStyle={{ ...Typography.text70, color: Colors.$textDefault }}
          >
            {_.map(settings.configurations, (item) => (
              <Picker.Item
                key={item?.id}
                value={item?.id || ''}
                label={item?.name}
              />
            ))}
          </Picker>
        </View>
      )}
      {!isWorking && (
        <View absF right bottom padding-10>
          <Button
            size={Button.sizes.small}
            onPress={handleStart}
            label="Start"
            iconSource={Assets.icons.start}
            iconStyle={{
              width: 8,
              height: 10,
              margin: 5,
              marginRight: 10,
              tintColor: Colors.$iconDefaultLight,
            }}
          />
        </View>
      )}
      {isWorking && (
        <View padding-10 flex>
          <Button
            size={Button.sizes.medium}
            backgroundColor={Colors.$backgroundDangerHeavy}
            onPress={handleStop}
            label="Stop"
            iconSource={Assets.icons.stop}
            iconStyle={{
              width: 15,
              height: 15,
              margin: 5,
              marginRight: 10,
              tintColor: Colors.$iconDefaultLight,
            }}
            text65
          />
        </View>
      )}
      {!selectedConfiguration && (
        <AnimatedScanner
          backgroundColor={Colors.$backgroundWarning}
          progress={100}
          duration={3000}
        />
      )}
    </Card>
  );
};
