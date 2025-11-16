import 'package:flutter/material.dart';

enum DebateRole {
  pro,
  con,
  voter
}

class Debate {
  final String id;
  final String topic;
  final DateTime startTime;
  final List<String> proDebaters;
  final List<String> conDebaters;
  final List<String> voters;
  final List<Message> messages;
  bool isVotingPhase;
  Map<String, bool> votes; // true for pro, false for con

  Debate({
    required this.id,
    required this.topic,
    required this.startTime,
    this.proDebaters = const [],
    this.conDebaters = const [],
    this.voters = const [],
    this.messages = const [],
    this.isVotingPhase = false,
    this.votes = const {},
  });

  bool get isFull => proDebaters.length >= 3 && conDebaters.length >= 3 && voters.length >= 5;
  int get totalVotes => votes.length;
  bool get isProWinning => votes.values.where((v) => v).length > votes.values.where((v) => !v).length;
  int get pointsPerWinner {
    final voterCount = votes.length;
    if (voterCount >= 5) return 200;
    if (voterCount >= 4) return 160;
    if (voterCount >= 3) return 120;
    return 0;
  }
}

class Message {
  final String id;
  final String content;
  final DebateRole senderRole;
  final DateTime timestamp;

  Message({
    required this.id,
    required this.content,
    required this.senderRole,
    required this.timestamp,
  });
}