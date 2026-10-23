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
  Colors, View, Text, ViewProps, Card, GridView, Assets,
} from 'react-native-ui-lib';
import { IMinerSummary } from '../../../core/hooks';
import { MinerCard } from '../components/miner-card.component';
import { IHashrateHistory } from '../../../core/session-data/session-data.interface';

const screen = Dimensions.get('screen');

type ChartPoint = { x: number; y: number };

type SmallHashrateChartProps = {
  hashrateHistoryData: number[];
};

type GridCardProps = {
  title: string;
  text?: string | number;
  children?: React.ReactNode;
};

type GridHashrateCardProps = {
  title: string;
  subTitle?: string;
  children?: React.ReactNode;
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

const SmallHashrateChart: React.FC<SmallHashrateChartProps> = ({
  hashrateHistoryData = [],
}) => (
  <View flex right style={{ height: 50, width: 100 }}>
    <CartesianChart
      data={toChartData(hashrateHistoryData)}
      xKey="x"
      yKeys={['y']}
      domainPadding={{ top: 5 }}
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
            strokeWidth={1}
            curveType="natural"
          />
        </>
      )}
    </CartesianChart>
  </View>
);

const GridCard: React.FC<GridCardProps> = ({ title, text = '', children = null }) => (
  <MinerCard title={title}>
    <Card.Section
      paddingH-10
      paddingB-10
      paddingT-5
      content={[
        { text: `${text ?? ''}`, text65: true },
      ]}
      style={{
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }}
    />
    {children && children}
  </MinerCard>
);

const GridHashrateCard: React.FC<GridHashrateCardProps> = ({
  title,
  subTitle = '',
  children = null,
}) => (
  <MinerCard title={title} subTitle={subTitle}>
    {children}
  </MinerCard>
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
      ({ screen: _screen }) => {
        setDimensions({
          ..._screen,
          width: _screen.width - 19,
        });
      },
    );
    return () => subscription?.remove();
  }, []);

  return (
    <>
      <View flex row paddingV-10>
        <GridView
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
        <View flex row spread paddingB-5 marginB-10 style={styles.sectionDiv}>
          <Text text60>Hashrate</Text>
        </View>
        <View flex row>
          <GridView
            items={[
              {
                renderCustomItem: () => (
                  <GridHashrateCard title="10s" subTitle={`${hashrateToString(_.last(hashrateHistory.history10s) || 0, true)}/s`}>
                    <SmallHashrateChart hashrateHistoryData={hashrateHistory.history10s} />
                  </GridHashrateCard>
                ),
              },
              {
                renderCustomItem: () => (
                  <GridHashrateCard title="60s" subTitle={`${hashrateToString(_.last(hashrateHistory.history60s) || 0, true)}/s`}>
                    <SmallHashrateChart hashrateHistoryData={hashrateHistory.history60s} />
                  </GridHashrateCard>
                ),
              },
              {
                renderCustomItem: () => (
                  <GridHashrateCard title="15m" subTitle={`${hashrateToString(_.last(hashrateHistory.history15m) || 0, true)}/s`}>
                    <SmallHashrateChart hashrateHistoryData={hashrateHistory.history15m} />
                  </GridHashrateCard>
                ),
              },
              {
                renderCustomItem: () => (
                  <GridHashrateCard title="max" subTitle={`${hashrateToString(_.last(hashrateHistory.historyMax) || 0, true)}/s`}>
                    <SmallHashrateChart hashrateHistoryData={hashrateHistory.historyMax} />
                  </GridHashrateCard>
                ),
              },
            ]}
            numColumns={4}
            viewWidth={dimensions.width}
          />
        </View>
        <View flex row paddingT-10 style={{ zIndex: 0 }}>
          <MinerCard
            title="Live Hashrate"
            subTitle={`${hashrateToString(_.last(hashrateHistory.historyCurrent) || 0, true)}/s`}
            cardProps={{ row: true, center: true }}
            badgeProps={{ size: 20 }}
          >
            <HashrateChart data={hashrateHistory.historyCurrent || []} />
          </MinerCard>
        </View>
      </View>
      <View flex paddingV-10>
        <View flex row spread paddingB-5 marginB-10 style={styles.sectionDiv}>
          <Text text60>Shares</Text>
        </View>
        <View flex row>
          <GridView
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
          <GridView
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
        <View flex row spread paddingB-5 marginB-10 style={styles.sectionDiv}>
          <Text text60>CPU</Text>
        </View>
        <View flex row>
          <GridView
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
        <View flex row spread paddingB-5 marginB-10 style={styles.sectionDiv}>
          <Text text60>Memory</Text>
        </View>
        <View flex row>
          <GridView
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
  sectionDiv: {
    borderBottomWidth: 1,
    borderColor: Colors.grey30,
  },
});
