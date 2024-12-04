use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;
use chrono::NaiveDate;

use crate::errors::TodoListError;
use crate::states::*;

pub fn mark_todo_status(ctx: Context<MarkTodoStatus>, status: StatusType) -> Result<()> {
    let todo = &mut ctx.accounts.todo;
    let parent_list = &mut ctx.accounts.todo_list;

    let clock = Clock::get()?;
    let current_timestamp = clock.unix_timestamp as u64;

    let date_str = std::str::from_utf8(&parent_list.date).unwrap();
    let naive_datetime = NaiveDate::parse_from_str(date_str, "%Y-%m-%d")
    .unwrap()
    .and_hms_milli_opt(0, 0, 0, 0)
    .unwrap()
    .and_utc();
    let date_timestamp = naive_datetime.timestamp() as u64;

    require!(
        current_timestamp < date_timestamp, 
        TodoListError::AlreadyExpired,
    );

    match status {
        StatusType::Done => {
            require!(
                todo.status != StatusType::Done, 
                TodoListError::AlreadyDone,
            );
            todo.status = StatusType::Done;
        },
        StatusType::NotDone => {
            require!(
                todo.status != StatusType::NotDone, 
                TodoListError::AlreadyNotDone,
            );
            todo.status = StatusType::NotDone;
        },
    };

    Ok(())
}
#[derive(Accounts)]
pub struct MarkTodoStatus<'info> {
    #[account(mut)]
    pub todo_author: Signer<'info>,
    #[account(
        mut,
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
