import { Connection, PublicKey } from "@solana/web3.js";
import {
  TokenID,
  AppConfig,
  UserInfo,
  AssetPool,
  UserAssetInfo,
  ApiUserAssetInfo,
  ApiBorrowPowerInfo,
} from "../types";
import {
  MINTS,
  PUBLIC_CONFIG,
  SAFE_LIMIT,
  FORCE_ASSIST_LIMIT,
  LIQUIDATION_LIMIT,
} from "../constants";
import { ActionWrapper } from "../utils/ActionWrapper";
import { PriceInfo } from "../utils/PriceInfo";
import { Addresses } from "../addresses";
import { Decimal } from "decimal.js";
import {
  rewindAmount,
  fastForwardAmount,
  nativeAmountToValue,
  nativeAmountToTokenAmount,
} from "../utils/transform";

export function createPortfolioLoader(
  userWalletKey: PublicKey,
  connection: Connection,
  fetchPrice?: (token: TokenID) => Promise<number>,
  config: AppConfig = PUBLIC_CONFIG,
): PortfolioLoader {
  if (fetchPrice === undefined) {
    const priceInfo = new PriceInfo(config)
    fetchPrice = async (tokenId) => {
      if (tokenId === TokenID.MNDE) {
        return await priceInfo.fetchRaydiumPrice(tokenId);
      } else {
        return await priceInfo.fetchPrice(tokenId, connection);
      }
    }
  }

  let portfolioLoader = new PortfolioLoader(userWalletKey, connection, config, fetchPrice);
  return portfolioLoader;
}

export function fastForwardPositionAmount(
  lastAmount: Decimal,
  lastIndex: Decimal,
  currentIndex: Decimal
) {
  return fastForwardAmount(rewindAmount(lastAmount, lastIndex), currentIndex);
}

export class PortfolioLoader {
  userInfoCache: UserInfo | undefined;
  assetPoolsCache: {[key in TokenID]?: AssetPool};
  priceCache: {[key in TokenID]?: number};
  private readonly actionWrapper: ActionWrapper;
  private readonly addresses: Addresses;

  constructor(
    public readonly userWalletKey: PublicKey,
    private readonly connection: Connection,
    private readonly config: AppConfig,
    private fetchPrice: (token: TokenID) => Promise<number>,
  ) {
    this.actionWrapper = new ActionWrapper(this.connection, this.config);
    this.addresses = new Addresses(this.config);
    this.assetPoolsCache = {};
    this.priceCache = {};
  }

  async refreshPortfolio(): Promise<void> {
    this.userInfoCache = await this.actionWrapper.getParsedUserInfo(this.userWalletKey) ?? undefined;
    if (this.userInfoCache === undefined) {
      throw new Error(`Failed to fetch User Info for ${this.userWalletKey.toString()}`);
    }

    for (const userAssetInfo of this.userInfoCache.user_asset_info) {
      let tokenId = this.config.getTokenIdByPoolId(userAssetInfo.pool_id);
      let mintKey = MINTS[tokenId];
      this.assetPoolsCache[tokenId] = await this.actionWrapper.getParsedAssetPool(mintKey) ?? undefined;
      this.priceCache[tokenId] = await this.fetchPrice(tokenId);
    };
  }

  async getUserInfoAddress(): Promise<PublicKey> {
    return await this.addresses.getUserInfoKey(this.userWalletKey);
  }

  getBorrowPowerInfo(): ApiBorrowPowerInfo | undefined {
    let userAssetInfoList = this.getUserAssetInfoList();
    if (userAssetInfoList === undefined) {
      return undefined;
    }

    if (userAssetInfoList.some(uai => uai.depositValue == undefined || uai.borrowValue === undefined)) {
      return undefined;
    }

    let totalDeposit = userAssetInfoList.reduce(
      (acc, uai) => acc.add(uai.depositValue!),
      Decimal.abs(0)
    );
    let totalCollateral = userAssetInfoList.reduce(
      (acc, uai) => acc.add(uai.ltv.mul(uai.depositValue!)),
      Decimal.abs(0)
    );
    let totalBorrow = userAssetInfoList.reduce(
      (acc, uai) => acc.add(uai.borrowValue!),
      Decimal.abs(0)
    );
    return {
      totalDeposit: totalDeposit,
      totalCollateral: totalCollateral,
      maxBorrowAllowed: SAFE_LIMIT.mul(totalCollateral),
      totalBorrow: totalBorrow,
      collateralRatio: totalCollateral.isZero() ? new Decimal(Infinity): totalBorrow.div(totalCollateral),
      safeLimit: SAFE_LIMIT,
      forceAssistLimit: FORCE_ASSIST_LIMIT,
      liquidationLimit: LIQUIDATION_LIMIT,
      assistTriggerLimit: this.userInfoCache!.assist.assist_mode === 0
        ? undefined
        : new Decimal(this.userInfoCache!.assist.self_deleverage_factor),
      assistTargetLimit:  this.userInfoCache!.assist.assist_mode === 0
      ? undefined
      : new Decimal(this.userInfoCache!.assist.post_deleverage_factor),
    };
  }

  getUserAssetInfo(tokenId: TokenID): ApiUserAssetInfo | undefined {
    let userAssetInfoRaw = this.userInfoCache
      ?.user_asset_info
      .filter(uai => uai.pool_id == this.config.tokenIdToPoolId[tokenId])[0];
    
    let assetPoolRaw = this.assetPoolsCache[tokenId];
    if (userAssetInfoRaw === undefined || assetPoolRaw === undefined) {
      return undefined;
    }

    let price = this.priceCache[tokenId];
    return this.fastForwardUserAssetInfo(userAssetInfoRaw, assetPoolRaw, price);
  }

  getUserAssetInfoList(): ApiUserAssetInfo[] | undefined {
    if (this.userInfoCache === undefined) {
      return undefined;
    }

    let userAssetInfoList = [];
    for (const userAssetInfoRaw of this.userInfoCache?.user_asset_info) {
      let tokenId = this.config.getTokenIdByPoolId(userAssetInfoRaw.pool_id);

      let apiUserAssetInfo = this.getUserAssetInfo(tokenId);
      if (apiUserAssetInfo === undefined) {
        continue;
      }
      userAssetInfoList.push(apiUserAssetInfo);
    }

    return userAssetInfoList;
  }

  private fastForwardUserAssetInfo(
    userAssetInfoRaw: UserAssetInfo,
    assetPoolRaw: AssetPool,
    price: number | undefined,
  ): ApiUserAssetInfo {
    let tokenId = this.config.getTokenIdByPoolId(userAssetInfoRaw.pool_id);
    let currentDepositAmount = fastForwardPositionAmount(
      userAssetInfoRaw.deposit_amount,
      userAssetInfoRaw.deposit_index,
      assetPoolRaw.deposit_index,
    );
    let currentBorrowAmount = fastForwardPositionAmount(
      userAssetInfoRaw.borrow_amount,
      userAssetInfoRaw.borrow_index,
      assetPoolRaw.borrow_index,
    );
    return {
      tokenId: tokenId,
      useAsCollateral: userAssetInfoRaw.use_as_collateral === 1,
      ltv: assetPoolRaw.ltv,
      depositAmount: nativeAmountToTokenAmount(tokenId, currentDepositAmount),
      depositValue: price === undefined
        ? undefined
        : nativeAmountToValue(tokenId, currentDepositAmount, price),
      borrowAmount: nativeAmountToTokenAmount(tokenId,currentBorrowAmount),
      borrowValue: price === undefined
        ? undefined
        : nativeAmountToValue(tokenId, currentBorrowAmount, price),
    }
  }
}
