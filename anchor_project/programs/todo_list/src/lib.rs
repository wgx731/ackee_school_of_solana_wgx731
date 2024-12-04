use crate::instructions::*;
use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod states;

declare_id!("CgigwV8UUzQiRHaMMgmXJ1u9bmq36xiASqjJRqKZgaWE");

#[program]
pub mod todo_list {
    use super::*;

    pub fn initialize(ctx: Context<InitializeTodoList>, date_str: String) -> Result<()> {
        initialize_todo_list(ctx, date_str)
    }

    pub fn create_todo(ctx: Context<AddTodo>, todo_content: String) -> Result<()> {
        add_todo(ctx, todo_content)
    }

    pub fn delete_todo(ctx: Context<RemoveTodo>) -> Result<()> {
        remove_todo(ctx)
    }
}
