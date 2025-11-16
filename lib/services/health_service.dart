import 'package:health/health.dart';
import 'package:permission_handler/permission_handler.dart';

class HealthService {
  final HealthFactory health = HealthFactory();
  
  Future<bool> requestPermissions() async {
    // Request both health and notification permissions
    final healthPermission = await Permission.activityRecognition.request();
    final notificationPermission = await Permission.notification.request();
    
    return healthPermission.isGranted && notificationPermission.isGranted;
  }

  Future<double?> getHeartRate() async {
    try {
      final now = DateTime.now();
      final before = now.subtract(const Duration(minutes: 5));
      
      final types = [HealthDataType.HEART_RATE];
      final permissions = [HealthDataAccess.READ];
      
      bool authorized = await health.requestAuthorization(types, permissions: permissions);
      
      if (authorized) {
        List<HealthDataPoint> healthData = await health.getHealthDataFromTypes(
          before, 
          now, 
          types,
        );
        
        if (healthData.isNotEmpty) {
          // Get the most recent heart rate reading
          final latestReading = healthData.last;
          return latestReading.value.toDouble();
        }
      }
      
      return null;
    } catch (e) {
      print('Error getting heart rate: $e');
      return null;
    }
  }

  Future<bool> isHeartRateElevated(double restingHeartRate) async {
    final currentHeartRate = await getHeartRate();
    if (currentHeartRate == null) return false;
    
    // Check if heart rate is 30 BPM above resting
    return currentHeartRate > (restingHeartRate + 30);
  }

  Future<void> startHeartRateMonitoring(...) async {
  await Future.doWhile(() async {
    final isElevated = await isHeartRateElevated(restingHeartRate);
    onElevatedHeartRate(isElevated);
    await Future.delayed(const Duration(minutes: 1));
    return true;
  });
}

}