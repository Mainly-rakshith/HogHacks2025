import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { Debate } from '../supabase';

export function useDebates() {
  const [debates, setDebates] = useState<Debate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDebates();

    // Subscribe to changes
    const subscription = supabase
      .channel('public:debates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'debates'
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setDebates(prev => [...prev, payload.new as Debate]);
        } else if (payload.eventType === 'UPDATE') {
          setDebates(prev => 
            prev.map(debate => 
              debate.id === payload.new.id ? payload.new as Debate : debate
            )
          );
        } else if (payload.eventType === 'DELETE') {
          setDebates(prev => 
            prev.filter(debate => debate.id !== payload.old.id)
          );
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchDebates() {
    try {
      const { data, error } = await supabase
        .from('debates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDebates(data);
    } catch (error) {
      console.error('Error fetching debates:', error);
    } finally {
      setLoading(false);
    }
  }

  async function joinDebate(debateId: string, role: 'pro' | 'con' | 'voter') {
    const { error } = await supabase
      .from('debate_participants')
      .insert({
        debate_id: debateId,
        role,
      });

    if (error) throw error;
  }

  async function sendMessage(debateId: string, content: string, role: 'pro' | 'con' | 'voter') {
    const { error } = await supabase
      .from('messages')
      .insert({
        debate_id: debateId,
        content,
        role,
      });

    if (error) throw error;
  }

  async function castVote(debateId: string, votePro: boolean) {
    const { error } = await supabase
      .from('votes')
      .insert({
        debate_id: debateId,
        vote_pro: votePro,
      });

    if (error) throw error;
  }

  return {
    debates,
    loading,
    joinDebate,
    sendMessage,
    castVote,
  };
}