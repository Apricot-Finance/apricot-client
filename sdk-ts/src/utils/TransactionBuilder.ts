import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Keypair, AccountMeta, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import invariant from "tiny-invariant";
import { Addresses } from "../addresses";
import { CMD_ADD_USER_AND_DEPOSIT, CMD_BORROW, CMD_DEPOSIT, CMD_EXTERN_LIQUIDATE, CMD_LP_CREATE, CMD_LP_OP_CHECK, CMD_LP_OP_ENDCHECK, CMD_LP_REDEEM, CMD_LP_STAKE, CMD_LP_STAKE_SECOND, CMD_LP_UNSTAKE, CMD_LP_UNSTAKE_SECOND, CMD_REFRESH_USER, CMD_REPAY, CMD_UPDATE_USER_CONFIG, CMD_WITHDRAW, CMD_WITHDRAW_AND_REMOVE_USER } from "../constants/commands";
import { LP_TO_LR, MINTS } from "../constants/configs";
import { UserInfo, TokenID } from "../types";
import { AccountParser } from "./AccountParser";

const sysvarInstructionsKey = new PublicKey("Sysvar1nstructions1111111111111111111111111");

export class TransactionBuilder {

  constructor(
    public addresses: Addresses,
  ) {

  }

  mintKeyStrToPoolIdArray(mintKeyStr: string) : number[] {
    return [this.addresses.mintKeyStrToPoolId(mintKeyStr)];
  }

  mintKeyStrToPoolId(mintKeyStr: string) : number {
    return this.addresses.mintKeyStrToPoolId(mintKeyStr);
  }

  async refreshUser(userWalletKey: PublicKey): Promise<Transaction> {
    const userInfoKey = await this.addresses.getUserInfoKey(userWalletKey);
    const poolSummariesKey = await this.addresses.getPoolSummariesKey();
    const inst = new TransactionInstruction({
      programId: this.addresses.getProgramKey(),
      keys: [
        { pubkey: userWalletKey,    isSigner: false, isWritable: false },    // wallet
        { pubkey: userInfoKey,      isSigner: false, isWritable: true },         // UserInfo
        { pubkey: poolSummariesKey, isSigner: false, isWritable: false },   // PoolSummaries
      ],
      data: Buffer.from([CMD_REFRESH_USER]),
    });
    return new Transaction().add(inst);
  }

  async updateUserConfig(
    walletAccount: Keypair,
    assistMode: number,
    selfDeleverageFactor: number,
    postDeleverageFactor: number,
  ): Promise<Transaction> {
    const walletKey = walletAccount.publicKey;
    const userInfoKey = await this.addresses.getUserInfoKey(walletKey);

    const buffer = new ArrayBuffer(16);
    AccountParser.setFloat64(buffer, 0, selfDeleverageFactor);
    AccountParser.setFloat64(buffer, 8, postDeleverageFactor);
    const payload = Array.from(new Uint8Array(buffer));
    const data = [CMD_UPDATE_USER_CONFIG, assistMode].concat(payload);

    const inst = new TransactionInstruction({
      programId: this.addresses.getProgramKey(),
      keys: [
        { pubkey: walletKey,    isSigner: true, isWritable: false },    // wallet
        { pubkey: userInfoKey,  isSigner: false, isWritable: true },   // userInfo
      ],
      data: Buffer.from(data),
    });
    return new Transaction().add(inst);
  }

  async addUserAndDeposit(
    pageId: number,
    walletAccount: Keypair,
    userSplKey: PublicKey,
    mintKeyStr: string,
    amount: number,
  ): Promise<Transaction> {
    const [basePda] = await this.addresses.getBasePda();
    const walletKey = walletAccount.publicKey;
    const userPagesStatsKey = await this.addresses.getUserPagesStatsKey();
    const usersPageKey = await this.addresses.getUsersPageKey(basePda, pageId);
    const userInfoKey = await this.addresses.getUserInfoKey(walletKey);
    const assetPoolKey = await this.addresses.getAssetPoolKey(basePda, mintKeyStr);
    const assetPoolSplKey = await this.addresses.getAssetPoolSplKey(basePda, mintKeyStr);
    const poolSummariesKey = await this.addresses.getPoolSummariesKey();
    const priceSummariesKey = await this.addresses.getPriceSummariesKey(basePda);
    const buffer = new ArrayBuffer(10);
    const view = new DataView(buffer);
    view.setUint16(0, pageId, true);
    AccountParser.setBigUint64(buffer, 2, amount);
    const payload = Array.from(new Uint8Array(buffer));
    const poolIdArray = this.mintKeyStrToPoolIdArray(mintKeyStr);

    const inst = new TransactionInstruction({
      programId: this.addresses.getProgramKey(),
      keys: [
        { pubkey: walletKey,              isSigner: true,  isWritable: true },  // user wallet
        { pubkey: userSplKey,             isSigner: false, isWritable: true },  // account for PoolList
        { pubkey: userPagesStatsKey,      isSigner: false, isWritable: true },  // UserPagesStats
        { pubkey: usersPageKey,           isSigner: false, isWritable: true },  // UsersPage
        { pubkey: userInfoKey,            isSigner: false, isWritable: true },  // UserInfo
        { pubkey: assetPoolKey,           isSigner: false, isWritable: true },  // AssetPool
        { pubkey: assetPoolSplKey,        isSigner: false, isWritable: true },  // AssetPool's spl account
        { pubkey: poolSummariesKey,       isSigner: false, isWritable: true },  // PoolSummaries
        { pubkey: priceSummariesKey,      isSigner: false, isWritable: false }, // PriceSummaries
        { pubkey: SystemProgram.programId,isSigner: false, isWritable: false }, // system program account
        { pubkey: TOKEN_PROGRAM_ID,       isSigner: false, isWritable: false }, // spl-token program account
      ],
      data: Buffer.from([CMD_ADD_USER_AND_DEPOSIT].concat(payload).concat(poolIdArray)),
    });
    // signer: walletAccount
    return new Transaction().add(inst);
  }

