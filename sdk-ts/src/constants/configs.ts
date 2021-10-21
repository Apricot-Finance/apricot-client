import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey, SYSVAR_CLOCK_PUBKEY } from "@solana/web3.js";
import invariant from "tiny-invariant";
import { SWAP_RAYDIUM } from ".";
import { getAssociatedTokenPubkey } from "..";
import { TokenID, TokenCategory, AppConfig, Dex, PoolId, LpSwapKeyInfo } from "../types";
import { SWAP_ORCA, SWAP_SABER } from "./commands";

export const MINTS: { [key in TokenID]: PublicKey } = {
  [TokenID.BTC]: new PublicKey("9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E"),
  [TokenID.ETH]: new PublicKey("2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk"),
  [TokenID.SOL]: new PublicKey("So11111111111111111111111111111111111111112"),
  [TokenID.mSOL]: new PublicKey("mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So"),

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
  [TokenID.RAY_USDC_RAYDIUM]: new PublicKey("FbC6K13MzHvN42bXrtGaWsvZY9fxrackRSZcBGfjPc7m"),
  [TokenID.SOL_USDT_RAYDIUM]: new PublicKey("Epm4KfTj4DMrvqn6Bwg2Tr2N8vhQuNbuK8bESFp4k33K"),
  [TokenID.SOL_USDC_ORCA]: new PublicKey("APDFRM3HMr8CAGXwKHiu2f5ePSpaiEJhaURwhsRrUUt9"),
  [TokenID.mSOL_SOL_ORCA]: new PublicKey("29cdoMgu6MS2VXpcMo1sqRdWEzdUR9tjvoh8fcK8Z87R"),
  [TokenID.ORCA_USDC_ORCA]: new PublicKey("n8Mpu28RjeYD7oUX3LG1tPxzhRZh3YYLRSHcHRdS3Zx"),
  [TokenID.ORCA_SOL_ORCA]: new PublicKey("2uVjAuRXavpM6h1scGQaxqb6HVaNRn6T2X7HHXTabz25"),
};

export const DECIMAL_MULT: { [key in TokenID]: number } = {
  [TokenID.BTC] : 1e6,
  [TokenID.ETH] : 1e6,
  [TokenID.SOL] : 1e9,
  [TokenID.mSOL]: 1e9,

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
  [TokenID.RAY_USDC_RAYDIUM]: 1e6,
  [TokenID.SOL_USDT_RAYDIUM]: 1e9,
  [TokenID.SOL_USDC_ORCA]: 1e6,
  [TokenID.mSOL_SOL_ORCA]: 1e6,
  [TokenID.ORCA_USDC_ORCA]: 1e6,
  [TokenID.ORCA_SOL_ORCA]: 1e6,
};

const POOL_IDS: { [key in TokenID]?: PoolId } = {
  [TokenID.BTC]: 0,
  [TokenID.ETH]: 1,
  [TokenID.USDT]: 2,
  [TokenID.USDC]: 3,
  [TokenID.SOL]: 4,
  [TokenID.USDT_USDC_SABER]: 5,
  [TokenID.UST]: 6,
  // pool 7 deprecated
  [TokenID.USDC_USDT_ORCA]: 8,
  [TokenID.SOL_USDC_RAYDIUM]: 9,
  [TokenID.RAY_USDC_RAYDIUM]: 10,
  [TokenID.RAY]: 11,
  [TokenID.mSOL]: 12,
  [TokenID.ORCA]: 13,
  [TokenID.SOL_USDT_RAYDIUM]: 14,
  [TokenID.SOL_USDC_ORCA]: 15,
  [TokenID.mSOL_SOL_ORCA]: 16,
  [TokenID.ORCA_USDC_ORCA]: 17,
  [TokenID.ORCA_SOL_ORCA]: 18,
};

const LTVS: { [key in TokenID]?: number } = {
  [TokenID.BTC]: 0.85,
  [TokenID.ETH]: 0.85,
  [TokenID.mSOL]: 0.8,
  [TokenID.SOL]: 0.8,

  [TokenID.RAY]: 0.8,
  [TokenID.ORCA]: 0.8,

  [TokenID.USDT]: 0.90,
  [TokenID.USDC]: 0.90,
  [TokenID.UST]: 0.8,

  [TokenID.USDT_USDC_SABER]: 0.8,
  [TokenID.USDC_USDT_ORCA]: 0.8,
  [TokenID.SOL_USDC_RAYDIUM]: 0.8,
  [TokenID.RAY_USDC_RAYDIUM]: 0.8,
  [TokenID.SOL_USDT_RAYDIUM]: 0.8,
  [TokenID.SOL_USDC_ORCA]: 0.8,
  [TokenID.mSOL_SOL_ORCA]: 0.8,
  [TokenID.ORCA_USDC_ORCA]: 0.8,
  [TokenID.ORCA_SOL_ORCA]: 0.8,
};

export class InterestRate {
  multiplier: number;
  jumpMultiplier: number;
  constructor(
    public baseRate: number,
    public kink: number,
    public kinkRate: number,
    public fullRate: number,
  ) {
    invariant(baseRate >= 0);
    invariant(kink > 0);
    invariant(kink < 1);
    invariant(kinkRate > 0);
    invariant(fullRate > kinkRate);
    this.multiplier = (kinkRate - baseRate) / kink;
    this.jumpMultiplier = (fullRate - kinkRate) / (1 - kink);
  }
}

const INTEREST_RATES: {[key in TokenID]?: InterestRate} = {
  [TokenID.BTC]: new InterestRate(0.02, 0.85, 0.20, 2.0),
  [TokenID.ETH]: new InterestRate(0.02, 0.85, 0.20, 2.0),
  [TokenID.SOL]: new InterestRate(0.02, 0.85, 0.20, 2.0),
  [TokenID.mSOL]:new InterestRate(0.02, 0.85, 0.20, 2.0),

  [TokenID.RAY]: new InterestRate(0.02, 0.85, 0.20, 2.0),
  [TokenID.ORCA]:new InterestRate(0.02, 0.85, 0.20, 2.0),
  [TokenID.SBR]: new InterestRate(0.02, 0.85, 0.20, 2.0),

  [TokenID.USDT]:new InterestRate(0.01, 0.85, 0.08, 1.0),
  [TokenID.USDC]:new InterestRate(0.01, 0.85, 0.08, 1.0),
  [TokenID.UST]: new InterestRate(0.01, 0.85, 0.08, 1.0),
}

