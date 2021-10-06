import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { AccountMeta, PublicKey, SYSVAR_CLOCK_PUBKEY } from "@solana/web3.js";
import { SWAP_RAYDIUM } from ".";
import { TokenID, TokenCategory, AppConfig, Dex } from "../types";
import { SWAP_ORCA, SWAP_SABER } from "./commands";

export const MINTS: { [key in TokenID]: PublicKey } = {
  [TokenID.BTC]: new PublicKey("9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E"),
  [TokenID.ETH]: new PublicKey("2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk"),
  [TokenID.SOL]: new PublicKey("So11111111111111111111111111111111111111112"),

  [TokenID.RAY]: new PublicKey("4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"),
  [TokenID.ORCA]: new PublicKey("orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE"),
  [TokenID.SBR]: new PublicKey("Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1"),
  [TokenID.MERC]: new PublicKey("MERt85fc5boKw3BW1eYdxonEuJNvXbiMbs6hvheau5K"),

  [TokenID.USDT]: new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"),
  [TokenID.USDC]: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
  [TokenID.UST]: new PublicKey("CXLBjMMcwkc17GfJtBos6rQCo1ypeH6eDbB82Kby4MRm"),
  [TokenID.USDT_USDC_SABER]: new PublicKey("2poo1w1DL6yd2WNTCnNTzDqkC6MBXq7axo77P16yrBuf"),
  [TokenID.USDC_USDT_ORCA]: new PublicKey("H2uzgruPvonVpCRhwwdukcpXK8TG17swFNzYFr2rtPxy"),
  [TokenID.UST_USDC_SABER]: new PublicKey("UST32f2JtPGocLzsL41B3VBBoJzTm1mK1j3rwyM3Wgc"),
  [TokenID.SOL_USDC_RAYDIUM]: new PublicKey("8HoQnePLqPj4M7PUDzfw8e3Ymdwgc7NLGnaTUapubyvu"),
};

export const DECIMAL_MULT: { [key in TokenID]: number } = {
  [TokenID.BTC] : 1e6,
  [TokenID.ETH] : 1e6,
  [TokenID.SOL] : 1e9,

  [TokenID.RAY] : 1e6,
  [TokenID.ORCA] : 1e6,
  [TokenID.SBR] : 1e6,
  [TokenID.MERC] : 1e6,

  [TokenID.USDT]: 1e6,
  [TokenID.USDC]: 1e6,
  [TokenID.UST] : 1e9,
  [TokenID.USDT_USDC_SABER]: 1e6,
  [TokenID.USDC_USDT_ORCA]: 1e6,
  [TokenID.UST_USDC_SABER]: 1e9,
  [TokenID.SOL_USDC_RAYDIUM]: 1e9,
};

export const CATEGORY: { [key in TokenID]: TokenCategory } = {
  [TokenID.BTC] : TokenCategory.Volatile,
  [TokenID.ETH] : TokenCategory.Volatile,
  [TokenID.SOL] : TokenCategory.Volatile,

  [TokenID.RAY] : TokenCategory.Volatile,
  [TokenID.ORCA] : TokenCategory.Volatile,
  [TokenID.SBR] : TokenCategory.Volatile,
  [TokenID.MERC] : TokenCategory.Volatile,

  [TokenID.USDT]: TokenCategory.Stable,
  [TokenID.USDC]: TokenCategory.Stable,
  [TokenID.UST] : TokenCategory.Stable,
  [TokenID.USDT_USDC_SABER]: TokenCategory.Lp,
  [TokenID.USDC_USDT_ORCA]: TokenCategory.Lp,
  [TokenID.UST_USDC_SABER]: TokenCategory.Lp,
  [TokenID.SOL_USDC_RAYDIUM]: TokenCategory.Lp,
};

export const LIQUIDATION_DISCOUNT: { [key in TokenID]?: number } = {
  [TokenID.BTC] : 0.04,
  [TokenID.ETH] : 0.04,
  [TokenID.SOL] : 0.04,
  [TokenID.USDT]: 0.04,
  [TokenID.USDC]: 0.04,
  [TokenID.UST] : 0.04,
  [TokenID.USDT_USDC_SABER]: 0,
  [TokenID.USDC_USDT_ORCA]: 0,
  [TokenID.UST_USDC_SABER]: 0,
  [TokenID.SOL_USDC_RAYDIUM]: 0,
};

