import { exit } from "process";
import {
  TokenID,
  createAssetPoolLoader,
  getConnection,
  getPriceInfo,
  ActionWrapper,
  MINTS,
  LM_MNDE_MULTIPLIER,
  nativeAmountToTokenAmount,
  nativeAmountToValue,
  nativeRateToTokenRate,
  nativeRateToValueRate,
  tokenRateToNativeRate,
  currentPerPastRateToCurrentPerCurrentRate,
} from "../../sdk-ts"

async function sampleDefaultPricing(tokenId: TokenID): Promise<void> {
  console.log("Sample: get AssetPool with apricot pricing.");
  let connection = getConnection();
  let assetPoolLoader = await createAssetPoolLoader(connection);

  let assetPool = await assetPoolLoader.getAssetPool(tokenId);
  console.log(assetPool);
}

async function sampleClientPricing(tokenId: TokenID): Promise<void> {
  console.log("Sample: get AssetPool with client pricing.");
  let connection = getConnection();
  let priceInfo = getPriceInfo();
  let assetPoolLoader = await createAssetPoolLoader(connection, async (tokenId: TokenID) => 
  {
    try {
      if (tokenId === TokenID.MNDE) {
        return await priceInfo.fetchRaydiumPrice(tokenId);
      } else {
        return await priceInfo.fetchPrice(tokenId, connection);
      }
    }
    catch (error) {
      console.error(error);
      return undefined;
    }
  });

  let assetPool = await assetPoolLoader.getAssetPool(tokenId);
  console.log(assetPool);
}

async function sampleRaw(tokenId: TokenID): Promise<void> {
  console.log("Sample: getting raw AssetPool data and process.");
  let connection = getConnection();
  let actionWrapper = new ActionWrapper(connection);
  let assetPoolRaw = await actionWrapper.getParsedAssetPool(MINTS[tokenId]);
  if (assetPoolRaw === null) {
    console.error(`TokenID: ${tokenId} doesn't have a pool`, tokenId);
    exit(1);
  }

  let priceInfo = getPriceInfo();
  let fetchPrice = async (tokenId: TokenID) => 
  {
    return (tokenId === TokenID.MNDE)
      ? await priceInfo.fetchRaydiumPrice(tokenId)
      : await priceInfo.fetchPrice(tokenId, connection);
  };
  let tokenPrice = await fetchPrice(tokenId);
  let aptPrice = await fetchPrice(TokenID.APT);
  let mndePrice = await fetchPrice(TokenID.MNDE);

  let depositAmount = assetPoolRaw!.deposit_amount;
  console.log(`Deposit solana native amount: ${depositAmount}`);
  console.log(`Deposit token amount: ${nativeAmountToTokenAmount(tokenId, depositAmount)}`);
  console.log(`Deposit USD value: ${nativeAmountToValue(tokenId, depositAmount, tokenPrice)}`);

  let depositIndex = assetPoolRaw.deposit_index;
  let aptRewardPerDepositPerYear = currentPerPastRateToCurrentPerCurrentRate(
    assetPoolRaw.reward_per_year_per_d,
    depositIndex,
  );
  console.log(`APT reward rate for deposit per year (APT solana native/Token solana native): ${aptRewardPerDepositPerYear}`);
  console.log(`APT reward rate for deposit per year (APT/Token): ${nativeRateToTokenRate(
    aptRewardPerDepositPerYear,
    TokenID.APT,
    tokenId,
  )}`);
  console.log(`APT reward rate for deposit per year (USD/USD): ${nativeRateToValueRate(
    aptRewardPerDepositPerYear,
    TokenID.APT,
    tokenId,
    aptPrice,
    tokenPrice,
  )}`);

  if (tokenId === TokenID.mSOL) {
    let mndeRewardPerDepositPerYear = aptRewardPerDepositPerYear.mul(
      tokenRateToNativeRate(LM_MNDE_MULTIPLIER, TokenID.MNDE, TokenID.APT)
    )
    console.log(`MNDE reward rate for deposit per year (MNDE solana native/Token solana native): ${mndeRewardPerDepositPerYear}`);
    console.log(`MNDE reward rate for deposit per year (MNDE/Token): ${nativeRateToTokenRate(
      mndeRewardPerDepositPerYear,
      TokenID.MNDE,
      tokenId,
    )}`);
    console.log(`MNDE reward rate for deposit per year (USD/USD): ${nativeRateToValueRate(
      mndeRewardPerDepositPerYear,
      TokenID.MNDE,
      tokenId,
      mndePrice,
      tokenPrice,
    )}`);
  }
}

async function main() : Promise<void> {
  if (process.argv.length < 4) {
    console.log("Usage: yarn pool-sample {token:TokenID} {mode: default|client|raw}");
    exit(1);
  }
  const [_nodeStr, _scriptStr, token, mode] = process.argv;
  let tokenId = token as TokenID;
  if (mode === 'client') {
    await sampleClientPricing(tokenId);
  } else if (mode === 'raw') {
    await sampleRaw(tokenId);
  } else {
    await sampleDefaultPricing(tokenId);
  }
}

main();
