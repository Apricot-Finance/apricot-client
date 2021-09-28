import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Addresses } from "../addresses";
import { LP_TO_LR, MINTS } from "../constants/configs";
import { AppConfig, TokenID } from "../types";
import { AccountParser } from "./AccountParser";
import { TransactionBuilder } from "./TransactionBuilder";

export class ActionWrapper {
  addresses: Addresses;
  builder: TransactionBuilder;
  constructor(
    public connection: Connection,
    public config: AppConfig,
  ) {
    this.addresses = new Addresses(config);
    this.builder = new TransactionBuilder(this.addresses);
  }

  async getParsedAssetPool(mint: PublicKey) {
    const [base_pda, _] = await this.addresses.getBasePda();
    const poolAccountKey = await this.addresses.getAssetPoolKey(base_pda, mint.toString()); 
    const response = await this.connection.getAccountInfo(poolAccountKey);
    if(response === null) {
      return null;
    }
    const data = new Uint8Array(response.data);
    return AccountParser.parseAssetPool(data);
  }

  async getParsedAssetPrice(mint: PublicKey) {
    const [price_pda, _] = await this.addresses.getPricePda();
    const assetPriceKey = await this.addresses.getAssetPriceKey(price_pda, mint.toString()); 
    const response = await this.connection.getAccountInfo(assetPriceKey);
    if(response === null){
      return null;
    }
    return AccountParser.parseAssetPrice(new Uint8Array(response.data));
  }

  async getParsedUserInfo(wallet_key: PublicKey) {
    const userInfoKey = await this.addresses.getUserInfoKey(wallet_key); 
    const response = await this.connection.getAccountInfo(userInfoKey);
    if(response === null){
      return null;
    }
    return AccountParser.parseUserInfo(new Uint8Array(response.data));
  }


  // administrative methods:
  async getParsedUserPagesStats() {
    const [base_pda, _] = await this.addresses.getBasePda();
    const statsAccountKey = await this.addresses.getUserPagesStatsKey(); 
    const response = await this.connection.getAccountInfo(statsAccountKey);
    if(response === null){
      return null;
    }
    return AccountParser.parseUserPagesStats(new Uint8Array(response.data));
  }

  async getParsedUsersPage(page_id: number) {
    const [base_pda, _] = await this.addresses.getBasePda();
    const usersPageKey = await this.addresses.getUsersPageKey(base_pda, page_id);
    const response = await this.connection.getAccountInfo(usersPageKey);
    if(response === null){
      return null;
    }
    return AccountParser.parseUsersPage(new Uint8Array(response.data));
  }

  // transaction sending

  async deposit(
    walletAccount: Keypair,
    userSplKey: PublicKey,
    mintKeyStr: string,
    amount: number,
  ) {
    const tx = await this.builder.deposit(walletAccount, userSplKey, mintKeyStr, amount);
    return this.connection.sendTransaction(tx, [walletAccount]);
  }

  async withdraw(
    walletAccount: Keypair,
    userSplKey: PublicKey,
    mintKeyStr: string,
    withdrawAll: boolean,
    amount: number,
  ) {
    const tx = await this.builder.withdraw(walletAccount, userSplKey, mintKeyStr, withdrawAll, amount);
    return this.connection.sendTransaction(tx, [walletAccount]);
  }

  async borrow(
    walletAccount: Keypair,
    userSplKey: PublicKey,
    mintKeyStr: string,
    amount: number,
  ) {
    const tx = await this.builder.borrow(walletAccount, userSplKey, mintKeyStr, amount);
    return this.connection.sendTransaction(tx, [walletAccount]);
  }

  async repay(
    walletAccount: Keypair,
    userSplKey: PublicKey,
    mintKeyStr: string,
    repayAll: boolean,
    amount: number,
  ) {
    const tx = await this.builder.repay(walletAccount, userSplKey, mintKeyStr, repayAll, amount);
    return this.connection.sendTransaction(tx, [walletAccount]);
  }

  async lpCreate(
    walletAccount: Keypair,
    lpTokenId: TokenID,
    leftAmount: number,
    rightAmount: number,
    minLpAmount: number,
  ) {
    const [leftId, rightId] = LP_TO_LR[lpTokenId]!;
    const lpMint = MINTS[lpTokenId];
    const leftMint = MINTS[leftId];
    const rightMint = MINTS[rightId];

    const tx = await this.builder.marginLpCreate(
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
    return this.connection.sendTransaction(tx, [walletAccount]);
  }

  async lpRedeem(
    walletAccount: Keypair,
    lpTokenId: TokenID,
    minLeftAmount: number,
    minRightAmount: number,
    lpAmount: number,
  ) {
    const [leftId, rightId] = LP_TO_LR[lpTokenId]!;
    const lpMint = MINTS[lpTokenId];
    const leftMint = MINTS[leftId];
    const rightMint = MINTS[rightId];
    const tx = await this.builder.marginLpRedeem(
      walletAccount.publicKey, 
      leftMint.toString(),
      minLeftAmount,
      rightMint.toString(),
      minRightAmount,
      lpMint.toString(),
      lpAmount,
      this.addresses.getLpTargetSwap(lpTokenId),
      await this.addresses.getLpWithdrawKeys(lpTokenId),
      await this.addresses.getLpStakeKeys(lpTokenId),
      true,
    );
    return this.connection.sendTransaction(tx, [walletAccount]);
  }

}