import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { sendWindowNotification } from '@/helpers';
import { Link } from 'expo-router';

export default function App() {
  const [notification, setNotification] = useState<any>(null);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    // Yêu cầu quyền nhận thông báo
    const getPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        // Nếu được cấp quyền, lấy Expo Push Token
        const token = await Notifications.getExpoPushTokenAsync();
        setExpoPushToken(token.data); // Lưu token vào state
        sendWindowNotification(token.data); // Gửi token đến nơi bạn cần sử dụng (server, database,...)
      } else {
        sendWindowNotification('Permission not granted for push notifications');
      }
    };

    getPermissions();

    // Đăng ký listener khi app đang mở
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification); // Cập nhật notification vào state khi nhận được thông báo
    });

    // Đăng ký listener khi người dùng tương tác với thông báo
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      sendWindowNotification('User interacted with notification:' + response);
    });

    // Cleanup listener khi component bị unmount
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>🎯 Expo Push Notifications Demo</Text>
      {expoPushToken && <Text>Your Expo Push Token: {expoPushToken}</Text>}
      {notification && <Text>Notification: {notification.request.content.body}</Text>}
      <Link className="mt-6 inline-block p-3 bg-blue-200" href={'/admin'}>
        Admin
      </Link>
    </View>
  );
}
