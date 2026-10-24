import React from 'react';
import {
  Image, ImageSourcePropType, StyleSheet, Text, View,
} from 'react-native';
import _ from 'lodash';
import prettyBytes from 'pretty-bytes';
// @ts-ignore
import { hashrateToString } from 'hashrate';
import { Assets, ViewProps } from 'react-native-ui-lib';
import { IMinerSummary } from '../../../core/hooks';
import { MinerCard } from '../components/miner-card.component';
import { IHashrateHistory } from '../../../core/session-data/session-data.interface';
import {
  palette, radius, shadow, splitHashrate,
} from '../../../core/theme';

const SectionTitle: React.FC<{ title: string; caption?: string }> = ({ title, caption }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {caption ? <Text style={styles.sectionCaption}>{caption}</Text> : null}
  </View>
);

const Row: React.FC<React.PropsWithChildren> = ({ children }) => (
  <View style={styles.row}>{children}</View>
);

const HashrateTile: React.FC<{ title: string; value: number; accent?: boolean }> = ({
  title, value, accent = false,
}) => {
  const { value: amount, unit } = splitHashrate(hashrateToString(value || 0, true));
  return <MinerCard title={title} value={amount} unit={`${unit}/s`} tone={accent ? 'accent' : 'default'} />;
};

const SharesCard: React.FC<{ accepted: number; rejected: number; totalHashes: number }> = ({
  accepted, rejected, totalHashes,
}) => {
  const total = accepted + rejected;
  const ratio = total > 0 ? accepted / total : 0;
  const hashes = splitHashrate(hashrateToString(totalHashes || 0, true));
  return (
    <View style={styles.panel}>
      <View style={styles.sharesRow}>
        <View style={styles.shareCell}>
          <Text style={styles.cellLabel}>Accepted</Text>
          <Text style={[styles.cellValue, accepted > 0 && { color: palette.success }]}>{accepted}</Text>
        </View>
        <View style={styles.shareDivider} />
        <View style={styles.shareCell}>
          <Text style={styles.cellLabel}>Rejected</Text>
          <Text style={[styles.cellValue, rejected > 0 && { color: palette.danger }]}>{rejected}</Text>
        </View>
        <View style={styles.shareDivider} />
        <View style={styles.shareCell}>
          <Text style={styles.cellLabel}>Total</Text>
          <Text style={styles.cellValue}>{total}</Text>
        </View>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${ratio * 100}%` }]} />
      </View>
      <View style={styles.panelFooter}>
        <Text style={styles.footerLabel}>
          {total > 0 ? `${(ratio * 100).toFixed(1)}% acceptance` : 'No shares yet'}
        </Text>
        <Text style={styles.footerValue}>{`${hashes.value} ${hashes.unit} hashed`}</Text>
      </View>
    </View>
  );
};

type InfoRow = { label: string; value: string | number; icon?: ImageSourcePropType };

const InfoList: React.FC<{ rows: InfoRow[] }> = ({ rows }) => (
  <View style={[styles.panel, styles.listPanel]}>
    {rows.map((row, index) => (
      <View key={row.label} style={[styles.listRow, index > 0 && styles.listRowBorder]}>
        <View style={styles.listIcon}>
          {row.icon ? (
            <Image source={row.icon} style={styles.listIconImage} resizeMode="contain" />
          ) : null}
        </View>
        <Text style={styles.listLabel}>{row.label}</Text>
        <Text style={styles.listValue} numberOfLines={1}>{`${row.value}`}</Text>
      </View>
    ))}
  </View>
);

type XMRigViewProps = ViewProps & {
    hashrateHistory: IHashrateHistory;
    minerData: IMinerSummary | null;
    workingState: string;
}

export const XMRigView: React.FC<XMRigViewProps> = ({
  hashrateHistory,
  minerData,
}) => (
  <>
    <SectionTitle title="Performance" caption="Average hashrate" />
    <View style={styles.grid}>
      <Row>
        <HashrateTile title="10 seconds" value={_.last(hashrateHistory.history10s) || 0} />
        <HashrateTile title="60 seconds" value={_.last(hashrateHistory.history60s) || 0} />
      </Row>
      <Row>
        <HashrateTile title="15 minutes" value={_.last(hashrateHistory.history15m) || 0} />
        <HashrateTile title="Peak" value={_.last(hashrateHistory.historyMax) || 0} accent />
      </Row>
    </View>

    <SectionTitle title="Pool" />
    <View style={styles.grid}>
      <Row>
        <MinerCard title="Algorithm" value={minerData?.algo || '—'} icon={Assets.icons.blockchain} tone="accent" />
        <MinerCard title="Difficulty" value={minerData?.results.diff_current || '—'} />
      </Row>
      <SharesCard
        accepted={minerData?.connection.accepted || 0}
        rejected={minerData?.connection.rejected || 0}
        totalHashes={minerData?.results.hashes_total || 0}
      />
    </View>

    <SectionTitle title="Device" />
    <InfoList
      rows={[
        { label: 'Processor', value: minerData?.cpu.brand || '—', icon: Assets.icons.cpu },
        { label: 'Architecture', value: minerData?.cpu.arch || '—', icon: Assets.icons.working },
        { label: 'Cores', value: minerData?.cpu.cores || '—', icon: Assets.icons.cpuCore },
        { label: 'Threads', value: minerData?.cpu.threads || '—', icon: Assets.icons.cpuCore },
        { label: 'Free memory', value: minerData ? prettyBytes(minerData.resources.memory.free || 0) : '—', icon: Assets.icons.memory },
        { label: 'Resident memory', value: minerData ? prettyBytes(minerData.resources.memory.resident_set_memory || 0) : '—', icon: Assets.icons.memory },
      ]}
    />
  </>
);

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 26,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.ink,
    letterSpacing: -0.3,
  },
  sectionCaption: {
    fontSize: 12,
    fontWeight: '500',
    color: palette.inkSubtle,
  },
  grid: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  panel: {
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.hairline,
    padding: 16,
    ...shadow(1),
  },
  sharesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareCell: {
    flex: 1,
    alignItems: 'center',
  },
  shareDivider: {
    width: StyleSheet.hairlineWidth,
    height: 36,
    backgroundColor: palette.track,
  },
  cellLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.inkSubtle,
  },
  cellValue: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: '700',
    color: palette.ink,
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.track,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: palette.success,
  },
  panelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  footerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.inkMuted,
  },
  footerValue: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.inkSubtle,
    fontVariant: ['tabular-nums'],
  },
  listPanel: {
    paddingVertical: 4,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  listRowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.track,
  },
  listIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: palette.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listIconImage: {
    width: 14,
    height: 14,
    tintColor: palette.inkMuted,
  },
  listLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: palette.inkMuted,
  },
  listValue: {
    maxWidth: '55%',
    fontSize: 14,
    fontWeight: '700',
    color: palette.ink,
  },
});
