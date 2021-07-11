# apricot-client
Integrating with Apricot on Solana is super easy! We have specifically designed our interface to be as easy-to-use as
possible.

Consider these snippets for integrating with Apricot at client-side:


Javascript:

```javascript
await wrapper.deposit(user_account, user_spl, mints.fake_btc, deposit_amount);
```


Rust:

```rust
let ix = instructions::deposit(user_wallet, &user_spl, deposit_amount, btc_pool_id);
let blockhash = conn.get_recent_blockhash().unwrap();
let tx = Transaction::new_signed_with_payer(&[ix], Some(user_wallet), &[&user_wallet_keypair], blockhash.0);
let result = conn.send_and_confirm_transaction_with_spinner(&tx).unwrap();
```

For more details and examples of usage, check out our crate/package and samples! Or feel free to come to the #developer
channel on [our discord](https://discord.gg/C6JrtqZF5U)!


# Directories:
- rust: `apricot-client` rust crate
- js: `@apricot-lend/apricot` npm package
- samples-rust-client: a rust client that demonstrates deposit/withdraw
- samples-rust-contract: a single solana contract that uses the `apricot-client` rust crate to invoke Apricot
- samples-js: a JS sample that uses the `@apricot-lend/apricot` package to deposit/borrow on Apricot
