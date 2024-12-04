"use client";

import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Cluster, PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import { useTransactionToast } from "../ui/ui-layout";
import { useMemo } from "react";
import TodoListIDL from "./todo_list.json";
import type { TodoList } from "./todo_list";

interface CreateTodoListArgs {
  date_str: string;
  owner: PublicKey;
}

export function useDemoProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getDemoProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getDemoProgram(provider);

  const accounts = useQuery({
    queryKey: ["todo_list", "all", { cluster }],
    queryFn: () => program.account.todoList.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account", { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const createTodoList = useMutation<string, Error, CreateTodoListArgs>({
    mutationKey: ["todo_list", "create", { cluster }],
    mutationFn: async ({ date_str }) => {
      return program.methods.initialize(date_str).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to create todo list: ${error.message}`);
    },
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createTodoList,
  };
}

function getDemoProgram(provider: AnchorProvider) {
  return new Program(TodoListIDL as TodoList, provider);
}
  
const DEMO_PROGRAM_ID = new PublicKey(
  "CgigwV8UUzQiRHaMMgmXJ1u9bmq36xiASqjJRqKZgaWE"
);

function getDemoProgramId(cluster: Cluster) {
  switch (cluster) {
    case "devnet":
    case "testnet":
    case "mainnet-beta":
    default:
      return DEMO_PROGRAM_ID;
  }
}