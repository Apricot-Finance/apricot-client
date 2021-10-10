import { PriceInfo } from "../utils/PriceInfo";
import { ALPHA_CONFIG } from "..";
import { Connection } from "@solana/web3.js";

async function doPrice() {

  const priceInfo = new PriceInfo(ALPHA_CONFIG);

  const conn = new Connection("https://lokidfxnwlabdq.main.genesysgo.net:8899/", "confirmed");

  for (const poolConfig of priceInfo.config.getPoolConfigList()) {
    const tokId = poolConfig.tokenId;
    console.log(`Fetching price for ${tokId}`);
    const price = await priceInfo.fetchPrice(tokId, conn);
    console.log(`Price for ${tokId}: ${price}`);
    if (poolConfig.isLp()) {
      const amounts = await priceInfo.fetchLRLpAmounts(tokId, conn);
      console.log(amounts);
    }
  }

  process.exit();
}

doPrice();