import { exit } from "process";
import {
  TokenID,
  createAssetPoolLoader,
  getRPCConnection,
  getPriceInfo,
  ActionWrapper,
  MINTS,
  normalizePool,
  Addresses,
  PUBLIC_CONFIG,
  DUAL_REWARD_CONFIGS,
} from "@apricot-lend/sdk-ts";
import { Argument, Command } from "commander";

async function sampleDefaultPricing(tokenId: TokenID): Promise<void> {
  console.log("Sample: get AssetPool with apricot pricing.");
  let connection = getRPCConnection('triton');
  let assetPoolLoader = await createAssetPoolLoader(connection);

  let assetPool = await assetPoolLoader.getAssetPool(tokenId);
  console.log(assetPool);
}

async function sampleClientPricing(tokenId: TokenID): Promise<void> {
  console.log("Sample: get AssetPool with client pricing.");
  let connection = getRPCConnection('triton');
  let priceInfo = getPriceInfo();
  const isDualRewardToken = Object.values(DUAL_REWARD_CONFIGS).some(
    (info) => info.tokenId == tokenId
  );
  let assetPoolLoader = await createAssetPoolLoader(
    connection,
    async (tokenId: TokenID) => {
      try {
        if (isDualRewardToken) {
          return await priceInfo.fetchRaydiumPrice(tokenId);
        } else {
          return await priceInfo.fetchPrice(tokenId, connection);
        }
      } catch (error) {
        console.error(error);
        return undefined;
      }
    }
  );

  let assetPool = await assetPoolLoader.getAssetPool(tokenId);
  console.log(assetPool);
}

async function sampleRaw(tokenId: TokenID): Promise<void> {
  console.log("Sample: getting raw AssetPool data and process.");
  let connection = getRPCConnection();
  let actionWrapper = new ActionWrapper(connection);
  let addresses = new Addresses(PUBLIC_CONFIG);
  let mintKey = MINTS[tokenId];
  let assetPoolRaw = await actionWrapper.getParsedAssetPool(mintKey);
  if (assetPoolRaw === null) {
    console.error(`TokenID: ${tokenId} doesn't have a pool`, tokenId);
    exit(1);
  }

  let priceInfo = getPriceInfo();
  const isDualRewardToken = Object.values(DUAL_REWARD_CONFIGS).some(
    (info) => info.tokenId == tokenId
  );
  let fetchPrice = async (tokenId: TokenID) => {
    return isDualRewardToken
      ? await priceInfo.fetchCoinGeckoPrice(tokenId)
      : await priceInfo.fetchPrice(tokenId, connection);
  };

  let assetPool = await normalizePool(
    tokenId,
    mintKey,
    assetPoolRaw,
    addresses,
    fetchPrice
  );
  console.log(assetPool);
}

async function main(): Promise<void> {
  let program = new Command();
  program
    .addArgument(new Argument("token"))
    .addArgument(
      new Argument("mode")
        .choices(["default", "client", "raw"])
        .default("default")
    )
    .parse();

  const [token, mode] = program.args;
  let tokenId = token as TokenID;
  if (mode === "client") {
    await sampleClientPricing(tokenId);
  } else if (mode === "raw") {
    await sampleRaw(tokenId);
  } else {
    await sampleDefaultPricing(tokenId);
  }
}

main();
