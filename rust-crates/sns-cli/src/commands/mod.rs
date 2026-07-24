pub(crate) mod count;
pub(crate) mod domains;
pub(crate) mod ownership;
pub(crate) mod record_v2;
pub(crate) mod registration;
pub(crate) mod sub_registrar;

pub(crate) type CliResult = Result<(), Box<dyn std::error::Error>>;
