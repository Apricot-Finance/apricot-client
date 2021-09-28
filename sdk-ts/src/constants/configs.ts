import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { AccountMeta, PublicKey, SYSVAR_CLOCK_PUBKEY } from "@solana/web3.js";
import { TokenID, AppConfig } from "../types";
import { SWAP_ORCA, SWAP_SABER } from "./commands";

export const MINTS: { [key in TokenID]: PublicKey } = {
  [TokenID.BTC]: new PublicKey("9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E"),
  [TokenID.ETH]: new PublicKey("2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk"),
  [TokenID.SOL]: new PublicKey("So11111111111111111111111111111111111111112"),
  [TokenID.USDT]: new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"),
  [TokenID.USDC]: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
  [TokenID.UST]: new PublicKey("CXLBjMMcwkc17GfJtBos6rQCo1ypeH6eDbB82Kby4MRm"),
  [TokenID.USDT_USDC_SABER]: new PublicKey("2poo1w1DL6yd2WNTCnNTzDqkC6MBXq7axo77P16yrBuf"),
  [TokenID.USDC_USDT_ORCA]: new PublicKey("H2uzgruPvonVpCRhwwdukcpXK8TG17swFNzYFr2rtPxy"),
  [TokenID.UST_USDC_SABER]: new PublicKey("UST32f2JtPGocLzsL41B3VBBoJzTm1mK1j3rwyM3Wgc"),
};

export const DECIMAL_MULT: { [key in TokenID]: number } = {
  [TokenID.BTC] : 1e6,
  [TokenID.ETH] : 1e6,
  [TokenID.SOL] : 1e9,
  [TokenID.USDT]: 1e6,
  [TokenID.USDC]: 1e6,
  [TokenID.UST] : 1e9,
  [TokenID.USDT_USDC_SABER]: 1e6,
  [TokenID.USDC_USDT_ORCA]: 1e6,
  [TokenID.UST_USDC_SABER]: 1e9,
};

export const LP_TO_LR: { [key in TokenID]?: [TokenID, TokenID] } = {
  [TokenID.USDT_USDC_SABER] : [TokenID.USDT, TokenID.USDC],
  [TokenID.USDC_USDT_ORCA] : [TokenID.USDC, TokenID.USDT],
  [TokenID.UST_USDC_SABER] : [TokenID.UST, TokenID.USDC],
};

export const LP_TO_TARGET_SWAP: { [key in TokenID]?: number } = {
  [TokenID.USDT_USDC_SABER] : SWAP_SABER,
  [TokenID.USDC_USDT_ORCA] : SWAP_ORCA,
  [TokenID.UST_USDC_SABER] : SWAP_SABER,
};

// alpha mainnet is where we deploy tests
export const ALPHA_CONFIG = new AppConfig(
  new PublicKey("5dtKmAzoJu4qDxMjjK7gWY2pPe6NWAX6HWQk5QUHaKQZ"),
  new PublicKey("EFo9V7mFQgxz7xPMrJ6qLyrjfGXPgsEFEfGEtVQx2xKt"),
  MINTS,
  {
    [TokenID.BTC]: 0,
    [TokenID.ETH]: 1,
    [TokenID.USDT]: 2,
    [TokenID.USDC]: 3,
    [TokenID.SOL]: 4,
    [TokenID.USDT_USDC_SABER]: 5,
  }
);

// public mainnet is where the real thing is
export const PUBLIC_CONFIG = new AppConfig(
  // not added yet
  new PublicKey("5dtKmAzoJu4qDxMjjK7gWY2pPe6NWAX6HWQk5QUHaKQZ"),
  new PublicKey("5dtKmAzoJu4qDxMjjK7gWY2pPe6NWAX6HWQk5QUHaKQZ"),
  MINTS,
  { }
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
  },
  [SWAP_ORCA]: {
    depositProgramPubkey: new PublicKey("9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP"),
    farmProgramPubkey: new PublicKey("82yxjeMsvaURa4MbZZ7WZZHfobirZYkH1zF8fmeGtyaQ"),
  }
};

const LP_SWAP_METAS = {
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

    getMinerKey: async (ownerKey: PublicKey) => {
      const [key, bump] = await PublicKey.findProgramAddress([
        Buffer.from("Miner"),
        LP_SWAP_METAS[TokenID.USDT_USDC_SABER]!.quarry.toBuffer(),
        ownerKey.toBuffer(),
      ], SWAP_METAS[SWAP_SABER].stake_program);
      return [key, bump];
    },

    getLpDepositKeys: async (ownerKey: PublicKey) => {
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

    getLpDepositKeys: async (ownerKey: PublicKey) => {
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
    getLpWithdrawKeys: async (ownerKey: PublicKey) => {
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
    getLpStakeKeys: async (ownerKey: PublicKey) => {
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
  }
};

export const LP_SWAP_INFO : { [key in TokenID]? : LpSwapKeyInfo } = {
  [TokenID.USDT_USDC_SABER] : LP_SWAP_METAS[TokenID.USDT_USDC_SABER] as LpSwapKeyInfo,
  [TokenID.USDC_USDT_ORCA] : LP_SWAP_METAS[TokenID.USDC_USDT_ORCA] as LpSwapKeyInfo,
};