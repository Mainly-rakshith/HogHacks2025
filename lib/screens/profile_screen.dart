import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:political_fitness_debate/providers/auth_provider.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.user;

    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: user == null
          ? const Center(child: Text('No user logged in'))
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Username: ${user.username}"),
                  Text("Email: ${user.email}"),
                  Text("Points: ${user.points}"),
                ],
              ),
            ),
    );
  }
}
