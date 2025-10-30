import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotifications() {
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        console.log("Notification received:", notification);
      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((res) => {
        console.log("User tapped notification:", res);
      });
    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);
  return notification;
}
