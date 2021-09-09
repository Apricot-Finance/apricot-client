import * as S from '@solana/web3.js';
import * as T from '@solana/spl-token';
import bigInt from "big-integer"


export const programPubkeyStr = "2XaNvhxnLjym7SY2y55fLVWAtnzRNpSzByVs61y4ANM5";
export const serumPubkeyStr = "9NaBPcFZpHWj6p5sSbLSPEt85j5xev84Bq3HvhTNWq4c";
export const programPubkey = new S.PublicKey(programPubkeyStr);
export const serumPubkey = new S.PublicKey(serumPubkeyStr);

export const mints = {
    fake_btc : "7MtysQGohtvxjV53ffV3BumvNaF7DHMC47QwPsDUE98f",
    fake_eth : "DQ6Vw2iFQ3jWYsT52TtUXkrBQfkuAu2rtCcWZZ5BtktY",
    fake_usdt: "GjJFUSzbjZZMXySmJ8jwYmYcZhosN4PAcBKDTnSpHd3s",
    fake_usdc: "BwNiXVdAYt5g5tGSn6Apadk72SEqzmEd3Tv2W5pgvWFM",
    fake_sol : "4jSAADAjfidWvkpRVBk4Q5LMiZT2UNyw8A3D3oKwBC2u",
    fake_usdt_usdc : "9R9MtiUGKwp3V8atf636X3nJc6KbCsJNGCFJcdPLeTu7",
    fake_ust : "G6V7e333pY2uQC9dN78euNvC9jpAMtsAdLZUddVjCy6d",
    fake_usdt_usdc_orca : "JCUUGC8DKggrCQJANxwFuki2Uu7Ypr4B1G7WXHW1wksu",
    fake_ust_usdc_saber : "HBu1cw7226zSyjkcnmH6P6DoHNLSgcs7XVqY641nrgEv",

};

const mint_key_str_to_pool_id = {};

mint_key_str_to_pool_id[mints.fake_btc] = 0;
mint_key_str_to_pool_id[mints.fake_eth] = 1;
mint_key_str_to_pool_id[mints.fake_usdt] = 2;
mint_key_str_to_pool_id[mints.fake_usdc] = 3;
mint_key_str_to_pool_id[mints.fake_sol] = 4;
mint_key_str_to_pool_id[mints.fake_usdt_usdc] = 5;
mint_key_str_to_pool_id[mints.fake_ust] = 6;
mint_key_str_to_pool_id[mints.fake_usdt_usdc_orca] = 7;
mint_key_str_to_pool_id[mints.fake_ust_usdc_saber] = 8;


export const pool_id_to_decimal_multiplier = {
    0: 1e9,
    1: 1e9,
    2: 1e9,
    3: 1e9,
    4: 1e9,
    5: 1e9,
    6: 1e9,
    7: 1e9,
    8: 1e9,
};

const devAccountKey = new S.PublicKey("7WjocgG2eHXx1P1L3WQtrSYQUPRZALzYxSM8pQ2xPSwU");

export class consts{
    static get_base_pda() {
        return S.PublicKey.findProgramAddress(["2"], programPubkey);
    }
    static get_price_pda() {
        return S.PublicKey.findProgramAddress(["PRICE"], programPubkey);
    }
    static get_pool_list_key(base_pda) {
        return S.PublicKey.createWithSeed(base_pda, "PoolList", programPubkey);
    }
    static POOL_SUMMARIES_SEED = "PoolSummaries";
    static get_pool_summaries_key() {
        return S.PublicKey.createWithSeed(devAccountKey, consts.POOL_SUMMARIES_SEED, programPubkey);
    }
    static get_price_summaries_key(base_pda) {
        return S.PublicKey.createWithSeed(base_pda, "PriceSummaries", programPubkey);
    }
    static get_user_pages_stats_key(base_pda) {
        return S.PublicKey.createWithSeed(base_pda, "UserPagesStats", programPubkey);
    }
    static get_users_page_key(base_pda, page_id) {
        return S.PublicKey.createWithSeed(base_pda, "UsersPage_"+page_id, programPubkey);
    }

    static get_asset_pool_key(base_pda, mint_key_str) {
        const pool_seed_str = consts.mint_key_str_to_pool_seed_str(mint_key_str);
        return S.PublicKey.createWithSeed(base_pda, pool_seed_str, programPubkey);
    }
    static get_asset_price_key(price_pda, mint_key_str) {
        const pool_seed_str = consts.mint_key_str_to_pool_seed_str(mint_key_str);
        return S.PublicKey.createWithSeed(price_pda, pool_seed_str, programPubkey);
    }
    static get_asset_pool_spl_key(base_pda, mint_key_str) {
        const pool_seed_str = consts.mint_key_str_to_pool_seed_str(mint_key_str);
        return S.PublicKey.createWithSeed(base_pda, pool_seed_str, T.TOKEN_PROGRAM_ID);
    }
    static get_user_info_key(wallet_key) {
        return S.PublicKey.createWithSeed(wallet_key, "UserInfo", programPubkey);
    }
    static get_price_key(price_pda, mint_key_str) {
        if(use_pyth) {
            const coin_name = consts.mint_key_str_to_coin_name(mint_key_str);
            return new S.PublicKey(pythPriceKeys[coin_name]);
        }
        else {
            return consts.get_asset_price_key(price_pda, mint_key_str);
        }
    }
    static mint_key_str_to_coin_name(mint_key_str) {
        for(let key in mints) {
            if (mints[key] === mint_key_str)
                return key.substr(5).toUpperCase();
        }
        throw new Error();
    }
    static pool_id_to_seed_str(pool_id) {
        const char1 = String.fromCharCode(pool_id / 16 + 'a'.charCodeAt(0));
        const char2 = String.fromCharCode(pool_id % 16 + 'a'.charCodeAt(0));
        return "POOL__" + char1 + char2;
    }
    static mint_key_str_to_pool_seed_str(mint_key_str) {
        return consts.pool_id_to_seed_str(mint_key_str_to_pool_id[mint_key_str]);
    }
    static async get_serum_market_and_vault_pda() {
        while(true) {
            try{
                // keep trying until the default nonce array creates a pda that falls off the elliptic curve
                let marketAccount = new S.Account();
                const nonceArray = new Uint8Array([0,0,0,0,0,0,0,0]);
                let vaultPda = await S.PublicKey.createProgramAddress(
                    [marketAccount.publicKey.toBuffer(), nonceArray], serumPubkey);
                return [marketAccount, vaultPda];
            }
            catch(e) {
                continue;
            }
        }
    }

    static CMD_REFRESH_USER = 0x0a;

