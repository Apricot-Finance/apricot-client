use crate::*;
use anchor_lang::{prelude::*, solana_program::program};

pub fn add_user_and_deposit<'a, 'b, 'c, 'info>(
    ctx: CpiContext<'a, 'b, 'c, 'info, AddUserAndDeposit<'info>>,
    amount: u64,
    pool_id: u8,
    page_id: u16,
) -> Result<()> {
    let ix = apricot_client::instructions::add_user_and_deposit_full(
        &ctx.accounts.user_wallet.key,
        &ctx.accounts.lend.user_spl.key,
        &ctx.accounts.user_pages_stats.key,
        &ctx.accounts.users_page.key,
        &ctx.accounts.lend.user_info.key,
        &ctx.accounts.lend.asset_pool.key,
        &ctx.accounts.lend.asset_pool_spl.key,
        &ctx.accounts.lend.pool_summaries.key,
        &ctx.accounts.price_summaries.key,
        &ctx.accounts.system_program.key,
        &ctx.accounts.lend.token_program.key,
        &ctx.program.key,
        amount,
        pool_id,
        page_id,
    );
    program::invoke_signed(
        &ix,
        &[
            ctx.accounts.user_wallet.clone(),
            ctx.accounts.lend.user_spl.clone(),
            ctx.accounts.user_pages_stats.clone(),
            ctx.accounts.users_page.clone(),
            ctx.accounts.lend.user_info.clone(),
            ctx.accounts.lend.asset_pool.clone(),
            ctx.accounts.lend.asset_pool_spl.clone(),
            ctx.accounts.lend.pool_summaries.clone(),
            ctx.accounts.price_summaries.clone(),
            ctx.accounts.system_program.clone(),
            ctx.accounts.lend.token_program.clone(),
            ctx.program.clone(),
        ],
        ctx.signer_seeds,
    )
    .map_err(Into::into)
}

pub fn deposit<'a, 'b, 'c, 'info>(
    ctx: CpiContext<'a, 'b, 'c, 'info, Deposit<'info>>,
    amount: u64,
    pool_id: u8,
) -> Result<()> {
    let ix = apricot_client::instructions::deposit_full(
        &ctx.accounts.user_wallet.key,
        &ctx.accounts.lend.user_spl.key,
        &ctx.accounts.lend.user_info.key,
        &ctx.accounts.lend.asset_pool.key,
        &ctx.accounts.lend.asset_pool_spl.key,
        &ctx.accounts.lend.pool_summaries.key,
        &ctx.accounts.price_summaries.key,
        &ctx.accounts.lend.token_program.key,
        &ctx.program.key,
        amount,
        pool_id,
    );
    program::invoke_signed(
        &ix,
        &[
            ctx.accounts.user_wallet.clone(),
            ctx.accounts.lend.user_spl.clone(),
            ctx.accounts.lend.user_info.clone(),
            ctx.accounts.lend.asset_pool.clone(),
            ctx.accounts.lend.asset_pool_spl.clone(),
            ctx.accounts.lend.pool_summaries.clone(),
            ctx.accounts.price_summaries.clone(),
            ctx.accounts.lend.token_program.clone(),
            ctx.program.clone(),
        ],
        ctx.signer_seeds,
    )
    .map_err(Into::into)
}

pub fn withdraw<'a, 'b, 'c, 'info>(
    ctx: CpiContext<'a, 'b, 'c, 'info, Withdraw<'info>>,
    withdraw_all: bool,
    amount: u64,
    pool_id: u8,
    page_id: u16,
) -> Result<()> {
    let ix = apricot_client::instructions::withdraw_full(
        &ctx.accounts.user_wallet.key,
        &ctx.accounts.lend.user_spl.key,
        &ctx.accounts.lend.user_info.key,
        &ctx.accounts.lend.asset_pool.key,
        &ctx.accounts.lend.asset_pool_spl.key,
        &ctx.accounts.lend.pool_summaries.key,
        &ctx.accounts.price_summaries.key,
        &ctx.accounts.base_pda.key,
        &ctx.accounts.lend.token_program.key,
        &ctx.program.key,
        withdraw_all,
        amount,
        pool_id,
        page_id,
    );

    program::invoke_signed(
        &ix,
        &[
            ctx.accounts.user_wallet.clone(),
            ctx.accounts.lend.user_spl.clone(),
            ctx.accounts.lend.user_info.clone(),
            ctx.accounts.lend.asset_pool.clone(),
            ctx.accounts.lend.asset_pool_spl.clone(),
            ctx.accounts.lend.pool_summaries.clone(),
            ctx.accounts.price_summaries.clone(),
            ctx.accounts.base_pda.clone(),
            ctx.accounts.lend.token_program.clone(),
            ctx.program.clone(),
        ],
        ctx.signer_seeds,
    )
    .map_err(Into::into)
}

pub fn claim_apt_rewards<'a, 'b, 'c, 'info>(
    ctx: CpiContext<'a, 'b, 'c, 'info, ClaimAptRewards<'info>>,
) -> Result<()> {
    // 1. make lm reward claimable
    let ix = apricot_client::instructions::make_lm_reward_claimable(&ctx.accounts.user_wallet.key);
    program::invoke_signed(
        &ix,
        &[
            ctx.accounts.user_wallet.to_account_info(),
            ctx.accounts.user_wallet.to_account_info(),
            ctx.accounts.user_info.to_account_info(),
            ctx.accounts.pool_summaries.to_account_info(),
        ],
        ctx.signer_seeds,
    )?;

    // 2. claim apt lm reward
    let ix = apricot_client::instructions::claim_apt_lm_reward(
        &ctx.accounts.user_wallet.key,
        &ctx.accounts.user_apt_spl.key,
    );
    program::invoke_signed(
        &ix,
        &[
            ctx.accounts.base_pda.clone(),
            ctx.accounts.user_wallet.clone(),
            ctx.accounts.user_info.clone(),
            ctx.accounts.user_apt_spl.clone(),
            ctx.accounts.lm_apt_vault.clone(),
            ctx.accounts.pool_summaries.clone(),
            ctx.accounts.price_summaries.clone(),
            ctx.accounts.token_program.clone(),
            ctx.program.clone(),
        ],
        ctx.signer_seeds,
    )
    .map_err(Into::into)
}
