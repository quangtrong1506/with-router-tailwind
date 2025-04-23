import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';

/**
 * Màn hình gửi thông báo FCM đến thiết bị khác
 */
export default function AdminsScreen() {
  const [deviceToken, setDeviceToken] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  async function sendNotification() {
    if (!deviceToken || !title || !body) return Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');

    try {
      const res = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'key=SERVER_KEY_CUA_BAN', // KHÔNG để key thật trong prod
        },
        body: JSON.stringify({
          to: deviceToken,
          notification: {
            title,
            body,
          },
          priority: 'high',
        }),
      });

      const result = await res.json();
      console.log('📨 Kết quả gửi:', result);
      Alert.alert('Thành công', 'Đã gửi thông báo 🎉');
    } catch (err) {
      console.error('❌ Lỗi gửi:', err);
      Alert.alert('Lỗi', 'Không thể gửi thông báo');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Token thiết bị nhận:</Text>
      <TextInput style={styles.input} value={deviceToken} onChangeText={setDeviceToken} placeholder="Nhập token" />

      <Text style={styles.label}>Tiêu đề:</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Tiêu đề thông báo" />

      <Text style={styles.label}>Nội dung:</Text>
      <TextInput style={styles.input} value={body} onChangeText={setBody} placeholder="Nội dung thông báo" />

      <Button title="📤 Gửi thông báo" onPress={sendNotification} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  label: { marginTop: 10, marginBottom: 4, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
});
