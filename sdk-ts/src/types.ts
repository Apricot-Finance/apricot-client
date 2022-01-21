import { Decimal } from "decimal.js";
import { AccountMeta, PublicKey } from "@solana/web3.js";
import invariant from "tiny-invariant";
import { InterestRate } from "./constants";

export enum TokenID {
  APT = "APT",
  BTC = "BTC",
  ETH = "ETH",
  USDT = "USDT",
  USDC = "USDC",
  UST = "UST",
  SOL = "SOL",
  SBR = "SBR",
  ORCA = "ORCA",
  RAY = "RAY",
  MERC = "MERC",
  MNDE = "MNDE",
  mSOL = "mSOL",
  USTv2 = "USTv2",
  FTT = "FTT",
  SRM = "SRM",
  stSOL = "stSOL",
  whETH = "whETH",
  USDT_USDC_SABER = "USDT_USDC_SABER",
  USTv2_USDC_SABER = "USTv2_USDC_SABER",
  UST_USDC_SABER = "UST_USDC_SABER",
  SOL_USDC_RAYDIUM = "SOL_USDC_RAYDIUM",
  RAY_USDC_RAYDIUM = "RAY_USDC_RAYDIUM",
  SOL_USDT_RAYDIUM = "SOL_USDT_RAYDIUM",
  mSOL_SOL_RAYDIUM = "mSOL_SOL_RAYDIUM",
  RAY_USDT_RAYDIUM = "RAY_USDT_RAYDIUM",
  RAY_ETH_RAYDIUM = "RAY_ETH_RAYDIUM",
  RAY_SOL_RAYDIUM = "RAY_SOL_RAYDIUM",
  SRM_USDC_RAYDIUM = "SRM_USDC_RAYDIUM",
  USDC_USDT_ORCA = "USDC_USDT_ORCA",
  SOL_USDC_ORCA = "SOL_USDC_ORCA",
  mSOL_SOL_ORCA = "mSOL_SOL_ORCA",
  ORCA_USDC_ORCA = "ORCA_USDC_ORCA",
  ORCA_SOL_ORCA = "ORCA_SOL_ORCA",
  ETH_USDC_ORCA = "ETH_USDC_ORCA",
  SOL_USDT_ORCA = "SOL_USDT_ORCA",
  ETH_SOL_ORCA = "ETH_SOL_ORCA",
  BTC_mSOL_ORCA = "BTC_mSOL_ORCA",
  mSOL_USDC_ORCA = "mSOL_USDC_ORCA",
  APT_USDC_ORCA = "APT_USDC_ORCA",
}

export type PoolId = number;

export enum TokenCategory {
  Volatile = "volatile",
  Stable = "stable",
  Lp = "lp",
}

export enum PoolFlag {
  AllowBorrow = 1,
  IsLp = 2,
  IsStable = 4,
}

export interface LpSwapKeyInfo {
  getLpDepositKeys : (ownerKey: PublicKey) => Promise<AccountMeta[]>;
  getLpWithdrawKeys : (ownerKey: PublicKey) => Promise<AccountMeta[]>;
  getLpStakeKeys : (ownerKey: PublicKey) => Promise<AccountMeta[]>;
  getLRVaults: () => [PublicKey, PublicKey];
}

export enum Dex {
  Serum, Raydium, Saber, Mercurial, Orca
}

export class PoolConfig {
  constructor(
    public tokenId: TokenID,
    public poolId: PoolId,
    public ltv: number,
    public mint: PublicKey,
    public liquidationDiscount: number,
    public tokenCategory: TokenCategory,
    public lpLeftRightTokenId: [TokenID, TokenID] | null,
    public lpLeftRightPoolId: [PoolId, PoolId] | null,
    public lpDex: Dex | null,
    public lpTargetSwap: number | null,
    public lpSwapKeyInfo: LpSwapKeyInfo | null,
    public lpNeedSndStake: boolean | null,
    public interestRate: InterestRate | null,
    public reserveRatio: number,
  ) {
    invariant(tokenId);
    invariant(poolId >= 0);
    invariant(ltv >= 0);
    invariant(mint);
    invariant(liquidationDiscount >= 0);
    invariant(reserveRatio>=0);
    invariant(reserveRatio <= 0.2);
    if(tokenCategory === TokenCategory.Lp) {
      invariant( lpLeftRightTokenId !== null && lpLeftRightTokenId !== undefined);
      invariant( lpLeftRightPoolId !== null && lpLeftRightPoolId !== undefined);
      invariant( lpDex !== null && lpDex !== undefined);
      invariant( lpTargetSwap !== null && lpTargetSwap !== undefined);
      const [lTokId, rTokId] = lpLeftRightTokenId;
      const [lPoolId, rPoolId] = lpLeftRightPoolId;
      invariant(lTokId, `${tokenId} missing lTokId`);
      invariant(rTokId, `${tokenId} missing rTokId`);
      invariant(lPoolId >= 0, `${tokenId} missing lPoolId`);
      invariant(rPoolId >= 0, `${tokenId} missing rPoolId`);
      invariant(lpSwapKeyInfo, `${tokenId} is missing lpSwapKeyInfo`);
      invariant(lpNeedSndStake === true || lpNeedSndStake === false, `${tokenId} missing lpNeedSndStake`);
    }
    else {
      invariant(interestRate);
    }
  }

