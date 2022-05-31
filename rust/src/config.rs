use solana_program::pubkey::Pubkey;

pub mod apt {
    use solana_program::declare_id;
    declare_id!("APTtJyaRX5yGTsJU522N4VYWg3vCvSb65eam5GrPT5Rt");
    pub const POOL_ID: u8 = 27;
    pub const NAME: &str = "APT";
}

pub mod btc {
    use solana_program::declare_id;
    declare_id!("9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E");
    pub const POOL_ID: u8 = 0;
    pub const NAME: &str = "BTC";
}
pub mod eth {
    use solana_program::declare_id;
    declare_id!("2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk");
    pub const POOL_ID: u8 = 1;
    pub const NAME: &str = "ETH";
}
pub mod wheth {
    use solana_program::declare_id;
    declare_id!("7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs");
    pub const POOL_ID: u8 = 36;
    pub const NAME: &str = "whETH";
}
pub mod sol {
    use solana_program::declare_id;
    declare_id!("So11111111111111111111111111111111111111112");
    pub const POOL_ID: u8 = 4;
    pub const NAME: &str = "SOL";
}
pub mod msol {
    use solana_program::declare_id;
    declare_id!("mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So");
    pub const POOL_ID: u8 = 12;
    pub const NAME: &str = "mSOL";
}
pub mod stsol {
    use solana_program::declare_id;
    declare_id!("7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj");
    pub const POOL_ID: u8 = 35;
    pub const NAME: &str = "stSOL";
}
pub mod scnsol {
    use solana_program::declare_id;
    declare_id!("5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm");
    pub const POOL_ID: u8 = 37;
    pub const NAME: &str = "scnSOL";
}

pub mod ray {
    use solana_program::declare_id;
    declare_id!("4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R");
    pub const POOL_ID: u8 = 11;
    pub const NAME: &str = "RAY";
}
pub mod orca {
    use solana_program::declare_id;
    declare_id!("orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE");
    pub const POOL_ID: u8 = 13;
    pub const NAME: &str = "ORCA";
}
pub mod srm {
    use solana_program::declare_id;
    declare_id!("SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt");
    pub const POOL_ID: u8 = 30;
    pub const NAME: &str = "SRM";
}

pub mod usdt {
    use solana_program::declare_id;
    declare_id!("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB");
    pub const POOL_ID: u8 = 2;
    pub const NAME: &str = "USDT";
}
pub mod usdc {
    use solana_program::declare_id;
    declare_id!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
    pub const POOL_ID: u8 = 3;
    pub const NAME: &str = "USDC";
}
pub mod ust {
    use solana_program::declare_id;
    declare_id!("9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQL8i");
    pub const POOL_ID: u8 = 21;
    pub const NAME: &str = "UST";
}

pub mod usdt_usdc_saber {
    use solana_program::declare_id;
    declare_id!("2poo1w1DL6yd2WNTCnNTzDqkC6MBXq7axo77P16yrBuf");
    pub const POOL_ID: u8 = 5;
    pub const NAME: &str = "USDT_USDC_SABER";
    pub mod miner {
        use solana_program::declare_id;
        declare_id!("GP1U66jGiiscj4HotJP7JTj76jpygdUaTUJT6HPbkoKn");
    }
}
pub mod msol_sol_saber {
    use solana_program::declare_id;
    declare_id!("SoLEao8wTzSfqhuou8rcYsVoLjthVmiXuEjzdNPMnCz");
    pub const POOL_ID: u8 = 40;
    pub const NAME: &str = "mSOL_SOL_SABER";
    pub mod miner {
        use solana_program::declare_id;
        declare_id!("73asEXQWZZqUUG58gY8vovh9wNQxUsKT7tKq8eZzPJhT");
    }
}
pub mod stsol_sol_saber {
    use solana_program::declare_id;
    declare_id!("stSjCmjQ96BiGhTk8gkU22j1739R8YBQVMq7KXWTqUV");
    pub const POOL_ID: u8 = 41;
    pub const NAME: &str = "stSOL_SOL_SABER";
    pub mod miner {
        use solana_program::declare_id;
        declare_id!("AE3BisWAMqs695qU7Y2L6s52v7N79MMTNQRbvqytXNJU");
    }
}
pub mod ust_usdc_saber {
    use solana_program::declare_id;
    declare_id!("USTCmQpbUGj5iTsXdnTYHZupY1QpftDZhLokSVk6UWi");
    pub const POOL_ID: u8 = 26;
    pub const NAME: &str = "UST_USDC_SABER";
    pub mod miner {
        use solana_program::declare_id;
        declare_id!("HgkCE5MPdDRKaYAY51smAJTToYsjUn2oLy5K9ZQYL4WP");
    }
}

