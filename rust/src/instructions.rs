use solana_program::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    system_program,
};
use spl_token;

use crate::consts;

#[repr(packed)]
pub struct UpdateUserAssetConfigParam {
    pub use_as_collateral: u8,
    pub pool_id: u8,
}

#[repr(packed)]
pub struct AddUserAndDepositParam {
    pub page_id: u16,
    pub amount: u64,
    pub pool_id: u8,
}

#[repr(packed)]
pub struct DepositParam {
    pub amount: u64,
    pub pool_id: u8,
}

#[repr(packed)]
pub struct WithdrawParam {
    pub withdraw_all: u8,
    pub amount: u64,
    pub pool_id: u8,
}

#[repr(packed)]
pub struct BorrowParam {
    pub amount: u64,
    pub pool_id: u8,
}

#[repr(packed)]
pub struct RepayParam {
    pub repay_all: u8,
    pub amount: u64,
    pub pool_id: u8,
}

#[repr(packed)]
pub struct ExternLiquidateParam {
    // how much collateral liquidator wants to receive
    pub min_collateral_amount: u64,
    // how much debt liquidator wants to help repay
    pub repaid_borrow_amount: u64,
    pub collateral_pool_id: u8,
    pub borrowed_pool_id: u8,
}

#[inline(always)]
pub fn mut_cast<T>(data: &mut [u8]) -> &mut T {
    assert!(data.len() >= std::mem::size_of::<T>());
    return unsafe { std::mem::transmute(data.as_ptr()) };
}

pub fn deposit(
    user_wallet: &Pubkey, // user wallet account, needs to be signer
    user_spl: &Pubkey,    // user's SPL token account
    amount: u64,
    pool_id: u8,
) -> Instruction {
    deposit_full(
        user_wallet,
        user_spl,
        &consts::get_user_info_k(user_wallet),
        &consts::get_asset_pool_k(pool_id),
        &consts::get_asset_pool_spl_k(&spl_token::ID, pool_id),
        &consts::get_pool_summaries_k(),
        &consts::get_price_summaries_k(),
        &spl_token::ID,
        &consts::program::ID,
        amount,
        pool_id,
    )
}

pub fn deposit_full(
    user_wallet: &Pubkey,     // user wallet account, needs to be signer
    user_spl: &Pubkey,        // user's SPL token account
    user_info: &Pubkey,       // consts::get_user_info_k(user_wallet_key)
    asset_pool: &Pubkey,      // consts::get_asset_pool_k(pool_id)
    asset_pool_spl: &Pubkey,  // consts::get_asset_pool_spl_k(token_program, pool_id)
    pool_summaries: &Pubkey,  // consts::get_pool_summaries_k()
    price_summaries: &Pubkey, // consts::get_pool_summaries_k()
    token_program: &Pubkey,
    program_id: &Pubkey, // consts::program::ID

    amount: u64,
    pool_id: u8,
) -> Instruction {
    let data_size = 1 + std::mem::size_of::<DepositParam>();
    let mut buffer = vec![0; data_size];

    buffer[0] = consts::CMD_DEPOSIT;
    let mut param = mut_cast::<DepositParam>(&mut buffer[1..]);
    param.amount = amount;
    param.pool_id = pool_id;

    Instruction {
        program_id: *program_id,
        accounts: vec![
            AccountMeta::new_readonly(*user_wallet, true),
            AccountMeta::new(*user_spl, false),
            AccountMeta::new(*user_info, false),
            AccountMeta::new(*asset_pool, false),
            AccountMeta::new(*asset_pool_spl, false),
            AccountMeta::new(*pool_summaries, false),
            AccountMeta::new(*price_summaries, false),
            AccountMeta::new_readonly(*token_program, false),
        ],
        data: buffer,
    }
}

pub fn add_user_and_deposit(
    user_wallet: &Pubkey, // user wallet account, needs to be signer
    user_spl: &Pubkey,    // user's SPL token account
    amount: u64,
    pool_id: u8,
    page_id: u16,
) -> Instruction {
    add_user_and_deposit_full(
        user_wallet,
        user_spl,
        &consts::get_user_pages_stats_k(),
        &consts::get_users_page_k(page_id),
        &consts::get_user_info_k(user_wallet),
        &consts::get_asset_pool_k(pool_id),
        &consts::get_asset_pool_spl_k(&spl_token::ID, pool_id),
        &consts::get_pool_summaries_k(),
        &consts::get_price_summaries_k(),
        &system_program::ID,
        &spl_token::ID,
        &consts::program::ID,
        amount,
        pool_id,
        page_id,
    )
}

