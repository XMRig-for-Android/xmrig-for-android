import React from 'react';
import { NativeModules, NativeEventEmitter, EmitterSubscription } from 'react-native';

const { XMRigForAndroid } = NativeModules;

type IThermalEvent = {
  cpuTemperature: number;
}

export const useThermal = () => {
  const [cpuTemperature, setCpuTemperature] = React.useState<number>(0.0);

  React.useEffect(() => {
    const MinerEmitter = new NativeEventEmitter<{
      onThermal: [IThermalEvent];
    }>(XMRigForAndroid);

    const onThermalSub:EmitterSubscription = MinerEmitter.addListener('onThermal', (event) => {
      setCpuTemperature(event.cpuTemperature);
    });

    return () => {
      onThermalSub.remove();
    };
  }, []);

  return {
    cpuTemperature,
  };
};
