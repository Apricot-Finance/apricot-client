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
use apricot_client::state;
use solana_sdk::account::ReadableAccount;
use spl_associated_token_account;
use solana_sdk::transaction::Transaction;

fn main() {

    println!("{}", std::env::args().nth(0).unwrap());
    let args = std::env::args();
    let only_print = args.len() > 1;

    let conn = RpcClient::new_with_commitment(
        "https://api.devnet.solana.com".to_string(), CommitmentConfig::confirmed());

    println!("Connected to devnet, slot={}", conn.get_slot().unwrap());

    let user_private_key:[u8;64] = [178, 232, 8, 19, 213, 26, 154, 245, 28, 57, 87, 115, 253, 90, 86, 29, 243, 91, 130, 188, 231, 169, 0, 7, 11, 230, 207, 74, 53, 9, 27, 201, 9, 151, 130, 190, 114, 135, 185, 118, 42, 198, 186, 198, 73, 49, 43, 211, 196, 237, 59, 120, 150, 127, 22, 180, 13, 231, 43, 156, 252, 92, 148, 84];
    let user_wallet_keypair = Keypair::from_bytes(&user_private_key).unwrap();
    let user_wallet = &user_wallet_keypair.pubkey();
    let btc_mint = &consts::btc::ID;
    let user_spl_btc = spl_associated_token_account::get_associated_token_address(user_wallet, btc_mint);
    let deposit_amount = 1000000;
    let withdraw_amount = 100000;
    let btc_pool_id = consts::btc::POOL_ID;
    println!("Test wallet key: {}", user_wallet);
    println!("Test wallet btc token account: {}", user_spl_btc);


    /*
    When making a deposit, there are two cases:
    - new user: use add_user_and_deposit()
    - existing user: use deposit()
     */

    if !only_print
    {
        let ix;
        if is_user_active(&conn, user_wallet) {
            ix = instructions::deposit(user_wallet, &user_spl_btc, deposit_amount, btc_pool_id);
            println!("Making deposit");
        }
        else {
            let page_id = get_best_page_id(&conn);
            ix = instructions::add_user_and_deposit( user_wallet, &user_spl_btc, deposit_amount, btc_pool_id, page_id);
            println!("Creating new user and making deposit");
        }

        let blockhash = conn.get_recent_blockhash().unwrap();
        let tx = Transaction::new_signed_with_payer(
            &[ix], Some(user_wallet), &[&user_wallet_keypair], blockhash.0);

        let result = conn.send_and_confirm_transaction_with_spinner(&tx).unwrap();
        println!("Deposit done: {}", result);
    }

    // withdraw is straightforward
    if !only_print
    {
        let withdraw_ix = instructions::withdraw(
            user_wallet, &user_spl_btc, false, withdraw_amount, btc_pool_id);

        let blockhash = conn.get_recent_blockhash().unwrap();
        let withdraw_tx = Transaction::new_signed_with_payer(
            &[withdraw_ix], Some(user_wallet), &[&user_wallet_keypair], blockhash.0);
        let result = conn.send_and_confirm_transaction_with_spinner(&withdraw_tx).unwrap();
        println!("Withdraw done: {}", result);
    }

    // refresh user (well totally unnecessary at this point since we just finished a withdrawal,
    // which already updated user's interests etc across all assets
    // putting it here just for demo
    {
        let refresh_ix = instructions::refresh_user(user_wallet);

        let blockhash = conn.get_recent_blockhash().unwrap();
        let refresh_tx = Transaction::new_signed_with_payer(
            &[refresh_ix], Some(user_wallet), &[&user_wallet_keypair], blockhash.0);
        let result = conn.send_and_confirm_transaction_with_spinner(&refresh_tx).unwrap();
        println!("Refresh done: {}", result);
    }

    // print what's in user's apricot account
    #[allow(unaligned_references)]
    {
        let user_info_key = consts::get_user_info_k(user_wallet);
        let data = conn.get_account_data(&user_info_key).unwrap();
        let user_info = utils::cast::<state::UserInfo>(&data[..]);
        println!("Showing user with {} assets:", user_info.num_assets);
        for i in 0 .. user_info.num_assets as usize  {
            println!("=============================");
            println!("Asset PoolID: {}", user_info.user_asset_info[i].pool_id);
            println!("Asset borrow amount: {}", user_info.user_asset_info[i].borrow_amount.to_native_amount());
            println!("Asset deposit amount: {}", user_info.user_asset_info[i].deposit_amount.to_native_amount());
            println!("Asset borrow interests: {}", user_info.user_asset_info[i].borrow_interests);
            println!("Asset deposit interests: {}", user_info.user_asset_info[i].deposit_interests);
        }
    }

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
