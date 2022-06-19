import { Keypair, PublicKey } from '@solana/web3.js';
import { ALPHA_CONFIG, DECIMAL_MULT, LP_TO_LR, PUBLIC_CONFIG } from '../constants';
import { TokenID } from '../types';
import { MINTS } from '../constants';
import { ActionWrapper } from '../utils/ActionWrapper';
import * as fs from 'fs';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import invariant from 'tiny-invariant';
import { getRPCConnection } from '../utils';

const [_nodeStr, _scriptStr, production, keyLocation, action] = process.argv.slice(0, 5);

invariant(['alpha', 'public'].includes(production));
const config = production === 'alpha' ? ALPHA_CONFIG : PUBLIC_CONFIG;

async function doTransaction() {
  const keyStr = fs.readFileSync(keyLocation, 'utf8');
  const privateKey = JSON.parse(keyStr);
  const keypair = Keypair.fromSecretKey(new Uint8Array(privateKey));

  const conn = getRPCConnection();
  const wrapper = new ActionWrapper(conn, config);

  const remainingArgs = process.argv.slice(5);

  async function getAssociatedTokAcc(tokenId: TokenID): Promise<PublicKey> {
    return await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      MINTS[tokenId],
      keypair.publicKey,
    );
  }

  if (action === 'new-and-deposit') {
    // node doTrans.js keyLocation deposit BTC 0.1
    const tokenId = TokenID[remainingArgs[0] as keyof typeof TokenID];
    const amount = parseFloat(remainingArgs[1]);
    const poolMint = MINTS[tokenId]!;
    const result = await wrapper.addUserAndDeposit(
      keypair,
      await getAssociatedTokAcc(tokenId),
      poolMint.toBase58(),
      amount * DECIMAL_MULT[tokenId],
    )!;
    console.log(result);
  } else if (action === 'deposit') {
    // node doTrans.js keyLocation deposit BTC 0.1
    const tokenId = TokenID[remainingArgs[0] as keyof typeof TokenID];
    const amount = parseFloat(remainingArgs[1]);
    const poolMint = MINTS[tokenId]!;
    const result = await wrapper.deposit(
      keypair,
      await getAssociatedTokAcc(tokenId),
      poolMint.toBase58(),
      amount * DECIMAL_MULT[tokenId],
    )!;
    console.log(result);
  } else if (action === 'withdraw') {
    // node doTrans.js keyLocation withdraw BTC 0.1
    const tokenId = TokenID[remainingArgs[0] as keyof typeof TokenID];
    const amount = parseFloat(remainingArgs[1]);
    const poolMint = MINTS[tokenId]!;
    const result = await wrapper.withdraw(
      keypair,
      await getAssociatedTokAcc(tokenId),
      poolMint.toBase58(),
      false,
      amount * DECIMAL_MULT[tokenId],
    )!;
    console.log(result);
  } else if (action === 'borrow') {
    // node doTrans.js keyLocation borrow BTC 0.1
    const tokenId = TokenID[remainingArgs[0] as keyof typeof TokenID];
    const amount = parseFloat(remainingArgs[1]);
    const poolMint = MINTS[tokenId]!;
    const result = await wrapper.borrow(
      keypair,
      await getAssociatedTokAcc(tokenId),
      poolMint.toBase58(),
      amount * DECIMAL_MULT[tokenId],
    )!;
    console.log(result);
  } else if (action === 'repay') {
    // node doTrans.js keyLocation repay BTC 0.1
    const tokenId = TokenID[remainingArgs[0] as keyof typeof TokenID];
    const amount = parseFloat(remainingArgs[1]);
    const poolMint = MINTS[tokenId]!;
    const result = await wrapper.repay(
      keypair,
      await getAssociatedTokAcc(tokenId),
      poolMint.toBase58(),
      false,
      amount * DECIMAL_MULT[tokenId],
    )!;
    console.log(result);
  } else if (action === 'lp-create') {
    // node doTrans.js keyLocation repay BTC 0.1
    if (remainingArgs.length < 4) {
      throw new Error(`Invalid argvs`);
    }
    const tokenId = TokenID[remainingArgs[0] as keyof typeof TokenID];
    const [leftId, rightId] = LP_TO_LR[tokenId]!;
    const amountLp = parseFloat(remainingArgs[1]);
    const amountLeft = parseFloat(remainingArgs[2]);
    const amountRight = parseFloat(remainingArgs[3]);
    const result = await wrapper.lpCreate(
      keypair,
      tokenId,
      amountLeft * DECIMAL_MULT[leftId],
      amountRight * DECIMAL_MULT[rightId],
      amountLp * DECIMAL_MULT[tokenId],
    )!;
    console.log(result);
  } else if (action === 'lp-create-2step') {
    // node doTrans.js keyLocation repay BTC 0.1
    if (remainingArgs.length < 1) {
      throw new Error(`Invalid argvs`);
    }
    const tokenId = TokenID[remainingArgs[0] as keyof typeof TokenID];
    const result = await wrapper.lpStake2ndStep(keypair, tokenId);
    console.log(result);
  } else if (action === 'lp-redeem-2step') {
    // node doTrans.js keyLocation repay BTC 0.1
    const tokenId = TokenID[remainingArgs[0] as keyof typeof TokenID];
    const amount = parseFloat(remainingArgs[1]);

    const result = await wrapper.lpUnstake2ndStep(keypair, tokenId, amount * DECIMAL_MULT[tokenId]);
    console.log(result);
  } else if (action === 'lp-redeem') {
    // node doTrans.js keyLocation repay BTC 0.1
    const tokenId = TokenID[remainingArgs[0] as keyof typeof TokenID];
    const [leftId, rightId] = LP_TO_LR[tokenId]!;
    const amount = parseFloat(remainingArgs[1]);
    const amountLeft = parseFloat(remainingArgs[2]);
    const amountRight = parseFloat(remainingArgs[3]);
    const result = await wrapper.lpRedeem(
      keypair,
      tokenId,
      amountLeft * DECIMAL_MULT[leftId],
      amountRight * DECIMAL_MULT[rightId],
      amount * DECIMAL_MULT[tokenId],
    );
    console.log(result);
  } else if (action === 'simple-swap') {
    const sellTokenId = TokenID[remainingArgs[0] as keyof typeof TokenID];
    const buyTokenId = TokenID[remainingArgs[1] as keyof typeof TokenID];
    const sellAmount = parseFloat(remainingArgs[2]);
    const minBuyAmount = parseFloat(remainingArgs[3]);
    const isSwapAllDeposit = remainingArgs[4] === 'true';
    const result = await wrapper.simpleSwap(
      keypair,
      sellTokenId,
      buyTokenId,
      sellAmount,
      minBuyAmount,
      true,
      isSwapAllDeposit,
    );
    console.log(result);
  } else if (action === 'make-lm-available') {
    const result = await wrapper.makeLmAptAvailable(keypair);
    console.log(result)
  } else if (action === 'claim-lm') {
    const userAptSpl = await getAssociatedTokAcc(TokenID.APT);
    const result = await wrapper.claimAptLmReward(keypair, userAptSpl);
    console.log(result)
  } else {
    throw new Error(`Unknown command=${action}`);
  }

  process.exit();
}

doTransaction();
