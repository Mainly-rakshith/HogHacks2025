import 'package:flutter/material.dart';
import 'package:political_fitness_debate/models/debate.dart';
import 'package:political_fitness_debate/widgets/debate_card.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class DebatesScreen extends StatefulWidget {
  const DebatesScreen({super.key});

  @override
  State<DebatesScreen> createState() => _DebatesScreenState();
}

class _DebatesScreenState extends State<DebatesScreen> {
  List<Debate> _debates = [];
  bool _loading = true;
  String? _error;

  final supabase = Supabase.instance.client;

  @override
  void initState() {
    super.initState();
    fetchDebates();
  }

  Future<void> fetchDebates() async {
    try {
      final user = supabase.auth.currentUser;

      if (user == null) {
        setState(() {
          _error = 'User not logged in.';
          _loading = false;
        });
        return;
      }

      final profile = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

      if (profile == null) {
        setState(() {
          _error = 'No user profile found for this user.';
          _loading = false;
        });
        return;
      }

      final data = await supabase
          .from('debates')
          .select('*')
          .eq('participant_id', user.id); // Or use appropriate filter

      setState(() {
        _debates = List<Map<String, dynamic>>.from(data)
            .map((json) => Debate.fromJson(json))
            .toList();
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Error fetching debates: $e';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Center(child: CircularProgressIndicator());
    if (_error != null) return Center(child: Text(_error!));

    return ListView.builder(
      itemCount: _debates.length,
      itemBuilder: (_, index) => DebateCard(debate: _debates[index]),
    );
  }
}

