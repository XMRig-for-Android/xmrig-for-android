import { Reducer } from 'react';
import uuid from 'react-native-uuid';
import merge from 'lodash/fp/merge';
import { SettingsActionType } from './settings.actions';
import { defaultConfiguration, defaultSimpleConfiguration } from './settings.context';
import {
  Configuration,
  ConfigurationMode,
  IConfiguration,
  ISettings,
  ISettingsReducerAction,
} from './settings.interface';

export const SettingsReducer:Reducer<ISettings, ISettingsReducerAction> = (
  prevState: ISettings,
  action: ISettingsReducerAction,
) => {
  console.log('reducer', action);
  switch (action.type) {
    case SettingsActionType.SET:
      return {
        ...action.value as ISettings,
      } as ISettings;
    case SettingsActionType.UPDATE:
      return merge(
        prevState,
        action.value,
      );
    case SettingsActionType.ADD_CONFIGURATION:
      // eslint-disable-next-line no-case-declarations
      const newConfig = (action.value as Configuration).mode === ConfigurationMode.SIMPLE
        ? {
          ...defaultConfiguration,
          ...defaultSimpleConfiguration,
          ...action.value as Configuration,
        }
        : {
          ...defaultConfiguration,
          ...action.value as Configuration,
        };

      return {
        ...prevState,
        configurations: [
          ...prevState.configurations,
          {
            ...newConfig,
            id: newConfig.id || uuid.v4(),
          },
        ],
      } as ISettings;
    case SettingsActionType.UPDATE_CONFIGURATION:
      return {
        ...prevState,
        configurations: prevState.configurations.map((config) => {
          if (config.id === (action.value as IConfiguration).id) {
            return action.value;
          }
          return config;
        }),
      } as ISettings;
    case SettingsActionType.DELETE_CONFIGURATIONS: {
      const deletedIds = action.value as string[];
      const configurations = prevState.configurations.filter(
        (config) => !deletedIds.includes(`${config.id}`),
      );
      const selectedConfiguration = deletedIds.includes(`${prevState.selectedConfiguration}`)
        ? undefined
        : prevState.selectedConfiguration;
      return {
        ...prevState,
        configurations,
        selectedConfiguration,
      } as ISettings;
    }
    case SettingsActionType.SET_SELECTED_CONFIGURAION:
      return {
        ...prevState,
        selectedConfiguration: action.value,
      } as ISettings;
    default:
  }
  return prevState;
};
