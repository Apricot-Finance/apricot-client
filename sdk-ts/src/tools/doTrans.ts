import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { ALPHA_CONFIG, DECIMAL_MULT, LP_TO_LR } from "../constants";
import { TokenID } from "../types";
import { MINTS } from "../constants";
import { ActionWrapper } from "../utils/ActionWrapper";
import * as fs from "fs";
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";

const [_nodeStr, _scriptStr, keyLocation, action, ] = process.argv.slice(0, 4);

async function doTransaction() {
  const keyStr = fs.readFileSync(keyLocation, "utf8");
  const privateKey = JSON.parse(keyStr);
  const keypair = Keypair.fromSecretKey(new Uint8Array(privateKey));

  const conn = new Connection("https://lokidfxnwlabdq.main.genesysgo.net:8899/", "confirmed");
  const wrapper = new ActionWrapper(conn, ALPHA_CONFIG);

  const remainingArgs = process.argv.slice(4);

  async function getAssociatedTokAcc(tokenId: TokenID) : Promise<PublicKey> {
    return await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, MINTS[tokenId], keypair.publicKey);
  }

  if(action === "deposit") {
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
  }

  else if(action === "withdraw") {
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
  }
  else if(action === "borrow") {
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
  }
  else if(action === "repay") {
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
  }
  else if(action === "lp-create") {
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
  }
  else if(action === "lp-redeem") {
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
  }
  else {
    throw new Error(`Unknown command=${action}`);
  }

  process.exit();
}

doTransaction();