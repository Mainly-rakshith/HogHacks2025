export function useMessages(debateId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('debate_id', debateId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (isMounted) setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMessages();

    const subscription = supabase
      .channel(`debate:${debateId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `debate_id=eq.${debateId}`,
        },
        (payload) => {
          if (isMounted) {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [debateId]);

  return { messages, loading };
}
