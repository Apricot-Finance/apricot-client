import { AppConfig } from "./types";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

// mostly computes addresses
export class Addresses {
    config: AppConfig;
    constructor(config: AppConfig) {
      this.config = config;
    }

    get_base_pda() {
      return PublicKey.findProgramAddress([Buffer.from("2")], this.config.programPubkey);
    }
    get_price_pda() {
      return PublicKey.findProgramAddress([Buffer.from("PRICE")], this.config.programPubkey);
    }
    get_pool_list_key(base_pda: PublicKey) {
      return PublicKey.createWithSeed(base_pda, "PoolList", this.config.programPubkey);
    }
    POOL_SUMMARIES_SEED = "PoolSummaries";
    get_pool_summaries_key() {
      return PublicKey.createWithSeed(this.config.adminPubkey, this.POOL_SUMMARIES_SEED, this.config.programPubkey);
    }

    get_price_summaries_key(base_pda: PublicKey) {
      return PublicKey.createWithSeed(base_pda, "PriceSummaries", this.config.programPubkey);
    }
    static USER_STATS_SEED =  "UserPagesStats";
    get_user_pages_stats_key() {
      return PublicKey.createWithSeed(this.config.adminPubkey, Addresses.USER_STATS_SEED, this.config.programPubkey);
    }
    get_users_page_key(base_pda: PublicKey, page_id: number) {
      return PublicKey.createWithSeed(base_pda, "UsersPage_"+page_id, this.config.programPubkey);
    }

    get_asset_pool_key(base_pda: PublicKey, mint_key_str: string) {
      const pool_seed_str = this.mint_key_str_to_pool_seed_str(mint_key_str);
      return PublicKey.createWithSeed(base_pda, pool_seed_str, this.config.programPubkey);
    }
    get_asset_price_key(price_pda: PublicKey, mint_key_str: string) {
      const pool_seed_str = this.mint_key_str_to_pool_seed_str(mint_key_str);
      return PublicKey.createWithSeed(price_pda, pool_seed_str, this.config.programPubkey);
    }
    get_asset_pool_spl_key(base_pda:PublicKey, mint_key_str: string) {
      const pool_seed_str = this.mint_key_str_to_pool_seed_str(mint_key_str);
      return PublicKey.createWithSeed(base_pda, pool_seed_str, TOKEN_PROGRAM_ID);
    }
    get_user_info_key(wallet_key: PublicKey) {
      return PublicKey.createWithSeed(wallet_key, "UserInfo", this.config.programPubkey);
    }
    get_price_key(price_pda: PublicKey, mint_key_str: string) {
      return this.get_asset_price_key(price_pda, mint_key_str);
    }
    pool_id_to_seed_str(pool_id: number) {
      const char1 = String.fromCharCode(pool_id / 16 + "a".charCodeAt(0));
      const char2 = String.fromCharCode(pool_id % 16 + "a".charCodeAt(0));
      return "POOL__" + char1 + char2;
    }

    mint_key_str_to_pool_seed_str(mint_key_str: string) {
      const poolId = this.config.mintKeyStrToPoolId(mint_key_str);
      return this.pool_id_to_seed_str(poolId);
    }
}