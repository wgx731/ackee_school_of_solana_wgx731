use anchor_lang::prelude::*;

declare_id!("3JTSquHUe15fgGsCsnjT6H9TXKno1jZ3ZDS8d9xnaxUu");

#[program]
pub mod solana_todo {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
