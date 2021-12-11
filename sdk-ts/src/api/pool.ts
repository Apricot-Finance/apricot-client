import { Connection } from "@solana/web3.js";
import { TokenID, ApiAssetPool, AppConfig, PoolFlag } from "../types";
import { MINTS, LM_MNDE_MULTIPLIER, PUBLIC_CONFIG } from "../constants";
import { ActionWrapper } from "../utils/ActionWrapper";
import { PriceInfo } from "../utils/PriceInfo";
import { Addresses } from "../addresses";
import {
  flagsToBool,
  nativeAmountToTokenAmount,
  nativeAmountToValue,
  nativeRateToTokenRate,
  nativeRateToValueRate,
  tokenRateToNativeRate,
  currentPerPastRateToCurrentPerCurrentRate,
  epochToDate,
} from "../utils/transform";

export async function createAssetPoolLoader(
  connection: Connection,
  fetchPrice?: (token: TokenID) => Promise<number | undefined>,
  config: AppConfig = PUBLIC_CONFIG,
): Promise<AssetPoolLoader> {
  if (fetchPrice === undefined) {
    const priceInfo = new PriceInfo(config)
    fetchPrice = async (tokenId) => {
      try {
        if (tokenId === TokenID.MNDE) {
          return await priceInfo.fetchRaydiumPrice(tokenId);
        } else {
          return await priceInfo.fetchPrice(tokenId, connection);
        }
      }
      catch (error) {
        console.error(error);
        return undefined;
      }
    }
  }
  let poolLoader = new AssetPoolLoader(connection, config, fetchPrice);
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
    let assetPoolRaw = await this.actionWrapper.getParsedAssetPool(mintKey);
    if (assetPoolRaw === null) {
      return undefined;
    }
    
    const [base_pda, _] = await this.addresses.getBasePda();
    let depositAptRewardNativeRate = currentPerPastRateToCurrentPerCurrentRate(
      assetPoolRaw.reward_per_year_per_d,
      assetPoolRaw.deposit_index,
    );
    let borrowAptRewardNativeRate = currentPerPastRateToCurrentPerCurrentRate(
      assetPoolRaw.reward_per_year_per_b,
      assetPoolRaw.borrow_index,
    );
    let tokenPrice = await this.fetchPrice(tokenId);
    let aptPrice = await this.fetchPrice(TokenID.APT);
    let mndePrice = this.hasMndeReward(tokenId) ? await this.fetchPrice(TokenID.MNDE) : undefined;
    let lastPriceUpdate = new Date();
    let mndeAptMultiplierNative = tokenRateToNativeRate(LM_MNDE_MULTIPLIER, TokenID.MNDE, TokenID.APT);

    return {
      tokenName: assetPoolRaw.coin_name,
      mintKey: mintKey,
      poolKey: await this.addresses.getAssetPoolKey(base_pda, mintKey.toString()),
      allowBorrow: flagsToBool(assetPoolRaw.flags, PoolFlag.AllowBorrow),
      isLp: flagsToBool(assetPoolRaw.flags, PoolFlag.IsLp),
      isStable: flagsToBool(assetPoolRaw.flags, PoolFlag.IsStable),
      depositAmount: nativeAmountToTokenAmount(tokenId, assetPoolRaw.deposit_amount),
      depositValue: tokenPrice === undefined
        ? undefined
        : nativeAmountToValue(tokenId, assetPoolRaw.deposit_amount, tokenPrice),
      borrowAmount: nativeAmountToTokenAmount(tokenId, assetPoolRaw.borrow_amount),
      borrowValue: tokenPrice === undefined
        ? undefined
        : nativeAmountToValue(tokenId, assetPoolRaw.borrow_amount, tokenPrice),
      depositRate: assetPoolRaw.deposit_rate,
      depositAptRewardTokenRate: nativeRateToTokenRate(
        depositAptRewardNativeRate,
        TokenID.APT,
        tokenId,
      ),
      depositAptRewardRate: aptPrice === undefined || tokenPrice === undefined
        ? undefined
        : nativeRateToValueRate(
          depositAptRewardNativeRate,
          TokenID.APT,
          tokenId,
          aptPrice,
          tokenPrice,
        ),
      depositMndeRewardTokenRate: this.hasMndeReward(tokenId)
        ? nativeRateToTokenRate(
          depositAptRewardNativeRate.mul(mndeAptMultiplierNative),
          TokenID.MNDE,
          tokenId,
        )
        : undefined,
      depositMndeRewardRate: !this.hasMndeReward(tokenId) || mndePrice === undefined || tokenPrice === undefined
        ? undefined
        : nativeRateToValueRate(
          depositAptRewardNativeRate.mul(mndeAptMultiplierNative),
          TokenID.MNDE,
          tokenId,
          mndePrice,
          tokenPrice,
        ),
      borrowRate: assetPoolRaw.borrow_rate,
      borrowAptRewardTokenRate: nativeRateToTokenRate(
        borrowAptRewardNativeRate.mul(mndeAptMultiplierNative),
        TokenID.APT,
        tokenId,
      ),
      borrowAptRewardRate: aptPrice === undefined || tokenPrice === undefined
        ? undefined
        : nativeRateToValueRate(
          borrowAptRewardNativeRate.mul(mndeAptMultiplierNative),
          TokenID.APT,
          tokenId,
          aptPrice,
          tokenPrice,
        ),
      borrowMndeRewardTokenRate: this.hasMndeReward(tokenId)
        ? nativeRateToTokenRate(
          borrowAptRewardNativeRate.mul(mndeAptMultiplierNative),
          TokenID.MNDE,
          tokenId,
        )
        : undefined,
      borrowMndeRewardRate: !this.hasMndeReward(tokenId) || mndePrice === undefined || tokenPrice === undefined
        ? undefined
        : nativeRateToValueRate(
          borrowAptRewardNativeRate.mul(mndeAptMultiplierNative),
          TokenID.MNDE,
          tokenId,
          mndePrice,
          tokenPrice,
        ),
      farmYieldRate: assetPoolRaw.farm_yield,
      lastPoolUpdate: epochToDate(assetPoolRaw.last_update_time),
      lastPriceUpdate: lastPriceUpdate
    };
  }

  private hasMndeReward(tokenId: TokenID) {
    return tokenId === TokenID.mSOL;
  }
}