  isStable() { return this.tokenCategory === TokenCategory.Stable; }
  isLp() { return this.tokenCategory === TokenCategory.Lp; }
  isVolatile() { return this.tokenCategory === TokenCategory.Volatile; }
}

function getLpLRPoolIds(
  tokId: TokenID,
  lpToLR: { [key in TokenID]?: [TokenID, TokenID] | undefined },
  tokenIdToPoolId: { [key in TokenID]?: PoolId | undefined; },
): [PoolId, PoolId] {
  const [leftTokId, rightTokId] = lpToLR[tokId]!;
  return [tokenIdToPoolId[leftTokId]!, tokenIdToPoolId[rightTokId]!];
}

export class AppConfig {
  poolConfigs: {[key in TokenID]? : PoolConfig};
  constructor(
    public programPubkey: PublicKey,
    public adminPubkey: PublicKey,
    public farmerPubkey: PublicKey,
    public assistKey: PublicKey,
    public refresherKey: PublicKey,
    public retroAptVault: PublicKey,
    public lmAptVault: PublicKey,
    // maps from TokenID to mint/decimalMult/poolId/ltv
    public mints: { [key in TokenID]: PublicKey; },
    public decimalMults: { [key in TokenID]: number; },
    public categories: {[key in TokenID]: TokenCategory},

    public tokenIdToPoolId: { [key in TokenID]?: PoolId | undefined },
    public discounts: {[key in TokenID]?: number | undefined },
    public ltvs: {[key in TokenID]?: number | undefined },
    public lpToLR: { [key in TokenID]?: [TokenID, TokenID] | undefined },
    public lpToDex: { [key in TokenID]?: Dex | undefined },
    public lpToTargetSwap: { [key in TokenID]?: number | undefined },
    public lpToNeedSndStake: { [key in TokenID]?: boolean },
    public switchboardPriceKeys: { [key in TokenID]?: PublicKey; },
    public interestRates: { [key in TokenID]?: InterestRate; },
    public fees: { [key in TokenID]?: number },
    public lpSwapInfo: { [key in TokenID]?: LpSwapKeyInfo },
    public firebaseConfig: object,
  ) {
    this.mints = mints;
    this.tokenIdToPoolId = tokenIdToPoolId;
    const poolIds = Object.values(tokenIdToPoolId);
    const idSet = new Set(poolIds);
    invariant(poolIds.length === idSet.size, `poolIds length: ${poolIds.length} != idSet.size: ${idSet.size}`);
    this.poolConfigs = {};
    for (const tokenId in tokenIdToPoolId) {
      const tokId = tokenId as TokenID;
      this.poolConfigs[tokId] = new PoolConfig(
        tokId, 
        tokenIdToPoolId[tokId]!,
        ltvs[tokId]!,
        mints[tokId],
        discounts[tokId]!,
        categories[tokId],
        categories[tokId] === TokenCategory.Lp? lpToLR[tokId]! : null,
        categories[tokId] === TokenCategory.Lp? getLpLRPoolIds(tokId, lpToLR, tokenIdToPoolId) : null,
        categories[tokId] === TokenCategory.Lp? lpToDex[tokId]! : null,
        categories[tokId] === TokenCategory.Lp? lpToTargetSwap[tokId]! : null,
        lpSwapInfo[tokId]!,
        categories[tokId] === TokenCategory.Lp? lpToNeedSndStake[tokId]! : null,
        categories[tokId] === TokenCategory.Lp? null : interestRates[tokId]!,
        fees[tokId]!,
      );
    }
  }
  mintKeyStrToPoolId(mint_key_str: string): number {
    for(const [tokenType, pubkey] of Object.entries(this.mints)) {
      if(pubkey.toString() === mint_key_str) {
        const result = this.tokenIdToPoolId[tokenType as TokenID];
        invariant(result !== undefined);
        return result;
      }
    }
    invariant(false);
  }
  getPoolIdList(): number[] {
    return Object.values(this.tokenIdToPoolId);
  }
  getTokenIdByPoolId(targetPoolId: number): TokenID {
    for(const [tokenId, poolId] of Object.entries(this.tokenIdToPoolId)) {
      if (poolId === targetPoolId)
        return tokenId as TokenID;
    }
    throw new Error(`poolId ${targetPoolId} not valid`);
  }
  getLtvByPoolId(poolId: number) {
    const tokenId = this.getTokenIdByPoolId(poolId);
    return this.ltvs[tokenId];
  }
  getDecimalMultByPoolId(poolId: number) {
    const tokenId = this.getTokenIdByPoolId(poolId);
    return this.decimalMults[tokenId];
  }
  getMintByPoolId(poolId: number) {
    const tokenId = this.getTokenIdByPoolId(poolId);
    return this.mints[tokenId];
  }
  getPoolConfigList(): PoolConfig[] {
    return Object.values(this.poolConfigs);
  }
  getPoolConfigByPoolId(poolId: number): PoolConfig {
    const tokenId = this.getTokenIdByPoolId(poolId);
    return this.poolConfigs[tokenId]!;
  }
}

