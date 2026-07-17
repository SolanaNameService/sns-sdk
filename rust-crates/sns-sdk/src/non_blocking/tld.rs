use {
    crate::{
        config::SOL_TLD_CUTOFF_SLOT,
        error::SnsError,
        tld::{
            endpoint_is_past_sol_cutoff, mark_endpoint_past_sol_cutoff, parse_supported_tld, Tld,
        },
    },
    solana_client::nonblocking::rpc_client::RpcClient,
    solana_sdk::commitment_config::CommitmentConfig,
};

/// Validates and trims a full read-side domain, enforcing the finalized-slot
/// cutoff before allowing legacy SNS-backed `.sol` reads.
pub(crate) async fn assert_tld_supported<'a>(
    rpc_client: &RpcClient,
    domain: &'a str,
) -> Result<(&'a str, Tld), SnsError> {
    let (trimmed_domain, tld) = parse_supported_tld(domain)?;
    if tld != Tld::Sol {
        return Ok((trimmed_domain, tld));
    }

    let endpoint = rpc_client.url();
    if endpoint_is_past_sol_cutoff(&endpoint) {
        return Err(SnsError::UnsupportedTld);
    }

    let slot = rpc_client
        .get_slot_with_commitment(CommitmentConfig::finalized())
        .await?;
    if slot >= SOL_TLD_CUTOFF_SLOT {
        mark_endpoint_past_sol_cutoff(endpoint);
        return Err(SnsError::UnsupportedTld);
    }

    Ok((trimmed_domain, tld))
}

#[cfg(test)]
mod tests {
    use {
        super::*,
        crate::{
            non_blocking::{
                record_v1::get_record,
                record_v2::{get_multiple_records_v2, get_record_v2},
                resolve::{resolve, AllowPda},
            },
            record::Record,
            utils::test::TestRpcSender,
        },
        serde_json::{json, Value},
        solana_client::{
            nonblocking::rpc_client::RpcClient, rpc_client::RpcClientConfig,
            rpc_request::RpcRequest,
        },
    };

    #[cfg(feature = "subdomain")]
    use crate::non_blocking::subdomain::get_sub_registrar_info;

    fn test_client(endpoint: &str, slot_response: Value) -> (RpcClient, TestRpcSender) {
        let sender = TestRpcSender::new(endpoint, slot_response);
        let client = RpcClient::new_sender(
            sender.clone(),
            RpcClientConfig::with_commitment(CommitmentConfig::default()),
        );
        (client, sender)
    }

    fn assert_finalized_slot_request(sender: &TestRpcSender) {
        assert_eq!(
            sender.requests(),
            vec![(RpcRequest::GetSlot, json!([{ "commitment": "finalized" }]))]
        );
    }

    #[tokio::test]
    async fn sns_and_unsupported_tlds_do_not_request_a_slot() {
        let (client, sender) = test_client("nb-no-slot", Value::Null);
        assert_eq!(
            assert_tld_supported(&client, "bonfida.sns").await.unwrap(),
            ("bonfida", Tld::Sns)
        );
        assert!(matches!(
            assert_tld_supported(&client, "bonfida.eth").await,
            Err(SnsError::UnsupportedTld)
        ));
        assert!(sender.requests().is_empty());
    }

    #[tokio::test]
    async fn sol_cutoff_cache_is_endpoint_scoped() {
        let (past_client, past_sender) =
            test_client("nb-endpoint-past", json!(SOL_TLD_CUTOFF_SLOT));
        assert!(matches!(
            assert_tld_supported(&past_client, "bonfida.sol").await,
            Err(SnsError::UnsupportedTld)
        ));
        assert_finalized_slot_request(&past_sender);

        let (cached_client, cached_sender) = test_client("nb-endpoint-past", Value::Null);
        assert!(matches!(
            assert_tld_supported(&cached_client, "bonfida.sol").await,
            Err(SnsError::UnsupportedTld)
        ));
        assert!(cached_sender.requests().is_empty());

        let (post_client, post_sender) =
            test_client("nb-endpoint-post", json!(SOL_TLD_CUTOFF_SLOT + 1));
        assert!(matches!(
            assert_tld_supported(&post_client, "bonfida.sol").await,
            Err(SnsError::UnsupportedTld)
        ));
        assert_finalized_slot_request(&post_sender);

        let (other_client, other_sender) = test_client("nb-endpoint-other", json!(0));
        assert_eq!(
            assert_tld_supported(&other_client, "bonfida.sol")
                .await
                .unwrap(),
            ("bonfida", Tld::Sol)
        );
        assert_finalized_slot_request(&other_sender);
    }

