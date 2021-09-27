import { Connection, PublicKey } from "@solana/web3.js";
import Decimal from "decimal.js";
import { AMOUNT_MULTIPLIER } from "./constants";
import { AppConfig, AssetPool, UserAssetInfo, UserInfo } from "./types";
import { Addresses } from "./addresses";

export class AccountParser {
  static getOffsets(widths: number[]) {
    const offsets = [];
    const ends = [];
    let offset = 0;
    for (const w of widths) {
      offsets.push(offset);
      offset += w;
      ends.push(offset);
    }
    return [offsets, ends];
  }

  static parseString(buffer: Uint8Array) {
    const decoded = new TextDecoder().decode(buffer);
    const len = decoded.indexOf("\u0000");
    return len === -1 ? decoded : decoded.substr(0, len);
  }

  static parseUint16(buffer: ArrayBufferLike, offset: number) : number {
    const view = new DataView(buffer);
    return view.getUint16(offset, true);
  }

  static parseUint32(buffer: ArrayBufferLike, offset: number) {
    const view = new DataView(buffer);
    return new Decimal(view.getUint32(offset, true));
  }

  static parseInt32(buffer: ArrayBufferLike, offset: number) {
    const view = new DataView(buffer);
    return new Decimal(view.getInt32(offset, true));
  }

  static parseBigUint64(buffer: ArrayBufferLike, offset: number) {
    const view = new DataView(buffer);
    const lower = new Decimal(view.getUint32(offset, true));
    const higher = new Decimal(view.getUint32(offset + 4, true));
    return higher.mul(new Decimal(4294967296)).add(lower);
  }

  static parseFloat64(buffer: ArrayBufferLike, offset: number) : Decimal {
    const view = new DataView(buffer);
    return new Decimal(view.getFloat64(offset, true));
  }

  static setUint8(buffer: ArrayBufferLike, offset: number, value: number) {
    const view = new DataView(buffer);
    view.setUint8(offset, value);
  }

  static setBigUint64(buffer: ArrayBufferLike, offset: number, value: Decimal ) {
    const view = new DataView(buffer);
    const high = value.divToInt(4294967296);
    const low = value.mod(4294967296);
    view.setUint32(offset, low.toNumber(), true);
    view.setUint32(offset + 4, high.toNumber(), true);
  }

  static parseBigInt128(buffer: ArrayBufferLike, offset: number) : Decimal {
    const lower = AccountParser.parseBigUint64(buffer, offset);
    const higher = AccountParser.parseBigUint64(buffer, offset + 8);
    return higher.mul(new Decimal("18446744073709551616")).add(lower);
  }

  static setFloat64(buffer: ArrayBufferLike, offset: number, value: number) {
    const view = new DataView(buffer);
    view.setFloat64(offset, value, true);
  }

  static parsePoolList(poolListData: Uint8Array) {
    const count = new DataView(poolListData.buffer).getUint16(0, true);
    const result = new Array(count);
    for (let i = 0; i < count; i++) {
      const offset = 8 + i * 32;
      const end = offset + 32;
      result[i] = new PublicKey(new Uint8Array(poolListData.slice(offset, end)));
    }
    return result;
  }

