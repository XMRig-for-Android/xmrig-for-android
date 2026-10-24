import React from 'react';
import { EmitterSubscription, NativeEventEmitter, NativeModules } from 'react-native';
import { PowerEvent, PowerEventAction } from './power.interface';

const { XMRigForAndroid } = NativeModules;

type PowerContextType = {
    batteryLevel: number;
    isLowBattery: boolean;
    isPowerConnected: boolean;
}

// @ts-ignore
export const PowerContext:React.Context<PowerContextType> = React.createContext();

export const PowerContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [batteryLevel, setBatteryLevel] = React.useState<number>(0);
  const [isLowBattery, setIsLowBattery] = React.useState<boolean>(false);
  const [isPowerConnected, setIsPowerConnected] = React.useState<boolean>(false);

  React.useEffect(() => {
    const MinerEmitter = new NativeEventEmitter<{
      onPower: [PowerEvent];
    }>(XMRigForAndroid);

    const onPowerEventSub:EmitterSubscription = MinerEmitter.addListener('onPower', (event) => {
      console.log(event);
      switch (event.action) {
        case PowerEventAction.BATTERY_CHANGED:
          if (event.value != null) {
            setBatteryLevel(event.value);
          }
          break;
        case PowerEventAction.BATTERY_LOW:
          setIsLowBattery(true);
          break;
        case PowerEventAction.BATTERY_OKAY:
          setIsLowBattery(false);
          break;
        case PowerEventAction.POWER_CONNECTED:
          setIsPowerConnected(true);
          break;
        case PowerEventAction.POWER_DISCONNECTED:
          setIsPowerConnected(false);
          break;
        default:
      }
    });

    return () => {
      onPowerEventSub.remove();
    };
  }, []);

  return (
    <PowerContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        batteryLevel,
        isLowBattery,
        isPowerConnected,
      }}
    >
      {children}
    </PowerContext.Provider>
  );
};
