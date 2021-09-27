import { AccountParser, Wrapper } from "../AccountParser";
import { Connection, PublicKey } from "@solana/web3.js";
import { ALPHA_CONFIG } from "../constants";
import { TokenType } from "../types";
import { Addresses } from "../addresses";
import { MINTS } from "../constants";

const [nodeStr, scriptStr, action, ] = process.argv.slice(0, 3);

async function doParse() {

  const conn = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
  const wrapper = new Wrapper(conn, ALPHA_CONFIG);

  if(action === "pool") {
    const poolId = TokenType[process.argv[3] as keyof typeof TokenType];
    const poolMint = MINTS[poolId]!;
    const result = await wrapper.getParsedAssetPool(poolMint)!;
    console.log(result);

  }
  else if(action === "price") {
    const poolId = TokenType[process.argv[3] as keyof typeof TokenType];
    const poolMint = MINTS[poolId]!;
    const result = await wrapper.getParsedAssetPrice(poolMint)!;
    console.log(result);

  }
  else if(action === "user") {
    const userKeyStr = process.argv[3];
    const userKey = new PublicKey(userKeyStr);
    const result = await wrapper.getParsedUserInfo(userKey);
    console.log(result);
  }

  process.exit();
}

doParse();