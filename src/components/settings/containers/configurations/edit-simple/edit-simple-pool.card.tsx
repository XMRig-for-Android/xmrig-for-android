import { merge } from 'lodash/fp';
import React from 'react';
import {
  Button,
  Card, Colors, Incubator, SkeletonView, Switch, Text, View,
} from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import { EditSimpleCardProps } from './index';
import {
  hostnameValidator, passwordValidator, poolValidator, portValidator, usernameValidator,
} from '../../../../../core/utils/validators';
import { IConfiguratioPropertiesPool } from '../../../../../core/settings/settings.interface';
import PoolListModal from '../../../modals/pool-list.modal';

export const EditSimplePoolCard: React.FC<EditSimpleCardProps> = (
  { setLocalState, localState },
) => {
  const [valid, setValid] = React.useState<boolean>(
    poolValidator.validate(localState.properties?.pool || {}).error == null,
  );

  React.useEffect(() => {
    setValid(
      poolValidator.validate(localState.properties?.pool || {}).error == null,
    );
  }, [localState.properties]);

  const [showPoolListDialog, setShowPoolListDialog] = React.useState<boolean>(false);

  return (
    <>
      <PoolListModal
        onAdd={(pool: IConfiguratioPropertiesPool) => {
          setLocalState((oldState) => merge(
            oldState,
            {
              properties: {
                pool,
              },
            },
          ));
        }}
        onDismiss={() => setShowPoolListDialog(false)}
        visible={showPoolListDialog}
      />
      <Card
        enableShadow
        selected={!valid}
        selectionOptions={{
          hideIndicator: true,
          color: Colors.$outlineDanger,
        }}
      >
        <View centerV spread padding-20 paddingB-5>
          <View row centerV>
            <Card.Section
              style={{ flexShrink: 1 }}
              content={[
                { text: 'Pool', text65: true, $textDefault: true },
                { text: 'Pools connection details provided by the pool. We provide presets for some popular pools.', text90: true, $textNeutral: true },
              ]}
            />
            <View paddingL-10>
              <Button size={Button.sizes.small} label="Presets" onPress={() => setShowPoolListDialog(true)} />
            </View>
          </View>
        </View>
        <View spread padding-20 paddingT-10>
          <View flex row>
            <View flex-2 marginR-20>
              <Incubator.TextField
                placeholder="Hostname / IP"
                floatingPlaceholder
                value={localState.properties?.pool?.hostname}
                onChangeText={(text) => setLocalState((oldState) => merge(
                  oldState,
                  {
                    properties: {
                      pool: {
                        hostname: text,
                      },
                    },
                  },
                ))}
                validate={
                  (value?: string) => hostnameValidator
                    .validate(value)
                    .error == null
                }
                validationMessage={
                  hostnameValidator
                    .validate(localState.properties?.pool?.hostname)
                    .error?.message
                }
                validateOnChange
                enableErrors
                floatOnFocus
                showCharCounter
                maxLength={128}
                fieldStyle={styles.withUnderline}
                hint="pool.domain.tld"
                keyboardType="url"
              />
            </View>
            <View flex-1>
              <Incubator.TextField
                placeholder="Port"
                floatingPlaceholder
                value={localState.properties?.pool?.port?.toString() || ''}
                onChangeText={(text) => setLocalState((oldState) => merge(
                  oldState,
                  {
                    properties: {
                      pool: {
                        port: text.trim() === '' ? undefined : Number(text),
                      },
                    },
                  },
                ))}
                validate={
                  (value?: string) => portValidator
                    .validate(value === '' ? undefined : Number(value))
                    .error == null
                }
                validationMessage={
                  portValidator
                    .validate(localState.properties?.pool?.port)
                    .error?.message
                }
                validateOnChange
                enableErrors
                floatOnFocus
                showCharCounter
                maxLength={5}
                fieldStyle={styles.withUnderline}
                hint="80"
                keyboardType="numeric"
              />
            </View>
          </View>
          <Incubator.TextField
            placeholder="Username"
            floatingPlaceholder
            value={localState.properties?.pool?.username}
            onChangeText={(text) => setLocalState((oldState) => merge(
              oldState,
              {
                properties: {
                  pool: {
                    username: text,
                  },
                },
              },
            ))}
            validate={
              (value?: string) => usernameValidator
                .validate(value)
                .error == null
            }
            validationMessage={
              usernameValidator
                .validate(localState.properties?.pool?.username)
                .error?.message
            }
            validateOnChange
            enableErrors
            floatOnFocus
            showCharCounter
            maxLength={128}
            fieldStyle={styles.withUnderline}
            hint="Mostly used for wallet"
          />
          <Incubator.TextField
            placeholder="Password"
            floatingPlaceholder
            value={localState.properties?.pool?.password}
            onChangeText={(text) => setLocalState((oldState) => merge(
              oldState,
              {
                properties: {
                  pool: {
                    password: text,
                  },
                },
              },
            ))}
            validate={
              (value?: string) => passwordValidator
                .validate(value)
                .error == null
            }
            validationMessage={
              passwordValidator
                .validate(localState.properties?.pool?.password)
                .error?.message
            }
            validateOnChange
            enableErrors
            floatOnFocus
            showCharCounter
            maxLength={128}
            fieldStyle={styles.withUnderline}
          />
          <View row flex paddingT-20>
            <Text text80 $textNeutralLight flex column>SSL</Text>
            <Switch
              value={localState.properties?.pool?.sslEnabled}
              onValueChange={(value) => setLocalState((oldState) => merge(
                oldState,
                {
                  properties: {
                    pool: {
                      sslEnabled: value,
                    },
                  },
                },
              ))}
            />
          </View>
        </View>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  withUnderline: {
    borderBottomWidth: 1,
    borderColor: Colors.$outlineDisabled,
    paddingBottom: 4,
  },
});

const EditSimplePoolCardSkeleton: React.FC<EditSimpleCardProps> = (props) => {
  const [loaded, setLoaded] = React.useState<boolean>(false);
  React.useEffect(() => {
    const interval = setTimeout(() => setLoaded(true), 500);
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
        (customProps: EditSimpleCardProps) => (<EditSimplePoolCard {...customProps} />)
      }
      times={3}
    />
  );
};

export default EditSimplePoolCardSkeleton;
