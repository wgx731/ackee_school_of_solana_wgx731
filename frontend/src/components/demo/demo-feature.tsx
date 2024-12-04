
'use client';

import {
  useDemoProgram,
} from "./demo-data-access";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import { TodoListCreate } from './demo-ui';

export default function DemoFeature() {
  const { publicKey } = useWallet();
  const { programId } = useDemoProgram();

  return publicKey ? (
    <div>
      <AppHero
        title="My Solana Todo List"
        subtitle={
          'Create your todo list here!'
        }
      >
        <p className="mb-6">
          <ExplorerLink
            path={`account/${programId}`}
            label={ellipsify(programId.toString())}
          />
        </p>
        <TodoListCreate />
      </AppHero>
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  );
}
