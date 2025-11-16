import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { Trophy, Medal, TrendingUp } from 'lucide-react-native';

type LeaderboardUser = {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  points: number;
  winRate: number;
  debatesWon: number;
};

const MOCK_USERS: LeaderboardUser[] = [
  {
    id: '1',
    rank: 1,
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    points: 2840,
    winRate: 76,
    debatesWon: 38,
  },
  {
    id: '2',
    rank: 2,
    name: 'Michael Park',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    points: 2650,
    winRate: 72,
    debatesWon: 36,
  },
  {
    id: '3',
    rank: 3,
    name: 'Emma Wilson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
    points: 2450,
    winRate: 70,
    debatesWon: 35,
  },
];

export default function LeaderboardScreen() {
  const renderLeaderboardItem = ({ item: user }: { item: LeaderboardUser }) => (
    <Pressable style={styles.userCard}>
      <View style={styles.rankContainer}>
        {user.rank === 1 ? (
          <Trophy size={24} color="#FFD700" />
        ) : user.rank === 2 ? (
          <Medal size={24} color="#C0C0C0" />
        ) : user.rank === 3 ? (
          <Medal size={24} color="#CD7F32" />
        ) : (
          <Text style={styles.rankText}>{user.rank}</Text>
        )}
      </View>

      <Image source={{ uri: user.avatar }} style={styles.avatar} />

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <TrendingUp size={16} color="#64748b" />
            <Text style={styles.statText}>{user.winRate}% Win Rate</Text>
          </View>
          <Text style={styles.statDivider}>•</Text>
          <Text style={styles.statText}>{user.debatesWon} Wins</Text>
        </View>
      </View>

      <View style={styles.pointsContainer}>
        <Text style={styles.points}>{user.points}</Text>
        <Text style={styles.pointsLabel}>PTS</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Top debaters this month</Text>
      </View>

      <FlatList
        data={MOCK_USERS}
        renderItem={renderLeaderboardItem}
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  rankContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#64748b',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  statDivider: {
    marginHorizontal: 8,
    color: '#64748b',
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  points: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3b82f6',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#64748b',
  },
});