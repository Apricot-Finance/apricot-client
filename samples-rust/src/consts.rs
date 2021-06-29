use solana_program::pubkey::Pubkey;

pub mod program {
    use solana_program::declare_id;
    // program_id
    declare_id!("HidHf4DzeZj6F7BL37WP6YnTuhh4c4DTsdSTmiFaDtSf");
}

pub mod base_pda {
    use solana_program::declare_id;
    declare_id!("JBSGCV1hPY3CTfpqDQqB4TzwnL9Mjv9ahrSGkpvnxSiM");
    pub const BUMP:u8 = 255;
}

pub mod price_pda {
    use solana_program::declare_id;
    declare_id!("BPLk2Nd5B9pggzD6i6upRqPFptLBCjQSwfKHjjLjFYNp");
    pub const BUMP:u8 = 254;
}

pub mod pool_summaries {
    use solana_program::declare_id;
    declare_id!("vmw4aLng87nsu7adSGvjzsdrN8BixFnSwtfttXx7N6T");
}

pub mod price_summaries {
    use solana_program::declare_id;
    declare_id!("G1cmF3D5PAEAjnwdMFbcGQbnBmWNH7t4hv8cpmfHzS2V");
}

pub const CMD_ADD_USER_AND_DEPOSIT: u8 = 0x10;
pub const CMD_DEPOSIT: u8 = 0x11;
pub const CMD_WITHDRAW: u8 = 0x12;
pub const CMD_BORROW: u8 = 0x13;
pub const CMD_REPAY: u8 = 0x14;
pub const CMD_EXTERN_LIQUIDATE: u8 = 0x15;
pub const CMD_SELF_LIQUIDATE: u8 = 0x16;
pub const CMD_UPDATE_USER_CONFIG: u8 = 0x17;
pub const CMD_MARGIN_SWAP: u8 = 0x18;
pub const CMD_UPDATE_USER_ASSET_CONFIG: u8 = 0x19;
pub const CMD_WITHDRAW_AND_REMOVE_USER: u8 = 0x1a;
