import NotificationCard from "@/components/NotificationCard";
import { ThemeContext } from "@/context/ThemeContext";
import { useToken } from "@/context/TokenContext";
import { useUser } from "@/context/UserContext";
import { useApi } from "@/hooks/useApi";
import { fonts } from "@/theme/fonts";
import { centerContainer } from "@/theme/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Toast from "react-native-toast-message";

export default function Notifications() {
  const { user } = useUser();
  const { token, setToken } = useToken();
  const { colorScheme } = useContext(ThemeContext);
  const api = useApi();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        Toast.show({
          type: "error",
          text1: "انتهت الجلسة",
          text2: "يجب تسجيل الدخول مرة أخرى لأن الجلسة انتهت.",
        });
        router.replace("/login");
        return;
      }
      const trimmedToken = token.trim();
      if (token !== trimmedToken) {
        setToken(trimmedToken);
      }
    };

    checkToken();
  }, [router, token, setToken]);
  useEffect(() => {
    if (!token || !user?.id) return;
    const fetchRequests = async () => {
      setLoading(true);
      api
        .get("/api/notifications/")
        .then((res) => setNotifications(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    };
    fetchRequests();
  }, [token, user?.id, user?.role]);

  const renderItems = useCallback(({ item }) => {
    return (
      <NotificationCard
        key={item.id}
        title={item.title}
        body={item.body}
        dateTime={item.receivedAt || item.dateTime}
        type={item.type || "alert"}
      />
    );
  }, []);

  return (
    <View style={styles.safeArea}>
      <View style={styles.topStyle}>
        <View style={styles.topElement}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons
              name="arrow-back-ios"
              size={20}
              color="rgba(0,0,0,1)"
            />
          </TouchableOpacity>
          <Text style={styles.topText}>الاشعارات</Text>
        </View>
      </View>
      {loading ? (
        <View style={centerContainer}>
          <ActivityIndicator />
        </View>
      ) : notifications.length ? (
        <FlatList
          style={styles.container}
          data={notifications}
          renderItem={renderItems}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          windowSize={5}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={100}
        />
      ) : (
        <View style={centerContainer}>
          <Text style={{ fontFamily: fonts.light }}>
            لا توجد اشعارات في الوقت الحالي
          </Text>
        </View>
      )}
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </View>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topStyle: {
    backgroundColor: "rgba(127, 186, 78, 1)",
    height: 100,
    borderTopWidth: 1,
  },
  topElement: {
    flexDirection: "row-reverse",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  topText: {
    marginRight: 20,
    fontSize: 24,
    fontFamily: fonts.light,
  },
  backButton: {
    position: "absolute",
    left: 15,
  },

  container: {
    padding: 15,
  },
});
