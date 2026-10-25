import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { IAdvanceConfiguration } from '../../../../core/settings/settings.interface';
import EditAdvanceForkCard from './edit-advance/edit-advance-fork.card';
import { EditAdvanceEditorCard } from './edit-advance/edit-advance-editor.card';

type ConfigurationEditAdvanceProps = {
  configuration: IAdvanceConfiguration;
  onUpdate: (configurationData: IAdvanceConfiguration) => void;
};

export const ConfigurationEditAdvance: React.FC<ConfigurationEditAdvanceProps> = ({
  configuration,
  onUpdate,
}) => {
  const [localState, setLocalState] = React.useState<IAdvanceConfiguration>(configuration);

  React.useEffect(() => {
    onUpdate(localState);
  }, [localState]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <EditAdvanceForkCard localState={localState} setLocalState={setLocalState} />
      <EditAdvanceEditorCard localState={localState} setLocalState={setLocalState} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 2,
  },
});

export default ConfigurationEditAdvance;
