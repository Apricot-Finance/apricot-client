import { AppConfig, TokenID } from "./types";
import { AccountMeta, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { LP_SWAP_METAS, LP_TO_TARGET_SWAP, OrcaLpSwapInfo } from "./constants";
import invariant from "tiny-invariant";

// mostly computes addresses
export class Addresses {
    config: AppConfig;
    constructor(config: AppConfig) {
      this.config = config;
    }

    getProgramKey() {
      return this.config.programPubkey;
    }

    getAdminKey() {
      return this.config.adminPubkey;
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

    getLmAptVault(): PublicKey {
      return this.config.lmAptVault;
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
    async getAssetPoolStakeTableKey(mintKeyStr: string) {
      const [basePda] = await this.getBasePda();
      const stakeSeedStr = this.mintKeyStrToStakeTableSeedStr(mintKeyStr);
      return PublicKey.createWithSeed(basePda, stakeSeedStr, this.config.programPubkey);
    }
    getUserInfoKey(walletKey: PublicKey) {
      return PublicKey.createWithSeed(walletKey, "UserInfo", this.config.programPubkey);
    }
    poolIdToSeedStr(pool_id: number) {
      const char1 = String.fromCharCode(pool_id / 16 + "a".charCodeAt(0));
      const char2 = String.fromCharCode(pool_id % 16 + "a".charCodeAt(0));
      return "POOL__" + char1 + char2;
    }
    poolIdToStakeTableSeedStr(pool_id: number) {
      const char1 = String.fromCharCode(pool_id / 16 + "a".charCodeAt(0));
      const char2 = String.fromCharCode(pool_id % 16 + "a".charCodeAt(0));
      return "STAK__" + char1 + char2;
    }

    mintKeyStrToPoolSeedStr(mintKeyStr: string) {
      const poolId = this.config.mintKeyStrToPoolId(mintKeyStr);
      return this.poolIdToSeedStr(poolId);
    }

    mintKeyStrToStakeTableSeedStr(mintKeyStr: string) {
      const poolId = this.config.mintKeyStrToPoolId(mintKeyStr);
      return this.poolIdToStakeTableSeedStr(poolId);
    }

    getLpTargetSwap(tokenId: TokenID) : number {
      return LP_TO_TARGET_SWAP[tokenId]!;
    }

    async getLpDepositKeys(tokenId: TokenID) : Promise<AccountMeta[]> {
      const [ownerKey, _bump] = await this.getBasePda();
      const lpSwapInfo = LP_SWAP_METAS[tokenId]!;
      invariant(lpSwapInfo);
      return await lpSwapInfo.getLpDepositKeys(ownerKey);
    }

    async getLpWithdrawKeys(tokenId: TokenID) : Promise<AccountMeta[]> {
      const [ownerKey, _bump] = await this.getBasePda();
      const lpSwapInfo = LP_SWAP_METAS[tokenId]!;
      invariant(lpSwapInfo);
      return await lpSwapInfo.getLpWithdrawKeys(ownerKey);
    }

    async getLpStakeKeys(tokenId: TokenID) : Promise<AccountMeta[]> {
      const [ownerKey, _bump] = await this.getBasePda();
      const lpSwapInfo = LP_SWAP_METAS[tokenId]!;
      invariant(lpSwapInfo);
      const keys = await lpSwapInfo.getLpStakeKeys(ownerKey);
      return keys;
    }

    async getLpFirstStakeKeys(tokenId: TokenID): Promise<AccountMeta[]> {
      const [ownerKey, _bump] = await this.getBasePda();
      const lpSwapInfo = LP_SWAP_METAS[tokenId]! as OrcaLpSwapInfo;
      invariant(lpSwapInfo);
      invariant(lpSwapInfo.isDoubleDipSupported);
      return await lpSwapInfo.getFirstStakeKeys(ownerKey);
    }

    async getLpSecondStakeKeys(tokenId: TokenID): Promise<AccountMeta[]> {
      const [ownerKey, _bump] = await this.getBasePda();
      const lpSwapInfo = LP_SWAP_METAS[tokenId]! as OrcaLpSwapInfo;
      invariant(lpSwapInfo);
      invariant(lpSwapInfo.isDoubleDipSupported);
      return await lpSwapInfo.getSecondStakeKeys(ownerKey);
    }

    async getFloatingLpTokenAccount(tokenId: TokenID) {
      const lpSwapInfo = LP_SWAP_METAS[tokenId] as OrcaLpSwapInfo;
      invariant(lpSwapInfo instanceof OrcaLpSwapInfo);
      const [ownerKey] = await this.getBasePda();
      const { pdaFarmTokenAccount: floatingLpSplKey } = await lpSwapInfo.getPdaKeys(ownerKey);
      return floatingLpSplKey;
    }
}