    static CMD_ADD_USER_AND_DEPOSIT = 0x10;
    static CMD_DEPOSIT = 0x11;
    static CMD_WITHDRAW = 0x12;
    static CMD_BORROW = 0x13;
    static CMD_REPAY = 0x14;
    static CMD_EXTERN_LIQUIDATE = 0x15;
    static CMD_SELF_LIQUIDATE = 0x16;
    static CMD_UPDATE_USER_CONFIG = 0x17;
    static CMD_MARGIN_SWAP = 0x18;
    static CMD_UPDATE_USER_ASSET_CONFIG = 0x19;
    static CMD_WITHDRAW_AND_REMOVE_USER = 0x1a;
    static CMD_TOKEN_DEPOSIT = 0x1b;
    static CMD_TOKEN_WITHDRAW = 0x1c;
    static CMD_LP_CREATE = 0x1d;
    static CMD_LP_REDEEM = 0x1e;

    static AMOUNT_MULTIPLIER = 16777216;
    static INVALID_PAGE = 65535;

    // swap identifiers
    static SWAP_FAKE = 0x00;
    static SWAP_SERUM = 0x01;
    static SWAP_RAYDIUM = 0x02;
    static SWAP_SABER = 0x03;
    static SWAP_MERCURIAL = 0x04;
    static SWAP_ORCA = 0x05;

}

export class Errors {
    static exceptionToString(e) {
        const msg = e.message;
        if(msg.indexOf("custom program error") >= 0  && msg.indexOf("0x") >= 0) {
        const lastIdx = msg.lastIndexOf("0x");
        const errCode = msg.substr(lastIdx, 6);
        const code = parseInt(errCode);
        switch(code) {
            // error about accounts supplied
            case 0x1000: return "Internal error, incorrect base_pda account";
            case 0x1001: return "Internal error, incorrect user_pages_stats account";
            case 0x1002: return "Internal error, incorrect users_page account";
            case 0x1003: return "Internal error, incorrect user_info account";
            case 0x1004: return "Internal error, incorrect asset_pool account";
            case 0x1005: return "Internal error, incorrect asset_price account";
            case 0x1006: return "Internal error, incorrect asset_pool_spl account";
            case 0x1007: return "Internal error, incorrect user_asset_info account";
            case 0x1008: return "Internal error, missing active accounts";
            case 0x1009: return "Internal error, incorrect intermediate_spl account";
            case 0x100a: return "Internal error, incorrect collateral_market account";
            case 0x100b: return "Internal error, incorrect borrowed_market account";
            case 0x100c: return "Internal error, incorrect serum_program account";
            
            // error about instruction data
            case 0x2000: return "Internal error, missing page_id";
            case 0x2001: return "Internal error, page_id too large";
            case 0x2002: return "Internal error, missing amount";
            case 0x2003: return "Internal error, missing seed_str";
            case 0x2004: return "Internal error, missing acitve_seed_str";
            case 0x2005: return "Internal error, wrong instruction data size";

            // frontend error
            case 0x3000: return "Internal error, account already added. Should use deposit()";
            case 0x3001: return "Internal error, not enough available slots for chosen users_page";
            case 0x3002: return "Internal error, account not added. Should use add_user_and_deposit()";
            case 0x3002: return "Internal error, wallet did not sign";
            case 0x3002: return "Internal error, maximum number of pools reached";

            // user error
            case 0x4000: return "Trying to deposit an amount amount less than minimum required. Please try depositing more.";
            case 0x4001: return "User cannot withdraw more than their deposit.";
            case 0x4002: return "Pool does not have enough funds for borrowing/withdrawal at the time.";
            case 0x4003: return "Please try withdrawing all remaining amount as after the current withdrawal, amount of deposit left will be less than minimum required";
            case 0x4004: return "User does not have enough borrowing power. Please deposit more assets as collateral.";
            case 0x4005: return "User cannot repay more than what he owes.";
            case 0x4006: return "This withdrawal failed because it will cause user's collateral ratio to fall below requirement.";
            case 0x4007: return "This account cannot be liquidated as it has not reached liquidation threshold yet";
            case 0x4008: return "Liquidator asked for too much collateral";
            case 0x4009: return "Liquidator tried to repay more than what the user owes";
            case 0x400a: return "Liquidator asked for more collateral than the user has";
            case 0x400b: return "Liquidation will lead to a collateral ratio that is too large. Try liquidating less.";
            case 0x400c: return "Self-liquidation threshold is too small"; // FIXME: how small is too small?
            case 0x400d: return "Post self-liquidation target ratio too small"; // FIXME: how small is too small?
            case 0x400e: return "Post external-liquidation target ratio too small"; // FIXME: how small is too small?
            case 0x400f: return "Self-liquidation threshold has not been reached yet"; // FIXME: how small is too small?
            case 0x4010: return "Self-liquidation target exceeded";
            case 0x4011: return "Self-liquidation led to too much slippage";
            case 0x4012: return "Exceeded maximum number of assets supported";
            case 0x4013: return "Bought less than min";
            case 0x4014: return "Asset not used as collateral";
        }
        }
        else if(msg.indexOf("invalid account data") >= 0) {
            return "User does not appear to have created an SPL account for this token.";
        }
        else if(msg.indexOf("found no record of a prior credit") >= 0) {
            return "Cannot proceed as user has no SOL in their main wallet.";
        }
        else {

        // not custom error, not sure what to do with them yet
        return msg;
        }
    }
}

export class Parser {

    static getOffsets(widths) {
        let offsets = [];
        let ends = [];
        let offset = 0;
        for(var i in widths) {
            offsets.push(offset);
            offset += widths[i];
            ends.push(offset);
        }
        return [offsets, ends];
    }

    static parseString(buffer) {
        let decoded = new TextDecoder().decode(buffer);
        let len = decoded.indexOf("\u0000");
        return len == -1? decoded : decoded.substr(0, len);
    }

    static parsePoolList(poolListData) {
        let count = new DataView(poolListData.buffer).getUint16(0, true);
        let result = new Array(count);
        for(let i = 0; i < count; i++) {
            const offset = 8 + i * 32;
            const end = offset + 32;
            result[i] = new S.PublicKey(new Uint8Array(poolListData.slice(offset, end)));
        }
        return result;
    }

    static parseUint16(buffer, offset) {
        let view = new DataView(buffer);
        return view.getUint16(offset, true);
    }

    static parseUint32(buffer, offset) {
        let view = new DataView(buffer);
        return view.getUint32(offset, true);
    }

    static parseInt32(buffer, offset) {
        let view = new DataView(buffer);
        return view.getInt32(offset, true);
    }

    static parseBigUint64(buffer, offset) {
        let view = new DataView(buffer);
        let lower = bigInt(view.getUint32(offset, true));
        let higher = bigInt(view.getUint32(offset+4, true));
        return higher * bigInt(4294967296) + lower;
    }

    static parseFloat64(buffer, offset) {
        let view = new DataView(buffer);
        return view.getFloat64(offset, true);
    }

    static setUint8(buffer, offset, value) {
        let view = new DataView(buffer);
        view.setUint8(offset, value);
    }

    static setBigUint64(buffer, offset, value) {
        value = parseInt(value);
        let view = new DataView(buffer);
        let high = value / 4294967296;
        let low = value % 4294967296;
        view.setUint32(offset, low, true);
        view.setUint32(offset+4, high, true);
    }

