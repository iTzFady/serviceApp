import RequestCard from "@/components/RequestCard";
import RequestMedal from "@/components/RequestModal";
import Switch from "@/components/Switch";
import UserMedal from "@/components/UserMedal";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
export default function Request() {
  const [online, setOnline] = useState(true);
  const [showMedal, setShowMedal] = useState(false);
  const [showUserMedal, setShowUserMedal] = useState(false);
  const router = useRouter();
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
              <Switch state={online} toggleState={setOnline} />
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
