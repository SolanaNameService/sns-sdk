#[cfg(test)]
pub mod test {
    use {
        async_trait::async_trait,
        rand::Rng,
        serde_json::{json, Value},
        solana_account_decoder::{encode_ui_account, UiAccountEncoding},
        solana_client::{
            client_error::{ClientError, ClientErrorKind, Result as ClientResult},
            rpc_request::RpcRequest,
            rpc_sender::{RpcSender, RpcTransportStats},
        },
        solana_sdk::{account::Account, pubkey::Pubkey},
        std::{
            collections::{HashMap, VecDeque},
            sync::{Arc, Mutex},
        },
    };

    /// Generates a random lowercase ASCII string for RPC integration fixtures.
    pub fn generate_random_string(len: usize) -> String {
        let mut rng = rand::thread_rng();
        (0..len)
            .map(|_| (rng.gen::<u8>() % 26) as char)
            .map(|c| (c as u8 + b'a') as char)
            .collect()
    }

    /// Deterministic RPC sender that records requests and returns configurable
    /// slot responses plus empty account responses.
    #[derive(Clone)]
    pub struct TestRpcSender {
        endpoint: String,
        slot_response: Value,
        requests: Arc<Mutex<Vec<(RpcRequest, Value)>>>,
        responses: Arc<Mutex<HashMap<RpcRequest, VecDeque<TestRpcResponse>>>>,
    }

    enum TestRpcResponse {
        Value(Value),
        Error(String),
    }

    impl TestRpcSender {
        /// Creates a recording sender for an endpoint and `getSlot` response.
        pub fn new(endpoint: &str, slot_response: Value) -> Self {
            Self {
                endpoint: endpoint.to_owned(),
                slot_response,
                requests: Arc::default(),
                responses: Arc::default(),
            }
        }

        /// Appends a deterministic response for the given RPC request type.
        pub fn with_response(self, request: RpcRequest, response: Value) -> Self {
            self.responses
                .lock()
                .unwrap()
                .entry(request)
                .or_default()
                .push_back(TestRpcResponse::Value(response));
            self
        }

        /// Appends a deterministic client error for the given RPC request type.
        pub fn with_error(self, request: RpcRequest, message: &str) -> Self {
            self.responses
                .lock()
                .unwrap()
                .entry(request)
                .or_default()
                .push_back(TestRpcResponse::Error(message.to_owned()));
            self
        }

        /// Returns all requests recorded by this sender in call order.
        pub fn requests(&self) -> Vec<(RpcRequest, Value)> {
            self.requests.lock().unwrap().clone()
        }
    }

    /// Encodes an optional account as a `getAccountInfo` JSON response.
    pub fn account_response(account: Option<&Account>) -> Value {
        json!({
            "context": { "slot": 1, "apiVersion": null },
            "value": account.map(account_value)
        })
    }

    /// Encodes optional accounts as a `getMultipleAccounts` JSON response.
    pub fn multiple_accounts_response(accounts: &[Option<&Account>]) -> Value {
        json!({
            "context": { "slot": 1, "apiVersion": null },
            "value": accounts.iter().map(|account| account.map(account_value)).collect::<Vec<_>>()
        })
    }

    /// Encodes raw token balances as a `getTokenLargestAccounts` response.
    pub fn token_largest_accounts_response(accounts: &[(Pubkey, &str)]) -> Value {
        json!({
            "context": { "slot": 1, "apiVersion": null },
            "value": accounts.iter().map(|(address, amount)| json!({
                "address": address.to_string(),
                "amount": amount,
                "decimals": 0,
                "uiAmount": amount.parse::<f64>().ok(),
                "uiAmountString": amount
            })).collect::<Vec<_>>()
        })
    }

    fn account_value(account: &Account) -> Value {
        serde_json::to_value(encode_ui_account(
            &Pubkey::default(),
            account,
            UiAccountEncoding::Base64,
            None,
            None,
        ))
        .unwrap()
    }

    #[async_trait]
    impl RpcSender for TestRpcSender {
        async fn send(&self, request: RpcRequest, params: Value) -> ClientResult<Value> {
            self.requests
                .lock()
                .unwrap()
                .push((request, params.clone()));
            if let Some(response) = self
                .responses
                .lock()
                .unwrap()
                .get_mut(&request)
                .and_then(VecDeque::pop_front)
            {
                return match response {
                    TestRpcResponse::Value(value) => Ok(value),
                    TestRpcResponse::Error(message) => Err(ClientError::new_with_request(
                        ClientErrorKind::Custom(message),
                        request,
                    )),
                };
            }
            Ok(match request {
                RpcRequest::GetSlot => self.slot_response.clone(),
                RpcRequest::GetAccountInfo => json!({
                    "context": { "slot": 1, "apiVersion": null },
                    "value": null
                }),
                RpcRequest::GetMultipleAccounts => {
                    let account_count = params.get(0).and_then(Value::as_array).map_or(0, Vec::len);
                    json!({
                        "context": { "slot": 1, "apiVersion": null },
                        "value": vec![Value::Null; account_count]
                    })
                }
                _ => Value::Null,
            })
        }

        fn get_transport_stats(&self) -> RpcTransportStats {
            RpcTransportStats::default()
        }

        fn url(&self) -> String {
            self.endpoint.clone()
        }
    }
}