    static setFloat64(buffer, offset, value) {
        let view = new DataView(buffer);
        view.setFloat64(offset, value, true);
    }

    static parseBigInt128(buffer, offset) {
        let lower = Parser.parseBigUint64(buffer, offset);
        let higher = Parser.parseBigUint64(buffer, offset+8);
        return higher * bigInt(18446744073709551616) + lower;
    }

    static parseAssetPool(data) {
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
            8, 8, 8, 8, 
            8, 8, 8, 8, 8, 
            8, 8];
        let [offsets, ends] = Parser.getOffsets(widths);
        return {
            coin_name         : Parser.parseString(data.slice(offsets[0], ends[0])),

            mint_key          : new S.PublicKey(data.slice(offsets[1], ends[1])),
            mint_decimal_mult : Parser.parseBigUint64(data.buffer, offsets[2]),
            pool_id           : data[offsets[3]],

            deposit_amount    : Parser.parseBigInt128(data.buffer, offsets[4]) / bigInt(consts.AMOUNT_MULTIPLIER),
            deposit_index     : Parser.parseFloat64  (data.buffer, offsets[5]),

            borrow_amount     : Parser.parseBigInt128(data.buffer, offsets[6]) / bigInt(consts.AMOUNT_MULTIPLIER),
            borrow_index      : Parser.parseFloat64  (data.buffer, offsets[7]),

            reserve_factor    : Parser.parseFloat64(data.buffer, offsets[8]),
            fee_amount        : Parser.parseBigInt128(data.buffer, offsets[9]) / bigInt(consts.AMOUNT_MULTIPLIER),
            fee_withdrawn_amt : Parser.parseBigUint64(data.buffer, offsets[10]),
            fee_rate          : Parser.parseFloat64(data.buffer, offsets[11]),

            last_update_time  : Parser.parseBigUint64(data.buffer, offsets[12]),

            spl_key           : new S.PublicKey(data.slice(offsets[13], ends[13])),
            atoken_mint_key   : new S.PublicKey(data.slice(offsets[14], ends[14])),
            price_key         : new S.PublicKey(data.slice(offsets[15], ends[15])),
            pyth_price_key    : new S.PublicKey(data.slice(offsets[16], ends[16])),

            serum_next_cl_id  : Parser.parseBigUint64(data.buffer, offsets[17]),
            ltv               : Parser.parseFloat64(data.buffer, offsets[18]),
            safe_factor       : Parser.parseFloat64(data.buffer, offsets[19]),
            flags             : data[offsets[20]],

            base_rate         : Parser.parseFloat64(data.buffer, offsets[21]),
            multiplier1       : Parser.parseFloat64(data.buffer, offsets[22]),
            multiplier2       : Parser.parseFloat64(data.buffer, offsets[23]),
            kink              : Parser.parseFloat64(data.buffer, offsets[24]),
            borrow_rate       : Parser.parseFloat64(data.buffer, offsets[25]),
            deposit_rate      : Parser.parseFloat64(data.buffer, offsets[26]),

            reward_multiplier       : Parser.parseFloat64(data.buffer, offsets[27]),
            reward_deposit_intra    : Parser.parseFloat64(data.buffer, offsets[28]),
            reward_deposit_share    : Parser.parseFloat64(data.buffer, offsets[29]),
            reward_borrow_share     : Parser.parseFloat64(data.buffer, offsets[30]),

            reward_per_year         : Parser.parseFloat64(data.buffer, offsets[31]),
            reward_per_year_deposit : Parser.parseFloat64(data.buffer, offsets[32]),
            reward_per_year_borrow  : Parser.parseFloat64(data.buffer, offsets[33]),
            reward_per_year_per_d   : Parser.parseFloat64(data.buffer, offsets[34]),
            reward_per_year_per_b   : Parser.parseFloat64(data.buffer, offsets[35]),

            reward_deposit_index    : Parser.parseFloat64(data.buffer, offsets[36]),
            reward_borrow_index     : Parser.parseFloat64(data.buffer, offsets[37]),
        };
    }


    static parseAssetPrice(data) {
        return {
            price_in_usd: Parser.parseBigUint64(data.buffer, 0)
        };
    }

    static parseUserPagesStats(data) {
        let result = [];
        let view = new DataView(data.buffer);
        for(let offset = 0; offset < data.length; offset+=2) {
            result.push(view.getUint16(offset, true));
        }
        return result;
    }

    static parseUsersPage(data) {
        let result = [];
        let count = data.length / 32;
        for(let i = 0; i < count; i++) {
            const offset = i * 32;
            const end = offset + 32;
            result[i] = new S.PublicKey(new Uint8Array(data.slice(offset, end)));
        }
        return result;
    }

    static parseUserInfo(data) {
        const widths =  [2, 1];
        let [offsets, ends] = Parser.getOffsets(widths);
        let result = {
            page_id    : new DataView(data.buffer.slice(offsets[0], ends[0])).getUint16(0, true),
            num_assets              : data[offsets[1]],
            user_asset_info         : [],
        }
        const uai_base = ends[1];
        const uai_size = 1 + 1 + 16 + 8 + 8 + 8 + 8 + 16 + 8 + 8 + 8 + 8;
        for(let i = 0; i < result.num_assets; i++) {
            let uai_offset = uai_base + i * uai_size;
            result.user_asset_info.push(Parser.parseUserAssetInfo(data, uai_offset));
        }
        return result;
    }

    static parseUserAssetInfo(data, offset) {
        const widths =  [
            1, 1, 
            16, 8, 8, 8, 8, 
            16, 8, 8, 8, 8];
        let [offsets, ends] = Parser.getOffsets(widths);
        return {
            pool_id                 : data[offset + offsets[0]],
            use_as_collateral       : data[offset + offsets[1]],

            deposit_amount          : Parser.parseBigInt128(data.buffer, offset + offsets[2]) / bigInt(consts.AMOUNT_MULTIPLIER),
            deposit_interests       : Parser.parseBigUint64(data.buffer, offset + offsets[3]),
            deposit_index           : Parser.parseFloat64(data.buffer, offset + offsets[4]),
            reward_deposit_amount   : Parser.parseFloat64(data.buffer, offset + offsets[5]),
            reward_deposit_index    : Parser.parseFloat64(data.buffer, offset + offsets[6]),

            borrow_amount           : Parser.parseBigInt128(data.buffer, offset + offsets[7]) / bigInt(consts.AMOUNT_MULTIPLIER),
            borrow_interests        : Parser.parseBigUint64(data.buffer, offset + offsets[8]),
            borrow_index            : Parser.parseFloat64(data.buffer, offset + offsets[9]),
            reward_borrow_amount    : Parser.parseFloat64(data.buffer, offset + offsets[10]),
            reward_borrow_index     : Parser.parseFloat64(data.buffer, offset + offsets[11]),
        }
    }

    static getPoolIdArray(mint_key_str) {
        return [mint_key_str_to_pool_id[mint_key_str]];
    }
}

