import React from 'react';
import { Colors, LoaderScreen } from 'react-native-ui-lib';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initialWindowMetrics, SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { SettingsContext, SettingsContextProvider } from './core/settings';
import { AppNavigator } from './components';
import { SessionDataContextProvider } from './core/session-data/session-data.context';
import { PowerContextProvider } from './core/power/power.context';
import { LoggerContextProvider } from './core/logger';
import { ToasterProvider } from './core/hooks/use-toaster/toaset.context';
import { LoadAssets } from './assets';

const AppWithSettings: React.FC = () => {
  React.useEffect(() => {
    LoadAssets();
    Colors.loadSchemes({
      light: {
        screenBG: Colors.grey70,
        textColor: Colors.grey10,
        moonOrSun: Colors.yellow30,
        mountainForeground: Colors.green30,
        mountainBackground: Colors.green50,
      },
      dark: {
        screenBG: Colors.grey10,
        textColor: Colors.white,
        moonOrSun: Colors.grey80,
        mountainForeground: Colors.violet10,
        mountainBackground: Colors.violet20,
      },
    });
    Colors.setScheme('light');
  }, []);

  return (
    <SettingsContextProvider>
      <App />
    </SettingsContextProvider>
  );
};

const App = () => {
  const { settings } = React.useContext(SettingsContext);

  if (settings.ready === false) {
    return <LoaderScreen message="Loading..." color={Colors.grey40} />;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <LoggerContextProvider>
          <PowerContextProvider>
            <SessionDataContextProvider>
              <SafeAreaView style={{ flex: 1 }}>
                <ToasterProvider>
                  <NavigationContainer>
                    <AppNavigator />
                  </NavigationContainer>
                </ToasterProvider>
              </SafeAreaView>
            </SessionDataContextProvider>
          </PowerContextProvider>
        </LoggerContextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default AppWithSettings;