const FEES: { [key in TokenID]?: number } = {
  [TokenID.BTC]: 0.2,
  [TokenID.ETH]: 0.2,
  [TokenID.mSOL]: 0.2,
  [TokenID.SOL]: 0.2,

  [TokenID.RAY]: 0.2,
  [TokenID.ORCA]: 0.2,

  [TokenID.USDT]: 0.2,
  [TokenID.USDC]: 0.2,
  [TokenID.UST]: 0.2,

  [TokenID.USDT_USDC_SABER]: 0.0,   // no farming
  [TokenID.USDC_USDT_ORCA]: 0.2,
  [TokenID.SOL_USDC_RAYDIUM]: 0.0,  // no reward
  [TokenID.RAY_USDC_RAYDIUM]: 0.2,
  [TokenID.SOL_USDT_RAYDIUM]: 0.0,  // no reward
  [TokenID.SOL_USDC_ORCA]: 0.2,
  [TokenID.mSOL_SOL_ORCA]: 0.2,
  [TokenID.ORCA_USDC_ORCA]: 0.2,
  [TokenID.ORCA_SOL_ORCA]: 0.2,
};

export const CATEGORY: { [key in TokenID]: TokenCategory } = {
  [TokenID.BTC] : TokenCategory.Volatile,
  [TokenID.ETH] : TokenCategory.Volatile,
  [TokenID.SOL] : TokenCategory.Volatile,
  [TokenID.mSOL] : TokenCategory.Volatile,

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
  [TokenID.RAY_USDC_RAYDIUM]: TokenCategory.Lp,
  [TokenID.SOL_USDT_RAYDIUM]: TokenCategory.Lp,
  [TokenID.SOL_USDC_ORCA]: TokenCategory.Lp,
  [TokenID.mSOL_SOL_ORCA]: TokenCategory.Lp,
  [TokenID.ORCA_USDC_ORCA]: TokenCategory.Lp,
  [TokenID.ORCA_SOL_ORCA]: TokenCategory.Lp,
};

export const LIQUIDATION_DISCOUNT: { [key in TokenID]?: number } = {
  [TokenID.BTC] : 0.04,
  [TokenID.ETH] : 0.04,
  [TokenID.SOL] : 0.04,
  [TokenID.mSOL] : 0.04,

  [TokenID.RAY] : 0.04,
  [TokenID.ORCA] : 0.04,

  [TokenID.USDT]: 0.04,
  [TokenID.USDC]: 0.04,
  [TokenID.UST] : 0.04,

  [TokenID.USDT_USDC_SABER]: 0,
  [TokenID.USDC_USDT_ORCA]: 0,
  [TokenID.UST_USDC_SABER]: 0,
  [TokenID.SOL_USDC_RAYDIUM]: 0,
  [TokenID.RAY_USDC_RAYDIUM]: 0,
  [TokenID.SOL_USDT_RAYDIUM]: 0,
  [TokenID.SOL_USDC_ORCA]: 0,
  [TokenID.mSOL_SOL_ORCA]: 0,
  [TokenID.ORCA_USDC_ORCA]: 0,
  [TokenID.ORCA_SOL_ORCA]: 0,
};

export const LP_TO_LR: { [key in TokenID]?: [TokenID, TokenID] } = {
  [TokenID.USDT_USDC_SABER] : [TokenID.USDT, TokenID.USDC],
  [TokenID.USDC_USDT_ORCA] : [TokenID.USDC, TokenID.USDT],
  [TokenID.UST_USDC_SABER] : [TokenID.UST, TokenID.USDC],
  [TokenID.SOL_USDC_RAYDIUM]: [TokenID.SOL, TokenID.USDC],
  [TokenID.RAY_USDC_RAYDIUM]: [TokenID.RAY, TokenID.USDC],
  [TokenID.SOL_USDT_RAYDIUM]: [TokenID.SOL, TokenID.USDT],
  [TokenID.SOL_USDC_ORCA]: [TokenID.SOL, TokenID.USDC],
  [TokenID.mSOL_SOL_ORCA]: [TokenID.mSOL, TokenID.SOL],
  [TokenID.ORCA_USDC_ORCA]: [TokenID.ORCA, TokenID.USDC],
  [TokenID.ORCA_SOL_ORCA]: [TokenID.ORCA, TokenID.SOL],
};

export const LP_TO_TARGET_SWAP: { [key in TokenID]?: number } = {
  [TokenID.USDT_USDC_SABER] : SWAP_SABER,
  [TokenID.USDC_USDT_ORCA] : SWAP_ORCA,
  [TokenID.UST_USDC_SABER] : SWAP_SABER,
  [TokenID.SOL_USDC_RAYDIUM]: SWAP_RAYDIUM,
  [TokenID.RAY_USDC_RAYDIUM]: SWAP_RAYDIUM,
  [TokenID.SOL_USDT_RAYDIUM]: SWAP_RAYDIUM,
  [TokenID.SOL_USDC_ORCA]: SWAP_ORCA,
  [TokenID.mSOL_SOL_ORCA]: SWAP_ORCA,
  [TokenID.ORCA_USDC_ORCA]: SWAP_ORCA,
  [TokenID.ORCA_SOL_ORCA]: SWAP_ORCA,
};

export const LP_TO_DEX: { [key in TokenID]?: Dex } = {
  [TokenID.USDT_USDC_SABER] : Dex.Saber,
  [TokenID.USDC_USDT_ORCA] : Dex.Orca,
  [TokenID.UST_USDC_SABER] : Dex.Saber,
  [TokenID.SOL_USDC_RAYDIUM]: Dex.Raydium,
  [TokenID.RAY_USDC_RAYDIUM]: Dex.Raydium,
  [TokenID.SOL_USDT_RAYDIUM]: Dex.Raydium,
  [TokenID.SOL_USDC_ORCA]: Dex.Orca,
  [TokenID.mSOL_SOL_ORCA]: Dex.Orca,
  [TokenID.ORCA_USDC_ORCA]: Dex.Orca,
  [TokenID.ORCA_SOL_ORCA]: Dex.Orca,
};


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
  },
  [SWAP_RAYDIUM]: {
    depositProgramPubkey: new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"),
    stakeProgramPubkey: new PublicKey("EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q"),
  }
};

