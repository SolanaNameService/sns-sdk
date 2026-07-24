use indicatif::{ProgressBar, ProgressState, ProgressStyle};
use std::fmt::Write;

pub(crate) fn display_reverse_domain(domain: &str) -> String {
    if domain.ends_with(".sns") {
        domain.to_string()
    } else {
        format!("{domain}.sns")
    }
}

pub(crate) fn make_tx_url(sig: &str) -> String {
    format!("https://explorer.solana.com/tx/{sig}")
}

pub(crate) fn progress_bar(len: usize) -> ProgressBar {
    let pb = ProgressBar::new(len as u64);
    pb.set_style(
        ProgressStyle::with_template(
            "{spinner:.green} [{elapsed_precise}] [{wide_bar:.cyan/blue}] ({eta})",
        )
        .unwrap()
        .with_key("eta", |state: &ProgressState, w: &mut dyn Write| {
            write!(w, "{:.1}s", state.eta().as_secs_f64()).unwrap()
        })
        .progress_chars("#>-"),
    );
    pb
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn display_reverse_domain_adds_sns_suffix_once() {
        assert_eq!(display_reverse_domain("bonfida"), "bonfida.sns");
        assert_eq!(display_reverse_domain("bonfida.sns"), "bonfida.sns");
    }
}
