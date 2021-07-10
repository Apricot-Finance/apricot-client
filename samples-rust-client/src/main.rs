use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    commitment_config::CommitmentConfig,
    pubkey::Pubkey,
    signature::Keypair,
    signature::Signer,
};
use apricot_client::consts;
use apricot_client::instructions;
use apricot_client::utils;
use solana_sdk::account::ReadableAccount;
use spl_associated_token_account;
use solana_sdk::transaction::Transaction;

fn main() {
    let conn = RpcClient::new_with_commitment(
        "https://api.devnet.solana.com".to_string(), CommitmentConfig::confirmed());

    println!("Connected to devnet, slot={}", conn.get_slot().unwrap());

    let user_private_key:[u8;64] = [178, 232, 8, 19, 213, 26, 154, 245, 28, 57, 87, 115, 253, 90, 86, 29, 243, 91, 130, 188, 231, 169, 0, 7, 11, 230, 207, 74, 53, 9, 27, 201, 9, 151, 130, 190, 114, 135, 185, 118, 42, 198, 186, 198, 73, 49, 43, 211, 196, 237, 59, 120, 150, 127, 22, 180, 13, 231, 43, 156, 252, 92, 148, 84];
    let user_wallet_keypair = Keypair::from_bytes(&user_private_key).unwrap();
    let user_wallet = &user_wallet_keypair.pubkey();
    let btc_mint = &consts::btc::ID;
    let user_spl = spl_associated_token_account::get_associated_token_address(user_wallet, btc_mint);
    let deposit_amount = 1000000000;
    let withdraw_amount = 100000000;
    let btc_pool_id = consts::btc::POOL_ID;

    let ix;

    /*
    When making a deposit, there are two cases:
    - new user: use add_user_and_deposit()
    - existing user: use deposit()
     */

    if is_user_active(&conn, user_wallet) {
        ix = instructions::deposit(user_wallet, &user_spl, deposit_amount, btc_pool_id);
        println!("Making deposit");
    }
    else {
        let page_id = get_best_page_id(&conn);
        ix = instructions::add_user_and_deposit( user_wallet, &user_spl, deposit_amount, btc_pool_id, page_id);
        println!("Creating new user and making deposit");
    }

    let blockhash = conn.get_recent_blockhash().unwrap();
    let tx = Transaction::new_signed_with_payer(
        &[ix], Some(user_wallet), &[&user_wallet_keypair], blockhash.0);

    let result = conn.send_and_confirm_transaction_with_spinner(&tx).unwrap();
    println!("Deposit done: {}", result);

    // withdraw is straightforward
    let withdraw_ix = instructions::withdraw(
        user_wallet, &user_spl, false, withdraw_amount, btc_pool_id);

    let blockhash = conn.get_recent_blockhash().unwrap();
    let withdraw_tx = Transaction::new_signed_with_payer(
        &[withdraw_ix], Some(user_wallet), &[&user_wallet_keypair], blockhash.0);
    let result = conn.send_and_confirm_transaction_with_spinner(&withdraw_tx).unwrap();
    println!("Withdraw done: {}", result);

}

fn is_user_active(conn: &RpcClient, user_wallet_key: &Pubkey) -> bool {
    let user_info = consts::get_user_info_k(user_wallet_key);
    let user_info_acc = conn.get_account(&user_info);
    if user_info_acc.is_err() {
        false
    }
    else {
        utils::is_user_active(user_info_acc.unwrap().data())
    }
}

fn get_best_page_id(conn: &RpcClient) -> u16 {
    let user_stats_key = consts::get_user_pages_stats_k();
    let user_stats_data = conn.get_account_data(&user_stats_key).unwrap();
    utils::get_best_page_id(user_stats_data.as_slice())
}