  async deposit(
    walletAccount: Keypair,
    userSplKey: PublicKey,
    mintKeyStr: string,
    amount: number,
  ): Promise<Transaction> {
    const [basePda] = await this.addresses.getBasePda();
    const userWalletKey = walletAccount.publicKey;
    const userInfoKey = await this.addresses.getUserInfoKey(userWalletKey);
    const assetPoolKey = await this.addresses.getAssetPoolKey(basePda, mintKeyStr);
    const assetPoolSplKey = await this.addresses.getAssetPoolSplKey(basePda, mintKeyStr);
    const poolSummariesKey = await this.addresses.getPoolSummariesKey();
    const priceSummariesKey = await this.addresses.getPriceSummariesKey(basePda);
    const buffer = new ArrayBuffer(8);
    AccountParser.setBigUint64(buffer, 0, amount);
    const payload = Array.from(new Uint8Array(buffer));
    const poolIdArray = this.mintKeyStrToPoolIdArray(mintKeyStr);

    const inst = new TransactionInstruction({
      programId: this.addresses.getProgramKey(),
      keys: [
        { pubkey: userWalletKey,    isSigner: true,  isWritable: true },  // user wallet
        { pubkey: userSplKey,       isSigner: false, isWritable: true },  // account for PoolList
        { pubkey: userInfoKey,      isSigner: false, isWritable: true },  // UserInfo
        { pubkey: assetPoolKey,     isSigner: false, isWritable: true },  // AssetPool
        { pubkey: assetPoolSplKey,  isSigner: false, isWritable: true },  // AssetPool's spl account
        { pubkey: poolSummariesKey, isSigner: false, isWritable: true },  // PoolSummaries
        { pubkey: priceSummariesKey,isSigner: false, isWritable: false }, // PriceSummaries
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // spl-token program account
      ],
      data: Buffer.from([CMD_DEPOSIT].concat(payload).concat(poolIdArray)),
    });
    // signer: walletAccount
    return new Transaction().add(inst);
  }

  async withdrawAndRemoveUser(
    walletAccount: Keypair,
    userSplKey: PublicKey,
    mintKeyStr: string,
    withdrawAll: boolean,
    amount: number,
    userInfo: UserInfo,
  ): Promise<Transaction | null> {
    const pageId = userInfo.page_id;
    if (pageId > 10000) {
      console.log("User not added to backend yet.");
      return null;
    }
    const [basePda] = await this.addresses.getBasePda();
    const userWalletKey = walletAccount.publicKey;
    const userPagesStatsKey = await this.addresses.getUserPagesStatsKey();
    const usersPageKey = await this.addresses.getUsersPageKey(basePda, pageId);
    const userInfoKey = await this.addresses.getUserInfoKey(userWalletKey);
    const assetPoolKey = await this.addresses.getAssetPoolKey(basePda, mintKeyStr);
    const assetPoolSplKey = await this.addresses.getAssetPoolSplKey(basePda, mintKeyStr);
    const poolSummariesKey = await this.addresses.getPoolSummariesKey();
    const priceSummariesKey = await this.addresses.getPriceSummariesKey(basePda);
    const keys = [
      { pubkey: userWalletKey,      isSigner: true, isWritable: true }, // user wallet
      { pubkey: userSplKey,         isSigner: false, isWritable: true }, // account for PoolList
      { pubkey: userPagesStatsKey,  isSigner: false, isWritable: true }, // UserPagesStats
      { pubkey: usersPageKey,       isSigner: false, isWritable: true }, // UsersPage
      { pubkey: userInfoKey,        isSigner: false, isWritable: true }, // UserInfo
      { pubkey: assetPoolKey,       isSigner: false, isWritable: true }, // AssetPool
      { pubkey: assetPoolSplKey,    isSigner: false, isWritable: true }, // AssetPool's spl account
      { pubkey: poolSummariesKey,   isSigner: false, isWritable: true }, // PoolSummaries
      { pubkey: priceSummariesKey,  isSigner: false, isWritable: false }, // PriceSummaries
      { pubkey: basePda,            isSigner: false, isWritable: false }, // basePda
      { pubkey: TOKEN_PROGRAM_ID,   isSigner: false, isWritable: false }, // spl-token program account
    ];
    const buffer = new ArrayBuffer(9);
    AccountParser.setUint8(buffer, 0, withdrawAll ? 1 : 0);
    AccountParser.setBigUint64(buffer, 1, amount);
    const payload = Array.from(new Uint8Array(buffer));
    const poolIdArray = this.mintKeyStrToPoolIdArray(mintKeyStr);
    const data = [CMD_WITHDRAW_AND_REMOVE_USER].concat(payload).concat(poolIdArray);

    const inst = new TransactionInstruction({
      programId: this.addresses.getProgramKey(),
      keys: keys,
      data: Buffer.from(data),
    });
    // signer: walletAccount
    return new Transaction().add(inst);
  }

