import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Animated } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Send, AlertCircle } from 'lucide-react-native';

function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const result = await someAsyncCall();
      if (isMounted) {
        setData(result);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return <Text>{data ? data.title : 'Loading...'}</Text>;
}

type Role = 'pro' | 'con' | 'voter';

type Message = {
  id: string;
  content: string;
  role: Role;
  timestamp: Date;
};

export default function DebateScreen() {
  const { id } = useLocalSearchParams();
  const [role, setRole] = useState<Role>();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isVoting, setIsVoting] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    // Simulate role assignment after 1 second
    const timer = setTimeout(() => {
      const roles: Role[] = ['pro', 'con', 'voter'];
      setRole(roles[Math.floor(Math.random() * roles.length)]);
    }, 1000);

    // Start spinning animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(spinValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Add some mock messages
    setMessages([
      {
        id: '1',
        content: 'Studies show that UBI can reduce poverty and improve mental health.',
        role: 'pro',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
      },
      {
        id: '2',
        content: 'The cost of implementing UBI would be astronomical and unsustainable.',
        role: 'con',
        timestamp: new Date(Date.now() - 1000 * 60 * 4),
      },
      {
        id: '3',
        content: 'Pilot programs in Finland showed promising results with improved well-being.',
        role: 'pro',
        timestamp: new Date(Date.now() - 1000 * 60 * 3),
      },
    ]);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const sendMessage = () => {
    if (!message.trim() || !role || role === 'voter') return;

    const newMessage = {
      id: Date.now().toString(),
      content: message.trim(),
      role,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage('');

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const getRoleColor = (messageRole: Role) => {
    switch (messageRole) {
      case 'pro':
        return '#3b82f6';
      case 'con':
        return '#ef4444';
      case 'voter':
        return '#64748b';
    }
  };

  if (!role) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Debate Room',
            headerShown: true,
          }}
        />
        <View style={styles.container}>
          <View style={styles.spinnerContainer}>
            <Animated.View
              style={[
                styles.spinner,
                {
                  transform: [{ rotate: spin }],
                },
              ]}>
              <Text style={styles.spinnerText}>?</Text>
            </Animated.View>
            <Text style={styles.loadingText}>Assigning your role...</Text>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Debate Room',
          headerShown: true,
        }}
      />
      <View style={styles.container}>
        <View style={[styles.roleBar, { backgroundColor: getRoleColor(role) }]}>
          <Text style={styles.roleText}>You are: {role.toUpperCase()}</Text>
          {role === 'voter' && (
            <Text style={styles.roleDescription}>
              Listen to both sides and vote at the end
            </Text>
          )}
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}>
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageContainer,
                {
                  alignSelf: msg.role === role ? 'flex-end' : 'flex-start',
                },
              ]}>
              <View
                style={[
                  styles.messageBubble,
                  {
                    backgroundColor: getRoleColor(msg.role),
                    borderTopLeftRadius: msg.role === role ? 20 : 4,
                    borderTopRightRadius: msg.role === role ? 4 : 20,
                  },
                ]}>
                <Text style={styles.messageText}>{msg.content}</Text>
              </View>
              <Text style={styles.timestamp}>
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          ))}
        </ScrollView>

        {isVoting && role === 'voter' ? (
          <View style={styles.votingContainer}>
            <Text style={styles.votingTitle}>Cast Your Vote</Text>
            <View style={styles.votingButtons}>
              <Pressable
                style={[styles.voteButton, { backgroundColor: '#3b82f6' }]}
                onPress={() => setIsVoting(false)}>
                <Text style={styles.voteButtonText}>Support Pro</Text>
              </Pressable>
              <Pressable
                style={[styles.voteButton, { backgroundColor: '#ef4444' }]}
                onPress={() => setIsVoting(false)}>
                <Text style={styles.voteButtonText}>Support Con</Text>
              </Pressable>
            </View>
          </View>
        ) : role !== 'voter' ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type your argument..."
              placeholderTextColor="#64748b"
              multiline
            />
            <Pressable
              style={[styles.sendButton, { opacity: message.trim() ? 1 : 0.5 }]}
              onPress={sendMessage}
              disabled={!message.trim()}>
              <Send size={24} color="#fff" />
            </Pressable>
          </View>
        ) : (
          <View style={styles.voterPrompt}>
            <AlertCircle size={20} color="#64748b" />
            <Text style={styles.voterPromptText}>
              Listen carefully to both sides. Voting begins soon.
            </Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  roleBar: {
    padding: 12,
    alignItems: 'center',
  },
  roleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  roleDescription: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 2,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 120,
    height: 120,
    backgroundColor: '#64748b',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '700',
  },
  loadingText: {
    marginTop: 24,
    fontSize: 18,
    color: '#64748b',
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 16,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    marginHorizontal: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    backgroundColor: '#3b82f6',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  votingContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  votingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  votingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  voteButton: {
    flex: 1,
    marginHorizontal: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  voteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  voterPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  voterPromptText: {
    marginLeft: 8,
    color: '#64748b',
    fontSize: 14,
  },
});