import { ALPHA_CONFIG } from "../constants";
import { Addresses } from "../addresses";


async function printAddresses() {
  const config = ALPHA_CONFIG;
  const consts = new Addresses(config);
  const [base_pda, bbump] = await consts.get_base_pda();
  const [price_pda, pbump] = await consts.get_price_pda();
  console.log(`PROGRAM : ${config.programPubkey.toString()}`);
  console.log(`ADMIN   : ${config.adminPubkey.toString()}`);
  console.log(`BASE_PDA  : ${base_pda.toString()}, bump=${bbump}`);
  console.log(`PRICE_PDA : ${price_pda.toString()}, bump=${pbump}`);
  console.log(`user_pages_stats: ${(await consts.get_user_pages_stats_key()).toString()}`);
  console.log(`pool_summaries  : ${(await consts.get_pool_summaries_key()).toString()}`);
  console.log(`Price_summaries : ${(await consts.get_price_summaries_key(base_pda)).toString()}`);
}

printAddresses();