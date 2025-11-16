import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/components/AuthProvider';
import { DebateProvider } from '@/components/DebateProvider';
import { View, Text } from 'react-native';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <DebateProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="auth"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="+not-found"
            options={{
              title: 'Oops!',
              headerShown: true,
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </DebateProvider>
    </AuthProvider>
  );
}

// Error Boundary
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 10 }}>Something went wrong!</Text>
      <Text style={{ color: '#666' }}>{error.message}</Text>
    </View>
  );
}