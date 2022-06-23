use crate::utils;
use solana_program::{account_info::AccountInfo, program_error::ProgramError, pubkey::Pubkey};
use std::cell::Ref;
use std::fmt::{Display, Formatter, Result as FormatResult};
use std::ops::{Add, Mul, Sub};

pub const NATIVE_RAW_SHIFT: usize = 24;

#[repr(packed)]
#[derive(Copy, Clone, Eq, PartialEq, PartialOrd, Ord, Debug)]
/**
 * RawAmt to accrue interest with boosted precision
*/
pub struct RawAmt {
    amt: u128,
}

impl RawAmt {
    pub fn to_native_amount(&self) -> u64 {
        (self.amt >> NATIVE_RAW_SHIFT) as u64
    }
}

pub const MAX_ASSETS_PER_USER: usize = 16;

#[repr(packed)]
#[derive(Copy, Clone, Debug)]
pub struct UserAssetInfo {
    pub pool_id: u8,
    pub use_as_collateral: u8,

    pub deposit_amount: RawAmt,
    pub deposit_interests: u64, // spl amount
    pub deposit_index: f64,
    pub reward_deposit_amount: f64, // spl amount in f64, doesn't have to be that precise
    pub reward_deposit_index: f64,

    pub borrow_amount: RawAmt,
    pub borrow_interests: u64, // spl amount
    pub borrow_index: f64,
    pub reward_borrow_amount: f64, // spl amount in f64, doesn't have to be that precise
    pub reward_borrow_index: f64,
}

impl Display for UserAssetInfo {
    #[allow(unaligned_references)]
    fn fmt(&self, f: &mut Formatter<'_>) -> FormatResult {
        writeln!(
            f,
            "pool_id: {}, use_as_collateral: {}",
            self.pool_id, self.use_as_collateral
        )?;
        writeln!(
            f,
            "deposit_native_amount: {}, deposit_native_interest: {}, deposit_apt_reward_native_amount: {}",
            self.deposit_amount.to_native_amount(), self.deposit_interests, self.reward_deposit_amount
        )?;
        writeln!(
            f,
            "borrow_native_amount: {}, borrow_native_interest: {}, borrow_apt_reward_native_amount: {}",
            self.borrow_amount.to_native_amount(), self.borrow_interests, self.reward_borrow_amount
        )?;
        Ok(())
    }
}

#[repr(packed)]
#[derive(Copy, Clone, Debug)]
pub struct RewardInfo {
    pub vesting: [f64; 4], // retro vesting
    pub prev_week_apt: f64,
    pub unused: [f64; 2],
    pub vesting_apt: f64,
    pub available_apt: f64,
    pub available_mnde: f64,
    pub available_wldo: f64,     // wormhole lido
    pub available_b180socn: f64, // b180socn
    pub available_wluna: f64,    // wormhole luna
}

impl Display for RewardInfo {
    #[allow(unaligned_references)]
    fn fmt(&self, f: &mut Formatter<'_>) -> FormatResult {
        writeln!(
            f,
            "earning_apt: {}, vesting_apt: {}",
            self.prev_week_apt, self.vesting_apt
        )?;
        writeln!(
            f,
            "available_apt: {}, available_mnde: {}, available_wldo: {}, available_b180socn: {}, available_wluna: {}",
            self.available_apt,
            self.available_mnde,
            self.available_wldo,
            self.available_b180socn,
            self.available_wluna
        )?;
        Ok(())
    }
}

#[repr(packed)]
#[derive(Copy, Clone, Debug)]
pub struct UserInfo {
    pub page_id: u16,
    pub num_assets: u8,
    pub user_asset_info: [UserAssetInfo; MAX_ASSETS_PER_USER],
    pub reward: RewardInfo,
    pub pad: [u8; 8],
    pub last_vest_cutoff_timestamp: u64,
    pub last_update_timestamp: u64,
}

