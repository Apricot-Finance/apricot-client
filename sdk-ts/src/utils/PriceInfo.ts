import { Connection } from '@solana/web3.js';
import { AccountLayout, MintLayout, u64 } from '@solana/spl-token';
import * as switchboard from '@switchboard-xyz/switchboard-api';
import invariant from 'tiny-invariant';
import { DECIMAL_MULT, LP_SWAP_METAS, RAYDIUM_LP_METAS } from '../constants';
import { AppConfig, PoolConfig, TokenID } from '../types';
import Decimal from "decimal.js";
import { OpenOrders } from '@project-serum/serum';
import { Dex } from '..';
import axios from 'axios';
import * as rax from 'retry-axios';
import { AMM_INFO_LAYOUT_V4 } from './Layouts';
import { parsePriceData } from '@pythnetwork/client';
rax.attach();

type RaydiumEntry = {
  lp_mint: string,
  lp_price: number,
  token_amount_coin: number,
  token_amount_pc: number,
  token_amount_lp: number,
};

const checkIsValidNumber = (n: number) => invariant(typeof n === 'number' && !isNaN(n), 'Invalid number');

const bufferToHexStr = (buffer: Buffer) => u64.fromBuffer(buffer).toString();
export class PriceInfo {
  cachedRaydiumContent: RaydiumEntry[] | null;
  raydiumCacheTime: number;
  constructor(
    public config: AppConfig,
  ) {
    this.cachedRaydiumContent = null;
    this.raydiumCacheTime = 0;
  }