  async withdraw(
    walletAccount: Keypair,
    userSplKey: PublicKey,
    mintKeyStr: string,
    withdraw_all: boolean,
    amount: number,
  ): Promise<Transaction> {
    const [basePda] = await this.addresses.getBasePda();
    const userWalletKey = walletAccount.publicKey;
    const userInfoKey = await this.addresses.getUserInfoKey(userWalletKey);
    const assetPoolKey = await this.addresses.getAssetPoolKey(basePda, mintKeyStr);
    const assetPoolSplKey = await this.addresses.getAssetPoolSplKey(basePda, mintKeyStr);
    const poolSummariesKey = await this.addresses.getPoolSummariesKey();
    const priceSummariesKey = await this.addresses.getPriceSummariesKey(basePda);
    const keys = [
      { pubkey: userWalletKey,      isSigner: true, isWritable: true }, // user wallet
      { pubkey: userSplKey,         isSigner: false, isWritable: true }, // account for PoolList
      { pubkey: userInfoKey,        isSigner: false, isWritable: true }, // UserInfo
      { pubkey: assetPoolKey,       isSigner: false, isWritable: true }, // AssetPool
      { pubkey: assetPoolSplKey,    isSigner: false, isWritable: true }, // AssetPool's spl account
      { pubkey: poolSummariesKey,   isSigner: false, isWritable: true }, // PoolSummaries
      { pubkey: priceSummariesKey,  isSigner: false, isWritable: false }, // PriceSummaries
      { pubkey: basePda,            isSigner: false, isWritable: false }, // basePda
      { pubkey: TOKEN_PROGRAM_ID,   isSigner: false, isWritable: false }, // spl-token program account
    ];
    const buffer = new ArrayBuffer(9);
    AccountParser.setUint8(buffer, 0, withdraw_all ? 1 : 0);
    AccountParser.setBigUint64(buffer, 1, amount);
    const payload = Array.from(new Uint8Array(buffer));
    const poolIdArray = this.mintKeyStrToPoolIdArray(mintKeyStr);
    const data = [CMD_WITHDRAW].concat(payload).concat(poolIdArray);

    const inst = new TransactionInstruction({
      programId: this.addresses.getProgramKey(),
      keys: keys,
      data: Buffer.from(data),
    });
    // signer: walletAccount
    return new Transaction().add(inst);
  }

  async borrow(
    walletAccount: Keypair,
    userSplKey: PublicKey,
    mintKeyStr: string,
    amount: number,
  ): Promise<Transaction> {
    const [basePda] = await this.addresses.getBasePda();
    const userWalletKey = walletAccount.publicKey;
    const userInfoKey = await this.addresses.getUserInfoKey(userWalletKey);
    const assetPoolKey = await this.addresses.getAssetPoolKey(basePda, mintKeyStr);
    const assetPoolSplKey = await this.addresses.getAssetPoolSplKey(basePda, mintKeyStr);
    const poolSummariesKey = await this.addresses.getPoolSummariesKey();
    const priceSummariesKey = await this.addresses.getPriceSummariesKey(basePda);
    const keys = [
      { pubkey: userWalletKey,    isSigner: true, isWritable: true }, // user wallet
      { pubkey: userSplKey,       isSigner: false, isWritable: true }, // account for PoolList
      { pubkey: userInfoKey,      isSigner: false, isWritable: true }, // UserInfo
      { pubkey: assetPoolKey,     isSigner: false, isWritable: true }, // AssetPool
      { pubkey: assetPoolSplKey,  isSigner: false, isWritable: true }, // AssetPool's spl account
      { pubkey: poolSummariesKey, isSigner: false, isWritable: true }, // PoolSummaries
      { pubkey: priceSummariesKey,isSigner: false, isWritable: false }, // PriceSummaries
      { pubkey: basePda,          isSigner: false, isWritable: false }, // basePda
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // spl-token program account
    ];

    const buffer = new ArrayBuffer(8);
    AccountParser.setBigUint64(buffer, 0, amount);
    const payload = Array.from(new Uint8Array(buffer));
    const poolIdArray = this.mintKeyStrToPoolIdArray(mintKeyStr);
    const data = [CMD_BORROW].concat(payload).concat(poolIdArray);

    const inst = new TransactionInstruction({
      programId: this.addresses.getProgramKey(),
      keys: keys,
      data: Buffer.from(data),
    });
    // signer: walletAccount
    return new Transaction().add(inst);
  }

