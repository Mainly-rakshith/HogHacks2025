import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ImageBackground } from 'react-native';
import { Link } from 'expo-router';
import { Users } from 'lucide-react-native';

type Debate = {
  id: string;
  topic: string;
  description: string;
  startTime: Date;
  backgroundImage: string;
  participants: {
    pro: number;
    con: number;
    voters: number;
  };
};

const MOCK_DEBATES: Debate[] = [
  {
    id: '1',
    topic: 'Should Universal Basic Income Be Implemented?',
    description: 'Discuss the economic and social impacts of UBI',
    backgroundImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop',
    startTime: new Date(Date.now() + 1000 * 60 * 5),
    participants: { pro: 2, con: 1, voters: 3 },
  },
  {
    id: '2',
    topic: 'Is Nuclear Energy the Future of Clean Power?',
    description: 'Explore the role of nuclear in climate change',
    backgroundImage: 'https://images.unsplash.com/photo-1576344444819-f7da5b2cd290?q=80&w=2071&auto=format&fit=crop',
    startTime: new Date(Date.now() + 1000 * 60 * 10),
    participants: { pro: 3, con: 3, voters: 4 },
  },
  {
    id: '3',
    topic: 'Should Remote Work Become the New Standard?',
    description: 'Examining the future of work post-pandemic',
    backgroundImage: 'https://images.unsplash.com/photo-1585859188943-1ee2d424d13c?q=80&w=2070&auto=format&fit=crop',
    startTime: new Date(Date.now() + 1000 * 60 * 15),
    participants: { pro: 1, con: 2, voters: 2 },
  },
  {
    id: '4',
    topic: 'Will AI Transform Healthcare for the Better?',
    description: 'Debating AI\'s role in medical advancement',
    backgroundImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop',
    startTime: new Date(Date.now() + 1000 * 60 * 20),
    participants: { pro: 2, con: 2, voters: 3 },
  },
];

export default function DebatesScreen() {
  const [debates] = useState<Debate[]>(MOCK_DEBATES);

  const renderDebate = useCallback(({ item: debate }: { item: Debate }) => {
    const totalParticipants = 
      debate.participants.pro + 
      debate.participants.con + 
      debate.participants.voters;
    const spotsLeft = 11 - totalParticipants;
    const timeUntilStart = Math.max(0, 
      Math.floor((debate.startTime.getTime() - Date.now()) / (1000 * 60))
    );

    return (
      <Link href={`/debate/${debate.id}`} asChild>
        <Pressable style={styles.debateCard}>
          <ImageBackground
            source={{ uri: debate.backgroundImage }}
            style={styles.backgroundImage}
            imageStyle={styles.backgroundImageStyle}>
            <View style={styles.overlay}>
              <View style={styles.debateHeader}>
                <View style={styles.topicContainer}>
                  <Text style={styles.topic} numberOfLines={2}>
                    {debate.topic}
                  </Text>
                  <Text style={styles.description} numberOfLines={1}>
                    {debate.description}
                  </Text>
                </View>
                <Text style={styles.timer}>
                  Starts in {timeUntilStart} min
                </Text>
              </View>

              <View style={styles.participantsContainer}>
                <View style={styles.participantGroup}>
                  <Users size={20} color="#fff" />
                  <Text style={styles.participantLabel}>Pro: {debate.participants.pro}/3</Text>
                </View>
                <View style={styles.participantGroup}>
                  <Users size={20} color="#fff" />
                  <Text style={styles.participantLabel}>Con: {debate.participants.con}/3</Text>
                </View>
                <View style={styles.participantGroup}>
                  <Users size={20} color="#fff" />
                  <Text style={styles.participantLabel}>Voters: {debate.participants.voters}/5</Text>
                </View>
              </View>

              {spotsLeft > 0 && (
                <View style={styles.spotsContainer}>
                  <Text style={styles.spotsText}>
                    {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
                  </Text>
                </View>
              )}
            </View>
          </ImageBackground>
        </Pressable>
      </Link>
    );
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Active Debates</Text>
        <Text style={styles.subtitle}>
          Join a debate and make your voice heard
        </Text>
      </View>

      <FlatList
        data={debates}
        renderItem={renderDebate}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  list: {
    padding: 16,
  },
  debateCard: {
    height: 220,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backgroundImageStyle: {
    borderRadius: 16,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  debateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  topicContainer: {
    flex: 1,
    marginRight: 12,
  },
  topic: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: '#e2e8f0',
    marginTop: 4,
  },
  timer: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  participantsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  participantGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  participantLabel: {
    marginLeft: 6,
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  spotsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  spotsText: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
  },
});