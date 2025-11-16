import 'package:flutter/material.dart';

class FitnessIntervention extends StatelessWidget {
  const FitnessIntervention({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white.withOpacity(0.95),
      padding: const EdgeInsets.all(32),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.self_improvement, size: 64, color: Colors.blue),
            const SizedBox(height: 24),
            const Text(
              'Pause and Breathe...',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            const Text(
              'You seem stressed. Let’s take a quick 5-minute break.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }
}