  async repay(
    walletAccount: Keypair,
    userSplKey: PublicKey,
    mintKeyStr: string,
    repay_all: boolean,
    amount: number,
  ): Promise<Transaction> {
    const [basePda] = await this.addresses.getBasePda();
    const userWalletKey = walletAccount.publicKey;
    const userInfoKey = await this.addresses.getUserInfoKey(userWalletKey);
    const assetPoolKey = await this.addresses.getAssetPoolKey(basePda, mintKeyStr);
    const assetPoolSplKey = await this.addresses.getAssetPoolSplKey(basePda, mintKeyStr);
    const poolSummariesKey = await this.addresses.getPoolSummariesKey();
    const keys = [
      { pubkey: userWalletKey,    isSigner: true,  isWritable: true }, // user wallet
      { pubkey: userSplKey,       isSigner: false, isWritable: true }, // account for PoolList
      { pubkey: userInfoKey,      isSigner: false, isWritable: true }, // UserInfo
      { pubkey: assetPoolKey,     isSigner: false, isWritable: true }, // AssetPool
      { pubkey: assetPoolSplKey,  isSigner: false, isWritable: true }, // AssetPool's spl account
      { pubkey: poolSummariesKey, isSigner: false, isWritable: true }, // PoolSummaries
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // spl-token program account
    ];
    const buffer = new ArrayBuffer(9);
    AccountParser.setUint8(buffer, 0, repay_all ? 1 : 0);
    AccountParser.setBigUint64(buffer, 1, amount);
    const payload = Array.from(new Uint8Array(buffer));
    const poolIdArray = this.mintKeyStrToPoolIdArray(mintKeyStr);
    const inst = new TransactionInstruction({
      programId: this.addresses.getProgramKey(),
      keys: keys,
      data: Buffer.from([CMD_REPAY].concat(payload).concat(poolIdArray)),
    });
    // signer: walletAccount
    return new Transaction().add(inst);
  }

  async externalLiquidate(
    liquidatorWalletAccount: Keypair,
    liquidatedWalletKey: PublicKey,
    liquidatorCollateralSpl: PublicKey,
    liquidatorBorrowedSpl: PublicKey,
    collateralMintStr: string,
    borrowedMintStr: string,
    minCollateralAmount: number,
    repaidBorrowAmount: number,
  ): Promise<Transaction> {
    const [basePda] = await this.addresses.getBasePda();
    const liquidatorWalletKey = liquidatorWalletAccount.publicKey;
    const userInfoKey = await this.addresses.getUserInfoKey(liquidatedWalletKey);

    const collateralPoolKey = await this.addresses.getAssetPoolKey(basePda, collateralMintStr);
    const collateralPoolSpl = await this.addresses.getAssetPoolSplKey(basePda, collateralMintStr);

    const borrowedPoolKey = await this.addresses.getAssetPoolKey(basePda, borrowedMintStr);
    const borrowedPoolSpl = await this.addresses.getAssetPoolSplKey(basePda, borrowedMintStr);

    const poolSummariesKey = await this.addresses.getPoolSummariesKey();
    const priceSummariesKey = await this.addresses.getPriceSummariesKey(basePda);

    const keys = [
      { pubkey: liquidatedWalletKey,      isSigner: false, isWritable: false },
      { pubkey: liquidatorWalletKey,      isSigner: true,  isWritable: false },
      { pubkey: userInfoKey,              isSigner: false, isWritable: true },
      { pubkey: basePda,                  isSigner: false, isWritable: false },

      { pubkey: liquidatorCollateralSpl,  isSigner: false, isWritable: true },
      { pubkey: liquidatorBorrowedSpl,    isSigner: false, isWritable: true },

      { pubkey: collateralPoolKey,        isSigner: false, isWritable: true },
      { pubkey: collateralPoolSpl,        isSigner: false, isWritable: true },

      { pubkey: borrowedPoolKey,          isSigner: false, isWritable: true },
      { pubkey: borrowedPoolSpl,          isSigner: false, isWritable: true },

      { pubkey: poolSummariesKey,         isSigner: false, isWritable: true }, // PoolSummaries
      { pubkey: priceSummariesKey,        isSigner: false, isWritable: false }, // PriceSummaries

      { pubkey: TOKEN_PROGRAM_ID,         isSigner: false, isWritable: false }, // spl-token program account
    ];

    const buffer = new ArrayBuffer(8 + 8);
    AccountParser.setBigUint64(buffer, 0, minCollateralAmount);
    AccountParser.setBigUint64(buffer, 8, repaidBorrowAmount);
    const payload = Array.from(new Uint8Array(buffer));
    const collateralPoolIdArray = this.mintKeyStrToPoolIdArray(collateralMintStr);
    const borrowedPoolIdArray = this.mintKeyStrToPoolIdArray(borrowedMintStr);
    const data = [CMD_EXTERN_LIQUIDATE]
      .concat(payload)
      .concat(collateralPoolIdArray)
      .concat(borrowedPoolIdArray);

    const inst = new TransactionInstruction({
      programId: this.addresses.getProgramKey(),
      keys: keys,
      data: Buffer.from(data),
    });
    // signer: liquidator_wallet_account
    return new Transaction().add(inst);
  }