type SaberLpArgs = {
    swap:           PublicKey;
    swapAuthority:  PublicKey;
    tokenAVault:    PublicKey;
    tokenBVault:    PublicKey;
    tokenAfees:     PublicKey;
    tokenBfees:     PublicKey;

    // for stake/unstake
    quarry:       PublicKey;
    rewarder:     PublicKey;
    mint:         PublicKey;
};

export class SaberLpSwapInfo implements LpSwapKeyInfo {
  swap:           PublicKey;
  swapAuthority:  PublicKey;
  tokenAVault:    PublicKey;
  tokenBVault:    PublicKey;
  tokenAfees:     PublicKey;
  tokenBfees:     PublicKey;

  // for stake/unstake
  quarry:       PublicKey;
  rewarder:     PublicKey;
  mint:         PublicKey;
  constructor(args: SaberLpArgs) {
    this.swap = args.swap;
    this.swapAuthority = args.swapAuthority;
    this.tokenAVault = args.tokenAVault;
    this.tokenBVault = args.tokenBVault;
    this.tokenAfees = args.tokenAfees;
    this.tokenBfees = args.tokenBfees;
    // 
    this.quarry = args.quarry;
    this.rewarder = args.rewarder;
    this.mint = args.mint;
  }
  async getMinerKey(ownerKey: PublicKey): Promise<[PublicKey, number]> {
    const [key, bump] = await PublicKey.findProgramAddress([
      Buffer.from("Miner"),
      this.quarry.toBuffer(),
      ownerKey.toBuffer(),
    ], SWAP_METAS[SWAP_SABER].stake_program);
    return [key, bump];
  }

  async getMinerVault(ownerKey: PublicKey): Promise<PublicKey> {
    const [minerKey] = await this.getMinerKey(ownerKey);
    return await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      this.mint,
      minerKey,
      true,
    );
  }

  async getLpDepositKeys(_ownerKey: PublicKey) {
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
    return [
      {pubkey: smeta.deposit_program,         isSigner: false, isWritable: false},

      {pubkey: this.swap,                     isSigner: false, isWritable: false},
      {pubkey: this.swapAuthority,            isSigner: false, isWritable: false},

      {pubkey: this.tokenAVault,              isSigner: false, isWritable: true},
      {pubkey: this.tokenBVault,              isSigner: false, isWritable: true},

      {pubkey: this.mint,                     isSigner: false, isWritable: true},
      {pubkey: SYSVAR_CLOCK_PUBKEY,           isSigner: false, isWritable: false},
    ];
  }

  async getLpWithdrawKeys () {
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
    return [
      {pubkey: smeta.deposit_program,   isSigner: false, isWritable: false},

      {pubkey: this.swap,               isSigner: false, isWritable: false},
      {pubkey: this.swapAuthority,      isSigner: false, isWritable: false},

      {pubkey: this.mint,               isSigner: false, isWritable: true},

      {pubkey: this.tokenAVault,        isSigner: false, isWritable: true},
      {pubkey: this.tokenBVault,        isSigner: false, isWritable: true},

      {pubkey: this.tokenAfees,         isSigner: false, isWritable: true},
      {pubkey: this.tokenBfees,         isSigner: false, isWritable: true},

      {pubkey: SYSVAR_CLOCK_PUBKEY,     isSigner: false, isWritable: false},
    ];
  }

  async getLpStakeKeys(ownerKey: PublicKey) {
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
    const [minerKey, _minerBump] = await this.getMinerKey(ownerKey);
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
      {pubkey: this.quarry,             isSigner: false, isWritable: true},
      {pubkey: minerVault,              isSigner: false, isWritable: true},
      {pubkey: TOKEN_PROGRAM_ID,        isSigner: false, isWritable: false},
      {pubkey: this.rewarder,           isSigner: false, isWritable: false},
      {pubkey: SYSVAR_CLOCK_PUBKEY,     isSigner: false, isWritable: false},
    ];
  }

  getLRVaults(): [PublicKey, PublicKey] {
    return [this.tokenBVault, this.tokenAVault];
  }
}

type OrcaLpArgs = {
  lpMintPubkey:           PublicKey;

  swapPubkey:             PublicKey;
  swapAuthority:          PublicKey;

  swapTokenAAccount:      PublicKey;
  swapTokenBAccount:      PublicKey;

  globalLpVault:          PublicKey;
  farmTokenMint:          PublicKey;
  globalFarmState:        PublicKey;
  globalRewardTokenVault: PublicKey;
  rewardTokenAuthority:   PublicKey;
  feeAccount:             PublicKey;
};

export class OrcaLpSwapInfo implements LpSwapKeyInfo {
  lpMintPubkey:           PublicKey;

  swapPubkey:             PublicKey;
  swapAuthority:          PublicKey;

  swapTokenAAccount:      PublicKey;
  swapTokenBAccount:      PublicKey;

  globalLpVault:          PublicKey;
  farmTokenMint:          PublicKey;
  globalFarmState:        PublicKey;
  globalRewardTokenVault: PublicKey;
  rewardTokenAuthority:   PublicKey;
  feeAccount:             PublicKey;
  constructor(args: OrcaLpArgs) {
    this.lpMintPubkey = args.lpMintPubkey;
    this.swapPubkey = args.swapPubkey;
    this.swapAuthority = args.swapAuthority;
    this.swapTokenAAccount = args.swapTokenAAccount;
    this.swapTokenBAccount = args.swapTokenBAccount;
    this.globalLpVault = args.globalLpVault;
    this.farmTokenMint = args.farmTokenMint;
    this.globalFarmState = args.globalFarmState;
    this.globalRewardTokenVault = args.globalRewardTokenVault;
    this.rewardTokenAuthority = args.rewardTokenAuthority;
    this.feeAccount = args.feeAccount;
  }

