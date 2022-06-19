export const CMD_REFRESH_USER = 0x0a;

export const CMD_ADD_USER_AND_DEPOSIT = 0x10;
export const CMD_DEPOSIT = 0x11;
export const CMD_WITHDRAW = 0x12;
export const CMD_BORROW = 0x13;
export const CMD_REPAY = 0x14;
export const CMD_EXTERN_LIQUIDATE = 0x15;
// DEPRECATED self-liquidate
export const CMD_UPDATE_USER_CONFIG = 0x17;
export const CMD_MARGIN_SWAP = 0x18;
export const CMD_UPDATE_USER_ASSET_CONFIG = 0x19;
export const CMD_WITHDRAW_AND_REMOVE_USER = 0x1a;
// export const CMD_TOKEN_DEPOSIT = 0x1b;
// export const CMD_TOKEN_WITHDRAW = 0x1c;
export const CMD_LP_CREATE = 0x1d;
export const CMD_LP_REDEEM = 0x1e;
export const CMD_LP_OP_CHECK = 0x21;
export const CMD_LP_OP_ENDCHECK = 0x22;
export const CMD_LP_STAKE = 0x23;
export const CMD_LP_UNSTAKE = 0x24;
export const CMD_CLAIM_APT_LM_REWARD = 0x29;
export const CMD_MAKE_LM_REWARD_AVAILABLE = 0x2a;
export const CMD_LP_STAKE_SECOND = 0x81;
export const CMD_LP_UNSTAKE_SECOND = 0x82;
// other trivia
// swap identifiers
export const SWAP_FAKE = 0x00;
export const SWAP_SERUM = 0x01;
export const SWAP_RAYDIUM = 0x02;
export const SWAP_SABER = 0x03;
export const SWAP_MERCURIAL = 0x04;
export const SWAP_ORCA = 0x05;

export const INVALID_PAGE = 65535;
export const AMOUNT_MULTIPLIER = 16777216;
export const MAX_ASSIST_ACTIONS = 6;
export const ASSIST_MODE_STABLE_ONLY = 2;
