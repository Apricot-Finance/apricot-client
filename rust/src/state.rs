
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

pub const MAX_ASSETS_PER_USER:usize = 16;

#[repr(packed)]
// this layout will be updated as we introduce reward program on mainnet
pub struct UserInfo {
    pub page_id: u16,

    pub num_assets:u8,
    pub user_asset_info: [UserAssetInfo; MAX_ASSETS_PER_USER],
}

/*
You can use this for deserialization:
    utils::cast::<UserInfo>(data)
 */
