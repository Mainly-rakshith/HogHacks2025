import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { User } from '../supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      if (session?.user) {
        await fetchUser(session.user.id);
      }
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        fetchUser(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function fetchUser(userId: string) {
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
    if (!error && data) {
      setUser(data);
    } else {
      setError('User record not found');
    }
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      throw new Error('Invalid login credentials');
    }
    await fetchUser(data.user.id);
  }

  async function signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) {
      throw new Error(error?.message || 'Signup failed');
    }

    const { error: dbErr } = await supabase.from('users').insert([
      { id: data.user.id, email, username, points: 0 }
    ]);

    if (dbErr) throw new Error(dbErr.message);
    await fetchUser(data.user.id);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return { user, loading, error, signIn, signUp, signOut };
}
