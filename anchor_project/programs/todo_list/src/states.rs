use anchor_lang::prelude::*;

pub const DATE_LENGTH: usize = 10;
pub const TODO_CONTENT_LENGTH: usize = 500;

pub const TODO_LIST_SEED: &str = "TODO_LIST_SEED";
pub const TODO_SEED: &str = "TODO_SEED";

#[derive(AnchorDeserialize, AnchorSerialize, Clone, PartialEq)]
pub enum StatusType {
    Done,
    NotDone,
}

#[account]
pub struct TodoList {
    pub list_author: Pubkey,
    pub date: [u8; DATE_LENGTH],
    pub todos_count: u64,
    pub bump: u8,
}

impl TodoList {
    pub const LEN: usize = 32 + DATE_LENGTH + 8 + 1;
}

#[account]
pub struct Todo {
    pub todo_author: Pubkey,
    pub parent_list: Pubkey,
    pub content: [u8; TODO_CONTENT_LENGTH],
    pub content_length: u16,
    pub status: StatusType,
    pub bump: u8,
}
impl Todo {
    pub const LEN: usize = 32 + 32 + TODO_CONTENT_LENGTH + 2 + 1 + 1;
}