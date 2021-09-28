import { AppConfig, TokenID } from "./types";
import { AccountMeta, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { LP_SWAP_INFO, LP_TO_TARGET_SWAP } from "./constants";

// mostly computes addresses
export class Addresses {
    config: AppConfig;
    constructor(config: AppConfig) {
      this.config = config;
    }

    getProgramKey() {
      return this.config.programPubkey;
    }

    mintKeyStrToPoolId(mintKeyStr: string) : number {
      return this.config.mintKeyStrToPoolId(mintKeyStr);
    }

    getBasePda() {
      return PublicKey.findProgramAddress([Buffer.from("2")], this.config.programPubkey);
    }
    getPricePda() {
      return PublicKey.findProgramAddress([Buffer.from("PRICE")], this.config.programPubkey);
    }
    getPoolListKey(basePda: PublicKey) {
      return PublicKey.createWithSeed(basePda, "PoolList", this.config.programPubkey);
    }
    POOL_SUMMARIES_SEED = "PoolSummaries";
    getPoolSummariesKey() {
      return PublicKey.createWithSeed(this.config.adminPubkey, this.POOL_SUMMARIES_SEED, this.config.programPubkey);
    }

    getPriceSummariesKey(basePda: PublicKey) {
      return PublicKey.createWithSeed(basePda, "PriceSummaries", this.config.programPubkey);
    }
    static USER_STATS_SEED =  "UserPagesStats";
    getUserPagesStatsKey() {
      return PublicKey.createWithSeed(this.config.adminPubkey, Addresses.USER_STATS_SEED, this.config.programPubkey);
    }
    getUsersPageKey(basePda: PublicKey, page_id: number) {
      return PublicKey.createWithSeed(basePda, "UsersPage_"+page_id, this.config.programPubkey);
    }

    getAssetPoolKey(basePda: PublicKey, mintKeyStr: string) {
      const poolSeedStr = this.mintKeyStrToPoolSeedStr(mintKeyStr);
      return PublicKey.createWithSeed(basePda, poolSeedStr, this.config.programPubkey);
    }
    getAssetPriceKey(pricePda: PublicKey, mintKeyStr: string) {
      const poolSeedStr = this.mintKeyStrToPoolSeedStr(mintKeyStr);
      return PublicKey.createWithSeed(pricePda, poolSeedStr, this.config.programPubkey);
    }
    getAssetPoolSplKey(basePda:PublicKey, mintKeyStr: string) {
      const poolSeedStr = this.mintKeyStrToPoolSeedStr(mintKeyStr);
      return PublicKey.createWithSeed(basePda, poolSeedStr, TOKEN_PROGRAM_ID);
    }
    getUserInfoKey(walletKey: PublicKey) {
      return PublicKey.createWithSeed(walletKey, "UserInfo", this.config.programPubkey);
    }
    poolIdToSeedStr(pool_id: number) {
      const char1 = String.fromCharCode(pool_id / 16 + "a".charCodeAt(0));
      const char2 = String.fromCharCode(pool_id % 16 + "a".charCodeAt(0));
      return "POOL__" + char1 + char2;
    }

    mintKeyStrToPoolSeedStr(mintKeyStr: string) {
      const poolId = this.config.mintKeyStrToPoolId(mintKeyStr);
      return this.poolIdToSeedStr(poolId);
    }

    getLpTargetSwap(tokenId: TokenID) : number {
      return LP_TO_TARGET_SWAP[tokenId]!;
    }

    async getLpDepositKeys(tokenId: TokenID) : Promise<AccountMeta[]> {
      const [ownerKey, _bump] = await this.getBasePda();
      const lpSwapInfo = LP_SWAP_INFO[tokenId]!;
      return await lpSwapInfo.getLpDepositKeys(ownerKey);
    }

    async getLpWithdrawKeys(tokenId: TokenID) : Promise<AccountMeta[]> {
      const [ownerKey, _bump] = await this.getBasePda();
      const lpSwapInfo = LP_SWAP_INFO[tokenId]!;
      return await lpSwapInfo.getLpWithdrawKeys(ownerKey);
    }

    async getLpStakeKeys(tokenId: TokenID) : Promise<AccountMeta[]> {
      const [ownerKey, _bump] = await this.getBasePda();
      const lpSwapInfo = LP_SWAP_INFO[tokenId]!;
      return await lpSwapInfo.getLpStakeKeys(ownerKey);
    }
}