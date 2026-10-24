import React from 'react';
import { ScrollView } from 'react-native';
import {
  View,
  Text,
  ViewProps,
  Incubator,
  Button,
  FloatingButton,
  Colors,
  Assets,
  ButtonProps,
} from 'react-native-ui-lib';
import Anser from 'anser';
import Clipboard from '@react-native-clipboard/clipboard';
import { XMRigLogView } from '../../containers/xmrig-log';
import { ILoggerLine, LoggerActionType, LoggerContext } from '../../../../core/logger';
import { useToaster } from '../../../../core/hooks/use-toaster/use-toaster.hook';
import { palette } from '../../../../core/theme';

const actionsButtonDefault: ButtonProps = {
  label: 'Menu',
  iconSource: Assets.icons.barsOpen,
  iconStyle: {
    width: 22,
    height: 22,
    margin: 0,
    tintColor: Colors.$iconDefaultLight,
  },
};

const LogScreen:React.FC<ViewProps> = () => {
  const { loggerState, loggerDispatcher } = React.useContext(LoggerContext);
  const toaster = useToaster();

  const copyToClipboard = () => {
    Clipboard.setString(
      loggerState
        .slice(-100)
        .map((item: ILoggerLine) => `${item.ts} ${Anser.ansiToText(item.message)}`)
        .join('\n'),
    );
    toaster({
      message: 'The Log has been copied to clipboard',
      position: 'top',
      preset: Incubator.ToastPresets.SUCCESS,
    });
    setActionVisible(false);
  };

  const clearLog = () => {
    loggerDispatcher({
      type: LoggerActionType.RESET,
    });
    setActionVisible(false);
  };

  const [actionsVisible, setActionVisible] = React.useState<boolean>(false);
  const [actionsButtonProps, setActionButtonProps] = React.useState<ButtonProps>({});
  React.useEffect(() => {
    if (actionsVisible) {
      setActionButtonProps({
        iconSource: Assets.icons.barsClose,
        iconStyle: {
          width: 15,
          height: 15,
          margin: 8,
          tintColor: Colors.$iconDefaultLight,
        },
      });
    } else {
      setActionButtonProps(actionsButtonDefault);
    }
  }, [actionsVisible]);

  return (
    <View bg-screenBG flex>
      <View
        row
        spread
        paddingT-8
        paddingB-12
        paddingH-20
        centerV
      >
        <View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: palette.ink, letterSpacing: -0.3 }}>Miner Log</Text>
          <Text style={{ fontSize: 12, fontWeight: '500', color: palette.inkSubtle }}>Last 100 lines</Text>
        </View>
        <Button
          size={Button.sizes.small}
          onPress={() => setActionVisible(!actionsVisible)}
          animateLayout
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...actionsButtonProps}
        />
      </View>
      <View
        flex
        paddingH-16
        paddingB-10
        useSafeArea
      >
        <ScrollView nestedScrollEnabled contentContainerStyle={{ flexGrow: 1 }}>
          <XMRigLogView data={loggerState} />
        </ScrollView>
      </View>
      <FloatingButton
        duration={500}
        visible={actionsVisible}
        button={{
          size: Button.sizes.large,
          onPress: copyToClipboard,
          backgroundColor: Colors.$backgroundPrimaryHeavy,
          label: 'Copy to Clipboard',
          iconSource: Assets.icons.clipboard,
          iconStyle: {
            display: 'flex',
            width: 16,
            height: 20,
            tintColor: Colors.$iconDefaultLight,
          },
        }}
        secondaryButton={{
          size: Button.sizes.medium,
          label: 'Clear',
          onPress: clearLog,
          backgroundColor: Colors.$backgroundDangerHeavy,
          link: false,
          animateLayout: true,
          iconSource: Assets.icons.trash,
          iconStyle: {
            display: 'flex',
            width: 16,
            height: 20,
            tintColor: Colors.$iconDefaultLight,
          },
        }}
      />
    </View>
  );
};

export default LogScreen;
