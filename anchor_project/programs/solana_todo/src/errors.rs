use anchor_lang::prelude::*;

#[error_code]
pub enum SolanaToError {
    #[msg("Cannot initialize, to do task too long")]
    TaskTooLong,
    #[msg("Cannot initialize, invalid date")]
    InvalidDate,
}
