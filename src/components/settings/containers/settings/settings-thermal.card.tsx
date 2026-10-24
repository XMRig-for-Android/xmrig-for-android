import React from 'react';
import {
  Card, Slider, Switch, Text, View,
} from 'react-native-ui-lib';
import { useDebouncedCallback } from '../../../../core/hooks/use-debounced-callback';
import { SettingsCardProps } from '.';
import { IThermalSettings } from '../../../../core/settings/settings.interface';

const SettingsThermalCard:React.FC<SettingsCardProps<IThermalSettings>> = ({
  settings,
  onUpdate,
}) => {
  const debouncedUpdate = useDebouncedCallback(onUpdate, 1000);

  return (
    <Card enableShadow>
      <View centerV spread padding-20 paddingB-5>
        <Card.Section
          style={{ flexShrink: 1 }}
          content={[
            { text: 'Thermal', text65: true, $textDefault: true },
            { text: 'Pause / Resume mining based on CPU Temperature to prevent overheating.', text90: true, $textNeutral: true },
          ]}
        />
      </View>
      <View spread padding-20 paddingT-10>
        <View marginB-10>
          <View flex marginB-5>
            <Text text75 $textDefault flex column row>Pause mining on</Text>
          </View>
          <View row flex paddingL-10>
            <Text text80 $textNeutralLight flex column marginB-5>CPU is Over Heated</Text>
            <Switch
              value={settings.pauseOnCPUTemperatureOverHeat}
              onValueChange={(value) => onUpdate({ pauseOnCPUTemperatureOverHeat: value })}
            />
          </View>
          {settings.pauseOnCPUTemperatureOverHeat && (
            <View row flex paddingL-10 centerV>
              <Text text80 $textNeutralLight flex column marginB-5>Temperature</Text>
              <Slider
                containerStyle={{ flex: 1 }}
                minimumValue={10}
                maximumValue={120}
                step={1}
                value={settings.pauseOnCPUTemperatureOverHeatValue}
                onValueChange={
                  (value) => debouncedUpdate({ pauseOnCPUTemperatureOverHeatValue: value })
                }
                disabled={!settings.pauseOnCPUTemperatureOverHeat}
              />
              <Text marginL-10>
                {`0${settings.pauseOnCPUTemperatureOverHeatValue}`.slice(-3)}
                {' ℃'}
              </Text>
            </View>
          )}
        </View>
        <View marginB-10>
          <View flex marginB-5>
            <Text text75 $textDefault flex column row>Resume mining on</Text>
          </View>
          <View row flex paddingL-10>
            <Text text80 $textNeutralLight flex column marginB-5>CPU Temp is Normal</Text>
            <Switch
              value={settings.resumeCPUTemperatureNormal}
              onValueChange={(value) => onUpdate({ resumeCPUTemperatureNormal: value })}
            />
          </View>
          {settings.resumeCPUTemperatureNormal && (
            <View row flex paddingL-10 centerV>
              <Text text80 $textNeutralLight flex column marginB-5>Temperature</Text>
              <Slider
                containerStyle={{ flex: 1 }}
                minimumValue={10}
                maximumValue={120}
                step={1}
                value={settings.resumeCPUTemperatureNormalValue}
                onValueChange={
                  (value) => debouncedUpdate({ resumeCPUTemperatureNormalValue: value })
                }
                disabled={!settings.resumeCPUTemperatureNormal}
              />
              <Text marginL-10>
                {`0${settings.resumeCPUTemperatureNormalValue}`.slice(-3)}
                {' ℃'}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
};

export default SettingsThermalCard;
