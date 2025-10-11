import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: "#Bde3e4" },
        }}
      >
        {/* <Stack.Screen name="index" /> */}
        <Stack.Screen name="login" />
        {/* <Stack.Screen name="intro" /> */}
        {/* <Stack.Screen name="register" /> */}
      </Stack>
    </SafeAreaProvider>
  );
}
