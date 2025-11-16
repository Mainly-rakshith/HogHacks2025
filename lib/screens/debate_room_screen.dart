import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:math' as math;
import 'package:political_fitness_debate/models/debate.dart';
import 'package:political_fitness_debate/providers/debate_provider.dart';
import 'package:political_fitness_debate/widgets/role_assignment_animation.dart';
import 'package:political_fitness_debate/widgets/debate_chat.dart';
import 'package:political_fitness_debate/widgets/voting_panel.dart';
import 'package:political_fitness_debate/widgets/fitness_intervention.dart';

class DebateRoomScreen extends StatefulWidget {
  final String debateId;

  const DebateRoomScreen({
    super.key,
    required this.debateId,
  });

  @override
  State<DebateRoomScreen> createState() => _DebateRoomScreenState();
}

class _DebateRoomScreenState extends State<DebateRoomScreen> {
  bool _showRoleAnimation = true;
  DebateRole? _assignedRole;
  bool _showFitnessIntervention = false;

  @override
  void initState() {
    super.initState();
    _assignRole();
  }

  void _assignRole() {
    // Simulate role assignment
    final random = math.Random();
    final roles = [DebateRole.pro, DebateRole.con, DebateRole.voter];
    _assignedRole = roles[random.nextInt(roles.length)];

    // Hide animation after 3 seconds
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        setState(() {
          _showRoleAnimation = false;
        });
      }
    });
  }

  void _checkStressLevel(String message) {
    // Simple stress detection based on message content
    final stressIndicators = ['!!!', '???', 'NEVER', 'ALWAYS', 'WRONG'];
    final hasStressIndicators = stressIndicators.any(
      (indicator) => message.toUpperCase().contains(indicator),
    );

    if (hasStressIndicators && mounted) {
  setState(() {
    _showFitnessIntervention = true;
  });
}

  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Debate Room'),
        centerTitle: true,
      ),
      body: Consumer<DebateProvider>(
        builder: (context, debateProvider, child) {
          final debate = debateProvider.getDebateById(widget.debateId);
          
          if (_showRoleAnimation && _assignedRole != null) {
            return RoleAssignmentAnimation(role: _assignedRole!);
          }

          if (_showFitnessIntervention) {
            return FitnessIntervention(
              onComplete: () {
                setState(() {
                  _showFitnessIntervention = false;
                });
              },
            );
          }

          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  debate.topic,
                  style: Theme.of(context).textTheme.headlineSmall,
                  textAlign: TextAlign.center,
                ),
              ),
              Expanded(
                child: DebateChat(
                  debate: debate,
                  userRole: _assignedRole!,
                  onMessageSent: _checkStressLevel,
                ),
              ),
              if (debate.isVotingPhase && _assignedRole == DebateRole.voter)
                VotingPanel(debate: debate),
            ],
          );
        },
      ),
    );
  }
}