pub mod usdc_usdt_orca {
    use solana_program::declare_id;
    declare_id!("H2uzgruPvonVpCRhwwdukcpXK8TG17swFNzYFr2rtPxy");
    pub const POOL_ID: u8 = 8;
    pub const NAME: &str = "USDC_USDT_ORCA";
    pub mod user_farm_state {
        use solana_program::declare_id;
        declare_id!("6s2gUuvYKF56j9TkmvLw2zQc3XiCqFa5ZJ7mWzTx2Xtp");
    }
    pub mod reward_orca_account {
        use solana_program::declare_id;
        declare_id!("FSQWYCVXiGXRfKd1NmchusEa9wADez9eQGt5RY5eDjiy");
    }
}
pub mod sol_usdc_orca {
    use solana_program::declare_id;
    declare_id!("APDFRM3HMr8CAGXwKHiu2f5ePSpaiEJhaURwhsRrUUt9");
    pub const POOL_ID: u8 = 15;
    pub const NAME: &str = "SOL_USDC_ORCA";
    pub mod user_farm_state {
        use solana_program::declare_id;
        declare_id!("BHRqAQrYye19sQho6knsGazThRaKg4nVeZBLb1iz8RUq");
    }
    pub mod reward_orca_account {
        use solana_program::declare_id;
        declare_id!("Hr5yQGW35HBP8fJLKfranRbbKzfSPHrhKFf1ZP68LmVp");
    }
}
pub mod msol_sol_orca {
    use solana_program::declare_id;
    declare_id!("29cdoMgu6MS2VXpcMo1sqRdWEzdUR9tjvoh8fcK8Z87R");
    pub const POOL_ID: u8 = 16;
    pub const NAME: &str = "mSOL_SOL_ORCA";
    pub mod user_farm_state {
        use solana_program::declare_id;
        declare_id!("AuiCj6vtkhctyfbvFHqcr5oLifGLZz77QVLUt5iVjXWm");
    }
    pub mod reward_orca_account {
        use solana_program::declare_id;
        declare_id!("CA59mFikUhJYLesKAxx8j8unHrxTfXSEPjzoXFyrG9M1");
    }
    pub mod user_farm_state_2nd {
        use solana_program::declare_id;
        declare_id!("ERvjyaHCL57xhd1zwaEb9agpYgoQarL19SRqcmhSto7Q");
    }
    pub mod reward_dd_account_2nd {
        use solana_program::declare_id;
        declare_id!("5U5uowAVYyggB6DvVZE12cLZE7EjxkdKGt8VpvbsNbAy");
    }
    pub mod floating_lp_2nd {
        use solana_program::declare_id;
        declare_id!("5QpEXnCWMyUHNwE1jFUZq4gzNzmke9XJ2qCZjeBvMqz3");
    }
}
pub mod orca_usdc_orca {
    use solana_program::declare_id;
    declare_id!("n8Mpu28RjeYD7oUX3LG1tPxzhRZh3YYLRSHcHRdS3Zx");
    pub const POOL_ID: u8 = 17;
    pub const NAME: &str = "ORCA_USDC_ORCA";
    pub mod user_farm_state {
        use solana_program::declare_id;
        declare_id!("3DmAD81qp5ZtxFUjtcrubuRrzCsJSDXHbR1P5VPeVuyz");
    }
    pub mod reward_orca_account {
        use solana_program::declare_id;
        declare_id!("G8cPgn6tiQQAQcTQupEi8fTBfo1RpqTii1hW65L4poTY");
    }
}
pub mod orca_sol_orca {
    use solana_program::declare_id;
    declare_id!("2uVjAuRXavpM6h1scGQaxqb6HVaNRn6T2X7HHXTabz25");
    pub const POOL_ID: u8 = 18;
    pub const NAME: &str = "ORCA_SOL_ORCA";
    pub mod user_farm_state {
        use solana_program::declare_id;
        declare_id!("3dAg8zU3VLcE3vfpxsxbnfbKoUfg6G4kGcETxkiQ4oKr");
    }
    pub mod reward_orca_account {
        use solana_program::declare_id;
        declare_id!("2G7ZWG9z6WtKJ5k5B32RTmLFB7hLVEnC5RmYD7gvCpG3");
    }
}
pub mod eth_usdc_orca {
    use solana_program::declare_id;
    declare_id!("3e1W6Aqcbuk2DfHUwRiRcyzpyYRRjg6yhZZcyEARydUX");
    pub const POOL_ID: u8 = 19;
    pub const NAME: &str = "ETH_USDC_ORCA";
    pub mod user_farm_state {
        use solana_program::declare_id;
        declare_id!("jkLcyt7rqAaioqKgG3UYzP56XigyqojaJNLzvd8s7GR");
    }
    pub mod reward_orca_account {
        use solana_program::declare_id;
        declare_id!("CtVJtQHSAcSQ3b4FD3A3Zk8vb2PaC4wn1oTnHtUMS8rf");
    }
}
pub mod sol_usdt_orca {
    use solana_program::declare_id;
    declare_id!("FZthQCuYHhcfiDma7QrX7buDHwrZEd7vL8SjS6LQa3Tx");
    pub const POOL_ID: u8 = 20;
    pub const NAME: &str = "SOL_USDT_ORCA";
    pub mod user_farm_state {
        use solana_program::declare_id;
        declare_id!("AUZaXYcFbpsgpGXhMdQ6hHr5fb9H6RkevrNxidd4Qmsa");
    }
    pub mod reward_orca_account {
        use solana_program::declare_id;
        declare_id!("9AfsnfPwRrJLjcCAasUcaYeVunpmxgev6yCVa6HiLkp7");
    }
}
pub mod eth_sol_orca {
    use solana_program::declare_id;
    declare_id!("71FymgN2ZUf7VvVTLE8jYEnjP3jSK1Frp2XT1nHs8Hob");
    pub const POOL_ID: u8 = 23;
    pub const NAME: &str = "ETH_SOL_ORCA";
    pub mod user_farm_state {
        use solana_program::declare_id;
        declare_id!("iZQwU7EYQiMz43WUmh3hGoFaeMcnP7BbgPZ3dSh7Ntn");
    }
    pub mod reward_orca_account {
        use solana_program::declare_id;
        declare_id!("2NYnAKhCwCMoe5unHuaEQEYL1ugLypK8Hrx4Qp5ugSUf");
    }
}
pub mod apt_usdc_orca {
    use solana_program::declare_id;
    declare_id!("HNrYngS1eoqkjWro9D3Y5Z9sWBDzPNK2tX4rfV2Up177");
    pub const POOL_ID: u8 = 28;
    pub const NAME: &str = "APT_USDC_ORCA";
    pub mod user_farm_state {
        use solana_program::declare_id;
        declare_id!("3kyc7Pot3qzCb3esLEnjJiG2tu99pD6V3oWJrQLwc2P7");
    }
    pub mod reward_orca_account {
        use solana_program::declare_id;
        declare_id!("EgFva9mEFCV31AkhoZb6rN6zvbNGE1xdaRYAkKTtdNjN");
    }
}
pub mod btc_msol_orca {
    use solana_program::declare_id;
    declare_id!("8nKJ4z9FSw6wrVZKASqBiS9DS1CiNsRnqwCCKVQjqdkB");
    pub const POOL_ID: u8 = 24;
    pub const NAME: &str = "BTC_mSOL_ORCA";
    pub mod user_farm_state {
        use solana_program::declare_id;
        declare_id!("7cf9RpGCZSzQCrytoqysoQjN7w2tpeX86MmLBv6cAyrp");
    }
    pub mod reward_orca_account {
        use solana_program::declare_id;
        declare_id!("7Sfy525w1dpCQqXb2sEKuacV57333VCSCKGuubsxXvCc");
    }
    pub mod user_farm_state_2nd {
        use solana_program::declare_id;
        declare_id!("3JjHmB43qTuHHhGxejdThZBcHGQugs2L62eeM9M3Kmig");
    }
    pub mod reward_dd_account_2nd {
        use solana_program::declare_id;
        declare_id!("AoeNmMDdDBS7xyvXjtG79pCa8Duf4qFALs4KY49okdx2");
    }
    pub mod floating_lp_2nd {
        use solana_program::declare_id;
        declare_id!("ESCvrGSqm2ykHBetb7bXAY8j1zWFLCSMeoFwYAQeJ3u3");
    }
}
pub mod msol_usdc_orca {
    use solana_program::declare_id;
    declare_id!("8PSfyiTVwPb6Rr2iZ8F3kNpbg65BCfJM9v8LfB916r44");
    pub const POOL_ID: u8 = 25;
    pub const NAME: &str = "mSOL_USDC_ORCA";
    pub mod user_farm_state {
        use solana_program::declare_id;
        declare_id!("DuHRmA6Dc9L9TsoxcfYFuuu4Gt9U89ogv61ewbhhbKRP");
    }
    pub mod reward_orca_account {
        use solana_program::declare_id;
        declare_id!("B16JMAgpR84Dr6rucq4GYLZV7pdk1uPF533P9KVwNUq4");
    }
    pub mod user_farm_state_2nd {
        use solana_program::declare_id;
        declare_id!("CUJorkzjpvZnm7ynSaxuwtK2MJk21ReFDSF4uNc3xrsc");
    }
    pub mod reward_dd_account_2nd {
        use solana_program::declare_id;
        declare_id!("3QaNhP4vT6PG3eoQwg2DRbH9ecmy7pR2f1PBPWCwDBYd");
    }
    pub mod floating_lp_2nd {
        use solana_program::declare_id;
        declare_id!("FUBad9ZBZmegSugRt7qY4uM1yRxzhBRpywwkn4mRQAeQ");
    }
}
pub mod stsol_ust_orca {
    use solana_program::declare_id;
    declare_id!("HTZd53fYwYQRyAjiaPsZy9Gf41gobFdqkF4oKe3XLi95");
    pub const POOL_ID: u8 = 38;
    pub const NAME: &str = "stSOL_UST_ORCA";
    pub mod user_farm_state {
        use solana_program::declare_id;
        declare_id!("73q4YJSXm38cqDbcYL467fr7bGZxViVt9MuRNF14GFpi");
    }
    pub mod reward_orca_account {
        use solana_program::declare_id;
        declare_id!("6P4frmXufUBsT2s39zbQ5k5UDrzSpFcNKmZAgWZLHgMv");
    }
}
pub mod orca_wheth_orca {
    use solana_program::declare_id;
    declare_id!("GsfyYHkSgC3Ta6aWR9MjB2sxoBrkGGeR2tAwXbpphf3");
    pub const POOL_ID: u8 = 39;
    pub const NAME: &str = "ORCA_whETH_ORCA";
    pub mod user_farm_state {
        use solana_program::declare_id;
        declare_id!("8xzKDQKm6N9ERkkx8J8azT3icsA1skfkuhxLfSdVvEcB");
    }
    pub mod reward_orca_account {
        use solana_program::declare_id;
        declare_id!("9jJVuB2UhzcGED6h476kieHwTVPmhY7EJsQyud38Q4r1");
    }
}

