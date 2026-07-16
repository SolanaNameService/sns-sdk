//! Transaction-instruction builders for V2 records.
//!
//! Public builders require a full canonical `.sns` domain. Bare names, `.sol`
//! names, uppercase names, and malformed domains are rejected.

use sns_records::instruction::{
    allocate_and_post_record, delete_record, edit_record, validate_ethereum_signature,
    validate_solana_signature, write_roa,
};
use sns_records::state::validation::Validation;
use solana_program::{instruction::Instruction, pubkey::Pubkey};
use solana_sdk_ids::system_program;

use crate::{
    derivation::get_sns_domain_key,
    error::SnsError,
    record::{get_record_v2_key, record_v2::serialize_record_v2_content, Record},
    tld::parse_sns_domain,
};

fn record_name(record: Record) -> String {
    format!("\x02{}", record.as_str())
}

fn parse_sns_record_keys(domain: &str, record: Record) -> Result<(Pubkey, Pubkey), SnsError> {
    let trimmed_domain = parse_sns_domain(domain)?;
    let record_key = get_record_v2_key(&trimmed_domain, record)?;
    let domain_key = get_sns_domain_key(&trimmed_domain)?.key;
    Ok((record_key, domain_key))
}

/// Build the instruction that allocates a V2 record account and posts its content.
pub fn create_record_v2_instruction(
    domain: &str,
    record: Record,
    content: &str,
    owner: Pubkey,
    payer: Pubkey,
) -> Result<Instruction, SnsError> {
    let (record_key, domain_key) = parse_sns_record_keys(domain, record)?;
    let content_bytes = serialize_record_v2_content(content, record)?;

    Ok(allocate_and_post_record(
        allocate_and_post_record::Accounts {
            system_program: &system_program::ID,
            spl_name_service_program: &spl_name_service::ID,
            fee_payer: &payer,
            record: &record_key,
            domain: &domain_key,
            domain_owner: &owner,
            central_state: &sns_records::central_state::KEY,
        },
        allocate_and_post_record::Params {
            record: record_name(record),
            content: content_bytes,
        },
    ))
}

/// Build the instruction that overwrites the content of an existing V2 record.
pub fn update_record_v2_instruction(
    domain: &str,
    record: Record,
    content: &str,
    owner: Pubkey,
    payer: Pubkey,
) -> Result<Instruction, SnsError> {
    let (record_key, domain_key) = parse_sns_record_keys(domain, record)?;
    let content_bytes = serialize_record_v2_content(content, record)?;

    Ok(edit_record(
        edit_record::Accounts {
            system_program: &system_program::ID,
            spl_name_service_program: &spl_name_service::ID,
            fee_payer: &payer,
            record: &record_key,
            domain: &domain_key,
            domain_owner: &owner,
            central_state: &sns_records::central_state::KEY,
        },
        edit_record::Params {
            record: record_name(record),
            content: content_bytes,
        },
    ))
}

/// Build the instruction that deletes a V2 record and refunds the rent to the fee payer.
pub fn delete_record_v2(
    domain: &str,
    record: Record,
    owner: Pubkey,
    payer: Pubkey,
) -> Result<Instruction, SnsError> {
    let (record_key, domain_key) = parse_sns_record_keys(domain, record)?;

    Ok(delete_record(
        delete_record::Accounts {
            system_program: &system_program::ID,
            spl_name_service_program: &spl_name_service::ID,
            fee_payer: &payer,
            record: &record_key,
            domain: &domain_key,
            domain_owner: &owner,
            central_state: &sns_records::central_state::KEY,
        },
        delete_record::Params {},
    ))
}

/// Build the instruction that writes a Right-of-Association id into an existing V2 record.
pub fn write_roa_record_v2(
    domain: &str,
    record: Record,
    owner: Pubkey,
    payer: Pubkey,
    roa_id: Pubkey,
) -> Result<Instruction, SnsError> {
    let (record_key, domain_key) = parse_sns_record_keys(domain, record)?;

    Ok(write_roa(
        write_roa::Accounts {
            system_program: &system_program::ID,
            spl_name_service_program: &spl_name_service::ID,
            fee_payer: &payer,
            record: &record_key,
            domain: &domain_key,
            domain_owner: &owner,
            central_state: &sns_records::central_state::KEY,
        },
        write_roa::Params {
            roa_id: roa_id.to_bytes().to_vec(),
        },
    ))
}