  async getPdaKeys (ownerKey: PublicKey) {
    const smeta = SWAP_METAS[SWAP_ORCA];
    let pdaRewardTokenAccount: PublicKey;
    const isPublic = ownerKey.toString() === '7Ne6h2w3LpTNTa7CNYcUs7UkjeJT3oW7jcrXWfVScTXW';
    console.log(isPublic);
    if (isPublic) {
      if(this.lpMintPubkey.toString() === MINTS.SOL_USDC_ORCA.toString()) {
        pdaRewardTokenAccount = new PublicKey('Hr5yQGW35HBP8fJLKfranRbbKzfSPHrhKFf1ZP68LmVp');
        console.log(`Using temporary reward token acc ${pdaRewardTokenAccount.toString()}`)
      }
      else if (this.lpMintPubkey.toString() === MINTS.USDC_USDT_ORCA.toString()) {
        pdaRewardTokenAccount = new PublicKey('FSQWYCVXiGXRfKd1NmchusEa9wADez9eQGt5RY5eDjiy');
        console.log(`Using temporary reward token acc ${pdaRewardTokenAccount.toString()}`)
      }
      else {
        pdaRewardTokenAccount = await getAssociatedTokenPubkey(ownerKey,MINTS[TokenID.ORCA], true);
      }
    }
    else {
      pdaRewardTokenAccount = await getAssociatedTokenPubkey(ownerKey,MINTS[TokenID.ORCA], true);
    }

    const pdaFarmTokenAccount = await getAssociatedTokenPubkey(ownerKey, this.farmTokenMint, true);
    //const pdaRewardTokenAccount = await getAssociatedTokenPubkey(ownerKey,MINTS[TokenID.ORCA], true);
    const pdaFarmState = (await PublicKey.findProgramAddress(
      [this.globalFarmState.toBuffer(), ownerKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer()],
      smeta.farmProgramPubkey
    ))[0];

    return {
      pdaFarmTokenAccount,
      pdaRewardTokenAccount,
      pdaFarmState
    };
  }

  async getLpDepositKeys (_ownerKey: PublicKey) {
    const smeta = SWAP_METAS[SWAP_ORCA];
    return [
      { pubkey: smeta.depositProgramPubkey, isSigner: false, isWritable: false },
      { pubkey: this.swapPubkey,            isSigner: false, isWritable: false },
      { pubkey: this.swapAuthority,         isSigner: false, isWritable: false },
      { pubkey: this.swapTokenAAccount,     isSigner: false, isWritable: true },
      { pubkey: this.swapTokenBAccount,     isSigner: false, isWritable: true },
      { pubkey: this.lpMintPubkey,          isSigner: false, isWritable: true }
    ];
  }

  async getLpWithdrawKeys(_ownerKey: PublicKey) {
    const smeta = SWAP_METAS[SWAP_ORCA];
    return [
      { pubkey: smeta.depositProgramPubkey, isSigner: false, isWritable: false },
      { pubkey: this.swapPubkey,            isSigner: false, isWritable: false },
      { pubkey: this.swapAuthority,         isSigner: false, isWritable: false },
      { pubkey: this.lpMintPubkey,          isSigner: false, isWritable: true },
      { pubkey: this.swapTokenAAccount,     isSigner: false, isWritable: true },
      { pubkey: this.swapTokenBAccount,     isSigner: false, isWritable: true },
      { pubkey: this.feeAccount,            isSigner: false, isWritable: true }
    ];
  }

  async getLpStakeKeys(ownerKey: PublicKey) {
    const smeta = SWAP_METAS[SWAP_ORCA];
    const pdaKeys = await this.getPdaKeys(ownerKey);
    return [
      { pubkey: smeta.farmProgramPubkey,        isSigner: false, isWritable: false },
      { pubkey: this.globalLpVault,             isSigner: false, isWritable: true },
      { pubkey: this.farmTokenMint,             isSigner: false, isWritable: true },
      { pubkey: pdaKeys.pdaFarmTokenAccount,    isSigner: false, isWritable: true },
      { pubkey: this.globalFarmState,           isSigner: false, isWritable: true },
      { pubkey: pdaKeys.pdaFarmState,           isSigner: false, isWritable: true },
      { pubkey: this.globalRewardTokenVault,    isSigner: false, isWritable: true },
      { pubkey: pdaKeys.pdaRewardTokenAccount,  isSigner: false, isWritable: true },
      { pubkey: this.rewardTokenAuthority,      isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID,               isSigner: false, isWritable: false }
    ];
  }
  getLRVaults(): [PublicKey, PublicKey] {
    return [this.swapTokenAAccount, this.swapTokenBAccount];
  }
}

type RaydiumStakeKeys = {
  poolIdPubkey: PublicKey;
  poolAuthorityPubkey: PublicKey;
  poolLpTokenAccountPubkey: PublicKey;
  poolRewardTokenAccountPubkey: PublicKey;
  userInfoAccountPubkey: PublicKey;
  userRewardAccountPubkey: PublicKey;
}

type RaydiumLpArgs = {
  lpMintPubkey: PublicKey;

  ammIdPubkey: PublicKey;
  ammAuthPubkey: PublicKey;
  ammOpenOrdersPubkey: PublicKey;
  ammTargetOrderPubkey: PublicKey;

  poolCoinTokenPubkey: PublicKey;
  poolPcTokenPubkey: PublicKey;
  poolWithdrawQueue: PublicKey;
  poolTempLpTokenAccount: PublicKey;

  serumProgramId: PublicKey;
  serumMarketPubkey: PublicKey;
  serumCoinVaultAccount: PublicKey;
  serumPcVaultAccount: PublicKey;
  serumVaultSigner: PublicKey;

  stakeKeys: RaydiumStakeKeys | null;
};

export class RaydiumLpSwapInfo implements LpSwapKeyInfo {
  lpMintPubkey: PublicKey;

  ammIdPubkey: PublicKey;
  ammAuthPubkey: PublicKey;
  ammOpenOrdersPubkey: PublicKey;
  ammTargetOrderPubkey: PublicKey;

  poolCoinTokenPubkey: PublicKey;
  poolPcTokenPubkey: PublicKey;
  poolWithdrawQueue: PublicKey;
  poolTempLpTokenAccount: PublicKey;

