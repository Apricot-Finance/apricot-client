import { Connection } from '@solana/web3.js';
import * as switchboard from '@switchboard-xyz/switchboard-api';
import invariant from 'tiny-invariant';
import { DECIMAL_MULT, LP_SWAP_METAS, RAYDIUM_LP_METAS } from '../constants';
import { AppConfig, PoolConfig, TokenID } from '../types';
import Decimal from "decimal.js";
import { OpenOrders } from '@project-serum/serum';
import { Dex } from '..';
import axios from 'axios';
import * as rax from 'retry-axios';
rax.attach();

type RaydiumEntry = {
  lp_mint: string,
  lp_price: number,
  token_amount_coin: number,
  token_amount_pc: number,
  token_amount_lp: number,
};

export class PriceInfo {
  cachedRaydiumContent: RaydiumEntry[] | null;
  raydiumCacheTime: number;
  constructor(
    public config: AppConfig,
  ) {
    this.cachedRaydiumContent = null;
    this.raydiumCacheTime = 0;
  }

  async fetchPrice(tokId: TokenID, connection: Connection): Promise<number> {
    if (tokId in this.config.switchboardPriceKeys) {
      return this.fetchViaSwitchboard(tokId, connection);
    }
    else {
      invariant(tokId in this.config.poolConfigs);
      const poolConfig = this.config.poolConfigs[tokId]!;
      invariant(poolConfig.isLp(), "volatile/stable tokens should be priced through switchboard");
      // read directly from raydium endpoint if it's raydium LP
      if (poolConfig.lpDex === Dex.Raydium) {
        return this.getRaydiumLpPrice(poolConfig, connection);
      }
      else {
        return this.computeLpPrice(tokId, poolConfig, connection);
      }
    }
  }

  async fetchViaSwitchboard(tokId: TokenID, connection: Connection): Promise<number> {
    const key = this.config.switchboardPriceKeys[tokId]!;
    invariant(key, `${tokId} not available through switchboard`);
    const data = await switchboard.parseAggregatorAccountData(connection, key);
    let price = data.currentRoundResult?.result;
    if(!price) {
        price = data.lastRoundResult?.result;
    }
    invariant(price);
    return price;
  }

  async checkRaydiumCache(requestTimeout = 8000, retries = 0) {
    const now = Date.now();
    // update cache if cached more than 30s
    if(now - this.raydiumCacheTime > 30 * 1000) {
      try {
        const response = await axios.get("https://api.raydium.io/pairs", {
          timeout: requestTimeout,
          raxConfig: {
            retry: retries,
            noResponseRetries: retries,
            backoffType: 'exponential',
            statusCodesToRetry: [[100, 199], [400, 429], [500, 599]],
            onRetryAttempt: err => {
              const cfg = rax.getConfig(err);
              console.log(`Raydium pairs request retry attempt #${cfg?.currentRetryAttempt}`);
            }
          }
        });
        const content = response.data as RaydiumEntry[];
        this.cachedRaydiumContent = content;
        this.raydiumCacheTime = Date.now();
      } catch (error) {
        if (axios.isAxiosError(error))  {
          console.log(`Request raydium failed: ${error.message}`);
        } else {
          console.log(error);
        }
        throw error;
      }
    }
    invariant(this.cachedRaydiumContent);
    return this.cachedRaydiumContent;
  }

  async getRaydiumLpPrice(poolConfig: PoolConfig, connection: Connection): Promise<number> {
    const [leftTokId, rightTokId] = poolConfig.lpLeftRightTokenId!;
    const leftPrice = await this.fetchPrice(leftTokId, connection);
    const rightPrice = await this.fetchPrice(rightTokId, connection);
    const mintStr = poolConfig.mint.toString();
    const raydiumContent = await this.checkRaydiumCache();
    const filtered = raydiumContent.filter(entry => entry.lp_mint === mintStr);
    const entry = filtered[0];
    const price = (leftPrice * entry.token_amount_coin + rightPrice * entry.token_amount_pc) / entry.token_amount_lp;
    //console.log(`Raydium reported price: ${entry.lp_price}`);
    //console.log(`Our computed price: ${price}`)
    return price;
  }

