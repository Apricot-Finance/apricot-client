import { Connection } from '@solana/web3.js';
import { PUBLIC_CONFIG, ALPHA_CONFIG } from '../constants';
import { PriceInfo } from '../utils/PriceInfo';

export * from './pool';
export * from './portfolio';

export function getConnection(url = 'https://apricot.genesysgo.net/'): Connection {
  return new Connection(url, 'confirmed');
}

export function getPriceInfo(env = 'public'): PriceInfo {
  const config = env === 'public' ? PUBLIC_CONFIG : ALPHA_CONFIG;
  return new PriceInfo(config);
}
