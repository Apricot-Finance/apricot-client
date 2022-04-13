import { Connection, PublicKey } from '@solana/web3.js';
import {
  TokenID,
  AppConfig,
  UserInfo,
  AssetPool,
  UserAssetInfo,
  ApiUserAssetInfo,
  ApiBorrowPowerInfo,
  ApiUserInfo,
} from '../types';
import {
  MINTS,
  PUBLIC_CONFIG,
  SAFE_LIMIT,
  FORCE_ASSIST_LIMIT,
  LIQUIDATION_LIMIT,
} from '../constants';
import { ActionWrapper } from '../utils/ActionWrapper';
import { PriceInfo } from '../utils/PriceInfo';
import { Addresses } from '../addresses';
import { Decimal } from 'decimal.js';
import {
  rewindAmount,
  fastForwardAmount,
  nativeAmountToValue,
  nativeAmountToTokenAmount,
} from '../utils/transform';

export function createPortfolioLoader(
  userWalletKey: PublicKey,
  connection: Connection,
  fetchPrice?: (token: TokenID) => Promise<number>,
  config: AppConfig = PUBLIC_CONFIG,
): PortfolioLoader {
  if (fetchPrice === undefined) {
    const priceInfo = new PriceInfo(config);
    fetchPrice = async (tokenId) => {
      if (tokenId === TokenID.MNDE) {
        return await priceInfo.fetchCoinGeckoPrice(tokenId);
      } else {
        return await priceInfo.fetchPrice(tokenId, connection);
      }
    };
  }

  const portfolioLoader = new PortfolioLoader(userWalletKey, connection, config, fetchPrice);
  return portfolioLoader;
}

export class PortfolioLoader {
  userInfoCache: UserInfo | undefined;
  assetPoolsCache: { [key in TokenID]?: AssetPool };
  priceCache: { [key in TokenID]?: number };
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
    this.userInfoCache =
      (await this.actionWrapper.getParsedUserInfo(this.userWalletKey)) ?? undefined;
    if (this.userInfoCache === undefined) {
      throw new Error(`Failed to fetch User Info for ${this.userWalletKey.toString()}`);
    }

    for (const userAssetInfo of this.userInfoCache.user_asset_info) {
      const tokenId = this.config.getTokenIdByPoolId(userAssetInfo.pool_id);
      const mintKey = MINTS[tokenId];
      this.assetPoolsCache[tokenId] =
        (await this.actionWrapper.getParsedAssetPool(mintKey)) ?? undefined;
      this.priceCache[tokenId] = await this.fetchPrice(tokenId);
    }
  }

  async getUserInfo(): Promise<ApiUserInfo | undefined> {
    return {
      userWallet: this.userWalletKey.toString(),
      userAssetInfo: await this.getUserAssetInfoList(),
      borrowPowerInfo: await this.getBorrowPowerInfo(),
    };
  }

  async getUserInfoAddress(): Promise<PublicKey> {
    return await this.addresses.getUserInfoKey(this.userWalletKey);
  }

  async getBorrowPowerInfo(): Promise<ApiBorrowPowerInfo | undefined> {
    if (this.userInfoCache === undefined) {
      return undefined;
    }

    return getBorrowPowerInfo(
      this.userInfoCache,
      this.config,
      (tokenId) => Promise.resolve(this.assetPoolsCache[tokenId]),
      (tokenId) => Promise.resolve(this.priceCache[tokenId]),
    );
  }

  async getUserAssetInfoList(): Promise<ApiUserAssetInfo[]> {
    if (this.userInfoCache === undefined) {
      return [];
    }

    return getUserAssetInfoList(
      this.userInfoCache,
      this.config,
      (tokenId) => Promise.resolve(this.assetPoolsCache[tokenId]),
      (tokenId) => Promise.resolve(this.priceCache[tokenId]),
    );
  }
}