pub mod sol_usdc_raydium {
    use solana_program::declare_id;
    declare_id!("8HoQnePLqPj4M7PUDzfw8e3Ymdwgc7NLGnaTUapubyvu");
    pub const POOL_ID: u8 = 9;
    pub const NAME: &str = "SOL_USDC_RAYDIUM";
    pub mod reward_ray_account {
        use solana_program::declare_id;
        declare_id!("44tSF4Sisrsy7YXmtSYnFLzQnZeVvwgd5PTMzRvAqtq4");
    }
    pub mod reward_second_account {
        use solana_program::declare_id;
        declare_id!("BzqrcDc7wpciqtsSj7MsDajDdjHuS7XBdqaprSm8GaiB");
    }
    pub mod user_ledger_account {
        use solana_program::declare_id;
        declare_id!("4vbQX6ycybRe6KMeb6VT9pEpG1284QvTrZv2ph3Yh2Nd");
    }
}
pub mod ray_usdc_raydium {
    use solana_program::declare_id;
    declare_id!("FbC6K13MzHvN42bXrtGaWsvZY9fxrackRSZcBGfjPc7m");
    pub const POOL_ID: u8 = 10;
    pub const NAME: &str = "RAY_USDC_RAYDIUM";
    pub mod reward_ray_account {
        use solana_program::declare_id;
        declare_id!("49i8NSa6z2DcWxBnnsZjyxKvLxEqXGZ833B4jUDNmxnT");
    }
    pub mod reward_second_account {
        use solana_program::declare_id;
        declare_id!("11111111111111111111111111111111");
    }
    pub mod user_ledger_account {
        use solana_program::declare_id;
        declare_id!("FicrKCCcXaZxgLAS6hymbcaHxNNjtCUmJFofsJ1fjdxj");
    }
}
pub mod sol_usdt_raydium {
    use solana_program::declare_id;
    declare_id!("Epm4KfTj4DMrvqn6Bwg2Tr2N8vhQuNbuK8bESFp4k33K");
    pub const POOL_ID: u8 = 14;
    pub const NAME: &str = "SOL_USDT_RAYDIUM";
    pub mod reward_ray_account {
        use solana_program::declare_id;
        declare_id!("4aryP8pemzEuJjMteEPHFbM1SJdgoahx4AG1ZpdCvJZQ");
    }
    pub mod reward_second_account {
        use solana_program::declare_id;
        declare_id!("HBrRwtFzrL7CyngExF4N3LrKzSEf1ViFRLHJcVEwmphw");
    }
    pub mod user_ledger_account {
        use solana_program::declare_id;
        declare_id!("C4GrteYviDR4xfMGwdGD5gzVgy3iVmTHGhV2XoiJZfLw");
    }
}
pub mod msol_sol_raydium {
    use solana_program::declare_id;
    declare_id!("5ijRoAHVgd5T5CNtK5KDRUBZ7Bffb69nktMj5n6ks6m4");
    pub const POOL_ID: u8 = 22;
    pub const NAME: &str = "mSOL_SOL_RAYDIUM";
}
pub mod ray_usdt_raydium {
    use solana_program::declare_id;
    declare_id!("C3sT1R3nsw4AVdepvLTLKr5Gvszr7jufyBWUCvy4TUvT");
    pub const POOL_ID: u8 = 31;
    pub const NAME: &str = "RAY_USDT_RAYDIUM";
    pub mod reward_ray_account {
        use solana_program::declare_id;
        declare_id!("3YUuGZJSF5Jdy3mXBXgWh86t2msj4d2WvNGawSsDZbHC");
    }
    pub mod reward_second_account {
        use solana_program::declare_id;
        declare_id!("11111111111111111111111111111111");
    }
    pub mod user_ledger_account {
        use solana_program::declare_id;
        declare_id!("HqoBjwSWTWvSUvWAAG1ScWJDXb9ZgUJhhvcFUxKZf7Pz");
    }
}
pub mod ray_eth_raydium {
    use solana_program::declare_id;
    declare_id!("mjQH33MqZv5aKAbKHi8dG3g3qXeRQqq1GFcXceZkNSr");
    pub const POOL_ID: u8 = 32;
    pub const NAME: &str = "RAY_ETH_RAYDIUM";
    pub mod reward_ray_account {
        use solana_program::declare_id;
        declare_id!("5PzDUuUYWmkymdNznZmvWAj5nn89xwFbD844rMJveHY3");
    }
    pub mod reward_second_account {
        use solana_program::declare_id;
        declare_id!("11111111111111111111111111111111");
    }
    pub mod user_ledger_account {
        use solana_program::declare_id;
        declare_id!("BTPJFX8vWYExEAD7C9J9hpsUU8bUfcxDfc8da2pskzX1");
    }
}
pub mod ray_sol_raydium {
    use solana_program::declare_id;
    declare_id!("89ZKE4aoyfLBe2RuV6jM3JGNhaV18Nxh8eNtjRcndBip");
    pub const POOL_ID: u8 = 33;
    pub const NAME: &str = "RAY_SOL_RAYDIUM";
    pub mod reward_ray_account {
        use solana_program::declare_id;
        declare_id!("ChJUMQNtVNznGWaFUeNAqKD95hd1gmz9CRHobw3aMRbm");
    }
    pub mod reward_second_account {
        use solana_program::declare_id;
        declare_id!("11111111111111111111111111111111");
    }
    pub mod user_ledger_account {
        use solana_program::declare_id;
        declare_id!("5wGcTvJVumeXy7YBjcf1RqPwQ8GciFVvUJeCvgGmwLxp");
    }
}
pub mod srm_usdc_raydium {
    use solana_program::declare_id;
    declare_id!("9XnZd82j34KxNLgQfz29jGbYdxsYznTWRpvZE3SRE7JG");
    pub const POOL_ID: u8 = 34;
    pub const NAME: &str = "SRM_USDC_RAYDIUM";
    pub mod reward_ray_account {
        use solana_program::declare_id;
        declare_id!("2qgtUtNopD3ZCrQCbVsvYd1BrPeWxn4TcrXjwvTzLCYi");
    }
    pub mod reward_second_account {
        use solana_program::declare_id;
        declare_id!("2iy54EuEMgUVFMaRzxusiMSawgcHUgR34SZWaKkMosMc");
    }
    pub mod user_ledger_account {
        use solana_program::declare_id;
        declare_id!("AMpGacKHMNbQvKXGCkCGq4tNeXokHZwvPiYSeyHS6PvG");
    }
}

