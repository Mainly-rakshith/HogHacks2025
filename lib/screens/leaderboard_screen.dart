import 'package:flutter/material.dart';
import 'package:political_fitness_debate/widgets/leaderboard_item.dart';
import 'package:political_fitness_debate/screens/user_stats_screen.dart';

class LeaderboardScreen extends StatelessWidget {
  const LeaderboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Top Debaters'),
        centerTitle: true,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: 10, // Top 10 users
        itemBuilder: (context, index) {
          return LeaderboardItem(
            rank: index + 1,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => UserStatsScreen(userId: 'user_$index'),
                ),
              );
            },
          );
        },
      ),
    );
  }
}