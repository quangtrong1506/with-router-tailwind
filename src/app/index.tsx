import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { sendWindowNotification } from '@/helpers';

export default function App() {
  const [notification, setNotification] = useState<any>(false);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    // Yêu cầu quyền nhận thông báo
    const getPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        const token = await Notifications.getExpoPushTokenAsync();
        setExpoPushToken(token.data);
        sendWindowNotification(token.data);
      }
    };

    getPermissions();

    // Đăng ký listener khi app đang mở
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    return () => {
      // Cleanup listener khi component bị unmount
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>🎯 Expo Push Notifications Demo</Text>
      {expoPushToken && <Text>Your Expo Push Token: {expoPushToken}</Text>}
      {notification && <Text>Notification: {notification.request.content.body}</Text>}
    </View>
  );
}