export class TxMaker {

    static async refresh_user(user_wallet_key) {
        const [base_pda, _1] = await consts.get_base_pda();
        const userInfoKey = await consts.get_user_info_key(user_wallet_key);
        const poolSummariesKey = await consts.get_pool_summaries_key(base_pda);
        const inst = new S.TransactionInstruction({
            programId: programPubkey,
            keys: [
                {pubkey: user_wallet_key,           isSigner: false, isWritable: false},    // wallet
                {pubkey: userInfoKey,               isSigner: false, isWritable: true},     // UserInfo
                {pubkey: poolSummariesKey,          isSigner: false, isWritable: false},    // PoolSummaries
            ],
            data: [consts.CMD_REFRESH_USER]
        });
        return new S.Transaction().add(inst);
    }

    static async update_user_config(
        user_wallet_account,
        self_liquidation_threshold, 
        post_self_liquidation_ratio_target, 
        post_extern_liquidation_ratio_target) {

        const wallet_key = user_wallet_account.publicKey;
        const userInfoKey = await consts.get_user_info_key(wallet_key);
        const inst = new S.TransactionInstruction({
            programId: programPubkey,
            keys: [
                {pubkey: wallet_key,                isSigner: true,  isWritable: false},
                {pubkey: userInfoKey,               isSigner: false, isWritable: true},
            ],
            data: [
                consts.CMD_UPDATE_USER_CONFIG, 
                self_liquidation_threshold, 
                post_self_liquidation_ratio_target, 
                post_extern_liquidation_ratio_target
            ]
        });
        // signer: user_wallet
        return new S.Transaction().add(inst);
    }

    static async add_user_and_deposit(page_id, wallet_account, user_spl_key, mint_key_str, amount) {
        const [base_pda, _0] = await consts.get_base_pda()
        const user_wallet_key = wallet_account.publicKey;
        const userPagesStatsKey = await consts.get_user_pages_stats_key(base_pda);
        const usersPageKey = await consts.get_users_page_key(base_pda, page_id);
        const userInfoKey = await consts.get_user_info_key(user_wallet_key);
        const assetPoolKey = await consts.get_asset_pool_key(base_pda, mint_key_str);
        const assetPoolSplKey = await consts.get_asset_pool_spl_key(base_pda, mint_key_str);
        const poolSummariesKey = await consts.get_pool_summaries_key(base_pda);
        const priceSummariesKey = await consts.get_price_summaries_key(base_pda);
        let buffer = new ArrayBuffer(10);
        let view = new DataView(buffer);
        view.setUint16(0, page_id, true);
        Parser.setBigUint64(buffer, 2, amount);
        let payload = Array.from(new Uint8Array(buffer));
        let poolIdArray = Parser.getPoolIdArray(mint_key_str);

        let inst = new S.TransactionInstruction({
            programId: programPubkey,
            keys: [
                {pubkey: user_wallet_key,           isSigner: true,  isWritable: true},     // user wallet
                {pubkey: user_spl_key,              isSigner: false, isWritable: true},     // account for PoolList
                {pubkey: userPagesStatsKey,         isSigner: false, isWritable: true},     // UserPagesStats
                {pubkey: usersPageKey,              isSigner: false, isWritable: true},     // UsersPage
                {pubkey: userInfoKey,               isSigner: false, isWritable: true},     // UserInfo
                {pubkey: assetPoolKey,              isSigner: false, isWritable: true},     // AssetPool
                {pubkey: assetPoolSplKey,           isSigner: false, isWritable: true},     // AssetPool's spl account
                {pubkey: poolSummariesKey,          isSigner: false, isWritable: true},     // PoolSummaries
                {pubkey: priceSummariesKey,         isSigner: false, isWritable: false},    // PriceSummaries
                {pubkey: S.SystemProgram.programId, isSigner: false, isWritable: false},    // system program account
                {pubkey: T.TOKEN_PROGRAM_ID,        isSigner: false, isWritable: false},    // spl-token program account
            ],
            data: [consts.CMD_ADD_USER_AND_DEPOSIT].concat(payload).concat(poolIdArray)
        });
        // signer: wallet_account
        return new S.Transaction().add(inst);
    }

    static async deposit(wallet_account, user_spl_key, mint_key_str, amount) {
        const [base_pda, _0] = await consts.get_base_pda();
        const user_wallet_key = wallet_account.publicKey;
        const userInfoKey = await consts.get_user_info_key(user_wallet_key);
        const assetPoolKey = await consts.get_asset_pool_key(base_pda, mint_key_str);
        const assetPoolSplKey = await consts.get_asset_pool_spl_key(base_pda, mint_key_str);
        const poolSummariesKey = await consts.get_pool_summaries_key(base_pda);
        let buffer = new ArrayBuffer(8);
        Parser.setBigUint64(buffer, 0, amount);
        let payload = Array.from(new Uint8Array(buffer));
        let poolIdArray = Parser.getPoolIdArray(mint_key_str);

        let inst = new S.TransactionInstruction({
            programId: programPubkey,
            keys: [
                {pubkey: user_wallet_key,           isSigner: true,  isWritable: true},     // user wallet
                {pubkey: user_spl_key,              isSigner: false, isWritable: true},     // account for PoolList
                {pubkey: userInfoKey,               isSigner: false, isWritable: true},     // UserInfo
                {pubkey: assetPoolKey,              isSigner: false, isWritable: true},     // AssetPool
                {pubkey: assetPoolSplKey,           isSigner: false, isWritable: true},     // AssetPool's spl account
                {pubkey: poolSummariesKey,          isSigner: false, isWritable: true},     // PoolSummaries
                {pubkey: T.TOKEN_PROGRAM_ID,        isSigner: false, isWritable: false},    // spl-token program account
            ],
            data: [consts.CMD_DEPOSIT].concat(payload).concat(poolIdArray)
        });
        // signer: wallet_account
        return new S.Transaction().add(inst);
    }