export const LP_TO_LR: { [key in TokenID]?: [TokenID, TokenID] } = {
  [TokenID.USDT_USDC_SABER] : [TokenID.USDT, TokenID.USDC],
  [TokenID.USDC_USDT_ORCA] : [TokenID.USDC, TokenID.USDT],
  [TokenID.UST_USDC_SABER] : [TokenID.UST, TokenID.USDC],
  [TokenID.SOL_USDC_RAYDIUM]: [TokenID.SOL, TokenID.USDC],
};

export const LP_TO_TARGET_SWAP: { [key in TokenID]?: number } = {
  [TokenID.USDT_USDC_SABER] : SWAP_SABER,
  [TokenID.USDC_USDT_ORCA] : SWAP_ORCA,
  [TokenID.UST_USDC_SABER] : SWAP_SABER,
  [TokenID.SOL_USDC_RAYDIUM]: SWAP_RAYDIUM,
};

export const LP_TO_DEX: { [key in TokenID]?: Dex } = {
  [TokenID.USDT_USDC_SABER] : Dex.Saber,
  [TokenID.USDC_USDT_ORCA] : Dex.Orca,
  [TokenID.UST_USDC_SABER] : Dex.Saber,
  [TokenID.SOL_USDC_RAYDIUM]: Dex.Raydium,
};

// alpha mainnet is where we deploy tests
export const ALPHA_CONFIG = new AppConfig(
  new PublicKey("5dtKmAzoJu4qDxMjjK7gWY2pPe6NWAX6HWQk5QUHaKQZ"),
  new PublicKey("EFo9V7mFQgxz7xPMrJ6qLyrjfGXPgsEFEfGEtVQx2xKt"),
  new PublicKey("3cWR2VDrVhQ43VX8B43MwTazfx66naioXurUh8vrkidt"),
  MINTS,
  DECIMAL_MULT,
  CATEGORY,
  {
    [TokenID.BTC]: 0,
    [TokenID.ETH]: 1,
    [TokenID.USDT]: 2,
    [TokenID.USDC]: 3,
    [TokenID.SOL]: 4,
    [TokenID.USDT_USDC_SABER]: 5,
    [TokenID.UST]: 6,
    // pool 7 deprecated
    [TokenID.USDC_USDT_ORCA]: 8,
  },
  LIQUIDATION_DISCOUNT,
  {
    [TokenID.BTC]: 0.85,
    [TokenID.ETH]: 0.85,
    [TokenID.USDT]: 0.91,
    [TokenID.USDC]: 0.91,
    [TokenID.SOL]: 0.8,
    [TokenID.USDT_USDC_SABER]: 0.8,
    [TokenID.UST]: 0.8,
    [TokenID.USDC_USDT_ORCA]: 0.8,
  },
  LP_TO_LR,
  LP_TO_DEX,
  LP_TO_TARGET_SWAP,
);

// public mainnet is where the real thing is
export const PUBLIC_CONFIG = new AppConfig(
  // not added yet
  new PublicKey("5dtKmAzoJu4qDxMjjK7gWY2pPe6NWAX6HWQk5QUHaKQZ"),
  new PublicKey("5dtKmAzoJu4qDxMjjK7gWY2pPe6NWAX6HWQk5QUHaKQZ"),
  new PublicKey("5dtKmAzoJu4qDxMjjK7gWY2pPe6NWAX6HWQk5QUHaKQZ"),
  MINTS,
  DECIMAL_MULT,
  CATEGORY,
  { },
  LIQUIDATION_DISCOUNT,
  { },
  LP_TO_LR,
  LP_TO_DEX,
  LP_TO_TARGET_SWAP,
);


interface LpSwapKeyInfo {
  getLpDepositKeys : (ownerKey: PublicKey) => Promise<AccountMeta[]>;
  getLpWithdrawKeys : (ownerKey: PublicKey) => Promise<AccountMeta[]>;
  getLpStakeKeys : (ownerKey: PublicKey) => Promise<AccountMeta[]>;
}

// meta-info used by Addresses to compute keys needed when interacting with various Solana swaps
// check out Addresses to see how they are used
export const SWAP_METAS = {
  [SWAP_SABER]: {
    stake_program: new PublicKey("QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB"),
    deposit_program: new PublicKey("SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ"),
    redeem_program: new PublicKey("RDM23yr8pr1kEAmhnFpaabPny6C9UVcEcok3Py5v86X"),
  },
  [SWAP_ORCA]: {
    depositProgramPubkey: new PublicKey("9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP"),
    farmProgramPubkey: new PublicKey("82yxjeMsvaURa4MbZZ7WZZHfobirZYkH1zF8fmeGtyaQ"),
  }
};