  async buildLpOpCheckIx(
    userWalletKey: PublicKey,

    leftMintStr: string,
    leftAmount: number,

    rightMintStr: string,
    rightAmount: number,

    lpMintStr: string,
    minLpAmount: number,

    targetSwap: number,
    isCreate: boolean,
    isSigned: boolean,
  ): Promise<TransactionInstruction> {
    const [base_pda,]= await this.addresses.getBasePda();
    const userInfoKey = await this.addresses.getUserInfoKey(userWalletKey);
    const leftAssetPoolKey = await this.addresses.getAssetPoolKey(base_pda, leftMintStr);
    const leftAssetPoolSplKey = await this.addresses.getAssetPoolSplKey(base_pda, leftMintStr);
    const rightAssetPoolKey = await this.addresses.getAssetPoolKey(base_pda, rightMintStr);
    const rightAssetPoolSplKey = await this.addresses.getAssetPoolSplKey(base_pda, rightMintStr);
    const lpAssetPoolKey = await this.addresses.getAssetPoolKey(base_pda, lpMintStr);
    const poolSummariesKey = await this.addresses.getPoolSummariesKey();
    const priceSummariesKey = await this.addresses.getPriceSummariesKey(base_pda);

    const keys = [
      {pubkey: userWalletKey,         isSigner: isSigned,    isWritable: false},
      {pubkey: userInfoKey,           isSigner: false,        isWritable: true},
      {pubkey: leftAssetPoolKey,      isSigner: false,        isWritable: true},
      {pubkey: leftAssetPoolSplKey,   isSigner: false,        isWritable: true},
      {pubkey: rightAssetPoolKey,     isSigner: false,        isWritable: true},
      {pubkey: rightAssetPoolSplKey,  isSigner: false,        isWritable: true},
      {pubkey: lpAssetPoolKey,        isSigner: false,        isWritable: true},
      {pubkey: poolSummariesKey,      isSigner: false,        isWritable: true},
      {pubkey: priceSummariesKey,     isSigner: false,        isWritable: false},
      {pubkey: sysvarInstructionsKey, isSigner: false,        isWritable: false},
    ];

    const buffer = new ArrayBuffer(29);
    AccountParser.setBigUint64(buffer, 0, leftAmount);
    AccountParser.setBigUint64(buffer, 8, rightAmount);
    AccountParser.setBigUint64(buffer, 16, minLpAmount);
    const leftPoolId = this.mintKeyStrToPoolId(leftMintStr);
    AccountParser.setUint8(buffer, 24, leftPoolId);
    const rightPoolId = this.mintKeyStrToPoolId(rightMintStr);
    AccountParser.setUint8(buffer, 25, rightPoolId);
    const lpPoolId = this.mintKeyStrToPoolId(lpMintStr);
    AccountParser.setUint8(buffer, 26, lpPoolId);
    AccountParser.setUint8(buffer, 27, targetSwap);
    AccountParser.setUint8(buffer, 28, isCreate? 1 : 0);
    const payload = Array.from(new Uint8Array(buffer));

    const data = [CMD_LP_OP_CHECK].concat(payload);

    return new TransactionInstruction({
      programId: this.addresses.getProgramKey(),
      keys: keys,
      data: Buffer.from(data)
    });
  }

  async buildLpOpEndcheckIx(
    _userWalletKey: PublicKey,
  ): Promise<TransactionInstruction> {
    const poolSummariesKey = await this.addresses.getPoolSummariesKey();

    const keys = [
      {pubkey: poolSummariesKey,          isSigner: false,        isWritable: true},     // PoolSummaries
    ];

    return new TransactionInstruction({
      programId: this.addresses.getProgramKey(),
      keys: keys,
      data: Buffer.from([CMD_LP_OP_ENDCHECK]),
    });
  }

  async marginLpCreate(
    walletAccount: Keypair,
    leftMintStr: string,
    leftAmount: number,
    rightMintStr: string,
    rightAmount: number,
    lpMintStr: string,
    min_lpAmount: number,
    targetSwap: number,
    swap_account_keys: AccountMeta[],
    stakeKeys: AccountMeta[],
  ): Promise<Transaction> {
    const [base_pda,] = await this.addresses.getBasePda();
    const user_wallet_key = walletAccount.publicKey;
    const userInfoKey = await this.addresses.getUserInfoKey(user_wallet_key);
    const leftAssetPoolKey = await this.addresses.getAssetPoolKey(base_pda, leftMintStr);
    const leftAssetPoolSplKey = await this.addresses.getAssetPoolSplKey(base_pda, leftMintStr);
    const rightAssetPoolKey = await this.addresses.getAssetPoolKey(base_pda, rightMintStr);
    const rightAssetPoolSplKey = await this.addresses.getAssetPoolSplKey(base_pda, rightMintStr);
    const lpAssetPoolKey = await this.addresses.getAssetPoolKey(base_pda, lpMintStr);
    const lpAssetPoolSplKey = await this.addresses.getAssetPoolSplKey(base_pda, lpMintStr);
    const poolSummariesKey = await this.addresses.getPoolSummariesKey();
    const priceSummariesKey = await this.addresses.getPriceSummariesKey(base_pda);

    const keys = [
      {pubkey: user_wallet_key,       isSigner: true,     isWritable: false},
      {pubkey: userInfoKey,           isSigner: false,    isWritable: true},
      {pubkey: base_pda,              isSigner: false,    isWritable: false},
      {pubkey: leftAssetPoolKey,      isSigner: false,    isWritable: true},
      {pubkey: leftAssetPoolSplKey,   isSigner: false,    isWritable: true},
      {pubkey: rightAssetPoolKey,     isSigner: false,    isWritable: true},
      {pubkey: rightAssetPoolSplKey,  isSigner: false,    isWritable: true},
      {pubkey: lpAssetPoolKey,        isSigner: false,    isWritable: true},
      {pubkey: lpAssetPoolSplKey,     isSigner: false,    isWritable: true},
      {pubkey: poolSummariesKey,      isSigner: false,    isWritable: true},
      {pubkey: priceSummariesKey,     isSigner: false,    isWritable: false},
      {pubkey: TOKEN_PROGRAM_ID,      isSigner: false,    isWritable: false},
    ].concat(swap_account_keys);

    const lpPoolId = this.mintKeyStrToPoolId(lpMintStr);

    // if this one involves stakeTable, add stakeTableKey
    const poolConfig = this.addresses.config.getPoolConfigByPoolId(lpPoolId);
    invariant(poolConfig);
    if (poolConfig.lpNeedSndStake) {
      const stakeTableKey = await this.addresses.getAssetPoolStakeTableKey(poolConfig.mint.toString());
      keys.push({ pubkey: stakeTableKey,  isSigner: false, isWritable: true });
    }

    const buffer = new ArrayBuffer(28);
    AccountParser.setBigUint64(buffer, 0, leftAmount);
    AccountParser.setBigUint64(buffer, 8, rightAmount);
    AccountParser.setBigUint64(buffer, 16, min_lpAmount);
    const leftPoolId = this.mintKeyStrToPoolId(leftMintStr);
    AccountParser.setUint8(buffer, 24, leftPoolId);
    const rightPoolId = this.mintKeyStrToPoolId(rightMintStr);
    AccountParser.setUint8(buffer, 25, rightPoolId);
    AccountParser.setUint8(buffer, 26, lpPoolId);
    AccountParser.setUint8(buffer, 27, targetSwap);
    const payload = Array.from(new Uint8Array(buffer));

    const data = [CMD_LP_CREATE].concat(payload);

    const inst = new TransactionInstruction({
      programId: this.addresses.getProgramKey(),
      keys: keys,
      data: Buffer.from(data)
    });

    const tx = new Transaction()
      .add(await this.buildLpOpCheckIx(
        walletAccount.publicKey, leftMintStr, leftAmount, rightMintStr, rightAmount, lpMintStr, min_lpAmount, targetSwap, true, true))
      .add(inst);

    if(stakeKeys.length > 0) {
      const stake_ix = await this.buildLpStakeIx(
        lpMintStr,
        targetSwap,
        stakeKeys,
      );
      tx.add(stake_ix);
    }

    return tx.add(await this.buildLpOpEndcheckIx(walletAccount.publicKey));
  }

