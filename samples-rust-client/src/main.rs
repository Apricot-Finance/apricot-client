use apricot_client::config;
use apricot_client::consts;
use apricot_client::instructions;
use apricot_client::state;
use apricot_client::utils;
use solana_client::rpc_client::RpcClient;
use solana_sdk::account::ReadableAccount;
use solana_sdk::transaction::Transaction;
use solana_sdk::{
    commitment_config::CommitmentConfig, pubkey::Pubkey, signature::Keypair, signature::Signer,
};
use spl_associated_token_account;
use std::io::Read;
use std::{env, fs::File, str::FromStr, time::Duration};

fn main() {
    println!("Arguments:");
    for arg in env::args() {
        println!("- {}", arg);
    }
    let mut args = std::env::args();
    assert!(args.len() > 1, "Not enough args!");

    let conn = RpcClient::new_with_timeout_and_commitment(
        "https://solana-api.projectserum.com".to_string(),
        Duration::from_secs(30),
        CommitmentConfig::confirmed(),
    );
    println!("Connected to mainnet, slot={}", conn.get_slot().unwrap());

    let command = args.nth(1).unwrap();
    println!("Running command: {}", command);
    match command.as_str() {
        "user" => {
            assert_eq!(1, args.len(), "Missing user wallet.");
            let user_wallet_key_str = args.nth(0).unwrap();
            let user_wallet_key = &Pubkey::from_str(user_wallet_key_str.as_str()).unwrap();
            println!("user wallet: {}", user_wallet_key_str);
            get_user_info(&conn, user_wallet_key);
        }
        "pool" => {
            assert_eq!(1, args.len(), "Missing pool token symbol.");
            let token_name = args.nth(0).unwrap();
            let pool_id = config::get_pool_id_by_name(token_name.as_str());
            get_pool(&conn, pool_id)
        }
        "deposit" => {
            assert_eq!(
                3,
                args.len(),
                "Invalid args. Expect: key_path, token_name, deposit_amt"
            );
            let user_wallet_keypair_str = args.nth(0).unwrap();
            let user_keypair = read_key_from_file(user_wallet_keypair_str.as_str());
            let token_name = args.nth(0).unwrap();
            let amount = args.nth(0).unwrap().parse::<u64>().unwrap();

            println!(
                "User pubkey: {}, token: {}, amount: {}",
                user_keypair.pubkey(),
                token_name,
                amount
            );
            let pool_id = config::get_pool_id_by_name(token_name.as_str());
            deposit(&conn, &user_keypair, pool_id, amount);
        }
        "withdraw-half" => {
            assert_eq!(2, args.len(), "Invalid args. Expect: key_path, token_name");
            let user_wallet_keypair_str = args.nth(0).unwrap();
            let user_keypair = read_key_from_file(user_wallet_keypair_str.as_str());
            let token_name = args.nth(0).unwrap();
            let pool_id = config::get_pool_id_by_name(token_name.as_str());

            let balance = get_user_deposit_amount(&conn, &user_keypair.pubkey(), pool_id);
            let amount = (balance as f64 * 0.5) as u64;
            println!(
                "User pubkey: {}, token: {}, amount: {}",
                user_keypair.pubkey(),
                token_name,
                amount
            );

            withdraw(&conn, &user_keypair, pool_id, amount, false);
        }
        "withdraw-all" => {
            assert_eq!(2, args.len(), "Invalid args. Expect: key_path, token_name");
            let user_wallet_keypair_str = args.nth(0).unwrap();
            let user_keypair = read_key_from_file(user_wallet_keypair_str.as_str());
            let token_name = args.nth(0).unwrap();
            let pool_id = config::get_pool_id_by_name(token_name.as_str());

            println!(
                "User pubkey: {}, token: {}",
                user_keypair.pubkey(),
                token_name
            );

            withdraw(&conn, &user_keypair, pool_id, 0, true);
        }
        "refresh-user" => {
            assert_eq!(1, args.len(), "Invalid args. Expect: key_path");
            let user_wallet_keypair_str = args.nth(0).unwrap();
            let user_keypair = read_key_from_file(user_wallet_keypair_str.as_str());
            println!("User pubkey: {}", user_keypair.pubkey());
            refresh_user(&conn, &user_keypair)
        }
        "make-lm-available" => {
            assert_eq!(1, args.len(), "Invalid args. Expect: key_path");
            let user_wallet_keypair_str = args.nth(0).unwrap();
            let user_keypair = read_key_from_file(user_wallet_keypair_str.as_str());
            println!("User pubkey: {}", user_keypair.pubkey());
            make_lm_reward_claimable(&conn, &user_keypair);
        }
        "claim-lm" => {
            assert_eq!(1, args.len(), "Invalid args. Expect: key_path");
            let user_wallet_keypair_str = args.nth(0).unwrap();
            let user_keypair = read_key_from_file(user_wallet_keypair_str.as_str());
            println!("User pubkey: {}", user_keypair.pubkey());
            claim_lm_apt_reward(&conn, &user_keypair);
        }
        _ => println!("Invalid command: {}", command),
    }

    fn read_key_from_file(key_path: &str) -> Keypair {
        let mut file = File::open(key_path).unwrap();
        let mut key_str = String::from("");
        file.read_to_string(&mut key_str).unwrap();
        let key_string = key_str.replace("[", "").replace("]", "").replace(",", " ");
        let nums_splits: Vec<&str> = key_string.split_whitespace().collect();
        let num_vec: Vec<u8> = nums_splits
            .iter()
            .map(|x| x.parse::<u8>().unwrap())
            .collect();
        Keypair::from_bytes(num_vec.as_slice()).unwrap()
    }

    /** When making a deposit, there are two cases:
     * - new user: use add_user_and_deposit()
     * - existing user: use deposit()
     */
    fn deposit(conn: &RpcClient, user_keypair: &Keypair, pool_id: u8, amount: u64) {
        let user_wallet = &user_keypair.pubkey();
        let mint = config::get_mint_by_pool_id(pool_id);
        let user_token_account =
            spl_associated_token_account::get_associated_token_address(user_wallet, &mint);
        let ix = if is_user_active(&conn, &user_keypair.pubkey()) {
            println!("Existing user, making deposit directly");
            instructions::deposit(&user_keypair.pubkey(), &user_token_account, amount, pool_id)
        } else {
            let page_id = get_best_page_id(&conn);
            println!("New user, creating user info and making deposit");
            instructions::add_user_and_deposit(
                user_wallet,
                &user_token_account,
                amount,
                pool_id,
                page_id,
            )
        };

        let blockhash = conn.get_recent_blockhash().unwrap();
        let tx = Transaction::new_signed_with_payer(
            &[ix],
            Some(user_wallet),
            &[user_keypair],
            blockhash.0,
        );

        let signature = conn.send_and_confirm_transaction_with_spinner(&tx).unwrap();
        println!("Deposit done. Signature: {}", signature);
    }

    // withdraw all or part of the balance
    fn withdraw(
        conn: &RpcClient,
        user_keypair: &Keypair,
        pool_id: u8,
        amount: u64,
        withdraw_all: bool,
    ) {
        let user_info_key = consts::get_user_info_k(&user_keypair.pubkey());
        let data = conn.get_account_data(&user_info_key).unwrap();
        let user_info = state::UserInfo::from_bytes(&data[..]);
        let withdraw_amount = if withdraw_all { 0 } else { amount };
        let user_wallet = &user_keypair.pubkey();
        let mint = config::get_mint_by_pool_id(pool_id);
        let user_token_account =
            spl_associated_token_account::get_associated_token_address(user_wallet, &mint);
        let withdraw_ix = instructions::withdraw(
            &user_keypair.pubkey(),
            &user_token_account,
            withdraw_all,
            withdraw_amount,
            pool_id,
            user_info.page_id,
        );

        let blockhash = conn.get_recent_blockhash().unwrap();
        let withdraw_tx = Transaction::new_signed_with_payer(
            &[withdraw_ix],
            Some(user_wallet),
            &[user_keypair],
            blockhash.0,
        );
        let result = conn
            .send_and_confirm_transaction_with_spinner(&withdraw_tx)
            .unwrap();
        println!("Withdraw done. Signature: {}", result);
    }

    // refresh user to accure the interest to the latest
    fn refresh_user(conn: &RpcClient, user_keypair: &Keypair) {
        let refresh_ix = instructions::refresh_user(&user_keypair.pubkey());

        let blockhash = conn.get_recent_blockhash().unwrap();
        let refresh_tx = Transaction::new_signed_with_payer(
            &[refresh_ix],
            Some(&user_keypair.pubkey()),
            &[user_keypair],
            blockhash.0,
        );
        let signature = conn
            .send_and_confirm_transaction_with_spinner(&refresh_tx)
            .unwrap();
        println!("Refresh done. Signature: {}", signature);
    }

    // make liquidity mining reward available after vesting
    fn make_lm_reward_claimable(conn: &RpcClient, user_keypair: &Keypair) {
        let make_available_ix = instructions::make_lm_reward_claimable(&user_keypair.pubkey());
        let blockhash = conn.get_recent_blockhash().unwrap();
        let make_available_tx = Transaction::new_signed_with_payer(
            &[make_available_ix],
            Some(&user_keypair.pubkey()),
            &[user_keypair],
            blockhash.0,
        );
        let signature = conn
            .send_and_confirm_transaction_with_spinner(&make_available_tx)
            .unwrap();
        println!("Make lm reward available done. Signature: {}", signature);
    }

    // claim APT liquidity mining reward
    fn claim_lm_apt_reward(conn: &RpcClient, user_keypair: &Keypair) {
        let user_apt_spl = spl_associated_token_account::get_associated_token_address(
            &user_keypair.pubkey(),
            &config::apt::ID);
        let claim_ix = instructions::claim_apt_lm_reward(&user_keypair.pubkey(), &user_apt_spl);
        let blockhash = conn.get_recent_blockhash().unwrap();
        let claim_tx = Transaction::new_signed_with_payer(
            &[claim_ix],
            Some(&user_keypair.pubkey()),
            &[user_keypair],
            blockhash.0,
        );
        let signature = conn
            .send_and_confirm_transaction_with_spinner(&claim_tx)
            .unwrap();
        println!("claim lm apt reward done. Signature: {}", signature);
    }

}