  serumProgramId: PublicKey;
  serumMarketPubkey: PublicKey;
  serumCoinVaultAccount: PublicKey;
  serumPcVaultAccount: PublicKey;
  serumVaultSigner: PublicKey;

  stakeKeys: RaydiumStakeKeys | null;
  constructor(args: RaydiumLpArgs) {
    this.lpMintPubkey = args.lpMintPubkey;

    this.ammIdPubkey = args.ammIdPubkey;
    this.ammAuthPubkey = args.ammAuthPubkey;
    this.ammOpenOrdersPubkey = args.ammOpenOrdersPubkey;
    this.ammTargetOrderPubkey = args.ammTargetOrderPubkey;

    this.poolCoinTokenPubkey = args.poolCoinTokenPubkey;
    this.poolPcTokenPubkey = args.poolPcTokenPubkey;
    this.poolWithdrawQueue = args.poolWithdrawQueue;
    this.poolTempLpTokenAccount = args.poolTempLpTokenAccount;

    this.serumProgramId = args.serumProgramId;
    this.serumMarketPubkey = args.serumMarketPubkey;
    this.serumCoinVaultAccount = args.serumCoinVaultAccount;
    this.serumPcVaultAccount = args.serumPcVaultAccount;
    this.serumVaultSigner = args.serumVaultSigner;

    this.stakeKeys = args.stakeKeys;
  }
  async getLpDepositKeys (_ownerKey: PublicKey) {
    const smeta = SWAP_METAS[SWAP_RAYDIUM];
    return [
      { pubkey: smeta.depositProgramPubkey,     isSigner: false, isWritable: false },
      { pubkey: this.ammIdPubkey,               isSigner: false, isWritable: true },
      { pubkey: this.ammAuthPubkey,             isSigner: false, isWritable: false },
      { pubkey: this.ammOpenOrdersPubkey,       isSigner: false, isWritable: false },
      { pubkey: this.ammTargetOrderPubkey,      isSigner: false, isWritable: true },
      { pubkey: this.lpMintPubkey,              isSigner: false, isWritable: true },
      { pubkey: this.poolCoinTokenPubkey,       isSigner: false, isWritable: true },
      { pubkey: this.poolPcTokenPubkey,         isSigner: false, isWritable: true },
      { pubkey: this.serumMarketPubkey,         isSigner: false, isWritable: false },
    ];
  }
  async getLpWithdrawKeys(_ownerKey: PublicKey) {
    const smeta = SWAP_METAS[SWAP_RAYDIUM];
    return [
      { pubkey: smeta.depositProgramPubkey,     isSigner: false, isWritable: false },
      { pubkey: this.ammIdPubkey,               isSigner: false, isWritable: true },
      { pubkey: this.ammAuthPubkey,             isSigner: false, isWritable: false },
      { pubkey: this.ammOpenOrdersPubkey,       isSigner: false, isWritable: false },
      { pubkey: this.ammTargetOrderPubkey,      isSigner: false, isWritable: true },
      { pubkey: this.lpMintPubkey,              isSigner: false, isWritable: true },
      { pubkey: this.poolCoinTokenPubkey,       isSigner: false, isWritable: true },
      { pubkey: this.poolPcTokenPubkey,         isSigner: false, isWritable: true },
      { pubkey: this.poolWithdrawQueue,         isSigner: false, isWritable: true },
      { pubkey: this.poolTempLpTokenAccount,    isSigner: false, isWritable: true },

      { pubkey: this.serumProgramId,            isSigner: false, isWritable: false },
      { pubkey: this.serumMarketPubkey,         isSigner: false, isWritable: true },
      { pubkey: this.serumCoinVaultAccount,     isSigner: false, isWritable: true },
      { pubkey: this.serumPcVaultAccount,       isSigner: false, isWritable: true },
      { pubkey: this.serumVaultSigner,          isSigner: false, isWritable: false },
    ];
  }
  async getLpStakeKeys (_ownerKey: PublicKey) {
    if (!this.stakeKeys) {
      return []
    }
    else {
      const smeta = SWAP_METAS[SWAP_RAYDIUM];
      const stkeys = this.stakeKeys;

      return [
        { pubkey: smeta.stakeProgramPubkey,           isSigner: false, isWritable: false, },
        { pubkey: stkeys.poolIdPubkey,                isSigner: false, isWritable: true },
        { pubkey: stkeys.poolAuthorityPubkey,         isSigner: false, isWritable: false },
  
        { pubkey: stkeys.userInfoAccountPubkey,       isSigner: false, isWritable: true },
        { pubkey: stkeys.poolLpTokenAccountPubkey,    isSigner: false, isWritable: true},
        { pubkey: stkeys.userRewardAccountPubkey,     isSigner: false, isWritable: true},
        { pubkey: stkeys.poolRewardTokenAccountPubkey, isSigner: false, isWritable: true},
  
        // Below account are not listed on solscan.io but explorer.solana.com, so you should better check both sites.
        { pubkey: SYSVAR_CLOCK_PUBKEY,                isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID,                   isSigner: false, isWritable: false },
      ]
    }
  }
  getLRVaults(): [PublicKey, PublicKey] {
    return [this.poolCoinTokenPubkey, this.poolPcTokenPubkey];
  }
}

export const SABER_LP_METAS: {[key in TokenID]? : SaberLpSwapInfo } = {
  [TokenID.USDT_USDC_SABER]: new SaberLpSwapInfo({
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
  }),
}

