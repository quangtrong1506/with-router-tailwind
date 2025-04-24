import React, { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { getFcmToken, sendWindowNotification } from '@/helpers';

export default function App() {
    const [token, setToken] = useState<string | null>(null);
    const [loaded, setLoaded] = useState<Boolean>(false);

    useEffect(() => {
        const firstHandle = async () => {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;
            if (!enabled) {
                sendWindowNotification('Chưa cấp quyền thông báo, Không thể nhận thông báo nền');
                throw new Error('Chưa cấp quyền thông báo');
            }
            setLoaded(true);
        };

        firstHandle();
    }, []);
    useEffect(() => {
        if (!loaded) return;
        getFcmToken()
            .then((tk) => {
                setToken(tk);
            })
            .catch((e) => {
                sendWindowNotification(e);
            });

        // Không xử lý khi app đang foreground để tránh trùng socket
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            sendWindowNotification('⚠️ Đang foreground, bỏ qua notification: ' + remoteMessage);
        });

        return unsubscribe;
    }, [loaded]);
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>🎯 Expo Push Notifications Demo</Text>
            {token && <Text>Your Expo Push Token:</Text>}
            {token && <TextInput value={token} />}
        </View>
    );
}
