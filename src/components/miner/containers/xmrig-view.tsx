import React from 'react';
import {
  Dimensions,
  ScaledSize,
  StyleSheet,
} from 'react-native';
import _ from 'lodash';
import prettyBytes from 'pretty-bytes';
// @ts-ignore
import { hashrateToString } from 'hashrate';
import { Area, CartesianChart, Line } from 'victory-native';
import {
  Colors, View, Text, ViewProps, Card, Assets,
} from 'react-native-ui-lib';
import { ItemGrid } from '../../core/item-grid';
import { IMinerSummary } from '../../../core/hooks';
import { MinerCard } from '../components/miner-card.component';
import { IHashrateHistory } from '../../../core/session-data/session-data.interface';

const screen = Dimensions.get('screen');

type ChartPoint = { x: number; y: number };

type GridCardProps = {
  title: string;
  text?: string | number;
  children?: React.ReactNode;
};

type GridHashrateCardProps = {
  title: string;
  subTitle?: string;
};

const toChartData = (values: number[] = []): ChartPoint[] => {
  const source = values.length > 0 ? values : [0, 0];
  return source.map((y, x) => ({ x, y }));
};

const HashrateChart: React.FC<{ data: number[] }> = ({ data }) => (
  <View flex style={{ height: 100 }}>
    <CartesianChart
      data={toChartData([0, ..._.takeRight(data, 10), 0])}
      xKey="x"
      yKeys={['y']}
      domainPadding={{ top: 10 }}
      frame={{ lineWidth: 0 }}
    >
      {({ points, chartBounds }) => (
        <>
          <Area
            points={points.y}
            y0={chartBounds.bottom}
            color={Colors.$backgroundPrimaryLight}
            curveType="natural"
          />
          <Line
            points={points.y}
            color={Colors.$outlinePrimary}
            strokeWidth={2}
            curveType="natural"
          />
        </>
      )}
    </CartesianChart>
  </View>
);

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const GridCard: React.FC<GridCardProps> = ({ title, text = '', children = null }) => (
  <MinerCard title={title} value={text}>
    {children}
  </MinerCard>
);

const GridHashrateCard: React.FC<GridHashrateCardProps> = ({
  title,
  subTitle = '',
}) => (
  <MinerCard title={title} value={subTitle} />
);

type XMRigViewProps = ViewProps & {
    hashrateHistory: IHashrateHistory;
    minerData: IMinerSummary | null;
    workingState: string;
}

