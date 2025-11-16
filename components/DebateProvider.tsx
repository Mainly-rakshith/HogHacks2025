import { createContext, useContext, ReactNode } from 'react';
import { useDebates } from '@/lib/hooks/useDebates';
import type { Debate } from '@/lib/supabase';

type DebateContextType = {
  debates: Debate[];
  loading: boolean;
  joinDebate: (debateId: string, role: 'pro' | 'con' | 'voter') => Promise<void>;
  sendMessage: (debateId: string, content: string, role: 'pro' | 'con' | 'voter') => Promise<void>;
  castVote: (debateId: string, votePro: boolean) => Promise<void>;
};

const DebateContext = createContext<DebateContextType | undefined>(undefined);

export function DebateProvider({ children }: { children: ReactNode }) {
  const debates = useDebates();

  return (
    <DebateContext.Provider value={debates}>
      {children}
    </DebateContext.Provider>
  );
}

export function useDebateContext() {
  const context = useContext(DebateContext);
  if (context === undefined) {
    throw new Error('useDebateContext must be used within a DebateProvider');
  }
  return context;
}