#[allow(unaligned_references)]
fn get_user_info(conn: &RpcClient, user_wallet_key: &Pubkey) {
    let user_info_key = consts::get_user_info_k(user_wallet_key);
    println!("UserInfo Key: {}", user_info_key);
    let data = conn.get_account_data(&user_info_key).unwrap();
    let user_info = state::UserInfo::from_bytes(&data[..]);
    println!("UserInfo:\n");
    println!("{}", user_info);
}

fn get_pool(conn: &RpcClient, pool_id: u8) {
    let pool_key = consts::get_asset_pool_k(pool_id);
    println!("AssetPool Key: {}", pool_key);
    let data = conn.get_account_data(&pool_key).unwrap();
    let asset_pool = state::AssetPool::from_bytes(&data[..]);
    println!("AssetPool:\n");
    println!("{}", asset_pool);

    let deposit_amt = 10_000_000_000;
    let borrow_amt = 100_000_000;
    let (deposit_rate, borrow_rate) = asset_pool.calculate_new_interest_rate(deposit_amt, borrow_amt);
    println!("New deposit rate: {}, borrow rate: {}", deposit_rate, borrow_rate);
}

fn get_user_deposit_amount(conn: &RpcClient, user_wallet_key: &Pubkey, pool_id: u8) -> u64 {
    let user_info_key = consts::get_user_info_k(user_wallet_key);
    println!("UserInfo Key: {}", user_info_key);
    let data = conn.get_account_data(&user_info_key).unwrap();
    let user_info = state::UserInfo::from_bytes(&data[..]);
    for uai in user_info.user_asset_info {
        if uai.pool_id == pool_id {
            return uai.deposit_amount.to_native_amount();
        }
    }

    0u64
}

fn is_user_active(conn: &RpcClient, user_wallet_key: &Pubkey) -> bool {
    let user_info = consts::get_user_info_k(user_wallet_key);
    let user_info_acc = conn.get_account(&user_info);
    if user_info_acc.is_err() {
        false
    } else {
        utils::is_user_active(user_info_acc.unwrap().data())
    }
}

fn get_best_page_id(conn: &RpcClient) -> u16 {
    let user_stats_key = consts::get_user_pages_stats_k();
    println!("user pages stats: {}", user_stats_key);
    let user_stats_data = conn.get_account_data(&user_stats_key).unwrap();
    utils::get_best_page_id(user_stats_data.as_slice())
}
