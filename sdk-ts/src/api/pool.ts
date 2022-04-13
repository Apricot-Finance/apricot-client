import { Connection, PublicKey } from '@solana/web3.js';
import { TokenID, AssetPool, ApiAssetPool, AppConfig, PoolFlag } from '../types';
import { MINTS, PUBLIC_CONFIG } from '../constants';
import { ActionWrapper } from '../utils/ActionWrapper';
import { PriceInfo } from '../utils/PriceInfo';
import { Addresses } from '../addresses';
import { DUAL_REWARD_CONFIGS } from '../constants/configs';
import {
  flagsToBool,
  nativeAmountToTokenAmount,
  nativeAmountToValue,
  tokenRateToNativeRate,
  epochToDate,
} from '../utils/transform';
import { ApiAssetPoolRewardInfo } from '..';
import Decimal from 'decimal.js';

export async function createAssetPoolLoader(
  connection: Connection,
  fetchPrice?: (token: TokenID) => Promise<number | undefined>,
  config: AppConfig = PUBLIC_CONFIG,
): Promise<AssetPoolLoader> {
  if (fetchPrice === undefined) {
    const priceInfo = new PriceInfo(config);
    fetchPrice = async (tokenId) => {
      try {
        const isDualRewardToken = Object.values(DUAL_REWARD_CONFIGS).some(
          (info) => info.tokenId == tokenId,
        );
        if (isDualRewardToken) {
          console.log(`Fetching coin gecko price for ${tokenId}`);
          return await priceInfo.fetchCoinGeckoPrice(tokenId);
        } else {
          console.log(`Fetching onchain price for ${tokenId}`);
          return await priceInfo.fetchPrice(tokenId, connection);
        }
      } catch (error) {
        console.error(error);
        return undefined;
      }
    };
  }
  const poolLoader = new AssetPoolLoader(connection, config, fetchPrice);
  return poolLoader;
}

export class AssetPoolLoader {
  private readonly actionWrapper: ActionWrapper;
  private readonly addresses: Addresses;

  constructor(
    private readonly connection: Connection,
    private readonly config: AppConfig,
    private fetchPrice: (token: TokenID) => Promise<number | undefined>,
  ) {
    this.actionWrapper = new ActionWrapper(this.connection, this.config);
    this.addresses = new Addresses(this.config);
  }

  async getAssetPool(tokenId: TokenID): Promise<ApiAssetPool | undefined> {
    const mintKey = MINTS[tokenId];
    const assetPoolRaw = await this.actionWrapper.getParsedAssetPool(mintKey);
    if (assetPoolRaw === null) {
      return undefined;
    }

    return normalizePool(tokenId, mintKey, assetPoolRaw, this.addresses, this.fetchPrice);
  }
}

