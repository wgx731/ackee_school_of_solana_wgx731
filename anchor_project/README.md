# Solana Todo List Anchor Backend

## Project Description

The todo_list project is used for people to track their todo items.

The todo list project allow people create a todo list for one day, then you can add todo / remove todo / mark todo as done for that day.

## Project Feature

1. create a todo list for a day and only one todo list for one day
2. create todo item with task name in the todo list, same task name is not allowed 
3. for each todo item you can mark todo item as done or not done if current date is before todo list date
4. todo item can only be marked as done if it's not done, vice versa

## Devnet Program

https://solana.fm/address/CgigwV8UUzQiRHaMMgmXJ1u9bmq36xiASqjJRqKZgaWE/transactions?cluster=devnet-solana

## Build Instruction

1. generate a new keypair file and save as `id.json` and get the public key address as updated program id
2. update `Anchor.toml` with updated program id 
3. update `programs/todo_list/src/libs.rs` with the updated program id
4. run `anchor test` to see the test output