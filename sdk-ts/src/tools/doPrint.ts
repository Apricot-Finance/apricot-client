import { ALPHA_CONFIG } from "../constants";
import { Addresses } from "../addresses";


async function printAddresses() {
  const config = ALPHA_CONFIG;
  const consts = new Addresses(config);
  const [base_pda, bbump] = await consts.getBasePda();
  const [price_pda, pbump] = await consts.getPricePda();
  console.log(`PROGRAM : ${config.programPubkey.toString()}`);
  console.log(`ADMIN   : ${config.adminPubkey.toString()}`);
  console.log(`BASE_PDA  : ${base_pda.toString()}, bump=${bbump}`);
  console.log(`PRICE_PDA : ${price_pda.toString()}, bump=${pbump}`);
  console.log(`user_pages_stats: ${(await consts.getUserPagesStatsKey()).toString()}`);
  console.log(`pool_summaries  : ${(await consts.getPoolSummariesKey()).toString()}`);
  console.log(`Price_summaries : ${(await consts.getPriceSummariesKey(base_pda)).toString()}`);

  console.log(config.poolConfigs);
}

printAddresses();