impl UserInfo {
    pub fn from_account_info<'a>(acc_info: &'a AccountInfo) -> Result<Ref<'a, Self>, ProgramError> {
        let data_ref = acc_info.try_borrow_data()?;
        let bytes_ref = Ref::map(data_ref, |d| *d);
        let user_info = Ref::map(bytes_ref, |b| utils::cast::<UserInfo>(b));
        Ok(user_info)
    }

    pub fn from_bytes(data: &[u8]) -> &Self {
        utils::cast::<Self>(data)
    }
}

impl Display for UserInfo {
    #[allow(unaligned_references)]
    fn fmt(&self, f: &mut Formatter<'_>) -> FormatResult {
        writeln!(
            f,
            "page_id: {}, num_assets: {}",
            self.page_id, self.num_assets
        )?;
        for i in 0..self.num_assets as usize {
            writeln!(f, "user_asset_info: {}", self.user_asset_info[i])?;
        }
        writeln!(f, "reward: {}", self.reward)?;
        writeln!(
            f,
            "last_vest_cutoff_timestamp: {}, last_update_timestamp: {}",
            self.last_vest_cutoff_timestamp, self.last_update_timestamp
        )?;
        Ok(())
    }
}

pub const TOKEN_NAME_SIZE: usize = 32;
#[repr(packed)]
#[derive(Copy, Clone, Debug)]
pub struct AssetPool {
    pub token_name: [u8; TOKEN_NAME_SIZE],

    pub mint_key: Pubkey,
    // 9 - token_decimal
    pub mint_decimal_multiplier: u64,
    pub pool_id: u8,

    // deposits
    pub deposit_amount: RawAmt,
    pub deposit_index: f64,

    // borrows
    pub borrow_amount: RawAmt,
    pub borrow_index: f64,

    // fees
    pub reserve_factor: f64,
    pub fee_amount: RawAmt,
    pub fee_withdrawn_amount: u64,
    pub current_fee_rate: f64,

    pub last_update_time: u64,

    // related keys
    pub spl_key: Pubkey,
    pub atoken_mint_key: Pubkey,
    pub asset_price_key: Pubkey,
    pub pyth_price_key: Pubkey,

    // used for creating unique client order IDs when we place orders on serum
    pub serum_next_cl_id: u64,

    pub ltv: f64,
    pub safe_factor: f64,
    pub flags: u8,

    // interest rate parameters
    pub base_rate: f64,
    pub multiplier: f64,
    pub jump_multiplier: f64,
    pub kink: f64,
    pub current_borrow_rate: f64,  // interest per year, APR
    pub current_deposit_rate: f64, // interest per year, APR

    pub reward_multiplier: f64,
    pub reward_deposit_intra_share: f64, // < 1.0

    // reward/second allocated to the entire pool
    pub reward_apr_per_year: u64,
    pub deposit_apt_reward_amount_per_year: u64,
    pub borrow_apt_reward_amount_per_year: u64,
    pub apt_reward_per_year_per_deposit: f64,
    pub apt_reward_per_year_per_borrow: f64,

    // The integral in Equation (2) from design.md
    pub reward_deposit_index: f64,
    pub reward_borrow_index: f64,

    pub deposit_cap: u64,
    pub is_disabled: u8,

    pub farm_yield: f64,
}

