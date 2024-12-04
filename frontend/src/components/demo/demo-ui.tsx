"use client";

import {
  useDemoProgram, useTodoListProgramAccount
} from "./demo-data-access";
import { ellipsify } from "../ui/ui-layout";
import { ExplorerLink } from "../cluster/cluster-ui";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";

export function TodoListCreate() {
  const { createTodoList } = useDemoProgram();
  const { publicKey } = useWallet();
  const [date_str, setTitle] = useState("");

const isFormValid = /^\d{4}-\d{2}-\d{2}$/.test(date_str.trim());

  const handleSubmit = () => {
    if (publicKey && isFormValid) {
        createTodoList.mutateAsync({ date_str, owner: publicKey });
    }
  };

  if (!publicKey) {
    return <p>Connect your wallet</p>;
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Todo List Date"
        value={date_str}
        onChange={(e) => setTitle(e.target.value)}
        className="input input-bordered w-full max-w-xs"
      />
      <br></br>
      <br></br>
      <button
        className="btn btn-xs lg:btn-md btn-primary"
        onClick={handleSubmit}
        disabled={createTodoList.isPending || !isFormValid}
      >
        Create New TodoList {createTodoList.isPending && "..."}
      </button>
    </div>
  );
}

export function TodoListAll() {
  const { accounts, getProgramAccount } = useDemoProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="flex justify-center alert alert-info">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className={"space-y-6"}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {accounts.data?.map((account) => (
            <TodoListCard
              key={account.publicKey.toString()}
              account={account.publicKey}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={"text-2xl"}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  );
}

function TodoListCard({ account }: { account: PublicKey }) {
  const { todoListQuery } = useTodoListProgramAccount({
    account,
  });
  const { publicKey } = useWallet();

  if (!publicKey) {
    return <p>Connect your wallet</p>;
  }

  return todoListQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <h2
            className="card-title justify-center text-3xl cursor-pointer"
            onClick={() => todoListQuery.refetch()}
          >
            {new TextDecoder().decode(new Uint8Array(todoListQuery.data?.date || []))}
          </h2>
          <div className="text-center space-y-4">
            <p>
              <ExplorerLink
                path={`account/${account}`}
                label={ellipsify(account.toString())}
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}