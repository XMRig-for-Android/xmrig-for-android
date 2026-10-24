import React from 'react';
import { ScrollView } from 'react-native';
import { View, Text, Colors } from 'react-native-ui-lib';
import { Battery } from '@brightlayer-ui/react-native-progress-icons';
import chroma from 'chroma-js';
import { SessionDataContext } from '../../../../core/session-data/session-data.context';
import { XMRigView } from '../../containers/xmrig-view';
import { MinerControl } from '../../components/miner-control.component';
import { PowerContext } from '../../../../core/power/power.context';

const MinerScreen = () => {
  const {
    workingState, minerData, hashrateTotals, CPUTemp,
  } = React.useContext(SessionDataContext);
  const powerContext = React.useContext(PowerContext);

  const battryColor = React.useMemo(() => {
    const cScale = chroma.scale([
      Colors.$backgroundDangerHeavy,
      Colors.$backgroundWarningHeavy,
      Colors.$backgroundSuccessHeavy,
    ]);
    return cScale(powerContext.batteryLevel / 100).hex();
  }, [powerContext.batteryLevel]);

  return (
    <View bg-screenBG flex>
      <View
        paddingV-10
        paddingH-10
      >
        <MinerControl />
      </View>
      <View flex paddingH-10>
        <ScrollView
          nestedScrollEnabled
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          <View flex row spread centerV>
            <Text text60>Miner Statistics</Text>
            <View flex flex-1 right paddingH-10>
              <Text text80>
                {CPUTemp.toFixed(2)}
                {' ℃'}
              </Text>
            </View>
            <View padding-0 margin-0>
              <Battery
                percent={powerContext.batteryLevel}
                size={40}
                color={battryColor}
                charging={powerContext.isPowerConnected}
                outlined={false}
              />
            </View>
          </View>
          <XMRigView
            workingState={workingState}
            minerData={minerData}
            hashrateHistory={hashrateTotals}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default MinerScreen;
