export function useAIModeration() {
  const moderateMessage = useCallback(async (message: string) => {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/moderate-message`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ message }),
      }
    );

    if (!response.ok) throw new Error('Moderation request failed');
    const result = await response.json();
    return result.isAppropriate;
  }, []);

  return { moderateMessage };
}