  static parseAssetPool(data: Uint8Array) : AssetPool {
    const widths =  [
      32, 
      32, 8, 1, 
      16,  8, 
      16,  8,  
      8, 16, 8, 8, 
      8, 
      32, 32, 32, 32, 
      8, 8, 8, 1,
      8, 8, 8, 8, 8, 8, 
      8, 8,
      8, 8, 8, 8, 8, 
      8, 8,
      8,
    ];
    const [offsets, ends] = AccountParser.getOffsets(widths);
    return {
      coin_name         : AccountParser.parseString(data.slice(offsets[0], ends[0])),

      mint_key          : new PublicKey(data.slice(offsets[1], ends[1])),
      mint_decimal_mult : AccountParser.parseBigUint64(data.buffer, offsets[2]),
      pool_id           : data[offsets[3]],

      deposit_amount    : AccountParser.parseBigInt128(data.buffer, offsets[4]).div(new Decimal(AMOUNT_MULTIPLIER)),
      deposit_index     : AccountParser.parseFloat64  (data.buffer, offsets[5]),

      borrow_amount     : AccountParser.parseBigInt128(data.buffer, offsets[6]).div(new Decimal(AMOUNT_MULTIPLIER)),
      borrow_index      : AccountParser.parseFloat64  (data.buffer, offsets[7]),

      reserve_factor    : AccountParser.parseFloat64(data.buffer, offsets[8]),
      fee_amount        : AccountParser.parseBigInt128(data.buffer, offsets[9]).div(new Decimal(AMOUNT_MULTIPLIER)),
      fee_withdrawn_amt : AccountParser.parseBigUint64(data.buffer, offsets[10]),
      fee_rate          : AccountParser.parseFloat64(data.buffer, offsets[11]),

      last_update_time  : AccountParser.parseBigUint64(data.buffer, offsets[12]),

      spl_key           : new PublicKey(data.slice(offsets[13], ends[13])),
      atoken_mint_key   : new PublicKey(data.slice(offsets[14], ends[14])),
      price_key         : new PublicKey(data.slice(offsets[15], ends[15])),
      pyth_price_key    : new PublicKey(data.slice(offsets[16], ends[16])),

      serum_next_cl_id  : AccountParser.parseBigUint64(data.buffer, offsets[17]),
      ltv               : AccountParser.parseFloat64(data.buffer, offsets[18]),
      safe_factor       : AccountParser.parseFloat64(data.buffer, offsets[19]),
      flags             : data[offsets[20]],

      base_rate         : AccountParser.parseFloat64(data.buffer, offsets[21]),
      multiplier1       : AccountParser.parseFloat64(data.buffer, offsets[22]),
      multiplier2       : AccountParser.parseFloat64(data.buffer, offsets[23]),
      kink              : AccountParser.parseFloat64(data.buffer, offsets[24]),
      borrow_rate       : AccountParser.parseFloat64(data.buffer, offsets[25]),
      deposit_rate      : AccountParser.parseFloat64(data.buffer, offsets[26]),

      reward_multiplier       : AccountParser.parseFloat64(data.buffer, offsets[27]),
      reward_deposit_intra    : AccountParser.parseFloat64(data.buffer, offsets[28]),

      reward_per_year         : AccountParser.parseFloat64(data.buffer, offsets[29]),
      reward_per_year_deposit : AccountParser.parseFloat64(data.buffer, offsets[30]),
      reward_per_year_borrow  : AccountParser.parseFloat64(data.buffer, offsets[31]),
      reward_per_year_per_d   : AccountParser.parseFloat64(data.buffer, offsets[32]),
      reward_per_year_per_b   : AccountParser.parseFloat64(data.buffer, offsets[33]),

      reward_deposit_index    : AccountParser.parseFloat64(data.buffer, offsets[34]),
      reward_borrow_index     : AccountParser.parseFloat64(data.buffer, offsets[35]),

      deposit_cap     : AccountParser.parseBigUint64(data.buffer, offsets[36]),
    };
  }

  static parseAssetPrice(data: Uint8Array) {
    return {
      price_in_usd: AccountParser.parseBigUint64(data.buffer, 0),
    };
  }

  static parsePriceSummaries(data: Uint8Array) {
    const result = [];
    const count = 6;
    for (let i = 0; i < count; i++) {
      const offset = i * 8;
      result[i] = AccountParser.parseBigUint64(data.buffer, offset);
    }
    return result;
  }

  static parseUserPagesStats(data: Uint8Array) {
    const result = [];
    const view = new DataView(data.buffer);
    for (let offset = 0; offset < data.length; offset += 2) {
      result.push(view.getUint16(offset, true));
    }
    return result;
  }

  static parseUsersPage(data: Uint8Array) {
    const result = [];
    const count = data.length / 32;
    for (let i = 0; i < count; i++) {
      const offset = i * 32;
      const end = offset + 32;
      result[i] = new PublicKey(new Uint8Array(data.slice(offset, end)));
    }
    return result;
  }

  static parseUserInfo(data: Uint8Array) : UserInfo {
    // page_id and num_assets
    const widths = [2, 1];
    const [offsets, ends] = AccountParser.getOffsets(widths);
    const page_id = new DataView(data.buffer.slice(offsets[0], ends[0])).getUint16(0, true);
    const num_assets = data[offsets[1]];
    const user_asset_info: UserAssetInfo[] = [];

    // UserAssetInfo
    const uai_base = ends[1];
    const uai_size = 1 + 1 + 16 + 8 + 8 + 8 + 8 + 16 + 8 + 8 + 8 + 8;
    for (let i = 0; i < num_assets; i++) {
      const uai_offset = uai_base + i * uai_size;
      user_asset_info.push(AccountParser.parseUserAssetInfo(data, uai_offset));
    }

    // reward
    const reward_vesting: Decimal[] = [];
    const reward_base = uai_base + uai_size * 16;
    for(let i = 0; i < 8; i++) {
      const r_offset = reward_base + i * 8;
      reward_vesting.push(AccountParser.parseFloat64(data.buffer, r_offset));
    }
    const reward = {
      vesting: reward_vesting,
      available: AccountParser.parseFloat64(data.buffer, reward_base + 8*8),
      withdrawn: AccountParser.parseFloat64(data.buffer, reward_base + 8*9),
    };

    // pad
    const pad_offset = reward_base + 8 * 10;

    // cap
    const cap_offset = pad_offset + 32;
    const cap =AccountParser.parseBigInt128(data.buffer, cap_offset);

    // assist
    const assist_base = cap_offset + 16;
    const assist = AccountParser.parseAssist(data, assist_base);
    return {
      page_id         : page_id,
      num_assets      : num_assets,
      reward          : reward,
      cap             : cap,
      user_asset_info : user_asset_info,
      assist          : assist,
    };
  }

