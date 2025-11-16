import 'package:flutter/material.dart';
import 'dart:math' as math;
import 'package:political_fitness_debate/models/debate.dart';

class RoleAssignmentAnimation extends StatefulWidget {
  final DebateRole role;

  const RoleAssignmentAnimation({
    super.key,
    required this.role,
  });

  @override
  State<RoleAssignmentAnimation> createState() => _RoleAssignmentAnimationState();
}

class _RoleAssignmentAnimationState extends State<RoleAssignmentAnimation>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _rotationAnimation;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );

    _rotationAnimation = Tween<double>(
      begin: 0,
      end: 4 * math.pi,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));

    _scaleAnimation = Tween<double>(
      begin: 0.5,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.elasticOut,
    ));

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Color _getRoleColor() {
    switch (widget.role) {
      case DebateRole.pro:
        return Colors.blue;
      case DebateRole.con:
        return Colors.red;
      case DebateRole.voter:
        return Colors.grey;
    }
  }

  String _getRoleText() {
    switch (widget.role) {
      case DebateRole.pro:
        return 'PRO';
      case DebateRole.con:
        return 'CON';
      case DebateRole.voter:
        return 'VOTER';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return Transform.rotate(
            angle: _rotationAnimation.value,
            child: Transform.scale(
              scale: _scaleAnimation.value,
              child: Container(
                width: 200,
                height: 200,
                decoration: BoxDecoration(
                  color: _getRoleColor(),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: _getRoleColor().withOpacity(0.3),
                      blurRadius: 20,
                      spreadRadius: 5,
                    ),
                  ],
                ),
                child: Center(
                  child: Text(
                    _getRoleText(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}