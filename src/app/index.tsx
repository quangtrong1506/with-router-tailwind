import React, { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import messaging from '@react-native-firebase/messaging'
import { getFcmToken, sendWindowNotification } from '@/helpers';
import { Link } from 'expo-router';

export default function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
     getFcmToken().then(tk=>{
       setToken(tk)

     }).catch(e=>{
      sendWindowNotification(e)
     })
    // Không xử lý khi app đang foreground để tránh trùng socket
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      sendWindowNotification('⚠️ Đang foreground, bỏ qua notification: '+ remoteMessage)
    })

    return unsubscribe
  }, [])



  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>🎯 Expo Push Notifications Demo</Text>
      {token && <Text>Your Expo Push Token:</Text>}
      {token&&<TextInput value={token}/>}
      <Link className="mt-6 inline-block p-3 bg-blue-200" href={'/admin'}>
        Admin
      </Link>
    </View>
  );
}