/// Build the instruction that validates the staleness or RoA proof of a V2 record via a
/// Solana signature.
///
/// `staleness = true` validates the staleness id; `false` validates the RoA id.
pub fn validate_record_v2_content(
    staleness: bool,
    domain: &str,
    record: Record,
    owner: Pubkey,
    payer: Pubkey,
    verifier: Pubkey,
) -> Result<Instruction, SnsError> {
    let (record_key, domain_key) = parse_sns_record_keys(domain, record)?;

    Ok(validate_solana_signature(
        validate_solana_signature::Accounts {
            system_program: &system_program::ID,
            spl_name_service_program: &spl_name_service::ID,
            fee_payer: &payer,
            record: &record_key,
            domain: &domain_key,
            domain_owner: &owner,
            central_state: &sns_records::central_state::KEY,
            verifier: &verifier,
        },
        validate_solana_signature::Params { staleness },
    ))
}

/// Build the instruction that validates a V2 record's Right-of-Association against an
/// Ethereum signature.
///
/// `signature` is the 65-byte secp256k1 signature and `expected_pubkey` the 20-byte ETH
/// address that signed the record's content. Unlike the Solana variant there is no
/// on-chain verifier signer — the proof rides in the params and is checked by the program.
pub fn eth_validate_record_v2_content(
    domain: &str,
    record: Record,
    owner: Pubkey,
    payer: Pubkey,
    signature: Vec<u8>,
    expected_pubkey: Vec<u8>,
) -> Result<Instruction, SnsError> {
    let (record_key, domain_key) = parse_sns_record_keys(domain, record)?;

    Ok(validate_ethereum_signature(
        validate_ethereum_signature::Accounts {
            system_program: &system_program::ID,
            spl_name_service_program: &spl_name_service::ID,
            fee_payer: &payer,
            record: &record_key,
            domain: &domain_key,
            domain_owner: &owner,
            central_state: &sns_records::central_state::KEY,
        },
        validate_ethereum_signature::Params {
            validation: Validation::Ethereum,
            signature,
            expected_pubkey,
        },
    ))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{derivation::get_sns_domain_key, record::get_record_v2_key};
    use solana_program::pubkey;

    fn fixture() -> (Pubkey, Pubkey, &'static str, Record) {
        let owner = pubkey!("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb");
        let payer = pubkey!("HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA");
        (owner, payer, "bonfida.sns", Record::Url)
    }

    /// Every V2 record instruction routes 7 base accounts in this order. The validate
    /// variant adds an 8th verifier signer slot.
    fn assert_base_accounts(ix: &Instruction, payer: Pubkey, owner: Pubkey, domain: &str) {
        assert_eq!(ix.program_id, sns_records::ID);
        let domain = parse_sns_domain(domain).unwrap();
        let domain_key = get_sns_domain_key(&domain).unwrap().key;
        assert_eq!(ix.accounts[0].pubkey, system_program::ID);
        assert_eq!(ix.accounts[1].pubkey, spl_name_service::ID);
        assert_eq!(ix.accounts[2].pubkey, payer);
        assert!(ix.accounts[2].is_signer && ix.accounts[2].is_writable);
        assert_eq!(ix.accounts[4].pubkey, domain_key);
        assert_eq!(ix.accounts[5].pubkey, owner);
        assert_eq!(ix.accounts[6].pubkey, sns_records::central_state::KEY);
    }

    #[test]
    fn create_record_v2_tag_and_accounts() {
        let (owner, payer, domain, record) = fixture();
        let ix =
            create_record_v2_instruction(domain, record, "https://sns.id", owner, payer).unwrap();
        assert_base_accounts(&ix, payer, owner, domain);
        assert_eq!(ix.accounts.len(), 7);
        assert_eq!(
            ix.accounts[3].pubkey,
            get_record_v2_key(&parse_sns_domain(domain).unwrap(), record).unwrap()
        );
        assert_eq!(ix.data[0], 1); // AllocateAndPostRecord
    }

    #[test]
    fn create_record_v2_accepts_subdomains() {
        let (owner, payer, _, record) = fixture();
        let domain = "sub.bonfida.sns";
        let ix =
            create_record_v2_instruction(domain, record, "https://sns.id", owner, payer).unwrap();

        assert_base_accounts(&ix, payer, owner, domain);
    }

    #[test]
    fn record_v2_write_apis_requires_sns() {
        let (owner, payer, _, record) = fixture();
        let verifier = pubkey!("CnNHzcp7L4jKiA2Rsca3hZyVwSmoqXaT8wGwzS8WvvB2");
        let roa_id = pubkey!("CnNHzcp7L4jKiA2Rsca3hZyVwSmoqXaT8wGwzS8WvvB2");

        fn assert_error(
            result: Result<Instruction, SnsError>,
            expected: fn(SnsError) -> bool,
            domain: &str,
            api: &str,
        ) {
            let Err(error) = result else {
                panic!("{api} accepted invalid write domain {domain}");
            };
            assert!(expected(error), "{api} returned wrong error for {domain}");
        }

        fn unsupported_tld(error: SnsError) -> bool {
            matches!(error, SnsError::UnsupportedTld)
        }

        fn invalid_domain_casing(error: SnsError) -> bool {
            matches!(error, SnsError::InvalidDomainCasing)
        }

        let cases: [(&str, fn(SnsError) -> bool); 4] = [
            ("bonfida", unsupported_tld),
            ("bonfida.sol", unsupported_tld),
            ("Bonfida.sns", invalid_domain_casing),
            (" bonfida.sns", invalid_domain_casing),
        ];

        for (domain, expected) in cases {
            assert_error(
                create_record_v2_instruction(domain, record, "https://sns.id", owner, payer),
                expected,
                domain,
                "create_record_v2_instruction",
            );
            assert_error(
                update_record_v2_instruction(domain, record, "https://sns.id", owner, payer),
                expected,
                domain,
                "update_record_v2_instruction",
            );
            assert_error(
                delete_record_v2(domain, record, owner, payer),
                expected,
                domain,
                "delete_record_v2",
            );
            assert_error(
                write_roa_record_v2(domain, record, owner, payer, roa_id),
                expected,
                domain,
                "write_roa_record_v2",
            );
            assert_error(
                validate_record_v2_content(true, domain, record, owner, payer, verifier),
                expected,
                domain,
                "validate_record_v2_content",
            );
            assert_error(
                eth_validate_record_v2_content(
                    domain,
                    record,
                    owner,
                    payer,
                    vec![0xABu8; 65],
                    vec![0xCDu8; 20],
                ),
                expected,
                domain,
                "eth_validate_record_v2_content",
            );
        }
    }

    #[test]
    fn update_record_v2_tag_and_accounts() {
        let (owner, payer, domain, record) = fixture();
        let ix =
            update_record_v2_instruction(domain, record, "https://sns.id", owner, payer).unwrap();
        assert_base_accounts(&ix, payer, owner, domain);
        assert_eq!(ix.accounts.len(), 7);
        assert_eq!(ix.data[0], 2); // EditRecord
    }

    #[test]
    fn delete_record_v2_tag_and_accounts() {
        let (owner, payer, domain, record) = fixture();
        let ix = delete_record_v2(domain, record, owner, payer).unwrap();
        assert_base_accounts(&ix, payer, owner, domain);
        assert_eq!(ix.accounts.len(), 7);
        assert_eq!(ix.data[0], 5); // DeleteRecord
    }

    #[test]
    fn write_roa_record_v2_tag_and_accounts() {
        let (owner, payer, domain, record) = fixture();
        let roa_id = pubkey!("CnNHzcp7L4jKiA2Rsca3hZyVwSmoqXaT8wGwzS8WvvB2");
        let ix = write_roa_record_v2(domain, record, owner, payer, roa_id).unwrap();
        assert_base_accounts(&ix, payer, owner, domain);
        assert_eq!(ix.accounts.len(), 7);
        assert_eq!(ix.data[0], 6); // WriteRoa
                                   // Last 32 bytes of the borsh-encoded `roa_id: Vec<u8>` are the pubkey bytes.
        let tail = &ix.data[ix.data.len() - 32..];
        assert_eq!(tail, roa_id.to_bytes());
    }

    #[test]
    fn validate_record_v2_content_tag_and_accounts() {
        let (owner, payer, domain, record) = fixture();
        let verifier = pubkey!("CnNHzcp7L4jKiA2Rsca3hZyVwSmoqXaT8wGwzS8WvvB2");
        let ix = validate_record_v2_content(true, domain, record, owner, payer, verifier).unwrap();
        assert_base_accounts(&ix, payer, owner, domain);
        assert_eq!(ix.accounts.len(), 8);
        assert_eq!(ix.accounts[7].pubkey, verifier);
        assert!(ix.accounts[7].is_signer);
        assert_eq!(ix.data[0], 3); // ValidateSolanaSignature
        assert_eq!(ix.data[1], 1); // staleness = true (borsh bool)
    }

    #[test]
    fn eth_validate_record_v2_content_tag_and_accounts() {
        let (owner, payer, domain, record) = fixture();
        let signature = vec![0xABu8; 65]; // secp256k1 sig
        let expected_pubkey = vec![0xCDu8; 20]; // ETH address
        let ix = eth_validate_record_v2_content(
            domain,
            record,
            owner,
            payer,
            signature.clone(),
            expected_pubkey.clone(),
        )
        .unwrap();
        assert_base_accounts(&ix, payer, owner, domain);
        // No verifier signer slot — the proof is in the params, not an account.
        assert_eq!(ix.accounts.len(), 7);
        assert_eq!(ix.data[0], 4); // ValidateEthereumSignature
        assert_eq!(ix.data[1], 2); // validation = Ethereum (borsh enum discriminant)
                                   // The signature and expected pubkey are borsh `Vec<u8>` (len prefix + bytes).
        let tail = &ix.data[ix.data.len() - expected_pubkey.len()..];
        assert_eq!(tail, expected_pubkey.as_slice());
    }
}

