import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { User } from '../supabase';

export function useLeaderboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  let isMounted = true;

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('points', { ascending: false })
        .limit(10);

      if (error) throw error;
      if (isMounted) setUsers(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchLeaderboard();

  const subscription = supabase
    .channel('public:users')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'users',
    }, () => {
      fetchLeaderboard();
    })
    .subscribe();

  return () => {
    isMounted = false;
    subscription.unsubscribe();
  };
}, []);
