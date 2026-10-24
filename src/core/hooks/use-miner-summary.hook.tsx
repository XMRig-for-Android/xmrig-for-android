import React from 'react';
import json5 from 'json5';
import { NativeModules, NativeEventEmitter, EmitterSubscription } from 'react-native';

const { XMRigForAndroid } = NativeModules;

export interface IMinerSummary {
  id: string;
  worker_id: string,
  uptime: number;
  restricted: boolean;
  resources: {
      memory: {
          free: number,
          total: number,
          resident_set_memory: number
      },
      load_average: number[],
      hardware_concurrency: number
  };
  features: string[];
  results: {
      diff_current: number,
      shares_good: number,
      shares_total: number,
      avg_time: number,
      avg_time_ms: number,
      hashes_total: number,
      best: number[]
  };
  algo: string;
  connection: {
      pool: string,
      ip: string,
      uptime: number,
      uptime_ms: number,
      ping: number,
      failures: number,
      tls: null,
      'tls-fingerprint': null,
      algo: string,
      diff: number,
      accepted: number,
      rejected: number,
      avg_time: number,
      avg_time_ms: number,
      hashes_total: number
  },
  version: string;
  kind: string;
  ua: string;
  cpu: {
      brand: string,
      aes: boolean,
      avx2: boolean,
      x64: boolean,
      '64_bit': boolean,
      l2: number,
      l3: number,
      cores: number,
      threads: number,
      packages: number,
      nodes: number,
      backend: string,
      msr: string,
      assembly: string,
      arch: string,
      flags: any[]
  },
  donate_level: number,
  paused: boolean,
  algorithms: string[],
  hashrate: {
      total: any[],
      highest: number | null
  },
  hugepages: number[]
}

type IMinerSummaryEvent = {
  data: string;
}

export const useMinerSummary = () => {
  const [state, setState] = React.useState<IMinerSummary | null>(null);

  React.useEffect(() => {
    const MinerEmitter = new NativeEventEmitter<{
      onSummary: [IMinerSummaryEvent];
    }>(XMRigForAndroid);

    const onSummarySub:EmitterSubscription = MinerEmitter.addListener('onSummary', (event) => {
      try {
        setState(json5.parse(event.data));
      } catch (er) {
        console.log(er);
      }
    });

    return () => {
      onSummarySub.remove();
    };
  }, []);

  return {
    minerData: state,
  };
};