    static async withdraw_and_remove_user(wallet_account, user_spl_key, mint_key_str, withdraw_all, amount, user_info) {
        const page_id = user_info.page_id;
        if ( page_id > 10000 ) {
            console.log("User not added to backend yet.");
            return;
        }
        const [base_pda, _0] = await consts.get_base_pda()
        const user_wallet_key = wallet_account.publicKey;
        const userPagesStatsKey = await consts.get_user_pages_stats_key(base_pda);
        const usersPageKey = await consts.get_users_page_key(base_pda, page_id);
        const userInfoKey = await consts.get_user_info_key(user_wallet_key);
        const assetPoolKey = await consts.get_asset_pool_key(base_pda, mint_key_str);
        const assetPoolSplKey = await consts.get_asset_pool_spl_key(base_pda, mint_key_str);
        const poolSummariesKey = await consts.get_pool_summaries_key(base_pda);
        const priceSummariesKey = await consts.get_price_summaries_key(base_pda);
        let keys = [
            {pubkey: user_wallet_key,           isSigner: true,  isWritable: true},     // user wallet
            {pubkey: user_spl_key,              isSigner: false, isWritable: true},     // account for PoolList
            {pubkey: userPagesStatsKey,         isSigner: false, isWritable: true},     // UserPagesStats
            {pubkey: usersPageKey,              isSigner: false, isWritable: true},     // UsersPage
            {pubkey: userInfoKey,               isSigner: false, isWritable: true},     // UserInfo
            {pubkey: assetPoolKey,              isSigner: false, isWritable: true},     // AssetPool
            {pubkey: assetPoolSplKey,           isSigner: false, isWritable: true},     // AssetPool's spl account
            {pubkey: poolSummariesKey,          isSigner: false, isWritable: true},     // PoolSummaries
            {pubkey: priceSummariesKey,         isSigner: false, isWritable: false},    // PriceSummaries
            {pubkey: base_pda,                  isSigner: false, isWritable: false},    // base_pda
            {pubkey: T.TOKEN_PROGRAM_ID,        isSigner: false, isWritable: false},    // spl-token program account
        ];
        let buffer = new ArrayBuffer(9);
        Parser.setUint8(buffer, 0, withdraw_all? 1 : 0);
        Parser.setBigUint64(buffer, 1, amount);
        let payload = Array.from(new Uint8Array(buffer));
        let poolIdArray = Parser.getPoolIdArray(mint_key_str);
        let data = [consts.CMD_WITHDRAW_AND_REMOVE_USER].concat(payload).concat(poolIdArray);

        let inst = new S.TransactionInstruction({
            programId: programPubkey,
            keys: keys,
            data: data,
        });
        // signer: wallet_account
        return new S.Transaction().add(inst);
    }

    static async withdraw(wallet_account, user_spl_key, mint_key_str, withdraw_all, amount) {
        const [base_pda, _0] = await consts.get_base_pda()
        const user_wallet_key = wallet_account.publicKey;
        const userInfoKey = await consts.get_user_info_key(user_wallet_key);
        const assetPoolKey = await consts.get_asset_pool_key(base_pda, mint_key_str);
        const assetPoolSplKey = await consts.get_asset_pool_spl_key(base_pda, mint_key_str);
        const poolSummariesKey = await consts.get_pool_summaries_key(base_pda);
        const priceSummariesKey = await consts.get_price_summaries_key(base_pda);
        let keys = [
            {pubkey: user_wallet_key,           isSigner: true,  isWritable: true},     // user wallet
            {pubkey: user_spl_key,              isSigner: false, isWritable: true},     // account for PoolList
            {pubkey: userInfoKey,               isSigner: false, isWritable: true},     // UserInfo
            {pubkey: assetPoolKey,              isSigner: false, isWritable: true},     // AssetPool
            {pubkey: assetPoolSplKey,           isSigner: false, isWritable: true},     // AssetPool's spl account
            {pubkey: poolSummariesKey,          isSigner: false, isWritable: true},     // PoolSummaries
            {pubkey: priceSummariesKey,         isSigner: false, isWritable: false},    // PriceSummaries
            {pubkey: base_pda,                  isSigner: false, isWritable: false},    // base_pda
            {pubkey: T.TOKEN_PROGRAM_ID,        isSigner: false, isWritable: false},    // spl-token program account
        ];
        let buffer = new ArrayBuffer(9);
        Parser.setUint8(buffer, 0, withdraw_all? 1 : 0);
        Parser.setBigUint64(buffer, 1, amount);
        let payload = Array.from(new Uint8Array(buffer));
        let poolIdArray = Parser.getPoolIdArray(mint_key_str);
        let data = [consts.CMD_WITHDRAW].concat(payload).concat(poolIdArray);

        let inst = new S.TransactionInstruction({
            programId: programPubkey,
            keys: keys,
            data: data,
        });
        // signer: wallet_account
        return new S.Transaction().add(inst);
    }

    static async borrow(wallet_account, user_spl_key, mint_key_str, amount) {
        const [base_pda, _0] = await consts.get_base_pda();
        const user_wallet_key = wallet_account.publicKey;
        const userInfoKey = await consts.get_user_info_key(user_wallet_key);
        const assetPoolKey = await consts.get_asset_pool_key(base_pda, mint_key_str);
        const assetPoolSplKey = await consts.get_asset_pool_spl_key(base_pda, mint_key_str);
        const poolSummariesKey = await consts.get_pool_summaries_key(base_pda);
        const priceSummariesKey = await consts.get_price_summaries_key(base_pda);
        let keys = [
            {pubkey: user_wallet_key,           isSigner: true,  isWritable: true},     // user wallet
            {pubkey: user_spl_key,              isSigner: false, isWritable: true},     // account for PoolList
            {pubkey: userInfoKey,               isSigner: false, isWritable: true},     // UserInfo
            {pubkey: assetPoolKey,              isSigner: false, isWritable: true},     // AssetPool
            {pubkey: assetPoolSplKey,           isSigner: false, isWritable: true},     // AssetPool's spl account
            {pubkey: poolSummariesKey,          isSigner: false, isWritable: true},     // PoolSummaries
            {pubkey: priceSummariesKey,         isSigner: false, isWritable: false},    // PriceSummaries
            {pubkey: base_pda,                  isSigner: false, isWritable: false},    // base_pda
            {pubkey: T.TOKEN_PROGRAM_ID,        isSigner: false, isWritable: false},    // spl-token program account
        ];

        let buffer = new ArrayBuffer(8);
        Parser.setBigUint64(buffer, 0, amount);
        let payload = Array.from(new Uint8Array(buffer));
        let poolIdArray = Parser.getPoolIdArray(mint_key_str);
        let data = [consts.CMD_BORROW].concat(payload).concat(poolIdArray);

        let inst = new S.TransactionInstruction({
            programId: programPubkey,
            keys: keys,
            data: data,
        });
        // signer: wallet_account
        return new S.Transaction().add(inst);
    }

    static async repay(wallet_account, user_spl_key, mint_key_str, repay_all, amount) {
        const [base_pda, _0] = await consts.get_base_pda();
        const user_wallet_key = wallet_account.publicKey;
        const userInfoKey = await consts.get_user_info_key(user_wallet_key);
        const assetPoolKey = await consts.get_asset_pool_key(base_pda, mint_key_str);
        const assetPoolSplKey = await consts.get_asset_pool_spl_key(base_pda, mint_key_str);
        const poolSummariesKey = await consts.get_pool_summaries_key(base_pda);
        let keys = [
            {pubkey: user_wallet_key,           isSigner: true,  isWritable: true},     // user wallet
            {pubkey: user_spl_key,              isSigner: false, isWritable: true},     // account for PoolList
            {pubkey: userInfoKey,               isSigner: false, isWritable: true},     // UserInfo
            {pubkey: assetPoolKey,              isSigner: false, isWritable: true},     // AssetPool
            {pubkey: assetPoolSplKey,           isSigner: false, isWritable: true},     // AssetPool's spl account
            {pubkey: poolSummariesKey,          isSigner: false, isWritable: true},     // PoolSummaries
            {pubkey: T.TOKEN_PROGRAM_ID,        isSigner: false, isWritable: false},    // spl-token program account
        ];
        let buffer = new ArrayBuffer(9);
        Parser.setUint8(buffer, 0, repay_all? 1 : 0);
        Parser.setBigUint64(buffer, 1, amount);
        let payload = Array.from(new Uint8Array(buffer));
        let poolIdArray = Parser.getPoolIdArray(mint_key_str);
        let inst = new S.TransactionInstruction({
            programId: programPubkey,
            keys: keys,
            data: [consts.CMD_REPAY].concat(payload).concat(poolIdArray)
        });
        // signer: wallet_account
        return new S.Transaction().add(inst);
    }

