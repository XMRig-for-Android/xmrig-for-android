import { StyleSheet } from 'react-native';
import { textFieldStyles } from '../../../core/ui';

export type IPoolState = {
    hostname: string;
    port: number;
    username: string;
    password: string;
}

export type IPool = {
    onChange: (state: IPoolState) => void
}

// eslint-disable-next-line no-shadow
export enum PredefinedPoolName {
    MoneroOcean = 'moneroocean',
    MineXMR = 'minexmr',
    SupportXMR = 'supportxmr',
    nanopool = 'nanopool',
    C3Pool = 'c3pool',
    XMRPoolEU = 'xmrpooleu',
    HashVault = 'hashvalt',
    Hashcity = 'hashcity',
}

export type IPredefinedPoolInfo = {
    displayName: string;
    fee: number;
    method: 'PPS' | 'FPPS' | 'PPLNS' ;
    threshold: number;
}

export type IPredefinedPool = {
    name: PredefinedPoolName;
    info: IPredefinedPoolInfo;
}

export type IPredefinedPools = Record<PredefinedPoolName, IPredefinedPoolInfo>;

export const predefinedPools:IPredefinedPools = {
  [PredefinedPoolName.MoneroOcean]: {
    displayName: 'MoneroOcean', fee: 0, method: 'PPLNS', threshold: 0.003,
  },
  [PredefinedPoolName.MineXMR]: {
    displayName: 'MineXMR', fee: 1, method: 'PPLNS', threshold: 0.004,
  },
  [PredefinedPoolName.SupportXMR]: {
    displayName: 'SupportXMR', fee: 0.6, method: 'PPLNS', threshold: 0.01,
  },
  [PredefinedPoolName.nanopool]: {
    displayName: 'nanopool', fee: 1, method: 'PPLNS', threshold: 0.1,
  },
  [PredefinedPoolName.C3Pool]: {
    displayName: 'C3Pool', fee: 0, method: 'PPLNS', threshold: 0.003,
  },
  [PredefinedPoolName.XMRPoolEU]: {
    displayName: 'XMRPool EU', fee: 2.5, method: 'PPLNS', threshold: 2,
  },
  [PredefinedPoolName.HashVault]: {
    displayName: 'HashVault', fee: 0.9, method: 'PPLNS', threshold: 0.1,
  },
  [PredefinedPoolName.Hashcity]: {
    displayName: 'HashCity', fee: 1, method: 'FPPS', threshold: 0.01,
  },
};

export const predefinedPoolsList: IPredefinedPool[] = Object
  .keys(predefinedPools)
  .map((poolName: string) => ({
    name: poolName as PredefinedPoolName,
    info: predefinedPools[poolName as PredefinedPoolName],
  }));

export {
  MoneroOcean,
} from './moneroocean';

export {
  MineXMR,
} from './minexmr';

export {
  SupportXMR,
} from './supportxmr';

export {
  Nano,
} from './nano';

export {
  C3Pool,
} from './c3pool';

export {
  XMRPoolEU,
} from './xmrpool-eu';

export {
  HashVault,
} from './hashvault';

export {
  Hashcity,
} from './hashcity';

export const sharedStyles = StyleSheet.create({
  withUnderline: {
    ...textFieldStyles.fieldStyle,
    marginTop: 6,
  },
});
