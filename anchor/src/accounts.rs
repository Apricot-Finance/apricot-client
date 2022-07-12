use anchor_lang::prelude::*;

#[derive(Accounts, Clone)]
pub struct AddUserAndDeposit<'info> {
    /// CHECK: OK
    #[account(signer, mut)]
    pub user_wallet: AccountInfo<'info>,
    /// CHECK: OK
    #[account(mut)]
    pub user_pages_stats: AccountInfo<'info>,
    /// CHECK: OK
    #[account(mut)]
    pub users_page: AccountInfo<'info>,
    /// CHECK: OK
    #[account(mut)]
    pub price_summaries: AccountInfo<'info>,
    pub system_program: AccountInfo<'info>,

    pub lend: Lend<'info>,
}

#[derive(Accounts, Clone)]
pub struct Deposit<'info> {
    /// CHECK: OK
    #[account(signer)]
    pub user_wallet: AccountInfo<'info>,
    /// CHECK: OK
    #[account(mut)]
    pub price_summaries: AccountInfo<'info>,

    pub lend: Lend<'info>,
}

#[derive(Accounts, Clone)]
pub struct Withdraw<'info> {
    /// CHECK: OK
    #[account(signer)]
    pub user_wallet: AccountInfo<'info>,
    /// CHECK: OK
    pub base_pda: AccountInfo<'info>,
    /// CHECK: OK
    pub price_summaries: AccountInfo<'info>,

    pub lend: Lend<'info>,
}

#[derive(Accounts, Clone)]
pub struct Lend<'info> {
    /// CHECK: OK
    #[account(mut)]
    pub user_spl: AccountInfo<'info>,
    /// CHECK: OK
    #[account(mut)]
    pub user_info: AccountInfo<'info>,
    /// CHECK: OK
    #[account(mut)]
    pub asset_pool: AccountInfo<'info>,
    /// CHECK: OK
    #[account(mut)]
    pub asset_pool_spl: AccountInfo<'info>,
    /// CHECK: OK
    #[account(mut)]
    pub pool_summaries: AccountInfo<'info>,
    /// CHECK: OK
    pub token_program: AccountInfo<'info>,
}

#[derive(Accounts, Clone)]
pub struct ClaimAptRewards<'info> {
    /// CHECK: OK
    #[account(signer)]
    pub user_wallet: AccountInfo<'info>,
    /// CHECK: OK
    pub base_pda: AccountInfo<'info>,
    /// CHECK: OK
    #[account(mut)]
    pub user_info: AccountInfo<'info>,
    /// CHECK: OK
    #[account(mut)]
    pub user_apt_spl: AccountInfo<'info>,
    /// CHECK: OK
    #[account(mut)]
    pub lm_apt_vault: AccountInfo<'info>,
    /// CHECK: OK
    #[account(mut)]
    pub pool_summaries: AccountInfo<'info>,
    /// CHECK: OK
    pub price_summaries: AccountInfo<'info>,
    /// CHECK: OK
    pub token_program: AccountInfo<'info>,
}
