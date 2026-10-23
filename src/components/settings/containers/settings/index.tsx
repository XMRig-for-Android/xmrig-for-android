import { ViewProps } from 'react-native-ui-lib';

export type SettingsCardProps<T> = ViewProps & {
  settings: T;
  onUpdate: (data: Partial<T>) => void;
};