export async function normalizePool(
  tokenId: TokenID,
  mintKey: PublicKey,
  assetPoolRaw: AssetPool,
  addresses: Addresses,
  fetchPrice: (token: TokenID) => Promise<number | undefined>,
): Promise<ApiAssetPool | undefined> {
  const [base_pda, _] = await addresses.getBasePda();
  const tokenPrice = await fetchPrice(tokenId);
  const aptPrice = await fetchPrice(TokenID.APT);
  const dualRewardConfig = DUAL_REWARD_CONFIGS[tokenId];
  const dualRewardTokenPrice = dualRewardConfig
    ? await fetchPrice(dualRewardConfig.tokenId)
    : undefined;
  const multiplierNative = dualRewardConfig
    ? tokenRateToNativeRate(dualRewardConfig.multiplier, dualRewardConfig.tokenId, TokenID.APT)
    : undefined;
  const lastPriceUpdate = new Date();

  let depositValue = undefined;
  let borrowValue = undefined;
  if (tokenPrice !== undefined) {
    depositValue = nativeAmountToValue(tokenId, assetPoolRaw.deposit_amount, tokenPrice);
    borrowValue = nativeAmountToValue(tokenId, assetPoolRaw.borrow_amount, tokenPrice);
  }
  const lmRewardInfo = getRewardInfo(
    TokenID.APT,
    assetPoolRaw.reward_per_year_deposit,
    assetPoolRaw.reward_per_year_borrow,
    aptPrice,
    depositValue,
    borrowValue,
  );

  const normalizedPool: ApiAssetPool = {
    tokenName: assetPoolRaw.coin_name,
    mintKey: mintKey,
    poolKey: await addresses.getAssetPoolKey(base_pda, mintKey.toString()),
    allowBorrow: flagsToBool(assetPoolRaw.flags, PoolFlag.AllowBorrow),
    isLp: flagsToBool(assetPoolRaw.flags, PoolFlag.IsLp),
    isStable: flagsToBool(assetPoolRaw.flags, PoolFlag.IsStable),
    depositAmount: nativeAmountToTokenAmount(tokenId, assetPoolRaw.deposit_amount),
    depositValue: depositValue,
    depositRate: assetPoolRaw.deposit_rate,
    borrowAmount: nativeAmountToTokenAmount(tokenId, assetPoolRaw.borrow_amount),
    borrowValue: borrowValue,
    borrowRate: assetPoolRaw.borrow_rate,
    farmYieldRate: assetPoolRaw.farm_yield,
    lastPoolUpdate: epochToDate(assetPoolRaw.last_update_time),
    lastPriceUpdate: lastPriceUpdate,
    liquidityMiningReward: lmRewardInfo,
  };

  if (dualRewardConfig !== undefined && multiplierNative !== undefined) {
    const dualRewardInfo = getRewardInfo(
      dualRewardConfig.tokenId,
      assetPoolRaw.reward_per_year_deposit.mul(multiplierNative),
      assetPoolRaw.reward_per_year_borrow.mul(multiplierNative),
      dualRewardTokenPrice,
      depositValue,
      borrowValue,
    );
    normalizedPool.dualIncentiveReward = dualRewardInfo;
  }

  return normalizedPool;
}

function getRewardInfo(
  rewardTokenId: TokenID,
  nativeAmtPerYearForDeposit: Decimal,
  nativeAmtPerYearForBorrow: Decimal,
  rewardTokenPrice?: number,
  depositValue?: Decimal,
  borrowValue?: Decimal,
): ApiAssetPoolRewardInfo {
  const nativeAmtPerYear = nativeAmtPerYearForDeposit.add(nativeAmtPerYearForBorrow);
  const amountPerYear = nativeAmountToTokenAmount(rewardTokenId, nativeAmtPerYear);
  const amountPerDay = amountPerYear.dividedBy(360);
  const amountPerYearForDeposit = nativeAmountToTokenAmount(
    rewardTokenId,
    nativeAmtPerYearForDeposit,
  );
  const amountPerYearForBorrow = nativeAmountToTokenAmount(
    rewardTokenId,
    nativeAmtPerYearForBorrow,
  );

  let rewardInfo: ApiAssetPoolRewardInfo = {
    tokenName: rewardTokenId as string,
    tokenMint: MINTS[rewardTokenId],
    amountPerDay: amountPerDay,
    amountPerWeek: amountPerDay.mul(7),
    amountPerMonth: amountPerDay.mul(30),
    amountPerYear: amountPerYear,
    amountPerYearForDeposit: amountPerYearForDeposit,
    amountPerYearForBorrow: amountPerYearForBorrow,
  };

  if (rewardTokenPrice !== undefined && depositValue !== undefined) {
    rewardInfo.aprForDeposit = depositValue.isZero()
      ? new Decimal(0)
      : amountPerYearForDeposit.mul(rewardTokenPrice).div(depositValue);
  }
  if (rewardTokenPrice !== undefined && borrowValue !== undefined) {
    rewardInfo.aprForBorrow = borrowValue.isZero()
      ? new Decimal(0)
      : amountPerYearForBorrow.mul(rewardTokenPrice).div(borrowValue);
  }
  return rewardInfo;
}
