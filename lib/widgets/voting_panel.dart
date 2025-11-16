import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:political_fitness_debate/models/debate.dart';
import 'package:political_fitness_debate/providers/debate_provider.dart';

class VotingPanel extends StatelessWidget {
  final Debate debate;

  const VotingPanel({
    super.key,
    required this.debate,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[100],
        border: Border(
          top: BorderSide(
            color: Colors.grey[300]!,
          ),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            'Cast Your Vote',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    Provider.of<DebateProvider>(context, listen: false)
                        .castVote(debate.id, true);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: const Text('Support (Pro)'),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    Provider.of<DebateProvider>(context, listen: false)
                        .castVote(debate.id, false);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: const Text('Against (Con)'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}