impl AssetPool {
    pub fn from_account_info<'a>(acc_info: &'a AccountInfo) -> Result<Ref<'a, Self>, ProgramError> {
        let data_ref = acc_info.try_borrow_data()?;
        let bytes_ref = Ref::map(data_ref, |d| *d);
        let asset_pool = Ref::map(bytes_ref, |b| utils::cast::<AssetPool>(b));
        Ok(asset_pool)
    }

    pub fn from_bytes(data: &[u8]) -> &Self {
        utils::cast::<Self>(data)
    }

    pub fn calculate_new_interest_rate(
        self,
        deposit_native_amt: u64,
        borrow_native_amt: u64,
    ) -> (f64, f64) {
        let new_deposit_native_amt =
            deposit_native_amt.add(self.deposit_amount.to_native_amount()) as f64;
        let new_borrow_native_amt =
            borrow_native_amt.add(self.borrow_amount.to_native_amount()) as f64;

        Self::calculate_interest_rate(
            new_deposit_native_amt,
            new_borrow_native_amt,
            self.base_rate,
            self.multiplier,
            self.jump_multiplier,
            self.kink,
            self.reserve_factor,
        )
    }

    pub fn calculate_interest_rate(
        deposit_amt: f64,
        borrow_amt: f64,
        base_rate: f64,
        multiplier: f64,
        jump_multiplier: f64,
        kink: f64,
        reserve_factor: f64,
    ) -> (f64, f64) {
        let utilization_rate = if deposit_amt == 0.0 {
            0.0
        } else {
            borrow_amt / deposit_amt
        };
        let mut borrow_rate = base_rate;
        if utilization_rate <= kink {
            borrow_rate = borrow_rate.add(multiplier.mul(utilization_rate));
        } else {
            borrow_rate = borrow_rate.add(multiplier.mul(kink));
            borrow_rate = borrow_rate.add(jump_multiplier.mul(utilization_rate.sub(kink)));
        }

        let deposit_rate = borrow_rate.mul(utilization_rate).mul(1.0 - reserve_factor);
        (deposit_rate, borrow_rate)
    }
}

impl Display for AssetPool {
    #[allow(unaligned_references)]
    fn fmt(&self, f: &mut Formatter<'_>) -> FormatResult {
        writeln!(f, "pool_id: {}", self.pool_id)?;
        writeln!(f, "mint: {}", self.mint_key)?;
        writeln!(f, "last_update_time: {}", self.last_update_time)?;
        writeln!(f, "ltv: {}", self.ltv)?;
        writeln!(f, "safe_factor: {}", self.safe_factor)?;
        writeln!(f, "deposit_cap: {}", self.deposit_cap)?;
        writeln!(
            f,
            "deposit_amount: {}",
            self.deposit_amount.to_native_amount()
        )?;
        writeln!(f, "deposit_interest_rate: {}", self.current_deposit_rate)?;
        writeln!(
            f,
            "deposit_apt_reward_amount_per_year: {}",
            self.deposit_apt_reward_amount_per_year
        )?;
        writeln!(
            f,
            "borrow_amount: {}",
            self.borrow_amount.to_native_amount()
        )?;
        writeln!(f, "borrow_interest_rate: {}", self.current_borrow_rate)?;
        writeln!(
            f,
            "borrow_apt_reward_amount_per_year: {}",
            self.borrow_apt_reward_amount_per_year
        )?;
        writeln!(f, "farm_yield: {}", self.farm_yield)?;
        Ok(())
    }
}

#[cfg(test)]
pub mod asset_pool_test {
    use super::*;

    #[test]
    fn test_calculate_interest_rate() {
        let (mut deposit_rate, mut borrow_rate) = AssetPool::calculate_interest_rate(
            6674310936768f64,
            4307894688295f64,
            0.01,
            0.0823529411764706,
            6.133333333333333,
            0.85,
            0.2,
        );

        assert!(0.032610 - deposit_rate < 1.0e-6);
        assert!(0.063154 - borrow_rate < 1.0e-6);

        (deposit_rate, borrow_rate) = AssetPool::calculate_interest_rate(
            (6674310936768u64 + 10_000_000_000) as f64,
            (4307894688295u64 + 100_000_000) as f64,
            0.01,
            0.0823529411764706,
            6.133333333333333,
            0.85,
            0.2,
        );

        assert!(
            0.032522 - deposit_rate < 1.0e-6,
            "deposit_rate:{} doesn't match",
            deposit_rate
        );
        assert!(
            0.063076 - borrow_rate < 1.0e-6,
            "borrow_rate:{} doesn't match",
            borrow_rate
        );
    }
}