/// Simulates each builder against mainnet, bundling `create_record` + the operation under
/// test so the record-exists precondition holds without committing. `sig_verify: false`
/// means no keypair is needed. Needs `RPC_URL` in the environment.
#[cfg(test)]
mod simulate {
    use super::*;
    use dotenv::dotenv;
    use solana_client::{
        nonblocking::rpc_client::RpcClient, rpc_config::RpcSimulateTransactionConfig,
    };
    use solana_program::pubkey;
    use solana_sdk::transaction::Transaction;

    const DOMAIN: &str = "wallet-guide-9.sns";
    const OWNER: Pubkey = pubkey!("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");

    fn client() -> RpcClient {
        dotenv().ok();
        RpcClient::new(std::env::var("RPC_URL").unwrap())
    }

    async fn simulate_ok(rpc: &RpcClient, ixs: &[Instruction]) {
        let tx = Transaction::new_with_payer(ixs, Some(&OWNER));
        let config = RpcSimulateTransactionConfig {
            sig_verify: false,
            replace_recent_blockhash: true,
            ..Default::default()
        };
        let res = rpc
            .simulate_transaction_with_config(&tx, config)
            .await
            .unwrap();
        assert!(
            res.value.err.is_none(),
            "simulation failed: {:?}",
            res.value
        );
    }

