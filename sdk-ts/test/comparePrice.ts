import { ALPHA_CONFIG, PUBLIC_CONFIG } from "../src/constants/configs";
import { PriceInfo } from "../src/utils/PriceInfo";
import { Connection } from "@solana/web3.js";
import invariant from "tiny-invariant";
import { delay, TokenID } from "../src";

const [,,production] = process.argv;
invariant(['alpha', 'public'].includes(production));

const config = production === 'alpha' ? ALPHA_CONFIG : PUBLIC_CONFIG;

class PriceDiffInfo {
  constructor(
    public diffPercent: number,
    public tokenId: TokenID,
    public priceUsing: number,
    public priceByChain: number,
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
const conn = new Connection("https://apricot.genesysgo.net/", "confirmed");

async function doPrice() {
  console.log(`\nCurrent time: ${new Date().toLocaleString()}\n`);

  for (const poolConfig of config.getPoolConfigList()) {
    // if (poolConfig.lpDex !== Dex.Raydium) continue; // test raydium lp only

    const tokId = poolConfig.tokenId;
    console.log(`Fetching price for ${tokId}`);

    try {
      const price = await priceInfo.fetchPrice(tokId, conn);
      console.log(`Price for ${tokId}: ${price}`);
      
      const price2 = await priceInfo.fetchPrice(tokId, conn, true);
      console.log(`Price by chain for ${tokId}: ${price2}`);

      const diffNormalised = Math.abs(price - price2) / price;
      console.log(`Normalised Price diff: ${diffNormalised}\n`);

      priceStats.add(new PriceDiffInfo(diffNormalised, tokId, price, price2));
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
  console.log(`Min normalised price difference: ${minDiff.diffPercent} of token: ${minDiff.tokenId} with price: ${minDiff.priceUsing}, ${minDiff.priceByChain}`);

  const maxDiff = priceStats.getMaxOrMinDiff()!;
  console.log(`Max normalised price difference: ${maxDiff.diffPercent} of token: ${maxDiff?.tokenId} with price: ${maxDiff.priceUsing}, ${maxDiff.priceByChain}`);

  console.log(`Average normalised price difference: ${priceStats.getAverageDiff()}`);
  console.log(`Standard deviation of normalised price difference: ${priceStats.getDiffStdDev()}`);

  const bigDiffs = priceStats.getBigDiffs();
  const bigDiffsPercent = Math.round(bigDiffs.length / priceStats.getCount() * 10000) / 100;
  console.log(`${bigDiffs.length} big normalised price differences (greater than ${priceStats.bigDiffLimit}) accounted for ${bigDiffsPercent}% are as below:`);
  bigDiffs.forEach(d => {
    console.log(`Difference: ${d.diffPercent}, token: ${d.tokenId}, price: ${d.priceUsing}, price by chain: ${d.priceByChain}`);
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