    static async extern_liquidate(
        liquidator_wallet_account, 
        liquidated_wallet_key, 
        liquidator_collateral_spl,  // PublicKey
        liquidator_borrowed_spl,  // PublicKey
        collateral_mint_str,
        borrowed_mint_str,
        min_collateral_amount,
        repaid_borrow_amount,
    ) {
        const [base_pda, _0] = await consts.get_base_pda();
        const liquidator_wallet_key = liquidator_wallet_account.publicKey;
        const userInfoKey = await consts.get_user_info_key(liquidated_wallet_key);

        const collateralPoolKey = await consts.get_asset_pool_key(base_pda, collateral_mint_str);
        const collateralPoolSpl = await consts.get_asset_pool_spl_key(base_pda, collateral_mint_str);

        const borrowedPoolKey = await consts.get_asset_pool_key(base_pda, borrowed_mint_str);
        const borrowedPoolSpl = await consts.get_asset_pool_spl_key(base_pda, borrowed_mint_str);

        const poolSummariesKey = await consts.get_pool_summaries_key(base_pda);
        const priceSummariesKey = await consts.get_price_summaries_key(base_pda);

        let keys = [
            {pubkey: liquidated_wallet_key,     isSigner: false,    isWritable: false},
            {pubkey: liquidator_wallet_key,     isSigner: true,     isWritable: false},
            {pubkey: userInfoKey,               isSigner: false,    isWritable: true},
            {pubkey: base_pda,                  isSigner: false,    isWritable: false},

            {pubkey: liquidator_collateral_spl, isSigner: false,    isWritable: true},
            {pubkey: liquidator_borrowed_spl,   isSigner: false,    isWritable: true},

            {pubkey: collateralPoolKey,         isSigner: false,    isWritable: true},
            {pubkey: collateralPoolSpl,         isSigner: false,    isWritable: true},

            {pubkey: borrowedPoolKey,           isSigner: false,    isWritable: true},
            {pubkey: borrowedPoolSpl,           isSigner: false,    isWritable: true},

            {pubkey: poolSummariesKey,          isSigner: false, isWritable: true},     // PoolSummaries
            {pubkey: priceSummariesKey,         isSigner: false, isWritable: false},    // PriceSummaries

            {pubkey: T.TOKEN_PROGRAM_ID,        isSigner: false, isWritable: false},    // spl-token program account
        ];

        let buffer = new ArrayBuffer(8 + 8);
        Parser.setBigUint64(buffer, 0, min_collateral_amount);
        Parser.setBigUint64(buffer, 8, repaid_borrow_amount);
        const payload = Array.from(new Uint8Array(buffer));
        const collateralPoolIdArray = Parser.getPoolIdArray(collateral_mint_str);
        const borrowedPoolIdArray = Parser.getPoolIdArray(borrowed_mint_str);
        let data = [consts.CMD_EXTERN_LIQUIDATE].concat(payload).concat(collateralPoolIdArray).concat(borrowedPoolIdArray);

        let inst = new S.TransactionInstruction({
            programId: programPubkey,
            keys: keys,
            data: data,
        });
        // signer: liquidator_wallet_account
        return new S.Transaction().add(inst);
    }

    static build_margin_swap_param(
        target_swap,
        is_buy, 
        sell_mint_str,
        sell_amount,
        buy_mint_str,
        buy_amount
    ) {
        let buffer = new ArrayBuffer(1 + 8 + 8);

        Parser.setUint8(buffer, 0, is_buy? 1 : 0);
        Parser.setBigUint64(buffer, 1, sell_amount);
        Parser.setBigUint64(buffer, 9, buy_amount);
        const payload = Array.from(new Uint8Array(buffer));
        const sellPoolIdArray = Parser.getPoolIdArray(sell_mint_str);
        const buyPoolIdArray = Parser.getPoolIdArray(buy_mint_str);
        return [consts.CMD_MARGIN_SWAP].concat(payload).concat(sellPoolIdArray).concat(buyPoolIdArray).concat([target_swap]);
    }

    static async margin_swap(
        user_wallet_key,
        target_swap,
        is_buy,
        sell_mint_str,
        sell_amount,
        buy_mint_str,
        buy_amount,
        serum_keys,
        is_signed,
    ) {
        const [base_pda, _0] = await consts.get_base_pda();
        const userInfoKey = await consts.get_user_info_key(user_wallet_key);

        const collateralPoolKey = await consts.get_asset_pool_key(base_pda, sell_mint_str);
        const collateralPoolSpl = await consts.get_asset_pool_spl_key(base_pda, sell_mint_str);

        const borrowedPoolKey = await consts.get_asset_pool_key(base_pda, buy_mint_str);
        const borrowedPoolSpl = await consts.get_asset_pool_spl_key(base_pda, buy_mint_str);

        const poolSummariesKey = await consts.get_pool_summaries_key(base_pda);
        const priceSummariesKey = await consts.get_price_summaries_key(base_pda);

        let keys = [
            {pubkey: user_wallet_key,           isSigner: is_signed,    isWritable: false},
            {pubkey: userInfoKey,               isSigner: false,        isWritable: true},
            {pubkey: base_pda,                  isSigner: false,        isWritable: false},

            {pubkey: collateralPoolKey,         isSigner: false,        isWritable: true},
            {pubkey: collateralPoolSpl,         isSigner: false,        isWritable: true},

            {pubkey: borrowedPoolKey,           isSigner: false,        isWritable: true},
            {pubkey: borrowedPoolSpl,           isSigner: false,        isWritable: true},

            {pubkey: poolSummariesKey,          isSigner: false,        isWritable: true},     // PoolSummaries
            {pubkey: priceSummariesKey,         isSigner: false,        isWritable: false},    // PriceSummaries

            {pubkey: T.TOKEN_PROGRAM_ID,        isSigner: false,        isWritable: false},    // spl-token program account
        ].concat(serum_keys);

        let data = TxMaker.build_margin_swap_param(target_swap, is_buy, sell_mint_str, sell_amount, buy_mint_str, buy_amount);

        let inst = new S.TransactionInstruction({
            programId: programPubkey,
            keys: keys,
            data: data,
        });
        // signer: devAccount
        return new S.Transaction().add(inst);
    }

