import { View, Text, StyleSheet } from 'react-native';
import { useAuthContext } from '@/components/AuthProvider';

export default function ProfileTab() {
  const { user } = useAuthContext();

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Not logged in.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, {user.username}!</Text>
      <Text>Email: {user.email}</Text>
      <Text>Points: {user.points}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  message: { fontSize: 16, color: 'gray' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 }
});
