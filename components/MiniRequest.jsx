import { fonts } from "@/theme/fonts";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const defaultProfilePic = require("@/assets/images/default-profile.png");
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function MiniRequest({
  name,
  profilePicUrl,
  rating,
  status,
  phoneNumber,
}) {
  const openDialer = () => {
    Linking.canOpenURL(`tel:${phoneNumber}`).then((supported) => {
      if (supported) {
        Linking.openURL(`tel:${phoneNumber}`);
      } else {
        console.log("Dialer not supported on this device");
      }
    });
  };
  const openMessenger = () => {
    Linking.canOpenURL(`sms:${phoneNumber}`).then((supported) => {
      if (supported) {
        Linking.openURL(`sms:${phoneNumber}`);
      } else {
        console.log("Messenger not supported on this device");
      }
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.requestInfo}>
        <View style={styles.clientDetails}>
          <Image
            style={styles.profilePicStyle}
            source={
              profilePicUrl
                ? { uri: `${apiUrl}${profilePicUrl}` }
                : defaultProfilePic
            }
          />
          <Text style={styles.userDetailText}>{name}</Text>

          <View style={styles.ratingContainer}>
            <MaterialCommunityIcons
              name="star"
              size={18}
              color="rgba(237, 237, 14, 0.81)"
            />
            <Text style={[styles.userDetailText, { fontSize: 10 }]}>
              {rating}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={[
          styles.requestStatus,
          styles.requestInfo,
          { width: "45%", paddingVertical: 7, justifyContent: "space-between" },
          status === "Accepted"
            ? { backgroundColor: "#fff" }
            : { backgroundColor: "rgba(127, 186, 78, 0.61)" },
        ]}
      >
        <Text
          style={[
            status !== "Accepted"
              ? {
                  fontFamily: fonts.regular,
                  fontSize: 10,
                  color: "#000",
                  marginHorizontal: "auto",
                }
              : {
                  fontFamily: fonts.bold,
                  fontSize: 13,
                  color: "rgba(50, 103, 6, 1)",
                },
          ]}
        >
          {status === "Accepted" ? "تم القبول" : "في انتظار القبول...."}
        </Text>
        {status === "Accepted" ? (
          <>
            <TouchableOpacity onPress={openMessenger}>
              <MaterialCommunityIcons
                name="message-reply-text"
                size={18}
                color="rgba(127, 186, 78, 1)"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={openDialer}>
              <View
                style={{
                  position: "relative",
                  width: 18,
                  height: 18,
                  marginRight: 10,
                }}
              >
                <MaterialCommunityIcons
                  name="phone"
                  size={18}
                  color="limegreen"
                  style={{ position: "absolute" }}
                />
                <MaterialCommunityIcons
                  name="phone-outline"
                  size={18}
                  color="black"
                  style={{ position: "absolute" }}
                />
              </View>
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    width: "100%",
    gap: 5,
    marginTop: 10,
  },
  clientDetails: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  profilePicStyle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  requestInfo: {
    backgroundColor: "white",
    width: "55%",
    height: 35,
    justifyContent: "center",
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  requestStatus: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  userDetailText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    marginHorizontal: "auto",
  },
  ratingContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },
  ratingText: {
    fontFamily: fonts.light,
    fontSize: 10,
  },
});