export const LP_SWAP_METAS = {
  [TokenID.USDT_USDC_SABER]: {
    // for deposit/withdraw
    swap:           new PublicKey("YAkoNb6HKmSxQN9L8hiBE5tPJRsniSSMzND1boHmZxe"),
    swapAuthority:  new PublicKey("5C1k9yV7y4CjMnKv8eGYDgWND8P89Pdfj79Trk2qmfGo"),
    tokenAVault:    new PublicKey("CfWX7o2TswwbxusJ4hCaPobu2jLCb1hfXuXJQjVq3jQF"), // USDC
    tokenBVault:    new PublicKey("EnTrdMMpdhugeH6Ban6gYZWXughWxKtVGfCwFn78ZmY3"), // USDT
    tokenAfees:     new PublicKey("GLztedC76MeBXjAmVXMezcHQzdmQaVLiXCZr9KEBSR6Y"), // USDC
    tokenBfees:     new PublicKey("2SL8iP8EjnUr6qTkbkfZt9tauXwJgc4GKXkYCCbLGbVP"), // USDT

    // for stake/unstake
    quarry:       new PublicKey("Hs1X5YtXwZACueUtS9azZyXFDWVxAMLvm3tttubpK7ph"),
    rewarder:     new PublicKey("rXhAofQCT7NN9TUqigyEAUzV1uLL4boeD8CRkNBSkYk"),
    mint:         new PublicKey(MINTS[TokenID.USDT_USDC_SABER]),
    miner:        new PublicKey("ABVss1hKp45vc6mFKe4r1eMgpbg5jhkQQGZzNTa2H7yg"), // computed using getMinerKey(base_pda)
    miner_vault:  new PublicKey("ADPL7KKvjjQZ7gs7B15VvyqAV6xEP8pM8HNNvpMrb7DP"),

    getMinerKey: async (ownerKey: PublicKey): Promise<[PublicKey, number]> => {
      const [key, bump] = await PublicKey.findProgramAddress([
        Buffer.from("Miner"),
        LP_SWAP_METAS[TokenID.USDT_USDC_SABER]!.quarry.toBuffer(),
        ownerKey.toBuffer(),
      ], SWAP_METAS[SWAP_SABER].stake_program);
      return [key, bump];
    },

    getLpDepositKeys: async (_ownerKey: PublicKey) => {
      /*
      - saber_lp_program
      - swap
      - swap authority
      - swap_token_a_vault
      - swap_token_b_vault
      - pool_mint
      - clock
      */
      const smeta = SWAP_METAS[SWAP_SABER];
      const smetalp = LP_SWAP_METAS[TokenID.USDT_USDC_SABER];
      return [
        {pubkey: smeta.deposit_program,         isSigner: false, isWritable: false},

        {pubkey: smetalp.swap,                  isSigner: false, isWritable: false},
        {pubkey: smetalp.swapAuthority,         isSigner: false, isWritable: false},

        {pubkey: smetalp.tokenAVault,           isSigner: false, isWritable: true},
        {pubkey: smetalp.tokenBVault,           isSigner: false, isWritable: true},

        {pubkey: smetalp.mint,                  isSigner: false, isWritable: true},
        {pubkey: SYSVAR_CLOCK_PUBKEY,           isSigner: false, isWritable: false},
      ];
    },

    getLpWithdrawKeys: async () => {
      /*
      - saber_lp_program
      - swap
      - swap authority
      - lp_mint
      - swap_token_a_vault
      - swap_token_b_vault
      - swap_token_a_fees
      - swap_token_b_fees
      - clock
      */
      const smeta = SWAP_METAS[SWAP_SABER];
      const smetalp = LP_SWAP_METAS[TokenID.USDT_USDC_SABER];
      return [
        {pubkey: smeta.deposit_program,   isSigner: false, isWritable: false},

        {pubkey: smetalp.swap,            isSigner: false, isWritable: false},
        {pubkey: smetalp.swapAuthority,   isSigner: false, isWritable: false},

        {pubkey: smetalp.mint,            isSigner: false, isWritable: true},

        {pubkey: smetalp.tokenAVault,     isSigner: false, isWritable: true},
        {pubkey: smetalp.tokenBVault,     isSigner: false, isWritable: true},

        {pubkey: smetalp.tokenAfees,      isSigner: false, isWritable: true},
        {pubkey: smetalp.tokenBfees,      isSigner: false, isWritable: true},

        {pubkey: SYSVAR_CLOCK_PUBKEY,     isSigner: false, isWritable: false},
      ];
    },

    getLpStakeKeys: async (ownerKey: PublicKey) => {
      /*
      - saber_stake_program,
      - miner
      - quarry
      - miner_vault
      - token_program
      - rewarder
      - clock
        */
      const smeta = SWAP_METAS[SWAP_SABER];
      const smetalp = LP_SWAP_METAS[TokenID.USDT_USDC_SABER];
      const [minerKey, _minerBump] = await smetalp.getMinerKey(ownerKey);
      const minerVault = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        MINTS[TokenID.USDT_USDC_SABER],
        minerKey as PublicKey,
        true,
      );
      return [
        {pubkey: smeta.stake_program,     isSigner: false, isWritable: false},
        {pubkey: minerKey,                isSigner: false, isWritable: true},
        {pubkey: smetalp.quarry,          isSigner: false, isWritable: true},
        {pubkey: minerVault,              isSigner: false, isWritable: true},
        {pubkey: TOKEN_PROGRAM_ID,        isSigner: false, isWritable: false},
        {pubkey: smetalp.rewarder,        isSigner: false, isWritable: false},
        {pubkey: SYSVAR_CLOCK_PUBKEY,     isSigner: false, isWritable: false},
      ];
    },
  },
  [TokenID.USDC_USDT_ORCA]: {
    lpMintPubkey:           new PublicKey("H2uzgruPvonVpCRhwwdukcpXK8TG17swFNzYFr2rtPxy"),

    swapPubkey:             new PublicKey("F13xvvx45jVGd84ynK3c8T89UejQVxjCLtmHfPmAXAHP"),
    swapAuthority:          new PublicKey("3cGHDS8uWhdxQj14vTmFtYHX3NMouPpE4o9MjQ43Bbf4"),

    swapTokenAAccount:      new PublicKey("6uUn2okWk5v4x9Gc4n2LLGHtWoa9tmizHq1363dW7t9W"), // usdc
    swapTokenBAccount:      new PublicKey("AiwmnLy7xPT28dqZpkRm6i1ZGwELUCzCsuN92v4JkSeU"), // usdt

    globalLpVault:          new PublicKey("9hPRfmQmZYiL4ZtuvGBk5SjMzmFCQ2h9a4GKoM82BR84"),
    farmTokenMint:          new PublicKey("GjpXgKwn4VW4J2pZdS3dovM58hiXWLJtopTfqG83zY2f"),
    globalFarmState:        new PublicKey("5psKJrxWnPmoAbCxk3An2CGh7wHAX2cWddf5vZuYbbVw"),
    globalRewardTokenVault: new PublicKey("AYbtHmuJxXpo91m988UdyTtzC6J72WvMAW7XkXqFhAbz"),
    rewardTokenAuthority:   new PublicKey("5YGvg6mfuvJtHdVWDXTs4sYy6GwQAUduK8qurDcL111S"),
    feeAccount:             new PublicKey("B4RNxMJGRzKFQyTq2Uwkmpyjtew13n7KtdqZy6qgENTu"),

    pdaFarmTokenAccount:    new PublicKey("4WBjH6U8xXoycDMtuEdMRx35R3ZBtE9z5vBP2YravvUk"),
    pdaFarmState:           new PublicKey("7jpHoqo8pw5EZD4gEBBhicZmKp3tcMH6Qp2e7WK7xVXV"),
    pdaRewardTokenAccount:  new PublicKey("14m3NvUVx7o1ctTXaPKpVeUWT6ThrMR2U2tQC3Yu2DUt"),

    getLpDepositKeys: async (_ownerKey: PublicKey) => {
      const smeta = SWAP_METAS[SWAP_ORCA];
      const smetalp = LP_SWAP_METAS[TokenID.USDC_USDT_ORCA];
      return [
        { pubkey: smeta.depositProgramPubkey, isSigner: false, isWritable: false },
        { pubkey: smetalp.swapPubkey,         isSigner: false, isWritable: false },
        { pubkey: smetalp.swapAuthority,      isSigner: false, isWritable: false },
        { pubkey: smetalp.swapTokenAAccount,  isSigner: false, isWritable: true },
        { pubkey: smetalp.swapTokenBAccount,  isSigner: false, isWritable: true },
        { pubkey: smetalp.lpMintPubkey,       isSigner: false, isWritable: true }
      ];
    },
    getLpWithdrawKeys: async (_ownerKey: PublicKey) => {
      const smeta = SWAP_METAS[SWAP_ORCA];
      const smetalp = LP_SWAP_METAS[TokenID.USDC_USDT_ORCA];
      return [
        { pubkey: smeta.depositProgramPubkey, isSigner: false, isWritable: false },
        { pubkey: smetalp.swapPubkey,         isSigner: false, isWritable: false },
        { pubkey: smetalp.swapAuthority,      isSigner: false, isWritable: false },
        { pubkey: smetalp.lpMintPubkey,       isSigner: false, isWritable: true },
        { pubkey: smetalp.swapTokenAAccount,  isSigner: false, isWritable: true },
        { pubkey: smetalp.swapTokenBAccount,  isSigner: false, isWritable: true },
        { pubkey: smetalp.feeAccount,         isSigner: false, isWritable: true }
      ];
    },
    getLpStakeKeys: async (_ownerKey: PublicKey) => {
      const smeta = SWAP_METAS[SWAP_ORCA];
      const smetalp = LP_SWAP_METAS[TokenID.USDC_USDT_ORCA];
      return [
        { pubkey: smeta.farmProgramPubkey,        isSigner: false, isWritable: false },
        { pubkey: smetalp.globalLpVault,          isSigner: false, isWritable: true },
        { pubkey: smetalp.farmTokenMint,          isSigner: false, isWritable: true },
        { pubkey: smetalp.pdaFarmTokenAccount,    isSigner: false, isWritable: true },
        { pubkey: smetalp.globalFarmState,        isSigner: false, isWritable: true },
        { pubkey: smetalp.pdaFarmState,           isSigner: false, isWritable: true },
        { pubkey: smetalp.globalRewardTokenVault, isSigner: false, isWritable: true },
        { pubkey: smetalp.pdaRewardTokenAccount,  isSigner: false, isWritable: true },
        { pubkey: smetalp.rewardTokenAuthority,   isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID,               isSigner: false, isWritable: false }
      ];
    }
  },
  [TokenID.SOL_USDC_RAYDIUM]: {
    lpMintPubkey: new PublicKey('8HoQnePLqPj4M7PUDzfw8e3Ymdwgc7NLGnaTUapubyvu'),

    ammIdPubkey: new PublicKey('58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2'),
    ammAuthPubkey: new PublicKey('5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1'),
    ammOpenOrdersPubkey: new PublicKey('HRk9CMrpq7Jn9sh7mzxE8CChHG8dneX9p475QKz4Fsfc'),
    ammTargetOrderPubkey: new PublicKey(
      'CZza3Ej4Mc58MnxWA385itCC9jCo3L1D7zc3LKy1bZMR'
    ),

    poolCoinTokenPubkey: new PublicKey('DQyrAcCrDXQ7NeoqGgDCZwBvWDcYmFCjSb9JtteuvPpz'),
    poolPcTokenPubkey: new PublicKey('HLmqeL62xR1QoZ1HKKbXRrdN1p3phKpxRMb2VVopvBBz'),
    poolWithdrawQueue: new PublicKey('G7xeGGLevkRwB5f44QNgQtrPKBdMfkT6ZZwpS9xcC97n'),
    poolTempLpTokenAccount: new PublicKey(
      'Awpt6N7ZYPBa4vG4BQNFhFxDj4sxExAA9rpBAoBw2uok'
    ),

    serumProgramId: new PublicKey('9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin'),
    serumMarketPubkey: new PublicKey('9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT'),
    serumCoinVaultAccount: new PublicKey(
      '36c6YqAwyGKQG66XEp2dJc5JqjaBNv7sVghEtJv4c7u6'
    ),
    serumPcVaultAccount: new PublicKey('8CFo8bL8mZQK8abbFyypFMwEDd8tVJjHTTojMLgQTUSZ'),
    serumVaultSigner: new PublicKey('F8Vyqk3unwxkXukZFQeYyGmFfTG3CAX4v24iyrjEYBJV'),
  },
};

export const LP_SWAP_INFO : { [key in TokenID]? : LpSwapKeyInfo } = {
  [TokenID.USDT_USDC_SABER] : LP_SWAP_METAS[TokenID.USDT_USDC_SABER] as LpSwapKeyInfo,
  [TokenID.USDC_USDT_ORCA] : LP_SWAP_METAS[TokenID.USDC_USDT_ORCA] as LpSwapKeyInfo,
};