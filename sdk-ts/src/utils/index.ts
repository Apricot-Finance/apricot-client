import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';

export function assert(cond: boolean, msg?: string): asserts cond {
  if (!cond) {
    throw new Error(msg);
  }
}

export const getAssociatedTokenPubkey = async (
  ownerPubkey: PublicKey,
  mintPubkey: PublicKey,
  allowOwnerOffCurve = false,
) => {
  let address;
  if (allowOwnerOffCurve) {
    [address] = await PublicKey.findProgramAddress(
      [ownerPubkey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPubkey.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );
  } else {
    address = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mintPubkey,
      ownerPubkey,
      allowOwnerOffCurve,
    );
  }
  return address;
};

export const delay = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
