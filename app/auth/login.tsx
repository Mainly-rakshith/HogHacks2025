import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/components/AuthProvider';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuthContext();
  const router = useRouter();

  async function handleLogin() {
    try {
      setError(null);
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Login failed');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Log In</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, flex: 1, justifyContent: 'center' },
  title: { fontSize: 28, marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 8, borderRadius: 6 },
  button: { backgroundColor: '#333', padding: 14, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center' },
  error: { color: 'red', marginBottom: 10 }
});
