import { RequestsHubProvider } from "@/context/RequestsHubContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { TokenProvider, useToken } from "@/context/TokenContext";
import { UserProvider } from "@/context/UserContext";
import { useNotifications } from "@/hooks/useNotifications";
import {
  Cairo_200ExtraLight,
  Cairo_300Light,
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold,
  useFonts,
} from "@expo-google-fonts/cairo";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Toast from "react-native-toast-message";
SplashScreen.preventAutoHideAsync();

function AppProviders() {
  const { token, loading } = useToken();
  useNotifications();
  const [loaded, error] = useFonts({
    Cairo_200ExtraLight,
    Cairo_300Light,
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if ((!loaded && !error) || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00aaff" />
      </View>
    );
  }

  return (
    <RequestsHubProvider token={token}>
      <UserProvider>
        <ThemeProvider>
          <SafeAreaProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "fade_from_bottom",
                contentStyle: { backgroundColor: "#Bde3e4" },
              }}
            >
              <Stack.Screen name="intro" />
              <Stack.Screen name="login" />
              <Stack.Screen name="register" />
              <Stack.Screen name="index" />
              <Stack.Screen name="search" />
              <Stack.Screen name="requestWorker/[id]" />
              <Stack.Screen name="chat/[id]" />
              <Stack.Screen name="workerRequests" />
              <Stack.Screen name="chatHelp" />
              <Stack.Screen name="notifications" />
            </Stack>
            <Toast />
          </SafeAreaProvider>
        </ThemeProvider>
      </UserProvider>
    </RequestsHubProvider>
  );
}

export default function RootLayout() {
  return (
    <TokenProvider>
      <AppProviders />
    </TokenProvider>
  );
}