pub fn get_pool_id_by_name(token_name: &str) -> u8 {
    match token_name {
        apt::NAME => apt::POOL_ID,
        btc::NAME => btc::POOL_ID,
        eth::NAME => eth::POOL_ID,
        wheth::NAME => wheth::POOL_ID,
        sol::NAME => sol::POOL_ID,
        msol::NAME => msol::POOL_ID,
        stsol::NAME => stsol::POOL_ID,
        scnsol::NAME => scnsol::POOL_ID,
        ray::NAME => ray::POOL_ID,
        orca::NAME => orca::POOL_ID,
        srm::NAME => srm::POOL_ID,
        usdt::NAME => usdt::POOL_ID,
        usdc::NAME => usdc::POOL_ID,
        ust::NAME => ust::POOL_ID,
        usdt_usdc_saber::NAME => usdt_usdc_saber::POOL_ID,
        msol_sol_saber::NAME => msol_sol_saber::POOL_ID,
        stsol_sol_saber::NAME => stsol_sol_saber::POOL_ID,
        ust_usdc_saber::NAME => ust_usdc_saber::POOL_ID,
        usdc_usdt_orca::NAME => usdc_usdt_orca::POOL_ID,
        sol_usdc_orca::NAME => sol_usdc_orca::POOL_ID,
        msol_sol_orca::NAME => msol_sol_orca::POOL_ID,
        orca_usdc_orca::NAME => orca_usdc_orca::POOL_ID,
        orca_sol_orca::NAME => orca_sol_orca::POOL_ID,
        eth_usdc_orca::NAME => eth_usdc_orca::POOL_ID,
        sol_usdt_orca::NAME => sol_usdt_orca::POOL_ID,
        eth_sol_orca::NAME => eth_sol_orca::POOL_ID,
        apt_usdc_orca::NAME => apt_usdc_orca::POOL_ID,
        btc_msol_orca::NAME => btc_msol_orca::POOL_ID,
        msol_usdc_orca::NAME => msol_usdc_orca::POOL_ID,
        stsol_ust_orca::NAME => stsol_ust_orca::POOL_ID,
        orca_wheth_orca::NAME => orca_wheth_orca::POOL_ID,
        sol_usdc_raydium::NAME => sol_usdc_raydium::POOL_ID,
        ray_usdc_raydium::NAME => ray_usdc_raydium::POOL_ID,
        sol_usdt_raydium::NAME => sol_usdt_raydium::POOL_ID,
        msol_sol_raydium::NAME => msol_sol_raydium::POOL_ID,
        ray_usdt_raydium::NAME => ray_usdt_raydium::POOL_ID,
        ray_eth_raydium::NAME => ray_eth_raydium::POOL_ID,
        ray_sol_raydium::NAME => ray_sol_raydium::POOL_ID,
        srm_usdc_raydium::NAME => srm_usdc_raydium::POOL_ID,
        _ => panic!("Token doens't have a pool!"),
    }
}