export const XMRigView: React.FC<XMRigViewProps> = ({
  hashrateHistory,
  minerData,
  workingState,
}) => {
  const [dimensions, setDimensions] = React.useState<ScaledSize>({
    ...screen,
    width: screen.width - 19,
  });

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ screen: nextScreen }: { screen: ScaledSize }) => {
        setDimensions({
          ...nextScreen,
          width: nextScreen.width - 19,
        });
      },
    );
    return () => subscription?.remove();
  }, []);

  return (
    <>
      <View flex row paddingV-10>
        <ItemGrid
          items={[
            {
              renderCustomItem: () => (
                <GridCard title="Mode" text={workingState || 'N/A'}>
                  <Card.Image source={Assets.icons.working} height={30} width={30} style={{ position: 'absolute', right: 5, top: 5 }} tintColor={Colors.$iconNeutral} />
                </GridCard>
              ),
            },
            {
              renderCustomItem: () => (
                <GridCard title="Algo" text={minerData?.algo || 'N/A'}>
                  <Card.Image source={Assets.icons.blockchain} height={30} width={30} style={{ position: 'absolute', right: 5, top: 5 }} tintColor={Colors.$iconNeutral} />
                </GridCard>
              ),
            },
          ]}
          numColumns={2}
          viewWidth={dimensions.width}
        />
      </View>
      <View flex paddingV-10>
        <SectionTitle title="Hashrate" />
        <View flex row>
          <ItemGrid
            itemSpacing={10}
            items={[
              {
                renderCustomItem: () => (
                  <GridHashrateCard title="10 seconds" subTitle={`${hashrateToString(_.last(hashrateHistory.history10s) || 0, true)}/s`} />
                ),
              },
              {
                renderCustomItem: () => (
                  <GridHashrateCard title="60 seconds" subTitle={`${hashrateToString(_.last(hashrateHistory.history60s) || 0, true)}/s`} />
                ),
              },
              {
                renderCustomItem: () => (
                  <GridHashrateCard title="15 minutes" subTitle={`${hashrateToString(_.last(hashrateHistory.history15m) || 0, true)}/s`} />
                ),
              },
              {
                renderCustomItem: () => (
                  <GridHashrateCard title="Peak" subTitle={`${hashrateToString(_.last(hashrateHistory.historyMax) || 0, true)}/s`} />
                ),
              },
            ]}
            numColumns={2}
            viewWidth={dimensions.width}
          />
        </View>
        <View flex row paddingT-12>
          <MinerCard
            title="Live"
            subTitle={`${hashrateToString(_.last(hashrateHistory.historyCurrent) || 0, true)}/s`}
          >
            <HashrateChart data={hashrateHistory.historyCurrent || []} />
          </MinerCard>
        </View>
      </View>
      <View flex paddingV-10>
        <SectionTitle title="Shares" />
        <View flex row>
          <ItemGrid
            items={[
              { renderCustomItem: () => <GridCard title="Accepted" text={minerData?.connection.accepted || 0} /> },
              { renderCustomItem: () => <GridCard title="Rejected" text={minerData?.connection.rejected || 0} /> },
              { renderCustomItem: () => <GridCard title="Total" text={(minerData?.connection.accepted || 0) + (minerData?.connection.rejected || 0)} /> },
            ]}
            numColumns={3}
            viewWidth={dimensions.width}
          />
        </View>
        <View flex row paddingT-10>
          <ItemGrid
            items={[
              { renderCustomItem: () => <GridCard title="Difficulty" text={minerData?.results.diff_current || 'N/A'} /> },
              { renderCustomItem: () => <GridCard title="Total Hashes" text={hashrateToString(minerData?.results.hashes_total || 0, true)} /> },
            ]}
            numColumns={2}
            viewWidth={dimensions.width}
          />
        </View>
      </View>
      <View flex paddingV-10>
        <SectionTitle title="CPU" />
        <View flex row>
          <ItemGrid
            items={[
              {
                renderCustomItem: () => (
                  <GridCard title="Brand" text={minerData?.cpu.brand || 'N/A'}>
                    <Card.Image source={Assets.icons.cpu} height={25} width={25} style={{ position: 'absolute', right: 10, top: 10 }} tintColor={Colors.$iconNeutral} />
                  </GridCard>
                ),
              },
              {
                renderCustomItem: () => (
                  <GridCard title="Cores" text={minerData?.cpu.cores || 'N/A'}>
                    <Card.Image source={Assets.icons.cpuCore} height={25} width={25} style={{ position: 'absolute', right: 10, top: 10 }} tintColor={Colors.$iconNeutral} />
                  </GridCard>
                ),
              },
              { renderCustomItem: () => <GridCard title="Threads" text={minerData?.cpu.threads || 'N/A'} /> },
              { renderCustomItem: () => <GridCard title="Arch" text={minerData?.cpu.arch || 'N/A'} /> },
            ]}
            viewWidth={dimensions.width}
            numColumns={2}
          />
        </View>
      </View>
      <View flex paddingV-10>
        <SectionTitle title="Memory" />
        <View flex row>
          <ItemGrid
            items={[
              {
                renderCustomItem: () => (
                  <GridCard title="Free Mem" text={prettyBytes(minerData?.resources.memory.free || 0)}>
                    <Card.Image source={Assets.icons.memory} height={25} width={28} style={{ position: 'absolute', right: 10, top: 10 }} tintColor={Colors.$iconNeutral} />
                  </GridCard>
                ),
              },
              {
                renderCustomItem: () => (
                  <GridCard title="Res. Mem" text={prettyBytes(minerData?.resources.memory.resident_set_memory || 0)}>
                    <Card.Image source={Assets.icons.memory} height={25} width={28} style={{ position: 'absolute', right: 10, top: 10 }} tintColor={Colors.$iconNeutral} />
                  </GridCard>
                ),
              },
            ]}
            numColumns={2}
            viewWidth={dimensions.width}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontWeight: '700',
    color: Colors.$textNeutral,
  },
});
