import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:political_fitness_debate/models/debate.dart';
import 'package:political_fitness_debate/widgets/fitness_intervention.dart';

class DebateChat extends StatefulWidget {
  final Debate debate;
  final DebateRole userRole;
  final Function(String) onMessageSent;

  const DebateChat({
    super.key,
    required this.debate,
    required this.userRole,
    required this.onMessageSent,
  });

  @override
  State<DebateChat> createState() => _DebateChatState();
}

class _DebateChatState extends State<DebateChat> {
  final TextEditingController _controller = TextEditingController();
  bool _showFitness = false;

  Future<bool> isStressful(String message) async {
    try {
      final response = await http.post(
Uri.parse("https://supabase.com/dashboard/project/spdqvrveezthpyeamtgp/functions"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"message": message}),
      );

      if (response.statusCode == 200) {
        final result = jsonDecode(response.body);
        return result["isAppropriate"] == false;
      }
    } catch (e) {
      print("Moderation error: $e");
    }
    return false;
  }

  void _sendMessage() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    final stressed = await isStressful(text);
    if (stressed) {
      setState(() => _showFitness = true);

      Future.delayed(const Duration(minutes: 5), () {
        if (mounted) {
          setState(() => _showFitness = false);
        }
      });
    }

    widget.onMessageSent(text);
    _controller.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Column(
          children: [
            Expanded(child: Container()), // Placeholder for chat messages
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: TextField(
                controller: _controller,
                decoration: const InputDecoration(
                  hintText: 'Type your message...',
                ),
                onSubmitted: (_) => _sendMessage(),
              ),
            ),
          ],
        ),
        if (_showFitness)
          const Positioned.fill(child: FitnessIntervention()),
      ],
    );
  }
}
