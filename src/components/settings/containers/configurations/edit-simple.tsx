import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { ISimpleConfiguration } from '../../../../core/settings/settings.interface';
import { EditSimpleForkCard } from './edit-simple/edit-simple-fork.card';
import { EditSimplePoolCard } from './edit-simple/edit-simple-pool.card';
import { EditSimpleCPUCard } from './edit-simple/edit-simple-cpu.card';
import { EditSimpleAlgorithemsCard } from './edit-simple/edit-simple-algorithems.card';

type ConfigurationEditSimpleProps = {
  configuration: ISimpleConfiguration;
  onUpdate: (configurationData: ISimpleConfiguration) => void;
};

export const ConfigurationEditSimple: React.FC<ConfigurationEditSimpleProps> = ({
  configuration,
  onUpdate,
}) => {
  const [localState, setLocalState] = React.useState<ISimpleConfiguration>(configuration);

  React.useEffect(() => {
    onUpdate(localState);
  }, [localState]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      >
        <EditSimplePoolCard localState={localState} setLocalState={setLocalState} />
        <EditSimpleForkCard localState={localState} setLocalState={setLocalState} />
        <EditSimpleCPUCard localState={localState} setLocalState={setLocalState} />
        <EditSimpleAlgorithemsCard localState={localState} setLocalState={setLocalState} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ConfigurationEditSimple;
