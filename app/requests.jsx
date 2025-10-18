import Alert from "@/components/Alert";
import RequestCard from "@/components/RequestCard";
import RequestMedal from "@/components/RequestModal";
import Switch from "@/components/Switch";
import UserMedal from "@/components/UserMedal";
import { ThemeContext } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function Request() {
  const { user, updateUser } = useUser();
  const [online, setOnline] = useState(user?.isAvailable);
  const [showMedal, setShowMedal] = useState(false);
  const [showUserMedal, setShowUserMedal] = useState(false);
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const [token, setToken] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem("userToken");
      if (!storedToken) {
        router.replace("/login");
      } else {
        setToken(storedToken.trim());
      }
    };
    checkToken();
  }, [token, router]);

  return (
    <View style={styles.safeArea}>
      <View style={{ backgroundColor: "#Bde3e4" }}>
        <View style={styles.topStyle}>
          <View style={styles.topElements}>
            <TouchableOpacity
              style={styles.topButton}
              onPress={() => router.back()}
            >
              <FontAwesome name="sliders" size={25} color="rgba(0,0,0,1" />
            </TouchableOpacity>
            <View style={styles.toggleOnline}>
              <Switch
                state={online}
                toggleState={(value) => {
                  console.log(value);
                  axios({
                    method: "put",
                    url: `${apiUrl}/user/availability`,
                    data: value,
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                  })
                    .then((res) => {
                      setOnline(res.data.isAvailable);
                    })
                    .catch((err) => {
                      if (err.response && err.response.data) {
                        Alert(
                          "Error",
                          err.response.data?.message ||
                            JSON.stringify(err.response.data)
                        );
                      } else if (err.request) {
                        Alert(
                          "Network Error",
                          "Unable to reach the server. Please check your connection."
                        );
                      } else {
                        Alert(
                          "Error",
                          "Something went wrong. Please try again later."
                        );
                      }
                    });
                }}
              />
            </View>
            <TouchableOpacity
              style={styles.topButton}
              onPress={() => setShowUserMedal(true)}
            >
              <MaterialIcons name="settings" size={25} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.container}>
          <RequestCard onPress={() => setShowMedal(!showMedal)} />
        </View>
      </View>
      <RequestMedal show={showMedal} setShow={setShowMedal} />
      <UserMedal show={showUserMedal} setShow={setShowUserMedal} />
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </View>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#Bde3e4",
  },
  topStyle: {
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    height: 100,
    backgroundColor: "#Bde3e4",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 8,
  },
  topButton: {
    width: 25,
    height: 25,
  },
  topElements: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 15,
    alignContent: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  toggleOnline: {
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    padding: 15,
  },
});
