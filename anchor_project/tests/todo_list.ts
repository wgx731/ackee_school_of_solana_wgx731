import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TodoList } from "../target/types/todo_list";
import { PublicKey } from '@solana/web3.js';
import { assert } from "chai";
import crypto from "crypto";

const TODO_LIST_SEED = "TODO_LIST_SEED";
const TODO_SEED = "TODO_SEED";

describe("todo_list", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TodoList as Program<TodoList>;

  const bob = anchor.web3.Keypair.generate();
  const alice = anchor.web3.Keypair.generate();

  const date_bob1 = "2024-01-01";
  const date_bob2 = "2024-01-022";
  const date_bob3 = "2024-01-xx";

  const todo_bob1 = "Buy Milk";
  const todo_bob2 = "Walk the dog";

  const date_alice1 = "2030-01-02";
  const date_alice2 = "1999-01-02";

  const todo_alice = "Buy Bread";

  describe("TodoList", async () => {
    it("initialize todo - success", async () => {
      await airdrop(provider.connection, bob.publicKey)
      const [list_pkey, list_bump] = getTodoListAddress(date_bob1, bob.publicKey, program.programId)

      await program.methods.initialize(date_bob1).accounts(
        {
          listAuthority: bob.publicKey,
          todoList: list_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([bob]).rpc({ commitment: "confirmed" })

      await checkTodoList(
        program, list_pkey, bob.publicKey, date_bob1, 0, list_bump
      )
    });
    it("initialize date longer than 10 bytes - fail", async () => {
      let should_fail = "This Should Fail"
      try {
        const [list_pkey, list_bump] = getTodoListAddress(date_bob2, bob.publicKey, program.programId)

        await program.methods.initialize(date_bob2).accounts(
          {
            listAuthority: bob.publicKey,
            todoList: list_pkey,
            systemProgram: anchor.web3.SystemProgram.programId
          }
        ).signers([bob]).rpc({ commitment: "confirmed" })
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "InvalidDate")
        should_fail = "Failed"
      }
      assert.strictEqual(should_fail, "Failed")
    });
    it("initialize invalid date - fail", async () => {
      let should_fail = "This Should Fail"
      try {
        const [list_pkey, list_bump] = getTodoListAddress(date_bob3, bob.publicKey, program.programId)

        await program.methods.initialize(date_bob3).accounts(
          {
            listAuthority: bob.publicKey,
            todoList: list_pkey,
            systemProgram: anchor.web3.SystemProgram.programId
          }
        ).signers([bob]).rpc({ commitment: "confirmed" })
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs)
        assert.strictEqual(err.error.errorCode.code, "InvalidDate")
        should_fail = "Failed"
      }
      assert.strictEqual(should_fail, "Failed")
    });
    it("Alice create normal todo list - success", async () => {
      await airdrop(provider.connection, alice.publicKey)
      const [list_pkey, list_bump] = getTodoListAddress(date_alice1, alice.publicKey, program.programId)
      await program.methods.initialize(date_alice1).accounts(
        {
          listAuthority: alice.publicKey,
          todoList: list_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([alice]).rpc({ commitment: "confirmed" })
      await checkTodoList(
        program, list_pkey, alice.publicKey, date_alice1, 0, list_bump
      )
    });
    it("Alice create expired todo list - success", async () => {
      await airdrop(provider.connection, alice.publicKey)
      const [list_pkey, list_bump] = getTodoListAddress(date_alice2, alice.publicKey, program.programId)
      await program.methods.initialize(date_alice2).accounts(
        {
          listAuthority: alice.publicKey,
          todoList: list_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([alice]).rpc({ commitment: "confirmed" })
      await checkTodoList(
        program, list_pkey, alice.publicKey, date_alice2, 0, list_bump
      )
    });
  });
  describe("Bob Todo", async () => {
    it("Bob add first todo - success", async () => {
      await airdrop(provider.connection, bob.publicKey)
      const [list_pkey, list_bump] = getTodoListAddress(date_bob1, bob.publicKey, program.programId)
      const [todo_pkey, todo_bump] = getTodoAddress(todo_bob1, bob.publicKey, list_pkey, program.programId)
      await program.methods.createTodo(todo_bob1).accounts(
        {
          todoAuthor: bob.publicKey,
          todo: todo_pkey,
          todoList: list_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([bob]).rpc({ commitment: "confirmed" })
      await checkTodo(
        program, todo_pkey, bob.publicKey, list_pkey, todo_bob1, todo_bump 
      )
      await checkTodoList(
        program, list_pkey, bob.publicKey, date_bob1, 1, list_bump
      )
    });
    it("Bob add second todo - success", async () => {
      await airdrop(provider.connection, bob.publicKey)
      const [list_pkey, list_bump] = getTodoListAddress(date_bob1, bob.publicKey, program.programId)
      const [todo_pkey, todo_bump] = getTodoAddress(todo_bob2, bob.publicKey, list_pkey, program.programId)
      await program.methods.createTodo(todo_bob2).accounts(
        {
          todoAuthor: bob.publicKey,
          todo: todo_pkey,
          todoList: list_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([bob]).rpc({ commitment: "confirmed" })
      await checkTodo(
        program, todo_pkey, bob.publicKey, list_pkey, todo_bob2, todo_bump 
      )
      await checkTodoList(
        program, list_pkey, bob.publicKey, date_bob1, 2, list_bump
      )
    });
    it("Bob add same todo - fail", async () => {
      let should_fail = "This Should Fail"
      await airdrop(provider.connection, bob.publicKey)
      const [list_pkey, list_bump] = getTodoListAddress(date_bob1, bob.publicKey, program.programId)
      const [todo_pkey, todo_bump] = getTodoAddress(todo_bob2, bob.publicKey, list_pkey, program.programId)
      try {
        await program.methods.createTodo(todo_bob2).accounts(
          {
            todoAuthor: bob.publicKey,
            todo: todo_pkey,
            todoList: list_pkey,
            systemProgram: anchor.web3.SystemProgram.programId
          }
        ).signers([bob]).rpc({ commitment: "confirmed" })
      } catch (error) {
        assert.isTrue(SolanaError.contains(error.logs, "already in use"), error.logs)
        should_fail = "Failed"
      }
      assert.strictEqual(should_fail, "Failed")
    });
    it("Bob remove second todo - success", async () => {
      await airdrop(provider.connection, bob.publicKey)
      const [list_pkey, list_bump] = getTodoListAddress(date_bob1, bob.publicKey, program.programId)
      const [todo_pkey, todo_bump] = getTodoAddress(todo_bob2, bob.publicKey, list_pkey, program.programId)
      await program.methods.deleteTodo().accounts(
        {
          todoAuthor: bob.publicKey,
          todo: todo_pkey,
          todoList: list_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([bob]).rpc({ commitment: "confirmed" })
      await checkTodoList(
        program, list_pkey, bob.publicKey, date_bob1, 1, list_bump
      )
    });
    it("Alice remove Bob's first todo - fail", async () => {
      let should_fail = "This Should Fail"
      await airdrop(provider.connection, alice.publicKey)
      const [list_pkey, list_bump] = getTodoListAddress(date_bob1, bob.publicKey, program.programId)
      const [todo_pkey, todo_bump] = getTodoAddress(todo_bob1, bob.publicKey, list_pkey, program.programId)
      try {
        await program.methods.deleteTodo().accounts(
          {
            todoAuthor: alice.publicKey,
            todo: todo_pkey,
            todoList: list_pkey,
            systemProgram: anchor.web3.SystemProgram.programId
          }
        ).signers([alice]).rpc({ commitment: "confirmed" })
      } catch (error) {
        assert.isTrue(SolanaError.contains(error.logs, "ConstraintSeeds"), error.logs)
        should_fail = "Failed"
      }
      assert.strictEqual(should_fail, "Failed")
    });
  });
  describe("Alice Todo", async () => {
    it("Alice add todo to normal todo list - success", async () => {
      await airdrop(provider.connection, alice.publicKey)
      const [list_pkey, list_bump] = getTodoListAddress(date_alice1, alice.publicKey, program.programId)
      const [todo_pkey, todo_bump] = getTodoAddress(todo_alice, alice.publicKey, list_pkey, program.programId)
      await program.methods.createTodo(todo_alice).accounts(
        {
          todoAuthor: alice.publicKey,
          todo: todo_pkey,
          todoList: list_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([alice]).rpc({ commitment: "confirmed" })
      await checkTodo(
        program, todo_pkey, alice.publicKey, list_pkey, todo_alice, todo_bump 
      )
      await checkTodoList(
        program, list_pkey, alice.publicKey, date_alice1, 1, list_bump
      )
    });
    it("Alice add todo to expired todo list - success", async () => {
      await airdrop(provider.connection, alice.publicKey)
      const [list_pkey, list_bump] = getTodoListAddress(date_alice2, alice.publicKey, program.programId)
      const [todo_pkey, todo_bump] = getTodoAddress(todo_alice, alice.publicKey, list_pkey, program.programId)
      await program.methods.createTodo(todo_alice).accounts(
        {
          todoAuthor: alice.publicKey,
          todo: todo_pkey,
          todoList: list_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([alice]).rpc({ commitment: "confirmed" })
      await checkTodo(
        program, todo_pkey, alice.publicKey, list_pkey, todo_alice, todo_bump 
      )
      await checkTodoList(
        program, list_pkey, alice.publicKey, date_alice2, 1, list_bump
      )
    });
    it("Alice mark normal list todo as not done - fail", async () => {
      let should_fail = "This Should Fail"
      await airdrop(provider.connection, alice.publicKey)
      const [list_pkey, list_bump] = getTodoListAddress(date_alice1, alice.publicKey, program.programId)
      const [todo_pkey, todo_bump] = getTodoAddress(todo_alice, alice.publicKey, list_pkey, program.programId)
      try {
        await program.methods.markTodoNotDone().accounts(
          {
            todoAuthor: alice.publicKey,
            todo: todo_pkey,
            todoList: list_pkey,
            systemProgram: anchor.web3.SystemProgram.programId
          }
        ).signers([alice]).rpc({ commitment: "confirmed" })
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs)
        assert.strictEqual(err.error.errorCode.code, "AlreadyNotDone")
        should_fail = "Failed"
      }
      assert.strictEqual(should_fail, "Failed")
    });
    it("Alice mark normal list todo as done - success", async () => {
      await airdrop(provider.connection, alice.publicKey)
      const [list_pkey, list_bump] = getTodoListAddress(date_alice1, alice.publicKey, program.programId)
      const [todo_pkey, todo_bump] = getTodoAddress(todo_alice, alice.publicKey, list_pkey, program.programId)
      await program.methods.markTodoDone().accounts(
        {
          todoAuthor: alice.publicKey,
          todo: todo_pkey,
          todoList: list_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([alice]).rpc({ commitment: "confirmed" })
    });
    it("Alice mark normal list todo as done again - fail", async () => {
      let should_fail = "This Should Fail"
      await airdrop(provider.connection, alice.publicKey)
      const [list_pkey, list_bump] = getTodoListAddress(date_alice1, alice.publicKey, program.programId)
      const [todo_pkey, todo_bump] = getTodoAddress(todo_alice, alice.publicKey, list_pkey, program.programId)
      try {
        await program.methods.markTodoDone().accounts(
          {
            todoAuthor: alice.publicKey,
            todo: todo_pkey,
            todoList: list_pkey,
            systemProgram: anchor.web3.SystemProgram.programId
          }
        ).signers([alice]).rpc({ commitment: "confirmed" })
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs)
        assert.strictEqual(err.error.errorCode.code, "AlreadyDone")
        should_fail = "Failed"
      }
      assert.strictEqual(should_fail, "Failed")
    });
    it("Alice mark expired list todo as done - fail", async () => {
      let should_fail = "This Should Fail"
      await airdrop(provider.connection, alice.publicKey)
      const [list_pkey, list_bump] = getTodoListAddress(date_alice2, alice.publicKey, program.programId)
      const [todo_pkey, todo_bump] = getTodoAddress(todo_alice, alice.publicKey, list_pkey, program.programId)
      try {
        await program.methods.markTodoDone().accounts(
          {
            todoAuthor: alice.publicKey,
            todo: todo_pkey,
            todoList: list_pkey,
            systemProgram: anchor.web3.SystemProgram.programId
          }
        ).signers([alice]).rpc({ commitment: "confirmed" })
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs)
        assert.strictEqual(err.error.errorCode.code, "AlreadyExpired")
        should_fail = "Failed"
      }
      assert.strictEqual(should_fail, "Failed")
    });
  });
});


function getTodoAddress(todo_content: string, author: PublicKey, parent_list: PublicKey, programID: PublicKey) {
  let hexString = crypto.createHash('sha256').update(todo_content, 'utf-8').digest('hex');
  let content_seed = Uint8Array.from(Buffer.from(hexString, 'hex'));
  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(TODO_SEED),
      author.toBuffer(),
      content_seed,
      parent_list.toBuffer(),
    ], programID);
}

function getTodoListAddress(date_str: string, author: PublicKey, programID: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(date_str),
      anchor.utils.bytes.utf8.encode(TODO_LIST_SEED),
      author.toBuffer()
    ], programID);
}

async function checkTodoList(
  program: anchor.Program<TodoList>,
  list: PublicKey,
  list_author?: PublicKey,
  date?: string,
  todos_count?: number,
  bump?: number,
) {
  let listData = await program.account.todoList.fetch(list);
  if (list_author) {
    assert.strictEqual(listData.listAuthor.toString(), list_author.toString())

  }
  if (date) {
    const utf8ByteArray_date = stringToUtf8ByteArray(date);
    assert.strictEqual(listData.date.toString(), utf8ByteArray_date.toString());
  }
  if (todos_count) {
    assert.strictEqual(listData.todosCount.toString(), new anchor.BN(todos_count).toString())
  }
  if (bump) {
    assert.strictEqual(listData.bump.toString(), bump.toString())

  }
}


async function checkTodo(
  program: anchor.Program<TodoList>,
  todo: PublicKey,
  todo_author?: PublicKey,
  parent_list?: PublicKey,
  content?: string,
  bump?: number,
) {
  let todoData = await program.account.todo.fetch(todo);

  if (todo_author) {
    assert.strictEqual(todoData.todoAuthor.toString(), todo_author.toString())
  }
  if (parent_list) {
    assert.strictEqual(todoData.parentList.toString(), parent_list.toString())
  }
  if (content) {
    const utf8ByteArray_content = stringToUtf8ByteArray(content);
    const paddedByteArray_content = padByteArrayWithZeroes(utf8ByteArray_content, 500);
    assert.strictEqual(todoData.content.toString(), paddedByteArray_content.toString())
    assert.strictEqual(todoData.contentLength.toString(), utf8ByteArray_content.length.toString())

  }
  if (bump) {
    assert.strictEqual(todoData.bump.toString(), bump.toString())
  }
}

/*
  Helper functions
*/ 
async function airdrop(connection: any, address: any, amount = 1000000000) {
  await connection.confirmTransaction(await connection.requestAirdrop(address, amount), "confirmed");
}

function stringToUtf8ByteArray(inputString: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(inputString);
}

// Function to pad a byte array with zeroes to a specified length
function padByteArrayWithZeroes(byteArray: Uint8Array, length: number): Uint8Array {
  if (byteArray.length >= length) {
    return byteArray;
  }

  const paddedArray = new Uint8Array(length);
  paddedArray.set(byteArray, 0);
  return paddedArray;
}

class SolanaError {
  static contains(logs, error): boolean {
    const match = logs?.filter(s => s.includes(error));
    return Boolean(match?.length)
  }
}