export const ORCA_LP_METAS: {[key in TokenID]? : OrcaLpSwapInfo } = {
  [TokenID.USDC_USDT_ORCA]: new OrcaLpSwapInfo({
    lpMintPubkey:           new PublicKey(MINTS[TokenID.USDC_USDT_ORCA]),

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
  }),
  [TokenID.SOL_USDC_ORCA]: new OrcaLpSwapInfo({
    lpMintPubkey:           new PublicKey(MINTS[TokenID.SOL_USDC_ORCA]),

    swapPubkey:             new PublicKey("EGZ7tiLeH62TPV1gL8WwbXGzEPa9zmcpVnnkPKKnrE2U"),
    swapAuthority:          new PublicKey("JU8kmKzDHF9sXWsnoznaFDFezLsE5uomX2JkRMbmsQP"),

    swapTokenAAccount:      new PublicKey("ANP74VNsHwSrq9uUSjiSNyNWvf6ZPrKTmE4gHoNd13Lg"),
    swapTokenBAccount:      new PublicKey("75HgnSvXbWKZBpZHveX68ZzAhDqMzNDS29X6BGLtxMo1"),

    globalLpVault:          new PublicKey("7ipefo5V3QEJWeuT2PohFSEUaranZxMSeWQo2rcNigr3"),
    farmTokenMint:          new PublicKey("FFdjrSvNALfdgxANNpt3x85WpeVMdQSH5SEP2poM8fcK"),
    globalFarmState:        new PublicKey("85HrPbJtrN82aeB74WTwoFxcNgmf5aDNP2ENngbDpd5G"),
    globalRewardTokenVault: new PublicKey("kjjFC8RAF7GuBQ9iYgyTcPmvsRafJ2Ec2AmoS6DjakJ"),
    rewardTokenAuthority:   new PublicKey("MDcWkwPqr5HrA91g4GGax7bVP1NDDetnR12nGhoAdYj"),
    feeAccount:             new PublicKey("8JnSiuvQq3BVuCU3n4DrSTw9chBSPvEMswrhtifVkr1o"),
  }),
  [TokenID.mSOL_SOL_ORCA]: new OrcaLpSwapInfo({
    lpMintPubkey:           new PublicKey(MINTS[TokenID.mSOL_SOL_ORCA]),

    swapPubkey:             new PublicKey("9EQMEzJdE2LDAY1hw1RytpufdwAXzatYfQ3M2UuT9b88"),
    swapAuthority:          new PublicKey("6cwehd4xhKkJ2s7iGh4CaDb7KhMgqczSBnyNJieUYbHn"),

    swapTokenAAccount:      new PublicKey("6xmki5RtGNHrfhTiHFfp9k3RQ9t8qgL1cYP2YCG2h179"),
    swapTokenBAccount:      new PublicKey("Ew2coQtVGLeca31vqB2ssHntjzZgUy1ad9VuuAX8yw7p"),

    globalLpVault:          new PublicKey("DuTZUmTRydVc3EN78brdYFUfskn6s93zH4WhY3Fo53AJ"),
    farmTokenMint:          new PublicKey("3RTGL7gPF4V1ns1AeGFApT7cBEGVDfmJ77DqQi9AC6uG"),
    globalFarmState:        new PublicKey("JADWjBW1Xs8WhW8kj3GTCRQn3LR4gwvbFTEMwv9ZNxQh"),
    globalRewardTokenVault: new PublicKey("7dpUACKvEiuq5kyoGtgiA131hYwdxfFhEeD5TMT4mnzG"),
    rewardTokenAuthority:   new PublicKey("CtXKDXJ4wzgto48QQFANestEgtov5dJRrs9qpRw7BV1h"),
    feeAccount:             new PublicKey("6j2tt2UVYMQwqG3hRtyydW3odzBFwy3pN33tyB3xCKQ6"),
  }),
  [TokenID.ORCA_USDC_ORCA]: new OrcaLpSwapInfo({
    lpMintPubkey:           new PublicKey(MINTS[TokenID.ORCA_USDC_ORCA]),

    swapPubkey:             new PublicKey("2p7nYbtPBgtmY69NsE8DAW6szpRJn7tQvDnqvoEWQvjY"),
    swapAuthority:          new PublicKey("3fr1AhdiAmWLeNrS24CMoAu9pPgbzVhwLtJ6QUPmw2ob"),

    swapTokenAAccount:      new PublicKey("9vYWHBPz817wJdQpE8u3h8UoY3sZ16ZXdCcvLB7jY4Dj"),
    swapTokenBAccount:      new PublicKey("6UczejMUv1tzdvUzKpULKHxrK9sqLm8edR1v9jinVWm9"),

    globalLpVault:          new PublicKey("45BAAQCZYd2kP3Z3WvRwdtfUhvuW4FvpqVK4m8qrR5x1"),
    farmTokenMint:          new PublicKey("Gc7W5U66iuHQcC1cQyeX9hxkPF2QUVJPTf1NWbW8fNrt"),
    globalFarmState:        new PublicKey("9S1BsxbDNQXQccjFamVEGgxiYQHTeudvhEYwFr4oWeaf"),
    globalRewardTokenVault: new PublicKey("DEiqe2Ta9TRMRtWdBqiFV13dhVrqCeG8MMmVwywvXvJo"),
    rewardTokenAuthority:   new PublicKey("66xaEjFoYfRcspc18oDj61mXDyznr9zam6tFNeqvs2jK"),
    feeAccount:             new PublicKey("7CXZED4jfRp3qdHB9Py3up6v1C4UhHofFvfT6RXbJLRN"),
  }),
  [TokenID.ORCA_SOL_ORCA]: new OrcaLpSwapInfo({
    lpMintPubkey:           new PublicKey(MINTS[TokenID.ORCA_SOL_ORCA]),

    swapPubkey:             new PublicKey("2ZnVuidTHpi5WWKUwFXauYGhvdT9jRKYv5MDahtbwtYr"),
    swapAuthority:          new PublicKey("2PH1quJj9MHQXATCmNZ6qQ2gZqM8R236DpKaz99ggVpm"),

    swapTokenAAccount:      new PublicKey("AioST8HKQJRqjE1mknk4Rydc8wVADhdQwRJmAAYX1T6Z"),
    swapTokenBAccount:      new PublicKey("73zdy95DynZP4exdpuXTDsexcrWbDJX9TFi2E6CDzXh4"),

    globalLpVault:          new PublicKey("7N7zxoDMMV1sCDiVEzinTyQxS2GoN388QprMCQX38BeT"), // lp 1
    farmTokenMint:          new PublicKey("B5waaKnsmtqFawPspUwcuy1cRjAC7u2LrHSwxPSxK4sZ"),
    globalFarmState:        new PublicKey("F6pi7SyXWx56fP96mYQ4Yfh4yZ7oGNtDjwSYHT5Mz7Ld"),
    globalRewardTokenVault: new PublicKey("CSbYA7Cd65Vis2oqX797zmnWmpgENmqrPdmPbTbRPykd"),
    rewardTokenAuthority:   new PublicKey("98RAHBKRTTC87nNwug1GEAnLVgouk9nRaa3u14jrp6Zz"),
    feeAccount:             new PublicKey("4Zc4kQZhRQeGztihvcGSWezJE1k44kKEgPCAkdeBfras"),
  }),
}

