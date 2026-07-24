use std::process::Command;

#[test]
fn handler_errors_return_a_nonzero_exit_status() {
    let output = Command::new(env!("CARGO_BIN_EXE_sns"))
        .args(["reverse-lookup", "definitely-not-a-pubkey"])
        .output()
        .expect("run sns binary");

    assert!(!output.status.success());
    assert!(String::from_utf8_lossy(&output.stderr).contains("Error:"));
}
