import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import invariant from "tiny-invariant";
import { Addresses } from "../addresses";
import { AppConfig, TokenID } from "../types";
import { AccountParser } from "./AccountParser";
import { TransactionBuilder } from "./TransactionBuilder";
import { PUBLIC_CONFIG } from "../constants"

export class ActionWrapper {
  addresses: Addresses;
  builder: TransactionBuilder;
  config: AppConfig;
  constructor(
    public connection: Connection,
    config: AppConfig | undefined = undefined,
  ) {
    this.config = config || PUBLIC_CONFIG;
    this.addresses = new Addresses(this.config);
    this.builder = new TransactionBuilder(this.addresses);
  }

  async getParsedAssetPool(mint: PublicKey) {
    const [base_pda, _] = await this.addresses.getBasePda();
    const poolAccountKey = await this.addresses.getAssetPoolKey(base_pda, mint.toString()); 
    const response = await this.connection.getAccountInfo(poolAccountKey, 'confirmed');
    if(response === null) {
      return null;
    }
    const data = new Uint8Array(response.data);
    return AccountParser.parseAssetPool(data);
  }

  async getParsedAssetPrice(mint: PublicKey) {
    const [price_pda, _] = await this.addresses.getPricePda();
    const assetPriceKey = await this.addresses.getAssetPriceKey(price_pda, mint.toString()); 
    const response = await this.connection.getAccountInfo(assetPriceKey, 'confirmed');
    if(response === null){
      return null;
    }
    return AccountParser.parseAssetPrice(new Uint8Array(response.data));
  }

  async getParsedUserInfo(wallet_key: PublicKey) {
    const userInfoKey = await this.addresses.getUserInfoKey(wallet_key); 
    const response = await this.connection.getAccountInfo(userInfoKey, 'confirmed');
    if(response === null){
      return null;
    }
    return AccountParser.parseUserInfo(new Uint8Array(response.data));
  }


  // administrative methods:
  async getParsedUserPagesStats() {
    const statsAccountKey = await this.addresses.getUserPagesStatsKey(); 
    const response = await this.connection.getAccountInfo(statsAccountKey, 'confirmed');
    if(response === null){
      return null;
    }
    return AccountParser.parseUserPagesStats(new Uint8Array(response.data));
  }

  async getParsedUsersPage(page_id: number) {
    const [base_pda, _] = await this.addresses.getBasePda();
    const usersPageKey = await this.addresses.getUsersPageKey(base_pda, page_id);
    const response = await this.connection.getAccountInfo(usersPageKey, 'confirmed');
    if(response === null){
      return null;
    }
    return AccountParser.parseUsersPage(new Uint8Array(response.data));
  }

  // transaction sending

  async addUserAndDeposit(
    walletAccount: Keypair,
    userSplKey: PublicKey,
    mintKeyStr: string,
    amount: number,
  ) {
    const freeSlots = await this.getParsedUserPagesStats()!;
    invariant(freeSlots);
    let maxNumFree = 0;
    let pageId = -1;
    freeSlots?.map((value, idx) => {
      if (value > maxNumFree) {
        pageId = idx;
        maxNumFree = value;
      }
    });
    invariant(pageId >= 0, `No more free user slots available.`)
    const tx = await this.builder.addUserAndDeposit(pageId, walletAccount, userSplKey, mintKeyStr, amount);
    return this.connection.sendTransaction(tx, [walletAccount]);
  }

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

    const tx = await this.builder.simpleLpCreate(
      walletAccount, 
      lpTokenId,
      leftAmount,
      rightAmount,
      minLpAmount,
    );
    return this.connection.sendTransaction(tx, [walletAccount]);
  }

  async lpStake2ndStep(
    adminAccount: Keypair,
    lpTokenId: TokenID,
  ) {
    const tx = await this.builder.lpStake2nd(
      lpTokenId,
    );
    return this.connection.sendTransaction(tx, [adminAccount], {
      skipPreflight: false,
    });
  }

  async lpUnstake2ndStep(
    walletAccount: Keypair,
    lpTokenId: TokenID,
    lpAmount: number,
  ) {
    const tx = await this.builder.lpUnstake2nd(
      walletAccount.publicKey,
      walletAccount.publicKey,
      lpTokenId,
      lpAmount,
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
    const tx = await this.builder.simpleLpRedeem(
      walletAccount.publicKey, 
      lpTokenId,
      minLeftAmount,
      minRightAmount,
      lpAmount,
      true,
    );
    return this.connection.sendTransaction(tx, [walletAccount]);
  }

}
