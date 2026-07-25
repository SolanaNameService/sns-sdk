pub(crate) mod burn;
pub(crate) mod count;
pub(crate) mod domains;
pub(crate) mod primary_domain;
pub(crate) mod record_v2;
pub(crate) mod registration;
pub(crate) mod sub_registrar;
pub(crate) mod transfer;

pub(crate) type CliResult = Result<(), Box<dyn std::error::Error>>;