  async computeLpPrice(lpTokId: TokenID, poolConfig: PoolConfig, connection: Connection): Promise<number> {
    invariant(poolConfig.isLp());
    invariant(poolConfig.tokenId === lpTokId);
    const lpMint = poolConfig.mint;
    const [leftTokId, rightTokId] = poolConfig.lpLeftRightTokenId!;
    invariant(lpMint);
    invariant(leftTokId);
    invariant(rightTokId);
    invariant(lpTokId in LP_SWAP_METAS);
    const [leftVault, rightVault] = LP_SWAP_METAS[lpTokId]?.getLRVaults()!;
    let leftBalance = (await connection.getTokenAccountBalance(leftVault)).value.uiAmount!;
    let rightBalance = (await connection.getTokenAccountBalance(rightVault)).value.uiAmount!;
    const lpMintData = (await connection.getParsedAccountInfo(lpMint)).value?.data as any;
    const lpBalanceStr = lpMintData.parsed?.info.supply;
    const decimalMult = DECIMAL_MULT[lpTokId];
    const lpBalance = new Decimal(lpBalanceStr).div(decimalMult).toNumber();

    // raydium has extra balance floating on serum
    if (poolConfig.lpDex === Dex.Raydium) {
      const [additionalLeftNative, additionalRightNative] = await this.getRaydiumAdditionalBalance(lpTokId, connection);
      const additionalLeftBalance = additionalLeftNative / DECIMAL_MULT[leftTokId];
      const additionalRightBalance = additionalRightNative / DECIMAL_MULT[rightTokId];
      leftBalance += additionalLeftBalance;
      rightBalance += additionalRightBalance;
    }

    const leftPrice = await this.fetchPrice(leftTokId, connection);
    const rightPrice = await this.fetchPrice(rightTokId, connection);

    return (leftPrice * leftBalance + rightPrice * rightBalance) / lpBalance;
  }

  async fetchLRStats(lpTokId: TokenID, connection: Connection, isValue: boolean): Promise<[number, number]> {
    const poolConfig = this.config.poolConfigs[lpTokId]!;
    invariant(poolConfig.isLp());
    const [leftTokId, rightTokId] = poolConfig.lpLeftRightTokenId!;
    invariant(leftTokId);
    invariant(rightTokId);
    const [leftVault, rightVault] = LP_SWAP_METAS[lpTokId]?.getLRVaults()!;
    const leftBalance = (await connection.getTokenAccountBalance(leftVault)).value.uiAmount!;
    const rightBalance = (await connection.getTokenAccountBalance(rightVault)).value.uiAmount!;
    if (!isValue) {
      return [leftBalance, rightBalance];
    }
    const leftPrice = await this.fetchPrice(leftTokId, connection);
    const rightPrice = await this.fetchPrice(rightTokId, connection);
    return [leftBalance * leftPrice, rightBalance * rightPrice];
  }

  async fetchLRAmounts(lpTokId: TokenID, connection: Connection): Promise<[number, number]> {
    return this.fetchLRStats(lpTokId, connection, false);
  }

  async fetchLRValuets(lpTokId: TokenID, connection: Connection): Promise<[number, number]> {
    return this.fetchLRStats(lpTokId, connection, true);
  }

  async fetchLRLpAmounts(lpTokId: TokenID, connection: Connection): Promise<[number, number, number]> {
    const [leftAmt, rightAmt] = await this.fetchLRStats(lpTokId, connection, false);
    const poolConfig = this.config.poolConfigs[lpTokId]!;
    invariant(poolConfig.isLp());
    const lpMint = poolConfig.mint;
    const lpMintData = (await connection.getParsedAccountInfo(lpMint)).value?.data as any;
    const lpBalanceStr = lpMintData.parsed?.info.supply;
    const decimalMult = DECIMAL_MULT[lpTokId];
    const lpBalance = new Decimal(lpBalanceStr).div(decimalMult).toNumber();
    return [leftAmt, rightAmt, lpBalance];
  }

  async getRaydiumAdditionalBalance(lpTokId: TokenID, connection: Connection): Promise<[number, number]> {
    const raydiumPoolMeta = RAYDIUM_LP_METAS[lpTokId]!;
    invariant(raydiumPoolMeta);
    const response = (await connection.getAccountInfo(raydiumPoolMeta.ammOpenOrdersPubkey))!;
    invariant(response, `failed to fetch ammOpenOrders for ${lpTokId}`);
    const responseDataBuffer = Buffer.from(response.data);
    const LAYOUT = OpenOrders.getLayout(raydiumPoolMeta.serumProgramId);
    const parsedOpenOrders = LAYOUT.decode(responseDataBuffer);
    const { baseTokenTotal, quoteTokenTotal } = parsedOpenOrders;
    return [baseTokenTotal, quoteTokenTotal];
  }
}
