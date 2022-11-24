import { PublicKey } from "@solana/web3.js";
import { ALPHA_CONFIG, PUBLIC_CONFIG } from "../constants";
import { TokenID } from "../types";
import { MINTS } from "../constants";
import { ActionWrapper } from "../utils/ActionWrapper";
import invariant from "tiny-invariant";
import Decimal from "decimal.js";
import { getRPCConnection } from "../utils";

const [_nodeStr, _scriptStr, production, endpoint, action, ] = process.argv.slice(0, 5);

invariant(['alpha', 'public'].includes(production))

async function doParse() {

  const conn = getRPCConnection(endpoint);
  const config = production === 'alpha' ? ALPHA_CONFIG : PUBLIC_CONFIG;
  const wrapper = new ActionWrapper(conn, config);

  if(action === "pool") {
    const poolId = TokenID[process.argv[5] as keyof typeof TokenID];
    const poolMint = MINTS[poolId]!;
    const result = await wrapper.getParsedAssetPool(poolMint)!;
    const time = (result?.last_update_time ?? new Decimal(0)).toNumber();
    const lastUpdate = new Date(time * 1000);
    console.log(result);
    console.log(`Last update time: ${lastUpdate.toISOString()}`)

  } else if (action === 'check-ltvs') {
    console.log(`Check ltvs on-chain and in SDK:`)
    let isAllMatched = true;
    const tokenIds = Object.keys(config.ltvs) as TokenID[];
    for (const tokenId of tokenIds) {
      const poolId = config.tokenIdToPoolId[tokenId];
      invariant(poolId !== undefined, `Token ${tokenId} has no pool id`);
      const sdkLtv = config.ltvs[tokenId];
      invariant(sdkLtv !== undefined, `The LTV of ${tokenId} is not defined in SDK`);
      const result = await wrapper.getParsedAssetPool(config.getMintByPoolId(poolId));
      invariant(result, `Failed to get the asset pool of token ${tokenId}`);
      const ltvOnChain = result.ltv.toNumber();
      if (sdkLtv !== ltvOnChain) {
        isAllMatched = false;
        console.log(`${tokenId}: ${ltvOnChain} on-chain mismatched with the SDK value ${sdkLtv} !`);
      } else {
        console.log(`${tokenId}: ${ltvOnChain}`);
      }
    }
    console.log(isAllMatched ? `-- All LTVs match --` : ``);
  }
  else if(action === "price") {
    const poolId = TokenID[process.argv[5] as keyof typeof TokenID];
    const poolMint = MINTS[poolId]!;
    const result = await wrapper.getParsedAssetPrice(poolMint)!;
    console.log(result);

  }
  else if(action === "user") {
    const userKeyStr = process.argv[5];
    const userKey = new PublicKey(userKeyStr);
    const result = await wrapper.getParsedUserInfo(userKey);
    console.log(result);
  }
  else if(action === "user-page") {
    const pageId = parseInt(process.argv[5]);
    const page = await wrapper.getParsedUsersPage(pageId)!;
    invariant(page, `Failed to fetch usersPage`);
    const filteredPage = page?.filter(u => u.toBase58() !== '11111111111111111111111111111111');
    console.log(`pageId: ${pageId}`);
    console.log(`Num users: ${filteredPage.length}`);
    for(const key of filteredPage) {
      console.log(key.toBase58());
    }
  }
  else if(action === "user-stats") {
    const result = (await wrapper.getParsedUserPagesStats())!;
    console.log(result);
    const filtered = result.filter(n=>n !== 0);
    const free = filtered.reduce((a,b) => a + b, 0);
    const used = filtered.length * 320 - free;
    console.log(`num-free: ${free}`);
    console.log(`num-used: ${used}`);
  }
  else {
    throw new Error(`Unknown action: ${action}`);
  }

  process.exit();
}

doParse();