export interface AssetPool {
  coin_name         : string;

  mint_key          : PublicKey;
  mint_decimal_mult : Decimal;
  pool_id           : number;

  deposit_amount    : Decimal;
  deposit_index     : Decimal;

  borrow_amount     : Decimal;
  borrow_index      : Decimal;

  reserve_factor    : Decimal;
  fee_amount        : Decimal;
  fee_withdrawn_amt : Decimal;
  fee_rate          : Decimal;

  last_update_time  : Decimal;

  spl_key           : PublicKey;
  atoken_mint_key   : PublicKey;
  price_key         : PublicKey;
  pyth_price_key    : PublicKey;

  serum_next_cl_id  : Decimal;
  ltv               : Decimal;
  safe_factor       : Decimal;
  flags             : number;

  base_rate         : Decimal;
  multiplier1       : Decimal;
  multiplier2       : Decimal;
  kink              : Decimal;
  borrow_rate       : Decimal;
  deposit_rate      : Decimal;

  reward_multiplier       : Decimal;
  reward_deposit_intra    : Decimal;

  reward_per_year         : Decimal;
  reward_per_year_deposit : Decimal;
  reward_per_year_borrow  : Decimal;
  reward_per_year_per_d   : Decimal;
  reward_per_year_per_b   : Decimal;

  reward_deposit_index    : Decimal;
  reward_borrow_index     : Decimal;

  deposit_cap       : Decimal;
  is_disabled       : boolean;
  farm_yield        : Decimal;
}

export interface AssetPrice {
  price_in_usd: Decimal;
}

export interface UserInfo {
  page_id         : number;
  num_assets      : number;
  user_asset_info : UserAssetInfo[];
  reward          : unknown;
  cap             : unknown;
  assist          : Assist;
}

export interface JsonUserInfo {
  page_id         : number;
  num_assets      : number;
  user_asset_info : JsonUserAssetInfo[];
  reward          : unknown;
  cap             : unknown;
  assist          : Assist;
}

export interface UserAssetInfo {
  pool_id               : number;
  use_as_collateral     : number;

  deposit_amount        : Decimal;
  deposit_interests     : Decimal;
  deposit_index         : Decimal;
  reward_deposit_amount : Decimal;
  reward_deposit_index  : Decimal;

  borrow_amount         : Decimal;
  borrow_interests      : Decimal;
  borrow_index          : Decimal;
  reward_borrow_amount  : Decimal;
  reward_borrow_index   : Decimal;
}

export interface JsonUserAssetInfo {
  pool_id               : number;
  use_as_collateral     : number;

  deposit_amount        : number;
  deposit_interests     : number;
  deposit_index         : number;
  reward_deposit_amount : number;
  reward_deposit_index  : number;

  borrow_amount         : number;
  borrow_interests      : number;
  borrow_index          : number;
  reward_borrow_amount  : number;
  reward_borrow_index   : number;
}

export interface Assist {
  assist_mode           : number;
  self_deleverage_factor: number;
  post_deleverage_factor: number;
  sell_sequence         : Uint8Array;
  buy_sequence          : Uint8Array;
  // skip tprice triggered actions
  num_actions           : number;
  num_executed          : number;
  //actions: unknown[];
}

export interface ApiAssetPool {
  tokenName: string;
  mintKey: PublicKey;
  poolKey: PublicKey;
  allowBorrow: boolean,
  isLp: boolean;
  isStable: boolean;
  depositAmount: Decimal;
  depositValue?: Decimal;
  borrowAmount: Decimal;
  borrowValue?: Decimal;
  depositRate: Decimal;
  depositAptRewardTokenRate: Decimal;
  depositAptRewardRate?: Decimal;
  depositMndeRewardTokenRate?: Decimal;
  depositMndeRewardRate?: Decimal;
  borrowRate: Decimal;
  borrowAptRewardTokenRate: Decimal;
  borrowAptRewardRate?: Decimal;
  borrowMndeRewardTokenRate?: Decimal;
  borrowMndeRewardRate?: Decimal;
  farmYieldRate: Decimal;
  lastPoolUpdate: Date;
  lastPriceUpdate?: Date;
}

export interface ApiBorrowPowerInfo {
  totalDeposit: Decimal,
  totalCollateral: Decimal,
  maxBorrowAllowed: Decimal,
  totalBorrow: Decimal,
  collateralRatio: Decimal,
  safeLimit: Decimal,
  forceAssistLimit: Decimal,
  liquidationLimit: Decimal,
  assistTriggerLimit?: Decimal,
  assistTargetLimit?: Decimal,
}

export interface ApiUserAssetInfo {
  tokenId: TokenID,
  useAsCollateral: boolean,
  ltv: Decimal,
  depositAmount: Decimal;
  depositValue?: Decimal;
  borrowAmount: Decimal;
  borrowValue?: Decimal;
}

export interface AptUserRewardInfo {
  // TODO
}