  buildMarginLpRedeemParam(
    leftMintStr: string,
    minLeftAmount: number,
    rightMintStr: string,
    min_rightAmount: number,
    lpMintStr: string,
    lpAmount: number,
    targetSwap: number,
  ): number[] {
    const buffer = new ArrayBuffer(28);
    AccountParser.setBigUint64(buffer, 0, minLeftAmount);
    AccountParser.setBigUint64(buffer, 8, min_rightAmount);
    AccountParser.setBigUint64(buffer, 16, lpAmount);
    const leftPoolId = this.mintKeyStrToPoolId(leftMintStr);
    AccountParser.setUint8(buffer, 24, leftPoolId);
    const rightPoolId = this.mintKeyStrToPoolId(rightMintStr);
    AccountParser.setUint8(buffer, 25, rightPoolId);
    const lpPoolId = this.mintKeyStrToPoolId(lpMintStr);
    AccountParser.setUint8(buffer, 26, lpPoolId);
    AccountParser.setUint8(buffer, 27, targetSwap);
    const payload = Array.from(new Uint8Array(buffer));

    return [CMD_LP_REDEEM].concat(payload);
  }

  async marginLpRedeem(
    walletKey: PublicKey,
    leftMintStr: string,
    minLeftAmount: number,
    rightMintStr: string,
    min_rightAmount: number,
    lpMintStr: string,
    lpAmount: number,
    targetSwap: number,
    swap_account_keys: AccountMeta[],
    unstakeKeys: AccountMeta[],
    is_signed = true,
  ): Promise<Transaction> {
    const [base_pda,] = await this.addresses.getBasePda();
    const userInfoKey = await this.addresses.getUserInfoKey(walletKey);
    const leftAssetPoolKey = await this.addresses.getAssetPoolKey(base_pda, leftMintStr);
    const leftAssetPoolSplKey = await this.addresses.getAssetPoolSplKey(base_pda, leftMintStr);
    const rightAssetPoolKey = await this.addresses.getAssetPoolKey(base_pda, rightMintStr);
    const rightAssetPoolSplKey = await this.addresses.getAssetPoolSplKey(base_pda, rightMintStr);
    const lpAssetPoolKey = await this.addresses.getAssetPoolKey(base_pda, lpMintStr);
    const lpAssetPoolSplKey = await this.addresses.getAssetPoolSplKey(base_pda, lpMintStr);
    const poolSummariesKey = await this.addresses.getPoolSummariesKey();
    const priceSummariesKey = await this.addresses.getPriceSummariesKey(base_pda);

    const keys = [
      {pubkey: walletKey,            isSigner: is_signed,    isWritable: true},
      {pubkey: userInfoKey,           isSigner: false,        isWritable: true},
      {pubkey: base_pda,              isSigner: false,        isWritable: false},
      {pubkey: leftAssetPoolKey,      isSigner: false,        isWritable: true},
      {pubkey: leftAssetPoolSplKey,   isSigner: false,        isWritable: true},
      {pubkey: rightAssetPoolKey,     isSigner: false,        isWritable: true},
      {pubkey: rightAssetPoolSplKey,  isSigner: false,        isWritable: true},
      {pubkey: lpAssetPoolKey,        isSigner: false,        isWritable: true},
      {pubkey: lpAssetPoolSplKey,     isSigner: false,        isWritable: true},
      {pubkey: poolSummariesKey,      isSigner: false,        isWritable: true},
      {pubkey: priceSummariesKey,     isSigner: false,        isWritable: false},
      {pubkey: TOKEN_PROGRAM_ID,    isSigner: false,        isWritable: false},
    ].concat(swap_account_keys);

    const poolId = this.mintKeyStrToPoolId(lpMintStr);

    const poolConfig = this.addresses.config.getPoolConfigByPoolId(poolId);
    if (poolConfig.lpNeedSndStake) {
      const stakeTableKey = await this.addresses.getAssetPoolStakeTableKey(poolConfig.mint.toString());
      keys.push({ pubkey: stakeTableKey,  isSigner: false, isWritable: true });
    }

    const data = this.buildMarginLpRedeemParam(
      leftMintStr, minLeftAmount, rightMintStr, min_rightAmount, lpMintStr, lpAmount, targetSwap,
    );

    const inst = new TransactionInstruction({
      programId: this.addresses.getProgramKey(),
      keys: keys,
      data: Buffer.from(data),
    });

    const tx = new Transaction()
      .add(await this.buildLpOpCheckIx(
        walletKey, leftMintStr, minLeftAmount, rightMintStr, min_rightAmount, lpMintStr, lpAmount, targetSwap, false, is_signed));

    if(unstakeKeys.length > 0) {
      const unstake_ix = await this.buildLpUnstakeIx(
        lpMintStr,
        targetSwap,
        lpAmount,
        unstakeKeys,
      );
      tx.add(unstake_ix);
    }

    tx.add(inst);

    return tx.add(await this.buildLpOpEndcheckIx(walletKey));
  }

