import { PublicKey } from "@solana/web3.js";
import { exit } from "process";
import {
  getConnection,
  ActionWrapper,
  createPortfolioLoader,
} from "@apricot-lend/sdk-ts"
import { Argument, Command } from 'commander';

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
  console.log(await portfolioLoader.getUserInfo());
  console.log(portfolioLoader.priceCache);
}

async function main() : Promise<void> {
  let program = new Command();
  program
    .addArgument(new Argument('walletAddress').argRequired())
    .addArgument(new Argument("mode").choices(['raw', 'default']).default('default'))
    .parse();

  if (process.argv.length < 4) {
    console.log("Usage: yarn sample-user {walletAddress} {mode: raw|default}");
    exit(1);
  }

  let walletAddress = program.args[0];
  let mode = program.args[1];
  if (mode === 'raw') {
    await sampleRaw(walletAddress);
  } else {
    await sampleDefault(walletAddress);
  }
}

main();