pub fn get_mint_by_pool_id(pool_id: u8) -> Pubkey {
    match pool_id {
        apt::POOL_ID => apt::ID,
        btc::POOL_ID => btc::ID,
        eth::POOL_ID => eth::ID,
        wheth::POOL_ID => wheth::ID,
        sol::POOL_ID => sol::ID,
        msol::POOL_ID => msol::ID,
        stsol::POOL_ID => stsol::ID,
        scnsol::POOL_ID => scnsol::ID,
        ray::POOL_ID => ray::ID,
        orca::POOL_ID => orca::ID,
        srm::POOL_ID => srm::ID,
        usdt::POOL_ID => usdt::ID,
        usdc::POOL_ID => usdc::ID,
        ust::POOL_ID => ust::ID,
        usdt_usdc_saber::POOL_ID => usdt_usdc_saber::ID,
        msol_sol_saber::POOL_ID => msol_sol_saber::ID,
        stsol_sol_saber::POOL_ID => stsol_sol_saber::ID,
        ust_usdc_saber::POOL_ID => ust_usdc_saber::ID,
        usdc_usdt_orca::POOL_ID => usdc_usdt_orca::ID,
        sol_usdc_orca::POOL_ID => sol_usdc_orca::ID,
        msol_sol_orca::POOL_ID => msol_sol_orca::ID,
        orca_usdc_orca::POOL_ID => orca_usdc_orca::ID,
        orca_sol_orca::POOL_ID => orca_sol_orca::ID,
        eth_usdc_orca::POOL_ID => eth_usdc_orca::ID,
        sol_usdt_orca::POOL_ID => sol_usdt_orca::ID,
        eth_sol_orca::POOL_ID => eth_sol_orca::ID,
        apt_usdc_orca::POOL_ID => apt_usdc_orca::ID,
        btc_msol_orca::POOL_ID => btc_msol_orca::ID,
        msol_usdc_orca::POOL_ID => msol_usdc_orca::ID,
        stsol_ust_orca::POOL_ID => stsol_ust_orca::ID,
        orca_wheth_orca::POOL_ID => orca_wheth_orca::ID,
        sol_usdc_raydium::POOL_ID => sol_usdc_raydium::ID,
        ray_usdc_raydium::POOL_ID => ray_usdc_raydium::ID,
        sol_usdt_raydium::POOL_ID => sol_usdt_raydium::ID,
        msol_sol_raydium::POOL_ID => msol_sol_raydium::ID,
        ray_usdt_raydium::POOL_ID => ray_usdt_raydium::ID,
        ray_eth_raydium::POOL_ID => ray_eth_raydium::ID,
        ray_sol_raydium::POOL_ID => ray_sol_raydium::ID,
        srm_usdc_raydium::POOL_ID => srm_usdc_raydium::ID,
        _ => panic!("Token doens't have a pool!"),
    }
}
