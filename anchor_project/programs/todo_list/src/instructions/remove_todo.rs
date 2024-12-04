use anchor_lang::prelude::*;

use crate::errors::TodoListError;
use crate::states::*;

pub fn remove_todo(_ctx: Context<RemoveTodo>) -> Result<()> {
    let parent_list = &mut _ctx.accounts.todo_list;

    if parent_list.todos_count == 0 {
        return Err(TodoListError::MinTodoReached.into());
    }
    parent_list.todos_count = parent_list.todos_count.checked_sub(1).ok_or(TodoListError::MinTodoReached)?;

    Ok(())
}
#[derive(Accounts)]
pub struct RemoveTodo<'info> {
    #[account(mut)]
    pub todo_author: Signer<'info>,
    #[account(
        mut,
        close=todo_author,
        seeds = [
            TODO_SEED.as_bytes(),
            todo_author.key().as_ref(),
            {anchor_lang::solana_program::hash::hash(todo.content[..todo.content_length as usize].as_ref()).to_bytes().as_ref()},
            todo.parent_list.key().as_ref(),
            ],
        bump = todo.bump)]
    pub todo: Account<'info, Todo>,

    #[account(mut, seeds = [
        todo_list.date[..DATE_LENGTH as usize].as_ref(), 
        TODO_LIST_SEED.as_bytes(),
        todo_list.list_author.key().as_ref(),
    ], bump = todo_list.bump)]
    pub todo_list: Account<'info, TodoList>,
}