pub fn add_user_and_deposit_full(
    user_wallet: &Pubkey,      // user wallet account, needs to be signer
    user_spl: &Pubkey,         // user's SPL token account
    user_pages_stats: &Pubkey, // consts::get_user_pages_stats_k()
    users_page: &Pubkey,       // consts::get_users_page_k(page_id)
    user_info: &Pubkey,        // consts::get_user_info_k(user_wallet_key)
    asset_pool: &Pubkey,       // consts::get_asset_pool_k(pool_id)
    asset_pool_spl: &Pubkey,   // consts::get_asset_pool_spl_k(token_program, pool_id)
    pool_summaries: &Pubkey,   // consts::get_pool_summaries_k()
    price_summaries: &Pubkey,  // consts::get_pool_summaries_k()
    system_program: &Pubkey,
    token_program: &Pubkey,
    program_id: &Pubkey, // consts::program::ID

    amount: u64,
    pool_id: u8,
    page_id: u16,
) -> Instruction {
    let data_size = 1 + std::mem::size_of::<AddUserAndDepositParam>();
    let mut buffer = vec![0; data_size];

    buffer[0] = consts::CMD_ADD_USER_AND_DEPOSIT;
    let mut param = mut_cast::<AddUserAndDepositParam>(&mut buffer[1..]);
    param.amount = amount;
    param.pool_id = pool_id;
    param.page_id = page_id;

    Instruction {
        program_id: *program_id,
        accounts: vec![
            AccountMeta::new(*user_wallet, true),
            AccountMeta::new(*user_spl, false),
            AccountMeta::new(*user_pages_stats, false),
            AccountMeta::new(*users_page, false),
            AccountMeta::new(*user_info, false),
            AccountMeta::new(*asset_pool, false),
            AccountMeta::new(*asset_pool_spl, false),
            AccountMeta::new(*pool_summaries, false),
            AccountMeta::new(*price_summaries, false),
            AccountMeta::new_readonly(*system_program, false),
            AccountMeta::new_readonly(*token_program, false),
        ],
        data: buffer,
    }
}

pub fn withdraw(
    user_wallet: &Pubkey, // user wallet account, needs to be signer
    user_spl: &Pubkey,    // user's SPL token account
    withdraw_all: bool,
    amount: u64,
    pool_id: u8,
    page_id: u16,
) -> Instruction {
    withdraw_full(
        user_wallet,
        user_spl,
        &consts::get_user_info_k(user_wallet),
        &consts::get_asset_pool_k(pool_id),
        &consts::get_asset_pool_spl_k(&spl_token::ID, pool_id),
        &consts::get_pool_summaries_k(),
        &consts::get_price_summaries_k(),
        &consts::get_base_pda(),
        &spl_token::ID,
        &consts::program::ID,
        withdraw_all,
        amount,
        pool_id,
        page_id,
    )
}

