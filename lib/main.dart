import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:political_fitness_debate/screens/home_screen.dart';
import 'package:political_fitness_debate/providers/auth_provider.dart';
import 'package:political_fitness_debate/providers/debate_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => DebateProvider()),
      ],
      child: MaterialApp(
        title: 'Political Fitness Debate',
        theme: ThemeData(
          primaryColor: Colors.blue,
          colorScheme: ColorScheme.fromSeed(
            seedColor: Colors.blue,
            secondary: Colors.red,
          ),
          useMaterial3: true,
          fontFamily: 'Inter',
        ),
        home: const HomeScreen(),
      ),
    );
  }
}