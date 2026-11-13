import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure Notification Behavior safely
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request Permissions & Set Channel SAFELY
export async function registerForPushNotificationsAsync(): Promise<boolean> {
  try {
    // 1. Pehle Permission Check/Request karein
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    // 2. Permission grant hone ke BAAD Android Channel create karein
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('train-alerts', {
        name: 'Train Alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#0052cc',
        enableVibrate: true,
        showBadge: true,
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

// Trigger Notification safely
export async function sendTrainNotification(trainName: string, trainNumber: string, platform: string = '3') {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🚄 ${trainName} (${trainNumber})`,
        body: `Your high-speed bullet train is scheduled on Platform ${platform}. Get ready for departure!`,
        data: { trainNumber, platform },
      },
      trigger: null, // Immediate trigger
    });
  } catch (error) {
    console.error('Error scheduling train notification:', error);
  }
}