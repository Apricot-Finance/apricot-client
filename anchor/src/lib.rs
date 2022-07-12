mod accounts;
mod instructions;
mod state;

use anchor_lang::prelude::*;
use apricot_client::consts::program::ID;
pub use {accounts::*, consts::*, instructions::*, state::*};

pub mod consts {
    pub const USER_RENT_FEE: u64 = 16_439_520;
}

#[derive(Clone)]
pub struct Apricot;

impl anchor_lang::AccountDeserialize for Apricot {
    fn try_deserialize(buf: &mut &[u8]) -> Result<Self> {
        Apricot::try_deserialize_unchecked(buf)
    }

    fn try_deserialize_unchecked(_buf: &mut &[u8]) -> Result<Self> {
        Ok(Apricot)
    }
}

impl anchor_lang::Id for Apricot {
    fn id() -> Pubkey {
        ID
    }
}
