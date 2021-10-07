import { Decimal } from "decimal.js";
import { PublicKey } from "@solana/web3.js";
import invariant from "tiny-invariant";

export enum TokenID {
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
  USDT_USDC_SABER = "USDT_USDC_SABER",
  USDC_USDT_ORCA = "USDC_USDT_ORCA",
  UST_USDC_SABER = "UST_USDC_SABER",
  SOL_USDC_RAYDIUM = "SOL_USDC_RAYDIUM"
}

export type PoolId = number;

export enum TokenCategory {
  Volatile = "volatile",
  Stable = "stable",
  Lp = "lp",
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
  ) {
    invariant(tokenId);
    invariant(poolId >= 0);
    invariant(ltv >= 0);
    invariant(mint);
    invariant(liquidationDiscount >= 0);
    if(tokenCategory === TokenCategory.Lp) {
      invariant( lpLeftRightTokenId !== null && lpLeftRightTokenId !== undefined);
      invariant( lpLeftRightPoolId !== null && lpLeftRightPoolId !== undefined);
      invariant( lpDex !== null && lpDex !== undefined);
      invariant( lpTargetSwap !== null && lpTargetSwap !== undefined);
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
    public switchboardPriceKeys: { [key in TokenID]?: PublicKey; },
  ) {
    this.mints = mints;
    this.tokenIdToPoolId = tokenIdToPoolId;
    const poolIds = Object.values(tokenIdToPoolId);
    const idSet = new Set(poolIds);
    invariant(poolIds.length === idSet.size);
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