import { ALPHA_CONFIG, PUBLIC_CONFIG } from "../src/constants/configs";
import { PriceInfo } from "../src/utils/PriceInfo";
import invariant from "tiny-invariant";
import { delay, getRPCConnection, TokenID } from "../src";

const [,,production, endpoint] = process.argv;
invariant(['alpha', 'public'].includes(production));

const config = production === 'alpha' ? ALPHA_CONFIG : PUBLIC_CONFIG;


class PriceDiffInfo {
  constructor(
    public diffPercent: number,
    public tokenId: TokenID,
    public priceSecondary: number,
    public pricePrimary: number,
  ) {};
}

class PriceStats {
  public priceDiffInfos: PriceDiffInfo[] = [];

  public add(diff: PriceDiffInfo) {
    this.priceDiffInfos.push(diff);
  }

  public getCount() { return this.priceDiffInfos.length; }

  public getMaxOrMinDiff(isMin = false): PriceDiffInfo {
    if (this.priceDiffInfos.length === 0) throw new Error('no price diff infos yet');
    let markedDiff: PriceDiffInfo | null = null;
    this.priceDiffInfos.forEach(diff => {
      if (!markedDiff
        || (isMin ? diff.diffPercent < markedDiff!.diffPercent : diff.diffPercent > markedDiff!.diffPercent)) {
        markedDiff = diff;
      }
    });
    return markedDiff!;
  }

  public getAverageDiff() {
    return this.priceDiffInfos.map(d => d.diffPercent).reduce((a, b) => a + b) / this.getCount();
  }

  public getDiffStdDev() {
    const ave = this.getAverageDiff();
    return Math.sqrt(this.priceDiffInfos.map(a => (a.diffPercent - ave) ** 2).reduce((a, b) => a + b) / this.getCount());
  }

  public readonly bigDiffLimit = 0.001;
  public getBigDiffs() {
    return this.priceDiffInfos.filter(diff => diff.diffPercent >= this.bigDiffLimit);
  }
}

const priceStats = new PriceStats();
const priceInfo = new PriceInfo(config);
const conn = getRPCConnection(endpoint);

async function doPrice() {
  console.log(`\nCurrent time: ${new Date().toLocaleString()}\n`);

  for (const poolConfig of config.getPoolConfigList()) {
    await delay(1000);
    // if (poolConfig.lpDex !== Dex.Raydium) continue; // test raydium lp only

    const tokId = poolConfig.tokenId;
    if (tokId.includes('UST')) continue;
    console.log(`Fetching price for ${tokId}`);

    try {
      let price: number;
      let price2: number | undefined = undefined;
      let price3: number | undefined = undefined;
      if (!poolConfig.isLp()) {
        price = await priceInfo.fetchPrice(tokId, conn);
        console.log(`${price}(switchboard)`);
        if (tokId in config.pythPriceKeys) {
          price2 = await priceInfo.fetchViaPyth(tokId, conn);
          console.log(`${price2}(pyth)`);
        }

        await delay(20_000); // delay to limit the request rate to Coingecko
        price3 = await priceInfo.fetchCoinGeckoPrice(tokId);
        console.log(`${price3}(Coingecko)`);
      } else {
        price = await priceInfo.fetchPrice(tokId, conn);
        console.log(`${price}(on-chain)`);

        price2 = await priceInfo.fetchPrice(tokId, conn, false);
        console.log(`${price2}(reference)`);
      }

      console.log('\n');
      if (price2 !== undefined) {
        const diffNormalised = Math.abs(price - price2) / price;
        console.log(`Normalised Price diff: ${diffNormalised}`);

        priceStats.add(new PriceDiffInfo(diffNormalised, tokId, price2, price));
      }
      if (price3 !== undefined) {
        const diffNormalised = Math.abs(price - price3) / price;
        console.log(`Normalised Price diff: ${diffNormalised}`);

        priceStats.add(new PriceDiffInfo(diffNormalised, tokId, price3, price));
      }
      console.log('\n');
    } catch (err) {
      console.log(`Error `, err);
      continue;
    }
  }
}

async function doStats () {
  console.log(`\n---- statistics of price difference ----`);

  console.log(`${loops} loops of prices comparision did.`);

  const minDiff = priceStats.getMaxOrMinDiff(true);
  console.log(`Min normalised price difference: ${minDiff.diffPercent} of token: ${minDiff.tokenId} with price: ${minDiff.priceSecondary}, ${minDiff.pricePrimary}`);

  const maxDiff = priceStats.getMaxOrMinDiff()!;
  console.log(`Max normalised price difference: ${maxDiff.diffPercent} of token: ${maxDiff?.tokenId} with price: ${maxDiff.priceSecondary}, ${maxDiff.pricePrimary}`);

  console.log(`Average normalised price difference: ${priceStats.getAverageDiff()}`);
  console.log(`Standard deviation of normalised price difference: ${priceStats.getDiffStdDev()}`);

  const bigDiffs = priceStats.getBigDiffs();
  const bigDiffsPercent = Math.round(bigDiffs.length / priceStats.getCount() * 10000) / 100;
  console.log(`${bigDiffs.length} big normalised price differences (greater than ${priceStats.bigDiffLimit}) accounted for ${bigDiffsPercent}% are as below:`);
  bigDiffs.forEach(d => {
    console.log(`Difference: ${d.diffPercent}, token: ${d.tokenId}, reference price: ${d.priceSecondary}, price primary : ${d.pricePrimary}`);
  });
}

let loops = 0;
(async () => {
  while(true) {
    await doPrice();
    if (++loops % 3 === 0) {
      await doStats();
    }
    await delay(3000);
  }
})();

/*
process.on('SIGINT', async function() {
  await doStats();
  process.exit();
});
*/