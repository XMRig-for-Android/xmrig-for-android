import _ from 'lodash';
import React from 'react';
import {
  Image, Pressable, StyleSheet, Text, View,
} from 'react-native';
import {
  Picker,
  ViewProps,
  Incubator,
  Assets,
} from 'react-native-ui-lib';
import LinearGradient from 'react-native-linear-gradient';
import { Area, CartesianChart, Line } from 'victory-native';
import { LinearGradient as SkiaLinearGradient, vec } from 'react-native-skia';
import { Battery } from '@brightlayer-ui/react-native-progress-icons';
// @ts-ignore
import { hashrateToString } from 'hashrate';
import { useMiner } from '../../../core/hooks/use-miner.hook';
import { SessionDataContext } from '../../../core/session-data/session-data.context';
import { WorkingState } from '../../../core/session-data/session-data.interface';
import { SettingsActionType, SettingsContext } from '../../../core/settings';
import { useToaster } from '../../../core/hooks/use-toaster/use-toaster.hook';
import { PowerContext } from '../../../core/power/power.context';
import {
  palette, radius, shadow, splitHashrate,
} from '../../../core/theme';

const statusMeta: Record<string, { label: string; color: string }> = {
  [WorkingState.NOT_WORKING]: { label: 'Idle', color: palette.inkSubtle },
  [WorkingState.MINING]: { label: 'Mining', color: palette.success },
  [WorkingState.PAUSED]: { label: 'Paused', color: palette.warning },
};

type HeroChartProps = { data: number[] };

const HeroChart = React.memo(({ data }: HeroChartProps) => {
  const points = [0, ..._.takeRight(data, 12), 0].map((y, x) => ({ x, y }));
  return (
    <View style={styles.chart}>
      <CartesianChart
        data={points}
        xKey="x"
        yKeys={['y']}
        domainPadding={{ top: 12 }}
        frame={{ lineWidth: 0 }}
        yAxis={[{ lineWidth: 0, tickCount: 0, labelColor: 'transparent' }]}
      >
        {({ points: chartPoints, chartBounds }) => (
          <>
            <Area points={chartPoints.y} y0={chartBounds.bottom} curveType="natural">
              <SkiaLinearGradient
                start={vec(0, chartBounds.top)}
                end={vec(0, chartBounds.bottom)}
                colors={['rgba(166, 107, 255, 0.55)', 'rgba(110, 91, 255, 0)']}
              />
            </Area>
            <Line points={chartPoints.y} color="#C9B8FF" strokeWidth={2.5} curveType="natural" />
          </>
        )}
      </CartesianChart>
    </View>
  );
});

