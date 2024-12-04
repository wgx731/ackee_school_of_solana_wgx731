use anchor_lang::prelude::*;

use crate::errors::TodoListError;
use crate::states::*;

pub fn initialize_todo_list(
    ctx: Context<InitializeTodoList>,
    date_str: String,
) -> Result<()> {
    let initialized_todo_list = &mut ctx.accounts.todo_list;
    require!(
        validate_date_format(&date_str),
        TodoListError::InvalidDate
    );

    initialized_todo_list.list_author = ctx.accounts.list_authority.key();
    let mut date_data = [0u8; DATE_LENGTH];
    date_data[..DATE_LENGTH].copy_from_slice(date_str.as_bytes());
    initialized_todo_list.date = date_data;
    initialized_todo_list.todos_count = 0;
    initialized_todo_list.bump = ctx.bumps.todo_list;
    Ok(())
}

#[derive(Accounts)]
#[instruction(date_str: String)]
pub struct InitializeTodoList<'info> {
    #[account(mut)]
    pub list_authority: Signer<'info>,
    #[account(
        init,
        payer = list_authority,
        space = 8 + TodoList::LEN,
        seeds = [
            date_str.as_bytes(),
            TODO_LIST_SEED.as_bytes(),
            list_authority.key().as_ref()
            ],
        bump)]
    pub todo_list: Account<'info, TodoList>,
    pub system_program: Program<'info, System>,
}

fn validate_date_format(date: &str) -> bool {
    if date.len() != DATE_LENGTH {
        return false;
    }

    let parts: Vec<&str> = date.split('-').collect();
    if parts.len() != 3 {
        return false;
    }

    let year = parts[0].parse::<u32>();
    let month = parts[1].parse::<u32>();
    let day = parts[2].parse::<u32>();

    match (year, month, day) {
        (Ok(y), Ok(m), Ok(d)) => {
            y >= 1900 && y <= 9999 && 
            m >= 1 && m <= 12 && 
            d >= 1 && d <= 31
        }
        _ => false
    }
}