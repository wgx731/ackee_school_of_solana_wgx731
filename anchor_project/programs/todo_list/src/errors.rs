use anchor_lang::prelude::*;

#[error_code]
pub enum TodoListError {
    #[msg("cannot initialize, invalid date")]
    InvalidDate,
    #[msg("cannot create todo, content too long")]
    TodoContentTooLong,
    #[msg("cannot create todo, max todos reached")]
    MaxTodoReached,
    #[msg("cannot remove todo, no todos left")]
    MinTodoReached,
}
