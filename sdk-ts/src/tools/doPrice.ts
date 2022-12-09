import { ALPHA_CONFIG, PUBLIC_CONFIG } from "../constants/configs";
import { PriceInfo } from "../utils/PriceInfo";
import invariant from "tiny-invariant";
import { getRPCConnection } from "../utils";

const [,,production, endpoint] = process.argv;

invariant(['alpha', 'public'].includes(production));

const config = production === 'alpha' ? ALPHA_CONFIG : PUBLIC_CONFIG;

async function doPrice() {

  const priceInfo = new PriceInfo(config);
  const conn = getRPCConnection(endpoint);
  const poolConfigs = config.getPoolConfigList()
    .sort((a, b) => a.tokenId > b.tokenId ? -1 : 1)
    .sort((a, b) => a.isLp() && !b.isLp() ? 1 : -1);

  console.log('Start to fetch price:');

  for (const poolConfig of poolConfigs) {
    // if (!poolConfig.isLp()) continue;
    const tokId = poolConfig.tokenId;
    if (tokId.includes('UST')) continue;
    console.log(`${tokId}`);
    const price = await priceInfo.fetchPrice(tokId, conn, true);
    console.log(`${price}(primary)`);
    if (tokId in config.pythPriceKeys) {
      const pythPrice = await priceInfo.fetchViaPyth(tokId, conn);
      console.log(`${pythPrice}(pyth)`);
    }
    if (poolConfig.isLp()) {
      const price = await priceInfo.fetchPrice(tokId, conn, false);
      console.log(`${price}(reference)`);
    }
    if (poolConfig.isLp()) {
      const amounts = await priceInfo.fetchLRValuets(tokId, conn);
      console.log(amounts);
    }
  }

  process.exit();
}

doPrice();