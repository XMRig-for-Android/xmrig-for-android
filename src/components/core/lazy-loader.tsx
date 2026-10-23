import React from 'react';
import {
  View,
  ViewProps,
  LoaderScreen,
  Colors,
} from 'react-native-ui-lib';

export const Lazy = (componentImportFn:Function) => React.lazy(async () => {
  const obj = await componentImportFn();
  return typeof obj.default === 'function' ? obj : obj.default;
});

export const SpinnerLayout:React.FC<ViewProps> = () => (
  <View flex center>
    <LoaderScreen message="Loading" color={Colors.grey40} />
  </View>
);

export const LazyLoader: React.FC<React.PropsWithChildren> = ({ children }) => (
  <React.Suspense fallback={<SpinnerLayout />}>
    {children}
  </React.Suspense>
);
