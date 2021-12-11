# Pool Sample
## Running samplePool.ts
```
yarn pool-sample {tokenID} {mode: default|client|raw}
```
## User Friendly Implementation:
0. Import the helper functions from `sdk-ts`:

    - `getConnection()`: get a solana connection object to our RPC endpoint.
    - `createAssetPoolLoader()`: factory method that would create a pool loader. You can pass in an optional `async` pricing callback of type `(token: TokenID) => Promise<number | undefined>`. If `undefined` is passed in for pricing callback, then the loader will use apricot's pricing callback by default.
1. Create a connection by calling `getConnection()`.
2. Create an asset pool loader by calling `createAssetPoolLoader()`.
3. Call `getAssetPool`, pass in a `TokenID` type, which is an enum of the token name, you can find the enum definition under `constants/configs.ts`.
4. Result will be type `ApiAssetPool` defined in `types.ts`.

## Pro/Dev Implementation:
0. Import the helper functions from `sdk-ts`:

    - `getConnection()`: get a solana connection object to our RPC endpoint.
    - `ActionWrapper`: the type would get account data and deserialize as raw data.
    - Helper functions such as `nativeAmountToTokenAmount` from `utils/transform.ts`.

1. Create a connection by calling `getConnection()`.
2. Get pool raw data by calling `await actionWrapper.getParsedAssetPool(MINTS[tokenId])`.
3. Parse the raw data with the help of the helper function such as `nativeAmountToTokenAmount`.

# Portfolio Sample
## Running samplePortfolio.ts
```
yarn portfolio-sample {walletPublicKey} {mode: default|raw}
```
## User Friendly Implementation:
0. Import the helper functions from `sdk-ts`:

    - `getConnection()`: get a solana connection object to our RPC endpoint.
    - `createPortfolioLoader()`: factory method that would create a portfolio loader. You can pass in an optional `async` pricing callback of type `(token: TokenID) => Promise<number | undefined>`. If `undefined` is passed in for pricing callback, then the loader will use apricot's pricing callback by default.
1. Create a connection by calling `getConnection()`.
2. Create portfolio loader by calling `createPortfolioLoader()`.
3. Call `await portfolioLoader.refreshPortfolio()` to get the user data and pool data. To get the latest data, this method should be called prior the other query methods.
4. Call the portfolio query methods as needed. Available methods are:

    - `getUserInfoAddress()`: user raw data's address.
    - `getUserAssetInfoList()`: user's positions.
    - `getBorrowPowerInfo()`: User's collateral ratio, assist limits and liquidation limits info.

## Pro/Dev Implementation:
0. Import the helper functions from `sdk-ts`:

    - `getConnection()`: get a solana connection object to our RPC endpoint.
    - `ActionWrapper`: the type would get account data and deserialize as raw data.

1. Create a connection by calling `getConnection()`.
2. Get user raw data by calling `await actionWrapper.getParsedUserInfo(walletKey)`.
3. Please refer to `api/portfolio.ts` on how to interpret the raw data.