  async buildLpStakeIx(
    lpMintStr: string,
    targetSwap: number,
    stakeKeys: AccountMeta[],
  ): Promise<TransactionInstruction> {
    const [base_pda,] = await this.addresses.getBasePda();
    const poolSummariesKey = await this.addresses.getPoolSummariesKey();
    const lpAssetPoolSplKey = await this.addresses.getAssetPoolSplKey(base_pda, lpMintStr);

    const keys = [
      {pubkey: poolSummariesKey,          isSigner: false,        isWritable: false},
      {pubkey: lpAssetPoolSplKey,         isSigner: false,        isWritable: true},
      {pubkey: base_pda,                  isSigner: false,        isWritable: false},
    ].concat(stakeKeys);

    const buffer = new ArrayBuffer(8);
    AccountParser.setBigUint64(buffer, 0, 0);
    const payload = Array.from(new Uint8Array(buffer));

    const data = [CMD_LP_STAKE].concat(payload).concat([targetSwap]).concat(this.mintKeyStrToPoolIdArray(lpMintStr));

    return new TransactionInstruction({
      programId: this.addresses.getProgramKey(),
      keys: keys,
      data: Buffer.from(data),
    });
  }

  async buildLpStake2ndStepIx(
    lpMintStr: string,
    stakeTableKey: PublicKey,
    floatingLpSplKey: PublicKey,
    firstStakeKeys: AccountMeta[],
    secondStakeKeys: AccountMeta[],
  ) {
    const [base_pda,] = await this.addresses.getBasePda();
    // const userInfoKey = await this.addresses.getUserInfoKey(userWalletKey);
    const adminPubkey = this.addresses.getAdminKey();
    const lpAssetPoolKey = await this.addresses.getAssetPoolKey(base_pda, lpMintStr);

    const keys = [
      { pubkey: adminPubkey, isSigner: true, isWritable: false },
      { pubkey: lpAssetPoolKey, isSigner: false, isWritable: true },
      { pubkey: stakeTableKey, isSigner: false, isWritable: true },
      { pubkey: floatingLpSplKey, isSigner: false, isWritable: true },
      { pubkey: base_pda, isSigner: false, isWritable: false },
    ].concat(firstStakeKeys).concat(secondStakeKeys);

    const data = [CMD_LP_STAKE_SECOND];
    return new TransactionInstruction({
      programId: this.addresses.getProgramKey(),
      keys: keys,
      data: Buffer.from(data),
    });
  }

  async buildLpUnstake2ndStepIx(
    unstakeIdentity: PublicKey,
    userWalletKey: PublicKey,
    lpMintStr: string,
    stakeTableKey: PublicKey,
    floatingLpSplKey: PublicKey,
    firstStakeKeys: AccountMeta[],
    secondStakeKeys: AccountMeta[],
    amount: number,
  ) {
    const [base_pda,] = await this.addresses.getBasePda();
    const userInfoKey = await this.addresses.getUserInfoKey(userWalletKey);
    const lpAssetPoolKey = await this.addresses.getAssetPoolKey(base_pda, lpMintStr);

    const keys = [
      { pubkey: unstakeIdentity, isSigner: true, isWritable: false },
      { pubkey: userWalletKey, isSigner: false, isWritable: false },
      { pubkey: userInfoKey, isSigner: false, isWritable: false },
      { pubkey: lpAssetPoolKey, isSigner: false, isWritable: true },
      { pubkey: stakeTableKey, isSigner: false, isWritable: true },
      { pubkey: floatingLpSplKey, isSigner: false, isWritable: true },
      { pubkey: base_pda, isSigner: false, isWritable: false },
    ].concat(secondStakeKeys).concat(firstStakeKeys);

    const buffer = new ArrayBuffer(8);
    AccountParser.setBigUint64(buffer, 0, amount);
    const payload = Array.from(new Uint8Array(buffer));

    const data = [CMD_LP_UNSTAKE_SECOND].concat(payload);

    return new TransactionInstruction({
      programId: this.addresses.getProgramKey(),
      keys: keys,
      data: Buffer.from(data),
    });
  }