pub fn withdraw_full(
    user_wallet: &Pubkey,     // user wallet account, needs to be signer
    user_spl: &Pubkey,        // user's SPL token account
    user_info: &Pubkey,       // consts::get_user_info_k(user_wallet_key)
    asset_pool: &Pubkey,      // consts::get_asset_pool_k(pool_id)
    asset_pool_spl: &Pubkey,  // consts::get_asset_pool_spl_k(token_program, pool_id)
    pool_summaries: &Pubkey,  // consts::get_pool_summaries_k()
    price_summaries: &Pubkey, // consts::get_price_summaries_k()
    base_pda: &Pubkey,        // consts::get_base_pda()
    token_program: &Pubkey,
    program_id: &Pubkey, // consts::program::ID

    withdraw_all: bool,
    amount: u64,
    pool_id: u8,
    page_id: u16,
) -> Instruction {
    let data_size = 1 + std::mem::size_of::<WithdrawParam>();
    let mut buffer = vec![0; data_size];

    buffer[0] = if withdraw_all {
        consts::CMD_WITHDRAW_AND_REMOVE_USER
    } else {
        consts::CMD_WITHDRAW
    };
    let mut param = mut_cast::<WithdrawParam>(&mut buffer[1..]);
    param.withdraw_all = if withdraw_all { 1 } else { 0 };
    param.amount = amount;
    param.pool_id = pool_id;

    let mut accounts = vec![
        AccountMeta::new_readonly(*user_wallet, true),
        AccountMeta::new(*user_spl, false),
    ];
    if withdraw_all {
        accounts.push(AccountMeta::new(consts::get_user_pages_stats_k(), false));
        accounts.push(AccountMeta::new(consts::get_users_page_k(page_id), false));
    }
    accounts.push(AccountMeta::new(*user_info, false));
    accounts.push(AccountMeta::new(*asset_pool, false));
    accounts.push(AccountMeta::new(*asset_pool_spl, false));
    accounts.push(AccountMeta::new(*pool_summaries, false));
    accounts.push(AccountMeta::new_readonly(*price_summaries, false));
    accounts.push(AccountMeta::new_readonly(*base_pda, false));
    accounts.push(AccountMeta::new_readonly(*token_program, false));
    Instruction {
        program_id: *program_id,
        accounts: accounts,
        data: buffer,
    }
}

pub fn borrow(
    user_wallet: &Pubkey, // user wallet account, needs to be signer
    user_spl: &Pubkey,    // user's SPL token account
    amount: u64,
    pool_id: u8,
) -> Instruction {
    borrow_full(
        user_wallet,
        user_spl,
        &consts::get_user_info_k(user_wallet),
        &consts::get_asset_pool_k(pool_id),
        &consts::get_asset_pool_spl_k(&spl_token::ID, pool_id),
        &consts::get_pool_summaries_k(),
        &consts::get_price_summaries_k(),
        &consts::get_base_pda(),
        &spl_token::ID,
        &consts::program::ID,
        amount,
        pool_id,
    )
}

pub fn borrow_full(
    user_wallet: &Pubkey,     // user wallet account, needs to be signer
    user_spl: &Pubkey,        // user's SPL token account
    user_info: &Pubkey,       // consts::get_user_info_k(user_wallet_key)
    asset_pool: &Pubkey,      // consts::get_asset_pool_k(pool_id)
    asset_pool_spl: &Pubkey,  // consts::get_asset_pool_spl_k(token_program, pool_id)
    pool_summaries: &Pubkey,  // consts::get_pool_summaries_k()
    price_summaries: &Pubkey, // consts::get_price_summaries_k()
    base_pda: &Pubkey,        // consts::get_base_pda()
    token_program: &Pubkey,
    program_id: &Pubkey, // consts::program::ID

    amount: u64,
    pool_id: u8,
) -> Instruction {
    let data_size = 1 + std::mem::size_of::<BorrowParam>();
    let mut buffer = vec![0; data_size];

    buffer[0] = consts::CMD_BORROW;
    let mut param = mut_cast::<BorrowParam>(&mut buffer[1..]);
    param.amount = amount;
    param.pool_id = pool_id;

    Instruction {
        program_id: *program_id,
        accounts: vec![
            AccountMeta::new_readonly(*user_wallet, true),
            AccountMeta::new(*user_spl, false),
            AccountMeta::new(*user_info, false),
            AccountMeta::new(*asset_pool, false),
            AccountMeta::new(*asset_pool_spl, false),
            AccountMeta::new(*pool_summaries, false),
            AccountMeta::new_readonly(*price_summaries, false),
            AccountMeta::new_readonly(*base_pda, false),
            AccountMeta::new_readonly(*token_program, false),
        ],
        data: buffer,
    }
}

pub fn repay(
    user_wallet: &Pubkey, // user wallet account, needs to be signer
    user_spl: &Pubkey,    // user's SPL token account
    repay_all: bool,
    amount: u64,
    pool_id: u8,
) -> Instruction {
    repay_full(
        user_wallet,
        user_spl,
        &consts::get_user_info_k(user_wallet),
        &consts::get_asset_pool_k(pool_id),
        &consts::get_asset_pool_spl_k(&spl_token::ID, pool_id),
        &consts::get_pool_summaries_k(),
        &spl_token::ID,
        &consts::program::ID,
        repay_all,
        amount,
        pool_id,
    )
}

