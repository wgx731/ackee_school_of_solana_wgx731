use anchor_lang::prelude::*;

use crate::errors::TodoListError;
use crate::states::*;

pub fn add_todo(ctx: Context<AddTodo>, todo_content: String) -> Result<()> {
    let todo = &mut ctx.accounts.todo;

    require!(
        todo_content.as_bytes().len() <= TODO_CONTENT_LENGTH,
        TodoListError::TodoContentTooLong
    );

    todo.todo_author = ctx.accounts.todo_author.key();
    todo.parent_list = ctx.accounts.todo_list.key();
    let mut todo_content_data = [0u8; TODO_CONTENT_LENGTH];
    todo_content_data[..todo_content.as_bytes().len()].copy_from_slice(todo_content.as_bytes());
    todo.content = todo_content_data;
    let content_size :u16 = todo_content.as_bytes().len() as u16;
    todo.content_length = content_size;
    todo.is_done = TodoType::NotDone;
    todo.bump = ctx.bumps.todo;

    Ok(())
}

#[derive(Accounts)]
#[instruction(todo_content: String)]
pub struct AddTodo<'info> {
    #[account(mut)]
    pub todo_author: Signer<'info>,
    #[account(
        init,
        payer = todo_author,
        space = 8 + Todo::LEN,
        seeds = [
            TODO_SEED.as_bytes(),
            todo_author.key().as_ref(),
            {anchor_lang::solana_program::hash::hash(todo_content.as_bytes()).to_bytes().as_ref()},
            todo_list.key().as_ref(),
            ],
        bump)]
    pub todo: Account<'info, Todo>,

    #[account(mut, seeds = [
        todo_list.date[..DATE_LENGTH as usize].as_ref(), 
        TODO_LIST_SEED.as_bytes(),
        todo_list.list_author.key().as_ref(),
    ], bump = todo_list.bump)]
    pub todo_list: Account<'info, TodoList>,
    pub system_program: Program<'info, System>,
}
