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
  nativeRateToTokenRate,
  nativeRateToValueRate,
  tokenRateToNativeRate,
  currentPerPastRateToCurrentPerCurrentRate,
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
  const depositAptRewardNativeRate = currentPerPastRateToCurrentPerCurrentRate(
    assetPoolRaw.reward_per_year_per_d,
    assetPoolRaw.deposit_index,
  );
  const borrowAptRewardNativeRate = currentPerPastRateToCurrentPerCurrentRate(
    assetPoolRaw.reward_per_year_per_b,
    assetPoolRaw.borrow_index,
  );
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

  const normalizedPool = {
    tokenName: assetPoolRaw.coin_name,
    mintKey: mintKey,
    poolKey: await addresses.getAssetPoolKey(base_pda, mintKey.toString()),
    allowBorrow: flagsToBool(assetPoolRaw.flags, PoolFlag.AllowBorrow),
    isLp: flagsToBool(assetPoolRaw.flags, PoolFlag.IsLp),
    isStable: flagsToBool(assetPoolRaw.flags, PoolFlag.IsStable),
    depositAmount: nativeAmountToTokenAmount(tokenId, assetPoolRaw.deposit_amount),
    depositValue:
      tokenPrice === undefined
        ? undefined
        : nativeAmountToValue(tokenId, assetPoolRaw.deposit_amount, tokenPrice),
    depositRate: assetPoolRaw.deposit_rate,
    borrowAmount: nativeAmountToTokenAmount(tokenId, assetPoolRaw.borrow_amount),
    borrowValue:
      tokenPrice === undefined
        ? undefined
        : nativeAmountToValue(tokenId, assetPoolRaw.borrow_amount, tokenPrice),
    borrowRate: assetPoolRaw.borrow_rate,
    farmYieldRate: assetPoolRaw.farm_yield,
    lastPoolUpdate: epochToDate(assetPoolRaw.last_update_time),
    lastPriceUpdate: lastPriceUpdate,
  };

  const totalAptRewardPerYear = nativeAmountToTokenAmount(TokenID.APT, assetPoolRaw.reward_per_year);
  const lmRewardInfo = {
    tokenName: TokenID.APT as string,
    tokenMint: MINTS[TokenID.APT],
    tokenPerDay:,
    tokenPerYear: nativeAmountToTokenAmount(TokenID.APT, totalAptRewardPerYearNative)
  };

  /*
    tokenName: string;
  tokenMint: PublicKey;
  tokenPerDay: Decimal;
  tokenPerWeek: Decimal;
  tokenPerMonth: Decimal;
  tokenPerYear: Decimal;
  tokenPerYearForDeposit: Decimal;
  tokenPerYearForBorrow: Decimal;
  aprForDeposit?: Decimal;
  aprForBorrow?: Decimal;
   */
  return normalizedPool;
  //  {

  //   liquidityMiningReward:,
  //   dualIncentiveReward: dualRewardConfig === undefined ? undefined :,
  //   dualRewardTokenName: dualRewardConfig === undefined ? undefined : dualRewardConfig.tokenId,
  //   dualRewardMint: dualRewardConfig === undefined ? undefined : MINTS[dualRewardConfig.tokenId],
  //   depositAptRewardTokenRate: nativeRateToTokenRate(
  //     depositAptRewardNativeRate,
  //     TokenID.APT,
  //     tokenId,
  //   ),
  //   depositAptRewardRate:
  //     aptPrice === undefined || tokenPrice === undefined
  //       ? undefined
  //       : nativeRateToValueRate(
  //           depositAptRewardNativeRate,
  //           TokenID.APT,
  //           tokenId,
  //           aptPrice,
  //           tokenPrice,
  //         ),
  //   depositDualRewardTokenRate:
  //     dualRewardConfig === undefined || multiplierNative === undefined
  //       ? undefined
  //       : nativeRateToTokenRate(
  //           depositAptRewardNativeRate.mul(multiplierNative),
  //           dualRewardConfig.tokenId,
  //           tokenId,
  //         ),
  //   depositDualRewardRate:
  //     dualRewardConfig === undefined ||
  //     multiplierNative === undefined ||
  //     dualRewardTokenPrice === undefined ||
  //     tokenPrice === undefined
  //       ? undefined
  //       : nativeRateToValueRate(
  //           depositAptRewardNativeRate.mul(multiplierNative),
  //           dualRewardConfig.tokenId,
  //           tokenId,
  //           dualRewardTokenPrice,
  //           tokenPrice,
  //         ),
  //   borrowAptRewardTokenRate: nativeRateToTokenRate(
  //     borrowAptRewardNativeRate,
  //     TokenID.APT,
  //     tokenId,
  //   ),
  //   borrowAptRewardRate:
  //     aptPrice === undefined || tokenPrice === undefined
  //       ? undefined
  //       : nativeRateToValueRate(
  //           borrowAptRewardNativeRate,
  //           TokenID.APT,
  //           tokenId,
  //           aptPrice,
  //           tokenPrice,
  //         ),
  //   borrowDualRewardTokenRate:
  //     dualRewardConfig === undefined || multiplierNative === undefined
  //       ? undefined
  //       : nativeRateToTokenRate(
  //           borrowAptRewardNativeRate.mul(multiplierNative),
  //           dualRewardConfig.tokenId,
  //           tokenId,
  //         ),
  //   borrowDualRewardRate:
  //     dualRewardConfig === undefined ||
  //     multiplierNative === undefined ||
  //     dualRewardTokenPrice === undefined ||
  //     tokenPrice === undefined
  //       ? undefined
  //       : nativeRateToValueRate(
  //           borrowAptRewardNativeRate.mul(multiplierNative),
  //           dualRewardConfig.tokenId,
  //           tokenId,
  //           dualRewardTokenPrice,
  //           tokenPrice,
  //         ),
  // };


}

function getRewardInfo(
  rewardTokenId: TokenID,
  nativeAmtPerYear: Decimal,
  nativeAmtPerYearForDeposit: Decimal,
  nativeAmtPerYearForBorrow: Decimal,
  
): ApiAssetPoolRewardInfo {
  const amtPerYear = nativeAmountToTokenAmount(TokenID.APT, nativeAmtPerYear);
  const amtPerDay = amtPerYear.dividedBy(360);
  const amtPerYearForDeposit = nativeAmountToTokenAmount(TokenID.APT, nativeAmtPerYearForDeposit);
  const amtPerYearForBorrow = nativeAmountToTokenAmount(TokenID.APT, nativeAmtPerYearForBorrow);
  

  return {
    tokenName: rewardTokenId as string,
    tokenMint: MINTS[rewardTokenId],
    amountPerDay: amtPerDay,
    amountPerWeek: amtPerDay.mul(7),
    amountPerMonth: amtPerDay.mul(30),
    amountPerYear: amtPerYear,
    amountPerYearForDeposit: amtPerYearForDeposit,
    amountPerYearForBorrow: amtPerYearForBorrow,
    aprForDeposit?: new Decimal(0),
    aprForBorrow?: new Decimal(0),
  };
}
