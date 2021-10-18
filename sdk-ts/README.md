# Apricot's Typescript SDK

For building transactions, see `src/utils/TransactionBuilder.ts`

For directly firing transactions, see `src/utils/ActionWrapper.ts` and `src/tools/doTrans.ts`

# setup
```
yarn install
yarn build
```

# doTrans.js script

After setup, you can invoke the tool scripts, for example:
```
# first deposit uses "new-and-deposit"
node dist/tools/doTrans.ts public your_wallet_key.json new-and-deposit SOL 1
# second deposit onwards uses just "deposit"
node dist/tools/doTrans.ts public your_wallet_key.json deposit USDC 10
```

Similar commands for withdraw, borrow, and repay also exist. Please refer to doTrans.ts for details.