  static parseUserAssetInfo(data: Uint8Array, offset: number): UserAssetInfo {
    const widths = [1, 1, 16, 8, 8, 8, 8, 16, 8, 8, 8, 8];
    const [offsets] = AccountParser.getOffsets(widths);
    return {
      pool_id             : data[offset + offsets[0]],
      use_as_collateral   : data[offset + offsets[1]],

      deposit_amount      : AccountParser.parseBigInt128(data.buffer, offset + offsets[2]).div(new Decimal(AMOUNT_MULTIPLIER)),
      deposit_interests   : AccountParser.parseBigUint64(data.buffer, offset + offsets[3]),
      deposit_index       : AccountParser.parseFloat64(data.buffer, offset + offsets[4]),
      reward_deposit_amount:AccountParser.parseFloat64(data.buffer, offset + offsets[5]),
      reward_deposit_index: AccountParser.parseFloat64(data.buffer, offset + offsets[6]),

      borrow_amount       : AccountParser.parseBigInt128(data.buffer, offset + offsets[7]).div(new Decimal(AMOUNT_MULTIPLIER)),
      borrow_interests    : AccountParser.parseBigUint64(data.buffer, offset + offsets[8]),
      borrow_index        : AccountParser.parseFloat64(data.buffer, offset + offsets[9]),
      reward_borrow_amount: AccountParser.parseFloat64(data.buffer, offset + offsets[10]),
      reward_borrow_index : AccountParser.parseFloat64(data.buffer, offset + offsets[11]),
    };
  }

  static parseAssist(data: Uint8Array, offset: number) {
    const sizePriceTrigAction = (10 + 30) * 8;
    const widths = [1, 8, 8, 8, 8, sizePriceTrigAction, 1, 1];
    const [offsets, ends] = AccountParser.getOffsets(widths);
    return {
      assist_mode           : data[offset + offsets[0]],
      self_deleverage_factor: AccountParser.parseFloat64(data.buffer, offset + offsets[1]).toNumber(),
      post_deleverage_factor: AccountParser.parseFloat64(data.buffer, offset + offsets[2]).toNumber(),
      sell_sequence         : data.slice(offset + offsets[3], offset + ends[3]),
      buy_sequence          : data.slice(offset + offsets[4], offset + ends[4]),
      // skip tprice triggered actions
      num_actions           : data[offset + offsets[6]],
      num_executed          : data[offset + offsets[7]],
    };
  }
}

export class Wrapper {
  addresses: Addresses;
  constructor(
    public connection: Connection,
    public config: AppConfig,
  ) {
    this.addresses = new Addresses(config);
  }

  async getParsedAssetPool(mint: PublicKey) {
    const [base_pda, _] = await this.addresses.get_base_pda();
    const poolAccountKey = await this.addresses.get_asset_pool_key(base_pda, mint.toString()); 
    const response = await this.connection.getAccountInfo(poolAccountKey);
    if(response === null) {
      return null;
    }
    const data = new Uint8Array(response.data);
    return AccountParser.parseAssetPool(data);
  }

  async getParsedAssetPrice(mint: PublicKey) {
    const [price_pda, _] = await this.addresses.get_price_pda();
    const assetPriceKey = await this.addresses.get_asset_price_key(price_pda, mint.toString()); 
    const response = await this.connection.getAccountInfo(assetPriceKey);
    if(response === null){
      return null;
    }
    return AccountParser.parseAssetPrice(new Uint8Array(response.data));
  }

  async getParsedUserInfo(wallet_key: PublicKey) {
    const userInfoKey = await this.addresses.get_user_info_key(wallet_key); 
    const response = await this.connection.getAccountInfo(userInfoKey);
    if(response === null){
      return null;
    }
    return AccountParser.parseUserInfo(new Uint8Array(response.data));
  }


  // administrative methods:
  async getParsedUserPagesStats() {
    const [base_pda, _] = await this.addresses.get_base_pda();
    const statsAccountKey = await this.addresses.get_user_pages_stats_key(); 
    const response = await this.connection.getAccountInfo(statsAccountKey);
    if(response === null){
      return null;
    }
    return AccountParser.parseUserPagesStats(new Uint8Array(response.data));
  }

  async getParsedUsersPage(page_id: number) {
    const [base_pda, _] = await this.addresses.get_base_pda();
    const usersPageKey = await this.addresses.get_users_page_key(base_pda, page_id);
    const response = await this.connection.getAccountInfo(usersPageKey);
    if(response === null){
      return null;
    }
    return AccountParser.parseUsersPage(new Uint8Array(response.data));
  }
}
