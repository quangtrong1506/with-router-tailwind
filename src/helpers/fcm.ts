import messaging from '@react-native-firebase/messaging'

/**
 * Lấy FCM token để dùng gửi push từ server
 */
export async function getFcmToken(): Promise<string | null> {
  const authStatus = await messaging().requestPermission()
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL

  if (!enabled) return null

  const token = await messaging().getToken()
  return token
}