pub fn repay_full(
    user_wallet: &Pubkey,    // user wallet account, needs to be signer
    user_spl: &Pubkey,       // user's SPL token account
    user_info: &Pubkey,      // consts::get_user_info_k(user_wallet_key)
    asset_pool: &Pubkey,     // consts::get_asset_pool_k(pool_id)
    asset_pool_spl: &Pubkey, // consts::get_asset_pool_spl_k(token_program, pool_id)
    pool_summaries: &Pubkey, // consts::get_pool_summaries_k()
    token_program: &Pubkey,
    program_id: &Pubkey, // consts::program::ID

    repay_all: bool,
    amount: u64,
    pool_id: u8,
) -> Instruction {
    let data_size = 1 + std::mem::size_of::<RepayParam>();
    let mut buffer = vec![0; data_size];

    buffer[0] = consts::CMD_REPAY;
    let mut param = mut_cast::<RepayParam>(&mut buffer[1..]);
    param.repay_all = if repay_all { 1 } else { 0 };
    param.amount = amount;
    param.pool_id = pool_id;

    Instruction {
        program_id: *program_id,
        accounts: vec![
            AccountMeta::new_readonly(*user_wallet, true),
            AccountMeta::new(*user_spl, false),
            AccountMeta::new(*user_info, false),
            AccountMeta::new(*asset_pool, false),
            AccountMeta::new(*asset_pool_spl, false),
            AccountMeta::new(*pool_summaries, false),
            AccountMeta::new_readonly(*token_program, false),
        ],
        data: buffer,
    }
}

pub fn refresh_user(user_wallet: &Pubkey, // user wallet account
) -> Instruction {
    let data_size = 1 + 0; // no param
    let mut buffer = vec![0; data_size];

    let program_id = consts::program::ID;
    let user_info = consts::get_user_info_k(user_wallet);
    let pool_summaries = consts::get_pool_summaries_k();

    buffer[0] = consts::CMD_REFRESH_USER;

    Instruction {
        program_id: program_id,
        accounts: vec![
            AccountMeta::new_readonly(*user_wallet, false),
            AccountMeta::new(user_info, false),
            AccountMeta::new_readonly(pool_summaries, false),
        ],
        data: buffer,
    }
}

pub fn extern_liquidate(
    liquidated_wallet: &Pubkey, // wallet key for account to be liquidated
    liquidator_wallet: &Pubkey, // wallet key for liquidator, signer
    liquidator_collateral_spl: &Pubkey, // liquidator's SPL token account for collateral asset
    liquidator_borrowed_spl: &Pubkey, // liquidator's SPL token account for repaid asset
    repaid_borrow_amount: u64,
    min_collateral_amount: u64,
    borrowed_pool_id: u8,
    collateral_pool_id: u8,
) -> Instruction {
    extern_liquidate_full(
        liquidated_wallet,
        liquidator_wallet,
        &consts::get_user_info_k(liquidated_wallet),
        &consts::get_base_pda(),
        liquidator_collateral_spl,
        liquidator_borrowed_spl,
        &consts::get_asset_pool_k(collateral_pool_id),
        &consts::get_asset_pool_spl_k(&spl_token::ID, collateral_pool_id),
        &consts::get_asset_pool_k(borrowed_pool_id),
        &consts::get_asset_pool_spl_k(&spl_token::ID, borrowed_pool_id),
        &consts::get_pool_summaries_k(),
        &spl_token::ID,
        &consts::program::ID,
        repaid_borrow_amount,
        min_collateral_amount,
        borrowed_pool_id,
        collateral_pool_id,
    )
}

