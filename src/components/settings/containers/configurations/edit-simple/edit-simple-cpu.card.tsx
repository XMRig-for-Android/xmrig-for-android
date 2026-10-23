import { merge } from 'lodash/fp';
import React from 'react';
import {
  Card, Colors, Incubator, Switch, Text, View, RadioGroup, RadioButton, SkeletonView,
} from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import { EditSimpleCardProps } from './index';
import {
  cpuValidator,
  maxThreadsHintValidator, priorityValidator,
} from '../../../../../core/utils/validators';
import { RandomXMode } from '../../../../../core/settings/settings.interface';

export const EditSimpleCPUCard: React.FC<EditSimpleCardProps> = (
  { setLocalState, localState },
) => {
  const [valid, setValid] = React.useState<boolean>(
    cpuValidator.validate(localState.properties?.cpu || {}).error == null,
  );

  React.useEffect(() => {
    setValid(
      cpuValidator.validate(localState.properties?.cpu || {}).error == null,
    );
  }, [localState.properties]);

  return (
    <Card
      enableShadow
      selected={!valid}
      selectionOptions={{
        hideIndicator: true,
        color: Colors.$outlineDanger,
      }}
    >
      <View centerV spread padding-20 paddingB-5>
        <Card.Section
          style={{ flexShrink: 1 }}
          content={[
            { text: 'CPU', text65: true, $textDefault: true },
          ]}
        />
      </View>
      <View spread padding-20 paddingT-10>
        <View marginB-10>
          <View row flex>
            <Text text80 $textNeutralLight flex column marginB-5>Yield</Text>
            <Switch
              value={localState.properties?.cpu?.yield}
              onValueChange={(value) => setLocalState((oldState) => merge(
                oldState,
                {
                  properties: {
                    cpu: {
                      yield: value,
                    },
                  },
                },
              ))}
            />
          </View>
          <Text text100 $textNeutralLight row>
            Prefer system better system response/stability `ON` (default value)
            or maximum hashrate `OFF`.
          </Text>
        </View>
        <View flex paddingT-10>
          <View marginB-10>
            <Text text80 $textNeutralLight flex row marginB-2>RandomX Mode</Text>
            <RadioGroup
              onValueChange={(value: RandomXMode) => setLocalState((oldState) => merge(
                oldState,
                {
                  properties: {
                    cpu: {
                      random_x_mode: value,
                    },
                  },
                },
              ))}
              initialValue={localState.properties?.cpu?.random_x_mode}
              marginB-5
            >
              <View row spread>
                <RadioButton label="Auto" value={RandomXMode.AUTO} />
                <RadioButton label="Fast" value={RandomXMode.FAST} />
                <RadioButton label="Light" value={RandomXMode.LIGHT} />
              </View>
            </RadioGroup>
            <Text text100 $textNeutralLight row>
              RandomX mining mode: "auto", "fast" (2 GB memory),
              "light" (256 MB memory).
            </Text>
          </View>
        </View>
        <View flex paddingT-10>
          <Incubator.TextField
            placeholder="Priority"
            floatingPlaceholder
            value={localState.properties?.cpu?.priority?.toString() || undefined}
            onChangeText={(text) => setLocalState((oldState) => merge(
              oldState,
              {
                properties: {
                  cpu: {
                    priority: text.trim() === '' ? undefined : Number(text),
                  },
                },
              },
            ))}
            validate={
              (value?: string) => !value || priorityValidator
                .validate(Number(value))
                .error == null
            }
            validationMessage={
              priorityValidator
                .validate(localState.properties?.cpu?.priority)
                .error?.message
            }
            validateOnChange
            enableErrors
            floatOnFocus
            showCharCounter
            maxLength={128}
            fieldStyle={styles.withUnderline}
            hint="1 - 5"
            keyboardType="numeric"
          />
          <Text text100 $textNeutralLight row>
            Threads priority, from 1 (lowest) to 5 (highest).
            Default: null - doesn't change priority.
          </Text>
        </View>
        <View flex paddingT-10>
          <Incubator.TextField
            placeholder="Max Threads Hint"
            floatingPlaceholder
            value={localState.properties?.cpu?.max_threads_hint?.toString() || undefined}
            onChangeText={(text) => setLocalState((oldState) => merge(
              oldState,
              {
                properties: {
                  cpu: {
                    max_threads_hint: text.trim() === '' ? undefined : Number(text),
                  },
                },
              },
            ))}
            validate={
              (value?: string) => maxThreadsHintValidator
                .validate(value === '' ? undefined : Number(value))
                .error == null
            }
            validationMessage={
              maxThreadsHintValidator
                .validate(localState.properties?.cpu?.max_threads_hint)
                .error?.message
            }
            validateOnChange
            enableErrors
            floatOnFocus
            showCharCounter
            maxLength={3}
            fieldStyle={styles.withUnderline}
            hint="50"
            keyboardType="numeric"
            trailingAccessory={<Text>% of device cores</Text>}
          />
          <Text text100 $textNeutralLight row>
            For 1 core CPU this option has no effect,
            for 2 core CPU only 2 values possible 50% and 100%,
            for 4 cores: 25%, 50%, 75%, 100%. etc.
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  withUnderline: {
    borderBottomWidth: 1,
    borderColor: Colors.$outlineDisabled,
    paddingBottom: 4,
  },
});

const EditSimpleCPUCardSkeleton: React.FC<EditSimpleCardProps> = (props) => {
  const [loaded, setLoaded] = React.useState<boolean>(false);
  React.useEffect(() => {
    const interval = setTimeout(() => setLoaded(true), 800);
    return () => {
      clearTimeout(interval);
      setLoaded(false);
    };
  }, []);

  return (
    <SkeletonView
      template={SkeletonView.templates.TEXT_CONTENT}
      customValue={props}
      showContent={loaded}
      renderContent={
        // eslint-disable-next-line react/jsx-props-no-spreading
        (customProps: EditSimpleCardProps) => (<EditSimpleCPUCard {...customProps} />)
      }
      times={3}
    />
  );
};

export default EditSimpleCPUCardSkeleton;
