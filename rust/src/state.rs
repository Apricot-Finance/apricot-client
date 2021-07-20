
#[repr(packed)]
#[derive(Copy, Clone, Eq, PartialEq, PartialOrd, Ord)]
pub struct RawAmt {
    // we use RawAmt to accrue interest with boosted precision
    amt:u128,
}

impl RawAmt {
    pub fn to_native_amount(&self) -> u64 {
        (self.amt >> 24) as u64
    }
}

#[repr(packed)]
#[derive(Copy, Clone)]
// this layout will be updated as we introduce reward program on mainnet
pub struct UserAssetInfo {
    pub pool_id: u8,
    pub use_as_collateral: u8,
    pub deposit_amount: RawAmt,
    pub deposit_index: f64,
    pub borrow_amount: RawAmt,
    pub borrow_index: f64,
}

pub const MAX_ASSETS_PER_USER:usize = 16;

#[repr(packed)]
// this layout will be updated as we introduce reward program on mainnet
pub struct UserInfo {
    pub page_id: u16,
    pub self_liquidation_threshold: u8,
    pub post_self_liquidation_ratio_target: u8,
    pub post_extern_liquidation_ratio_target: u8,

    pub num_assets:u8,
    pub user_asset_info: [UserAssetInfo; MAX_ASSETS_PER_USER],
}

/*
You can use this for deserialization:
    utils::cast::<UserInfo>(data)
 */