  async fetchPrice(tokId: TokenID, connection: Connection, isForcePriceByChain = false): Promise<number> {
    if (tokId in this.config.switchboardPriceKeys) {
      return this.fetchViaSwitchboard(tokId, connection);
    }
    else {
      invariant(tokId in this.config.poolConfigs);
      const poolConfig = this.config.poolConfigs[tokId]!;
      invariant(poolConfig.isLp(), "volatile/stable tokens should be priced through switchboard");
      // read directly from raydium endpoint if it's raydium LP

      if (isForcePriceByChain) return await this.computeLpPriceOnChain(tokId, poolConfig, connection);

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

  async fetchViaPyth(tokId: TokenID, connection: Connection): Promise<number> {
    const key = this.config.pythPriceKeys[tokId]!;
    invariant(key, `${tokId} not available through pyth`);
    const accountInfo = await connection.getAccountInfo(key, 'confirmed');
    invariant(accountInfo, `${tokId} PriceData not available through pyth`);
    const parsedData = parsePriceData(accountInfo.data);
    invariant(parsedData.price, `${tokId} returned invalid price from pyth`)
    return parsedData.price;
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
    checkIsValidNumber(price);
    return price;
  }

  async computeLpPriceOnChain(lpTokId: TokenID, poolConfig: PoolConfig, connection: Connection): Promise<number> {
    invariant(poolConfig.isLp());
    invariant(poolConfig.tokenId === lpTokId);
    const lpMint = poolConfig.mint;
    const [leftTokId, rightTokId] = poolConfig.lpLeftRightTokenId!;
    invariant(lpMint);
    invariant(leftTokId);
    invariant(rightTokId);
    invariant(lpTokId in LP_SWAP_METAS);
    const [leftVault, rightVault] = LP_SWAP_METAS[lpTokId]?.getLRVaults()!;

    const accountKeys = [leftVault, rightVault, lpMint];
    if (poolConfig.lpDex === Dex.Raydium) {
      const raydiumPoolMeta = RAYDIUM_LP_METAS[lpTokId]!;
      invariant(raydiumPoolMeta);
      accountKeys.push(raydiumPoolMeta.ammOpenOrdersPubkey, raydiumPoolMeta.ammIdPubkey);
    }

    let leftAmount = new Decimal(0);
    let rightAmount = new Decimal(0);
    let lpAmount = new Decimal(0);

    // console.log(`keys: `, accountKeys.map(k => k.toBase58()));
    console.log(`Is calculating price via getMultipleAccountsInfo ...`);
    const infos = await connection.getMultipleAccountsInfo(accountKeys, 'confirmed');
    infos.forEach((info, i) => {
      invariant(info, `Fetch multiple account info failed at ${i}`);
      if (i <= 1) {
        invariant(info.data.length === AccountLayout.span, 'Invalid token account info data length');
        const account = AccountLayout.decode(info.data);
        if (i === 0) leftAmount = leftAmount.plus(bufferToHexStr(account.amount));
        if (i === 1) rightAmount = rightAmount.plus(bufferToHexStr(account.amount));
      } else if (i === 2) {
        invariant(info.data.length === MintLayout.span, 'Invalid mint account info data length');
        const account = MintLayout.decode(info.data);
        lpAmount = lpAmount.plus(bufferToHexStr(account.supply));
      } else if (poolConfig.lpDex === Dex.Raydium) {
        if (i === 3) {
          const raydiumPoolMeta = RAYDIUM_LP_METAS[lpTokId];
          invariant(raydiumPoolMeta);
          const LAYOUT = OpenOrders.getLayout(raydiumPoolMeta.serumProgramId);
          invariant(info.data.length === LAYOUT.span, 'Invalid raydium open orders account info data length');
          const parsedOpenOrders = LAYOUT.decode(info.data);
          const { baseTokenTotal, quoteTokenTotal } = parsedOpenOrders;
          leftAmount = leftAmount.plus(baseTokenTotal.toString()); // BN
          rightAmount = rightAmount.plus(quoteTokenTotal.toString()); // BN
        } else if (i === 4) {
          invariant(info.data.length === AMM_INFO_LAYOUT_V4.span, 'invalid raydium amm ID account data length');
          const { needTakePnlCoin, needTakePnlPc } = AMM_INFO_LAYOUT_V4.decode(info.data);
          leftAmount = leftAmount.minus(needTakePnlCoin.toString());
          rightAmount = rightAmount.minus(needTakePnlPc.toString());
        } else {
          throw new Error('Invalid multiple accounts info index');
        }
      } else {
        throw new Error('Invalid multiple accounts info index');
      }
      // console.log(`l:r:lp`, leftAmount.toString(), rightAmount.toString(), lpAmount.toString());
    });

    const leftPrice = await this.fetchPrice(leftTokId, connection);
    const rightPrice = await this.fetchPrice(rightTokId, connection);

    const price =  leftAmount.div(DECIMAL_MULT[leftTokId]).mul(leftPrice)
      .plus((rightAmount.div(DECIMAL_MULT[rightTokId]).mul(rightPrice)))
      .div(lpAmount.div(DECIMAL_MULT[lpTokId]));

    const priNum = price.toNumber();
    checkIsValidNumber(priNum);
    return priNum;
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

    const price = (leftPrice * leftBalance + rightPrice * rightBalance) / lpBalance;
    checkIsValidNumber(price);
    return price;
  }

  async fetchLRStats(lpTokId: TokenID, connection: Connection, isValue: boolean): Promise<[number, number]> {
    const poolConfig = this.config.poolConfigs[lpTokId]!;
    invariant(poolConfig.isLp());
    const [leftTokId, rightTokId] = poolConfig.lpLeftRightTokenId!;
    invariant(leftTokId);
    invariant(rightTokId);
    const [leftVault, rightVault] = LP_SWAP_METAS[lpTokId]?.getLRVaults()!;
    let leftBalance = (await connection.getTokenAccountBalance(leftVault)).value.uiAmount!;
    let rightBalance = (await connection.getTokenAccountBalance(rightVault)).value.uiAmount!;
    if (poolConfig.lpDex === Dex.Raydium) {
      const [additionalLeftNative, additionalRightNative] = await this.getRaydiumAdditionalBalance(lpTokId, connection);
      const additionalLeftBalance = additionalLeftNative / DECIMAL_MULT[leftTokId];
      const additionalRightBalance = additionalRightNative / DECIMAL_MULT[rightTokId];
      leftBalance += additionalLeftBalance;
      rightBalance += additionalRightBalance;
    }
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

  async fetchRaydiumPrice(tokenId: TokenID, timeout = 3000, retries = 3): Promise<number> {
    try {
      const response = await axios.get("https://api.raydium.io/coin/price", {
        timeout: timeout,
        raxConfig: {
          retry: retries,
          noResponseRetries: retries,
          backoffType: 'exponential',
          statusCodesToRetry: [[100, 199], [400, 429], [500, 599]],
          onRetryAttempt: err => {
            const cfg = rax.getConfig(err);
            console.log(`Raydium price request retry attempt #${cfg?.currentRetryAttempt}`);
          }
        }
      });

      if (tokenId in response.data) {
        return response.data[tokenId];
      }
      throw new Error(`${tokenId} Price is not available at Raydium`);
    }
    catch (error) {
      if (axios.isAxiosError(error))  {
        console.log(`Request raydium price failed: ${error.message}`);
      } else {
        console.log(error);
      }
      throw error;
    }
  }
}
