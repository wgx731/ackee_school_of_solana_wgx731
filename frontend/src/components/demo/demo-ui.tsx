"use client";

import {
  useDemoProgram,
} from "./demo-data-access";
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