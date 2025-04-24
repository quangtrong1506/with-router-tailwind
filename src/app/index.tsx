import React, { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { getFcmToken, requestAndroidNotificationPermission, sendWindowNotification } from '@/helpers';

export default function App() {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const firstHandle = async () => {
            requestAndroidNotificationPermission().then((granted) => {
                if (!granted) sendWindowNotification('❌ Từ chối quyền thông báo Android');
            });
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;
            if (!enabled) {
                sendWindowNotification('Chưa cấp quyền thông báo, Không thể nhận thông báo nền');
            }
            sendWindowNotification('Đã cấp quyền thông báo');
        };

        firstHandle();
    }, []);
    useEffect(() => {
        sendWindowNotification('Get Token');

        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            sendWindowNotification('⚠️ Đang foreground, bỏ qua notification: ' + remoteMessage);
        });

        return unsubscribe;
    }, []);
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Push Notifications Demo</Text>
            <View
                className="bg-blue-500 p-2"
                onTouchStart={() => {
                    getFcmToken()
                        .then((tk) => {
                            setToken(tk);
                            sendWindowNotification('Token: ' + tk);
                        })
                        .catch((e) => {
                            sendWindowNotification(e);
                        });
                }}
            >
                <Text>Getken</Text>
            </View>
            {token && <Text>Your FCM Token:</Text>}
            {token && <TextInput value={token} />}
        </View>
    );
}