export const RAYDIUM_LP_METAS: {[key in TokenID]? : RaydiumLpSwapInfo } = {
  [TokenID.SOL_USDC_RAYDIUM]: new RaydiumLpSwapInfo({
    lpMintPubkey: new PublicKey(MINTS[TokenID.SOL_USDC_RAYDIUM]),

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

    stakeKeys: null,
  }),
  [TokenID.RAY_USDC_RAYDIUM]: new RaydiumLpSwapInfo({
    lpMintPubkey: new PublicKey(MINTS[TokenID.RAY_USDC_RAYDIUM]), 

    ammIdPubkey: new PublicKey('6UmmUiYoBjSrhakAobJw8BvkmJtDVxaeBtbt7rxWo1mg'),
    ammAuthPubkey: new PublicKey('5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1'),
    ammOpenOrdersPubkey: new PublicKey('J8u8nTHYtvudyqwLrXZboziN95LpaHFHpd97Jm5vtbkW'),
    ammTargetOrderPubkey: new PublicKey(
      '3cji8XW5uhtsA757vELVFAeJpskyHwbnTSceMFY5GjVT'
    ),

    poolCoinTokenPubkey: new PublicKey('FdmKUE4UMiJYFK5ogCngHzShuVKrFXBamPWcewDr31th'),
    poolPcTokenPubkey: new PublicKey('Eqrhxd7bDUCH3MepKmdVkgwazXRzY6iHhEoBpY7yAohk'),
    poolWithdrawQueue: new PublicKey('ERiPLHrxvjsoMuaWDWSTLdCMzRkQSo8SkLBLYEmSokyr'),
    poolTempLpTokenAccount: new PublicKey(
      'D1V5GMf3N26owUFcbz2qR5N4G81qPKQvS2Vc4SM73XGB'
    ),

    serumProgramId: new PublicKey('9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin'),
    serumMarketPubkey: new PublicKey('2xiv8A5xrJ7RnGdxXB42uFEkYHJjszEhaJyKKt4WaLep'),
    serumCoinVaultAccount: new PublicKey(
      'GGcdamvNDYFhAXr93DWyJ8QmwawUHLCyRqWL3KngtLRa'
    ),
    serumPcVaultAccount: new PublicKey('22jHt5WmosAykp3LPGSAKgY45p7VGh4DFWSwp21SWBVe'),
    serumVaultSigner: new PublicKey('FmhXe9uG6zun49p222xt3nG1rBAkWvzVz7dxERQ6ouGw'),

    // for stake
    stakeKeys: {
      poolIdPubkey: new PublicKey('CHYrUBX2RKX8iBg7gYTkccoGNBzP44LdaazMHCLcdEgS'),
      poolAuthorityPubkey: new PublicKey('5KQFnDd33J5NaMC9hQ64P5XzaaSz8Pt7NBCkZFYn1po'),
      poolLpTokenAccountPubkey: new PublicKey('BNnXLFGva3K8ACruAc1gaP49NCbLkyE6xWhGV4G2HLrs'),
      poolRewardTokenAccountPubkey: new PublicKey('DpRueBHHhrQNvrjZX7CwGitJDJ8eZc3AHcyFMG4LqCQR'),

      userInfoAccountPubkey: new PublicKey('5BGkQwXsWzQZBipSho88e6zjFjxYPZnToYD1TrcG31r9'),
      userRewardAccountPubkey: new PublicKey('HEQMdvMvaTBpBPT3hvTxEcLMzbRVeTvrY764dw5dRUz3'),
    }
  }),
  [TokenID.SOL_USDT_RAYDIUM]: new RaydiumLpSwapInfo({
    lpMintPubkey: new PublicKey(MINTS[TokenID.SOL_USDT_RAYDIUM]),

    ammIdPubkey: new PublicKey('7XawhbbxtsRcQA8KTkHT9f9nc6d69UwqCDh6U5EEbEmX'),
    ammAuthPubkey: new PublicKey('5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1'),
    ammOpenOrdersPubkey: new PublicKey('4NJVwEAoudfSvU5kdxKm5DsQe4AAqG6XxpZcNdQVinS4'),
    ammTargetOrderPubkey: new PublicKey(
      '9x4knb3nuNAzxsV7YFuGLgnYqKArGemY54r2vFExM1dp'
    ),

    poolCoinTokenPubkey: new PublicKey('876Z9waBygfzUrwwKFfnRcc7cfY4EQf6Kz1w7GRgbVYW'),
    poolPcTokenPubkey: new PublicKey('CB86HtaqpXbNWbq67L18y5x2RhqoJ6smb7xHUcyWdQAQ'),
    poolWithdrawQueue: new PublicKey('52AfgxYPTGruUA9XyE8eF46hdR6gMQiA6ShVoMMsC6jQ'),
    poolTempLpTokenAccount: new PublicKey(
      '2JKZRQc92TaH3fgTcUZyxfD7k7V7BMqhF24eussPtkwh'
    ),

    serumProgramId: new PublicKey('9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin'),
    serumMarketPubkey: new PublicKey('HWHvQhFmJB3NUcu1aihKmrKegfVxBEHzwVX6yZCKEsi1'),
    serumCoinVaultAccount: new PublicKey(
      '29cTsXahEoEBwbHwVc59jToybFpagbBMV6Lh45pWEmiK'
    ),
    serumPcVaultAccount: new PublicKey('EJwyNJJPbHH4pboWQf1NxegoypuY48umbfkhyfPew4E'),
    serumVaultSigner: new PublicKey('CzZAjoEqA6sjqtaiZiPqDkmxG6UuZWxwRWCenbBMc8Xz'),

    stakeKeys: null,
  }),
}