export const MinerControl:React.FC<ViewProps> = () => {
  const toaster = useToaster();

  const { workingState, hashrateTotals, CPUTemp } = React.useContext(SessionDataContext);
  const powerContext = React.useContext(PowerContext);
  const { startWithSelectedConfiguration, stop: handleStop } = useMiner();

  const { settings, settingsDispatcher } = React.useContext(SettingsContext);
  const [selectedConfiguration, setSelectedConfiguration] = React.useState<string | undefined>(
    settings.selectedConfiguration,
  );

  React.useEffect(() => {
    setSelectedConfiguration(settings.selectedConfiguration);
  }, [settings.selectedConfiguration]);

  const isWorking = React.useMemo<boolean>(
    () => workingState !== WorkingState.NOT_WORKING,
    [workingState],
  );

  const handleStart = React.useCallback(() => {
    if (!settings.selectedConfiguration) {
      if (_.isEmpty(settings.configurations)) {
        toaster({
          message: 'Please add a Configuration from Settings menu',
          position: 'top',
          preset: Incubator.ToastPresets.FAILURE,
        });
      } else {
        toaster({
          message: 'Please select a Configuration to start mining',
          position: 'top',
          preset: Incubator.ToastPresets.FAILURE,
        });
      }
    } else {
      startWithSelectedConfiguration();
    }
  }, [settings]);

  React.useEffect(() => {
    if (selectedConfiguration === settings.selectedConfiguration) {
      return;
    }
    settingsDispatcher({
      type: SettingsActionType.SET_SELECTED_CONFIGURAION,
      value: selectedConfiguration,
    });
  }, [selectedConfiguration, settings.selectedConfiguration]);

  const configName = React.useMemo(
    () => settings.configurations.find((config) => config.id === selectedConfiguration)?.name,
    [settings.configurations, selectedConfiguration],
  );

  const status = statusMeta[workingState] || statusMeta[WorkingState.NOT_WORKING];
  const live = splitHashrate(hashrateToString(_.last(hashrateTotals.historyCurrent) || 0, true));
  const batteryColor = powerContext.batteryLevel > 50 ? palette.success
    : powerContext.batteryLevel > 20 ? palette.warning : palette.danger;

  const configLabel = (
    <View style={styles.configRow}>
      <Text style={styles.configEyebrow}>Configuration</Text>
      <View style={styles.configValueRow}>
        <Text style={[styles.configValue, !configName && styles.configPlaceholder]} numberOfLines={1}>
          {configName || (_.isEmpty(settings.configurations) ? 'Add one in Settings' : 'Select configuration')}
        </Text>
        {!isWorking ? <Text style={styles.chevron}>⌄</Text> : null}
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={[palette.heroFrom, palette.heroVia, palette.heroTo]}
      locations={[0, 0.55, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.hero}
    >
      <View style={styles.topRow}>
        <View style={styles.statusPill}>
          <View style={[styles.statusDot, { backgroundColor: status.color }]} />
          <Text style={styles.statusText}>{status.label}</Text>
        </View>
        <View style={styles.vitals}>
          <Text style={styles.vitalsText}>{`${CPUTemp.toFixed(1)}°C`}</Text>
          <View style={styles.vitalsDivider} />
          <Battery
            percent={powerContext.batteryLevel}
            size={20}
            color={batteryColor}
            charging={powerContext.isPowerConnected}
            outlined={false}
          />
          <Text style={styles.vitalsText}>{`${Math.round(powerContext.batteryLevel)}%`}</Text>
        </View>
      </View>

      <Text style={styles.heroEyebrow}>Live hashrate</Text>
      <View style={styles.heroValueRow}>
        <Text style={styles.heroValue}>{live.value}</Text>
        <Text style={styles.heroUnit}>{`${live.unit}/s`}</Text>
      </View>

      <HeroChart data={hashrateTotals.historyCurrent || []} />

      <View style={styles.footer}>
        <View style={styles.configSlot}>
          {isWorking ? configLabel : (
            <Picker
              placeholder="Select a configuration"
              topBarProps={{ title: 'Configurations' }}
              value={selectedConfiguration}
              showSearch
              searchPlaceholder="Search configurations"
              onChange={(value) => {
                setSelectedConfiguration(typeof value === 'string' ? value : undefined);
              }}
              renderPicker={() => configLabel}
            >
              {_.map(settings.configurations, (item) => (
                <Picker.Item
                  key={item?.id}
                  value={item?.id || ''}
                  label={item?.name}
                />
              ))}
            </Picker>
          )}
        </View>
        <Pressable
          onPress={isWorking ? handleStop : handleStart}
          style={({ pressed }) => [
            styles.action,
            isWorking ? styles.actionStop : styles.actionStart,
            pressed && styles.actionPressed,
          ]}
        >
          <Image
            source={isWorking ? Assets.icons.stop : Assets.icons.start}
            style={[styles.actionIcon, { tintColor: isWorking ? palette.onHero : palette.ink }]}
            resizeMode="contain"
          />
          <Text style={[styles.actionLabel, { color: isWorking ? palette.onHero : palette.ink }]}>
            {isWorking ? 'Stop' : 'Start'}
          </Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  hero: {
    borderRadius: radius.xl,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    overflow: 'hidden',
    ...shadow(3),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.onHeroSubtle,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: palette.onHero,
    fontSize: 13,
    fontWeight: '600',
  },
  vitals: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vitalsText: {
    color: palette.onHeroMuted,
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  vitalsDivider: {
    width: 1,
    height: 12,
    backgroundColor: palette.onHeroSubtle,
    marginHorizontal: 4,
  },
  heroEyebrow: {
    marginTop: 22,
    color: palette.onHeroMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  heroValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  heroValue: {
    color: palette.onHero,
    fontSize: 46,
    lineHeight: 54,
    fontWeight: '700',
    letterSpacing: -1.5,
    fontVariant: ['tabular-nums'],
  },
  heroUnit: {
    marginLeft: 8,
    color: palette.onHeroMuted,
    fontSize: 18,
    fontWeight: '600',
  },
  chart: {
    height: 84,
    marginHorizontal: -20,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: palette.onHeroSubtle,
    borderRadius: radius.lg,
    padding: 6,
    paddingLeft: 16,
  },
  configSlot: {
    flex: 1,
    marginRight: 12,
  },
  configRow: {
    paddingVertical: 4,
  },
  configEyebrow: {
    color: palette.onHeroMuted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  configValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  configValue: {
    flexShrink: 1,
    color: palette.onHero,
    fontSize: 16,
    fontWeight: '700',
  },
  configPlaceholder: {
    color: palette.warning,
  },
  chevron: {
    marginLeft: 6,
    marginTop: -6,
    color: palette.onHeroMuted,
    fontSize: 16,
    fontWeight: '700',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 104,
    height: 48,
    borderRadius: radius.md,
    paddingHorizontal: 18,
  },
  actionStart: {
    backgroundColor: palette.onHero,
  },
  actionStop: {
    backgroundColor: palette.danger,
  },
  actionPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  actionIcon: {
    width: 12,
    height: 12,
    marginRight: 8,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
});
