import { Redirect } from 'expo-router';
import { useAuthContext } from '@/components/AuthProvider';

export default function Index() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  return <Redirect href="/(tabs)" />;
}