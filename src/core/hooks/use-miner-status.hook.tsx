import React from 'react';
import { NativeModules, NativeEventEmitter, EmitterSubscription } from 'react-native';

const { XMRigForAndroid } = NativeModules;

type IMinerStatusChangeEvent = {
  isWorking: boolean;
}

export const useMinerStatus = () => {
  const [isWorkingState, setIsWorkingState] = React.useState<boolean>(false);

  React.useEffect(() => {
    const MinerEmitter = new NativeEventEmitter<{
      onStatusChange: [IMinerStatusChangeEvent];
    }>(XMRigForAndroid);

    const onStatusChangeSub:EmitterSubscription = MinerEmitter.addListener('onStatusChange', (event) => {
      setIsWorkingState(event.isWorking);
    });

    return () => {
      onStatusChangeSub.remove();
    };
  }, []);

  return {
    isWorking: isWorkingState,
  };
};
