/**
 * Gửi thông báo đến Android (qua AndroidInterface) hoặc iOS (qua WebKit handler hoặc alert fallback).
 * @param message Chuỗi thông báo cần hiển thị
 */
export function sendWindowNotification(message: string) {
  // Android WebView
  if ((window as any).AndroidInterface?.showToast) {
    (window as any).AndroidInterface.showToast(message);
    return;
  }

  // iOS WebView: dùng message handler nếu được inject
  const webkitHandler = (window as any).webkit?.messageHandlers?.iOSInterface;
  if (webkitHandler?.postMessage) {
    webkitHandler.postMessage({ type: 'toast', message });
    return;
  }

  // Trình duyệt có hỗ trợ Notification
  if ('Notification' in window) {
    if (Notification.permission === 'granted') new Notification(message);
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') new Notification(message);
      });
    }
    return;
  }
  (window as any).AndroidInterface?.showToast(message);

  alert(message);
}