  async buildLpUnstakeIx(
    lpMintStr: string,
    targetSwap: number,
    amount: number,
    stakeKeys: AccountMeta[],
  ): Promise<TransactionInstruction> {
    const [base_pda,] = await this.addresses.getBasePda();
    const poolSummariesKey = await this.addresses.getPoolSummariesKey();
    const lpAssetPoolSplKey = await this.addresses.getAssetPoolSplKey(base_pda, lpMintStr);

    const keys = [
      {pubkey: poolSummariesKey,          isSigner: false,        isWritable: false},
      {pubkey: lpAssetPoolSplKey,         isSigner: false,        isWritable: true},
      {pubkey: base_pda,                  isSigner: false,        isWritable: false},
    ].concat(stakeKeys);

    const buffer = new ArrayBuffer(8);
    AccountParser.setBigUint64(buffer, 0, amount);
    const payload = Array.from(new Uint8Array(buffer));

    const data = [CMD_LP_UNSTAKE].concat(payload).concat([targetSwap]).concat(this.mintKeyStrToPoolIdArray(lpMintStr));

    return new TransactionInstruction({
      programId: this.addresses.getProgramKey(),
      keys: keys,
      data: Buffer.from(data),
    });
  }


  // simplified interface for marginLpCreate and marginLpRedeem
  async simpleLpCreate(
    walletAccount: Keypair,
    lpTokenId: TokenID,
    leftAmount: number,
    rightAmount: number,
    minLpAmount: number,
  ): Promise<Transaction> {
    const lr = LP_TO_LR[lpTokenId];
    invariant(lr);
    const [leftId, rightId] = lr;
    const lpMint = MINTS[lpTokenId];
    const leftMint = MINTS[leftId];
    const rightMint = MINTS[rightId];

    const tx = await this.marginLpCreate(
      walletAccount, 
      leftMint.toString(),
      leftAmount,
      rightMint.toString(),
      rightAmount,
      lpMint.toString(),
      minLpAmount,
      this.addresses.getLpTargetSwap(lpTokenId),
      await this.addresses.getLpDepositKeys(lpTokenId),
      await this.addresses.getLpStakeKeys(lpTokenId),
    );
    return tx;
  }

  async lpStake2nd(
    lpTokenId: TokenID,
  ) {
    const lpMint = MINTS[lpTokenId];
    const floatingLpSplKey = await this.addresses.getFloatingLpTokenAccount(lpTokenId);
    const stakeTableKey = await this.addresses.getAssetPoolStakeTableKey(lpMint.toString());

    const ix = await this.buildLpStake2ndStepIx(
      lpMint.toString(),
      stakeTableKey,
      floatingLpSplKey,
      await this.addresses.getLpFirstStakeKeys(lpTokenId),
      await this.addresses.getLpSecondStakeKeys(lpTokenId)
    );
    const tx = new Transaction().add(ix);
    return tx;
  }

  async lpUnstake2nd(
    unstakeIdentity: PublicKey,
    walletKey: PublicKey,
    lpTokenId: TokenID,
    lpAmount: number,
  ) {
    const lpMint = MINTS[lpTokenId];
    const stakeTableKey = await this.addresses.getAssetPoolStakeTableKey(lpMint.toString());
    const floatingLpSplKey = await this.addresses.getFloatingLpTokenAccount(lpTokenId);

    const ix = await this.buildLpUnstake2ndStepIx(
      unstakeIdentity,
      walletKey,
      lpMint.toString(),
      stakeTableKey,
      floatingLpSplKey,
      await this.addresses.getLpFirstStakeKeys(lpTokenId),
      await this.addresses.getLpSecondStakeKeys(lpTokenId),
      lpAmount,
    );
    const tx = new Transaction().add(ix);
    return tx;
  }

  async simpleLpRedeem(
    walletKey: PublicKey,
    lpTokenId: TokenID,
    minLeftAmount: number,
    minRightAmount: number,
    lpAmount: number,
    isSigned: boolean,
  ): Promise<Transaction> {
    const lr = LP_TO_LR[lpTokenId];
    invariant(lr);
    const [leftId, rightId] = lr;
    const lpMint = MINTS[lpTokenId];
    const leftMint = MINTS[leftId];
    const rightMint = MINTS[rightId];
    const tx = await this.marginLpRedeem(
      walletKey, 
      leftMint.toString(),
      minLeftAmount,
      rightMint.toString(),
      minRightAmount,
      lpMint.toString(),
      lpAmount,
      this.addresses.getLpTargetSwap(lpTokenId),
      await this.addresses.getLpWithdrawKeys(lpTokenId),
      await this.addresses.getLpStakeKeys(lpTokenId),
      isSigned,
    );
    return tx;
  }
}