use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    program,
    pubkey::Pubkey,
};
use apricot_client::instructions;

#[cfg(not(feature = "no-entrypoint"))]
entrypoint!(process_instruction);


pub fn process_instruction( _program_id: &Pubkey, accounts: &[AccountInfo], _data: &[u8])
    -> ProgramResult {

    /*
    This is a demo contract method that does only 2 things:

    1. deposit (deposit into pool 0)
    2. borrow (borrow from pool 1)

     */

    let account_iter = &mut accounts.iter();

    let user_wallet_a = next_account_info(account_iter)?;
    let user_spl_0_a = next_account_info(account_iter)?; // user's BTC associated account
    let user_spl_1_a = next_account_info(account_iter)?; // user's ETH associated account
    let user_info_a = next_account_info(account_iter)?;

    let pool_summaries_a = next_account_info(account_iter)?;
    let price_summaries_a = next_account_info(account_iter)?;

    let asset_pool_0_a = next_account_info(account_iter)?;
    let asset_pool_1_a = next_account_info(account_iter)?;

    let asset_pool_spl_0_a = next_account_info(account_iter)?;
    let asset_pool_spl_1_a = next_account_info(account_iter)?;

    let base_pda_a = next_account_info(account_iter)?;
    let system_program_a = next_account_info(account_iter)?;
    let token_program_a = next_account_info(account_iter)?;
    let apricot_program_a = next_account_info(account_iter)?;

    let deposit_ix = instructions::deposit(
        user_wallet_a.key,
        user_spl_0_a.key,
        user_info_a.key,
        asset_pool_0_a.key,
        asset_pool_spl_0_a.key,
        pool_summaries_a.key,
        token_program_a.key,
        apricot_program_a.key,

        1000000000,
        0, // pool 0 is BTC
    );


    program::invoke(&deposit_ix, &[
        user_wallet_a.clone(),
        user_spl_0_a.clone(),
        user_info_a.clone(),
        asset_pool_0_a.clone(),
        asset_pool_spl_0_a.clone(),
        pool_summaries_a.clone(),
        system_program_a.clone(),
        token_program_a.clone(),
        apricot_program_a.clone(),
    ])?;

    let borrow_ix = instructions::borrow(
        user_wallet_a.key,
        user_spl_1_a.key,
        user_info_a.key,
        asset_pool_1_a.key,
        asset_pool_spl_1_a.key,
        pool_summaries_a.key,
        price_summaries_a.key,
        base_pda_a.key,
        token_program_a.key,
        apricot_program_a.key,

        1000000,
        1, // pool 1 is ETH
    );

    program::invoke(&borrow_ix, &[
        user_wallet_a.clone(),
        user_spl_1_a.clone(),
        user_info_a.clone(),
        asset_pool_1_a.clone(),
        asset_pool_spl_1_a.clone(),
        pool_summaries_a.clone(),
        price_summaries_a.clone(),
        base_pda_a.clone(),
        token_program_a.clone(),
        apricot_program_a.clone(),
    ])?;

    Ok(())
}