export async function getBorrowPowerInfo(
  userInfoRaw: UserInfo,
  appConfig: AppConfig,
  fetchPool: (tokenId: TokenID) => Promise<AssetPool | undefined>,
  fetchPrice: (tokenId: TokenID) => Promise<number | undefined>,
): Promise<ApiBorrowPowerInfo | undefined> {
  const userAssetInfoList = await getUserAssetInfoList(
    userInfoRaw,
    appConfig,
    fetchPool,
    fetchPrice,
  );
  if (userAssetInfoList === undefined) {
    return undefined;
  }

  if (
    userAssetInfoList.some((uai) => uai.depositValue == undefined || uai.borrowValue === undefined)
  ) {
    return undefined;
  }

  const totalDeposit = userAssetInfoList.reduce(
    (acc, uai) => acc.add(uai.depositValue!),
    Decimal.abs(0),
  );
  const totalCollateral = userAssetInfoList.reduce(
    (acc, uai) => acc.add(uai.ltv.mul(uai.depositValue!)),
    Decimal.abs(0),
  );
  const totalBorrow = userAssetInfoList.reduce(
    (acc, uai) => acc.add(uai.borrowValue!),
    Decimal.abs(0),
  );
  return {
    totalDeposit: totalDeposit,
    totalCollateral: totalCollateral,
    maxBorrowAllowed: SAFE_LIMIT.mul(totalCollateral),
    totalBorrow: totalBorrow,
    collateralRatio: totalCollateral.isZero()
      ? new Decimal(Infinity)
      : totalBorrow.div(totalCollateral),
    safeLimit: SAFE_LIMIT,
    forceAssistLimit: FORCE_ASSIST_LIMIT,
    liquidationLimit: LIQUIDATION_LIMIT,
    assistTriggerLimit:
      userInfoRaw.assist.assist_mode === 0
        ? undefined
        : new Decimal(userInfoRaw.assist.self_deleverage_factor),
    assistTargetLimit:
      userInfoRaw.assist.assist_mode === 0
        ? undefined
        : new Decimal(userInfoRaw.assist.post_deleverage_factor),
  };
}

export async function getUserAssetInfoList(
  userInfoRaw: UserInfo,
  appConfig: AppConfig,
  fetchPool: (tokenId: TokenID) => Promise<AssetPool | undefined>,
  fetchPrice: (tokenId: TokenID) => Promise<number | undefined>,
): Promise<ApiUserAssetInfo[]> {
  const userAssetInfoList = [];
  for (const userAssetInfoRaw of userInfoRaw.user_asset_info) {
    const tokenId = appConfig.getTokenIdByPoolId(userAssetInfoRaw.pool_id);
    const assetPoolRaw = await fetchPool(tokenId);
    const price = await fetchPrice(tokenId);
    if (assetPoolRaw === undefined) {
      continue;
    }
    const apiUserAssetInfo = getUserAssetInfo(tokenId, userAssetInfoRaw, assetPoolRaw, price);
    if (apiUserAssetInfo === undefined) {
      continue;
    }
    userAssetInfoList.push(apiUserAssetInfo);
  }
  return userAssetInfoList;
}

export function getUserAssetInfo(
  tokenId: TokenID,
  userAssetInfoRaw: UserAssetInfo,
  assetPoolRaw: AssetPool | undefined,
  price: number | undefined,
): ApiUserAssetInfo | undefined {
  if (userAssetInfoRaw === undefined || assetPoolRaw === undefined) {
    return undefined;
  }
  return fastForwardUserAssetInfo(tokenId, userAssetInfoRaw, assetPoolRaw, price);
}

export function fastForwardUserAssetInfo(
  tokenId: TokenID,
  userAssetInfoRaw: UserAssetInfo,
  assetPoolRaw: AssetPool,
  price: number | undefined,
): ApiUserAssetInfo {
  const currentDepositAmount = fastForwardPositionAmount(
    userAssetInfoRaw.deposit_amount,
    userAssetInfoRaw.deposit_index,
    assetPoolRaw.deposit_index,
  );
  const currentBorrowAmount = fastForwardPositionAmount(
    userAssetInfoRaw.borrow_amount,
    userAssetInfoRaw.borrow_index,
    assetPoolRaw.borrow_index,
  );
  return {
    tokenId: tokenId,
    useAsCollateral: userAssetInfoRaw.use_as_collateral === 1,
    ltv: assetPoolRaw.ltv,
    depositAmount: nativeAmountToTokenAmount(tokenId, currentDepositAmount),
    depositValue:
      price === undefined ? undefined : nativeAmountToValue(tokenId, currentDepositAmount, price),
    borrowAmount: nativeAmountToTokenAmount(tokenId, currentBorrowAmount),
    borrowValue:
      price === undefined ? undefined : nativeAmountToValue(tokenId, currentBorrowAmount, price),
  };
}

export function fastForwardPositionAmount(
  lastAmount: Decimal,
  lastIndex: Decimal,
  currentIndex: Decimal,
): Decimal {
  return fastForwardAmount(rewindAmount(lastAmount, lastIndex), currentIndex);
}
