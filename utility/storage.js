import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const isWeb = Platform.OS === "web";

export const setToken = async (token) => {
  if (isWeb) {
    await AsyncStorage.setItem("userToken", token);
  } else {
    await SecureStore.setItemAsync("userToken", token);
  }
};
export const getToken = async () => {
  if (isWeb) {
    return await AsyncStorage.getItem("userToken");
  } else {
    return await SecureStore.getItemAsync("userToken");
  }
};

export const removeToken = async () => {
  if (isWeb) {
    return await AsyncStorage.removeItem("userToken");
  } else {
    return await SecureStore.deleteItemAsync("userToken");
  }
};