    static async margin_lp_create(
        wallet_account,
        left_mint_str,
        left_amount,
        right_mint_str,
        right_amount,
        lp_mint_str,
        min_lp_amount,
        target_swap,
        swap_account_keys
    ) {
        const [base_pda, _0] = await consts.get_base_pda();
        const user_wallet_key = wallet_account.publicKey;
        const userInfoKey = await consts.get_user_info_key(user_wallet_key);
        const leftAssetPoolKey = await consts.get_asset_pool_key(base_pda, left_mint_str);
        const leftAssetPoolSplKey = await consts.get_asset_pool_spl_key(base_pda, left_mint_str);
        const rightAssetPoolKey = await consts.get_asset_pool_key(base_pda, right_mint_str);
        const rightAssetPoolSplKey = await consts.get_asset_pool_spl_key(base_pda, right_mint_str);
        const lpAssetPoolKey = await consts.get_asset_pool_key(base_pda, lp_mint_str);
        const lpAssetPoolSplKey = await consts.get_asset_pool_spl_key(base_pda, lp_mint_str);
        const poolSummariesKey = await consts.get_pool_summaries_key(base_pda);
        const priceSummariesKey = await consts.get_price_summaries_key(base_pda);

        let keys = [
            {pubkey: user_wallet_key,       isSigner: true,     isWritable: false},
            {pubkey: userInfoKey,           isSigner: false,    isWritable: true},
            {pubkey: base_pda,              isSigner: false,    isWritable: false},
            {pubkey: leftAssetPoolKey,      isSigner: false,    isWritable: true},
            {pubkey: leftAssetPoolSplKey,   isSigner: false,    isWritable: true},
            {pubkey: rightAssetPoolKey,     isSigner: false,    isWritable: true},
            {pubkey: rightAssetPoolSplKey,  isSigner: false,    isWritable: true},
            {pubkey: lpAssetPoolKey,        isSigner: false,    isWritable: true},
            {pubkey: lpAssetPoolSplKey,     isSigner: false,    isWritable: true},
            {pubkey: poolSummariesKey,      isSigner: false,    isWritable: true},
            {pubkey: priceSummariesKey,     isSigner: false,    isWritable: false},
            {pubkey: T.TOKEN_PROGRAM_ID,    isSigner: false,    isWritable: false},
        ].concat(swap_account_keys);

        let buffer = new ArrayBuffer(28);
        Parser.setBigUint64(buffer, 0, left_amount);
        Parser.setBigUint64(buffer, 8, right_amount);
        Parser.setBigUint64(buffer, 16, min_lp_amount);
        let leftPoolId = Parser.getPoolIdArray(left_mint_str);
        Parser.setUint8(buffer, 24, leftPoolId);
        let rightPoolId = Parser.getPoolIdArray(right_mint_str);
        Parser.setUint8(buffer, 25, rightPoolId);
        let lpPoolId = Parser.getPoolIdArray(lp_mint_str);
        Parser.setUint8(buffer, 26, lpPoolId);
        Parser.setUint8(buffer, 27, target_swap);
        const payload = Array.from(new Uint8Array(buffer));

        let data = [consts.CMD_LP_CREATE].concat(payload);

        let inst = new S.TransactionInstruction({
            programId: programPubkey,
            keys: keys,
            data: data
        });

        return new S.Transaction().add(inst);
    }

    static async margin_lp_redeem(
        wallet_account,
        left_mint_str,
        min_left_amount,
        right_mint_str,
        min_right_amount,
        lp_mint_str,
        lp_amount,
        target_swap,
        swap_account_keys
    ) {
        const [base_pda, _0] = await consts.get_base_pda();
        const user_wallet_key = wallet_account.publicKey;
        const userInfoKey = await consts.get_user_info_key(user_wallet_key);
        const leftAssetPoolKey = await consts.get_asset_pool_key(base_pda, left_mint_str);
        const leftAssetPoolSplKey = await consts.get_asset_pool_spl_key(base_pda, left_mint_str);
        const rightAssetPoolKey = await consts.get_asset_pool_key(base_pda, right_mint_str);
        const rightAssetPoolSplKey = await consts.get_asset_pool_spl_key(base_pda, right_mint_str);
        const lpAssetPoolKey = await consts.get_asset_pool_key(base_pda, lp_mint_str);
        const lpAssetPoolSplKey = await consts.get_asset_pool_spl_key(base_pda, lp_mint_str);
        const poolSummariesKey = await consts.get_pool_summaries_key(base_pda);
        const priceSummariesKey = await consts.get_price_summaries_key(base_pda);

        let keys = [
            {pubkey: user_wallet_key,       isSigner: true,     isWritable: true},
            {pubkey: userInfoKey,           isSigner: false,    isWritable: true},
            {pubkey: base_pda,              isSigner: false,    isWritable: false},
            {pubkey: leftAssetPoolKey,      isSigner: false,    isWritable: true},
            {pubkey: leftAssetPoolSplKey,   isSigner: false,    isWritable: true},
            {pubkey: rightAssetPoolKey,     isSigner: false,    isWritable: true},
            {pubkey: rightAssetPoolSplKey,  isSigner: false,    isWritable: true},
            {pubkey: lpAssetPoolKey,        isSigner: false,    isWritable: true},
            {pubkey: lpAssetPoolSplKey,     isSigner: false,    isWritable: true},
            {pubkey: poolSummariesKey,      isSigner: false,    isWritable: true},
            {pubkey: priceSummariesKey,     isSigner: false,    isWritable: false},
            {pubkey: T.TOKEN_PROGRAM_ID,    isSigner: false,    isWritable: false},
        ].concat(swap_account_keys);

        let buffer = new ArrayBuffer(28);
        Parser.setBigUint64(buffer, 0, min_left_amount);
        Parser.setBigUint64(buffer, 8, min_right_amount);
        Parser.setBigUint64(buffer, 16, lp_amount);
        let leftPoolId = Parser.getPoolIdArray(left_mint_str);
        Parser.setUint8(buffer, 24, leftPoolId);
        let rightPoolId = Parser.getPoolIdArray(right_mint_str);
        Parser.setUint8(buffer, 25, rightPoolId);
        let lpPoolId = Parser.getPoolIdArray(lp_mint_str);
        Parser.setUint8(buffer, 26, lpPoolId);
        Parser.setUint8(buffer, 27, target_swap);
        const payload = Array.from(new Uint8Array(buffer));

        let data = [consts.CMD_LP_REDEEM].concat(payload);

        let inst = new S.TransactionInstruction({
            programId: programPubkey,
            keys: keys,
            data: data,
        });

        return new S.Transaction().add(inst);
    }
}

