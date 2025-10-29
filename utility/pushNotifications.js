import axios from "axios";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
export async function registerForPushNotificationsAsync(apiUrl, token) {
  if (Platform.OS === "web") {
    return null;
  }
  if (!Device.isDevice) {
    console.warn("Push notifications require a physical device");
    return null;
  }
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.warn("Failed to get push token for push notification!");
    return null;
  }

  const expoToken = (
    await Notifications.getExpoPushTokenAsync({
      projectId:
        Constants.expoConfig.extra?.eas?.projectId ??
        Constants.easConfig?.projectId ??
        Constants.expoConfig?.extra?.projectId,
    })
  ).data;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      sound: "default",
    });
  }
  try {
    await axios({
      method: "post",
      url: `${apiUrl}/api/user/pushToken`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { token: expoToken },
    });
  } catch (err) {
    console.log(err);
  }
  return expoToken;
}
