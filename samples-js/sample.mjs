import {mints, ConnWrapper} from "@apricot-lend/apricot"
import {Connection, PublicKey, Account} from "@solana/web3.js"
import {Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID} from '@solana/spl-token';
import bigInt from "big-integer";


/*
 * When testing, try replacing privateKey with your own test private key. You can import the private key to sollet, then
 * use https://test.apricot.one to obtain test tokens (by clicking on faucet button)
 */

const privateKey = [178, 232, 8, 19, 213, 26, 154, 245, 28, 57, 87, 115, 253, 90, 86, 29, 243, 91, 130, 188, 231, 169, 0, 7, 11, 230, 207, 74, 53, 9, 27, 201, 9, 151, 130, 190, 114, 135, 185, 118, 42, 198, 186, 198, 73, 49, 43, 211, 196, 237, 59, 120, 150, 127, 22, 180, 13, 231, 43, 156, 252, 92, 148, 84];
const testAccount = new Account(privateKey);
const conn = new Connection("https://api.devnet.solana.com");

// fake btc mint (on devnet only)
const fakeBtcMint = new PublicKey(mints.fake_btc);
const fakeEthMint = new PublicKey(mints.fake_eth);

// get our associated token account for fakeBtcMint
const testBtcSpl = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    fakeBtcMint,
    testAccount.publicKey
);

const testEthSpl = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    fakeEthMint,
    testAccount.publicKey
);

// use wrapper to send transactions. Alternative us to use TxMaker, which builds transactions without sending them
const wrapper = new ConnWrapper(conn);

if(await wrapper.isUserActive(testAccount.publicKey)) {
    // if user already exists, make a direct deposit
    await wrapper.deposit(testAccount, testBtcSpl, mints.fake_btc, 1000000000);
}
else {
    // if user does not exist yet, initialize user info first, then deposit
    await wrapper.add_user_and_deposit(testAccount, testBtcSpl, mints.fake_btc, 1000000000);

    // sleeping 20 seconds for account creation
    await new Promise(r => setTimeout(r, 20000));
}

// withdraw 1000000 (0.001) fake BTC
await wrapper.withdraw(testAccount, testBtcSpl, mints.fake_btc, false, 1000000);

// borrow 1000000 (0.001) fake ETH
await wrapper.borrow(testAccount, testEthSpl, mints.fake_eth, 1000000);

console.log(await wrapper.getParsedUserInfo(testAccount.publicKey));
