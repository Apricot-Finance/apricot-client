import { Connection, PublicKey } from "@solana/web3.js";
import { ALPHA_CONFIG, PUBLIC_CONFIG } from "../constants";
import { TokenID } from "../types";
import { MINTS } from "../constants";
import { ActionWrapper } from "../utils/ActionWrapper";
import invariant from "tiny-invariant";

const [_nodeStr, _scriptStr, production, action, ] = process.argv.slice(0, 4);

invariant(['alpha', 'public'].includes(production))

async function doParse() {

  const conn = new Connection("https://apricot.genesysgo.net", "confirmed");
  const config = production === 'alpha' ? ALPHA_CONFIG : PUBLIC_CONFIG;
  const wrapper = new ActionWrapper(conn, config);

  if(action === "pool") {
    const poolId = TokenID[process.argv[4] as keyof typeof TokenID];
    const poolMint = MINTS[poolId]!;
    const result = await wrapper.getParsedAssetPool(poolMint)!;
    console.log(result);

  }
  else if(action === "price") {
    const poolId = TokenID[process.argv[4] as keyof typeof TokenID];
    const poolMint = MINTS[poolId]!;
    const result = await wrapper.getParsedAssetPrice(poolMint)!;
    console.log(result);

  }
  else if(action === "user") {
    const userKeyStr = process.argv[4];
    const userKey = new PublicKey(userKeyStr);
    const result = await wrapper.getParsedUserInfo(userKey);
    console.log(result);
  }
  else if(action === "user-stats") {
    const result = await wrapper.getParsedUserPagesStats();
    console.log(result);
  }
  else {
    throw new Error(`Unknown action: ${action}`);
  }

  process.exit();
}

doParse();