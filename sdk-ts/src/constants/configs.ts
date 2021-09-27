import { PublicKey } from "@solana/web3.js";
import { TokenType, AppConfig } from "../types";

export const MINTS: { [key in TokenType]?: PublicKey } = {
  [TokenType.BTC]: new PublicKey("9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E"),
  [TokenType.ETH]: new PublicKey("2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk"),
  [TokenType.SOL]: new PublicKey("So11111111111111111111111111111111111111112"),
  [TokenType.USDT]: new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"),
  [TokenType.USDC]: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
  [TokenType.UST]: new PublicKey("CXLBjMMcwkc17GfJtBos6rQCo1ypeH6eDbB82Kby4MRm"),
  [TokenType.USDT_USDC_SABER]: new PublicKey("2poo1w1DL6yd2WNTCnNTzDqkC6MBXq7axo77P16yrBuf"),
  [TokenType.USDC_USDT_ORCA]: new PublicKey("GjpXgKwn4VW4J2pZdS3dovM58hiXWLJtopTfqG83zY2f"),
  [TokenType.UST_USDC_SABER]: new PublicKey("UST32f2JtPGocLzsL41B3VBBoJzTm1mK1j3rwyM3Wgc"),
};

// alpha mainnet is where we deploy tests
export const ALPHA_CONFIG = new AppConfig(
  new PublicKey("5dtKmAzoJu4qDxMjjK7gWY2pPe6NWAX6HWQk5QUHaKQZ"),
  new PublicKey("EFo9V7mFQgxz7xPMrJ6qLyrjfGXPgsEFEfGEtVQx2xKt"),
  {
    [TokenType.BTC]: MINTS[TokenType.BTC],
    [TokenType.ETH]: MINTS[TokenType.ETH],
    [TokenType.SOL]: MINTS[TokenType.SOL],
    [TokenType.USDT]: MINTS[TokenType.USDT],
    [TokenType.USDC]: MINTS[TokenType.USDC],
    [TokenType.USDT_USDC_SABER]: MINTS[TokenType.USDT_USDC_SABER],
  },
  {
    [TokenType.BTC]: 0,
    [TokenType.ETH]: 1,
    [TokenType.SOL]: 2,
    [TokenType.USDT]: 3,
    [TokenType.USDC]: 4,
    [TokenType.USDT_USDC_SABER]: 5,
  }
);

// public mainnet is where the real thing is
export const PUBLIC_CONFIG = new AppConfig(
  // not added yet
  new PublicKey("5dtKmAzoJu4qDxMjjK7gWY2pPe6NWAX6HWQk5QUHaKQZ"),
  new PublicKey("5dtKmAzoJu4qDxMjjK7gWY2pPe6NWAX6HWQk5QUHaKQZ"),
  { },
  { }
);