// liquidator will help repay "borrowed" and in exchange receive "collateral" asset at 1% discount
pub fn extern_liquidate_full(
    liquidated_wallet: &Pubkey, // wallet key for account to be liquidated
    liquidator_wallet: &Pubkey, // wallet key for liquidator, signer

    user_info: &Pubkey, // consts::get_user_info_k(liquidated_wallet)
    base_pda: &Pubkey,  // consts::get_base_pda()

    liquidator_collateral_spl: &Pubkey, // liquidator's SPL token account for collateral asset
    liquidator_borrowed_spl: &Pubkey,   // liquidator's SPL token account for repaid asset

    collateral_asset_pool: &Pubkey, // consts::get_asset_pool_k(collateral_pool_id)
    collateral_asset_pool_spl: &Pubkey, // consts::get_asset_pool_spl_k(token_program, collateral_pool_id)

    borrowed_asset_pool: &Pubkey, // consts::get_asset_pool_k(borrowed_pool_id)
    borrowed_asset_pool_spl: &Pubkey, // consts::get_asset_pool_spl_k(token_program, borrowed_pool_id)

    pool_summaries: &Pubkey, // consts::get_pool_summaries_k()
    token_program: &Pubkey,
    program_id: &Pubkey, // consts::program::ID

    repaid_borrow_amount: u64,
    min_collateral_amount: u64,
    borrowed_pool_id: u8,
    collateral_pool_id: u8,
) -> Instruction {
    let data_size = 1 + std::mem::size_of::<ExternLiquidateParam>();
    let mut buffer = vec![0; data_size];
    buffer[0] = consts::CMD_EXTERN_LIQUIDATE;

    let mut param = mut_cast::<ExternLiquidateParam>(&mut buffer[1..]);
    param.repaid_borrow_amount = repaid_borrow_amount;
    param.min_collateral_amount = min_collateral_amount;
    param.borrowed_pool_id = borrowed_pool_id;
    param.collateral_pool_id = collateral_pool_id;

    Instruction {
        program_id: *program_id,
        accounts: vec![
            AccountMeta::new_readonly(*liquidated_wallet, false),
            AccountMeta::new_readonly(*liquidator_wallet, true),
            AccountMeta::new(*user_info, false),
            AccountMeta::new_readonly(*base_pda, false),
            AccountMeta::new(*liquidator_collateral_spl, false),
            AccountMeta::new(*liquidator_borrowed_spl, false),
            AccountMeta::new(*collateral_asset_pool, false),
            AccountMeta::new(*collateral_asset_pool_spl, false),
            AccountMeta::new(*borrowed_asset_pool, false),
            AccountMeta::new(*borrowed_asset_pool_spl, false),
            AccountMeta::new(*pool_summaries, false),
            AccountMeta::new_readonly(*token_program, false),
        ],
        data: buffer,
    }
}

// APT Reward has one week accumalating period and one week vestin period,
// Use this method to make any APT reward post-vesting available, contract will find how much APT
// reward has finished vesting and make it available.
pub fn make_lm_reward_claimable(user_wallet: &Pubkey) -> Instruction {
    let user_info = consts::get_user_info_k(user_wallet);
    let pool_summaries = consts::get_pool_summaries_k();

    let mut buffer = vec![0; 1];
    buffer[0] = consts::CMD_MAKE_LM_REWARD_AVAILABLE;

    Instruction {
        program_id: consts::program::ID,
        accounts: vec![
            AccountMeta::new_readonly(*user_wallet, true),
            AccountMeta::new_readonly(*user_wallet, false),
            AccountMeta::new(user_info, false),
            AccountMeta::new(pool_summaries, false),
        ],
        data: buffer,
    }
  }

  pub fn claim_apt_lm_reward(user_wallet: &Pubkey, user_apt_spl: &Pubkey) -> Instruction {
    let base_pda = consts::get_base_pda();
    let user_info = consts::get_user_info_k(user_wallet);
    let lm_apt_vault = consts::lm_apt_vault::ID;
    let pool_summaries = consts::get_pool_summaries_k();
    let price_summaries = consts::get_price_summaries_k();

    let mut buffer = vec![0; 1];
    buffer[0] = consts::CMD_CLAIM_APT_LM_REWARD;
    Instruction {
        program_id: consts::program::ID,
        accounts: vec![
            AccountMeta::new_readonly(base_pda, false),
            AccountMeta::new_readonly(*user_wallet, true),
            AccountMeta::new(user_info, false),
            AccountMeta::new(*user_apt_spl, false),
            AccountMeta::new(lm_apt_vault, false),
            AccountMeta::new(pool_summaries, false),
            AccountMeta::new_readonly(price_summaries, false),
            AccountMeta::new_readonly(spl_token::ID, false),
        ],
        data: buffer,
    }
  }