    #[tokio::test]
    async fn create_record() {
        let create =
            create_record_v2_instruction(DOMAIN, Record::Github, "bonfida", OWNER, OWNER).unwrap();
        simulate_ok(&client(), &[create]).await;
    }

    #[tokio::test]
    async fn update_record() {
        let create =
            create_record_v2_instruction(DOMAIN, Record::Github, "bonfida", OWNER, OWNER).unwrap();
        let update =
            update_record_v2_instruction(DOMAIN, Record::Github, "some text", OWNER, OWNER)
                .unwrap();
        simulate_ok(&client(), &[create, update]).await;
    }

    #[tokio::test]
    async fn delete_record() {
        let create =
            create_record_v2_instruction(DOMAIN, Record::Github, "bonfida", OWNER, OWNER).unwrap();
        let delete = delete_record_v2(DOMAIN, Record::Github, OWNER, OWNER).unwrap();
        simulate_ok(&client(), &[create, delete]).await;
    }

    #[tokio::test]
    async fn solana_verify() {
        let create =
            create_record_v2_instruction(DOMAIN, Record::Github, "bonfida", OWNER, OWNER).unwrap();
        let validate =
            validate_record_v2_content(true, DOMAIN, Record::Github, OWNER, OWNER, OWNER).unwrap();
        simulate_ok(&client(), &[create, validate]).await;
    }

    #[tokio::test]
    async fn write_roa() {
        let create =
            create_record_v2_instruction(DOMAIN, Record::Github, "bonfida", OWNER, OWNER).unwrap();
        let roa = write_roa_record_v2(DOMAIN, Record::Github, OWNER, OWNER, OWNER).unwrap();
        simulate_ok(&client(), &[create, roa]).await;
    }

    #[tokio::test]
    async fn eth_verify() {
        let create = create_record_v2_instruction(
            DOMAIN,
            Record::Eth,
            "0x4bfbfd1e018f9f27eeb788160579daf7e2cd7da7",
            OWNER,
            OWNER,
        )
        .unwrap();
        let validate =
            validate_record_v2_content(true, DOMAIN, Record::Eth, OWNER, OWNER, OWNER).unwrap();
        // secp256k1 signature + 20-byte ETH address over the record's content; these are the
        // exact bytes the JS suite signs, valid for this domain/record/staleness combination.
        let signature = vec![
            78, 235, 200, 2, 51, 5, 225, 127, 83, 156, 25, 226, 53, 239, 196, 189, 196, 197, 121,
            2, 91, 2, 99, 11, 31, 179, 5, 233, 52, 246, 137, 252, 72, 27, 67, 15, 86, 42, 62, 117,
            140, 223, 159, 142, 86, 227, 233, 185, 149, 111, 92, 122, 147, 23, 217, 1, 66, 72, 63,
            150, 27, 219, 152, 10, 28,
        ];
        let expected_pubkey = vec![
            75, 251, 253, 30, 1, 143, 159, 39, 238, 183, 136, 22, 5, 121, 218, 247, 226, 205, 125,
            167,
        ];
        let eth = eth_validate_record_v2_content(
            DOMAIN,
            Record::Eth,
            OWNER,
            OWNER,
            signature,
            expected_pubkey,
        )
        .unwrap();
        simulate_ok(&client(), &[create, validate, eth]).await;
    }
}