export const LP_SWAP_METAS: {[key in TokenID]? : LpSwapKeyInfo}  = {};

for(const key in ORCA_LP_METAS) {
  const tokId = key as TokenID;
  invariant(tokId in TokenID, `Invalid tokId: ${key}`)
  invariant(!(tokId in LP_SWAP_METAS), `${tokId} is duplicated`);
  const value = ORCA_LP_METAS[tokId]!;
  invariant(value);
  LP_SWAP_METAS[tokId] = value;
}

for(const key in SABER_LP_METAS) {
  const tokId = key as TokenID;
  invariant(tokId in TokenID, `Invalid tokId: ${key}`)
  invariant(!(tokId in LP_SWAP_METAS), `${tokId} is duplicated`);
  const value = SABER_LP_METAS[tokId]!;
  invariant(value);
  LP_SWAP_METAS[tokId] = value;
}

for(const key in RAYDIUM_LP_METAS) {
  const tokId = key as TokenID;
  invariant(tokId in TokenID, `Invalid tokId: ${key}`)
  invariant(!(tokId in LP_SWAP_METAS), `${tokId} is duplicated`);
  const value = RAYDIUM_LP_METAS[tokId]!;
  invariant(value);
  LP_SWAP_METAS[tokId] = value;
}

export const SWITCHBOARD_PRICE: { [key in TokenID]? : PublicKey} = {
  [TokenID.BTC]: new PublicKey("74YzQPGUT9VnjrBz8MuyDLKgKpbDqGot5xZJvTtMi6Ng"),
  [TokenID.ETH]: new PublicKey("QJc2HgGhdtW4e7zjvLB1TGRuwEpTre2agU5Lap2UqYz"),
  [TokenID.SOL]: new PublicKey("AdtRGGhmqvom3Jemp5YNrxd9q9unX36BZk1pujkkXijL"),
  [TokenID.mSOL]: new PublicKey("CEPVH2t11KS4CaL3w4YxT9tRiijoGA4VEbnQ97cEpDmQ"),

  [TokenID.RAY]: new PublicKey("CppyF6264uKZkGua1brTUa2fSVdMFSCszwzDs76HCuzU"),
  [TokenID.ORCA]: new PublicKey("EHwSRkm2ErRjWxCxrTxrmC7sT2kGb5jJcsiindUHAX7W"),
  [TokenID.SBR]: new PublicKey("Lp3VNoRQi699VZe6u59TV8J38ELEUzxkaisoWsDuJgB"),
  // [TokenID.MERC]: new PublicKey(""), // MERC not on sb

  [TokenID.USDT]: new PublicKey("5mp8kbkTYwWWCsKSte8rURjTuyinsqBpJ9xAQsewPDD"),
  [TokenID.USDC]: new PublicKey("CZx29wKMUxaJDq6aLVQTdViPL754tTR64NAgQBUGxxHb"),
  [TokenID.UST]: new PublicKey("8o8gN6VnW45R8pPfQzUJUwJi2adFmsWwfGcFNmicWt61"),
};

const FIREBASE_READER_CONFIG = {
  alpha: {
    apiKey: 'AIzaSyDWBTlo8oeJGnpV0CnQEBpeloMbHgN6xY8',
    authDomain: 'apricot-website-96904.firebaseapp.com',
    projectId: 'apricot-website-96904',
    storageBucket: 'apricot-website-96904.appspot.com',
    messagingSenderId: '181748660172',
    appId: '1:181748660172:web:fea7b301ef6a09c3d60f69',
    measurementId: 'G-W2RX0BF87Q',
  },
  public: {
    apiKey: 'AIzaSyAGpQxt6PUaLf1vhfhxL5hzWcP1QDIeOSc',
    authDomain: 'apricot-public.firebaseapp.com',
    projectId: 'apricot-public',
    storageBucket: 'apricot-public.appspot.com',
    messagingSenderId: '735163506624',
    appId: '1:735163506624:web:e6406687d889d993e93225',
    measurementId: 'G-VBTE0406R3',
  },
};

// alpha mainnet is where we deploy tests
export const ALPHA_CONFIG = new AppConfig(
  new PublicKey("5dtKmAzoJu4qDxMjjK7gWY2pPe6NWAX6HWQk5QUHaKQZ"),
  new PublicKey("EFo9V7mFQgxz7xPMrJ6qLyrjfGXPgsEFEfGEtVQx2xKt"),
  new PublicKey("3cWR2VDrVhQ43VX8B43MwTazfx66naioXurUh8vrkidt"),
  new PublicKey("4DUvqxvab2BiJEYR7YHi3nM5tfyLNXFBQbJuExQPK9rf"),
  MINTS,
  DECIMAL_MULT,
  CATEGORY,
  POOL_IDS,
  LIQUIDATION_DISCOUNT,
  LTVS,
  LP_TO_LR,
  LP_TO_DEX,
  LP_TO_TARGET_SWAP,
  SWITCHBOARD_PRICE,
  INTEREST_RATES,
  FEES,
  LP_SWAP_METAS,
  FIREBASE_READER_CONFIG.alpha,
);

// public mainnet is where the real thing is
export const PUBLIC_CONFIG = new AppConfig(
  // not added yet
  new PublicKey("6UeJYTLU1adaoHWeApWsoj1xNEDbWA2RhM2DLc8CrDDi"),
  new PublicKey("6L2QoTpr8WUd76eLAGnvow8i3WQzRP36C1qdUna9iwMn"),
  new PublicKey("F5m8gNjC6pjynywcbw9kK1miSNJMw1nQGeviWykfCCXd"),
  new PublicKey("FsSq4dqugLgZbsyLNt7bngtBkDApXaHUFXVQ6od5TeQ3"),
  MINTS,
  DECIMAL_MULT,
  CATEGORY,
  POOL_IDS,
  LIQUIDATION_DISCOUNT,
  LTVS,
  LP_TO_LR,
  LP_TO_DEX,
  LP_TO_TARGET_SWAP,
  SWITCHBOARD_PRICE,
  INTEREST_RATES,
  FEES,
  LP_SWAP_METAS,
  FIREBASE_READER_CONFIG.public,
);
