import { Connection, PublicKey } from "@solana/web3.js";
import { ALPHA_CONFIG } from "../constants";
import { TokenID } from "../types";
import { MINTS } from "../constants";
import { ActionWrapper } from "../utils/ActionWrapper";

const [nodeStr, scriptStr, action, ] = process.argv.slice(0, 3);

async function doParse() {

  const conn = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
  const wrapper = new ActionWrapper(conn, ALPHA_CONFIG);

  if(action === "pool") {
    const poolId = TokenID[process.argv[3] as keyof typeof TokenID];
    const poolMint = MINTS[poolId]!;
    const result = await wrapper.getParsedAssetPool(poolMint)!;
    console.log(result);

  }
  else if(action === "price") {
    const poolId = TokenID[process.argv[3] as keyof typeof TokenID];
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