export class ConnWrapper {
    constructor(connection) {
        this.connection = connection;
    }
    async refresh_user(payer_account, user_wallet_key) {
        const tx = await TxMaker.refresh_user( user_wallet_key );
        return this.connection.sendTransaction(tx, [payer_account]);
    }
    async update_user_config(
        user_wallet_account,
        self_liquidation_threshold, 
        post_self_liquidation_ratio_target, 
        post_extern_liquidation_ratio_target
    ) {
        const tx = await TxMaker.update_user_config(
            user_wallet_account, 
            self_liquidation_threshold, 
            post_self_liquidation_ratio_target,
            post_extern_liquidation_ratio_target,
        );
        return this.connection.sendTransaction(tx, [user_wallet_account]);
    }
    async add_user_and_deposit(wallet_account, user_spl_key, mint_key_str, amount) {
        const num_free_slots = await this.getParsedUserPagesStats();
        const max_num_free = Math.max(...num_free_slots);
        const max_page_id = num_free_slots.indexOf(max_num_free);
        const tx = await TxMaker.add_user_and_deposit(max_page_id, wallet_account, user_spl_key, mint_key_str, amount);
        return this.connection.sendTransaction(tx, [wallet_account]);
    }
    async deposit(wallet_account, user_spl_key, mint_key_str, amount) {
        const tx = await TxMaker.deposit(wallet_account, user_spl_key, mint_key_str, amount);
        return this.connection.sendTransaction(tx, [wallet_account]);
    }
    async withdraw_and_remove_user(wallet_account, user_spl_key, mint_key_str, withdraw_all, amount) {
        const user_info = await this.getParsedUserInfo(wallet_account.publicKey);
        const tx = await TxMaker.withdraw_and_remove_user(wallet_account, user_spl_key, mint_key_str, withdraw_all, amount, user_info);
        return this.connection.sendTransaction(tx, [wallet_account]);
    }
    async withdraw(wallet_account, user_spl_key, mint_key_str, withdraw_all, amount) {
        const tx = await TxMaker.withdraw(wallet_account, user_spl_key, mint_key_str, withdraw_all, amount);
        return this.connection.sendTransaction(tx, [wallet_account]);
    }
    async borrow(wallet_account, user_spl_key, mint_key_str, amount) {
        const tx = await TxMaker.borrow(wallet_account, user_spl_key, mint_key_str, amount);
        return this.connection.sendTransaction(tx, [wallet_account]);
    }
    async repay(wallet_account, user_spl_key, mint_key_str, repay_all, amount) {
        const tx = await TxMaker.repay(wallet_account, user_spl_key, mint_key_str, repay_all, amount);
        return this.connection.sendTransaction(tx, [wallet_account]);
    }

    async extern_liquidate(
        liquidator_wallet_account, 
        liquidated_wallet_key, 
        liquidator_collateral_spl,  // PublicKey
        liquidator_borrowed_spl,  // PublicKey
        collateral_mint_str,
        borrowed_mint_str,
        min_collateral_amount,
        repaid_borrow_amount,
    ) {
        const tx = await TxMaker.extern_liquidate(
            liquidator_wallet_account, 
            liquidated_wallet_key, 
            liquidator_collateral_spl,  // PublicKey
            liquidator_borrowed_spl,  // PublicKey
            collateral_mint_str,
            borrowed_mint_str,
            min_collateral_amount,
            repaid_borrow_amount,
        );
        return this.connection.sendTransaction(tx, [liquidator_wallet_account]);
    }
    async margin_swap(
        user_wallet_account,
        target_swap,
        is_buy,
        collateral_mint_str,
        sell_collateral_amount,
        borrowed_mint_str,
        buy_borrowed_amount,
        serum_keys,
        is_signed,
    ) {
        const tx = await TxMaker.margin_swap(
            user_wallet_account.publicKey,
            target_swap,
            is_buy,
            collateral_mint_str,
            sell_collateral_amount,
            borrowed_mint_str,
            buy_borrowed_amount,
            serum_keys,
            is_signed,
        );
        return this.connection.sendTransaction(tx, [user_wallet_account]);
    }

    async margin_lp_create(
        wallet_account,
        left_mint_str,
        left_amount,
        right_mint_str,
        right_amount,
        lp_mint_str,
        min_lp_amount,
        target_swap,
        swap_account_keys
    ) {
        const tx = await TxMaker.margin_lp_create(
            wallet_account,
            left_mint_str,
            left_amount,
            right_mint_str,
            right_amount,
            lp_mint_str,
            min_lp_amount,
            target_swap,
            swap_account_keys
        );

        return this.connection.sendTransaction(tx, [wallet_account]);
    }

    async margin_lp_redeem(
        wallet_account,
        left_mint_str,
        min_left_amount,
        right_mint_str,
        min_right_amount,
        lp_mint_str,
        lp_amount,
        target_swap,
        swap_account_keys,
    ) {
        const tx = await TxMaker.margin_lp_redeem(
            wallet_account.publicKey,
            left_mint_str,
            min_left_amount,
            right_mint_str,
            min_right_amount,
            lp_mint_str,
            lp_amount,
            target_swap,
            swap_account_keys,
        );

        return this.connection.sendTransaction(tx, [wallet_account]);
    }


    async getParsedPoolList() {
        const [base_pda, bump] = await consts.get_base_pda()
        const pool_list_pubkey = await consts.get_pool_list_key(base_pda);
        let response = await this.connection.getParsedAccountInfo(pool_list_pubkey);
        return Parser.parsePoolList(new Uint8Array(response.value.data));
    }

    async getParsedUserPagesStats() {
        const [base_pda, _] = await consts.get_base_pda();
        const statsAccountKey = await consts.get_user_pages_stats_key(base_pda); 
        let response = await this.connection.getParsedAccountInfo(statsAccountKey);
        return Parser.parseUserPagesStats(new Uint8Array(response.value.data));
    }

    async getParsedAssetPool(mint_key_str) {
        const [base_pda, _] = await consts.get_base_pda();
        const poolAccountKey = await consts.get_asset_pool_key(base_pda, mint_key_str); 
        let response = await this.connection.getParsedAccountInfo(poolAccountKey);
        return Parser.parseAssetPool(new Uint8Array(response.value.data));
    }

    async getParsedAssetPrice(mint_key_str) {
        const [price_pda, _] = await consts.get_price_pda();
        const assetPriceKey = await consts.get_asset_price_key(price_pda, mint_key_str); 
        let response = await this.connection.getParsedAccountInfo(assetPriceKey);
        return Parser.parseAssetPrice(new Uint8Array(response.value.data));
    }

    async getParsedUserInfo(wallet_key) {
        const userInfoKey = await consts.get_user_info_key(wallet_key); 
        let response = await this.connection.getParsedAccountInfo(userInfoKey);
        return Parser.parseUserInfo(new Uint8Array(response.value.data));
    }

    async isUserActive(wallet_key) {
        // checks if user is active. If he is, deposit can be done via deposit(). Otherwise deposit needs to be done via
        // add_user_and_deposit()
        const userInfoKey = await consts.get_user_info_key(wallet_key); 
        let response = await this.connection.getParsedAccountInfo(userInfoKey);
        if (response.value === null) {
            return false;
        }
        let user_info = Parser.parseUserInfo(new Uint8Array(response.value.data));
        return user_info.page_id !== consts.INVALID_PAGE;
    }
}
