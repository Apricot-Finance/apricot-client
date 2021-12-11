import { PublicKey } from "@solana/web3.js";
import { exit } from "process";
import {
  getConnection,
  ActionWrapper,
  createPortfolioLoader,
} from "../../sdk-ts"

async function sampleRaw(walletAddress: string): Promise<void> {
  console.log("Sample getting raw data.");
  let connection = getConnection();
  let actionWrapper = new ActionWrapper(connection);
  let walletKey = new PublicKey(walletAddress);
  let userInfoRaw = await actionWrapper.getParsedUserInfo(walletKey);
  if (userInfoRaw === null) {
    console.log(`No user data found for wallet: ${walletAddress}`);
    exit(1);
  }
  console.log(userInfoRaw);
}

async function sampleDefault(walletAddress: string): Promise<void> {
  console.log("Sample: PortfolioLoader using apricot pricing");
  let walletKey = new PublicKey(walletAddress);
  let portfolioLoader = createPortfolioLoader(walletKey, getConnection());
  await portfolioLoader.refreshPortfolio();
  console.log(await portfolioLoader.getUserInfoAddress());
  console.log(await portfolioLoader.getUserAssetInfoList());
  console.log(await portfolioLoader.getBorrowPowerInfo());
  console.log(portfolioLoader.priceCache);
}

async function main() : Promise<void> {
  if (process.argv.length < 4) {
    console.log("Usage: yarn sample-user {walletAddress} {mode: raw|default}");
    exit(1);
  }
  const [_nodeStr, _scriptStr, walletAddress, mode] = process.argv;
  if (mode === 'raw') {
    await sampleRaw(walletAddress);
  } else {
    await sampleDefault(walletAddress);
  }
}

main();
