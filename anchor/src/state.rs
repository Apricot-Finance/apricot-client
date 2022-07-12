use anchor_lang::solana_program::program_error::ProgramError;
use anchor_lang::solana_program::pubkey::Pubkey;
use std::ops::Deref;

#[derive(Clone)]
pub struct ApricotUser(apricot_client::state::UserInfo);

impl anchor_lang::AccountDeserialize for ApricotUser {
    fn try_deserialize_unchecked(buf: &mut &[u8]) -> anchor_lang::Result<Self> {
        let user = if buf.len() > 0 {
            Ok(*apricot_client::state::UserInfo::from_bytes(buf))
        } else {
            Err(ProgramError::UninitializedAccount)
        };

        user.map(ApricotUser).map_err(Into::into)
    }
}

impl anchor_lang::AccountSerialize for ApricotUser {}

impl anchor_lang::Owner for ApricotUser {
    fn owner() -> Pubkey {
        crate::ID
    }
}

impl Deref for ApricotUser {
    type Target = apricot_client::state::UserInfo;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[derive(Clone)]
pub struct ApricotPool(apricot_client::state::AssetPool);

impl anchor_lang::AccountDeserialize for ApricotPool {
    fn try_deserialize_unchecked(buf: &mut &[u8]) -> anchor_lang::Result<Self> {
        let pool = if buf.len() > 0 {
            Ok(*apricot_client::state::AssetPool::from_bytes(buf))
        } else {
            Err(ProgramError::UninitializedAccount)
        };

        pool.map(ApricotPool).map_err(Into::into)
    }
}

impl anchor_lang::AccountSerialize for ApricotPool {}

impl anchor_lang::Owner for ApricotPool {
    fn owner() -> Pubkey {
        crate::ID
    }
}

impl Deref for ApricotPool {
    type Target = apricot_client::state::AssetPool;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}
