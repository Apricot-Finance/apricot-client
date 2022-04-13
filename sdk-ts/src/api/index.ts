import { PUBLIC_CONFIG, ALPHA_CONFIG } from '../constants';
import { PriceInfo } from '../utils/PriceInfo';

export * from './pool';
export * from './portfolio';

export function getPriceInfo(env = 'public'): PriceInfo {
  const config = env === 'public' ? PUBLIC_CONFIG : ALPHA_CONFIG;
  return new PriceInfo(config);
}
