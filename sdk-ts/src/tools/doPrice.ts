import { ALPHA_CONFIG, PUBLIC_CONFIG } from "../constants/configs";
import { PriceInfo } from "../utils/PriceInfo";
import { Connection } from "@solana/web3.js";
import invariant from "tiny-invariant";

const [,,production] = process.argv;

invariant(['alpha', 'public'].includes(production));

const config = production === 'alpha' ? ALPHA_CONFIG : PUBLIC_CONFIG;

async function doPrice() {

  const priceInfo = new PriceInfo(config);

  const conn = new Connection("https://apricot.genesysgo.net/", "confirmed");

  for (const poolConfig of config.getPoolConfigList()) {
    const tokId = poolConfig.tokenId;
    console.log(`Fetching price for ${tokId}`);
    const price = await priceInfo.fetchPrice(tokId, conn);
    console.log(`Primary Price for ${tokId}: ${price}`);
    if (tokId in config.pythPriceKeys) {
      const pythPrice = await priceInfo.fetchViaPyth(tokId, conn);
      console.log(`Pyth Price for ${tokId}: ${pythPrice}`);
    }
    if (poolConfig.isLp()) {
      const amounts = await priceInfo.fetchLRValuets(tokId, conn);
      console.log(amounts);
    }
  }

  process.exit();
}

doPrice();