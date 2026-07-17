#[cfg(test)]
pub mod test {
    use {
        async_trait::async_trait,
        rand::Rng,
        serde_json::{json, Value},
        solana_client::{
            client_error::Result as ClientResult,
            rpc_request::RpcRequest,
            rpc_sender::{RpcSender, RpcTransportStats},
        },
        std::sync::{Arc, Mutex},
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
    }

    impl TestRpcSender {
        /// Creates a recording sender for an endpoint and `getSlot` response.
        pub fn new(endpoint: &str, slot_response: Value) -> Self {
            Self {
                endpoint: endpoint.to_owned(),
                slot_response,
                requests: Arc::default(),
            }
        }

        /// Returns all requests recorded by this sender in call order.
        pub fn requests(&self) -> Vec<(RpcRequest, Value)> {
            self.requests.lock().unwrap().clone()
        }
    }

    #[async_trait]
    impl RpcSender for TestRpcSender {
        async fn send(&self, request: RpcRequest, params: Value) -> ClientResult<Value> {
            self.requests
                .lock()
                .unwrap()
                .push((request, params.clone()));
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
