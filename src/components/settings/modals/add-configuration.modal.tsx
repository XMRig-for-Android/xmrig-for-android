import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Text,
  View,
  Colors,
  Dialog,
  DialogProps,
  Incubator,
  RadioGroup,
  RadioButton,
  Button,
} from 'react-native-ui-lib';
import { SettingsContext } from '../../../core/settings';
import { ConfigurationMode } from '../../../core/settings/settings.interface';
import { getConfigurationNameValidator, getConfigurationValidator } from '../../../core/utils/validators';

export type AddConfigurationsModalProps = DialogProps & {
    onAdd: (name: string, mode: ConfigurationMode) => void;
}

const AddConfigurationsModal:React.FC<AddConfigurationsModalProps> = (
  {
    onAdd,
    onDismiss,
    ...rest
  },
) => {
  const { settings } = React.useContext(SettingsContext);
  const existsNames = React.useMemo<string[]>(
    () => settings.configurations.map(
      (c) => c.name,
    ),
    [settings.configurations],
  );

  const [name, setName] = React.useState('');
  const [configMode, setConfigMode] = React.useState<ConfigurationMode>(ConfigurationMode.SIMPLE);

  const isValid = React.useMemo(() => getConfigurationValidator(existsNames).validate({
    name,
    mode: configMode,
  }).error == null, [name, configMode, existsNames]);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Dialog
      onDismiss={onDismiss}
      center
      headerProps={{
        title: 'New Configuration',
      }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      containerStyle={{ width: '100%', minWidth: 300, minHeight: 350 }}
    >
      <View spread flex-1>
        <View padding-20 style={{ flexGrow: 1 }}>
          <Incubator.TextField
            placeholder="Name"
            floatingPlaceholder
            value={name}
            onChangeText={(text) => setName(text)}
            validate={
              (value?: string) => getConfigurationNameValidator(existsNames)
                .validate(value)
                .error === null
            }
            validationMessage={
              getConfigurationNameValidator(existsNames).validate(name).error?.message
            }
            validateOnChange
            enableErrors
            floatOnFocus
            showCharCounter
            maxLength={30}
            fieldStyle={styles.withUnderline}
            hint="Friendly configuration name"
          />
          <Text text85 $textNeutralLight marginT-10 marginB-15>Editor Mode</Text>
          <RadioGroup
            initialValue={configMode}
            onValueChange={(value: ConfigurationMode) => setConfigMode(value)}
          >
            <RadioButton label="Simple Mode" value={ConfigurationMode.SIMPLE} marginB-10 />
            <RadioButton label="Advanced Mode" value={ConfigurationMode.ADVANCE} />
          </RadioGroup>
        </View>
        <View>
          <View height={1.5} bg-grey70 />
          <View paddingV-15 paddingH-20 right row>
            <Button
              disabled={!isValid}
              onPress={() => {
                onAdd(name, configMode);
                setName('');
                setConfigMode(ConfigurationMode.SIMPLE);
              }}
              marginR-10
              label="Add"
              size={Button.sizes.medium}
            />
            <Button onPress={onDismiss} label="Cancel" backgroundColor={Colors.$backgroundDangerHeavy} size={Button.sizes.medium} />
          </View>
        </View>
      </View>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  withUnderline: {
    borderBottomWidth: 1,
    borderColor: Colors.$outlineDisabled,
    paddingBottom: 4,
  },
});

export default AddConfigurationsModal;
