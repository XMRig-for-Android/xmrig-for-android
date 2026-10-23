import React, { Suspense } from 'react';
import {
  LoaderScreen,
  View, ViewProps,
} from 'react-native-ui-lib';
import {
  IAdvanceConfiguration,
} from '../../../../core/settings/settings.interface';

const EditAdvanceForkCard = React.lazy(() => import('./edit-advance/edit-advance-fork.card'));
const EditAdvanceEditorCard = React.lazy(() => import('./edit-advance/edit-advance-editor.card'));

type ConfigurationEditAdvanceProps = ViewProps & {
    configuration: IAdvanceConfiguration;
    onUpdate: (configurationData: IAdvanceConfiguration) => void;
};

export const ConfigurationEditAdvance:React.FC<ConfigurationEditAdvanceProps> = ({
  configuration,
  onUpdate,
}) => {
  const [localState, setLocalState] = React.useState<IAdvanceConfiguration>(configuration);

  React.useEffect(() => {
    onUpdate(localState);
  }, [localState]);

  return (
    <Suspense fallback={<LoaderScreen />}>
      <View style={{ height: '100%' }}>
        <EditAdvanceForkCard localState={localState} setLocalState={setLocalState} />
        <View height={10} />
        <EditAdvanceEditorCard localState={localState} setLocalState={setLocalState} />
      </View>
    </Suspense>
  );
};

export default ConfigurationEditAdvance;