    #[tokio::test]
    async fn pre_cutoff_slots_and_rpc_failures_are_not_cached() {
        let endpoint = "nb-pre-not-cached";
        let (pre_client, pre_sender) = test_client(endpoint, json!(SOL_TLD_CUTOFF_SLOT - 1));
        assert!(assert_tld_supported(&pre_client, "bonfida.sol")
            .await
            .is_ok());
        assert_finalized_slot_request(&pre_sender);

        let (cutoff_client, cutoff_sender) = test_client(endpoint, json!(SOL_TLD_CUTOFF_SLOT));
        assert!(matches!(
            assert_tld_supported(&cutoff_client, "bonfida.sol").await,
            Err(SnsError::UnsupportedTld)
        ));
        assert_finalized_slot_request(&cutoff_sender);

        let endpoint = "nb-error-not-cached";
        let (failed_client, failed_sender) = test_client(endpoint, Value::Null);
        assert!(matches!(
            assert_tld_supported(&failed_client, "bonfida.sol").await,
            Err(SnsError::SolanaClient(_))
        ));
        assert_finalized_slot_request(&failed_sender);

        let (retry_client, retry_sender) = test_client(endpoint, json!(0));
        assert!(assert_tld_supported(&retry_client, "bonfida.sol")
            .await
            .is_ok());
        assert_finalized_slot_request(&retry_sender);
    }

    #[tokio::test]
    async fn every_full_domain_read_gates_sol_before_account_rpcs() {
        let (client, sender) = test_client("nb-boundary-resolve", json!(SOL_TLD_CUTOFF_SLOT));
        assert!(matches!(
            resolve(&client, "bonfida.sol", AllowPda::Deny).await,
            Err(SnsError::UnsupportedTld)
        ));
        assert_finalized_slot_request(&sender);

        let (client, sender) = test_client("nb-boundary-v1", json!(SOL_TLD_CUTOFF_SLOT));
        assert!(matches!(
            get_record(&client, "bonfida.sol", Record::Url).await,
            Err(SnsError::UnsupportedTld)
        ));
        assert_finalized_slot_request(&sender);

        let (client, sender) = test_client("nb-boundary-v2", json!(SOL_TLD_CUTOFF_SLOT));
        assert!(matches!(
            get_record_v2(&client, "bonfida.sol", Record::Url).await,
            Err(SnsError::UnsupportedTld)
        ));
        assert_finalized_slot_request(&sender);

        let (client, sender) = test_client("nb-boundary-v2-batch", json!(SOL_TLD_CUTOFF_SLOT));
        assert!(matches!(
            get_multiple_records_v2(&client, "bonfida.sol", &[Record::Url]).await,
            Err(SnsError::UnsupportedTld)
        ));
        assert_finalized_slot_request(&sender);

        #[cfg(feature = "subdomain")]
        {
            let (client, sender) = test_client("nb-boundary-registrar", json!(SOL_TLD_CUTOFF_SLOT));
            assert!(matches!(
                get_sub_registrar_info(&client, "bonfida.sol").await,
                Err(SnsError::UnsupportedTld)
            ));
            assert_finalized_slot_request(&sender);
        }
    }

    #[tokio::test]
    async fn every_full_domain_read_skips_the_slot_for_sns() {
        let (client, sender) = test_client("nb-sns-boundaries", Value::Null);

        assert!(matches!(
            resolve(&client, "missing.sns", AllowPda::Deny).await,
            Err(SnsError::DomainDoesNotExist)
        ));
        assert_eq!(
            get_record(&client, "missing.sns", Record::Url)
                .await
                .unwrap(),
            None
        );
        assert_eq!(
            get_record_v2(&client, "missing.sns", Record::Url)
                .await
                .unwrap(),
            None
        );
        assert_eq!(
            get_multiple_records_v2(&client, "missing.sns", &[Record::Url])
                .await
                .unwrap(),
            vec![None]
        );
        #[cfg(feature = "subdomain")]
        assert!(matches!(
            get_sub_registrar_info(&client, "missing.sns").await,
            Err(SnsError::InvalidSubRegistrar)
        ));

        assert!(!sender
            .requests()
            .iter()
            .any(|(request, _)| *request == RpcRequest::GetSlot));
    }
}
