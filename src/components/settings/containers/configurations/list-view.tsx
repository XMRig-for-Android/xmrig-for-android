import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Pressable, StyleSheet, Text, View,
} from 'react-native';
import { RootStackParamList } from '../../../../core/navigation';
import {
  Configuration, ConfigurationMode, ISimpleConfiguration, XMRigFork,
} from '../../../../core/settings/settings.interface';
import { palette, radius, shadow } from '../../../../core/theme';
import { Badge, Button } from '../../../core/ui';

type ConfigurationsListViewProps = {
  configurations: Configuration[];
  activeId?: string;
  onActivate: (id: string) => void;
};

const poolSummary = (configuration: Configuration): string => {
  if (configuration.mode === ConfigurationMode.ADVANCE) {
    return 'Custom JSON config';
  }
  const pool = (configuration as ISimpleConfiguration).properties?.pool;
  if (!pool?.hostname) {
    return 'No pool configured';
  }
  return pool.port ? `${pool.hostname}:${pool.port}` : pool.hostname;
};

export const ConfigurationsListView: React.FC<ConfigurationsListViewProps> = ({
  configurations,
  activeId,
  onActivate,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.list}>
      {configurations.map((item) => {
        const active = item.id === activeId;
        return (
          <Pressable
            key={item.id}
            onPress={() => navigation.navigate('Configuration', { id: item.id })}
            style={({ pressed }) => [styles.card, active && styles.cardActive, pressed && styles.pressed]}
          >
            <View style={styles.cardBody}>
              <View style={styles.titleRow}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                {active ? <Badge label="Active" tone="success" /> : null}
              </View>
              <Text style={styles.pool} numberOfLines={1}>{poolSummary(item)}</Text>
              <View style={styles.badges}>
                <Badge
                  label={item.mode === ConfigurationMode.ADVANCE ? 'Advanced' : 'Simple'}
                  tone="accent"
                />
                <Badge
                  label={item.xmrig_fork === XMRigFork.MONEROOCEAN ? 'MoneroOcean' : 'XMRig'}
                  tone="neutral"
                />
              </View>
            </View>
            <View style={styles.cardSide}>
              {!active ? (
                <Button
                  label="Use"
                  size="sm"
                  variant="secondary"
                  onPress={() => onActivate(item.id as string)}
                />
              ) : null}
              <Text style={styles.chevron}>›</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.hairline,
    padding: 18,
    ...shadow(1),
  },
  cardActive: {
    borderColor: palette.success,
  },
  pressed: {
    opacity: 0.85,
  },
  cardBody: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    flexShrink: 1,
    fontSize: 17,
    fontWeight: '700',
    color: palette.ink,
    letterSpacing: -0.3,
  },
  pool: {
    marginTop: 4,
    fontSize: 13,
    color: palette.inkMuted,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  cardSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 12,
  },
  chevron: {
    fontSize: 26,
    lineHeight: 28,
    color: palette.inkSubtle,
    fontWeight: '300',
  },
});
